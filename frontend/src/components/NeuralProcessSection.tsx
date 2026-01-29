import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, RefreshCw, ArrowRight } from 'lucide-react';

const NeuralProcessSection = () => {
    const [activeStep, setActiveStep] = useState<string | null>("05");

    const handleApprove = () => {
        setActiveStep("06");
    };

    const handleRevise = () => {
        setActiveStep("01");
        const element = document.getElementById("01");
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for header
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const steps = [
        {
            id: "01",
            title: "INPUT DE COMANDO",
            sub: "Injeção de Dados Brutos",
            desc: "O sistema absorve sua solicitação via texto, áudio ou imagem. Decodificação de intenção imediata.",
            align: "left",
            x: -100
        },
        {
            id: "02",
            title: "ORQUESTRAÇÃO NEURAL",
            sub: "Análise Contextual Profunda",
            desc: "A VERA consulta o DNA da sua marca e cruza com tendências de mercado em tempo real.",
            align: "right",
            x: 100
        },
        {
            id: "03",
            title: "DELEGAÇÃO SQUAD",
            sub: "Ativação de Especialistas",
            desc: "Agentes autônomos de Copy, Design e Tráfego assumem suas funções específicas simultaneamente.",
            align: "left",
            x: -100
        },
        {
            id: "04",
            title: "CONSENSO CRÍTICO",
            sub: "Refinamento Multi-Agente",
            desc: "Os agentes debatem e criticam o trabalho um do outro até atingir a nota de corte de qualidade.",
            align: "right",
            x: 100
        },
        {
            id: "05",
            title: "PROTOCOLO SOBERANO",
            sub: "Validação Humana Final",
            desc: "O pacote pronto chega para seu 'Sim' ou 'Não'. Você tem o controle absoluto do gatilho.",
            align: "center",
            x: 0,
            highlight: true
        }
    ];

    return (
        <section className="relative py-40 bg-black overflow-hidden flex flex-col items-center justify-center min-h-screen">

            {/* --- ATMOSFERA E FUNDO (Infinite Depth) --- */}
            <div className="absolute inset-0 bg-[#000000]">

                {/* SPACE PARTICLES (Stars) */}
                <div className="absolute inset-0 opacity-40 animate-pulse-slow"
                    style={{
                        backgroundImage: 'radial-gradient(1px 1px at 50% 50%, white, transparent)',
                        backgroundSize: '100px 100px'
                    }}
                />

                {/* FLOOR GRID (Infinite Plane) */}
                <div className="absolute bottom-0 w-full h-[80vh] opacity-20 origin-bottom [transform:perspective(1000px)_rotateX(70deg)]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,255,0.4)_1px,transparent_1px)] bg-[size:80px_80px] animate-grid-flow" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                {/* CEILING GRID (Reflection) */}
                <div className="absolute top-0 w-full h-[80vh] opacity-10 origin-top [transform:perspective(1000px)_rotateX(-70deg)]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,255,0.4)_1px,transparent_1px)] bg-[size:80px_80px] animate-grid-flow-reverse" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent" />
                </div>

                {/* CORE GLOW (The Singularity) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
            </div>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">

                <div className="text-center mb-32 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            FLUXO DE<br />INTELIGÊNCIA
                        </h2>
                        <div className="h-1 w-24 mx-auto bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                    </motion.div>
                </div>

                <div className="relative flex flex-col items-center">

                    {/* LINHA CENTRAL (Laser Beam) */}
                    <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-[2px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent md:-translate-x-1/2">
                        <div className="absolute inset-0 bg-blue-400/20 blur-sm" />
                    </div>

                    {/* STEPS */}
                    <div className="w-full space-y-32">
                        {steps.map((step, index) => {
                            // SPECIAL LAYOUT FOR PROTOCOLO SOBERANO "05"
                            if (step.id === "05") {
                                if (activeStep === "06") {
                                    // SUCCESS STATE
                                    return (
                                        <motion.div
                                            key="success-state"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onViewportLeave={() => setActiveStep("05")} // Reset on scroll out
                                            className="relative flex flex-col items-center justify-center w-full py-24 max-w-4xl mx-auto text-center"
                                        >
                                            <div className="relative mb-8">
                                                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                                                <div className="relative w-24 h-24 rounded-full bg-black border border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)] flex items-center justify-center">
                                                    <Check size={48} className="text-green-500" />
                                                </div>
                                            </div>
                                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">SISTEMA INICIADO</h3>
                                            <p className="text-green-400 font-mono text-lg tracking-widest uppercase mb-8">Execução Autônoma em Progresso</p>

                                            <div className="flex gap-2 items-center text-sm text-gray-500 font-mono">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                                <span>Aguardando relatórios em tempo real...</span>
                                            </div>
                                        </motion.div>
                                    );
                                }

                                return (
                                    <motion.div
                                        key={step.id}
                                        id={step.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ margin: "-100px" }}
                                        className="relative flex flex-col md:flex-row items-center justify-center w-full py-24 gap-8 md:gap-16 max-w-6xl mx-auto"
                                    >
                                        {/* BUTTON REVISAR (Left) */}
                                        <button
                                            onClick={handleRevise}
                                            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/50 rounded-xl transition-all duration-300 md:order-1"
                                        >
                                            <div className="p-2 rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-black transition-colors">
                                                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                            </div>
                                            <span className="text-red-400 font-mono text-sm uppercase tracking-widest group-hover:text-red-300">Revisar</span>
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                        </button>

                                        {/* TEXT CONTENT (Center) */}
                                        <div className="text-center relative z-10 max-w-md order-first md:order-2">
                                            <div className="flex justify-center mb-4">
                                                <div className="w-16 h-16 rounded-full bg-black border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] flex items-center justify-center">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_currentColor]" />
                                                </div>
                                            </div>
                                            <h4 className="text-green-500 font-mono text-xs tracking-[0.3em] mb-3 uppercase flex items-center justify-center gap-2">
                                                <span className="w-8 h-[1px] bg-green-500/50" />
                                                {step.sub}
                                                <span className="w-8 h-[1px] bg-green-500/50" />
                                            </h4>
                                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 text-lg leading-relaxed font-light">
                                                {step.desc}
                                            </p>
                                        </div>

                                        {/* BUTTON APROVAR (Right) */}
                                        <button
                                            onClick={handleApprove}
                                            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-green-500/5 hover:bg-green-500/10 border border-green-500/20 hover:border-green-500/50 rounded-xl transition-all duration-300 md:order-3 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.2)]"
                                        >
                                            <span className="text-green-400 font-mono text-sm uppercase tracking-widest group-hover:text-green-300">Aprovar</span>
                                            <div className="p-2 rounded-full bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-colors">
                                                <Check size={20} />
                                            </div>
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                        </button>

                                        {/* Background Beam for this section */}
                                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent -z-10" />

                                    </motion.div>
                                );
                            }

                            // STANDARD LAYOUT FOR OTHER STEPS
                            return (
                                <motion.div
                                    key={step.id}
                                    id={step.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    transition={{ duration: 0.7, delay: index * 0.1 }}
                                    className={`relative flex flex-col md:flex-row items-center w-full ${step.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* CENTER NODE (Standard) */}
                                    <div className={`absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-20 flex items-center justify-center ${step.align === 'center' ? 'hidden' : ''}`}>
                                        <div className={`w-12 h-12 rounded-full border border-blue-500/30 bg-black backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(0,100,255,0.2)]`}>
                                            <div className={`w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_currentColor]`} />
                                        </div>
                                        <div className={`absolute ${step.align === 'left' ? 'right-16' : 'left-16'} top-1/2 -translate-y-1/2 text-[100px] font-bold text-white/5 font-mono select-none pointer-events-none`}>
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* CONNECTING LINE */}
                                    <div className={`hidden md:block absolute top-[50%] h-[1px] bg-gradient-to-r ${step.align === 'left' ? 'left-1/2 from-blue-500/50 to-transparent w-[15%]' : step.align === 'right' ? 'right-1/2 from-blue-500/50 to-transparent w-[15%]' : 'hidden'}`} />

                                    {/* CONTENT CONTAINER */}
                                    <div className={`
                                        pl-16 md:pl-0 md:w-[40%] relative
                                        ${step.align === 'left' ? 'md:pr-24 md:text-right' : ''}
                                        ${step.align === 'right' ? 'md:pl-24 md:text-left' : ''}
                                    `}>
                                        <h4 className="text-blue-500 font-mono text-xs tracking-[0.2em] mb-2 uppercase">{step.sub}</h4>
                                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 text-lg leading-relaxed font-light">
                                            {step.desc}
                                        </p>
                                    </div>

                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};


export default NeuralProcessSection;
