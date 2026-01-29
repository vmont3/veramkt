import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Clock, CheckCircle, XCircle, Mic, Paperclip, X, Play, Pause, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface Message {
    id: string;
    sender: 'user' | 'admin';
    message: string;
    createdAt: string;
    isRead: boolean;
}

interface Chat {
    id: string;
    userId: string;
    status: 'open' | 'closed' | 'pending';
    subject?: string;
    lastMessage?: string;
    unreadCount: number;
    messages?: Message[];
    createdAt: string;
    updatedAt: string;
}

export default function SupportChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Media State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat and messages on mount
    useEffect(() => {
        loadChat();
        // Poll for new messages every 5 seconds
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadChat = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/support/chats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success && response.data.data.length > 0) {
                // Get most recent open chat
                const openChat = response.data.data.find((c: Chat) => c.status === 'open') || response.data.data[0];
                setCurrentChat(openChat);
                await loadMessages(openChat.id);
            }
        } catch (err: any) {
            console.error('Error loading chat:', err);
        }
    };

    const loadMessages = async (chatId?: string) => {
        if (!chatId && !currentChat?.id) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/api/support/chats/${chatId || currentChat?.id}/messages`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setMessages(response.data.data);
            }
        } catch (err: any) {
            console.error('Error loading messages:', err);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const file = new File([blob], "voice_message.webm", { type: 'audio/webm' });
                setAttachedFile(file);
                setIsRecording(false);
                setRecordingTime(0);
                if (timerRef.current) clearInterval(timerRef.current);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);

            // Timer
            let seconds = 0;
            timerRef.current = setInterval(() => {
                seconds++;
                setRecordingTime(seconds);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Erro ao acessar microfone. Verifique as permissões.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
        }
    };

    const cancelRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setAttachedFile(null); // Discard
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    const removeAttachment = () => {
        setAttachedFile(null);
    };

    const uploadFileToBackend = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/api/files/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.file?.id || response.data.id;
        } catch (err) {
            console.error("Upload failed", err);
            return null;
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() && !attachedFile) return;

        setLoading(true);
        setError('');

        try {
            let uploadedFileId = null;
            if (attachedFile) {
                setUploadingFile(true);
                uploadedFileId = await uploadFileToBackend(attachedFile);
                setUploadingFile(false);
                if (!uploadedFileId) {
                    throw new Error("Falha no upload do arquivo");
                }
            }

            const token = localStorage.getItem('token');
            const payload: any = {
                message: newMessage,
                subject: currentChat?.subject || 'Suporte'
            };

            if (uploadedFileId) {
                payload.files = [uploadedFileId];
            }

            const response = await axios.post(
                `${API_URL}/api/support/chats`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setNewMessage('');
                setAttachedFile(null);
                setCurrentChat(response.data.data.chat);
                await loadMessages(response.data.data.chat.id);

                // Play audio response if available
                if (response.data.data.responseAudio) {
                    const audioId = response.data.data.responseAudio;
                    const audioUrl = `${API_URL}/api/files/${audioId}/download`; // Assuming download route
                    const audio = new Audio(audioUrl);
                    audio.play().catch(e => console.error("Auto-play blocked:", e));
                }
            }
        } catch (err: any) {
            console.error("Send error:", err);
            setError(err.response?.data?.error || err.message || 'Erro ao enviar mensagem');
        } finally {
            setLoading(false);
            setUploadingFile(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-green-500';
            case 'pending': return 'bg-yellow-500';
            case 'closed': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'open': return 'Aberto';
            case 'pending': return 'Aguardando Resposta';
            case 'closed': return 'Fechado';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <MessageCircle className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Chat de Suporte</h1>
                                <p className="text-white/60 text-sm">Estamos aqui para ajudar você</p>
                            </div>
                        </div>
                        {currentChat && (
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(currentChat.status)} animate-pulse`}></div>
                                <span className="text-white/80 text-sm font-medium">
                                    {getStatusText(currentChat.status)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                    {/* Messages Area */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-white/60">
                                <MessageCircle size={64} className="mb-4 opacity-50" />
                                <p className="text-lg">Nenhuma mensagem ainda</p>
                                <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'user'
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                            : 'bg-white/20 text-white border border-white/10'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        <div className="flex items-center gap-2 mt-2 opacity-70">
                                            <Clock size={12} />
                                            <span className="text-xs">
                                                {new Date(msg.createdAt).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            {msg.sender === 'user' && (
                                                msg.isRead ? (
                                                    <CheckCircle size={12} className="text-green-300" />
                                                ) : (
                                                    <Clock size={12} className="text-yellow-300" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white/10 p-4 bg-white/5">
                        {error && (
                            <div className="mb-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center gap-2">
                                <XCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Attachment Preview */}
                        {attachedFile && (
                            <div className="mb-3 p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Paperclip size={14} className="text-purple-300 flex-shrink-0" />
                                    <span className="text-sm text-purple-100 truncate">{attachedFile.name}</span>
                                    <span className="text-xs text-purple-300">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <button onClick={removeAttachment} className="p-1 hover:bg-white/10 rounded-full text-purple-200">
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Recording UI */}
                        {isRecording ? (
                            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-2 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                    <span className="text-white font-mono font-bold">{formatTime(recordingTime)}</span>
                                    <span className="text-red-300 text-sm">Gravando áudio...</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={cancelRecording} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors" title="Cancelar">
                                        <Trash2 size={18} />
                                    </button>
                                    <button onClick={stopRecording} className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors animate-bounce" title="Finalizar e Enviar">
                                        <CheckCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={sendMessage} className="flex gap-3 items-end">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept="image/*,video/*,audio/*"
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`p-3 rounded-xl border border-white/20 hover:bg-white/10 text-white/70 hover:text-white transition-all ${attachedFile ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-white/5'}`}
                                    title="Anexar arquivo"
                                    disabled={loading}
                                >
                                    <Paperclip size={20} />
                                </button>

                                <button
                                    type="button"
                                    onClick={startRecording}
                                    className="p-3 rounded-xl bg-white/5 border border-white/20 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 text-white/70 transition-all"
                                    title="Gravar áudio"
                                    disabled={loading || !!attachedFile}
                                >
                                    <Mic size={20} />
                                </button>

                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={loading ? "Enviando..." : "Digite sua mensagem..."}
                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || (!newMessage.trim() && !attachedFile)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-6 py-3 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-purple-500/50"
                                >
                                    {loading || uploadingFile ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="hidden sm:inline">{uploadingFile ? 'Enviando mídia...' : 'Enviando...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span className="hidden sm:inline">Enviar</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                        <p className="text-white/40 text-xs mt-3 text-center">
                            💬 Suporte VERA IA | Envie áudios, imagens ou vídeos para análise
                        </p>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <CheckCircle size={16} className="text-green-400" />
                            </div>
                            <h3 className="text-white font-medium">Rápido</h3>
                        </div>
                        <p className="text-white/60 text-sm">Resposta em poucos minutos</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <MessageCircle size={16} className="text-blue-400" />
                            </div>
                            <h3 className="text-white font-medium">Direto</h3>
                        </div>
                        <p className="text-white/60 text-sm">Fale diretamente com nossa equipe</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Clock size={16} className="text-purple-400" />
                            </div>
                            <h3 className="text-white font-medium">24/7</h3>
                        </div>
                        <p className="text-white/60 text-sm">Disponível a qualquer momento</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
