// NAICS code validation utilities

export function isValidNAICS(code: string | number): boolean {
  const codeStr = String(code);
  // NAICS codes are 2-6 digits
  return /^\d{2,6}$/.test(codeStr);
}

export function formatNAICS(code: string | number): number | null {
  const codeStr = String(code).trim();
  if (!isValidNAICS(codeStr)) {
    return null;
  }
  return parseInt(codeStr, 10);
}

export function parseNAICSInput(input: string): number[] {
  // Split by common delimiters (comma, space, semicolon, pipe)
  const parts = input.split(/[,;\s|]+/).filter(p => p.trim());
  const codes: number[] = [];
  
  for (const part of parts) {
    const formatted = formatNAICS(part);
    if (formatted !== null && !codes.includes(formatted)) {
      codes.push(formatted);
    }
  }
  
  return codes;
}

export function isValidStateCode(code: string): boolean {
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC'
  ];
  return validStates.includes(code.toUpperCase());
}

export function isValidZipCode(zip: string | number): boolean {
  const zipStr = String(zip);
  return /^\d{5}$/.test(zipStr);
}

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
];

// Popular NAICS codes for suggestions
export const POPULAR_NAICS = {
  'Steel Manufacturing': [331110, 331210, 332312, 332111, 423510],
  'Restaurants': [722511, 722513, 722514],
  'Retail': [445110, 446110, 448140, 452311],
  'Construction': [236115, 236116, 236117, 236118, 238110],
  'Healthcare': [621111, 621112, 621210, 621310, 623110],
  'Technology': [541511, 541512, 541519, 518210],
  'Manufacturing': [332710, 333111, 333120, 334111, 335311],
  'Professional Services': [541110, 541211, 541330, 541380, 541990],
};

