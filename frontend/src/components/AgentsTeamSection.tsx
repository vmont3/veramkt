import { motion } from 'framer-motion';
import { useRef } from 'react';

// Dados dos Agentes (Personas)
const agents = [
    {
        id: 'maestra',
        name: 'Maestra VERA',
        role: 'Orchestrator',
        description: 'A CEO Digital. Ela gerencia todos os outros agentes, garante a coerência da marca e alinha estratégias.',
        image: '/avatars/avatar_maestra_vera_1768038994316.png',
        color: 'from-blue-600 to-purple-600',
        stats: { intelligence: 100, autonomy: 100, creativity: 95 }
    },
    {
        id: 'copy',
        name: 'Clarice',
        role: 'Head of Copy',
        description: 'Especialista em persuasão. Cria desde legendas curtas até artigos profundos, sempre no tom da sua marca.',
        image: '/avatars/avatar_linklead_linkedin_1768039007951.png',
        color: 'from-pink-600 to-rose-600',
        stats: { intelligence: 92, autonomy: 95, creativity: 100 }
    },
    {
        id: 'design',
        name: 'Da Vinci',
        role: 'Visual Director',
        description: 'Transforma conceitos em arte visual. Gera posts, banners e identidades visuais impressionantes.',
        image: '/avatars/avatar_instaexpert_instagram_1768039022316.png',
        color: 'from-amber-500 to-orange-600',
        stats: { intelligence: 90, autonomy: 93, creativity: 98 }
    },
    {
        id: 'performance',
        name: 'Hunter',
        role: 'Growth Hacker',
        description: 'O guardião do ROI. Monitora campanhas 24/7, otimiza orçamentos e caça as melhores oportunidades de tráfego.',
        image: '/avatars/avatar_googlemaster_google_1768039064114.png',
        color: 'from-green-500 to-emerald-700',
        stats: { intelligence: 96, autonomy: 98, creativity: 85 }
    }
];

export default function AgentsTeamSection() {
    const scrollRef = useRef(null);

    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-4 mb-16 text-center">
                <span className="text-blue-500 font-mono tracking-widest text-sm uppercase">Sua Nova Equipe</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                    Conheça seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Sócios Digitais</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Eles nunca dormem, nunca pedem férias e ficam mais inteligentes a cada dia.
                    Cada um é um especialista em sua área.
                </p>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {agents.map((agent, index) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer"
                        >
                            {/* Background Image Placeholder if actual image missing, use gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-20 group-hover:opacity-30 transition-opacity`} />

                            {/* Content */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6 border border-white/10 rounded-3xl group-hover:border-white/30 transition-all">

                                <div className="mb-auto mt-4 w-full flex justify-end">
                                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono text-white/80 border border-white/10">
                                        LVL {Math.floor((agent.stats.intelligence + agent.stats.autonomy) / 2)}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">
                                    {agent.name}
                                </h3>
                                <p className="text-sm font-bold text-blue-400 mb-3 tracking-wide uppercase">
                                    {agent.role}
                                </p>
                                <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                    {agent.description}
                                </p>

                                {/* Stats Mini Bars */}
                                <div className="mt-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="w-16">Autonomia</span>
                                        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-white" style={{ width: `${agent.stats.autonomy}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="w-16">Criatividade</span>
                                        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-white" style={{ width: `${agent.stats.creativity}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
