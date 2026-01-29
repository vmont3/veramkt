import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, LogIn, Clock, User, Bot, Paperclip, FileIcon, Loader2, Mic, StopCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SupportChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    sender: 'user' | 'admin';
    message: string;
    createdAt: string;
    file?: {
        name: string;
        type: string;
    };
}

export default function SupportChatModal({ isOpen, onClose }: SupportChatModalProps) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chatId, setChatId] = useState<string | null>(null);

    // File Upload State
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Audio Recording State
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);



    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        if (isOpen && token) {
            loadChat();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadChat = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/support/chats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    const activeChat = data.data.find((c: any) => c.status === 'open') || data.data[0];
                    setChatId(activeChat.id);
                    await loadMessages(activeChat.id);
                } else {
                    setMessages([]);
                }
            }
        } catch (error) {
            console.error("Error loading chat:", error);
        }
    };

    const loadMessages = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/support/chats/${id}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const val = await res.json();
                if (val.success) {
                    setMessages(val.data);
                }
            }
        } catch (error) {
            console.error("Error loading messages", error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], `voice_message_${Date.now()}.webm`, { type: 'audio/webm' });
                setAttachedFile(audioFile);
                setNewMessage("🎤 Mensagem de voz");
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error: any) {
            console.error("Error accessing microphone:", error);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                alert("🚫 O acesso ao microfone foi negado.\n\nPara usar este recurso, você precisa permitir o acesso:\n1. Clique no ícone de cadeado 🔒 ou configurações na barra de endereços do navegador.\n2. Ative a permissão de Microfone.\n3. Tente gravar novamente.");
            } else if (error.name === 'NotFoundError') {
                alert("🎤 Nenhum microfone foi encontrado no seu sistema.");
            } else if (error.name === 'NotReadableError') {
                alert("⚠️ Erro de hardware: O microfone está em uso por outro aplicativo ou com defeito.");
            } else {
                alert("Erro ao acessar microfone. Verifique suas configurações de privacidade.");
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // Stop all tracks to release microphone
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const uploadFileToBackend = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // Check for data.data (standard) or data.file (legacy/alternative)
                const fileData = data.data || data.file;
                if (data.success && fileData && fileData.id) {
                    return fileData.id;
                }
            }
            console.error('Upload failed:', await response.text());
            return null;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() && !attachedFile) return;

        setSending(true);

        try {
            let uploadedFileId = null;

            // 1. Upload file if exists
            if (attachedFile) {
                setUploadingFile(true);
                uploadedFileId = await uploadFileToBackend(attachedFile);
                setUploadingFile(false);
                if (!uploadedFileId) {
                    alert('Erro ao enviar arquivo. Tente novamente.');
                    setSending(false);
                    return;
                }
            }

            const tempId = Date.now().toString();
            // Optimistic UI update
            const tempMsg: Message = {
                id: tempId,
                sender: 'user',
                message: newMessage,
                createdAt: new Date().toISOString(),
                file: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : undefined
            };
            setMessages(prev => [...prev, tempMsg]);
            setNewMessage('');
            setAttachedFile(null); // Clear file after optimistic add

            const token = localStorage.getItem('token');
            const payload: any = { message: tempMsg.message };
            if (uploadedFileId) {
                payload.files = [uploadedFileId];
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/support/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Update state with server response if available
                    if (data.data.responseMessage) {
                        setMessages(prev => [
                            ...prev.filter(m => m.id !== tempId),
                            data.data.message,
                            data.data.responseMessage
                        ]);
                    } else if (data.data.chat?.id) {
                        // Fallback reload
                        setChatId(data.data.chat.id);
                        loadMessages(data.data.chat.id);
                    }
                }
            } else {
                alert('Erro ao enviar mensagem. Tente novamente.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão.');
        } finally {
            setSending(false);
            setUploadingFile(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col border border-gray-700 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                <MessageCircle size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Suporte VERA</h3>
                                <p className="text-xs text-green-400 font-medium tracking-wide">● Online (IA + Humano)</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-900/50 space-y-4">
                        {/* Welcome Message */}
                        <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-5 shadow-sm">
                            <p className="text-sm text-blue-100 leading-relaxed">
                                <strong className="text-blue-400 block mb-1">VERA:</strong>
                                Olá! Sou a VERA, sua assistente de marketing AI 👋
                            </p>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-xl p-3 ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase font-bold tracking-wider">
                                        {msg.sender === 'user' ? <User size={10} /> : <Bot size={10} />}
                                        {msg.sender === 'user' ? 'Você' : 'VERA'}
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                                    {/* File attachment indicator in message bubble */}
                                    {msg.file && (
                                        <div className="mt-2 flex items-center gap-2 bg-black/20 p-2 rounded text-xs">
                                            <FileIcon size={12} />
                                            <span className="truncate max-w-[150px]">{msg.file.name}</span>
                                        </div>
                                    )}

                                    <span className="text-[10px] opacity-40 mt-2 block text-right">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-800 bg-gray-900">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-2">
                                {/* Attached File Preview */}
                                {attachedFile && (
                                    <div className="flex items-center justify-between bg-gray-800 p-2 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <div className="p-1.5 bg-gray-700 rounded text-blue-400">
                                                <FileIcon size={16} />
                                            </div>
                                            <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                                            <span className="text-xs text-gray-500">
                                                ({(attachedFile.size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setAttachedFile(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex gap-2 relative items-end">
                                    {/* File Upload Button */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all h-[50px] w-[50px] flex items-center justify-center"
                                        title="Anexar arquivo"
                                        disabled={isRecording}
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept="image/*,video/*,audio/*,application/pdf"
                                    />

                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={
                                            isRecording
                                                ? "Gravando áudio..."
                                                : attachedFile
                                                    ? "Adicione uma legenda..."
                                                    : "Digite sua mensagem..."
                                        }
                                        className={`flex-1 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all ${isRecording ? 'bg-red-900/20 border-red-500/50 text-red-200' : 'bg-gray-800'
                                            }`}
                                        disabled={sending || isRecording}
                                    />

                                    {/* Mic / Send Button Logic */}
                                    {isRecording ? (
                                        <button
                                            type="button"
                                            onClick={stopRecording}
                                            className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all h-[50px] w-[50px] flex items-center justify-center animate-pulse"
                                            title="Parar gravação"
                                        >
                                            <StopCircle size={20} />
                                        </button>
                                    ) : (
                                        <>
                                            {newMessage.trim() || attachedFile ? (
                                                <button
                                                    type="submit"
                                                    disabled={sending}
                                                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all h-[50px] w-[50px] flex items-center justify-center disabled:opacity-50"
                                                >
                                                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={startRecording}
                                                    className="p-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all h-[50px] w-[50px] flex items-center justify-center"
                                                    title="Gravar áudio"
                                                >
                                                    <Mic size={20} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </form>
                            </div>
                        ) : (
                            <div className="text-center py-2 space-y-3">
                                <p className="text-gray-400 text-sm">Faça login para conversar com a VERA.</p>
                                <div className="flex gap-3 justify-center">
                                    <button onClick={() => { onClose(); navigate('/login'); }} className="text-sm px-4 py-2 bg-gray-800 rounded-lg text-white border border-gray-700">Login</button>
                                    <button onClick={() => { onClose(); navigate('/signup'); }} className="text-sm px-4 py-2 bg-blue-600 rounded-lg text-white">Criar Conta</button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
