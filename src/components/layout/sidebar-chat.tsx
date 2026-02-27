'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useChatStore } from '@/stores/chat-store';
import { useAuthStore } from '@/stores/auth-store';

const ADMIN_ID = 'admin';

export function SidebarChat() {
    const { isOpen, closeChat, messages, loadMessages, sendMessage, subscribeToMessages } = useChatStore();
    const { user } = useAuthStore();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && user) {
            loadMessages(user.id, ADMIN_ID);
            const unsubscribe = subscribeToMessages(user.id);
            return () => unsubscribe();
        }
    }, [isOpen, user, loadMessages, subscribeToMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;
        await sendMessage(user.id, ADMIN_ID, input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    <div className="flex-1 bg-black/40" onClick={closeChat} />
                    <div className="w-full max-w-md bg-ultra-bg-secondary border-r border-ultra-border flex flex-col shadow-ultra animate-[slideInLeft_0.3s_ease]">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-ultra-border">
                            <h3 className=" font-bold text-ultra-silver-bright">الدعم الفني</h3>
                            <button
                                onClick={closeChat}
                                className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all duration-ultra"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {messages.map((msg) => {
                                const isMe = msg.sender_id === user?.id;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`
                        max-w-[80%] px-4 py-2.5 rounded-ultra text-sm leading-relaxed
                        ${isMe
                                                    ? 'bg-ultra-surface border border-ultra-border text-ultra-silver-bright'
                                                    : 'bg-ultra-card border border-ultra-border text-ultra-silver'
                                                }
                      `}
                                        >
                                            <p>{msg.content}</p>
                                            <span className="block text-[10px] text-ultra-silver-dark mt-1.5">
                                                {new Date(msg.created_at).toLocaleTimeString('ar-SA', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="px-4 py-3 border-t border-ultra-border">
                            <div className="flex items-center gap-2 bg-ultra-card border border-ultra-border rounded-ultra px-4 py-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="اكتب رسالتك..."
                                    className="flex-1 bg-transparent text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-2 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all duration-ultra disabled:opacity-30"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <style jsx global>{`
            @keyframes slideInLeft {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
                </div>
            )}
        </>
    );
}
