"use client";

import { useAuditStore, AuditLog } from "@/lib/audit-store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AuditPage() {
  const [isClient, setIsClient] = useState(false);
  const logs = useAuditStore((state) => state.logs);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Avoid hydration mismatch since we use localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold tracking-tight">Trust & Audit Logs</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="border rounded-md bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No audit logs available.
                  </TableCell>
                </TableRow>
              ) : (
                sortedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        log.actor === 'System' ? 'text-gray-500' :
                        log.actor === 'Agent' ? 'text-blue-500 border-blue-500/30' :
                        'text-green-500 border-green-500/30'
                      }>
                        {log.actor}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.actionType}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        log.status === 'Success' || log.status === 'Approved' ? 'default' :
                        log.status === 'Pending_Human' ? 'secondary' : 'destructive'
                      } className={
                        log.status === 'Success' || log.status === 'Approved' ? 'bg-green-600' :
                        log.status === 'Pending_Human' ? 'bg-yellow-600 text-white' : ''
                      }>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                        View Payload
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-muted rounded-md text-sm font-mono overflow-auto border border-border/50 text-foreground max-h-[400px]">
            <pre>
              {JSON.stringify(selectedLog?.details, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
