import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Globe, Shield, Terminal, Zap, Crosshair,
    Radio, AlertCircle, CheckCircle, Search, Wifi, Clock,
    DollarSign, Eye, Server, Cpu, Lock
} from 'lucide-react';
// import Card removed as it doesn't exist. Using div instead.

const LiveOperationsPage = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [stats, setStats] = useState({
        adsScanned: 0,
        threatsBlocked: 0,
        budgetSaved: 0,
        activeAgents: 0
    });

    // Live Config State (Switches)
    const [config, setConfig] = useState({
        stealthMode: false,
        freezeBudget: false,
        turboCopy: false
    });

    // Proactive Opportunities State
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
    const [executionResult, setExecutionResult] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    // Connection State
    const [isOnline, setIsOnline] = useState<boolean>(true);

    // Track pending updates to prevent polling from overwriting optimistic UI
    const pendingUpdatesRef = useRef<Record<string, boolean>>({});

    // FUNÇÃO FETCH LIVE DATA (fora do useEffect para reutilização)
    const fetchLive = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/live`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setIsOnline(true);
                const data = await response.json();

                // Merge logs nicely or just replace?
                // Live dashboard usually appends. But here we fetch "latest 10".
                // Let's just setLogs(data.logs) to keep it simple and synced with server state.
                // Or if we want to keep older history in frontend, we'd append uniq.
                // For now, let's just replace to avoid dupes easily.
                setLogs(data.logs);
                setStats(data.stats);

                if (data.config) {
                    setConfig(currentConfig => {
                        const newConfig = { ...currentConfig };
                        Object.keys(data.config).forEach((key) => {
                            // Only sync from server if we are NOT currently updating this specific key
                            if (!pendingUpdatesRef.current[key]) {
                                newConfig[key as keyof typeof newConfig] = data.config[key];
                            }
                        });
                        return newConfig;
                    });
                }
            } else {
                // Response not ok (e.g. 401, 500)
                setIsOnline(false);
            }
        } catch (error) {
            console.error("Failed to fetch live metrics", error);
            setIsOnline(false);
        }
    };

    // POLLING LIVE DATA
    useEffect(() => {
        fetchLive();
        const interval = setInterval(fetchLive, 5000); // 5s poll
        return () => clearInterval(interval);
    }, []);

    // Fetch Proactive Opportunities (once on mount or via button)
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/live/opportunities`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOpportunities(data.opportunities || []);
                }
            } catch (e) {
                console.error('Failed to fetch opportunities', e);
            }
        };
        fetchOpportunities();
    }, []);

    // HANDLE TOGGLE
    const toggleConfig = async (key: 'stealthMode' | 'freezeBudget' | 'turboCopy') => {
        // 1. Mark this key as "updating" so the poller ignores it
        pendingUpdatesRef.current[key] = true;

        // 2. Optimistic Update
        const newState = { ...config, [key]: !config[key] };
        setConfig(newState);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/live/config`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ config: newState })
            });

            if (!response.ok) throw new Error("Server rejected update");

            // 3. Update Success: We can unblock the poller for this key
            // The next poll will likely match our local state anyway.
            pendingUpdatesRef.current[key] = false;
            setIsOnline(true); // Restore online state if success

        } catch (error: any) {
            console.error("Failed to update config", error);
            alert(`Falha ao atualizar configuração: ${error.message}`);

            // Check if it's a network error
            if (error.message.includes('fetch') || error.message.includes('network') || !window.navigator.onLine) {
                setIsOnline(false);
            }

            // Revert and unblock
            setConfig(prev => ({ ...prev, [key]: !prev[key] }));
            pendingUpdatesRef.current[key] = false;
        }
    };

    // Scroll effect REMOVED completely to fix page jumping. User sees new logs at top.

    const handleEmergencyStop = async () => {
        if (!confirm("TEM CERTEZA? ISSO IRÁ PARAR TODOS OS AGENTES!")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/live/emergency-stop`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Protocolo de Emergência Iniciado. Agentes Pausados.");
            fetchLive(); // Refresh immediately
        } catch (error) {
            console.error("Critical Failure in Emergency Stop", error);
            alert("FALHA AO PARAR SISTEMA. CONTATE O SUPORTE.");
            setIsOnline(false);
        }
    };

    const handleExecute = async (opp: any) => {
        if (!opp.id && typeof opp === 'string') {
            alert("Interversão manual necessária. (Modo Compatibilidade)");
            return;
        }

        setSelectedOpportunity(opp);
        setIsExecuting(true);
        setExecutionResult(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/live/opportunities/${opp.id}/execute`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                // Simulate delay for "Agent Working" effect
                setTimeout(() => {
                    setExecutionResult(data.content);
                    setIsExecuting(false);
                }, 1500);
            } else {
                throw new Error("Failed to execute");
            }
        } catch (error) {
            console.error("Execution failed", error);
            setIsExecuting(false);
            setSelectedOpportunity(null);
            alert("Falha ao executar protocolo.");
        }
    };

    const handleApproveContent = () => {
        alert("Conteúdo Aprovado! Agente de Publicação acionado.");
        setOpportunities(prev => prev.filter(o => o.id !== selectedOpportunity.id));
        setSelectedOpportunity(null);
        setExecutionResult(null);
    };

    return (
        <div className="p-6 space-y-6 bg-black min-h-screen text-gray-100 font-sans selection:bg-blue-500/30">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Activity className="text-blue-500 animate-pulse" /> S.A.L.A.
                    </h1>
                    <p className="text-xs text-gray-500 font-mono mt-1 tracking-widest uppercase">
                        Situation Awareness & Live Action // Nivel Executivo
                    </p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className={`flex items-center gap-2 px-3 py-1 border rounded-full ${isOnline ? 'bg-green-900/20 border-green-900/50' : 'bg-red-900/20 border-red-900/50'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                            {isOnline ? 'Sistema Online' : 'OFFLINE - Conexão Perdida'}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Última Sincronização</div>
                        <div className="text-sm font-mono text-white">{new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            {/* PROACTIVE OPPORTUNITIES SECTION */}
            {opportunities.length > 0 && (
                <div className="my-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="text-yellow-400 animate-pulse" size={20} />
                        <h2 className="text-xl font-bold text-white tracking-tight">Oportunidades Detectadas pela IA</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {opportunities.map((opp, i) => (
                            <div key={i} className="bg-gray-900/80 border border-blue-500/30 rounded-xl p-5 hover:border-blue-400 transition-all group relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-blue-900/30 p-2 rounded-lg text-blue-400">
                                        {opp.platform === 'instagram' ? <div className='text-xs font-bold'>IG</div> :
                                            opp.platform === 'linkedin' ? <div className='text-xs font-bold'>LI</div> :
                                                <Globe size={16} />}
                                    </div>
                                    <span className="bg-green-900/30 text-green-400 text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                                        {opp.type || 'Opportunity'}
                                    </span>
                                </div>

                                <h3 className="font-bold text-white mb-2 line-clamp-2 min-h-[3rem]">
                                    {typeof opp === 'string' ? opp : opp.displayTitle || opp.description}
                                </h3>

                                <p className="text-gray-400 text-xs mb-4 line-clamp-3 min-h-[40px]">
                                    {typeof opp === 'string' ? "Análise de tendência detectada." : opp.fullDescription || opp.description}
                                </p>

                                <button
                                    onClick={() => handleExecute(opp)}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                                >
                                    <Zap size={14} /> Executar Plano
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* COL 1: LIVE FEED (TERMINAL) */}
                <div className="lg:col-span-1 flex flex-col h-[500px]">
                    <div className="bg-gray-900 border border-gray-800 rounded-t-xl p-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-2"><Terminal size={14} /> LIVE LOG</span>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                    </div>
                    <div
                        className="flex-1 bg-black/50 border-x border-b border-gray-800 rounded-b-xl p-4 overflow-y-auto font-mono text-[10px] space-y-3 shadow-inner custom-scrollbar"
                    >
                        <AnimatePresence>
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="border-l-2 border-gray-800 pl-2 py-1 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex justify-between text-gray-600 mb-0.5">
                                        <span>[{log.timestamp}]</span>
                                        <span className="uppercase bg-blue-900/50 px-1 rounded text-blue-400 text-[9px]">
                                            {log.agentId || log.source}
                                        </span>
                                    </div>
                                    <div className={`${log.type === 'error' ? 'text-red-400' :
                                        log.type === 'warning' ? 'text-yellow-400' :
                                            log.type === 'success' ? 'text-green-400' : 'text-blue-300'
                                        }`}>
                                        {log.msg}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {/* Removed logsEndRef as we use manual scrolling on container now */}
                    </div>
                </div>

                {/* COL 2 & 3: RADAR & METRICS */}
                <div className="lg:col-span-2 space-y-6">

                    {/* KEY METRICS CARDS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                            <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1"><Search size={10} /> Ads Analisados</div>
                            <div className="text-2xl font-black text-white">{stats.adsScanned.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                            <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1"><Shield size={10} /> Ameaças Bloqueadas</div>
                            <div className="text-2xl font-black text-red-500">{stats.threatsBlocked}</div>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                            <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1"><DollarSign size={10} /> Verba Protegida</div>
                            <div className="text-2xl font-black text-green-500">R$ {stats.budgetSaved.toFixed(0)}</div>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                            <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1"><Cpu size={10} /> Agentes Ativos</div>
                            <div className="text-2xl font-black text-blue-500">{stats.activeAgents}/23</div>
                        </div>
                    </div>

                    {/* MAIN VISUAL: WORLD RADAR (ABSTRACT) */}
                    <div className="relative bg-black border border-gray-800 rounded-xl h-64 md:h-80 overflow-hidden flex items-center justify-center group">

                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                        />

                        {/* Radar Circles */}
                        <div className="absolute w-[600px] h-[600px] border border-gray-800 rounded-full" />
                        <div className="absolute w-[400px] h-[400px] border border-gray-800 rounded-full" />
                        <div className="absolute w-[200px] h-[200px] border border-blue-900/50 rounded-full animate-pulse" />

                        {/* Scanning Line */}
                        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent top-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] origin-center opacity-30" />

                        {/* Central Dot */}
                        <div className="relative z-10 flex flex-col items-center">
                            <Globe size={48} className="text-blue-600 mb-2 animate-pulse" />
                            <div className="bg-black/80 px-3 py-1 rounded border border-blue-500/30 text-[10px] text-blue-400 font-mono tracking-widest backdrop-blur-sm">
                                SCANNING GLOBAL MARKETS
                            </div>
                        </div>

                        {/* Random Blips */}
                        <motion.div
                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500/50 rounded-full blur-sm"
                        />
                        <motion.div
                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
                            className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-500/50 rounded-full blur-sm"
                        />
                    </div>

                    {/* ACTIVE PROTOCOLS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-900/30 border-l-2 border-blue-500 p-3">
                            <h4 className="text-xs text-gray-500 uppercase font-bold">Protocolo Ativo</h4>
                            <p className="text-white text-sm">
                                {config.turboCopy ? "Agressivo (Turbo)" :
                                    config.stealthMode ? "Furtivo (Stealth)" :
                                        "Padrão"}
                            </p>
                        </div>
                        <div className="bg-gray-900/30 border-l-2 border-green-500 p-3">
                            <h4 className="text-xs text-gray-500 uppercase font-bold">Estado da IA</h4>
                            <p className="text-white text-sm">
                                {stats.activeAgents > 0 ? "Operacional" : "Standby"}
                            </p>
                        </div>
                        <div className="bg-gray-900/30 border-l-2 border-yellow-500 p-3">
                            <h4 className="text-xs text-gray-500 uppercase font-bold">Próx. Auditoria</h4>
                            <p className="text-white text-sm">--:--</p>
                        </div>
                    </div>

                </div>

                {/* COL 4: QUICK ACTIONS (SAFEGUARDS) */}
                <div className="bg-gray-900/20 border border-gray-800 rounded-xl p-6 flex flex-col justify-between h-[500px]">
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
                            Contramedidas
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded transition-all" onClick={() => toggleConfig('stealthMode')}>
                                <div>
                                    <div className="text-white font-bold text-sm">Modo Furtivo</div>
                                    <div className="text-[10px] text-gray-500">Ocultar trackers da concorrência</div>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${config.stealthMode ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${config.stealthMode ? 'left-6' : 'left-1'}`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded transition-all" onClick={() => toggleConfig('freezeBudget')}>
                                <div>
                                    <div className="text-white font-bold text-sm">Travar Orçamento</div>
                                    <div className="text-[10px] text-gray-500">Impedir novos gastos ads</div>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${config.freezeBudget ? 'bg-red-600' : 'bg-gray-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${config.freezeBudget ? 'left-6' : 'left-1'}`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded transition-all" onClick={() => toggleConfig('turboCopy')}>
                                <div>
                                    <div className="text-white font-bold text-sm">Turbo Copy</div>
                                    <div className="text-[10px] text-gray-500">Maximizar agressividade</div>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${config.turboCopy ? 'bg-green-600' : 'bg-gray-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${config.turboCopy ? 'left-6' : 'left-1'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-800 pt-6">
                        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-center">
                            <AlertCircle className="mx-auto text-red-500 mb-2" />
                            <h4 className="text-red-500 font-bold text-sm uppercase">Zona de Perigo</h4>
                            <p className="text-[10px] text-red-400/70 mb-3">Ações Irreversíveis</p>
                            <button
                                onClick={handleEmergencyStop}
                                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded uppercase tracking-widest shadow-lg shadow-red-900/50 transition-all active:scale-95"
                            >
                                PAUSAR OPERAÇÃO
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* EXECUTION MODAL */}
            <AnimatePresence>
                {selectedOpportunity && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => !isExecuting && setSelectedOpportunity(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-gray-900 border border-blue-500/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* LOADING STATE */}
                            {isExecuting && (
                                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-pulse"></div>
                                        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Cpu className="text-blue-500 animate-pulse" size={32} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Agentes em Ação</h3>
                                        <p className="text-gray-400 text-sm">Analisando contexto e gerando estratégia...</p>
                                    </div>
                                    <div className="flex gap-2 text-[10px] text-gray-500 font-mono mt-4">
                                        <span className="animate-pulse">[MARKET_SCAN]</span>
                                        <span className="animate-pulse delay-75">[STRATEGY_GEN]</span>
                                        <span className="animate-pulse delay-150">[COPY_WRITE]</span>
                                    </div>
                                </div>
                            )}

                            {/* RESULT STATE */}
                            {!isExecuting && executionResult && (
                                <div className="flex flex-col">
                                    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 border-b border-white/10 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-500/20 p-2 rounded-lg">
                                                <CheckCircle className="text-green-500" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">Plano de Ação Gerado</h3>
                                                <p className="text-xs text-blue-200">Pronto para aprovação</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedOpportunity(null)} className="text-gray-400 hover:text-white p-2">
                                            <div className="sr-only">Fechar</div>
                                            <span className="text-2xl">&times;</span>
                                        </button>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Estratégia</h4>
                                            <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-300 border-l-2 border-blue-500">
                                                {executionResult.strategy_note}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Copy Sugerida</h4>
                                                <textarea
                                                    className="w-full h-32 bg-black/30 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 resize-none"
                                                    defaultValue={executionResult.caption}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Criativo (Prompt)</h4>
                                                <div className="bg-black/30 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 h-32 overflow-y-auto italic">
                                                    "{executionResult.imagePrompt}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900 border-t border-white/10 p-4 flex justify-end gap-3 sticky bottom-0">
                                        <button
                                            onClick={() => setSelectedOpportunity(null)}
                                            className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleApproveContent}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-900/30 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            <Radio size={16} className="animate-pulse" /> APROVAR E PUBLICAR
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiveOperationsPage;
