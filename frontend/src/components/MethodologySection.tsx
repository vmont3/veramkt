import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import aiFace from '../assets/ai_face.png';

export default function MethodologySection() {
    const [dopamineLevel, setDopamineLevel] = useState(50);
    const [painLevel, setPainLevel] = useState(0);
    const [isResetting, setIsResetting] = useState(false);

    const handleReward = () => {
        if (isResetting) return;
        setDopamineLevel(prev => Math.min(prev + 15, 100));
        setPainLevel(prev => Math.max(prev - 10, 0));
    };

    const handleError = () => {
        if (isResetting) return;
        const newPain = painLevel + 15;
        if (newPain >= 25) { // Threshold for visualization (slightly higher than 20 to allow building up to it)
            setPainLevel(100); // Visual spike
            setIsResetting(true);
            setTimeout(() => {
                setPainLevel(0);
                setDopamineLevel(50);
                setIsResetting(false);
            }, 2000);
        } else {
            setPainLevel(newPain);
            setDopamineLevel(prev => Math.max(prev - 10, 0));
        }
    };

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Neural Network Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-purple-500 font-bold tracking-wider text-sm uppercase">Evolutionary Core</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
                        O <span className="text-blue-500">Ciclo de Dopamina</span> da VERA
                    </h2>
                    <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
                        Nossos agentes não apenas trabalham, eles evoluem. Simulamos quimicamente o aprendizado humano. <br />
                        <span className="text-white font-semibold">Teste você mesmo abaixo:</span>
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">

                    {/* Left: Pain/Correction (Red) */}
                    <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-4 order-2 lg:order-1">
                        <div className={`transition-all duration-300 p-6 rounded-2xl border w-full relative overflow-hidden group ${isResetting ? 'bg-red-600/20 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)]' : 'bg-red-900/20 border-red-900/50'}`}>
                            {/* Vertical Bar Visualization */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-800">
                                <motion.div
                                    animate={{ height: `${painLevel}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="absolute bottom-0 left-0 w-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                                />
                            </div>

                            {/* Reset Overlay */}
                            <AnimatePresence>
                                {isResetting && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center z-20 backdrop-blur-sm"
                                    >
                                        <div className="text-white font-bold text-xl animate-pulse">SYSTEM RESET</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="pl-6 relative z-10">
                                <div className="flex items-center justify-end gap-3 mb-2 text-red-500">
                                    <h3 className="text-xl font-bold">Correção (Dor)</h3>
                                    <FaExclamationTriangle />
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Erro validado pelos Heads ou Fallback gera "Dor". Isso ajusta os pesos internos e força o <span className="text-white font-semibold">reaprendizado do agente</span>.
                                </p>
                                <p className="text-gray-500 text-xs mt-3 border-t border-red-900/30 pt-3">
                                    Nível de Dor: <span className="text-red-400 font-mono">{Math.min(painLevel, 100)}%</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleError}
                            className="hidden lg:flex items-center gap-2 px-6 py-3 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white rounded-full border border-red-800 transition-all active:scale-95"
                        >
                            <FaThumbsDown /> Simular Erro
                        </button>
                    </div>

                    {/* Center: VERA Face */}
                    <div className="relative flex flex-col justify-center items-center order-1 lg:order-2 py-10 lg:py-0">
                        {/* Simulation Controls for Mobile (visible only on small screens) */}
                        <div className="flex gap-4 mb-8 lg:hidden w-full px-4 justify-center">
                            <button
                                onClick={handleError}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-900/30 active:bg-red-600 text-red-400 active:text-white rounded-xl border border-red-800 transition-colors"
                            >
                                <FaThumbsDown /> Erro
                            </button>
                            <button
                                onClick={handleReward}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-900/30 active:bg-green-600 text-green-400 active:text-white rounded-xl border border-green-800 transition-colors"
                            >
                                <FaThumbsUp /> Sucesso
                            </button>
                        </div>


                        {/* Orbit Circles */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[300px] h-[300px] border border-blue-500/20 rounded-full border-dashed pointer-events-none"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[350px] h-[350px] border border-purple-500/20 rounded-full opacity-50 pointer-events-none"
                        />

                        {/* Main Image */}
                        <div className={`relative w-64 h-64 rounded-full overflow-hidden border-4 transition-all duration-500 shadow-[0_0_50px_rgba(59,130,246,0.3)] z-10 bg-black ${isResetting ? 'border-red-500 grayscale' : 'border-gray-800'}`}>
                            <img
                                src={aiFace}
                                alt="VERA Core AI"
                                className={`w-full h-full object-cover transition-opacity duration-500 ${isResetting ? 'opacity-50' : 'opacity-90'}`}
                            />
                            {/* Scanning Line overlay */}
                            {!isResetting && (
                                <motion.div
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute left-0 right-0 h-1 bg-blue-500/50 blur-sm top-0"
                                />
                            )}
                        </div>

                        {/* Connection Lines (Visual Decor) */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-900 to-transparent -z-10 pointer-events-none" />
                    </div>

                    {/* Right: Reward/Dopamine (Green) */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 order-3">
                        <div className="bg-green-900/20 p-6 rounded-2xl border border-green-900/50 w-full relative overflow-hidden">
                            {/* Vertical Bar Visualization */}
                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-800">
                                <motion.div
                                    animate={{ height: `${dopamineLevel}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="absolute bottom-0 right-0 w-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                                />
                            </div>

                            <div className="pr-6">
                                <div className="flex items-center justify-start gap-3 mb-2 text-green-500">
                                    <FaCheckCircle />
                                    <h3 className="text-xl font-bold">Dopamina (Reward)</h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Saída aprovada sem fallback gera "Prazer". Isso prioriza os agentes de melhor performance e <span className="text-white font-semibold">reforça comportamentos vencedores</span>.
                                </p>
                                <p className="text-gray-500 text-xs mt-3 border-t border-green-900/30 pt-3">
                                    Nível de Dopamina: <span className="text-green-400 font-mono">{dopamineLevel}%</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleReward}
                            className="hidden lg:flex items-center gap-2 px-6 py-3 bg-green-900/30 hover:bg-green-600 text-green-400 hover:text-white rounded-full border border-green-800 transition-all active:scale-95"
                        >
                            <FaThumbsUp /> Simular Sucesso
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
