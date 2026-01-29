import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaShieldAlt, FaPenNib, FaPaintBrush, FaVideo, FaComments, FaSearchDollar } from 'react-icons/fa';

const AgentCard = ({ name, role, icon, description, type }: any) => {
    const isLeader = type === 'leader';
    const isOrchestrator = type === 'orchestrator';

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`relative p-6 rounded-2xl border ${isOrchestrator ? 'bg-black border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)] md:col-span-3 lg:col-span-4' :
                    isLeader ? 'bg-gray-900 border-gray-700 md:col-span-1 lg:col-span-2' :
                        'bg-black/50 border-gray-800'
                }`}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${isOrchestrator ? 'bg-blue-600 text-white' : isLeader ? 'bg-gray-800 text-blue-400' : 'bg-gray-800/50 text-gray-400'} text-2xl`}>
                    {icon}
                </div>
                <div>
                    <h3 className={`font-bold ${isOrchestrator ? 'text-2xl text-white' : 'text-lg text-white'}`}>{name}</h3>
                    <p className="text-xs uppercase tracking-widest text-gray-500">{role}</p>
                </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}

export default function AgentesPage() {
    const agents = [
        // Orchestrator
        {
            name: "Vera Orquestradora",
            role: "O Cérebro Central",
            icon: <FaBrain />,
            description: "A inteligência central que recebe seus pedidos, entende sua intenção e delega tarefas para os agentes especialistas. Ela garante que todos trabalhem na mesma direção.",
            type: "orchestrator"
        },
        // Leaders
        {
            name: "Head de Estratégia",
            role: "StrategyAI (CMO)",
            icon: <FaChartLine />,
            description: "Detentor do Blueprint. Ele analisa métricas, tendências de mercado e define O QUE deve ser feito. Não executa, apenas planeja os movimentos vencedores.",
            type: "leader"
        },
        {
            name: "Guardião Financeiro",
            role: "FinanceGuard (CFO)",
            icon: <FaShieldAlt />,
            description: "Responsável por proteger seu dinheiro. Ele monitora o ROI de campanhas em tempo real e bloqueia gastos ineficientes antes que se tornem prejuízo.",
            type: "leader"
        },
        // Squad
        {
            name: "Copywriter Senior",
            role: "Especialista em Texto",
            icon: <FaPenNib />,
            description: "Cria textos persuasivos, legendas, artigos de blog e roteiros de vídeo usando GPT-4o e Claude 3.5 com fine-tuning em copywriting.",
            type: "squad"
        },
        {
            name: "Designer Lead",
            role: "Especialista Visual",
            icon: <FaPaintBrush />,
            description: "Gera conceitos visuais, layouts e artes para redes sociais usando DALL-E 3 e Stable Diffusion.",
            type: "squad"
        },
        {
            name: "Video Maker",
            role: "Motion & Generative",
            icon: <FaVideo />,
            description: "Produz vídeos curtos, animações e edições dinâmicas para TikTok/Reels usando Runway Gen-2 e Grok.",
            type: "squad"
        },
        {
            name: "Social Manager",
            role: "Engajamento",
            icon: <FaComments />,
            description: "Responde DMs, comentários e interage com seguidores para manter sua comunidade ativa e aquecida.",
            type: "squad"
        },
        {
            name: "Hunter B2B",
            role: "Prospecção",
            icon: <FaSearchDollar />,
            description: "Investiga o LinkedIn e a web em busca de leads qualificados que correspondam ao perfil do seu cliente ideal.",
            type: "squad"
        }
    ];

    return (
        <Layout>
            <div className="bg-black min-h-screen pt-32 pb-24 px-4 font-sans">
                <div className="container mx-auto max-w-7xl">

                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                            CONHEÇA A <span className="text-blue-600">SQUAD.</span>
                        </h1>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                            Não contratamos juniors. Você tem acesso a uma equipe de elite,
                            treinada nas melhores metodologias e disponível 24/7.
                        </p>
                    </div>

                    {/* HIERARCHY GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 relative">
                        {/* Connecting Lines (Visual Decoration) */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 hidden lg:block" style={{
                            backgroundImage: 'radial-gradient(circle at 50% 20%, #2563EB 2px, transparent 2px)',
                            backgroundSize: '20px 20px'
                        }} />

                        {agents.map((agent, idx) => (
                            <AgentCard key={idx} {...agent} />
                        ))}
                    </div>

                </div>
            </div>
        </Layout>
    );
}
