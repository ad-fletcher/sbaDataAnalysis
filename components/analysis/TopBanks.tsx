import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type TopBanksProps = {
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

export const TopBanks = ({ topBanks, topBanksByProcessingMethod }: TopBanksProps) => {
  const formatLoanCount = (count: number) => `${count} ${count === 1 ? 'loan' : 'loans'}`;
  const formatZip = (zip: string) => (zip ? zip.toString().replace(/\.0$/, '') : '');
  const toTitleCase = (str: string) => str ? str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : '';

  // Handle null or empty data
  if (!topBanks || topBanks.length === 0) {
    return (
      <div className="border rounded-lg p-4 my-2 bg-white dark:bg-zinc-900">
        <h3 className="text-lg font-semibold">Top Banks</h3>
        <p className="text-muted-foreground mt-2">No bank data available.</p>
      </div>
    );
  }

  return (
    <div className="my-2 space-y-4">
      <h3 className="text-lg font-semibold">Top Banks</h3>
      
      {/* Overall Top Banks */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 space-y-3">
          <h4 className="font-medium text-sm text-zinc-600 dark:text-zinc-400">Overall Top Banks</h4>
          <div className="space-y-1">
            {topBanks.map((bank, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm p-2 bg-zinc-50 dark:bg-zinc-800 rounded">
                <span className="font-medium">{bank.bankName}</span>
                <Badge variant="secondary" className="text-xs">{formatLoanCount(bank.count)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Banks by Processing Method */}
      {topBanksByProcessingMethod && Object.entries(topBanksByProcessingMethod).map(([method, banks]) => (
        <Card key={method} className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <h4 className="font-medium text-sm text-zinc-600 dark:text-zinc-400">
              Top Banks - {method}
            </h4>
            <div className="space-y-2">
              {banks.map((bank, idx) => (
                <div key={idx} className="text-sm p-3 bg-zinc-50 dark:bg-zinc-800 rounded space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{bank.bankName}</span>
                    <Badge variant="secondary" className="text-xs">{formatLoanCount(bank.count)}</Badge>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {bank.street}, {toTitleCase(bank.city)}, {bank.state} {formatZip(bank.zip)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

