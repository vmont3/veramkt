import React, { useState, useEffect } from 'react';
import { Brain, ShieldCheck, Zap, TrendingUp, Palette, Megaphone, Users, ToggleLeft, ToggleRight, ThumbsUp, ThumbsDown, Activity } from 'lucide-react';

// Enterprise Agent Architecture - 23 Specialized Agents
const ENTERPRISE_AGENTS = {
    strategy: {
        title: '1. Estratégia & Liderança',
        color: 'blue',
        icon: Brain,
        agents: [
            { id: 'vera-orchestrator', name: 'VERA Core', role: 'Orquestradora Geral', desc: 'Coordena todos os agentes e valida fluxos.' },
            { id: 'head-strategy', name: 'Head de Estratégia', role: 'CMO', desc: 'Define o Blueprint e pulsos proativos.' },
            { id: 'finance-guard', name: 'Guardião Financeiro', role: 'CFO', desc: 'Protege budget e valida ROI.' },
            { id: 'editor-chief', name: 'Editor Chefe', role: 'Qualidade', desc: 'Valida conteúdo antes da publicação.' },
            { id: 'head-sales', name: 'Head de Vendas', role: 'CSO', desc: 'Estratégia comercial e conversão.' }
        ]
    },
    bi: {
        title: '2. Inteligência & Análise',
        color: 'purple',
        icon: TrendingUp,
        agents: [
            { id: 'analyst-bi', name: 'Analista de BI', role: 'Relatórios', desc: 'Gera dashboards e métricas.' },
            { id: 'analyst-market', name: 'Caçador de Tendências', role: 'Trends', desc: 'Identifica oportunidades de mercado.' },
            { id: 'analyst-competitor', name: 'Espião de Concorrência', role: 'Intel', desc: 'Monitora movimentos competitivos.' }
        ]
    },
    creative: {
        title: '3. Criação & Design',
        color: 'pink',
        icon: Palette,
        agents: [
            { id: 'copy-social-short', name: 'Copywriter Social', role: 'Posts Curtos', desc: 'Legendas e tweets.' },
            { id: 'copy-social-long', name: 'Copywriter Artigos', role: 'Long Form', desc: 'LinkedIn e blog posts.' },
            { id: 'copy-ads-conversion', name: 'Copywriter Ads', role: 'Performance', desc: 'Copies de alta conversão.' },
            { id: 'copy-email-crm', name: 'Copywriter CRM', role: 'Email', desc: 'Fluxos de automação e newsletters.' },
            { id: 'design-social', name: 'Designer Social', role: 'Posts', desc: 'Criativos para redes sociais.' },
            { id: 'design-ads', name: 'Designer Ads', role: 'Performance', desc: 'Criativos de alta conversão.' },
            { id: 'design-landing', name: 'Designer Landing', role: 'LP', desc: 'Landing pages e funis.' },
            { id: 'video-script', name: 'Roteirista', role: 'Vídeo', desc: 'Reels, TikTok e YouTube.' }
        ]
    },
    growth: {
        title: '4. Growth & Mídia Paga',
        color: 'green',
        icon: Megaphone,
        agents: [
            { id: 'manager-meta', name: 'Gestor Meta', role: 'FB/IG Ads', desc: 'Campanhas Facebook e Instagram.' },
            { id: 'manager-google', name: 'Gestor Google', role: 'Search/Display', desc: 'Google Ads e YouTube.' },
            { id: 'manager-tiktok', name: 'Gestor TikTok', role: 'TikTok Ads', desc: 'Campanhas TikTok.' },
            { id: 'manager-linkedin', name: 'Gestor LinkedIn', role: 'B2B Ads', desc: 'Campanhas LinkedIn.' }
        ]
    },
    crm: {
        title: '5. CRM & Vendas',
        color: 'orange',
        icon: Users,
        agents: [
            { id: 'crm-closer', name: 'Closer SDR', role: 'Vendas', desc: 'Qualifica e converte leads.' },
            { id: 'crm-success', name: 'Customer Success', role: 'Retenção', desc: 'Garante sucesso do cliente.' },
            { id: 'crm-enricher', name: 'Enriquecedor', role: 'Dados', desc: 'Enriquece dados de leads.' }
        ]
    }
};

const colorClasses: Record<string, { border: string, bg: string, text: string, glow: string }> = {
    blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    pink: { border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
    green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400', glow: 'shadow-green-500/20' },
    orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', glow: 'shadow-orange-500/20' }
};

export default function UserAgentsPage() {
    const [agentStates, setAgentStates] = useState<Record<string, boolean>>({});
    const [agentHealth, setAgentHealth] = useState<Record<string, { score: number; trend: string }>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Fetch agent config
                const configRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/agents/config`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (configRes.ok) {
                    const configMap = await configRes.json();
                    const newStates: Record<string, boolean> = {};
                    Object.values(ENTERPRISE_AGENTS).forEach(category => {
                        category.agents.forEach(agent => {
                            newStates[agent.id] = configMap[agent.id]?.isEnabled ?? true;
                        });
                    });
                    setAgentStates(newStates);
                }

                // Fetch agent health
                const healthRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/agents/health`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (healthRes.ok) {
                    const healthMap = await healthRes.json();
                    setAgentHealth(healthMap);
                }
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleAgent = async (id: string) => {
        const newState = !agentStates[id];
        setAgentStates(prev => ({ ...prev, [id]: newState }));
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/agents/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ updates: [{ agentId: id, isEnabled: newState }] })
            });
        } catch (e) { console.error("Failed to save", e); }
    };

    const sendFeedback = async (agentId: string, type: 'dopamine' | 'pain') => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/agents/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    agentId,
                    type,
                    reason: type === 'dopamine' ? 'Feedback positivo do usuário' : 'Feedback negativo do usuário'
                })
            });
            // Update health optimistically
            setAgentHealth(prev => ({
                ...prev,
                [agentId]: {
                    score: Math.min(100, Math.max(0, (prev[agentId]?.score ?? 50) + (type === 'dopamine' ? 5 : -5))),
                    trend: type === 'dopamine' ? 'improving' : 'declining'
                }
            }));
        } catch (e) { console.error("Failed to send feedback", e); }
    };

    const activeCount = Object.values(agentStates).filter(Boolean).length;
    const totalCount = Object.values(ENTERPRISE_AGENTS).reduce((acc, cat) => acc + cat.agents.length, 0);

    if (isLoading) return <div className="p-10 text-white text-center">Carregando Arquitetura Neural...</div>;

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="border-b border-gray-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                        <Zap className="text-yellow-400" /> Arquitetura de Agentes
                    </h1>
                    <p className="text-gray-400 text-sm">
                        23 agentes especializados. <span className="text-blue-400">{activeCount}/{totalCount} ativos</span>
                        <span className="ml-3 text-purple-400">👍 Dopamina / 👎 Correção</span>
                    </p>
                </div>
            </div>

            {/* Agent Categories */}
            {Object.entries(ENTERPRISE_AGENTS).map(([key, category]) => {
                const colors = colorClasses[category.color];
                const IconComponent = category.icon;

                return (
                    <section key={key}>
                        <h2 className={`text-lg font-bold text-white mb-4 flex items-center gap-2 pl-3 border-l-4 ${colors.border.replace('/30', '')}`}>
                            <IconComponent size={18} className={colors.text} />
                            {category.title}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {category.agents.map(agent => {
                                const isOn = agentStates[agent.id];
                                const health = agentHealth[agent.id];
                                const healthScore = health?.score ?? 50;
                                const healthColor = healthScore >= 70 ? 'text-green-400' : healthScore >= 40 ? 'text-yellow-400' : 'text-red-400';

                                return (
                                    <div
                                        key={agent.id}
                                        className={`relative p-4 rounded-xl border ${colors.border} ${isOn ? colors.bg : 'bg-gray-900/30'} transition-all duration-300 hover:shadow-lg ${isOn ? colors.glow : ''}`}
                                    >
                                        {/* Status Indicator */}
                                        <div className="absolute top-3 right-3 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                                        </div>

                                        {/* Agent Info */}
                                        <div className="mb-3">
                                            <h3 className="text-white font-semibold text-sm">{agent.name}</h3>
                                            <p className={`text-[10px] uppercase tracking-wider ${colors.text}`}>{agent.role}</p>
                                        </div>
                                        <p className="text-gray-400 text-xs leading-relaxed mb-3">{agent.desc}</p>

                                        {/* Health/Intelligence Bar */}
                                        <div className="mb-3 space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-gray-500 uppercase font-bold">Inteligência</span>
                                                <span className={`text-[10px] font-mono font-bold ${healthColor}`}>
                                                    {healthScore}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${healthScore >= 70 ? 'bg-green-500' :
                                                            healthScore >= 40 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                        }`}
                                                    style={{ width: `${healthScore}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Actions Row */}
                                        <div className="flex items-center justify-between">
                                            {/* Toggle */}
                                            <button
                                                onClick={() => toggleAgent(agent.id)}
                                                className={`flex items-center gap-1 text-xs font-medium ${isOn ? 'text-green-400' : 'text-gray-500'}`}
                                            >
                                                {isOn ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                                {isOn ? 'On' : 'Off'}
                                            </button>

                                            {/* Feedback Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => sendFeedback(agent.id, 'dopamine')}
                                                    className="p-1.5 rounded-lg bg-green-900/30 hover:bg-green-900/50 text-green-400 transition-colors"
                                                    title="Dopamina (Reforço Positivo)"
                                                >
                                                    <ThumbsUp size={14} />
                                                </button>
                                                <button
                                                    onClick={() => sendFeedback(agent.id, 'pain')}
                                                    className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 transition-colors"
                                                    title="Correção (Pain Signal)"
                                                >
                                                    <ThumbsDown size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })}

            {/* Footer Note */}
            <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl flex gap-3 items-start mt-8">
                <Activity size={18} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Dopamine Feedback Loop</h4>
                    <p className="text-xs text-gray-400">
                        Use 👍 para reforçar bons comportamentos e 👎 para corrigir erros. Os agentes aprendem continuamente.
                    </p>
                </div>
            </div>
        </div>
    );
}

