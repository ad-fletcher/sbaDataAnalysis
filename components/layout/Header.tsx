'use client';

import { ModeToggle } from './ModeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SBA Loan Data Analysis
              </h1>

            </div>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

