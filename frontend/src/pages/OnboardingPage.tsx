import React, { useState, useEffect } from 'react';
import { Globe, Zap, Clock, CheckCircle, Loader, Sparkles, Target, Package, Users, Award, Palette, MessageSquare } from 'lucide-react';

interface BrandVoice {
    tone: string;
    personality: string[];
    writingStyle: string;
    vocabulary: string[];
}

interface Product {
    name: string;
    description: string;
    category: string;
    price?: string;
}

interface TargetAudience {
    demographics: string;
    painPoints: string[];
    goals: string[];
}

interface WebsiteAnalysis {
    url: string;
    brandName: string;
    brandVoice: BrandVoice;
    products: Product[];
    targetAudience: TargetAudience;
    competitors: string[];
    uniqueSellingPoints: string[];
    colorPalette: string[];
    contentExamples: {
        headlines: string[];
        descriptions: string[];
        ctas: string[];
    };
    metadata: {
        industry: string;
        location?: string;
        socialMedia: {
            instagram?: string;
            facebook?: string;
            linkedin?: string;
            twitter?: string;
        };
    };
}

type AnalysisStatus = 'idle' | 'scanning' | 'analyzing' | 'completed' | 'error';

export default function OnboardingPage() {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [status, setStatus] = useState<AnalysisStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
    const [isQuickScan, setIsQuickScan] = useState(false);

    useEffect(() => {
        // Simulate progress updates
        if (status === 'scanning' || status === 'analyzing') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 10;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [status]);

    const startQuickScan = async () => {
        if (!websiteUrl) {
            alert('Por favor, insira uma URL');
            return;
        }

        setIsQuickScan(true);
        setStatus('scanning');
        setProgress(10);
        setProgressMessage('Analisando website...');

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/onboarding/quick-scan`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ url: websiteUrl, userId })
                }
            );

            if (response.ok) {
                const data = await response.json();
                setProgress(100);
                setProgressMessage('Análise rápida concluída!');
                setAnalysis(data.analysis);
                setStatus('completed');
            } else {
                throw new Error('Failed to scan website');
            }
        } catch (error) {
            console.error('Quick scan error:', error);
            setStatus('error');
            setProgressMessage('Erro ao analisar website');
        }
    };

    const startFullAnalysis = async () => {
        if (!websiteUrl) {
            alert('Por favor, insira uma URL');
            return;
        }

        setIsQuickScan(false);
        setStatus('scanning');
        setProgress(5);
        setProgressMessage('Iniciando análise completa...');

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            // Start the analysis
            const startResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/onboarding/learn-website`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ url: websiteUrl, userId })
                }
            );

            if (!startResponse.ok) {
                throw new Error('Failed to start analysis');
            }

            setProgress(10);
            setProgressMessage('Crawling website...');

            // Poll for status
            const pollInterval = setInterval(async () => {
                const statusResponse = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/onboarding/status/${userId}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();

                    if (statusData.hasAnalysis && statusData.status === 'completed') {
                        clearInterval(pollInterval);

                        // Fetch the full analysis
                        const analysisResponse = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}/api/onboarding/analysis/${userId}`,
                            {
                                headers: { 'Authorization': `Bearer ${token}` }
                            }
                        );

                        if (analysisResponse.ok) {
                            const analysisData = await analysisResponse.json();
                            setAnalysis(analysisData.analysis);
                            setProgress(100);
                            setProgressMessage('Análise completa concluída!');
                            setStatus('completed');
                        }
                    } else {
                        // Update progress message
                        setProgress(prev => Math.min(prev + 5, 90));
                        setProgressMessage('Analisando brand voice, produtos e audiência...');
                    }
                }
            }, 3000); // Poll every 3 seconds

            // Timeout after 5 minutes
            setTimeout(() => {
                clearInterval(pollInterval);
                if (status !== 'completed') {
                    setStatus('error');
                    setProgressMessage('Análise demorou muito tempo');
                }
            }, 300000);

        } catch (error) {
            console.error('Full analysis error:', error);
            setStatus('error');
            setProgressMessage('Erro ao analisar website');
        }
    };

    const saveToBrandProfile = async () => {
        alert('Brand profile salvo com sucesso! (TODO: Implementar integração com Brand model)');
    };

    const resetAnalysis = () => {
        setStatus('idle');
        setProgress(0);
        setProgressMessage('');
        setAnalysis(null);
        setWebsiteUrl('');
    };

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Sparkles className="text-purple-400" /> Auto-Learn from Website
                </h1>
                <p className="text-gray-400 mt-2">
                    Analise automaticamente qualquer website e extraia brand voice, produtos, audiência e mais.
                    10x mais rápido que onboarding manual.
                </p>
            </div>

            {/* URL Input Section */}
            {status === 'idle' && (
                <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-2xl p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Globe className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Insira a URL do Website</h3>
                            <p className="text-gray-400 text-sm">
                                Cole a URL do website que você deseja analisar. Pode ser seu próprio site ou de qualquer concorrente.
                            </p>
                        </div>
                    </div>

                    <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg mb-4"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <button
                            onClick={startQuickScan}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Zap size={20} /> Quick Scan (30 segundos)
                        </button>
                        <button
                            onClick={startFullAnalysis}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Sparkles size={20} /> Full Analysis (2-3 minutos)
                        </button>
                    </div>

                    <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                <Zap size={16} /> Quick Scan
                            </h4>
                            <ul className="text-gray-400 space-y-1 text-xs">
                                <li>• Brand voice (tone, personality)</li>
                                <li>• Writing style</li>
                                <li>• ~30 segundos</li>
                            </ul>
                        </div>
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                            <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                                <Sparkles size={16} /> Full Analysis
                            </h4>
                            <ul className="text-gray-400 space-y-1 text-xs">
                                <li>• Tudo do Quick Scan +</li>
                                <li>• Produtos/serviços</li>
                                <li>• Target audience</li>
                                <li>• USPs, colors, competitors</li>
                                <li>• ~2-3 minutos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Section */}
            {(status === 'scanning' || status === 'analyzing') && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                    <div className="flex items-center justify-center mb-6">
                        <Loader className="animate-spin text-purple-400" size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-white text-center mb-2">
                        {isQuickScan ? 'Quick Scan em Andamento...' : 'Full Analysis em Andamento...'}
                    </h3>
                    <p className="text-gray-400 text-center mb-6">{progressMessage}</p>

                    <div className="bg-gray-800 rounded-full h-4 overflow-hidden mb-2">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-4 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-center text-gray-500 text-sm">{Math.round(progress)}%</p>
                </div>
            )}

            {/* Error Section */}
            {status === 'error' && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center">
                    <div className="text-red-400 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-white mb-2">Erro na Análise</h3>
                    <p className="text-gray-400 mb-6">{progressMessage}</p>
                    <button
                        onClick={resetAnalysis}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-xl"
                    >
                        Tentar Novamente
                    </button>
                </div>
            )}

            {/* Analysis Results */}
            {status === 'completed' && analysis && (
                <div className="space-y-6">
                    {/* Success Header */}
                    <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CheckCircle className="text-green-400" size={32} />
                            <div>
                                <h3 className="text-xl font-bold text-white">Análise Concluída!</h3>
                                <p className="text-gray-400 text-sm">
                                    {analysis.brandName} • {analysis.metadata.industry}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={resetAnalysis}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl"
                            >
                                Nova Análise
                            </button>
                            <button
                                onClick={saveToBrandProfile}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-xl"
                            >
                                Salvar no Perfil
                            </button>
                        </div>
                    </div>

                    {/* Brand Voice */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <MessageSquare className="text-blue-400" /> Brand Voice
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-gray-400 text-xs uppercase mb-2">Tone</p>
                                <p className="text-white font-medium">{analysis.brandVoice.tone}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase mb-2">Writing Style</p>
                                <p className="text-white font-medium">{analysis.brandVoice.writingStyle}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase mb-2">Personality</p>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.brandVoice.personality.map((trait, idx) => (
                                        <span key={idx} className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {analysis.brandVoice.vocabulary.length > 0 && (
                            <div className="mt-4">
                                <p className="text-gray-400 text-xs uppercase mb-2">Common Vocabulary</p>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.brandVoice.vocabulary.slice(0, 10).map((word, idx) => (
                                        <span key={idx} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                                            "{word}"
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Products */}
                    {analysis.products && analysis.products.length > 0 && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Package className="text-green-400" /> Products & Services
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {analysis.products.slice(0, 6).map((product, idx) => (
                                    <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                        <h5 className="text-white font-medium mb-1">{product.name}</h5>
                                        <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">
                                                {product.category}
                                            </span>
                                            {product.price && (
                                                <span className="text-gray-500">{product.price}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Target Audience */}
                    {analysis.targetAudience && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="text-purple-400" /> Target Audience
                            </h4>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase mb-2">Demographics</p>
                                    <p className="text-white text-sm">{analysis.targetAudience.demographics}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase mb-2">Pain Points</p>
                                    <ul className="space-y-1">
                                        {analysis.targetAudience.painPoints.map((pain, idx) => (
                                            <li key={idx} className="text-sm text-gray-300">• {pain}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase mb-2">Goals</p>
                                    <ul className="space-y-1">
                                        {analysis.targetAudience.goals.map((goal, idx) => (
                                            <li key={idx} className="text-sm text-gray-300">• {goal}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USPs & Colors Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* USPs */}
                        {analysis.uniqueSellingPoints && analysis.uniqueSellingPoints.length > 0 && (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Award className="text-yellow-400" /> Unique Selling Points
                                </h4>
                                <ul className="space-y-2">
                                    {analysis.uniqueSellingPoints.map((usp, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                                            <span className="text-yellow-400 mt-1">✓</span>
                                            <span>{usp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Color Palette */}
                        {analysis.colorPalette && analysis.colorPalette.length > 0 && (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Palette className="text-pink-400" /> Color Palette
                                </h4>
                                <div className="flex gap-3">
                                    {analysis.colorPalette.map((color, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-2">
                                            <div
                                                className="w-16 h-16 rounded-lg border-2 border-gray-700"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-gray-400 text-xs font-mono">{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Social Media & Metadata */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-white mb-4">Metadata & Social Media</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-400 text-xs uppercase mb-2">Industry</p>
                                <p className="text-white">{analysis.metadata.industry}</p>
                                {analysis.metadata.location && (
                                    <>
                                        <p className="text-gray-400 text-xs uppercase mb-2 mt-3">Location</p>
                                        <p className="text-white">{analysis.metadata.location}</p>
                                    </>
                                )}
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase mb-2">Social Media</p>
                                <div className="space-y-1">
                                    {analysis.metadata.socialMedia.instagram && (
                                        <p className="text-sm text-gray-300">Instagram: @{analysis.metadata.socialMedia.instagram}</p>
                                    )}
                                    {analysis.metadata.socialMedia.twitter && (
                                        <p className="text-sm text-gray-300">Twitter: @{analysis.metadata.socialMedia.twitter}</p>
                                    )}
                                    {analysis.metadata.socialMedia.linkedin && (
                                        <p className="text-sm text-gray-300">LinkedIn: {analysis.metadata.socialMedia.linkedin}</p>
                                    )}
                                    {analysis.metadata.socialMedia.facebook && (
                                        <p className="text-sm text-gray-300">Facebook: {analysis.metadata.socialMedia.facebook}</p>
                                    )}
                                    {!analysis.metadata.socialMedia.instagram &&
                                        !analysis.metadata.socialMedia.twitter &&
                                        !analysis.metadata.socialMedia.linkedin &&
                                        !analysis.metadata.socialMedia.facebook && (
                                            <p className="text-sm text-gray-500">Nenhuma rede social detectada</p>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
