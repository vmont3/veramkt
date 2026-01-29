import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, ArrowUpRight, Calendar, Filter, Search, ChevronDown, ListFilter, SlidersHorizontal } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function AnalyticsPage() {
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [metrics, setMetrics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filters State
    const [platformFilter, setPlatformFilter] = useState('all');
    const [funnelTab, setFunnelTab] = useState<'funnel' | 'timeline'>('funnel');

    React.useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/analytics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMetrics(data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) return <div className="p-10 text-white">Carregando dados de analytics...</div>;

    const kpiData = metrics ? [
        { label: "Alcance Total", value: metrics.kpi.reach, change: "+0%", color: "text-blue-400" },
        { label: "Engajamento", value: metrics.kpi.engagement, change: "+0%", color: "text-purple-400" },
        { label: "Conversões (Leads)", value: metrics.kpi.leads, change: "+0%", color: "text-green-400" },
        { label: "ROAS (Médio)", value: `${metrics.kpi.roas}x`, change: "+0%", color: "text-yellow-400" },
    ] : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Relatórios de Performance</h1>
                    <p className="text-gray-400">Visão geral do crescimento e métricas de campanhas.</p>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {/* Search Filter */}
                    <div className="bg-[#1A1625] border border-[#292348] rounded-xl flex items-center px-3 py-2 text-sm max-w-[200px]">
                        <Search size={16} className="text-gray-500 mr-2" />
                        <input type="text" placeholder="Filtrar campanha..." className="bg-transparent text-white outline-none w-full placeholder-gray-600" />
                    </div>

                    {/* Platform Filter */}
                    <div className="relative">
                        <select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className="appearance-none bg-[#1A1625] border border-[#292348] text-white px-4 py-2 pr-8 rounded-xl text-sm focus:outline-none cursor-pointer hover:border-blue-500/50"
                        >
                            <option value="all">Todas as Plataformas</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="x">X (Twitter)</option>
                            <option value="tiktok">TikTok</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="telegram">Telegram</option>
                            <option value="google">Google Ads</option>
                            <option value="email">Email Marketing</option>
                            <option value="youtube">YouTube</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Date Range Filter */}
                    <div className="bg-[#1A1625] border border-[#292348] p-1 rounded-xl flex items-center gap-1">
                        {['7d', '30d', '90d'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setSelectedPeriod(p)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedPeriod === p ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {p === '7d' ? '7 Dias' : p === '30d' ? '30 Dias' : '3 Meses'}
                            </button>
                        ))}
                        <button className="px-3 py-1.5 text-gray-400 hover:text-white text-xs font-bold flex items-center gap-1 border-l border-white/10 ml-1">
                            <Calendar size={12} /> Personalizado
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, i) => (
                    <div key={i} className="bg-[#1A1625] border border-[#292348] p-6 rounded-2xl">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{kpi.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-white">{kpi.value}</h3>
                            <span className={`flex items-center text-xs font-bold ${kpi.color} bg-white/5 px-2 py-1 rounded`}>
                                <TrendingUp size={12} className="mr-1" /> {kpi.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* CHART SECTION: FUNNEL & GROWTH */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1A1625] border border-[#292348] rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <BarChart3 className="text-blue-500" />
                            Funil de Conversão
                        </h3>
                        <div className="flex gap-2 text-xs">
                            <button
                                onClick={() => setFunnelTab('funnel')}
                                className={`font-bold pb-1 transition-colors ${funnelTab === 'funnel' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                Funil
                            </button>
                            <button
                                onClick={() => setFunnelTab('timeline')}
                                className={`font-bold pb-1 transition-colors ${funnelTab === 'timeline' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                Linha do Tempo
                            </button>
                        </div>
                    </div>

                    {/* Funnel Chart */}
                    <div className="space-y-4 py-4 min-h-[200px]">
                        {funnelTab === 'funnel' ? (
                            metrics?.funnel?.map((s: any, i: number) => (
                                <div key={i} className="relative h-12 rounded-r-xl overflow-hidden group hover:scale-[1.01] transition-transform cursor-pointer" title="Clique para detalhes">
                                    <div className={`absolute top-0 left-0 h-full ${s.color} opacity-80`} style={{ width: i === 0 ? '100%' : i === 1 ? '60%' : i === 2 ? '30%' : '10%' }}></div>
                                    <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                        <span className="text-sm font-bold text-white">{s.stage}</span>
                                        <span className="text-sm font-bold text-white bg-black/30 px-2 rounded">{s.count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-2 min-h-[200px]">
                                <Calendar size={32} className="opacity-50" />
                                <p>Visualização Temporal em desenvolvimento.</p>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-4">Dados consolidados de todas as origens selecionadas.</p>
                </div>

                <div className="bg-[#1A1625] border border-[#292348] rounded-2xl p-8">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Users className="text-purple-500" />
                        Top Plataformas
                    </h3>
                    <div className="space-y-5 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {metrics?.platforms?.length > 0 ? metrics.platforms.map((p: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs text-gray-300 mb-1 font-bold">
                                    <span>{p.name}</span>
                                    <span>{p.val}%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full ${p.color}`} style={{ width: `${p.val}%` }} />
                                </div>
                            </div>
                        )) : (
                            <div className="text-gray-500 text-xs text-center">Nenhum dado de plataforma.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* INTELLIGENCE V2.0 SECTION */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* 1. AD WATCHER (Espião) */}
                <div className="bg-[#1A1625] border border-[#292348] rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                        <Search size={120} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 relative z-10">
                        Espião de Anúncios
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">Novo</span>
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 relative z-10">Monitoramento ativo de criativos da concorrência.</p>

                    <div className="space-y-4 relative z-10">
                        {metrics?.ads?.length > 0 ? metrics.ads.map((ad: any, i: number) => (
                            <div key={i} onClick={() => alert(`Analisando criativo de ${ad.competitor}...`)} className="bg-black/40 border border-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer group/item">
                                <div>
                                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                        {ad.competitor}
                                        <span className={`text-[9px] px-1.5 rounded uppercase`}>
                                            {ad.platform}
                                        </span>
                                    </h4>
                                    <p className="text-gray-500 text-xs mt-1 italic">"{ad.copy}"</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold uppercase block ${ad.status === 'new' ? 'text-green-400' : 'text-blue-400'}`}>
                                        {ad.status === 'new' ? 'Novo' : 'Ativo'}
                                    </span>
                                    <ArrowUpRight size={14} className="text-gray-600 ml-auto mt-1" />
                                </div>
                            </div>
                        )) : (
                            <div className="text-gray-500 text-sm text-center">Nenhum anúncio monitorado.</div>
                        )}
                    </div>
                </div>

                {/* 2. BRAND SENTINEL (Reputação) */}
                <div className="bg-[#1A1625] border border-[#292348] rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50 text-red-500/10 group-hover:text-red-500/20 transition-colors">
                        <Users size={120} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 relative z-10">
                        Sentinela de Marca
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-widest">Alerta</span>
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 relative z-10">Monitoramento de menções negativas e crises.</p>

                    <div className="space-y-4 relative z-10">
                        {metrics?.alerts?.length > 0 ? metrics.alerts.map((alert: any, i: number) => (
                            <div key={i} className="bg-black/40 border border-red-500/20 p-4 rounded-xl flex gap-4 items-start">
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.severity === 'medium' ? 'bg-orange-500 shadow-[0_0_8px_orange]' : 'bg-yellow-500'}`} />
                                <div>
                                    <h4 className="text-gray-300 font-bold text-xs mb-0.5 flex items-center gap-2">
                                        {alert.platform}
                                        <span className="text-gray-600 font-normal">• {alert.time}</span>
                                    </h4>
                                    <p className="text-white text-sm leading-snug">{alert.msg}</p>
                                    <button onClick={() => navigate('/painel/suporte')} className="text-red-400 text-xs font-bold mt-2 hover:underline">Ver & Responder</button>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-center">
                                <p className="text-green-400 text-xs font-bold">✅ Sem crises críticas ativas nas últimas 24h.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
