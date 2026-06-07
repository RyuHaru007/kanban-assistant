"use client";

import { Terminal, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

const LOG_LINES = [
  "Initializing sandbox environment...",
  "Pulling container image: node:20-alpine...",
  "Cloning repository...",
  "Resolving dependencies...",
  "Installing dependencies...",
  "Building project...",
  "Running jest tests...",
  "Tests Passed: 14/14"
];

export function TerminalOutput({ isResolved, onAction }: { isResolved?: boolean; onAction?: (action: string) => void }) {
  const [lines, setLines] = useState<string[]>(isResolved ? LOG_LINES : []);
  const isDone = lines.length === LOG_LINES.length;

  useEffect(() => {
    if (isResolved && lines.length === LOG_LINES.length) return;

    let currentLine = lines.length;
    if (currentLine >= LOG_LINES.length) return;

    const interval = setInterval(() => {
      if (currentLine < LOG_LINES.length) {
        setLines(prev => {
          if (prev.length < LOG_LINES.length) {
             const newLines = [...prev, LOG_LINES[prev.length]];
             return newLines;
          }
          return prev;
        });
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 400); // 400ms per line, total ~3.2 seconds
    
    return () => clearInterval(interval);
  }, [isResolved, lines.length]);

  // If the server resolved the tool before our animation finished, 
  // we could snap to the end, but letting it finish the animation is also fine.
  // We'll let it finish if it's already animating.

  return (
    <div className="w-full max-w-2xl rounded-lg overflow-hidden bg-[#0D1117] border border-border/50 shadow-md font-mono text-xs my-4 flex flex-col">
      <div className="flex items-center justify-between bg-[#161B22] px-4 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400 font-semibold">Sandbox Execution</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>
      <ScrollArea className="h-[220px] w-full p-4">
        <div className="flex flex-col gap-1.5 pb-2">
          {lines.map((line, idx) => {
            const isLast = idx === LOG_LINES.length - 1;
            return (
              <div 
                key={idx} 
                className={`${isLast ? 'text-green-400 font-bold mt-2' : 'text-gray-300'}`}
              >
                <span className="text-gray-600 mr-3 select-none">$</span>
                {line}
              </div>
            );
          })}
          {lines.length < LOG_LINES.length && (
            <div className="text-gray-300 animate-pulse mt-1">
              <span className="text-gray-600 mr-3 select-none">$</span>
              <span className="inline-block w-2 h-3.5 bg-gray-400 align-middle" />
            </div>
          )}
        </div>
      </ScrollArea>
      {isDone && !isResolved && onAction && (
        <div className="flex gap-2 p-3 border-t border-border/50 bg-[#161B22]">
          <Button
            size="sm"
            onClick={() => onAction('approved')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Continue to PR
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onAction('rejected')}
            className="flex-1"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}
      {isResolved && (
        <div className="p-2 text-center text-xs font-mono text-muted-foreground bg-[#161B22] border-t border-border/50">
          Sandbox execution completed.
        </div>
      )}
    </div>
  );
}
