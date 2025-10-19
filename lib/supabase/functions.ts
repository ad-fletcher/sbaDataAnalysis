import { supabaseAdmin } from './server'

// ============================================
// Type Definitions
// ============================================

/**
 * Parameters for querying loan data functions
 */
export interface LoanQueryParams {
  /** Two-letter state code (e.g., 'TX', 'CA') */
  state?: string | null
  /** 5-digit zip code */
  zipCode?: number | null
  /** Array of NAICS code prefixes (e.g., [54, 62] for Professional Services and Healthcare) */
  naicsPrefixes: number[]
  /** Range around zip code in miles (default: 40) */
  zipRange?: number
}

/**
 * Parameters for top banks query
 */
export interface TopBanksParams extends LoanQueryParams {
  /** Number of top banks to return (default: 3) */
  topN?: number
}

/**
 * Loan data statistics response
 */
export interface LoanDataStats {
  /** Percentage of loans sold to secondary market before 2020 */
  pctSoldBefore2020: number
  /** Default rate for loans approved before 2017 */
  preCovidDefaultRate: number
  /** Default rate for loans in the last 3 fiscal years */
  recent3yrDefaultRate: number
  /** Average months from approval to paid in full */
  avgMonthsToPif: number
  /** Average months from approval to charge off */
  avgMonthsToChgoff: number
}

/**
 * Statistical metric with percentiles
 */
export interface StatisticalMetric {
  /** 25th percentile */
  p25: number
  /** 75th percentile */
  p75: number
  /** Mean (average) value */
  mean: number
  /** Median (50th percentile) value */
  median: number
  /** Count of records */
  count: number
}

/**
 * General loan statistics response
 */
export interface LoanStats {
  /** Risk premium statistics */
  riskPremium?: StatisticalMetric
  /** Jobs supported statistics */
  JobsSupported?: StatisticalMetric
  /** Inflation adjusted loan amount statistics */
  inflationAdjustedLoanAmount?: StatisticalMetric
  /** Additional statistics as returned by the function */
  [key: string]: StatisticalMetric | undefined
}

/**
 * Basic bank information (for overall top banks)
 */
export interface BasicBankInfo {
  /** Bank name */
  bankName: string
  /** Number of loans provided */
  count: number
}

/**
 * Detailed bank information (for banks by processing method)
 */
export interface DetailedBankInfo {
  /** Bank name */
  bankName: string
  /** Bank street address */
  street: string
  /** Bank city */
  city: string
  /** Bank state */
  state: string
  /** Bank zip code */
  zip: string
  /** Number of loans provided */
  count: number
}

/**
 * Top banks response structure
 */
export interface TopBanksInfo {
  /** Overall top banks across all processing methods (basic info) */
  topBanks: BasicBankInfo[]
  /** Top banks by processing method (detailed info with addresses) */
  topBanksByProcessingMethod: {
    [method: string]: DetailedBankInfo[]
  }
}

// ============================================
// Function Wrappers
// ============================================

/**
 * Get comprehensive loan data statistics including default rates, 
 * secondary market sales, and average durations.
 * 
 * @param params - Query parameters
 * @returns Promise with loan data statistics
 * 
 * @example
 * ```typescript
 * const stats = await getLoanDataStats({
 *   state: 'TX',
 *   naicsPrefixes: [54, 62],
 *   zipRange: 40
 * })
 * ```
 */
export async function getLoanDataStats(
  params: LoanQueryParams
): Promise<LoanDataStats> {
  const { state, zipCode, naicsPrefixes, zipRange = 40 } = params

  // Validate NAICS prefixes
  if (!naicsPrefixes || naicsPrefixes.length === 0) {
    throw new Error('At least one NAICS prefix is required')
  }

  const { data, error } = await supabaseAdmin.rpc('get_loan_data_stats', {
    p_state: state || null,
    p_zip_code: zipCode || null,
    p_naics_prefixes: naicsPrefixes,
    p_zip_range: zipRange
  })

  if (error) {
    console.error('Error calling get_loan_data_stats:', error)
    throw new Error(`Failed to fetch loan data stats: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned from get_loan_data_stats')
  }

  return data as LoanDataStats
}

/**
 * Get general loan statistics for a specific location and NAICS codes.
 * Optimized for multiple NAICS prefixes using UNION ALL.
 * 
 * @param params - Query parameters
 * @returns Promise with loan statistics
 * 
 * @example
 * ```typescript
 * const stats = await getLoanStats({
 *   state: 'CA',
 *   naicsPrefixes: [54],
 *   zipRange: 50
 * })
 * ```
 */
export async function getLoanStats(
  params: LoanQueryParams
): Promise<LoanStats> {
  const { state, zipCode, naicsPrefixes, zipRange = 40 } = params

  // Validate NAICS prefixes
  if (!naicsPrefixes || naicsPrefixes.length === 0) {
    throw new Error('At least one NAICS prefix is required')
  }

  const { data, error } = await supabaseAdmin.rpc('get_loan_stats', {
    p_state: state || null,
    p_zip_code: zipCode || null,
    p_naics_prefixes: naicsPrefixes,
    p_zip_range: zipRange
  })

  if (error) {
    console.error('Error calling get_loan_stats:', error)
    throw new Error(`Failed to fetch loan stats: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned from get_loan_stats')
  }

  return data as LoanStats
}

/**
 * Get top N banks overall and by processing method with full address info.
 * Optimized with UNION ALL for multiple NAICS prefixes.
 * 
 * @param params - Query parameters including topN
 * @returns Promise with top banks information
 * 
 * @example
 * ```typescript
 * const topBanks = await getTopBanksInfo({
 *   state: 'TX',
 *   naicsPrefixes: [54, 62],
 *   zipRange: 40,
 *   topN: 5
 * })
 * ```
 */
export async function getTopBanksInfo(
  params: TopBanksParams
): Promise<TopBanksInfo> {
  const { state, zipCode, naicsPrefixes, zipRange = 40, topN = 3 } = params

  // Validate NAICS prefixes
  if (!naicsPrefixes || naicsPrefixes.length === 0) {
    throw new Error('At least one NAICS prefix is required')
  }

  // Validate topN
  if (topN < 1 || topN > 100) {
    throw new Error('topN must be between 1 and 100')
  }

  const { data, error } = await supabaseAdmin.rpc('get_top_banks_info', {
    p_state: state || null,
    p_zip_code: zipCode || null,
    p_naics_prefixes: naicsPrefixes,
    p_zip_range: zipRange,
    p_top_n: topN
  })

  if (error) {
    console.error('Error calling get_top_banks_info:', error)
    throw new Error(`Failed to fetch top banks info: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned from get_top_banks_info')
  }

  return data as TopBanksInfo
}

// ============================================
// Utility Functions
// ============================================

/**
 * Validate location parameters (requires either state or zipCode)
 */
export function validateLocationParams(params: {
  state?: string | null
  zipCode?: number | null
}): void {
  if (!params.state && !params.zipCode) {
    throw new Error('Either state or zipCode must be provided')
  }

  if (params.state && params.state.length !== 2) {
    throw new Error('State must be a 2-letter code (e.g., "TX", "CA")')
  }

  if (params.zipCode && (params.zipCode < 10000 || params.zipCode > 99999)) {
    throw new Error('Zip code must be a 5-digit number')
  }
}

/**
 * Validate NAICS code prefix
 */
export function validateNAICSPrefix(naicsPrefix: number): boolean {
  // NAICS codes are typically 2-6 digits
  // For prefixes, we expect 2-4 digits
  return naicsPrefix >= 10 && naicsPrefix <= 9999
}

/**
 * Format NAICS code array with validation
 */
export function formatNAICSCodes(codes: number[]): number[] {
  if (!Array.isArray(codes) || codes.length === 0) {
    throw new Error('NAICS codes must be a non-empty array')
  }

  const invalidCodes = codes.filter(code => !validateNAICSPrefix(code))
  if (invalidCodes.length > 0) {
    throw new Error(
      `Invalid NAICS prefix(es): ${invalidCodes.join(', ')}. ` +
      'NAICS prefixes must be between 10 and 9999'
    )
  }

  return codes
}

/**
 * Combine multiple query results (useful for batch queries)
 */
export async function getBatchLoanAnalysis(
  params: LoanQueryParams
): Promise<{
  stats: LoanDataStats
  loanStats: LoanStats
  topBanks: TopBanksInfo
}> {
  // Validate location
  validateLocationParams(params)

  // Format and validate NAICS codes
  const validatedNAICS = formatNAICSCodes(params.naicsPrefixes)
  const validatedParams = { ...params, naicsPrefixes: validatedNAICS }

  // Execute all three queries in parallel
  const [stats, loanStats, topBanks] = await Promise.all([
    getLoanDataStats(validatedParams),
    getLoanStats(validatedParams),
    getTopBanksInfo(validatedParams)
  ])

  return {
    stats,
    loanStats,
    topBanks
  }
}

// ============================================
// Competitive Landscape Functions
// ============================================

/**
 * Parameters for competitive landscape query by ZIP code
 */
export interface CompetitiveLandscapeParams {
  /** 5-digit zip code (as string) */
  zipCode: string
  /** NAICS code (4-6 digits) */
  naicsCode: string
  /** Company employee count for positioning analysis */
  employeeCount?: number
}

/**
 * Get competitive landscape analysis for a specific ZIP code and NAICS code.
 * This provides detailed market analysis including entry barriers, market concentration,
 * company positioning, and industry specificity.
 * 
 * @param params - Competitive landscape query parameters
 * @returns Promise with competitive landscape data
 * 
 * @example
 * ```typescript
 * const landscape = await getCompetitiveLandscapeByZip({
 *   zipCode: '90001',
 *   naicsCode: '5413',
 *   employeeCount: 25
 * })
 * ```
 */
export async function getCompetitiveLandscapeByZip(
  params: CompetitiveLandscapeParams
): Promise<unknown> {
  const { zipCode, naicsCode, employeeCount = 25 } = params

  // Validate inputs
  if (!zipCode || zipCode.length !== 5) {
    throw new Error('ZIP code must be a 5-digit string')
  }

  if (!naicsCode || naicsCode.length < 2 || naicsCode.length > 6) {
    throw new Error('NAICS code must be between 2 and 6 digits')
  }

  if (employeeCount && (employeeCount < 1 || employeeCount > 1000000)) {
    throw new Error('Employee count must be between 1 and 1,000,000')
  }

  const { data, error } = await supabaseAdmin.rpc('analyze_competitive_landscape_by_zip', {
    p_zip_code: zipCode,
    p_naics_code: naicsCode,
    p_company_employee_count: employeeCount
  })

  if (error) {
    console.error('Error calling analyze_competitive_landscape_by_zip:', error)
    throw new Error(`Failed to fetch competitive landscape: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned from analyze_competitive_landscape_by_zip')
  }

  // Check if the response contains an error (ZIP not found, etc.)
  if (data.error) {
    throw new Error(data.message || data.error)
  }

  return data
}

/**
 * Get competitive landscape analysis for an entire state and NAICS code.
 * This provides state-wide market analysis aggregated across all counties.
 * 
 * @param params - Competitive landscape query parameters
 * @returns Promise with competitive landscape data
 * 
 * @example
 * ```typescript
 * const landscape = await getCompetitiveLandscapeByState({
 *   stateCode: 'TX',
 *   naicsCode: '5413',
 *   employeeCount: 25
 * })
 * ```
 */
export async function getCompetitiveLandscapeByState(
  params: { stateCode: string; naicsCode: string; employeeCount?: number }
): Promise<unknown> {
  const { stateCode, naicsCode, employeeCount = 25 } = params

  // Validate inputs
  if (!stateCode || stateCode.length !== 2) {
    throw new Error('State code must be a 2-letter string (e.g., "TX", "CA")')
  }

  if (!naicsCode || naicsCode.length < 2 || naicsCode.length > 6) {
    throw new Error('NAICS code must be between 2 and 6 digits')
  }

  if (employeeCount && (employeeCount < 1 || employeeCount > 1000000)) {
    throw new Error('Employee count must be between 1 and 1,000,000')
  }

  const { data, error } = await supabaseAdmin.rpc('analyze_competitive_landscape_by_state', {
    p_state_abbr: stateCode.toUpperCase(),
    p_naics_code: naicsCode,
    p_company_employee_count: employeeCount
  })

  if (error) {
    console.error('Error calling analyze_competitive_landscape_by_state:', error)
    throw new Error(`Failed to fetch competitive landscape: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned from analyze_competitive_landscape_by_state')
  }

  // Check if the response contains an error (state not found, etc.)
  if (data.error) {
    throw new Error(data.error || 'Failed to fetch competitive landscape')
  }

  return data
}

