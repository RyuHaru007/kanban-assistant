"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { KanbanBoard } from "@/components/kanban-board";
import { ChatPanel } from "@/components/chat-panel";
import { JiraTicket } from "@/lib/mock-data";

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<JiraTicket | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleTicketClick = (ticket: JiraTicket) => {
    setSelectedTicket(ticket);
    setChatOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger />
        <div className="w-full flex-1">
          <h1 className="text-xl font-bold tracking-tight">Active Sprints</h1>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <KanbanBoard onTicketClick={handleTicketClick} />
      </main>

      <ChatPanel
        ticket={selectedTicket}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </div>
  );
}
