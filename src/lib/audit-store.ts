import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Actor = 'System' | 'Agent' | 'Developer';
export type ActionType = 'RAG_RETRIEVAL' | 'TOOL_CALL' | 'HITL_APPROVAL';
export type AuditStatus = 'Success' | 'Pending_Human' | 'Approved' | 'Rejected';

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: Actor;
  actionType: ActionType;
  status: AuditStatus;
  details: string | Record<string, any>;
}

interface AuditStore {
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const mockInitialLogs: AuditLog[] = [
  {
    id: 'audit-mock-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    actor: 'Agent',
    actionType: 'RAG_RETRIEVAL',
    status: 'Success',
    details: { topic: "Authentication Architecture" },
  },
  {
    id: 'audit-mock-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actor: 'Agent',
    actionType: 'TOOL_CALL',
    status: 'Pending_Human',
    details: { tool: "proposePullRequest", repo: "core-api-service" },
  },
  {
    id: 'audit-mock-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
    actor: 'Developer',
    actionType: 'HITL_APPROVAL',
    status: 'Approved',
    details: { tool: "proposePullRequest", decision: "approved", repo: "core-api-service" },
  },
];

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      logs: mockInitialLogs,
      addLog: (log) => 
        set((state) => ({
          logs: [
            {
              ...log,
              id: `audit-${Math.random().toString(36).slice(2, 11)}`,
              timestamp: new Date().toISOString(),
            },
            ...state.logs,
          ],
        })),
      clearLogs: () => set({ logs: mockInitialLogs }),
    }),
    {
      name: 'enterprise-ai-hub-audit',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
