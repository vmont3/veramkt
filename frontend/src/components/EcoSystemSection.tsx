import { motion } from 'framer-motion';
import { FaRobot, FaTools } from 'react-icons/fa';

export default function EcoSystemSection() {
    return (
        <section className="py-24 bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        A Evolução do Marketing
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Deixe o caos das ferramentas para trás. Entre na era dos Agentes Autônomos.
                    </p>
                </div>

                {/* ROW 1: COMPETITORS */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto mb-12">
                    {/* Competitor 1: Traditional Agencies */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-900/30 p-8 rounded-3xl border border-gray-800 transition-all duration-300 group hover:bg-black/40"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gray-800 rounded-xl">
                                <FaTools className="text-2xl text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-200">Agências Tradicionais</h3>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start text-gray-400">
                                <span className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                                <p>Dependência 100% humana (Lento)</p>
                            </li>
                            <li className="flex gap-3 items-start text-gray-400">
                                <span className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                                <p>Aprovação manual e gargalos criativos</p>
                            </li>
                            <li className="flex gap-3 items-start text-gray-400">
                                <span className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                                <p>Zero sistema cognitivo (Memória falha)</p>
                            </li>
                            <li className="flex gap-3 items-start text-gray-400">
                                <span className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                                <p>Custo alto de retenção e gestão</p>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Competitor 2: Generic AI Agencies */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900/30 p-8 rounded-3xl border border-gray-800 transition-all duration-300 group hover:bg-black/40"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gray-800 rounded-xl">
                                <FaRobot className="text-2xl text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-200">Agências de "IA" Comuns</h3>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start text-gray-400">
                                <span className="w-2 h-2 mt-2 rounded-full bg-yellow-500 shrink-0" />
                                <p>Apenas um LLM com Templates (Genérico)</p>
                            </li>
                            <li className="flex gap-3 items-start text-gray-400">
                                <span className="w-2 h-2 mt-2 rounded-full bg-yellow-500 shrink-0" />
                                <p>Zero validação cruzada (Alucinações)</p>
                            </li>
                            <li className="flex gap-3 items-start text-gray-400">
                                <span className="w-2 h-2 mt-2 rounded-full bg-yellow-500 shrink-0" />
                                <p>Automações burras sem contexto</p>
                            </li>
                            <li className="flex gap-3 items-start text-gray-400">
                                <span className="w-2 h-2 mt-2 rounded-full bg-yellow-500 shrink-0" />
                                <p>Falta de profundidade estratégica</p>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* ROW 2: THE VERA WAY */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-1 rounded-3xl relative"
                >
                    <div className="bg-black/90 backdrop-blur-xl p-8 md:p-12 rounded-[22px] border border-blue-500/30 relative z-10">

                        <div className="text-center mb-12">
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Por que VERA é a Única Escolha Lógica?</h3>
                            <p className="text-blue-400 font-mono text-sm uppercase tracking-wider">4 Pilares de Diferenciação Absoluta</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">

                            {/* Feature 1 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">1</span>
                                    <h4 className="text-xl font-bold text-white">Centralização Absoluta</h4>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed pl-11">
                                    Toda informação entra e sai pela VERA. Ela é a <strong className="text-white">Single Source of Truth</strong>. Isso garante que sua marca tenha uma única voz, evitando o "coral desafinado" de ferramentas soltas.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">2</span>
                                    <h4 className="text-xl font-bold text-white">Gerentes Estratégicos</h4>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed pl-11">
                                    Nossos Heads (Design, Copy, Growth) <strong className="text-white">não executam, eles gerenciam</strong>. Eles definem a intenção e validam a estratégia, cortando alucinações e erros na origem, não no final.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">3</span>
                                    <h4 className="text-xl font-bold text-white">Especialização Contextual</h4>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed pl-11">
                                    Adeus conteúdo genérico. O agente de Instagram só "pensa" em Instagram. O de LinkedIn só "pensa" em B2B. <strong className="text-white">Escopo fechado</strong> garante a máxima performance nativa de cada plataforma.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">4</span>
                                    <h4 className="text-xl font-bold text-white">Validação Cruzada (Redundância)</h4>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed pl-11">
                                    Antes de você ver qualquer coisa, os agentes debatem entre si. Um cria, o outro critica, o terceiro aprova. Essa <strong className="text-white">camada de proteção</strong> elimina o viés de "confirmação automática" das IAs comuns.
                                </p>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

