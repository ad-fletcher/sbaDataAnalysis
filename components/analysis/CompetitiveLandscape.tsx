import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Building2, 
  Target,
  BarChart3,
  DollarSign,
  Briefcase
} from 'lucide-react';
import type { CompetitiveLandscapeData } from '@/lib/types/analysis';

// States with competitive landscape data coverage
const COVERED_STATES = [
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 
  'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 
  'MD', 'ME', 'TX'
];

const COVERED_STATES_DISPLAY = COVERED_STATES.join(', ');

type CompetitiveLandscapeProps = {
  data: CompetitiveLandscapeData;
};

export const CompetitiveLandscape = ({ data }: CompetitiveLandscapeProps) => {
  const { zip_info, state_info, analysis } = data;
  
  // Safety check - if analysis is undefined, show error
  if (!analysis) {
    return (
      <div className="space-y-4 my-6">
        <Card className="border-t-4 border-t-red-500 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2 text-red-600">Data Error</h3>
            <p className="text-sm text-muted-foreground">
              Unable to load competitive landscape data. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Determine if this is state-level or ZIP-level analysis
  const isStateLevel = !!state_info;
  const locationInfo = isStateLevel 
    ? { type: 'state' as const, state: state_info!.state_abbr, county: 'State-wide', code: state_info!.state_abbr }
    : { type: 'zip' as const, state: zip_info!.state, county: zip_info!.county, code: zip_info!.zip_code };
  
  // Check if there's an error in the analysis
  if ('error' in analysis) {
    const isStateCovered = COVERED_STATES.includes(locationInfo.state);
    
    return (
      <div className="space-y-4 my-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-7 h-7 text-blue-600" />
            Competitive Landscape Report
          </h2>
          <Badge variant="outline" className="text-sm">
            {isStateLevel 
              ? `${locationInfo.state} State-wide`
              : `${locationInfo.code} - ${locationInfo.county}, ${locationInfo.state}`}
          </Badge>
        </div>
        
        <Card className="border-t-4 border-t-yellow-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
                <MapPin className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">No Data Available</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {'error' in analysis && analysis.error ? analysis.error : `No competitive landscape data found for this ${isStateLevel ? 'state' : 'ZIP code'} and NAICS code combination.`}
                </p>
                
                {!isStateCovered && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      ⚠️ <strong>{locationInfo.state}</strong> is not currently covered in the competitive landscape dataset
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      <strong>States with coverage:</strong>
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {COVERED_STATES_DISPLAY}
                    </p>
                  </div>
                )}
                
                {isStateCovered && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Possible reasons:</strong>
                    </p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                      <li>This specific county may not have data for NAICS code <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{analysis.company_info?.naics_code}</code></li>
                      <li>Try a broader NAICS code (e.g., first 2-3 digits instead of 4)</li>
                      <li>Try a different ZIP code in a major metropolitan area</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const {
    entry_barriers,
    payroll_analysis,
    size_distribution,
    workforce_analysis,
    company_positioning,
    industry_specificity,
    market_concentration,
    geographic_comparison,
  } = analysis;
  
  // Additional safety check
  if (!workforce_analysis || !entry_barriers || !market_concentration) {
    const isStateCovered = COVERED_STATES.includes(locationInfo.state);
    
    return (
      <div className="space-y-4 my-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-7 h-7 text-blue-600" />
            Competitive Landscape Report
          </h2>
          <Badge variant="outline" className="text-sm">
            {isStateLevel 
              ? `${locationInfo.state} State-wide`
              : `${locationInfo.code} - ${locationInfo.county}, ${locationInfo.state}`}
          </Badge>
        </div>
        
        <Card className="border-t-4 border-t-yellow-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
                <MapPin className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Incomplete Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The competitive landscape data for this location is incomplete or unavailable.
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  This may occur in rural areas or for specialized NAICS codes with limited data coverage.
                </p>
                
                {!isStateCovered && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      ⚠️ <strong>{locationInfo.state}</strong> is not currently covered in the competitive landscape dataset
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      <strong>States with coverage:</strong>
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {COVERED_STATES_DISPLAY}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format functions
  const formatCurrency = (val: number) => 
    `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatNumber = (val: number, decimals: number = 2) => 
    val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const formatPercent = (val: number) => 
    `${val.toFixed(2)}%`;

  // Get concentration color
  const getConcentrationColor = (level: string) => {
    if (level.includes('Unconcentrated')) return 'text-green-600';
    if (level.includes('Moderately')) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get barrier level color
  const getBarrierColor = (barrier: string) => {
    if (barrier.includes('High')) return 'text-red-600';
    if (barrier.includes('Moderate')) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-7 h-7 text-blue-600" />
          Competitive Landscape Report
        </h2>
        <Badge variant="outline" className="text-sm">
          {isStateLevel 
            ? `${locationInfo.state} State-wide`
            : `${locationInfo.code} - ${locationInfo.county}, ${locationInfo.state}`}
        </Badge>
      </div>

      {/* Location Info Card */}
      <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Market Location</h3>
              <p className="text-sm text-muted-foreground">
                {isStateLevel 
                  ? `${locationInfo.state} State-wide • NAICS ${analysis.company_info.naics_code}`
                  : `ZIP ${locationInfo.code} • ${locationInfo.county}, ${locationInfo.state} • NAICS ${analysis.company_info.naics_code}`}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Total Establishments:</p>
              <p className="text-xl font-bold text-blue-600">
                {workforce_analysis.total_establishments.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Total Employees:</p>
              <p className="text-xl font-bold text-blue-600">
                {workforce_analysis.total_employees.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Avg Employees/Firm:</p>
              <p className="text-xl font-bold text-blue-600">
                {formatNumber(workforce_analysis.avg_employees_per_establishment)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Positioning & Market Concentration Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Company Positioning Card */}
        <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Company Positioning</h3>
                <p className="text-sm text-muted-foreground">
                  {analysis.company_info.employee_count} employees
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Size Class:</span>
                  <Badge variant="secondary" className="font-mono">
                    {company_positioning.size_class}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Size Percentile:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatPercent(company_positioning.size_percentile)}
                  </span>
                </div>
                <div className="relative h-2 bg-green-200 dark:bg-green-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 dark:bg-green-500 rounded-full transition-all"
                    style={{ width: `${company_positioning.size_percentile}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Larger than {formatPercent(company_positioning.larger_than_x_percent_of_competitors)} of competitors
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Peer Establishments:</span>
                  <span className="text-lg font-bold text-green-600">
                    {company_positioning.peer_establishments_in_size_class.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Concentration Card */}
        <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Market Concentration</h3>
                <p className="text-sm text-muted-foreground">
                  {market_concentration.market_type}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Concentration Level:</span>
                  <Badge 
                    variant="outline" 
                    className={getConcentrationColor(market_concentration.concentration_level)}
                  >
                    {market_concentration.concentration_level}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">HHI Score:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatNumber(market_concentration.estimated_hhi, 0)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {market_concentration.estimated_hhi < 1500 ? 'Competitive market' : 
                   market_concentration.estimated_hhi < 2500 ? 'Moderately concentrated' : 
                   'Highly concentrated'}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Small Firms (%):</span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatPercent(market_concentration.small_firms_percentage)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entry Barriers & Industry Specificity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Entry Barriers Card */}
        <Card className="border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Entry Barriers</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Labor Cost Barrier:</span>
                  <Badge 
                    variant="outline"
                    className={getBarrierColor(entry_barriers.labor_cost_barrier)}
                  >
                    {entry_barriers.labor_cost_barrier}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Annual Pay:</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(entry_barriers.avg_annual_pay)}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Min Efficient Scale:</span>
                  <Badge variant="secondary">
                    {entry_barriers.minimum_efficient_scale}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Weighted Avg Firm Size:</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatNumber(entry_barriers.weighted_avg_firm_size)} employees
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Large Firms (100+):</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatPercent(entry_barriers.large_firm_percentage)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industry Specificity Card */}
        <Card className="border-t-4 border-t-indigo-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-950 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Industry Specificity</h3>
                <p className="text-sm text-muted-foreground">
                  Specialization: {industry_specificity.specialization}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Location Quotient:</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatNumber(industry_specificity.location_quotient)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {industry_specificity.location_quotient > 1.2 ? 'High concentration' : 
                   industry_specificity.location_quotient > 0.8 ? 'Average concentration' : 
                   'Below average concentration'}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">County Share of State:</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatPercent(industry_specificity.county_share_of_state_industry)}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Local Share of Industry:</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatPercent(industry_specificity.local_share_of_broader_industry)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Size Distribution Card */}
      <Card className="border-t-4 border-t-cyan-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-950 rounded-lg">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Company Size Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Breakdown of {workforce_analysis.total_establishments.toLocaleString()} establishments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Micro (0-4)</p>
              <p className="text-2xl font-bold text-cyan-600">
                {size_distribution.micro_0_4.count.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(size_distribution.micro_0_4.percentage)}
              </p>
            </div>

            <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Small (5-19)</p>
              <p className="text-2xl font-bold text-cyan-600">
                {size_distribution.small_5_19.count.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(size_distribution.small_5_19.percentage)}
              </p>
            </div>

            <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Medium (20-99)</p>
              <p className="text-2xl font-bold text-cyan-600">
                {size_distribution.medium_20_99.count.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(size_distribution.medium_20_99.percentage)}
              </p>
            </div>

            <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Large (100-499)</p>
              <p className="text-2xl font-bold text-cyan-600">
                {size_distribution.large_100_499.count.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(size_distribution.large_100_499.percentage)}
              </p>
            </div>

            <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Very Large (500+)</p>
              <p className="text-2xl font-bold text-cyan-600">
                {size_distribution.very_large_500_plus.count.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(size_distribution.very_large_500_plus.percentage)}
              </p>
            </div>
          </div>

          {/* Visual bar chart */}
          <div className="mt-4">
            <div className="h-8 flex rounded-lg overflow-hidden">
              <div 
                className="bg-cyan-600 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${size_distribution.micro_0_4.percentage}%` }}
                title={`Micro: ${formatPercent(size_distribution.micro_0_4.percentage)}`}
              >
                {size_distribution.micro_0_4.percentage > 10 && formatPercent(size_distribution.micro_0_4.percentage)}
              </div>
              <div 
                className="bg-cyan-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${size_distribution.small_5_19.percentage}%` }}
                title={`Small: ${formatPercent(size_distribution.small_5_19.percentage)}`}
              >
                {size_distribution.small_5_19.percentage > 10 && formatPercent(size_distribution.small_5_19.percentage)}
              </div>
              <div 
                className="bg-cyan-400 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${size_distribution.medium_20_99.percentage}%` }}
                title={`Medium: ${formatPercent(size_distribution.medium_20_99.percentage)}`}
              >
                {size_distribution.medium_20_99.percentage > 5 && formatPercent(size_distribution.medium_20_99.percentage)}
              </div>
              <div 
                className="bg-cyan-300 flex items-center justify-center text-gray-700 text-xs font-bold"
                style={{ width: `${size_distribution.large_100_499.percentage}%` }}
                title={`Large: ${formatPercent(size_distribution.large_100_499.percentage)}`}
              >
                {size_distribution.large_100_499.percentage > 3 && formatPercent(size_distribution.large_100_499.percentage)}
              </div>
              <div 
                className="bg-cyan-200 flex items-center justify-center text-gray-700 text-xs font-bold"
                style={{ width: `${size_distribution.very_large_500_plus.percentage}%` }}
                title={`Very Large: ${formatPercent(size_distribution.very_large_500_plus.percentage)}`}
              >
                {size_distribution.very_large_500_plus.percentage > 3 && formatPercent(size_distribution.very_large_500_plus.percentage)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Comparison Card */}
      <Card className="border-t-4 border-t-pink-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-pink-100 dark:bg-pink-950 rounded-lg">
              <Building2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Geographic Comparison</h3>
              <p className="text-sm text-muted-foreground">
                {isStateLevel ? `Top counties in ${locationInfo.state}` : `County ranking within ${locationInfo.state}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-muted-foreground text-sm mb-1">State Avg Employees:</p>
              <p className="text-xl font-bold text-pink-600">
                {formatNumber(geographic_comparison.state_avg_employees, 0)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">State Avg Establishments:</p>
              <p className="text-xl font-bold text-pink-600">
                {formatNumber(geographic_comparison.state_avg_establishments, 0)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">County Employee Rank:</p>
              <p className="text-xl font-bold text-pink-600">
                #{geographic_comparison.target_county_rank_employees}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">County Establishment Rank:</p>
              <p className="text-xl font-bold text-pink-600">
                #{geographic_comparison.target_county_rank_establishments}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Top 5 Counties by Employment</h4>
            <div className="space-y-2">
              {geographic_comparison.top_5_counties_by_employment.slice(0, 5).map((county, idx) => (
                <div 
                  key={idx}
                  className="flex justify-between items-center text-sm p-2 bg-pink-50 dark:bg-pink-950/20 rounded"
                >
                  <span className="font-medium">
                    County FIPS: {county.fips_county}
                    {!isStateLevel && zip_info && county.fips_county === Number(zip_info.fips_county) && (
                      <Badge variant="secondary" className="ml-2 text-xs">Your County</Badge>
                    )}
                  </span>
                  <span className="text-pink-600 font-bold">
                    {county.employees.toLocaleString()} employees
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Analysis Card */}
      <Card className="border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Payroll Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Industry compensation metrics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Annual Payroll:</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatCurrency(payroll_analysis.total_annual_payroll)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Avg Annual Pay/Employee:</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatCurrency(payroll_analysis.avg_annual_pay_per_employee)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Avg Q1 Pay/Employee:</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatCurrency(payroll_analysis.avg_q1_pay_per_employee)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

