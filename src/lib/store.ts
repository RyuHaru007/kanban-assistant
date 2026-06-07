import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UIMessage } from 'ai';

interface ChatStore {
  chats: Record<string, UIMessage[]>;
  saveChat: (ticketId: string, messages: UIMessage[]) => void;
  getChat: (ticketId: string) => UIMessage[] | undefined;
  clearAllChats: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: {},
      saveChat: (ticketId, messages) => 
        set((state) => ({
          chats: {
            ...state.chats,
            [ticketId]: messages,
          },
        })),
      getChat: (ticketId) => get().chats[ticketId],
      clearAllChats: () => set({ chats: {} }),
    }),
    {
      name: 'enterprise-ai-hub-chat',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
