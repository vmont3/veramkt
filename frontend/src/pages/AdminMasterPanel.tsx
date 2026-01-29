
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Activity, ShieldAlert, Lock, RefreshCcw, Power, Zap, MessageSquare, PenTool, TrendingUp, Cpu, Server, Database, Globe, Layers, RotateCcw, HeartPulse, Settings, Save, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";

// --- COMPONENTES UI AD HOC ---
const Button = ({ children, onClick, disabled, className, variant = "primary" }: any) => {
    const baseStyle = "flex items-center justify-center px-4 py-2 rounded-md font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95";
    const variants: any = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white",
        destructive: "bg-red-600 hover:bg-red-500 text-white border border-red-500",
        outline: "border border-gray-600 hover:bg-gray-800 text-gray-300 bg-gray-900/50",
        warning: "bg-yellow-600 hover:bg-yellow-500 text-white border-yellow-500"
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
        >
            {children}
        </button>
    );
};

const Card = ({ children, className }: any) => (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl ${className}`}>
        {children}
    </div>
);

const Badge = ({ status }: { status: 'operational' | 'paused' | 'offline' | 'warning' }) => {
    const styles = {
        operational: "bg-emerald-500/10 text-emerald-400 border-emerald-500/50",
        paused: "bg-red-500/10 text-red-500 border-red-500/50",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/50",
        offline: "bg-gray-500/10 text-gray-500 border-gray-500/50"
    };
    const labels = {
        operational: "OPERACIONAL",
        paused: "PAUSADO",
        warning: "ALERTA",
        offline: "OFFLINE"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-mono border ${styles[status] || styles.offline}`}>
            ● {labels[status] || "OFFLINE"}
        </span>
    );
};

const Toast = ({ message, type, onClose }: any) => {
    if (!message) return null;
    const colors = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
    return (
        <div className={`fixed top-5 right-5 ${colors} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-right z-50`}>
            <div className="flex-1 font-bold text-sm">{message}</div>
            <button onClick={onClose} className="ml-4 hover:bg-black/20 rounded-full p-1">✕</button>
        </div>
    );
};

// --- MODAL DE REINICIALIZAÇÃO ---
const RestartModal = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Reiniciando Servidor...</h2>
            <p className="text-gray-400 text-center max-w-md">
                Aplicando novas configurações. O sistema voltará automaticamente em alguns segundos.
                <br /> <span className="text-yellow-500 font-bold mt-2 block">NÃO FECHE A PÁGINA.</span>
            </p>
        </div>
    );
};

// --- COMPONENTE SWITCH (Disjuntor) com SAÚDE ---
const CircuitSwitch = ({ label, agentId, isOn, onToggle, onReset, icon: Icon, loadingIds, healthScore }: any) => {
    const isResetting = loadingIds && loadingIds.includes(agentId);

    // Status visual
    const displayStatus = isOn ? "ONLINE" : "PAUSADO";
    const statusColor = isOn ? "text-emerald-400" : "text-red-400";
    const bgStatus = isOn ? "bg-emerald-500/20" : "bg-red-500/20";

    // Cor da barra de vida (Se pausado, cinza ou vermelho escuro)
    let healthColor = "bg-emerald-500";
    if (!isOn) healthColor = "bg-gray-700";
    else if (healthScore < 70) healthColor = "bg-yellow-500";
    if (isOn && healthScore < 40) healthColor = "bg-red-500";

    return (
        <div className={`p-4 rounded-lg border flex flex-col gap-3 transition-all ${isOn ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${bgStatus} transition-colors`}>
                        <Icon size={20} className={statusColor} />
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${isOn ? 'text-emerald-100' : 'text-red-100'}`}>{label}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                                <span className={`text-[10px] font-mono uppercase ${statusColor}`}>{displayStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onToggle(agentId, !isOn)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isOn ? 'bg-emerald-600' : 'bg-red-900'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-800/50">
                <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span className="flex items-center gap-1"><HeartPulse size={10} /> SAÚDE</span>
                        <span className="font-mono text-white">{healthScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${healthColor} transition-all duration-500`} style={{ width: `${healthScore}%` }}></div>
                    </div>
                </div>
                <button
                    onClick={() => onReset(agentId)}
                    disabled={isResetting || !isOn}
                    title="Restaurar Agente (Reset)"
                    className={`p-1.5 rounded-full border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all active:scale-95 disabled:opacity-20 ${isResetting ? 'border-blue-500 text-blue-500' : ''}`}
                >
                    <RotateCcw size={14} className={isResetting ? "animate-spin" : ""} />
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE INPUT CONFIG ---
const ConfigInput = ({ label, name, value, onChange }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    const isSensitive = name.includes("KEY") || name.includes("TOKEN") || name.includes("SECRET") || name === "ADMIN_KEY";

    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <input
                    type={isSensitive && !showPassword ? "password" : "text"}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-md text-white md:text-sm font-mono focus:border-blue-500 focus:outline-none transition-colors border-l-4 border-l-blue-900 placeholder-gray-700"
                    placeholder={isSensitive ? "••••••••" : ""}
                />
                {isSensitive && (
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- PAINEL PRINCIPAL ---

// --- PAINEL PRINCIPAL ---

const AdminMasterPanel = () => {
    // Auth State (Managed via JWT now)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Application State
    const [activeTab, setActiveTab] = useState<'control' | 'config'>('control');
    const [loading, setLoading] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [status, setStatus] = useState<'operational' | 'paused' | 'offline' | 'warning'>('operational');
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
    const [resettingAgents, setResettingAgents] = useState<string[]>([]);

    // Data
    const [healthReport, setHealthReport] = useState<string | null>(null);
    const [circuits, setCircuits] = useState<any>({
        copy_expert: { on: true, health: 100 },
        design_expert: { on: true, health: 100 },
        market_monitor: { on: true, health: 100 },
        interaction_agent: { on: true, health: 100 },
        brand_strategy: { on: true, health: 100 },
        agency_orchestrator: { on: true, health: 100 }
    });

    const [settings, setSettings] = useState({
        PORT: "", ADMIN_KEY: "", DATABASE_URL: "", JWT_SECRET: "",
        OPENAI_API_KEY: "", GEMINI_API_KEY: "", ELEVENLABS_API_KEY: "",
        TELEGRAM_BOT_TOKEN: "", SENDGRID_API_KEY: "", TWITTER_API_KEY: "", APIFY_API_TOKEN: "",
        MERCADO_PAGO_ACCESS_TOKEN: "", MERCADO_PAGO_PUBLIC_KEY: ""
    });

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 5000);
    };

    // --- 1. AUTH CHECK ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token) {
            navigate('/login');
            return;
        }

        if (user.role !== 'SUPER_ADMIN') {
            alert('Acesso Negado: Área restrita a Super Admins.');
            navigate('/painel/overview');
            return;
        }

        setIsAuthenticated(true);
        fetchMetrics();
    }, []);

    const getAuthHeader = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
    };

    // --- 2. DATA FETCHING ---
    const fetchMetrics = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            // Fetch Report Text
            const reportRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health/detailed`, {
                headers: getAuthHeader()
            });
            setHealthReport(await reportRes.text());

            // Fetch Structured Metrics
            const metricsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health/metrics`, {
                headers: getAuthHeader()
            });
            const metrics = await metricsRes.json();

            if (metrics.error) throw new Error(metrics.error);
            setStatus(metrics.globalStatus || 'operational');

            if (metrics.agents) {
                const newCircuits = { ...circuits };
                metrics.agents.forEach((agent: any) => {
                    if (newCircuits[agent.id]) {
                        // Persisted logic: health === 0 (or -1 from backend mapped to 0) => PAUSED
                        const isPaused = agent.status === 'paused';
                        newCircuits[agent.id] = {
                            on: !isPaused,
                            health: agent.health
                        };
                    }
                });
                setCircuits(newCircuits);
            }
        } catch (e) {
            // Silent block to avoid flashing errors during restart
            if (!isRestarting) setStatus('offline');
        } finally {
            setLoading(false);
        }
    };

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/config/visual`, {
                headers: getAuthHeader()
            });
            const data = await res.json();
            if (data.success) {
                setSettings(data.config);
            } else {
                showToast("Erro ao ler configurações", 'error');
            }
        } catch (error) {
            showToast("Backend Offline ou Inacessível", 'error');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on tab change
    useEffect(() => {
        if (activeTab === 'config' && isAuthenticated) fetchConfig();
        if (activeTab === 'control' && isAuthenticated) fetchMetrics();
    }, [activeTab]);


    // --- 3. ACTIONS ---

    // Toggle Circuit (Pause/Resume)
    const toggleCircuit = async (agentId: string, newState: boolean) => {
        // Optimistic Update
        setCircuits((prev: any) => ({
            ...prev,
            [agentId]: { ...prev[agentId], on: newState }
        }));

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health/circuit-breaker`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    circuit: agentId,
                    action: newState ? 'resume' : 'pause' // Simple mapping
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            showToast(`${data.message}`, newState ? 'success' : 'error');
            // Re-fetch to ensure sync with backend persistence
            setTimeout(fetchMetrics, 500);

        } catch (error: any) {
            // Revert
            setCircuits((prev: any) => ({
                ...prev,
                [agentId]: { ...prev[agentId], on: !newState }
            }));
            showToast(`Erroo: ${error.message}`, 'error');
        }
    };

    const handleMasterSwitch = async (turnOn: boolean) => {
        if (!window.confirm(turnOn ? "RETOMAR SISTEMA COMPLETO?" : "🚨 DERRUBAR DISJUNTOR GERAL?")) return;

        setLoading(true);
        try {
            // 1. Send Command
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health/circuit-breaker`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    circuit: 'all',
                    action: turnOn ? 'resume' : 'pause'
                })
            });

            if (res.ok) {
                // 2. Force Local Update Immediately (Wait for backend persistence)
                const newState = turnOn;
                const updatedCircuits = { ...circuits };

                Object.keys(updatedCircuits).forEach(key => {
                    updatedCircuits[key].on = newState;
                    if (!newState) updatedCircuits[key].health = 0; // Visual logic
                });
                setCircuits(updatedCircuits); // Update state to reflect OFF immediately

                setStatus(turnOn ? 'operational' : 'paused');
                showToast(turnOn ? "SISTEMA ONLINE" : "SISTEMA PAUSADO", turnOn ? 'success' : 'error');

                // 3. Fetch Fresh Data after delay
                setTimeout(fetchMetrics, 1000);

            } else {
                throw new Error("Backend reject");
            }
        } catch (e) {
            showToast("Erro no Interruptor Geral", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEmergencyReset = async () => {
        const confirmMsg =
            `⚠️ ATENÇÃO: RESET DE EMERGÊNCIA!

Isso irá:
1. Pausar todas as filas.
2. Limpar tarefas travadas.
3. Restaurar todos os agentes para 80% de saúde (Modo Seguro).

Use isso apenas se o sistema estiver travado. Continuar?`;

        if (!window.confirm(confirmMsg)) return;

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health/emergency-protocol`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({}) // Body kept empty or as needed
            });

            if (res.ok) {
                showToast("✅ SISTEMA RESTAURADO EM MODO SEGURO", 'success');
                // Reset local state to 'on' but with warnings/safe mode
                fetchMetrics();
            } else {
                throw new Error("Falha no reset");
            }
        } catch (e) {
            showToast("Erro Crítico ao Resetar", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResetAgent = async (agentId: string) => {
        if (!window.confirm(`Resetar memória e estado do agente '${agentId}'?`)) return;

        setResettingAgents(prev => [...prev, agentId]);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health/reset-agent`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ agentId })
            });
            if (res.ok) {
                showToast("Agente Resetado!", 'success');
                fetchMetrics();
            } else {
                showToast("Erro ao resetar", 'error');
            }
        } catch (error) {
            showToast("Erro de conexão", 'error');
        } finally {
            setResettingAgents(prev => prev.filter(id => id !== agentId));
        }
    };

    // --- 4. CONFIG SAVE & RESTART ---
    const handleSaveConfig = async () => {
        if (!window.confirm("⚠️ CONFIRMAR ATUALIZAÇÃO?\n\nO servidor será reiniciado. Isso causará uma breve interrupção.")) return;

        setIsRestarting(true); // Show Modal
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/config/update`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ settings })
            });

            if (res.ok) {
                pollForReconnection();
            } else {
                throw new Error("Salvo falhou");
            }
        } catch (error: any) {
            setIsRestarting(false); // Hide Modal on Error
            showToast(`Erro ao salvar: ${error.message}`, 'error');
        }
    };

    const pollForReconnection = () => {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health/detailed`, {
                    headers: getAuthHeader()
                });
                if (res.ok) {
                    clearInterval(interval);
                    setIsRestarting(false);
                    showToast("✅ SERVIDOR REINICIADO COM SUCESSO!", 'success');
                    fetchMetrics();
                }
            } catch (e) {
                if (attempts > 30) {
                    clearInterval(interval);
                    setIsRestarting(false);
                    alert("O servidor demorou muito para responder. Verifique o terminal.");
                }
            }
        }, 2000);
    };

    const handleConfigChange = (e: any) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    // --- RENDER ---
    // --- RENDER ---
    if (!isAuthenticated) return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-500 font-mono text-sm">Verificando Credenciais de Segurança Nível 5...</span>
        </div>
    );

    return (
        <div className="bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            <RestartModal visible={isRestarting} />

            <div className="w-full space-y-6">

                {/* HEADER MOVED/REFACTORED */}
                {/* HEADER REMOVED - Using DashboardLayout */}
                {/* 
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-40 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/20 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white leading-tight">Painel de Comando</h1>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>VERA INTELLIGENCE</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <Badge status={status} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('control')}
                            className={`px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'control' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Activity size={16} /> CONTROLE
                        </button>
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'config' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Settings size={16} /> CONFIG
                        </button>
                        <button
                            onClick={activeTab === 'control' ? fetchMetrics : fetchConfig}
                            disabled={loading}
                            className="px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all border-l border-gray-700/50 ml-2"
                            title="Atualizar Dados"
                        >
                            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
*/}
                {/* Simplified Controls for Dashboard Layout Integration */}
                <div className="flex justify-end mb-4 gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mr-auto">
                        <Badge status={status} />
                    </div>

                    <button
                        onClick={() => setActiveTab('control')}
                        className={`px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'control' ? 'bg-gray-800 text-white shadow-sm border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Activity size={16} /> CONTROLE
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'config' ? 'bg-gray-800 text-white shadow-sm border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Settings size={16} /> CONFIG
                    </button>
                    <button
                        onClick={activeTab === 'control' ? fetchMetrics : fetchConfig}
                        disabled={loading}
                        className="px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-gray-700 ml-2"
                        title="Atualizar Dados"
                    >
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* CONTENT */}
                {activeTab === 'control' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-500">

                        {/* LEFT: CONTROLS */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Master Switch */}
                            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Power size={120} />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Power className="text-blue-500" /> Master Switch</h3>
                                            <p className="text-sm text-gray-500 mt-1 max-w-sm">Use para interromper ou retomar toda a operação da agência imediatamente.</p>
                                        </div>
                                        {/* EMERGENCY BUTTON */}
                                        <Button
                                            variant="warning"
                                            className="text-xs px-2 py-1 h-8"
                                            onClick={handleEmergencyReset}
                                            title="Zerar Filas e Reiniciar em Modo Seguro"
                                        >
                                            ⚠️ RESET GERAL
                                        </Button>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                        <Button
                                            variant="destructive"
                                            className="flex-1 h-12"
                                            onClick={() => handleMasterSwitch(false)}
                                            disabled={loading}
                                        >
                                            PAUSAR TUDO
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 border-none"
                                            onClick={() => handleMasterSwitch(true)}
                                            disabled={loading}
                                        >
                                            RETOMAR TUDO
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Circuitos Individuais</h4>
                                <span className="text-[10px] text-gray-600">v1.2 Agent Grid</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(circuits).map(([key, val]: any) => (
                                    <CircuitSwitch
                                        key={key}
                                        label={key.replace('_', ' ').toUpperCase()}
                                        agentId={key}
                                        isOn={val.on}
                                        healthScore={val.health}
                                        icon={key.includes('orchestrator') ? Cpu : key.includes('voice') ? MessageSquare : Zap}
                                        onToggle={toggleCircuit}
                                        onReset={handleResetAgent}
                                        loadingIds={resettingAgents}
                                    />
                                ))}
                            </div>

                            {/* GIFT CREDITS MODULE */}
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                    <Zap className="text-yellow-500" /> Cortesia de Créditos (Gift)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        id="giftUserId"
                                        placeholder="ID do Usuário (UUID)"
                                        className="bg-black/50 border border-gray-700 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"
                                    />
                                    <input
                                        type="number"
                                        id="giftAmount"
                                        placeholder="Qtd. Créditos"
                                        className="bg-black/50 border border-gray-700 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"
                                    />
                                    <Button
                                        variant="warning"
                                        className="text-sm font-bold"
                                        onClick={async () => {
                                            const userId = (document.getElementById('giftUserId') as HTMLInputElement).value;
                                            const amount = (document.getElementById('giftAmount') as HTMLInputElement).value;

                                            if (!userId || !amount) return alert("Preencha ID e Quantidade!");
                                            if (!window.confirm(`Enviar ${amount} créditos para ${userId}?`)) return;

                                            try {
                                                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/credits/admin-gift`, {
                                                    method: 'POST',
                                                    headers: getAuthHeader(),
                                                    body: JSON.stringify({ userId, amount })
                                                });
                                                const data = await res.json();
                                                if (res.ok) alert(data.message);
                                                else alert("Erro: " + data.error);
                                            } catch (e) {
                                                alert("Erro de conexão.");
                                            }
                                        }}
                                    >
                                        ENVIAR PRESENTE 🎁
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: LOGS */}
                        <div className="lg:col-span-1 h-full">
                            <Card className="h-full bg-black border-gray-800 flex flex-col min-h-[500px]">
                                <div className="p-4 border-b border-gray-900 bg-gray-900/50 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><Activity size={14} /> Diagnóstico em Tempo Real</h3>
                                    <span className="text-[10px] text-gray-600 font-mono">LIVE LOG</span>
                                </div>
                                <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed text-green-500 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                                    {healthReport || <span className="text-gray-600 animate-pulse">Estabelecendo conexão segura...</span>}
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    // CONFIG TAB
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-500">
                        <div className="lg:col-span-2">
                            <Card className="bg-gray-900 border-gray-800">
                                <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-blue-900/10 to-transparent">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                                        <Database className="text-blue-500" /> Variáveis de Ambiente (.env)
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Gerencie chaves secretas e configurações de infraestrutura.
                                    </p>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-blue-400 uppercase border-b border-blue-900/30 pb-2">Inteligência Artificial (Cérebros & Voz)</h4>
                                        <ConfigInput label="OpenAI API Key (GPT-4)" name="OPENAI_API_KEY" value={settings.OPENAI_API_KEY} onChange={handleConfigChange} />
                                        <ConfigInput label="Google Gemini API Key (Multimodal)" name="GEMINI_API_KEY" value={settings.GEMINI_API_KEY} onChange={handleConfigChange} />
                                        <ConfigInput label="ElevenLabs API Key (Voz Neural)" name="ELEVENLABS_API_KEY" value={settings.ELEVENLABS_API_KEY} onChange={handleConfigChange} />
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-yellow-400 uppercase border-b border-yellow-900/30 pb-2">Sistema Financeiro (Pagamentos)</h4>
                                        <ConfigInput label="Mercado Pago Access Token (Backend)" name="MERCADO_PAGO_ACCESS_TOKEN" value={settings.MERCADO_PAGO_ACCESS_TOKEN} onChange={handleConfigChange} />
                                        <ConfigInput label="Mercado Pago Public Key (Frontend)" name="MERCADO_PAGO_PUBLIC_KEY" value={settings.MERCADO_PAGO_PUBLIC_KEY} onChange={handleConfigChange} />
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-purple-400 uppercase border-b border-purple-900/30 pb-2">VERA Intelligence (Extensões)</h4>
                                        <p className="text-[10px] text-gray-400 mb-2">Conectores para expansão de monitoramento (Twitter, ReclameAqui, E-mails).</p>
                                        <ConfigInput label="SendGrid / Postmark API Key" name="SENDGRID_API_KEY" value={settings.SENDGRID_API_KEY} onChange={handleConfigChange} />
                                        <ConfigInput label="Twitter (X) API Key" name="TWITTER_API_KEY" value={settings.TWITTER_API_KEY} onChange={handleConfigChange} />
                                        <ConfigInput label="Apify API Token (Scraper)" name="APIFY_API_TOKEN" value={settings.APIFY_API_TOKEN} onChange={handleConfigChange} />
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-green-400 uppercase border-b border-green-900/30 pb-2">Integrações Básicas</h4>
                                        <ConfigInput label="Telegram Bot Token" name="TELEGRAM_BOT_TOKEN" value={settings.TELEGRAM_BOT_TOKEN} onChange={handleConfigChange} />
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-red-400 uppercase border-b border-red-900/30 pb-2">Sistema Core (Perigo)</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <ConfigInput label="Porta do Servidor" name="PORT" value={settings.PORT} onChange={handleConfigChange} />
                                            <ConfigInput label="Senha Admin (Mestra)" name="ADMIN_KEY" value={settings.ADMIN_KEY} onChange={handleConfigChange} />
                                        </div>
                                        <ConfigInput label="JWT Secret (Segurança Token)" name="JWT_SECRET" value={settings.JWT_SECRET} onChange={handleConfigChange} />
                                        <ConfigInput label="Database URL (SQLite/Postgres)" name="DATABASE_URL" value={settings.DATABASE_URL} onChange={handleConfigChange} />
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-800 bg-black/20 flex justify-end">
                                    <Button onClick={handleSaveConfig} disabled={loading} className="w-full md:w-auto h-12 bg-emerald-600 hover:bg-emerald-500 gap-2">
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                        SALVAR E REINICIAR
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-6">
                                <h3 className="font-bold text-blue-400 mb-2 flex gap-2 items-center"><Server size={18} /> Ciclo de Vida</h3>
                                <div className="space-y-4 text-sm text-gray-400">
                                    <p>As alterações feitas aqui são escritas diretamente no arquivo <code>.env</code> do servidor.</p>
                                    <div className="flex items-center gap-2 text-xs bg-black/30 p-2 rounded border border-blue-900/20">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Reinício Automático (Hot Reload)</span>
                                    </div>
                                    <p>Ao clicar em salvar, um <strong>Pop-up de Bloqueio</strong> aparecerá. Não feche a janela até que a mensagem de sucesso seja exibida.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMasterPanel;
