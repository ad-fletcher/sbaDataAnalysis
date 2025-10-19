'use client';

import { MapPin, Navigation, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { US_STATES, isValidZipCode } from '@/lib/validators/naics';
import type { LocationFilterProps } from '@/lib/types/analysis';

export function LocationFilter({
  type,
  onTypeChange,
  stateCode,
  onStateChange,
  zipCode,
  onZipChange,
  zipRange,
  onZipRangeChange,
  disabled = false,
}: LocationFilterProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Location
      </Label>

      <Tabs 
        value={type} 
        onValueChange={(value) => onTypeChange(value as 'state' | 'zipCode')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="state" disabled={disabled}>
            State
          </TabsTrigger>
          <TabsTrigger value="zipCode" disabled={disabled}>
            Zip Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="state" className="space-y-3 mt-3">
          <div>
            <select
              value={stateCode || ''}
              onChange={(e) => onStateChange(e.target.value)}
              disabled={disabled}
              className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a state...</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1.5">
              Analyze loans across the entire state
            </p>
          </div>
        </TabsContent>

        <TabsContent value="zipCode" className="space-y-3 mt-3">
          <div>
            <Input
              type="text"
              value={zipCode || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                onZipChange(value ? parseInt(value, 10) : 0);
              }}
              placeholder="Enter 5-digit zip code"
              disabled={disabled}
              maxLength={5}
              className="font-mono"
            />
            {zipCode && !isValidZipCode(zipCode) && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">
                Please enter a valid 5-digit zip code
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="zipRange" className="text-sm flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5" />
                Search Radius
              </Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onZipRangeChange(0)}
                  disabled={disabled || !zipCode}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    zipRange === 0 
                      ? 'bg-green-100 dark:bg-green-950 border-green-600 text-green-700 dark:text-green-400 font-semibold' 
                      : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  Direct ZIP Only
                </button>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {zipRange === 0 ? 'Direct' : `${zipRange} Nearby`}
                </span>
              </div>
            </div>
            <input
              id="zipRange"
              type="range"
              min="0"
              max="100"
              step="5"
              value={zipRange}
              onChange={(e) => onZipRangeChange(parseInt(e.target.value, 10))}
              disabled={disabled || !zipCode}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Direct</span>
              <span>100 zips</span>
            </div>
            {zipRange === 0 && zipCode && isValidZipCode(zipCode) && (
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded text-xs">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-400">
                  <strong>Competitive Landscape</strong> analysis will be included
                </span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

