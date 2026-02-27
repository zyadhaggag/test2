import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Message } from '@/lib/supabase/types';

interface ChatState {
    messages: Message[];
    isOpen: boolean;
    activeConversationUserId: string | null;
    isLoading: boolean;
    openChat: () => void;
    closeChat: () => void;
    setActiveConversation: (userId: string) => void;
    loadMessages: (userId1: string, userId2: string) => Promise<void>;
    sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
    subscribeToMessages: (userId: string) => () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    isOpen: false,
    activeConversationUserId: null,
    isLoading: false,

    openChat: () => set({ isOpen: true }),
    closeChat: () => set({ isOpen: false }),

    setActiveConversation: (userId) => set({ activeConversationUserId: userId }),

    loadMessages: async (userId1, userId2) => {
        set({ isLoading: true });
        const supabase = createClient();
        const { data } = await supabase
            .from('messages')
            .select('*, sender:profiles!sender_id(full_name, avatar_url)')
            .or(
                `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`
            )
            .order('created_at', { ascending: true });
        set({ messages: (data as Message[]) || [], isLoading: false });
    },

    sendMessage: async (senderId, receiverId, content) => {
        const supabase = createClient();
        await supabase.from('messages').insert({
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            read: false,
        });
    },

    subscribeToMessages: (userId) => {
        const supabase = createClient();
        const channel = supabase
            .channel('realtime-messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${userId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    set({ messages: [...get().messages, newMessage] });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `sender_id=eq.${userId}`,
                },
                (payload) => {
                    const existing = get().messages.find((m) => m.id === (payload.new as Message).id);
                    if (!existing) {
                        set({ messages: [...get().messages, payload.new as Message] });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },
}));
