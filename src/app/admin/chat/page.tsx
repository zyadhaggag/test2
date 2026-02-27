'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { Send, Circle } from 'lucide-react';
import type { Profile, Message } from '@/lib/supabase/types';

export default function AdminChatPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const { user: admin } = useAuthStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        async function fetchUsers() {
            const { data } = await supabase.from('profiles').select('*').eq('role', 'user').order('created_at', { ascending: false });
            if (data) setUsers(data);
        }
        fetchUsers();
    }, [supabase]);

    useEffect(() => {
        if (!selectedUser || !admin) return;

        async function loadMessages() {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .or(
                    `and(sender_id.eq.${admin!.id},receiver_id.eq.${selectedUser!.id}),and(sender_id.eq.${selectedUser!.id},receiver_id.eq.${admin!.id})`
                )
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        }

        loadMessages();

        const channel = supabase
            .channel(`admin-chat-${selectedUser.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new as Message;
                if (
                    (newMsg.sender_id === selectedUser.id && newMsg.receiver_id === admin!.id) ||
                    (newMsg.sender_id === admin!.id && newMsg.receiver_id === selectedUser.id)
                ) {
                    setMessages((prev) => {
                        const exists = prev.find((m) => m.id === newMsg.id);
                        return exists ? prev : [...prev, newMsg];
                    });
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [selectedUser, admin, supabase]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !admin || !selectedUser) return;
        await supabase.from('messages').insert({
            sender_id: admin.id,
            receiver_id: selectedUser.id,
            content: input.trim(),
            read: false,
        });
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-8rem)]">
            {/* User List */}
            <div className="w-72 bg-ultra-card border border-ultra-border rounded-ultra flex flex-col overflow-hidden">
                <div className="px-4 py-4 border-b border-ultra-border">
                    <h3 className=" font-bold text-ultra-silver-bright">المحادثات</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {users.map((u) => (
                        <button
                            key={u.id}
                            onClick={() => setSelectedUser(u)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-all duration-ultra hover:bg-ultra-surface/50 ${selectedUser?.id === u.id ? 'bg-ultra-surface border-r-2 border-ultra-silver-bright' : ''
                                }`}
                        >
                            <div className="w-9 h-9 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-ultra-silver-bright">{u.full_name?.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-ultra-silver-bright truncate">{u.full_name}</p>
                                <div className="flex items-center gap-1">
                                    <Circle size={6} className={u.status === 'active' ? 'fill-ultra-accent text-ultra-accent' : 'fill-ultra-silver-dark text-ultra-silver-dark'} />
                                    <span className="text-xs text-ultra-silver-muted">{u.status === 'active' ? 'متصل' : 'غير متصل'}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-ultra-card border border-ultra-border rounded-ultra flex flex-col overflow-hidden">
                {selectedUser ? (
                    <>
                        <div className="px-6 py-4 border-b border-ultra-border flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center">
                                <span className="font-bold text-ultra-silver-bright">{selectedUser.full_name?.charAt(0)}</span>
                            </div>
                            <div>
                                <p className=" font-bold text-ultra-silver-bright">{selectedUser.full_name}</p>
                                <div className="flex items-center gap-1">
                                    <Circle size={6} className={selectedUser.status === 'active' ? 'fill-ultra-accent text-ultra-accent' : 'fill-ultra-silver-dark text-ultra-silver-dark'} />
                                    <span className="text-xs text-ultra-silver-muted">{selectedUser.status === 'active' ? 'متصل' : 'غير متصل'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {messages.map((msg) => {
                                const isAdmin = msg.sender_id === admin?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[70%] px-4 py-2.5 rounded-ultra text-sm leading-relaxed ${isAdmin
                                            ? 'bg-ultra-surface border border-ultra-border text-ultra-silver-bright'
                                            : 'bg-ultra-bg-secondary border border-ultra-border text-ultra-silver'
                                            }`}>
                                            <p>{msg.content}</p>
                                            <span className="block text-[10px] text-ultra-silver-dark mt-1.5">
                                                {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="px-6 py-4 border-t border-ultra-border">
                            <div className="flex items-center gap-2 bg-ultra-surface border border-ultra-border rounded-ultra px-4 py-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="اكتب رسالتك..."
                                    className="flex-1 bg-transparent text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none"
                                />
                                <button onClick={handleSend} disabled={!input.trim()} className="p-2 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-card transition-all duration-ultra disabled:opacity-30">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-ultra-silver-muted">اختر محادثة للبدء</p>
                    </div>
                )}
            </div>
        </div>
    );
}
