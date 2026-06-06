"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockJiraTickets, JiraTicket } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface KanbanBoardProps {
  onTicketClick: (ticket: JiraTicket) => void;
}

export function KanbanBoard({ onTicketClick }: KanbanBoardProps) {
  const columns = ["To Do", "In Progress", "Done"] as const;

  return (
    <div className="flex h-full gap-6 p-6 overflow-x-auto">
      {columns.map((col) => (
        <div key={col} className="flex-shrink-0 w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold text-lg">{col}</h2>
            <Badge variant="secondary">
              {mockJiraTickets.filter((t) => t.status === col).length}
            </Badge>
          </div>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {mockJiraTickets
              .filter((t) => t.status === col)
              .map((ticket) => (
                <Card
                  key={ticket.id}
                  className="cursor-pointer hover:border-blue-500 transition-colors shadow-sm hover:shadow-md"
                  onClick={() => onTicketClick(ticket)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-sm font-medium leading-tight">
                        {ticket.title}
                      </CardTitle>
                      <Badge
                        variant={
                          ticket.priority === "High"
                            ? "destructive"
                            : ticket.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-[10px] px-1 py-0 h-4"
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                    <p className="line-clamp-2 mb-3">{ticket.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                        {ticket.id}
                      </span>
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[8px]">
                          {ticket.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
