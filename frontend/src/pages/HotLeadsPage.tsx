import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Users, Eye, Clock, Filter, Search, ExternalLink, AlertCircle, Phone, Mail, MessageSquare } from 'lucide-react';

interface VisitorProfile {
    visitorId: string;
    totalScore: number;
    stage: 'cold' | 'warm' | 'hot' | 'qualified';
    signalCount: number;
    sessionCount: number;
    highValueActions: number;
    firstSeen: string;
    lastSeen: string;
    metadata?: any;
}

interface HotLeadStats {
    totalVisitors: number;
    hotLeads: number;
    qualifiedLeads: number;
    conversionRate: number;
}

interface RecentSignal {
    type: string;
    intentScore: number;
    timestamp: string;
    data?: any;
    metadata?: any;
}

interface VisitorDetails extends VisitorProfile {
    recentSignals: RecentSignal[];
}

const stageColors: Record<string, string> = {
    cold: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    warm: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hot: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    qualified: 'bg-green-500/20 text-green-400 border-green-500/30'
};

const stageEmojis: Record<string, string> = {
    cold: '❄️',
    warm: '🌡️',
    hot: '🔥',
    qualified: '⭐'
};

const signalTypeLabels: Record<string, string> = {
    page_view: 'Visualização de Página',
    time_on_page: 'Tempo na Página',
    form_interaction: 'Interação com Formulário',
    button_click: 'Clique em Botão',
    download: 'Download',
    video_watch: 'Assistiu Vídeo',
    search_query: 'Busca',
    repeat_visit: 'Visita Repetida'
};

export default function HotLeadsPage() {
    const [leads, setLeads] = useState<VisitorProfile[]>([]);
    const [stats, setStats] = useState<HotLeadStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState<string>('all');
    const [minScore, setMinScore] = useState(50);
    const [selectedVisitor, setSelectedVisitor] = useState<VisitorDetails | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchHotLeads();
        fetchAnalytics();

        // Real-time updates every 10 seconds
        const interval = setInterval(() => {
            fetchHotLeads();
            fetchAnalytics();
        }, 10000);

        return () => clearInterval(interval);
    }, [minScore]);

    const fetchHotLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!userId) {
                console.error('User ID not found');
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/signals/hot-leads?userId=${userId}&minScore=${minScore}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error('Failed to fetch hot leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!userId) return;

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/signals/analytics?userId=${userId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                const data = await response.json();

                // Calculate stats from analytics
                const totalVisitors = data.uniqueVisitors || 0;
                const stageDistribution = data.stageDistribution || {};
                const hotLeads = (stageDistribution.hot || 0) + (stageDistribution.qualified || 0);
                const qualifiedLeads = stageDistribution.qualified || 0;
                const conversionRate = totalVisitors > 0
                    ? ((qualifiedLeads / totalVisitors) * 100).toFixed(1)
                    : 0;

                setStats({
                    totalVisitors,
                    hotLeads,
                    qualifiedLeads,
                    conversionRate: Number(conversionRate)
                });
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    };

    const fetchVisitorDetails = async (visitorId: string) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!userId) return;

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/signals/profile/${visitorId}?userId=${userId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSelectedVisitor(data);
                setShowDetailsModal(true);
            }
        } catch (error) {
            console.error('Failed to fetch visitor details:', error);
        }
    };

    const alertSalesTeam = async (visitor: VisitorProfile) => {
        // TODO: Integrate with Telegram/Slack alerts
        alert(`🔥 Alerta enviado para o time de vendas!\n\nVisitor: ${visitor.visitorId}\nScore: ${visitor.totalScore}\nStage: ${visitor.stage}`);
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = !searchTerm ||
            lead.visitorId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
        return matchesSearch && matchesStage;
    });

    if (isLoading) {
        return <div className="p-10 text-white text-center">Carregando Hot Leads...</div>;
    }

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Flame className="text-orange-400" /> Hot Leads - Buyer Signals
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Visitantes com alta intenção de compra detectados em tempo real.
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <Clock size={12} /> Atualizado a cada 10 segundos
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                        <p className="text-gray-500 text-xs uppercase font-bold mb-1 flex items-center gap-1">
                            <Users size={12} /> Total Visitors
                        </p>
                        <p className="text-2xl font-bold text-white">{stats.totalVisitors}</p>
                    </div>
                    <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-xl">
                        <p className="text-orange-400 text-xs uppercase font-bold mb-1 flex items-center gap-1">
                            <Flame size={12} /> Hot Leads
                        </p>
                        <p className="text-2xl font-bold text-orange-400">{stats.hotLeads}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                        <p className="text-green-400 text-xs uppercase font-bold mb-1 flex items-center gap-1">
                            <TrendingUp size={12} /> Qualified
                        </p>
                        <p className="text-2xl font-bold text-green-400">{stats.qualifiedLeads}</p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                        <p className="text-blue-400 text-xs uppercase font-bold mb-1">Conversion Rate</p>
                        <p className="text-2xl font-bold text-blue-400">{stats.conversionRate}%</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl flex items-center px-3 py-2 flex-1 max-w-sm">
                    <Search size={16} className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Buscar por visitor ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-white outline-none w-full placeholder-gray-600 text-sm"
                    />
                </div>
                <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="bg-gray-900/50 border border-gray-800 text-white px-4 py-2 rounded-xl text-sm focus:outline-none"
                >
                    <option value="all">Todos os Estágios</option>
                    <option value="warm">Warm</option>
                    <option value="hot">Hot 🔥</option>
                    <option value="qualified">Qualified ⭐</option>
                </select>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl flex items-center px-4 py-2 gap-2">
                    <span className="text-gray-400 text-sm">Score mínimo:</span>
                    <input
                        type="number"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="bg-transparent text-white outline-none w-16 text-sm"
                        min="0"
                        max="100"
                    />
                </div>
            </div>

            {/* Hot Leads Table */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase">
                            <th className="p-4">Visitor</th>
                            <th className="p-4">Intent Score</th>
                            <th className="p-4">Stage</th>
                            <th className="p-4">Activity</th>
                            <th className="p-4">Last Seen</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    Nenhum hot lead encontrado. Ajuste os filtros para ver mais resultados.
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map(lead => (
                                <tr key={lead.visitorId} className="border-b border-gray-800/50 hover:bg-white/5">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-900/30 flex items-center justify-center">
                                                <Flame size={16} className="text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm font-mono">
                                                    {lead.visitorId.substring(0, 20)}...
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    {lead.sessionCount} sessions • {lead.signalCount} signals
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-800 rounded-full h-2 max-w-[100px]">
                                                <div
                                                    className={`h-2 rounded-full ${lead.stage === 'qualified'
                                                            ? 'bg-green-500'
                                                            : lead.stage === 'hot'
                                                                ? 'bg-orange-500'
                                                                : 'bg-yellow-500'
                                                        }`}
                                                    style={{ width: `${lead.totalScore}%` }}
                                                />
                                            </div>
                                            <span className="text-white font-bold text-sm">{lead.totalScore}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${stageColors[lead.stage]}`}>
                                            {stageEmojis[lead.stage]} {lead.stage.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-gray-300 text-sm">
                                            <p>{lead.highValueActions} high-value actions</p>
                                            <p className="text-xs text-gray-500">
                                                First seen: {new Date(lead.firstSeen).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">
                                        {new Date(lead.lastSeen).toLocaleString('pt-BR')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => fetchVisitorDetails(lead.visitorId)}
                                                className="p-1.5 rounded bg-blue-900/30 hover:bg-blue-900/50 text-blue-400"
                                                title="Ver Detalhes"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => alertSalesTeam(lead)}
                                                className="p-1.5 rounded bg-orange-900/30 hover:bg-orange-900/50 text-orange-400"
                                                title="Alertar Time de Vendas"
                                            >
                                                <AlertCircle size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Visitor Details Modal */}
            {showDetailsModal && selectedVisitor && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        {stageEmojis[selectedVisitor.stage]} Visitor Profile
                                    </h3>
                                    <p className="text-sm text-gray-400 font-mono mt-1">{selectedVisitor.visitorId}</p>
                                </div>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Intent Score */}
                            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-sm">Intent Score</span>
                                    <span className="text-2xl font-bold text-white">{selectedVisitor.totalScore}/100</span>
                                </div>
                                <div className="bg-gray-900 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full ${selectedVisitor.stage === 'qualified'
                                                ? 'bg-green-500'
                                                : selectedVisitor.stage === 'hot'
                                                    ? 'bg-orange-500'
                                                    : 'bg-yellow-500'
                                            }`}
                                        style={{ width: `${selectedVisitor.totalScore}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>Cold (0-29)</span>
                                    <span>Warm (30-49)</span>
                                    <span>Hot (50-79)</span>
                                    <span>Qualified (80+)</span>
                                </div>
                            </div>

                            {/* Activity Summary */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center">
                                    <p className="text-gray-400 text-xs mb-1">Sessions</p>
                                    <p className="text-xl font-bold text-white">{selectedVisitor.sessionCount}</p>
                                </div>
                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center">
                                    <p className="text-gray-400 text-xs mb-1">Signals</p>
                                    <p className="text-xl font-bold text-white">{selectedVisitor.signalCount}</p>
                                </div>
                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center">
                                    <p className="text-gray-400 text-xs mb-1">High-Value</p>
                                    <p className="text-xl font-bold text-orange-400">{selectedVisitor.highValueActions}</p>
                                </div>
                            </div>

                            {/* Recent Signals */}
                            <div>
                                <h4 className="text-white font-bold mb-3">Recent Signals</h4>
                                <div className="space-y-2">
                                    {selectedVisitor.recentSignals && selectedVisitor.recentSignals.length > 0 ? (
                                        selectedVisitor.recentSignals.map((signal, idx) => (
                                            <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-white text-sm font-medium">
                                                            {signalTypeLabels[signal.type] || signal.type}
                                                        </p>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            {new Date(signal.timestamp).toLocaleString('pt-BR')}
                                                        </p>
                                                        {signal.metadata?.page && (
                                                            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                                                <ExternalLink size={10} /> {signal.metadata.page}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="text-orange-400 font-bold text-sm">
                                                        +{signal.intentScore}pt
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">Nenhum sinal recente.</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Actions */}
                            <div className="bg-gradient-to-br from-orange-900/40 to-black border border-orange-500/30 rounded-xl p-4">
                                <h4 className="text-white font-bold mb-3">Ações Rápidas</h4>
                                <div className="space-y-2">
                                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                        <MessageSquare size={16} /> Enviar Mensagem Automática
                                    </button>
                                    <button
                                        onClick={() => alertSalesTeam(selectedVisitor)}
                                        className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <AlertCircle size={16} /> Alertar Time de Vendas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
