// Type definitions for direct analysis mode

export type Mode = 'direct' | 'chat';

export type LocationType = 'state' | 'zipCode';

export interface LocationState {
  type: LocationType;
  stateCode?: string;
  zipCode?: number;
  zipRange: number;
}

export interface DirectInputState {
  naicsCodes: number[];
  location: LocationState;
  topN: number;
}

export interface AnalysisRequest {
  naicsCodes: number[];
  location: {
    type: LocationType;
    value: string | number;
    zipRange?: number;
  };
  options: {
    topN: number;
    employeeCount?: number;
  };
}

export interface AnalysisResults {
  loanStatistics: {
    dataStats: {
      pctSoldBefore2020: number;
      preCovidDefaultRate: number;
      recent3yrDefaultRate: number;
      avgMonthsToPif: number;
      avgMonthsToChgoff: number;
    };
    loanStats: {
      riskPremium?: {
        p25: number;
        p75: number;
        mean: number;
        median: number;
        count: number;
      };
      JobsSupported?: {
        p25: number;
        p75: number;
        mean: number;
        median: number;
        count: number;
      };
      inflationAdjustedLoanAmount?: {
        p25: number;
        p75: number;
        mean: number;
        median: number;
        count: number;
      };
    };
  };
  bankResults: {
    topBanks: Array<{
      bankName: string;
      count: number;
    }> | null;
    topBanksByProcessingMethod: {
      [method: string]: Array<{
        bankName: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        count: number;
      }>;
    } | null;
  };
  competitiveLandscape?: CompetitiveLandscapeData;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResults;
  metadata?: {
    timestamp: string;
    naicsCodes: number[];
    location: {
      type: LocationType;
      value: string | number;
      zipRange?: number;
    };
    executionTime: number;
  };
  error?: string;
}

export interface NAICSInputFormProps {
  codes: number[];
  onChange: (codes: number[]) => void;
  maxCodes?: number;
  disabled?: boolean;
}

export interface LocationFilterProps {
  type: LocationType;
  onTypeChange: (type: LocationType) => void;
  stateCode?: string;
  onStateChange: (state: string) => void;
  zipCode?: number;
  onZipChange: (zip: number) => void;
  zipRange: number;
  onZipRangeChange: (range: number) => void;
  disabled?: boolean;
}

export interface AnalysisOptionsProps {
  topN: number;
  onTopNChange: (topN: number) => void;
  employeeCount: number;
  onEmployeeCountChange: (employeeCount: number) => void;
  disabled?: boolean;
}

// Competitive Landscape Types
export interface CompetitiveEntryBarriers {
  avg_annual_pay: number;
  labor_cost_barrier: string;
  large_firm_percentage: number;
  weighted_avg_firm_size: number;
  minimum_efficient_scale: string;
}

export interface CompetitivePayrollAnalysis {
  payroll_noise_flags: {
    q1: string;
    annual: string;
  };
  total_annual_payroll: number;
  implied_annual_from_q1: number;
  avg_q1_pay_per_employee: number;
  avg_annual_pay_per_employee: number;
}

export interface CompetitiveSizeDistribution {
  micro_0_4: {
    count: number;
    percentage: number;
  };
  small_5_19: {
    count: number;
    percentage: number;
  };
  medium_20_99: {
    count: number;
    percentage: number;
  };
  large_100_499: {
    count: number;
    percentage: number;
  };
  very_large_500_plus: {
    count: number;
    percentage: number;
  };
}

export interface CompetitiveWorkforceAnalysis {
  total_employees: number;
  employee_noise_flag: string;
  total_establishments: number;
  avg_employees_per_establishment: number;
}

export interface CompetitiveCompanyPositioning {
  size_class: string;
  size_percentile: number;
  market_share_by_employment: number;
  peer_establishments_in_size_class: number;
  larger_than_x_percent_of_competitors: number;
}

export interface CompetitiveIndustrySpecificity {
  specialization: string;
  location_quotient: number;
  county_share_of_state_industry: number;
  local_share_of_broader_industry: number;
}

export interface CompetitiveMarketConcentration {
  market_type: string;
  estimated_hhi: number;
  concentration_level: string;
  total_establishments: number;
  small_firms_percentage: number;
}

export interface CompetitiveCountyData {
  employees: number;
  fips_county: number;
}

export interface CompetitiveGeographicComparison {
  state_avg_employees: number;
  state_total_counties: number;
  state_avg_establishments: number;
  target_county_rank_employees: number;
  top_5_counties_by_employment: CompetitiveCountyData[];
  target_county_rank_establishments: number;
}

export interface CompetitiveCompanyInfo {
  fips_state: string;
  naics_code: string;
  fips_county: string;
  employee_count: number;
}

export interface CompetitiveZipInfo {
  zip_code: string;
  state: string;
  county: string;
  fips_state: string;
  fips_county: string;
}

export interface CompetitiveStateInfo {
  state_abbr: string;
  fips_state: string;
  naics_code: string;
}

export interface CompetitiveAnalysisSuccess {
  company_info: CompetitiveCompanyInfo;
  entry_barriers: CompetitiveEntryBarriers;
  payroll_analysis: CompetitivePayrollAnalysis;
  size_distribution: CompetitiveSizeDistribution;
  workforce_analysis: CompetitiveWorkforceAnalysis;
  company_positioning: CompetitiveCompanyPositioning;
  industry_specificity: CompetitiveIndustrySpecificity;
  market_concentration: CompetitiveMarketConcentration;
  geographic_comparison: CompetitiveGeographicComparison;
}

export interface CompetitiveAnalysisError {
  error: string;
  company_info?: CompetitiveCompanyInfo;
  message?: string;
}

export type CompetitiveAnalysis = CompetitiveAnalysisSuccess | CompetitiveAnalysisError;

export interface CompetitiveLandscapeData {
  zip_info?: CompetitiveZipInfo;
  state_info?: CompetitiveStateInfo;
  analysis: CompetitiveAnalysis;
}

