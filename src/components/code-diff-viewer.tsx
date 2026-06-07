import { diffLines } from 'diff';
import { ScrollArea } from "@/components/ui/scroll-area";

export interface CodeDiffViewerProps {
  fileName: string;
  originalCode: string;
  newCode: string;
}

export function CodeDiffViewer({ fileName, originalCode, newCode }: CodeDiffViewerProps) {
  const diffs = diffLines(originalCode || "", newCode || "");

  return (
    <div className="border border-border/50 rounded-md overflow-hidden bg-muted/30 mb-4 shadow-sm">
      <div className="bg-muted px-4 py-2 border-b border-border/50 text-xs font-mono font-bold text-foreground flex justify-between items-center">
        <span>{fileName}</span>
      </div>
      <ScrollArea className="max-h-[300px] w-full">
        <pre className="text-[11px] sm:text-xs font-mono py-2 m-0 min-w-max">
          <code>
            {diffs.map((part, index) => {
              const className = part.added
                ? 'bg-green-500/20 text-green-700 dark:text-green-400 block px-4 w-full'
                : part.removed
                ? 'bg-red-500/20 text-red-700 dark:text-red-400 block px-4 w-full'
                : 'text-muted-foreground block px-4 w-full';

              const prefix = part.added ? '+' : part.removed ? '-' : ' ';
              
              // We split by newline to render prefix per line for a GitHub-like feel
              const lines = part.value.replace(/\n$/, '').split('\n');
              
              return lines.map((line, lineIndex) => (
                <span key={`${index}-${lineIndex}`} className={className}>
                  <span className="inline-block w-4 opacity-50 select-none mr-4 font-bold">{prefix}</span>
                  {line}
                </span>
              ));
            })}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
}
