'use client';

import { MessageSquare, Database } from 'lucide-react';
import { useMode } from '@/lib/context/ModeContext';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { currentMode, setMode } = useMode();

  return (
    <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <Button
        variant={currentMode === 'direct' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('direct')}
        className="flex items-center gap-2"
      >
        <Database className="w-4 h-4" />
        Direct Input
      </Button>
      <Button
        variant={currentMode === 'chat' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('chat')}
        className="flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Chat Mode
      </Button>
    </div>
  );
}

