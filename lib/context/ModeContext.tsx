'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Mode } from '@/lib/types/analysis';

interface ModeContextType {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

const MODE_STORAGE_KEY = 'analyst-mode-preference';

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [currentMode, setCurrentMode] = useState<Mode>('direct');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as Mode | null;
    if (savedMode === 'direct' || savedMode === 'chat') {
      setCurrentMode(savedMode);
    }
    setIsInitialized(true);
  }, []);

  // Save mode to localStorage when it changes
  const setMode = (mode: Mode) => {
    setCurrentMode(mode);
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  };

  const toggleMode = () => {
    const newMode: Mode = currentMode === 'direct' ? 'chat' : 'direct';
    setMode(newMode);
  };

  // Don't render children until we've loaded the saved mode
  if (!isInitialized) {
    return null;
  }

  return (
    <ModeContext.Provider value={{ currentMode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}

