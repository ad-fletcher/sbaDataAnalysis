'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { ModeProvider, useMode } from '@/lib/context/ModeContext';
import { Header } from '@/components/layout/Header';
import { DirectInputContainer } from '@/components/input/DirectInputContainer';
import { Weather } from '@/components/weather';
import { LoanStatistics } from '@/components/analysis/LoanStatistics';
import { TopBanks } from '@/components/analysis/TopBanks';
import { CompetitiveLandscape } from '@/components/analysis/CompetitiveLandscape';

function ChatContent() {
  const { currentMode } = useMode();
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentMode === 'chat') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentMode]);

  // Show direct input mode
  if (currentMode === 'direct') {
    return (
      <div className="flex flex-col min-h-[calc(100vh-5rem)]">
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <DirectInputContainer />
          </div>
        </div>
      </div>
    );
  }

  // Show chat mode
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {messages.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome to AI Financial Analyst
              </h2>
              <p className="text-muted-foreground text-lg">
                Ask me about companies, industries, or SBA loan data
              </p>
              <div className="max-w-md mx-auto mt-8 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm font-medium mb-2">Try asking:</p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• &ldquo;Show me steel companies in Texas&rdquo;</li>
                  <li>• &ldquo;Analyze restaurants in San Francisco&rdquo;</li>
                  <li>• &ldquo;What are the top banks for construction loans?&rdquo;</li>
                  <li>• &ldquo;What&rsquo;s the competitive landscape in Texas?&rdquo;</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((message, idx) => (
            <div key={`${message.id}-${idx}`} className="mb-6">
              <div className="font-semibold text-sm text-muted-foreground mb-2">
                {message.role === 'user' ? 'User:' : 'AI:'}
              </div>
              <div className="space-y-2">
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return (
                      <div key={index} className="prose dark:prose-invert max-w-none bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <p className="whitespace-pre-wrap">{part.text}</p>
                      </div>
                    );
                  }

                  if (part.type === 'tool-displayWeather') {
                    switch (part.state) {
                      case 'input-available':
                        return <div key={index}>Loading weather...</div>;
                      case 'output-available':
                        return (
                          <div key={index}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <Weather {...(part.output as any)} />
                          </div>
                        );
                      case 'output-error':
                        return <div key={index}>Error: {part.errorText}</div>;
                      default:
                        return null;
                    }
                  }

                  if (part.type === 'tool-getLoanStatistics') {
                    switch (part.state) {
                      case 'input-available':
                        return <div key={index}>Loading loan statistics...</div>;
                      case 'output-available':
                        return (
                          <div key={index}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <LoanStatistics {...(part.output as any)} />
                          </div>
                        );
                      case 'output-error':
                        return <div key={index}>Error: {part.errorText}</div>;
                      default:
                        return null;
                    }
                  }

                  // Combined tool rendering all cards from a single tool output
                  if (part.type === 'tool-runFullAnalysis') {
                    switch (part.state) {
                      case 'input-available':
                        return <div key={index}>Loading comprehensive analysis...</div>;
                      case 'output-available': {
                        const output = part.output;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const { loanStatistics, bankResults, competitiveLandscape } = output as any;
                        return (
                          <div key={index} className="space-y-4">
                            {loanStatistics ? (
                              <LoanStatistics {...loanStatistics} />
                            ) : null}
                            {competitiveLandscape ? (
                              <CompetitiveLandscape data={competitiveLandscape} />
                            ) : null}
                            {bankResults ? (
                              <TopBanks {...bankResults} />
                            ) : null}
                          </div>
                        );
                      }
                      case 'output-error':
                        return <div key={index}>Error: {part.errorText}</div>;
                      default:
                        return null;
                    }
                  }

                  if (part.type === 'tool-getTopBanks') {
                    switch (part.state) {
                      case 'input-available':
                        return <div key={index}>Loading top banks...</div>;
                      case 'output-available':
                        return (
                          <div key={index}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <TopBanks {...(part.output as any)} />
                          </div>
                        );
                      case 'output-error':
                        return <div key={index}>Error: {part.errorText}</div>;
                      default:
                        return null;
                    }
                  }

                  if (part.type === 'tool-getCompetitiveLandscapeZip') {
                    switch (part.state) {
                      case 'input-available':
                        return <div key={index}>Loading competitive landscape analysis...</div>;
                      case 'output-available':
                        return (
                          <div key={index}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <CompetitiveLandscape data={part.output as any} />
                          </div>
                        );
                      case 'output-error':
                        return <div key={index}>Error: {part.errorText}</div>;
                      default:
                        return null;
                    }
                  }

                  if (part.type === 'tool-getCompetitiveLandscapeState') {
                    switch (part.state) {
                      case 'input-available':
                        return <div key={index}>Loading state-wide competitive landscape...</div>;
                      case 'output-available':
                        return (
                          <div key={index}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <CompetitiveLandscape data={part.output as any} />
                          </div>
                        );
                      case 'output-error':
                        return <div key={index}>Error: {part.errorText}</div>;
                      default:
                        return null;
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="sticky bottom-0 border-t bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput('');
              }
            }}
          >
            <input
              className="w-full p-4 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-sm text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-900"
              value={input}
              placeholder="Ask about a company or industry..."
              onChange={e => setInput(e.currentTarget.value)}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ModeProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Header />
        <ChatContent />
      </div>
    </ModeProvider>
  );
}
