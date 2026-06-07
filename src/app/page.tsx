"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { KanbanBoard } from "@/components/kanban-board";
import { ChatPanel } from "@/components/chat-panel";
import { JiraTicket } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useChatStore } from "@/lib/store";

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<JiraTicket | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const clearAllChats = useChatStore((state) => state.clearAllChats);

  const handleTicketClick = (ticket: JiraTicket) => {
    setSelectedTicket(ticket);
    setChatOpen(true);
  };

  const handleClearChats = () => {
    if (confirm("Are you sure you want to delete all chat history? This cannot be undone.")) {
      clearAllChats();
      setChatKey(k => k + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold tracking-tight">Active Sprints</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearChats} className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 suppressHydrationWarning className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </header>
      <main className="flex-1 overflow-hidden">
        <KanbanBoard onTicketClick={handleTicketClick} />
      </main>

      <ChatPanel
        key={chatKey}
        ticket={selectedTicket}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </div>
  );
}
