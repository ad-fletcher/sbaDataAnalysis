'use client';

import { TrendingUp, Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { AnalysisOptionsProps } from '@/lib/types/analysis';

export function AnalysisOptions({
  topN,
  onTopNChange,
  employeeCount,
  onEmployeeCountChange,
  disabled = false,
}: AnalysisOptionsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Analysis Options
      </Label>

      {/* Top N Banks Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="topN" className="text-sm text-muted-foreground">
            Top Banks to Display
          </Label>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {topN}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            id="topN"
            type="range"
            min="1"
            max="10"
            step="1"
            value={topN}
            onChange={(e) => onTopNChange(parseInt(e.target.value, 10))}
            disabled={disabled}
            className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Employee Count Input */}
      <div className="space-y-2">
        <Label htmlFor="employeeCount" className="text-sm text-muted-foreground flex items-center gap-2">
          <Users className="w-4 h-4" />
          Company Employee Count (for competitive analysis)
        </Label>
        <Input
          id="employeeCount"
          type="number"
          min="1"
          max="10000"
          value={employeeCount}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value >= 1 && value <= 10000) {
              onEmployeeCountChange(value);
            }
          }}
          disabled={disabled}
          placeholder="Enter employee count..."
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Used for competitive positioning analysis when using direct ZIP code (default: 25)
        </p>
      </div>
    </div>
  );
}

