"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { JiraTicket } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PrApproval } from "./pr-approval";

interface ChatPanelProps {
  ticket: JiraTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatPanel({ ticket, open, onOpenChange }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const { messages, sendMessage, setMessages, status, addToolResult, error } = useChat({
    id: ticket?.id ?? "default-chat",
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        ticketId: ticket?.id,
        ticketContext: ticket ? `${ticket.id}: ${ticket.title} - ${ticket.description}` : "",
      },
    }),
    onToolCall: ({ toolCall }) => {
      // Optional logging or intercepting
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status !== 'ready' && status !== 'error';

  // Clear messages when a new ticket is selected
  useEffect(() => {
    if (open && ticket) {
      setMessages([
        {
          id: "system-init",
          role: "assistant",
          parts: [{ type: "text", text: `Hi! I'm your AI context assistant. I can help you with ${ticket.id}: "${ticket.title}". What would you like to do? I can look up Confluence docs, draft a plan, or even propose a PR.` }],
        },
      ] as any);
    }
  }, [ticket, open, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-0 flex flex-col gap-0 border-l border-border/50 shadow-2xl">
        <SheetHeader className="p-4 border-b bg-muted/30">
          <SheetTitle className="flex items-center gap-2">
            <span className="font-mono text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
              {ticket?.id}
            </span>
            {ticket?.title}
          </SheetTitle>
          <SheetDescription className="line-clamp-1">
            Agentic workflow environment.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4 pb-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-sm ${m.role === "user" ? "flex-row-reverse" : ""
                  }`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`flex flex-col gap-2 max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"
                    }`}
                >
                  {/* Render parts (text, tools) directly for v4 Generative UI */}
                  {m.parts?.map((part: any, index: number) => {
                    if (part.type === 'text') {
                      return (
                        <div
                          key={`text-${index}`}
                          className={`p-3 rounded-2xl ${m.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 border shadow-sm"
                            }`}
                        >
                          {part.text}
                        </div>
                      );
                    }

                    if (part.type.startsWith('tool-')) {
                      const toolName = part.type.replace('tool-', '');
                      const toolCallId = part.toolCallId;

                      if (toolName === 'proposePullRequest') {
                        return (
                          <PrApproval
                            key={toolCallId}
                            repo={part.input?.repo as string}
                            codeChanges={part.input?.codeChanges as string}
                            status={(part.state === 'output-available' ? part.output : 'pending') as any}
                            onAction={(action) => {
                              addToolResult({ tool: toolName, toolCallId, output: action } as any);
                            }}
                          />
                        );
                      }

                      if (part.state === 'output-available') {
                        return (
                          <div key={toolCallId} className="p-3 bg-secondary/50 rounded-xl border text-xs text-muted-foreground font-mono whitespace-pre-wrap w-full max-w-full overflow-x-auto">
                            <span className="font-bold text-foreground">Tool Call Resolved: {toolName}</span>
                            <br />
                            {JSON.stringify(part.output, null, 2)}
                          </div>
                        )
                      }

                      return (
                        <div key={toolCallId} className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50 animate-pulse">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Calling tool: <span className="font-mono">{toolName}</span>...
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 text-sm">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col gap-2">
          {error && (
            <div className="text-xs text-destructive p-2 bg-destructive/10 rounded-md border border-destructive/20 font-mono">
              Error: {error.message}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI to help with this ticket..."
              className="flex-1 shadow-inner focus-visible:ring-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
