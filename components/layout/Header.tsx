'use client';

import { ModeToggle } from './ModeToggle';
import { TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl backdrop-saturate-150 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-3 group">
            
            {/* Title with refined typography */}
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent transition-all duration-300">
                SBA Loan Analytics
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Data from the Small Business Administration and County Business Patterns
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="transition-all duration-300 hover:scale-[1.02]">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

