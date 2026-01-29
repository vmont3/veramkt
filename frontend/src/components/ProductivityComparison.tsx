import { BarChart, Clock, Users, Zap } from 'lucide-react';

export default function ProductivityComparison() {
    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-tight font-sans tracking-tight">
                            Agência Humana vs. <br />
                            <span className="text-gray-500">Autonomia VERA</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed font-sans font-light">
                            Escalar uma operação de marketing tradicional exige contratação, treinamento e gerenciamento.
                            Com a VERA, você escala capacidade computacional instantaneamente.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
                                    <Clock className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h4 className="text-black font-bold font-sans">Tempo de Execução</h4>
                                    <p className="text-gray-500 text-sm font-sans">Humanos: Dias/Semanas vs VERA: Minutos</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
                                    <DollarSignIcon className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h4 className="text-black font-bold font-sans">Custo por Asset</h4>
                                    <p className="text-gray-500 text-sm font-sans">Redução de até 90% no custo operacional.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart/Visual */}
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 relative">
                        <h3 className="text-black font-bold text-xl mb-8 font-sans">Volume de Produção Semanal</h3>

                        {/* Human Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm text-gray-500 mb-2 font-mono">
                                <span>Agência Tradicional (5 pessoas)</span>
                                <span>~15 assets</span>
                            </div>
                            <div className="w-full h-12 bg-white border border-gray-200 rounded-lg relative overflow-hidden flex items-center px-4">
                                <div className="absolute top-0 left-0 h-full w-[15%] bg-gray-300 rounded-l-lg" />
                                <span className="relative z-10 text-gray-600 font-bold text-sm font-sans">Limitado</span>
                            </div>
                        </div>

                        {/* VERA Bar */}
                        <div>
                            <div className="flex justify-between text-sm text-gray-500 mb-2 font-mono">
                                <span className="text-black font-bold">VERA (Autônoma)</span>
                                <span className="text-black font-bold">Ilimitado*</span>
                            </div>
                            <div className="w-full h-16 bg-white border border-black rounded-lg relative overflow-hidden flex items-center px-4 shadow-lg shadow-gray-200">
                                <div className="absolute top-0 left-0 h-full w-[95%] bg-black rounded-l-lg" />
                                <span className="relative z-10 text-white font-bold text-lg flex items-center gap-2 font-sans">
                                    <Zap className="w-5 h-5 fill-white" /> 500+ assets
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Disponibilidade</p>
                                <p className="text-black font-bold text-lg font-mono">24/7/365</p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Simultaneidade</p>
                                <p className="text-black font-bold text-lg font-mono">∞ Canais</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

function DollarSignIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="1" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    )
}
