import React from 'react';
import { CreditCard, TrendingUp, Users, Activity, BarChart3, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardOverview() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/overview`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMetrics(data);
                }
            } catch (error) {
                console.error("Failed to load dashboard metrics", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (isLoading) {
        return <div className="p-10 text-white">Carregando dados da missão...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Painel de Controle</h1>
                <p className="text-gray-400">Bem-vindo ao comando central da VERA. Aqui está o resumo da sua operação.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: "Receita (ROAS)",
                        value: metrics ? `R$ ${metrics.roas}` : "R$ 0",
                        change: "+0%",
                        icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10", link: "/painel/finance"
                    },
                    {
                        label: "Leads Gerados",
                        value: metrics ? metrics.leads : "0",
                        change: "+0%",
                        icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", link: "/painel/analytics"
                    },
                    {
                        label: "Posts Criados",
                        value: metrics ? metrics.postsCreated : "0",
                        change: "+0",
                        icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", link: "/painel/content"
                    },
                    {
                        label: "Saldo (Créditos)",
                        value: metrics ? `${metrics.mediaBalance} VC` : "0 VC",
                        change: "Disponível",
                        icon: CreditCard, color: "text-yellow-400", bg: "bg-yellow-500/10", link: "/painel/finance"
                    }
                ].map((stat, i) => (
                    <div
                        key={i}
                        onClick={() => navigate(stat.link)}
                        className="bg-[#1A1625] border border-[#292348] p-6 rounded-2xl flex items-center justify-between hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-900/10 group"
                    >
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-blue-400 transition-colors">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                            <span className={`text-xs font-bold ${stat.color} block mt-1`}>{stat.change}</span>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform`}>
                            <stat.icon className={stat.color} size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Recent Activity & Tasks */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Performance Chart Placeholder */}
                    <div className="bg-[#1A1625] border border-[#292348] rounded-2xl p-8 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <BarChart3 className="text-blue-500" />
                                Performance Geral
                            </h3>
                            <button onClick={() => navigate('/painel/analytics')} className="text-xs text-blue-400 hover:text-white transition-colors uppercase font-bold tracking-wider flex items-center gap-1">
                                Ver Relatórios <ArrowRight size={12} />
                            </button>
                        </div>
                        {/* Mock Chart Visual - Keep specific mock for visual appeal until detailed chart data is ready */}
                        <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-gray-700 pb-4">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                <div key={i} className="w-full bg-blue-600/20 hover:bg-blue-500 rounded-t-lg transition-all relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 10}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                            <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions & Status */}
                <div className="space-y-8">
                    {/* Action Card */}
                    <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4">Ações Rápidas</h3>
                        <div className="space-y-3">
                            <button onClick={() => navigate('/painel/content')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2">
                                <Plus size={18} /> Solicitar Post
                            </button>
                            <button onClick={() => navigate('/painel/finance')} className="w-full bg-[#292348] hover:bg-[#352F4F] text-white font-bold py-3 rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2">
                                Depositar Verba
                            </button>
                            <button onClick={() => navigate('/painel/finance')} className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white py-3 rounded-xl border border-white/10 border-dashed transition-all text-sm flex items-center justify-center gap-2">
                                + Adicionar Novo Plano
                            </button>
                        </div>
                    </div>

                    {/* System Status - Real Data */}
                    <div className="bg-[#1A1625] border border-[#292348] rounded-2xl p-6">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Status da Rede Neural</h3>
                        <div className="space-y-4">
                            {metrics?.systemStatus && metrics.systemStatus.length > 0 ? (
                                metrics.systemStatus.map((s: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-300 capitalize">{s.name.replace('_', ' ')}</span>
                                        <span className={`font-mono text-xs ${s.status === 'Online' ? 'text-green-400' : 'text-yellow-400'} flex items-center gap-2`}>
                                            <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
                                            {s.status} ({s.health}%)
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-xs">Nenhum agente ativo no momento.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
