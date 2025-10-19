'use client';

import { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NAICSInputForm } from './NAICSInputForm';
import { LocationFilter } from './LocationFilter';
import { AnalysisOptions } from './AnalysisOptions';
import { LoanStatistics } from '@/components/analysis/LoanStatistics';
import { TopBanks } from '@/components/analysis/TopBanks';
import { CompetitiveLandscape } from '@/components/analysis/CompetitiveLandscape';
import type { LocationType, AnalysisResults } from '@/lib/types/analysis';
import { isValidZipCode } from '@/lib/validators/naics';

export function DirectInputContainer() {
  // Form state
  const [naicsCodes, setNaicsCodes] = useState<number[]>([]);
  const [locationType, setLocationType] = useState<LocationType>('state');
  const [stateCode, setStateCode] = useState<string>('');
  const [zipCode, setZipCode] = useState<number>(0);
  const [zipRange, setZipRange] = useState<number>(0); // Default to 0 for direct ZIP (enables competitive landscape)
  const [topN, setTopN] = useState<number>(3);
  const [employeeCount, setEmployeeCount] = useState<number>(25);

  // Analysis state
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string>('');

  const validateForm = (): string | null => {
    if (naicsCodes.length === 0) {
      return 'Please enter at least one NAICS code.';
    }

    if (locationType === 'state' && !stateCode) {
      return 'Please select a state.';
    }

    if (locationType === 'zipCode') {
      if (!zipCode || !isValidZipCode(zipCode)) {
        return 'Please enter a valid 5-digit zip code.';
      }
    }

    return null;
  };

  const handleRunAnalysis = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naicsCodes,
          location: {
            type: locationType,
            value: locationType === 'state' ? stateCode : zipCode,
            zipRange: locationType === 'zipCode' && zipRange > 0 ? zipRange : undefined,
          },
          options: {
            topN,
            employeeCount,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run analysis');
      }

      if (data.success && data.data) {
        setResults(data.data);
      } else {
        throw new Error(data.error || 'No data returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while running the analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = naicsCodes.length > 0 && 
    ((locationType === 'state' && stateCode) || 
     (locationType === 'zipCode' && zipCode && isValidZipCode(zipCode)));

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="border-t-4 border-t-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Direct Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* NAICS Codes Input */}
          <NAICSInputForm
            codes={naicsCodes}
            onChange={setNaicsCodes}
            disabled={isLoading}
          />

          {/* Location Filter */}
          <LocationFilter
            type={locationType}
            onTypeChange={(type) => {
              setLocationType(type);
              setError('');
            }}
            stateCode={stateCode}
            onStateChange={setStateCode}
            zipCode={zipCode}
            onZipChange={setZipCode}
            zipRange={zipRange}
            onZipRangeChange={setZipRange}
            disabled={isLoading}
          />

          {/* Analysis Options */}
          <AnalysisOptions
            topN={topN}
            onTopNChange={setTopN}
            employeeCount={employeeCount}
            onEmployeeCountChange={setEmployeeCount}
            disabled={isLoading}
          />

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Run Analysis Button */}
          <Button
            onClick={handleRunAnalysis}
            disabled={!isFormValid || isLoading}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Running Analysis...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleString()}
            </span>
          </div>
          
          <LoanStatistics {...results.loanStatistics} />
          
          {/* Show Competitive Landscape if available */}
          {results.competitiveLandscape && (
            <CompetitiveLandscape data={results.competitiveLandscape} />
          )}
          
          <TopBanks {...results.bankResults} />
        </div>
      )}
    </div>
  );
}

