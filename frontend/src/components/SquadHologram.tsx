import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Activity } from 'lucide-react';
import '../styles/hologram-fonts.css';

// --- DATA ---
const avatarBase = "/avatars/";

interface Agent {
    id: string;
    name: string;
    role: string;
    tech: string;
    image: string;
    desc: string;
    icon: string; // The central symbol
    orbitIcon: string; // The orbiting satellite symbol
    color: string;
    filter?: string; // CSS filter for image uniqueness
    reportsTo: string; // New Field: Chain of Command
}

const agents: Agent[] = [
    // MANAGERS (HEADS)
    {
        id: "maestra",
        name: "Maestra VERA",
        role: "Inteligência Central",
        tech: "Rede Neural V4",
        image: avatarBase + "new_maestra.png",
        desc: "A singularidade do sistema. Coordena todos os agentes e garante a harmonia estratégica da sua marca.",
        icon: "VERA",
        orbitIcon: "🧠",
        color: "#ffffff",
        reportsTo: "CEO (Você)"
    },
    {
        id: "growth",
        name: "Head of Growth",
        role: "Estrategista de Dados",
        tech: "IA Preditiva",
        image: avatarBase + "new_growth.png",
        desc: "Analisa tendências de mercado e funis de conversão para ajustar a rota das campanhas em tempo real.",
        icon: "📈",
        orbitIcon: "🚀",
        color: "#10b981",
        reportsTo: "Maestra VERA"
    },
    {
        id: "finance",
        name: "Finance Guard",
        role: "Guardião do ROI",
        tech: "Algoritmo FinOps",
        image: avatarBase + "new_finance.png",
        desc: "Monitora o retorno sobre investimento a cada segundo. Veta automaticamente campanhas com prejuízo.",
        icon: "$",
        orbitIcon: "🛡️",
        color: "#f59e0b",
        reportsTo: "Maestra VERA"
    },
    {
        id: "copy",
        name: "Senior Scribe",
        role: "Diretor de Narrativa",
        tech: "LLM Criativo",
        image: avatarBase + "new_scribe.png",
        desc: "Cria a voz da sua marca. Mestre em persuasão, gatilhos mentais e roteiros de alta conversão.",
        icon: "✍️",
        orbitIcon: "✒️",
        color: "#3b82f6",
        reportsTo: "Maestra VERA"
    },
    {
        id: "blueprint",
        name: "Blueprint Engine",
        role: "Compliance & Ética",
        tech: "Lógica Sentinela",
        image: avatarBase + "new_blueprint.png",
        desc: "O sistema imunológico da marca. Garante que nenhuma comunicação viole seus manuais de ética e tom de voz.",
        icon: "⚖️",
        orbitIcon: "🔒",
        color: "#00f3ff",
        reportsTo: "Maestra VERA"
    },
    {
        id: "visual",
        name: "Visual Director",
        role: "Direção de Arte",
        tech: "Visão Computacional",
        image: avatarBase + "new_visual.png",
        desc: "Supervisiona a estética de todos os canais. Garante coerência visual e qualidade premium em cada pixel.",
        icon: "🎨",
        orbitIcon: "👁️",
        color: "#8b5cf6",
        reportsTo: "Maestra VERA"
    },

    // SOCIAL AGENTS
    {
        id: "instagram",
        name: "Insta Expert",
        role: "Especialista Instagram",
        tech: "Grafo Social",
        image: avatarBase + "new_insta.png",
        desc: "Gerencia feed, stories e reels. Especialista em engajamento visual e crescimento orgânico.",
        icon: "IG",
        orbitIcon: "📸",
        color: "#d946ef",
        reportsTo: "Visual & Copy"
    },
    {
        id: "facebook",
        name: "Face Manager",
        role: "Especialista Meta Ads",
        tech: "API de Audiência",
        image: avatarBase + "new_face.png",
        desc: "Gestão avançada de comunidades, grupos e tráfego pago dentro do ecossistema Facebook.",
        icon: "f",
        orbitIcon: "👥",
        color: "#1877f2",
        reportsTo: "Growth & Visual"
    },
    {
        id: "tiktok",
        name: "Tok Trend",
        role: "Caçador de Virais",
        tech: "Stream de Trends",
        image: avatarBase + "new_tiktok.png",
        desc: "Monitora tendências virais minuto a minuto. Adapta sua marca para os formatos explosivos do momento.",
        icon: "Tk",
        orbitIcon: "🎵",
        color: "#00f2ea",
        reportsTo: "Visual Director"
    },
    {
        id: "linkedin",
        name: "Link Lead",
        role: "Autoridade B2B",
        tech: "Lógica de Vendas",
        image: avatarBase + "new_linkedin.png",
        desc: "Constroi autoridade corporativa e conecta sua marca diretamente com decisores de grandes empresas.",
        icon: "in",
        orbitIcon: "💼",
        color: "#0a66c2",
        reportsTo: "Growth"
    },
    {
        id: "twitter",
        name: "X Comms",
        role: "PR em Tempo Real",
        tech: "NLP Ao Vivo",
        image: avatarBase + "new_x.png",
        desc: "Gerenciamento de reputação e crises. Responde ao público instantaneamente e aproveita o 'hype' de notícias.",
        icon: "X",
        orbitIcon: "📢",
        color: "#ffffff",
        reportsTo: "Senior Scribe"
    },
    {
        id: "youtube",
        name: "Tube Vision",
        role: "SEO de Vídeo",
        tech: "Algo de Retenção",
        image: avatarBase + "new_youtube.png",
        desc: "Otimiza títulos, thumbnails e roteiros para dominar as buscas no maior site de vídeos do mundo.",
        icon: "YT",
        orbitIcon: "▶️",
        color: "#ff0000",
        reportsTo: "Visual Director"
    },
    {
        id: "whatsapp",
        name: "Zap Closer",
        role: "Fechamento de Vendas",
        tech: "IA Conversacional",
        image: avatarBase + "new_whatsapp.png",
        desc: "Recupera carrinhos abandonados e negocia vendas complexas 1 a 1 com timing perfeito.",
        icon: "Zap",
        orbitIcon: "💬",
        color: "#22c55e",
        reportsTo: "Support Agent"
    },
    {
        id: "telegram",
        name: "Tele Pulse",
        role: "Gestor de Broadcast",
        tech: "Push API",
        image: avatarBase + "new_telegram.png",
        desc: "Mantém canais VIP e listas de transmissão engajadas com conteúdo exclusivo e alertas rápidos.",
        icon: "Tg",
        orbitIcon: "✈️",
        color: "#0ea5e9",
        reportsTo: "Scribe & Growth"
    },
    {
        id: "email",
        name: "Mail Mind",
        role: "Arquiteto de CRM",
        tech: "Ciclo de Vida Auto",
        image: avatarBase + "new_email.png",
        desc: "Desenha jornadas de cliente complexas e automações de email para maximizar o valor vitalício (LTV).",
        icon: "@",
        orbitIcon: "📧",
        color: "#f97316",
        reportsTo: "Scribe & Support"
    },
    {
        id: "google",
        name: "Google Master",
        role: "Rei das Buscas",
        tech: "IA de Leilão",
        image: avatarBase + "new_google.png",
        desc: "Domina a intenção de busca no Google Ads e SEO orgânico para capturar demanda qualificada.",
        icon: "G",
        orbitIcon: "🔍",
        color: "#4285f4",
        reportsTo: "Growth"
    },
    {
        id: "chat",
        name: "Support Agent",
        role: "Sucesso do Cliente",
        tech: "NLP de Serviço",
        image: avatarBase + "new_support.png",
        desc: "Atendimento 24 horas. Tira dúvidas, resolve problemas e garante que nenhum cliente fique esperando.",
        icon: "?",
        orbitIcon: "🤝",
        color: "#8b5cf6",
        reportsTo: "Maestra VERA"
    }
];

// --- 3D COMPONENTS ---

const HoloCore = ({ activeAgentId }: { activeAgentId: string }) => {
    const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];
    const texture = useLoader(TextureLoader, activeAgent.image);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        // Subtle floating/breathing animation for the image
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1) * 0.1;
        }
    });

    return (
        <group>
            {/* Robot Portrait - Clean Billboard Effect */}
            {/* Using a PlaneGeometry with scale adjusted for portrait */}
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                <mesh ref={meshRef} scale={[3.8, 3.8, 3.8]}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={1}
                        side={THREE.DoubleSide}
                        toneMapped={false}
                    />
                </mesh>
            </Float>

            {/* Simple Backlight Glow */}
            <pointLight position={[0, 0, -2]} distance={5} intensity={2} color={activeAgent.color} />
        </group>
    );
};


export default function SquadHologram() {
    const [selectedId, setSelectedId] = useState<string>("maestra");
    const activeAgent = agents.find(a => a.id === selectedId) || agents[0];

    // Auto-scroll logic (optional, but requested "looping"? No, "circular em looping" referred to symbols).
    // Let's keep manual drag for dock
    const sliderRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (sliderRef.current) {
            setWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
        }
    }, [activeAgent]);

    return (
        <div className="relative w-full min-h-[160vh] bg-[#020305] overflow-hidden flex flex-col justify-between items-center text-white font-sans selection:bg-blue-500/30">

            {/* --- BACKGROUND --- */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#051020_0%,#020305_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [perspective:1000px] [transform-style:preserve-3d] opacity-40 pointer-events-none" />

            {/* --- SECTION HEADER (Flow Layout) --- */}
            <div className="relative z-20 text-center pt-28 pb-2 px-4 pointer-events-none">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-holo-title uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 tracking-widest drop-shadow-[0_0_25px_rgba(0,100,255,0.3)] mb-4"
                >
                    Um Exército de Agentes Autônomos <br className="md:hidden" /> Sob Seu Comando
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-blue-200 font-mono text-xs md:text-sm tracking-[0.15em] uppercase max-w-3xl mx-auto leading-relaxed opacity-80 text-shadow-glow"
                >
                    Conheça o time de especialistas que aprende com seus dados e segue suas ordens à risca.<br className="hidden md:block" />
                    <span className="text-white font-bold">Você define a missão. Eles simplesmente executam.</span>
                </motion.p>
            </div>

            {/* --- MAIN HUD CONTENT (Natural Flow) --- */}
            <div className="relative w-full flex-1 flex flex-col md:flex-row items-center justify-center z-0 pt-0 pb-48">

                {/* LEFT HUD (Loose Text) */}
                <div className="hidden md:flex flex-col items-end text-right w-1/4 pr-12 space-y-6 z-20">
                    <div>
                        <h4 className="text-blue-400 text-xs font-holo-tech uppercase tracking-widest mb-2">Identidade do Agente</h4>

                        <h2 className="text-4xl lg:text-5xl font-holo-title uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-none">
                            {activeAgent.name.split(' ')[0]}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-2xl lg:text-3xl">
                                {activeAgent.name.split(' ').slice(1).join(' ')}
                            </span>
                        </h2>
                    </div>

                    <div className="relative group">
                        <div className="absolute top-2 -right-8 w-6 h-[1px] bg-blue-500/50" />
                        <h4 className="text-blue-400 text-xs font-holo-tech uppercase tracking-widest mb-1">Função Operacional</h4>
                        <p className="text-lg lg:text-xl font-holo-body font-bold text-gray-200 uppercase tracking-wider">{activeAgent.role}</p>
                    </div>

                    <div className="relative">
                        <div className="absolute top-2 -right-8 w-6 h-[1px] bg-blue-500/50" />
                        <h4 className="text-blue-400 text-xs font-holo-tech uppercase tracking-widest mb-1">Tecnologia Central</h4>
                        <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-sm font-holo-tech text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                            {activeAgent.tech}
                        </div>
                    </div>

                </div>


                {/* CENTER 3D PROJECTION */}
                <div className="w-full md:w-[600px] h-[400px] md:h-[600px] relative z-10 scale-90 md:scale-100 flex items-center justify-center">

                    <Canvas camera={{ position: [0, 0, 6], fov: 35 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 5, 5]} intensity={1} color={activeAgent.color} />
                        <pointLight position={[-10, -5, 5]} intensity={0.5} color="#ffffff" />
                        <HoloCore activeAgentId={selectedId} />
                        {/* Restricted Orbit for "Display Case" feel */}
                        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 2.5} rotateSpeed={0.5} />
                    </Canvas>
                </div>


                {/* RIGHT HUD (Loose Text) */}
                <div className="hidden md:flex flex-col items-start text-left w-1/4 pl-12 space-y-6 z-20">

                    <div className="relative w-full max-w-xs">
                        <div className="absolute top-2 -left-8 w-6 h-[1px] bg-blue-500/50" />

                        <div className="flex items-center gap-2 mb-3">
                            <Activity size={16} className="text-green-400 animate-pulse" />
                            <h4 className="text-blue-400 text-xs font-holo-tech uppercase tracking-widest">Status do Sistema</h4>
                        </div>

                        <div className="space-y-4 font-holo-body">
                            <div>
                                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                                    <span>Nível de Dopamina</span>
                                    <span className="text-green-400 font-bold">99.2%</span>
                                </div>
                                <div className="w-full h-[2px] bg-gray-800/50">
                                    <div className="h-full bg-green-400 shadow-[0_0_8px_lime]" style={{ width: '99%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                                    <span>Processamento</span>
                                    <span className="text-blue-400 font-bold">100%</span>
                                </div>
                                <div className="w-full h-[2px] bg-gray-800/50">
                                    <div className="h-full bg-blue-400 shadow-[0_0_8px_blue]" style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative max-w-xs">
                        <div className="absolute top-2 -left-8 w-6 h-[1px] bg-blue-500/50" />
                        <h4 className="text-blue-400 text-xs font-holo-tech uppercase tracking-widest mb-3">Resumo Operacional</h4>
                        <p className="text-sm text-gray-300 leading-relaxed font-holo-body font-light border-l border-blue-500/30 pl-4">
                            <span className="text-white/80">{activeAgent.desc}</span>
                        </p>
                    </div>

                    <div className="relative max-w-xs">
                        <div className="absolute top-2 -left-8 w-6 h-[1px] bg-blue-500/50" />
                        <h4 className="text-blue-400 text-xs font-holo-tech uppercase tracking-widest mb-3">Reporta a</h4>
                        <span className="text-white/80 font-bold uppercase tracking-wider pl-4">{activeAgent.reportsTo}</span>
                    </div>

                </div>
            </div>


            {/* --- BOTTOM DOCK (Draggable) --- */}
            <div className="absolute bottom-8 z-30 w-full max-w-[95%] md:max-w-7xl px-4">

                <div className="relative bg-[#050810]/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]">

                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                    <motion.div
                        ref={sliderRef}
                        className="flex gap-4 cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {agents.map((agent) => (
                            <motion.button
                                key={agent.id}
                                onClick={() => setSelectedId(agent.id)}
                                className={`
                                    relative flex-shrink-0 w-32 h-40 md:w-40 md:h-48 rounded-xl overflow-hidden border transition-all duration-300 group
                                    ${selectedId === agent.id ? 'border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.2)] scale-100 opacity-100 z-10' : 'border-white/5 opacity-50 hover:opacity-100 hover:scale-105 hover:border-white/20'}
                                `}
                            >
                                <div className="absolute inset-0 bg-black">
                                    <img
                                        src={agent.image}
                                        alt={agent.name}
                                        className="w-full h-full object-cover transition-all duration-300"
                                        style={{ filter: agent.filter || 'none' }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                <div className="absolute bottom-0 inset-x-0 p-3 pt-6 bg-gradient-to-t from-black to-transparent text-center">
                                    <div className="text-[9px] font-holo-tech text-blue-400 uppercase leading-none mb-1 tracking-wider">{agent.role.split(' ')[0]}</div>
                                    <div className="text-xs font-holo-title text-white uppercase leading-none truncate">{agent.name}</div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </div>

        </div>
    );
}
