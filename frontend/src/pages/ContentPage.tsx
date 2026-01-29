import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Filter, X, Share2, Download, MessageSquare, Archive, Trash2, Plus, Send, Brain } from 'lucide-react';

export default function ContentPage() {
    const [selectedContent, setSelectedContent] = useState<any>(null);
    const [showArchived, setShowArchived] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [contents, setContents] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchContent = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/content`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setContents(data);
                }
            } catch (error) {
                console.error("Failed to fetch content data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleArchive = (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (window.confirm("Deseja arquivar este conteúdo?")) {
            setContents(contents.map(c => c.id === id ? { ...c, archived: true } : c));
            setSelectedContent(null);
        }
    }

    const handleCreateNew = async () => {
        const title = prompt("Título da Nova Pauta:");
        if (title) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/content`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        type: 'Instagram', // Default or ask user
                        description: 'Conteúdo solicitado via dashboard'
                    })
                });

                if (response.ok) {
                    alert("✅ Pauta enviada para produção!");
                    // Refresh content
                    const data = await (await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/content`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })).json();
                    setContents(data);
                } else {
                    alert("Erro ao criar pauta. Verifique se você possui um plano ativo (Marca configurada).");
                }
            } catch (error) {
                console.error("Failed to create content", error);
                alert("Erro de conexão.");
            }
        }
    }

    const handleStatusChange = (id: number, newStatus: string) => {
        setContents(contents.map(c => c.id === id ? { ...c, status: newStatus } : c));
        if (selectedContent && selectedContent.id === id) {
            setSelectedContent({ ...selectedContent, status: newStatus });
        }
        const msg = newStatus === 'approved' ? 'Conteúdo Aprovado com Sucesso!' : 'Solicitação de Ajuste Enviada!';
        alert(`✅ ${msg}`);
        if (newStatus === 'approved') setSelectedContent(null);
    }

    // Filter view
    const visibleContents = contents.filter(c => showArchived ? c.archived : !c.archived);

    const ContentModal = ({ content, onClose }: any) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-[#1A1625] border border-[#292348] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
                {/* Left: Preview */}
                <div className="md:w-1/2 bg-black relative flex items-center justify-center p-4">
                    <img src={content.preview} alt="Preview" className="max-h-full max-w-full rounded-lg shadow-lg border border-white/10 object-contain" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white uppercase border border-white/10">
                        {content.type}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="md:w-1/2 flex flex-col p-6 md:p-8 overflow-y-auto bg-[#141122]">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-white leading-tight">{content.title}</h2>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${content.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            content.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {content.status === 'approved' ? 'Aprovado' : content.status === 'pending' ? 'Aguardando' : 'Rejeitado'}
                        </span>
                        <span className="text-gray-500 text-sm">{content.date}</span>
                    </div>

                    <div className="bg-[#0B0915] rounded-xl p-4 border border-white/5 flex-1 mb-6 font-medium text-gray-300 whitespace-pre-line text-sm leading-relaxed overflow-y-auto max-h-[300px] shadow-inner">
                        {content.text}
                    </div>

                    <div className="mt-auto space-y-3">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                            <label className="text-[10px] font-bold text-blue-400 uppercase mb-2 block flex items-center gap-2">
                                <Brain size={12} /> Instrução para Maestra VERA
                            </label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Ex: Reescreva com tom mais agressivo..." className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
                                <button onClick={() => alert("Instrução enviada para a Rede Neural. A VERA está processando...")} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg" title="Enviar Prompt">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>

                        {content.status === 'pending' ? (
                            <div className="flex gap-4">
                                <button onClick={() => handleStatusChange(content.id, 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl transition-all font-bold shadow-lg shadow-green-900/20">
                                    Aprovar Publicação
                                </button>
                                <button onClick={() => handleStatusChange(content.id, 'rejected')} className="flex-1 bg-[#292348] hover:bg-red-500/10 text-white hover:text-red-400 border border-transparent hover:border-red-500/30 py-3 rounded-xl transition-all font-bold">
                                    Solicitar Alteração
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={() => alert("Publicando conteúdo nas redes sociais...")} className="flex-1 bg-[#292348] hover:bg-white/10 text-white py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 border border-white/5">
                                    <Share2 size={18} /> Publicar
                                </button>
                                <button onClick={() => alert("Iniciando download...")} className="flex-1 bg-[#292348] hover:bg-white/10 text-white py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 border border-white/5">
                                    <Download size={18} /> Baixar
                                </button>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => handleArchive(content.id)}
                                className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-2 transition-colors uppercase font-bold tracking-wider"
                            >
                                <Archive size={14} /> Arquivar Conteúdo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Create Modal Component
    const CreateContentModal = ({ onClose }: any) => {
        const [title, setTitle] = useState('');
        const [type, setType] = useState('Instagram');
        const [description, setDescription] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [files, setFiles] = useState<File[]>([]);
        const [uploading, setUploading] = useState(false);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                setFiles(Array.from(e.target.files));
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!title) return;

            setIsSubmitting(true);
            try {
                const token = localStorage.getItem('token');

                // 1. Upload Files first
                const fileIds: string[] = [];
                if (files.length > 0) {
                    setUploading(true);
                    for (const file of files) {
                        const formData = new FormData();
                        formData.append('file', file);

                        const uploadRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/upload`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` }, // No Content-Type for FormData
                            body: formData
                        });

                        if (uploadRes.ok) {
                            const uploadData = await uploadRes.json();
                            fileIds.push(uploadData.file.id);
                        }
                    }
                    setUploading(false);
                }

                // 2. Create Content Task with File Context
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/content`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        type,
                        description: description || 'Conteúdo solicitado via dashboard',
                        files: fileIds
                    })
                });

                if (response.ok) {
                    alert("✅ Pauta enviada para produção VERA V2!");
                    // Refresh content
                    const data = await (await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/content`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })).json();
                    setContents(data);
                    onClose();
                } else {
                    alert("Erro ao criar pauta. Verifique se você possui um plano ativo.");
                }
            } catch (error) {
                console.error("Failed to create content", error);
                alert("Erro de conexão.");
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-[#1A1625] border border-[#292348] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Nova Pauta</h2>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Título</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-[#0B0915] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                placeholder="Sobre o que vamos falar hoje?"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Plataforma</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-[#0B0915] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
                            >
                                <option value="Instagram">Instagram</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Blog">Blog Post</option>
                                <option value="Email">Email Marketing</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Briefing / Detalhes</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-[#0B0915] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                                placeholder="Dê orientações para a VERA..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Anexos / Referências</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="w-full bg-[#0B0915] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                            />
                            {files.length > 0 && (
                                <p className="text-xs text-green-400 mt-2">{files.length} arquivo(s) selecionado(s)</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (uploading ? 'Enviando Arquivos...' : 'Processando...') : (
                                    <>
                                        <Send size={18} /> Enviar para Produção
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {selectedContent && <ContentModal content={selectedContent} onClose={() => setSelectedContent(null)} />}
            {isCreating && <CreateContentModal onClose={() => setIsCreating(false)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Conteúdo Gerado</h1>
                    <p className="text-gray-400">Gerencie e aprove o material criado pela sua squad.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-colors border border-white/5 ${showArchived ? 'bg-blue-600 text-white' : 'bg-[#292348] text-white hover:bg-[#352F4F]'}`}
                    >
                        <Archive size={18} /> {showArchived ? 'Ocultar Arquivados' : 'Ver Arquivados'}
                    </button>
                    {!showArchived && (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex-1 md:flex-none whitespace-nowrap flex items-center gap-2"
                        >
                            <Plus size={18} /> Nova Pauta
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="p-10 text-center text-gray-500">Carregando conteúdos...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleContents.map((item) => (
                        <div key={item.id} className={`bg-[#1A1625] border border-[#292348] rounded-xl p-6 transition-all group flex flex-col h-full relative ${item.archived ? 'opacity-50 grayscale' : 'hover:border-blue-500/30'}`}>

                            {/* Archive Button on Card */}
                            {!showArchived && (
                                <button
                                    onClick={(e) => handleArchive(item.id, e)}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10 bg-[#1A1625] p-1 rounded"
                                    title="Arquivar"
                                >
                                    <Archive size={18} />
                                </button>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                    {item.status === 'approved' ? 'APROVADO' : item.status === 'pending' ? 'AGUARDANDO' : 'REJEITADO'}
                                </span>
                            </div>

                            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setSelectedContent(item)}>
                                {item.title}
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 mt-auto pt-4">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    {item.type}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {item.date}
                                </span>
                            </div>

                            {!showArchived && (
                                <div className="flex gap-3">
                                    {item.status === 'pending' ? (
                                        <>
                                            <button className="flex-1 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white border border-green-600/30 hover:border-transparent py-2.5 rounded-lg transition-all font-bold text-xs uppercase" onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'approved'); }}>
                                                Aprovar
                                            </button>
                                            <button className="px-3 bg-[#292348] hover:bg-white/10 text-white rounded-lg transition-colors" onClick={() => setSelectedContent(item)}>
                                                <FileText size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button onClick={() => setSelectedContent(item)} className="flex-1 bg-[#292348] hover:bg-white/10 text-gray-300 py-2.5 rounded-lg transition-all text-sm font-medium border border-white/5 hover:border-white/20">
                                                Ver Detalhes
                                            </button>
                                            <button
                                                onClick={(e) => handleArchive(item.id, e)}
                                                className="px-3 bg-[#292348] hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-lg transition-colors"
                                                title="Arquivar para Histórico"
                                            >
                                                <Archive size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {showArchived && (
                                <div className="flex gap-3">
                                    <button className="w-full bg-[#292348] hover:bg-white/10 text-gray-400 py-2 rounded-lg text-xs" onClick={() => {
                                        setContents(contents.map(c => c.id === item.id ? { ...c, archived: false } : c));
                                    }}>
                                        Desarquivar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {
                visibleContents.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <Archive size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Nenhum conteúdo encontrado nesta visualização.</p>
                    </div>
                )
            }
        </div>
    );
}
