import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

type LoanStatisticsProps = {
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

export const LoanStatistics = ({ dataStats, loanStats }: LoanStatisticsProps) => {
  // Format functions
  const formatPercentAlreadyScaled = (val: number | null) => val != null ? `${val.toFixed(2)}%` : 'N/A';
  // Risk premium is already stored as percentage (5.12 = 5.12%), just add % sign
  const formatRiskPremium = (val: number | null) => val != null ? `${val.toFixed(2)}%` : 'N/A';
  const formatCurrency = (val: number | null) => val != null ? `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 'N/A';
  const formatNumber = (val: number | null) => val != null ? val.toFixed(2) : 'N/A';

  // Calculate total loans count from dataStats (estimate)
  const totalLoans = loanStats.riskPremium?.count || 
                     loanStats.JobsSupported?.count || 
                     loanStats.inflationAdjustedLoanAmount?.count || 
                     0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      {/* Market & Default Rates Card */}
      <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Market & Default Rates</h3>
                <p className="text-sm text-muted-foreground"></p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">{totalLoans} loans</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-muted-foreground mb-1">% Sold if bought before 2020:</p>
              <p className="text-2xl font-bold text-blue-600">{formatPercentAlreadyScaled(dataStats.pctSoldBefore2020)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Pre-COVID Default (companies bougt before 2017):</p>
              <p className="text-2xl font-bold text-blue-600">{formatPercentAlreadyScaled(dataStats.preCovidDefaultRate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Recent 3yr Default:</p>
              <p className="text-2xl font-bold text-blue-600">{formatPercentAlreadyScaled(dataStats.recent3yrDefaultRate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Avg Months to Loan Paid in Full(PIF):</p>
              <p className="text-2xl font-bold text-blue-600">{formatNumber(dataStats.avgMonthsToPif)}</p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-muted-foreground mb-1">Avg Months held before charge-off(default):</p>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(dataStats.avgMonthsToChgoff)}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Updated just now</span>
            <button className="hover:underline">View details</button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Premium Card */}
      {loanStats.riskPremium && (
        <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Risk Premium</h3>
                  <p className="text-sm text-muted-foreground">Standardized by % above Fed Funds </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{loanStats.riskPremium.count} loans</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-muted-foreground mb-1">Median:</p>
                <p className="text-2xl font-bold text-green-600">{formatRiskPremium(loanStats.riskPremium.median)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Mean:</p>
                <p className="text-2xl font-bold text-green-600">{formatRiskPremium(loanStats.riskPremium.mean)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">25th %ile:</p>
                <p className="text-2xl font-bold text-green-600">{formatRiskPremium(loanStats.riskPremium.p25)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">75th %ile:</p>
                <p className="text-2xl font-bold text-green-600">{formatRiskPremium(loanStats.riskPremium.p75)}</p>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Distribution</span>
                <span>{formatRiskPremium(loanStats.riskPremium.p25)} – {formatRiskPremium(loanStats.riskPremium.p75)}</span>
              </div>
              <div className="relative h-2 bg-green-200 dark:bg-green-950 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-full bg-green-400 dark:bg-green-700" style={{ width: '25%' }}></div>
                  <div className="absolute left-1/2 w-1 h-4 bg-green-800 dark:bg-green-500 -translate-x-1/2 -translate-y-1"></div>
                  <div className="absolute" style={{ left: '75%' }}>
                    <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-full -translate-x-1/2 -translate-y-0.5"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>IQR</span>
                <span>Median</span>
                <span>Mean</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Updated just now</span>
              <button className="hover:underline">View details</button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs Supported Card */}
      {loanStats.JobsSupported && (
        <Card className="border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                  <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Jobs Supported</h3>
                  <p className="text-sm text-muted-foreground">Jobs Kept + Created</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{loanStats.JobsSupported.count} loans</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-muted-foreground mb-1">Median:</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(loanStats.JobsSupported.median)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Mean:</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(loanStats.JobsSupported.mean)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">25th %ile:</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(loanStats.JobsSupported.p25)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">75th %ile:</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(loanStats.JobsSupported.p75)}</p>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Distribution</span>
                <span>{formatNumber(loanStats.JobsSupported.p25)} – {formatNumber(loanStats.JobsSupported.p75)}</span>
              </div>
              <div className="relative h-2 bg-orange-200 dark:bg-orange-950 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-full bg-orange-400 dark:bg-orange-700" style={{ width: '25%' }}></div>
                  <div className="absolute left-1/4 w-1 h-4 bg-orange-800 dark:bg-orange-500 -translate-y-1"></div>
                  <div className="absolute" style={{ left: '75%' }}>
                    <div className="w-3 h-3 bg-orange-600 dark:bg-orange-500 rounded-full -translate-x-1/2 -translate-y-0.5"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>IQR</span>
                <span>Median</span>
                <span>Mean</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Updated just now</span>
              <button className="hover:underline">View details</button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inflation Adjusted Loan Amount Card */}
      {loanStats.inflationAdjustedLoanAmount && (
        <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Inflation-Adjusted Loan Amount</h3>
                  <p className="text-sm text-muted-foreground">Real dollars (2025)</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{loanStats.inflationAdjustedLoanAmount.count} loans</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-muted-foreground mb-1">Median:</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(loanStats.inflationAdjustedLoanAmount.median)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Mean:</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(loanStats.inflationAdjustedLoanAmount.mean)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">25th %ile:</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(loanStats.inflationAdjustedLoanAmount.p25)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">75th %ile:</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(loanStats.inflationAdjustedLoanAmount.p75)}</p>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Distribution</span>
                <span>{formatCurrency(loanStats.inflationAdjustedLoanAmount.p25)} – {formatCurrency(loanStats.inflationAdjustedLoanAmount.p75)}</span>
              </div>
              <div className="relative h-2 bg-purple-200 dark:bg-purple-950 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-full bg-purple-400 dark:bg-purple-700" style={{ width: '25%' }}></div>
                  <div className="absolute left-1/2 w-1 h-4 bg-purple-800 dark:bg-purple-500 -translate-x-1/2 -translate-y-1"></div>
                  <div className="absolute" style={{ left: '75%' }}>
                    <div className="w-3 h-3 bg-purple-600 dark:bg-purple-500 rounded-full -translate-x-1/2 -translate-y-0.5"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>IQR</span>
                <span>Median</span>
                <span>Mean</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Updated just now</span>
              <button className="hover:underline">View details</button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
