import { FileText, Link, Database, Brain, Zap } from 'lucide-react';

export default function KnowledgeSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 tracking-tight font-sans">
                        Como a VERA <span className="text-gray-500">Aprende Sua Marca</span>
                    </h2>
                    <p className="text-gray-600 text-lg font-light leading-relaxed font-sans">
                        Diferente de agências tradicionais que precisam de meses de onboarding, a VERA ingere todo o conhecimento do seu negócio em segundos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Input Sources */}
                    <div className="space-y-6">
                        <div className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-black transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-black">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-black font-bold text-lg font-sans">Documentos</h3>
                                    <p className="text-gray-500 text-sm font-sans">PDFs, Brandbooks, Guias</p>
                                </div>
                            </div>
                        </div>

                        <div className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-black transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-black">
                                    <Link className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-black font-bold text-lg font-sans">Links & URLs</h3>
                                    <p className="text-gray-500 text-sm font-sans">Site atual, Landing Pages</p>
                                </div>
                            </div>
                        </div>

                        <div className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-black transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-black">
                                    <Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-black font-bold text-lg font-sans">Dados Históricos</h3>
                                    <p className="text-gray-500 text-sm font-sans">Analytics, CRM, Planilhas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Processing Core */}
                    <div className="relative h-64 lg:h-96 flex items-center justify-center">
                        {/* Animated Connecting Lines (Abstract Visualization) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-px bg-gray-200 absolute top-1/2 -translate-y-1/2" />
                            <div className="w-full h-px bg-black absolute top-1/2 -translate-y-1/2 animate-pulse opacity-20" />
                        </div>

                        <div className="relative z-10 w-48 h-48 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-2xl">
                            <div className="absolute inset-0 rounded-full border border-gray-200 animate-ping opacity-20" />
                            <Brain className="w-20 h-20 text-black" />
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span className="text-xs font-bold text-black tracking-widest uppercase bg-white px-3 py-1 rounded-full border border-black">
                                    Processamento Neural
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="bg-black text-white rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <h3 className="text-2xl font-bold text-white mb-6 font-sans">Persona Digital Unificada</h3>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                    <Zap className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <strong className="text-white block font-sans">Tom de Voz Consistente</strong>
                                    <span className="text-sm text-gray-400 font-sans">Replica sua personalidade em todos os canais.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                    <Zap className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <strong className="text-white block font-sans">Identidade Visual</strong>
                                    <span className="text-sm text-gray-400 font-sans">Cores, fontes e estética preservadas.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                    <Zap className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <strong className="text-white block font-sans">Conhecimento de Produto</strong>
                                    <span className="text-sm text-gray-400 font-sans">Deep learning sobre seus serviços.</span>
                                </div>
                            </li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <div className="flex items-center justify-between text-gray-400 text-sm font-bold font-mono">
                                <span>Knowledge Base Ready</span>
                                <span className="flex items-center gap-1 text-white">100% <div className="w-2 h-2 rounded-full bg-white animate-pulse" /></span>
                            </div>
                            <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
