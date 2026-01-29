/**
 * API Key Settings Component
 *
 * Add this to SettingsPage to allow users to generate and manage API keys for tracking script
 *
 * Usage in SettingsPage:
 * import ApiKeySettings from '../components/ApiKeySettings';
 *
 * <ApiKeySettings />
 */

import React, { useState, useEffect } from 'react';
import { Key, Copy, Eye, EyeOff, RefreshCw, Code } from 'lucide-react';

export default function ApiKeySettings() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchApiKey();
    }, []);

    const fetchApiKey = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setApiKey(data.apiKey || null);
            }
        } catch (error) {
            console.error('Failed to fetch API key:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateApiKey = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/generate-api-key`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                const data = await response.json();
                setApiKey(data.apiKey);
                alert('✅ API Key gerada com sucesso!');
            } else {
                alert('❌ Erro ao gerar API Key');
            }
        } catch (error) {
            console.error('Failed to generate API key:', error);
            alert('❌ Erro de conexão');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const trackingScriptCode = apiKey ? `<!-- VERA Tracking Script -->
<script src="${import.meta.env.VITE_BACKEND_URL || 'https://api.vera.ai'}/vera-track.js" data-vera-key="${apiKey}"></script>` : '';

    if (isLoading) {
        return <div className="p-6 text-gray-400">Carregando...</div>;
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                        <Key className="text-purple-400" /> Tracking Script & API Key
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Gere uma API key para instalar o tracking script e detectar hot leads no seu website.
                    </p>
                </div>
                {apiKey && (
                    <button
                        onClick={generateApiKey}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Regenerar API Key"
                    >
                        <RefreshCw size={18} />
                    </button>
                )}
            </div>

            {/* API Key Display */}
            {apiKey ? (
                <div className="space-y-4">
                    {/* API Key Field */}
                    <div>
                        <label className="text-gray-400 text-xs uppercase font-bold mb-2 block">
                            Sua API Key
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-white flex items-center justify-between">
                                <span>{showKey ? apiKey : '•'.repeat(40)}</span>
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="text-gray-400 hover:text-white ml-2"
                                >
                                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <button
                                onClick={() => copyToClipboard(apiKey)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Copy size={16} />
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                    </div>

                    {/* Installation Instructions */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <Code size={16} className="text-blue-400" /> Instalação
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Adicione este código no <code className="bg-gray-900 px-2 py-1 rounded text-xs">&lt;head&gt;</code> do seu website:
                        </p>
                        <div className="bg-gray-900 rounded-lg p-3 relative group">
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                                <code>{trackingScriptCode}</code>
                            </pre>
                            <button
                                onClick={() => copyToClipboard(trackingScriptCode)}
                                className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Copy size={12} className="inline mr-1" />
                                Copiar
                            </button>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                            <h5 className="text-blue-400 font-bold text-sm mb-1">📊 Tracking Automático</h5>
                            <p className="text-gray-400 text-xs">
                                Page views, formulários, cliques, downloads e mais
                            </p>
                        </div>
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                            <h5 className="text-purple-400 font-bold text-sm mb-1">🔥 Hot Lead Detection</h5>
                            <p className="text-gray-400 text-xs">
                                Detecta visitantes com alta intenção de compra
                            </p>
                        </div>
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                            <h5 className="text-green-400 font-bold text-sm mb-1">⚡ Real-Time Alerts</h5>
                            <p className="text-gray-400 text-xs">
                                Alertas instantâneos quando lead fica "quente"
                            </p>
                        </div>
                    </div>

                    {/* Documentation Link */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                        <p className="text-gray-500 text-xs">
                            ⚠️ Mantenha sua API key segura. Não compartilhe publicamente.
                        </p>
                        <a
                            href="/guia-integracoes#tracking-script"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                            Ver Documentação →
                        </a>
                    </div>
                </div>
            ) : (
                // No API Key Yet
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Key className="text-purple-400" size={32} />
                    </div>
                    <h4 className="text-white font-bold mb-2">Nenhuma API Key Gerada</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                        Gere uma API key para começar a rastrear visitantes e detectar hot leads automaticamente no seu website.
                    </p>
                    <button
                        onClick={generateApiKey}
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 mx-auto transition-colors"
                    >
                        <Key size={18} />
                        {isLoading ? 'Gerando...' : 'Gerar API Key'}
                    </button>
                </div>
            )}
        </div>
    );
}
