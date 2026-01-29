import { motion } from 'framer-motion';
import { MessageSquare, BrainCircuit, Users, Bot, ShieldCheck, CheckCircle, ThumbsUp } from 'lucide-react';

const steps = [
    {
        id: "01",
        title: "Usuário",
        subtitle: "Você define o objetivo via chat",
        description: '"Quero vender mais no Natal"',
        icon: MessageSquare,
        color: "text-white",
        bg: "bg-gray-800",
        border: "border-gray-700"
    },
    {
        id: "02",
        title: "VERA (Orquestradora)",
        subtitle: "Recebe, entende e distribui a demanda",
        description: 'Single Source of Truth',
        icon: BrainCircuit,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        id: "03",
        title: "Heads (Estratégia)",
        subtitle: "Criam a intenção e o plano tático",
        description: 'Planejamento e Intenção',
        icon: Users,
        color: "text-gray-300",
        bg: "bg-gray-900",
        border: "border-gray-600"
    },
    {
        id: "04",
        title: "Agentes de Plataforma",
        subtitle: "Execução contextual nativa",
        description: 'Instagram, LinkedIn, Email...',
        icon: Bot,
        color: "text-blue-400",
        bg: "bg-blue-900/20",
        border: "border-blue-500/30"
    },
    {
        id: "05",
        title: "Revisão Cruzada",
        subtitle: "Redundância inteligente e validação",
        description: 'Copy check, Design check...',
        icon: ShieldCheck,
        color: "text-white",
        bg: "bg-gray-800",
        border: "border-white/10"
    },
    {
        id: "06",
        title: "VERA (Síntese)",
        subtitle: "Consolida e assume responsabilidade final",
        description: 'Controle de Qualidade',
        icon: CheckCircle,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-400/20"
    },
    {
        id: "07",
        title: "Usuário (Aprovação)",
        subtitle: "Aprova ou solicita ajuste final",
        description: '-> Fila de Execução',
        icon: ThumbsUp,
        color: "text-white",
        bg: "bg-gray-800",
        border: "border-gray-700"
    }
];

export default function WorkflowCycleSection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-800 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-blue-500 font-bold tracking-wider text-sm uppercase">Simples. Rápido. Autônomo.</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
                        Ciclo Autônomo de <span className="text-blue-500">Funcionamento</span>
                    </h2>
                    <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
                        Da conversa simples à execução completa, o fluxo segue rigorosamente o manual de marca e qualidade.
                    </p>
                </div>

                <div className="relative">

                    {/* Grid updated for 7 items. Might wrap on smaller large screens, full row on XL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group h-full"
                                >
                                    <div className={`h-full p-4 rounded-2xl border ${step.border} ${step.bg} hover:bg-opacity-20 transition-all duration-300 backdrop-blur-sm flex flex-col items-center text-center relative z-10`}>

                                        {/* Icon Container */}
                                        <div className={`w-12 h-12 rounded-full ${step.bg} border ${step.border} flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`w-6 h-6 ${step.color} relative z-10`} />

                                            {/* Number Badge */}
                                            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black border border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                {step.id}
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-bold text-white mb-2 leading-tight min-h-[3rem] flex items-center justify-center">{step.title}</h3>

                                        <div className="w-8 h-[1px] bg-gray-700/50 mb-3" />

                                        <p className="text-gray-300 text-xs font-medium mb-3 leading-snug">
                                            {step.subtitle}
                                        </p>

                                        <p className={`text-[10px] ${step.color} font-mono bg-black/30 px-2 py-1 rounded w-full`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Connector to Next Section */}
                <div className="flex justify-center mt-16 opacity-50">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-800 to-blue-500/50" />
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
