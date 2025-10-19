import { getLoanDataStats, getLoanStats, getTopBanksInfo, getCompetitiveLandscapeByZip, getCompetitiveLandscapeByState } from '@/lib/supabase/functions'
import { tool as createTool } from 'ai';

import { z } from 'zod';

// Tool execution functions
// These are called from the route handler when the AI invokes tools

export async function executeGetLoanStatistics(params: {
  naicsCodes: number[]
  state?: string
  zipCode?: number
  zipRange: number
}) {
  const [dataStats, loanStats] = await Promise.all([
    getLoanDataStats({
      state: params.state || null,
      zipCode: params.zipCode || null,
      naicsPrefixes: params.naicsCodes,
      zipRange: params.zipRange,
    }),
    getLoanStats({
      state: params.state || null,
      zipCode: params.zipCode || null,
      naicsPrefixes: params.naicsCodes,
      zipRange: params.zipRange,
    })
  ])
  return { dataStats, loanStats }
}

export async function executeGetTopBanks(params: {
  naicsCodes: number[]
  state?: string
  zipCode?: number
  zipRange: number
  topN: number
}) {
  const banks = await getTopBanksInfo({
    state: params.state || null,
    zipCode: params.zipCode || null,
    naicsPrefixes: params.naicsCodes,
    zipRange: params.zipRange,
    topN: params.topN,
  })
  return banks
}

export async function executeGetCompetitiveLandscapeZip(params: {
  zipCode: string
  naicsCode: string
  employeeCount?: number
}) {
  const result = await getCompetitiveLandscapeByZip({
    zipCode: params.zipCode,
    naicsCode: params.naicsCode,
    employeeCount: params.employeeCount || 25
  })
  return result
}

export async function executeGetCompetitiveLandscapeState(params: {
  stateCode: string
  naicsCode: string
  employeeCount?: number
}) {
  const result = await getCompetitiveLandscapeByState({
    stateCode: params.stateCode,
    naicsCode: params.naicsCode,
    employeeCount: params.employeeCount || 25
  })
  return result
}



export const weatherTool = createTool({
    description: 'Display the weather for a location',
    inputSchema: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async function ({ location }) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { weather: 'Sunny', temperature: 75, location };
    },
  });

export const loanStatisticsTool = createTool({
  description: 'Get comprehensive loan statistics including default rates, risk premium, jobs supported, and inflation adjusted amounts for specific NAICS codes and location',
  inputSchema: z.object({
    naicsCodes: z.array(z.number()).describe('Array of NAICS code prefixes (e.g., [5413] for architectural/engineering services)'),
    state: z.string().optional().describe('Two-letter state code (e.g., "TX", "CA")'),
    zipCode: z.number().optional().describe('5-digit zip code'),
    zipRange: z.number().default(40).describe('Range around zip code in miles (default: 40)'),
  }),
  execute: async function (params) {
    return await executeGetLoanStatistics(params);
  },
});

export const topBanksTool = createTool({
  description: 'Get top banks by loan volume for specific NAICS codes and location, including banks by processing method with full address information',
  inputSchema: z.object({
    naicsCodes: z.array(z.number()).describe('Array of NAICS code prefixes (e.g., [5413] for architectural/engineering services)'),
    state: z.string().optional().describe('Two-letter state code (e.g., "TX", "CA")'),
    zipCode: z.number().optional().describe('5-digit zip code'),
    zipRange: z.number().default(40).describe('Range around zip code in miles (default: 40)'),
    topN: z.number().default(3).describe('Number of top banks to return (default: 3)'),
  }),
  execute: async function (params) {
    return await executeGetTopBanks(params);
  },
});
 
// Combined tool to ensure both analyses run together
export const fullAnalysisTool = createTool({
  description: 'Run comprehensive analysis including loan statistics, top banks, AND competitive landscape (when applicable) together with identical parameters so all cards render at once. This is the primary tool to use for complete market analysis.',
  inputSchema: z.object({
    naicsCodes: z.array(z.number()).describe('Array of NAICS code prefixes (e.g., [331110, 331210])'),
    state: z.string().optional().describe('Two-letter state code (e.g., "TX", "CA")'),
    zipCode: z.number().optional().describe('5-digit zip code'),
    zipRange: z.number().default(0).describe('Range around zip code in miles - use 0 for direct ZIP (enables competitive landscape), or 40+ for nearby area'),
    topN: z.number().default(3).describe('Number of top banks to return (default: 3)'),
    employeeCount: z.number().optional().default(25).describe('Company employee count for competitive positioning (default: 25)'),
  }),
  execute: async function (params) {
    // Determine if we should run competitive landscape
    const shouldRunCompetitiveLandscapeState = !!params.state && params.naicsCodes.length > 0;
    const shouldRunCompetitiveLandscapeZip = !!params.zipCode && params.zipRange === 0 && params.naicsCodes.length > 0;
    
    // Run all analyses in parallel
    const [loanStatistics, bankResults, competitiveLandscape] = await Promise.all([
      executeGetLoanStatistics(params),
      executeGetTopBanks(params),
      shouldRunCompetitiveLandscapeState
        ? executeGetCompetitiveLandscapeState({
            stateCode: params.state!,
            naicsCode: String(params.naicsCodes[0]).slice(0, 4),
            employeeCount: params.employeeCount
          }).catch(() => null)
        : shouldRunCompetitiveLandscapeZip
        ? executeGetCompetitiveLandscapeZip({
            zipCode: String(params.zipCode).padStart(5, '0'),
            naicsCode: String(params.naicsCodes[0]).slice(0, 4),
            employeeCount: params.employeeCount
          }).catch(() => null)
        : Promise.resolve(null)
    ]);
    
    const result: { loanStatistics: unknown; bankResults: unknown; competitiveLandscape?: unknown } = { 
      loanStatistics, 
      bankResults,
    };
    
    if (competitiveLandscape) {
      result.competitiveLandscape = competitiveLandscape;
    }
    
    return result;
  },
});

export const competitiveLandscapeZipTool = createTool({
  description: `Get detailed competitive landscape analysis for a specific ZIP code. Provides market concentration (HHI), entry barriers (labor costs, scale requirements), size distribution (micro to very large firms), company positioning (percentile ranking), industry specificity (location quotient), and geographic comparison. Use when user wants to understand the competitive environment in a specific local area or county. Returns comprehensive market intelligence including: number of competitors, market fragmentation, average salaries, firm size distribution, and where the user's company ranks.`,
  inputSchema: z.object({
    zipCode: z.string().length(5).describe('5-digit ZIP code (e.g., "90001", "78201")'),
    naicsCode: z.string().min(2).max(6).describe('NAICS code 2-6 digits - use first 4 digits of the first NAICS code from prior analysis (e.g., "5413" for 541310)'),
    employeeCount: z.number().optional().default(25).describe('Company employee count for positioning analysis - ask user if they mention company size, otherwise default to 25')
  }),
  execute: async function (params) {
    return await executeGetCompetitiveLandscapeZip(params);
  },
});

export const competitiveLandscapeStateTool = createTool({
  description: `Get state-wide competitive landscape analysis aggregated across all counties in the state. Provides state-level market overview, top 5 counties by employment, entry barriers, market concentration, size distribution, and company positioning vs the entire state market. Use when user wants broad market understanding, asks about "the whole state", "all of [state]", "statewide", or wants to identify which counties/cities are the major markets. Perfect for strategic planning and expansion decisions.`,
  inputSchema: z.object({
    stateCode: z.string().length(2).describe('Two-letter state code (e.g., "TX", "CA", "FL") - if user says full name like "Texas", convert to "TX"'),
    naicsCode: z.string().min(2).max(6).describe('NAICS code 2-6 digits - use first 4 digits of the first NAICS code from prior analysis (e.g., "5413" for 541310)'),
    employeeCount: z.number().optional().default(25).describe('Company employee count for positioning analysis - ask user if they mention company size, otherwise default to 25')
  }),
  execute: async function (params) {
    return await executeGetCompetitiveLandscapeState(params);
  },
});
  
export const tools = {
  displayWeather: weatherTool,
  getLoanStatistics: loanStatisticsTool,
  getTopBanks: topBanksTool,
  runFullAnalysis: fullAnalysisTool,
  getCompetitiveLandscapeZip: competitiveLandscapeZipTool,
  getCompetitiveLandscapeState: competitiveLandscapeStateTool,
};