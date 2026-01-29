import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Activity, Shield } from 'lucide-react';

// --- DATA SOURCE ---
const avatarBase = "/avatars/";
const agents = [
    {
        id: "maestra",
        name: "Maestra VERA",
        role: "Orquestradora Neural",
        image: avatarBase + "avatar_maestra_vera_1768038994316.png",
        description: "A inteligência central. Coordena todos os agentes e garante a harmonia estratégica.",
        stats: { dopamina: 100, autonomia: "Total", type: "Core" }
    },
    {
        id: "instagram",
        name: "InstaExpert",
        role: "Head of Instagram",
        image: avatarBase + "avatar_instaexpert_instagram_1768039022316.png",
        description: "Especialista em engajamento visual e crescimento de marca no ecosistema Meta.",
        stats: { dopamina: 92, autonomia: "Alta", type: "Social" }
    },
    {
        id: "finance",
        name: "Finance Guard",
        role: "Guardião de ROI",
        image: avatarBase + "agent_finance_guard.png",
        description: "Proteção de capital. Trava campanhas ruins e otimiza o orçamento.",
        stats: { dopamina: 94, autonomia: "Veto", type: "Financial" }
    },
    {
        id: "growth",
        name: "Growth Master",
        role: "Especialista de Dados",
        image: avatarBase + "agent_trend_monitor.png",
        description: "Analisa tendências e otimiza funis de conversão.",
        stats: { dopamina: 95, autonomia: "Alta", type: "Analytical" }
    },
    {
        id: "copy",
        name: "Scribe Senior",
        role: "Voz da Marca",
        image: avatarBase + "avatar_scribe_copywriter.png",
        description: "Responsável por toda a narrativa e persuasão textual.",
        stats: { dopamina: 88, autonomia: "Média", type: "Creative" }
    },
    {
        id: "google",
        name: "Google Master",
        role: "Head of Search",
        image: avatarBase + "avatar_googlemaster_google_1768039064114.png",
        description: "Domina o SEO e campanhas de alta intenção.",
        stats: { dopamina: 90, autonomia: "Alta", type: "Search" }
    },
    {
        id: "linkedin",
        name: "LinkLead",
        role: "Head B2B",
        image: avatarBase + "avatar_linklead_linkedin_1768039007951.png",
        description: "Autoridade corporativa e geração de leads qualificados.",
        stats: { dopamina: 87, autonomia: "Média", type: "Social" }
    },
    {
        id: "youtube",
        name: "TubeVision",
        role: "Head of Video",
        image: avatarBase + "avatar_tubevision_youtube_1768039108976.png",
        description: "Estratégia de conteúdo audiovisual de longo formato.",
        stats: { dopamina: 91, autonomia: "Alta", type: "Video" }
    },
    {
        id: "whatsapp",
        name: "ZapCloser",
        role: "Head of Sales",
        image: avatarBase + "avatar_zapcloser_whatsapp_1768039093427.png",
        description: "Conversão direta e recuperação de vendas.",
        stats: { dopamina: 96, autonomia: "Alta", type: "Sales" }
    }
];

export default function RobotsCarousel() {
    const [rotation, setRotation] = useState(270); // Start at top (270 degrees in trigonometry)
    const [isHovered, setIsHovered] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<any>(null);

    // Config
    const radius = 600; // Large radius to create a gentle arc
    const speed = 0.15; // Angular speed

    // Animation Loop
    useEffect(() => {
        let animationFrame: number;
        const animate = () => {
            if (!isHovered && !selectedAgent) {
                setRotation(prev => (prev + speed) % 360);
            }
            animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isHovered, selectedAgent]);

    const getAgentPosition = (index: number) => {
        const total = agents.length;
        const slice = 360 / total;
        const angle = (slice * index) + rotation;
        const radian = (angle * Math.PI) / 180;

        // Calculate Position relative to center
        // Center will be at bottom-center of container
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        // Visibility Check: We only want items in the upper semi-circle roughly
        // In screen coords, assuming center is at (0,0), upper semi-circle is y < 0.
        // Let's refine opacity based on y position (fade out as they go down)

        // Items near -90deg (top) are fully visible.
        // Items near +90deg (bottom) are invisible.

        // Simple visibility check:
        // We want to hide items that "go under" the horizon line.
        // Center is at Y=0 (which will be positioned at container bottom).
        // Standard circle: sin(-90) = -1 (top), sin(90) = 1 (bottom).
        // So y < 0 is "above" the center line.

        const isVisible = y < 100; // Allow a bit of overflow below line for smooth exit
        const opacity = Math.max(0, Math.min(1, (150 - y) / 150)); // Fade out near the bottom line

        return { x, y, isVisible, opacity };
    };

    return (
        <section className="relative h-[800px] bg-[#050608] overflow-hidden flex flex-col items-center">

            {/* Header / Context */}
            <div className="relative z-20 pt-20 text-center mb-8 pointer-events-none">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">Squad Neural</h2>
                <p className="text-blue-500 font-mono text-xs tracking-[0.3em]">Operação em Tempo Real</p>
            </div>

            {/* ROTATION ANCHOR - Positioned at the bottom center */}
            <div
                className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* CENTRAL HUB (VERA) - The "Sun" */}
                <div className="absolute w-[800px] h-[800px] rounded-full border border-blue-500/10 flex items-center justify-center">
                    {/* Inner glowing core */}
                    <div className="w-[100px] h-[100px] bg-blue-500/20 rounded-full blur-[50px] animate-pulse" />

                    {/* Vera Avatar at Center (optional, or just energy core) */}
                    <div className="relative w-32 h-32 rounded-full border-4 border-blue-500 bg-black z-10 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                        <img src={agents[0].image} alt="Vera" className="w-full h-full object-cover rounded-full opacity-80" />
                    </div>
                </div>

                {/* ROTATING ITEMS CONTAINER */}
                {agents.map((agent, index) => {
                    const { x, y, isVisible, opacity } = getAgentPosition(index);

                    // Skip core VERA in the rotating ring if desired, or keep her. 
                    // User said "Vera e os robos circulando ao redor".
                    // If Vera is center, we shouldn't rotate her. Let's filter her out or keep her as item 0 but handle differently?
                    // Actually simplest is: Vera is the static center (rendered above). The agents (index > 0 or all) rotate.
                    if (agent.id === 'maestra') return null; // Skip Vera in ring

                    return (
                        <motion.div
                            key={agent.id}
                            className="absolute"
                            style={{
                                x,
                                y,
                                opacity: isVisible ? opacity : 0,
                                zIndex: isVisible ? 10 : 0,
                                pointerEvents: isVisible ? 'auto' : 'none'
                            }}
                            onClick={() => setSelectedAgent(agent)}
                        >
                            {/* Card Logic */}
                            <div className="relative -translate-x-1/2 -translate-y-1/2 w-48 group cursor-pointer">
                                {/* Connection Line to Center */}
                                <div className="absolute top-1/2 left-1/2 w-[600px] h-[1px] bg-gradient-to-l from-blue-500/20 to-transparent origin-left rotate-[180deg] -z-10"
                                    style={{ transform: `rotate(${Math.atan2(-y, -x)}rad)` }}
                                />

                                <div className="flex flex-col items-center transition-transform duration-300 group-hover:scale-110">
                                    <div className="w-20 h-20 rounded-full border-2 border-gray-700 bg-black overflow-hidden mb-3 shadow-[0_0_20px_rgba(0,0,0,1)] group-hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                                        <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-gray-900/90 backdrop-blur px-4 py-2 rounded-lg border border-gray-800 text-center min-w-[160px] group-hover:border-blue-500/50">
                                        <h3 className="text-white font-bold text-sm leading-none mb-1">{agent.name}</h3>
                                        <p className="text-[9px] text-blue-400 font-mono uppercase truncate">{agent.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* DETAIL MODAL (Reused Holographic Style) */}
            <AnimatePresence>
                {selectedAgent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setSelectedAgent(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 50, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="holo-container max-w-4xl w-full bg-[#0a0a0a] rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-8 shadow-2xl border border-blue-500/20"
                        >
                            <button
                                onClick={() => setSelectedAgent(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Scanline Effect */}
                            <div className="scan-line" />

                            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                                <div className="w-48 h-48 rounded-full border-4 border-blue-500/30 overflow-hidden mb-6 shadow-[0_0_50px_rgba(59,130,246,0.4)] relative">
                                    <img src={selectedAgent.image} alt={selectedAgent.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="bg-blue-900/10 p-2 rounded border border-blue-500/20">
                                        <div className="text-xs text-gray-400 uppercase">Dopamina</div>
                                        <div className="text-xl font-bold text-green-400">{selectedAgent.stats.dopamina}%</div>
                                    </div>
                                    <div className="bg-blue-900/10 p-2 rounded border border-blue-500/20">
                                        <div className="text-xs text-gray-400 uppercase">Autonomia</div>
                                        <div className="text-xl font-bold text-blue-400">{selectedAgent.stats.autonomia}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-2/3">
                                <h2 className="holo-title text-4xl font-black uppercase mb-2">{selectedAgent.name}</h2>
                                <p className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-6 border-b border-blue-500/20 pb-4">
                                    {selectedAgent.role}
                                </p>
                                <p className="holo-text text-xl leading-relaxed text-gray-200 mb-8">
                                    "{selectedAgent.description}"
                                </p>
                                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest transition-all">
                                        Ver Dashboard
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
