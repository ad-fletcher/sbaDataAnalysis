'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { parseNAICSInput, POPULAR_NAICS } from '@/lib/validators/naics';
import type { NAICSInputFormProps } from '@/lib/types/analysis';

export function NAICSInputForm({ 
  codes, 
  onChange, 
  maxCodes = 6,
  disabled = false 
}: NAICSInputFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddCode = () => {
    if (!inputValue.trim()) return;

    // Try to parse multiple codes
    const newCodes = parseNAICSInput(inputValue);
    
    if (newCodes.length === 0) {
      setError('Invalid NAICS code(s). Must be 2-6 digits.');
      return;
    }

    // Check if adding would exceed max
    const uniqueNewCodes = newCodes.filter(code => !codes.includes(code));
    if (codes.length + uniqueNewCodes.length > maxCodes) {
      setError(`Maximum ${maxCodes} codes allowed.`);
      return;
    }

    onChange([...codes, ...uniqueNewCodes]);
    setInputValue('');
    setError('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCode();
    } else if (e.key === 'Backspace' && !inputValue && codes.length > 0) {
      // Remove last code on backspace if input is empty
      onChange(codes.slice(0, -1));
    }
  };

  const handleRemoveCode = (codeToRemove: number) => {
    onChange(codes.filter(code => code !== codeToRemove));
    setError('');
  };

  const handleAddPreset = (presetCodes: number[]) => {
    const uniqueNewCodes = presetCodes.filter(code => !codes.includes(code));
    const totalCodes = codes.length + uniqueNewCodes.length;
    
    if (totalCodes > maxCodes) {
      setError(`Maximum ${maxCodes} codes allowed.`);
      return;
    }

    onChange([...codes, ...uniqueNewCodes]);
    setShowSuggestions(false);
    setError('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          NAICS Codes, Click 
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline focus:outline-none px-1"
            style={{ background: 'none', border: 'none', font: 'inherit', padding: 0 }}
          >
            here
          </button>
          to see suggestions:
          Or go to chat mode to ask AI to find the best NAICS codes for you
        </label>
        
        <span className="text-xs text-muted-foreground">
          {codes.length} / {maxCodes} codes
        </span>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter NAICS code(s)..."
            disabled={disabled || codes.length >= maxCodes}
            className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
        </div>
        <Button
          type="button"
          onClick={handleAddCode}
          disabled={disabled || !inputValue.trim() || codes.length >= maxCodes}
          variant="outline"
          size="icon"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Press Enter to Input Note */}
      {inputValue.trim().length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            Press&nbsp;<span className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1 rounded">Enter</span>&nbsp;to input the code{parseNAICSInput(inputValue).length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Code Tags */}
      {codes.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          {codes.map((code) => (
            <Badge
              key={code}
              variant="secondary"
              className="px-3 py-1.5 text-sm font-mono flex items-center gap-2"
            >
              {code}
              <button
                type="button"
                onClick={() => handleRemoveCode(code)}
                disabled={disabled}
                className="hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Quick Presets */}
      {showSuggestions && (
        <Card className="p-4 space-y-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Quick Add - Popular Industries:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(POPULAR_NAICS).map(([industry, industryCodes]) => (
              <Button
                key={industry}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddPreset(industryCodes)}
                disabled={disabled}
                className="text-xs"
              >
                {industry}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Tip: You can paste multiple codes separated by commas, spaces, or line breaks.
          </p>
        </Card>
      )}
    </div>
  );
}

