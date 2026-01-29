import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

interface HoloItem {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    details: string[];
}

const items: HoloItem[] = [
    {
        id: 1,
        title: "NÃO É FERRAMENTA",
        subtitle: "É ESTRATÉGIA PURA",
        description: "Não é sobre agendar posts. É sobre criar a estratégia inteira antes do post existir.",
        details: [
            "Análise de tendências em tempo real",
            "Criação de calendários editoriais completos",
            "Coerência de marca garantida por IA",
            "Ajuste automático de tom de voz"
        ]
    },
    {
        id: 2,
        title: "NÃO É CHATBOT",
        subtitle: "É INTELIGÊNCIA ATIVA",
        description: "Não responde 'como posso ajudar?'. Ela analisa, propõe e executa funções específicas.",
        details: [
            "Memória de longo prazo da sua empresa",
            "Atuação proativa sem esperar comando",
            "Integração com múltiplos canais",
            "Aprendizado contínuo com feedback"
        ]
    },
    {
        id: 3,
        title: "NÃO É AGÊNCIA",
        subtitle: "É OPERAÇÃO ESCALÁVEL",
        description: "Sem reuniões de 2 horas. Sem atendimento lento. Sem custos inflados.",
        details: [
            "Disponibilidade 24/7",
            "Sem custos trabalhistas ou overhead",
            "Execução instantânea de tarefas",
            "Dashboard transparente de resultados"
        ]
    }
];

export default function HolographicSection() {
    const [activeId, setActiveId] = useState<number | null>(null);

    return (
        <section className="relative py-32 px-4 md:px-20 bg-[#050608] overflow-hidden min-h-[90vh] flex flex-col justify-center items-center perspective-[1000px]">

            {/* Ambient Base Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050608] to-[#050608] pointer-events-none" />

            {/* Grid Floor Effect */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,243,255,0.03)_100%)] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none perspective-[2000px] [transform:rotateX(60deg)_scale(1.5)]"
                style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 243, 255, 0.05) 1px, transparent 1px)' }} />

            <div className="relative z-10 w-full max-w-7xl mx-auto">

                {/* Section Header - Only visible when nothing is expanded */}
                <AnimatePresence>
                    {!activeId && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center mb-24"
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 tracking-tighter uppercase mb-4 relative inline-block">
                                O que é a Vera?
                                <div className="absolute -inset-1 blur-xl bg-blue-500/10 rounded-full" />
                            </h2>
                            <p className="text-blue-400 font-mono text-sm tracking-[0.2em] uppercase opacity-80">
                                Sistema Operacional de Marketing
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Holographic Panels Container */}
                <div className={`grid gap-8 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeId ? 'grid-cols-1' : 'md:grid-cols-3'}`}>

                    <AnimatePresence mode='popLayout'>
                        {items.map((item) => {
                            const isActive = activeId === item.id;
                            const isOtherActive = activeId !== null && !isActive;

                            // If another item is active, hide this one entirely to make room
                            if (isOtherActive) return null;

                            return (
                                <motion.div
                                    layoutId={`card-${item.id}`}
                                    key={item.id}
                                    onClick={() => !isActive && setActiveId(item.id)}
                                    className={`relative group cursor-pointer ${isActive ? 'h-[85vh] md:h-[800px] w-full max-w-4xl mx-auto' : 'h-[500px] hover:-translate-y-2'}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {/* Hologram Box Structure */}
                                    <div className={`holo-container relative h-full w-full transition-all duration-500 overflow-hidden flex flex-col
                                        ${isActive ? 'scale-100' : 'hover:scale-[1.02]'}
                                    `}>

                                        {/* Stylized Holographic Background Image (CSS Generated) */}
                                        <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,243,255,0.4),transparent_70%)]" />
                                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
                                            {/* Abstract Circuit lines */}
                                            <div className="absolute inset-0" style={{
                                                backgroundImage: `linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)`,
                                                backgroundSize: '80px 80px',
                                                maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                                            }} />
                                        </div>

                                        {/* Corner Accents */}
                                        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-blue-400 opacity-60" />
                                        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-blue-400 opacity-60" />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-blue-400 opacity-60" />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-blue-400 opacity-60" />

                                        {/* Scanline Moving Bar */}
                                        <div className="scan-line" />

                                        {/* Content Container */}
                                        <div className="relative z-10 h-full p-10 flex flex-col items-center justify-center text-center">

                                            {/* Close Button if Active */}
                                            {isActive && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                                                    className="absolute top-6 right-6 p-2 bg-blue-500/10 hover:bg-blue-500/30 rounded-full text-blue-400 transition-colors border border-blue-500/30"
                                                >
                                                    <X size={24} />
                                                </button>
                                            )}

                                            {/* NO ICON - JUST PURE TYPOGRAPHY & GLOW */}

                                            {/* Title */}
                                            <motion.h3
                                                layoutId={`title-${item.id}`}
                                                className={`font-black uppercase mb-4 tracking-widest holo-title animate-holo-flicker ${isActive ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'}`}
                                            >
                                                {item.title}
                                            </motion.h3>

                                            {/* Subtitle */}
                                            <motion.p
                                                layoutId={`subtitle-${item.id}`}
                                                className={`holo-text font-mono tracking-[0.2em] uppercase text-blue-400 mb-8 ${isActive ? 'text-xl' : 'text-sm'}`}
                                            >
                                                {item.subtitle}
                                            </motion.p>

                                            {/* Divider */}
                                            {!isActive && <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8 shadow-[0_0_15px_#00f3ff]" />}

                                            {/* Short Description */}
                                            <motion.p
                                                layoutId={`desc-${item.id}`}
                                                className={`holo-text leading-relaxed font-light text-gray-300 ${isActive ? 'text-2xl max-w-3xl mb-12' : 'text-base max-w-sm'}`}
                                            >
                                                {item.description}
                                            </motion.p>

                                            {/* Expanded Content */}
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl text-left"
                                                >
                                                    {item.details.map((detail, idx) => (
                                                        <div key={idx} className="flex items-center gap-4 bg-black/40 p-6 rounded-xl border border-blue-500/30 shadow-[0_0_20px_rgba(0,243,255,0.05)] hover:bg-blue-900/10 transition-colors">
                                                            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#00f3ff]" />
                                                            <span className="text-gray-200 font-mono text-lg">{detail}</span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}

                                            {/* Click Prompt (only if not active) */}
                                            {!isActive && (
                                                <div className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] uppercase tracking-[0.3em] text-blue-300 border border-blue-500/50 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,243,255,0.2)] bg-blue-500/10">
                                                        Acessar Dados
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Global Hologram Styles - HIGH FIDELITY */}
            <style>{`
                /* Scanline Background Effect */
                .holo-container {
                    background: rgba(10, 20, 30, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(0, 243, 255, 0.3);
                    box-shadow: 
                        0 0 30px rgba(0, 0, 0, 0.8),
                        inset 0 0 0 1px rgba(255, 255, 255, 0.05);
                }

                .holo-container::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent 0px,
                        transparent 1px,
                        rgba(0, 243, 255, 0.03) 2px,
                        rgba(0, 243, 255, 0.03) 3px
                    );
                    pointer-events: none;
                    z-index: 1;
                }

                /* Text Bloom Effect */
                .holo-text {
                    text-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
                }

                .holo-title {
                    color: #fff;
                    text-shadow: 
                        0 0 10px rgba(0, 243, 255, 0.8),
                        0 0 20px rgba(0, 243, 255, 0.4);
                }

                /* Flicker Animation */
                @keyframes hologram-flicker {
                    0%, 100% { opacity: 1; }
                    3% { opacity: 0.8; }
                    6% { opacity: 1; }
                    7% { opacity: 0.9; }
                    8% { opacity: 1; }
                }

                .animate-holo-flicker {
                    animation: hologram-flicker 4s infinite alternate;
                }

                /* Scanline Moving Bar */
                @keyframes scan-bar {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 0.3; }
                    100% { transform: translateY(500%); opacity: 0; }
                }
                .scan-line {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 50px;
                    background: linear-gradient(to bottom, transparent, rgba(0, 243, 255, 0.2), transparent);
                    animation: scan-bar 3s linear infinite;
                    pointer-events: none;
                    z-index: 2;
                }
            `}</style>
        </section>
    );
}
