import { create } from 'zustand';
import { UIMessage } from 'ai';

interface ChatStore {
  chats: Record<string, UIMessage[]>;
  saveChat: (ticketId: string, messages: UIMessage[]) => void;
  getChat: (ticketId: string) => UIMessage[] | undefined;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: {},
  saveChat: (ticketId, messages) => 
    set((state) => ({
      chats: {
        ...state.chats,
        [ticketId]: messages,
      },
    })),
  getChat: (ticketId) => get().chats[ticketId],
}));
