import React from 'react';
import { ShieldCheck, Brain, Server, Users, ArrowRight, CheckCircle2, AlertTriangle, Zap, Activity, MessageSquare, Terminal, GitMerge, Lock, RefreshCw, Briefcase, Building2, Globe, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HolographicSection from './HolographicSection';
import SquadHologram from './SquadHologram';
import BlogCarouselSection from './BlogCarouselSection';
import NeuralProcessSection from './NeuralProcessSection';

export default function HomeUnifiedContent() {
    const navigate = useNavigate();

    const handleCtaClick = () => {
        navigate('/signup'); // or appropriate route
    };

    return (
        <div className="bg-[#0B0C10] text-gray-100 font-sans selection:bg-blue-500/30">

            {/* DOBRA 2 – IDENTIFICAÇÃO DA DOR REAL DO MERCADO */}
            <section className="py-24 px-6 md:px-20 border-b border-gray-800/50 relative overflow-hidden">
                <div className="max-w-5xl mx-auto text-center mb-20 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                        O que realmente <span className="text-gray-500 line-through decoration-red-500/50 decoration-2">não</span> funciona<br /> com o mercado atual.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Modelos arcaicos e agências digitais que operam com <strong className="text-gray-200">robôs desorientados</strong> e sem comandos específicos.
                        Dinheiro desperdiçado em automação burra, processos manuais que matam seu time de exaustão e custos de equipe que orbitam o insustentável.
                        <br /><br />
                        Você não precisa de mais uma ferramenta. Você precisa estancar o sangramento operacional.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
                    {/* CARD 1: AGÊNCIA TRADICIONAL */}
                    <div className="group relative bg-[#121212] border border-gray-800 rounded-2xl p-8 md:p-12 overflow-hidden transition-all duration-500 hover:border-gray-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        {/* Background Image - Office Chaos - FORCED VISIBILITY */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')" }}
                        ></div>
                        {/* Gradient Overlay - Lighter to show image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#121212]/50 to-transparent pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-white mb-2 shadow-black drop-shadow-md">Agência Tradicional</h3>
                            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-10 border-b border-gray-800 pb-4">O modelo "caixa preta"</p>

                            <ul className="space-y-6 text-gray-200 text-lg font-medium drop-shadow-sm">
                                <li className="flex items-start gap-4">
                                    <span className="text-red-500 mt-1 font-bold">✕</span>
                                    <span>Reuniões intermináveis para aprovar um post.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-red-500 mt-1 font-bold">✕</span>
                                    <span>Equipes inchadas repassando custos para você.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-red-500 mt-1 font-bold">✕</span>
                                    <span>Falta de agilidade: "Vamos ver isso na próxima sprint."</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-red-500 mt-1 font-bold">✕</span>
                                    <span>Criatividade baseada em "achismo", não em dados.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CARD 2: AGÊNCIA 'DIGITAL' GENÉRICA */}
                    <div className="group relative bg-[#121212] border border-gray-800 rounded-2xl p-8 md:p-12 overflow-hidden transition-all duration-500 hover:border-gray-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        {/* Background Image - Robot/Tech Chaos - FORCED VISIBILITY */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=2274&auto=format&fit=crop')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#121212]/50 to-transparent pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-white mb-2 shadow-black drop-shadow-md">Agência "Tech" Genérica</h3>
                            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-10 border-b border-gray-800 pb-4">O modelo "spam automatizado"</p>

                            <ul className="space-y-6 text-gray-200 text-lg font-medium drop-shadow-sm">
                                <li className="flex items-start gap-4">
                                    <span className="text-red-500 mt-1 font-bold">✕</span>
                                    <span>Chatbots burros que irritam seus clientes reais.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-red-500 mt-1 font-bold">✕</span>
                                    <span>Conteúdo gerado por IA sem alma e sem revisão.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-red-500 mt-1 font-bold">✕</span>
                                    <span>Ferramentas desconexas que não falam a mesma língua.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-red-500 mt-1 font-bold">✕</span>
                                    <span>Volume alto, conversão irrelevante.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* DOBRA 3 – O QUE A VERA É (HOLOGRAPHIC MODE) */}
            <HolographicSection />

            {/* DOBRA 4 - SQUAD NEURAL (TRUE HOLOGRAM) */}
            <SquadHologram />

            {/* DOBRA 5 – NEURAL PROCESS ARCHITECTURE (Immersive 3D) */}
            <NeuralProcessSection />

            {/* DOBRA 5 – DIFERENCIAL FORTE (COM ROBÔ VERA) */}
            <section className="py-24 px-6 md:px-20 bg-[#0F1116] border-b border-gray-800/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">

                    {/* HEADER FULL WIDTH */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white">
                            A VERA não “promete resultado”.<br />
                            <span className="text-gray-400">Ela elimina o erro humano.</span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto font-light">
                            O marketing falha por inconsistência, esquecimento e falta de validação. <br className="hidden md:block" />
                            A VERA resolve isso com governança absoluta.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

                        {/* LEFT COLUMN: VERA ROBOT (CLEAN & SHARP) */}
                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                            <div className="relative w-[300px] md:w-[400px]">
                                <img
                                    src="/src/assets/vera_robot_full.png"
                                    alt="VERA Robot Avatar"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: TEXT CONTENT (CLEAN LIST) */}
                        <div className="w-full lg:w-1/2">
                            <div className="space-y-10">
                                <ul className="space-y-6">
                                    <li className="flex items-center gap-6">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_10px_currentColor]" />
                                        <span className="text-xl md:text-2xl text-white font-medium">Ela <strong className="text-white font-bold">nunca</strong> inventa dados.</span>
                                    </li>
                                    <li className="flex items-center gap-6">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_10px_currentColor]" />
                                        <span className="text-xl md:text-2xl text-white font-medium">Não responde o que não sabe.</span>
                                    </li>
                                    <li className="flex items-center gap-6">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_10px_currentColor]" />
                                        <span className="text-xl md:text-2xl text-white font-medium">Não publica sem sua revisão.</span>
                                    </li>
                                </ul>

                                <div className="pl-8 border-l-2 border-gray-800">
                                    <p className="text-gray-400 italic text-lg leading-relaxed">
                                        "Quando falta informação, ela pergunta. Quando algo não performa, ela pausa. Quando há desperdício, ela corta."
                                    </p>
                                    <p className="mt-6 text-blue-500 font-bold uppercase tracking-widest text-sm">
                                        Isso não é promessa. É governança.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* DOBRA 6 – INTELIGÊNCIA DE MERCADO */}
            <section className="py-24 px-6 md:px-20 border-b border-gray-800/50">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Enquanto você comunica, a VERA observa o mercado</h2>
                    <p className="text-gray-400 text-lg">Gestão de redes sociais com inteligência artificial aplicada ao marketing real. A VERA monitora:</p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                    {/* Widget 1: Competitor Ads */}
                    <div className="bg-[#0F1116] p-6 rounded-3xl border border-gray-800 flex flex-col gap-4 group hover:border-blue-500/50 hover:bg-[#13151A] transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] cursor-default">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                    Espionagem
                                </h3>
                                <div className="flex gap-2">
                                    <div className="w-8 h-10 bg-gray-800/50 rounded border border-gray-700 flex items-center justify-center transition-colors group-hover:border-blue-500/30"><div className="w-4 h-4 rounded bg-blue-500/20"></div></div>
                                    <div className="w-8 h-10 bg-gray-800/50 rounded border border-gray-700 opacity-50 flex items-center justify-center"><div className="w-4 h-4 rounded bg-gray-600/20"></div></div>
                                    <div className="w-8 h-10 bg-gray-800/50 rounded border border-gray-700 opacity-30 flex items-center justify-center"><div className="w-4 h-4 rounded bg-gray-600/20"></div></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold text-xl group-hover:text-blue-400 transition-colors">3</p>
                                <p className="text-[10px] text-gray-500 uppercase">Novos anúncios</p>
                            </div>
                        </div>

                        {/* EXPANDABLE CONTENT */}
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                            <div className="overflow-hidden">
                                <div className="pt-4 border-t border-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                                        Monitoramento em tempo real de criativos e ofertas da concorrência. Saiba o que está escalando e contra-ataque sem gastar verba de teste às cegas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget 2: Trends */}
                    <div className="bg-[#0F1116] p-6 rounded-3xl border border-gray-800 flex flex-col gap-4 group hover:border-purple-500/50 hover:bg-[#13151A] transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] cursor-default">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Activity size={14} />
                                    Viralização
                                </h3>
                                <div className="space-y-1.5 w-24">
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[85%] bg-purple-500 group-hover:w-full transition-all duration-1000"></div>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[60%] bg-gray-600"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">Alta</p>
                                <p className="text-[10px] text-gray-500 uppercase">Relevância</p>
                            </div>
                        </div>

                        {/* EXPANDABLE CONTENT */}
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                            <div className="overflow-hidden">
                                <div className="pt-4 border-t border-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                                        Identifique áudios e formatos em ascensão no TikTok e Reels antes da saturação. A VERA adapta roteiros virais para o seu nicho automaticamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget 3: Reputation */}
                    <div className="bg-[#0F1116] p-6 rounded-3xl border border-gray-800 flex flex-col gap-4 group hover:border-green-500/50 hover:bg-[#13151A] transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] cursor-default">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <MessageSquare size={14} />
                                    Sentimento
                                </h3>
                                <div className="flex items-end gap-1 h-8">
                                    {[1, 2, 3, 4, 5].map(s => <div key={s} className={`w-2 h-full bg-green-500/80 rounded-sm origin-bottom transition-transform duration-500 group-hover:scale-y-110`} style={{ height: `${s * 15 + 20}%` }}></div>)}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold text-xl group-hover:text-green-400 transition-colors">98%</p>
                                <p className="text-[10px] text-gray-500 uppercase">Positivo</p>
                            </div>
                        </div>

                        {/* EXPANDABLE CONTENT */}
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                            <div className="overflow-hidden">
                                <div className="pt-4 border-t border-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                                        Muito além dos likes. Classificamos comentários como positivos, neutros ou negativos, alertando sobre mudanças na percepção da marca em tempo real.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget 4: Crisis Status */}
                    <div className="bg-[#0F1116] p-6 rounded-3xl border border-gray-800 flex flex-col gap-4 group hover:border-red-500/50 hover:bg-[#13151A] transition-all duration-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.1)] cursor-default">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    Blindagem
                                </h3>
                                <div className="w-10 h-10 rounded-full border-2 border-green-500/30 flex items-center justify-center relative group-hover:border-green-500/50 transition-colors">
                                    <div className="absolute inset-0 border-2 border-green-500/10 rounded-full animate-ping"></div>
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_currentColor]"></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-green-500 font-bold text-lg group-hover:text-green-400 transition-colors">Estável</p>
                                <p className="text-[10px] text-gray-500 uppercase">Sem ameaças</p>
                            </div>
                        </div>

                        {/* EXPANDABLE CONTENT */}
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                            <div className="overflow-hidden">
                                <div className="pt-4 border-t border-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                                        Detecção precoce de crises. Se o volume de menções negativas disparar, o sistema bloqueia o piloto automático e sugere ações de contenção imediatas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12">
                    <p className="text-xl font-bold text-white">Você não reage tarde. Você antecipa.</p>
                </div>
            </section>

            {/* DOBRA 7 – PARA QUEM É (REDESIGN) */}
            <section className="py-24 px-6 md:px-20 bg-[#0F1116] border-b border-gray-800/50 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0F1116] to-[#0F1116] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            Para quem a VERA foi <span className="text-blue-500">treinada?</span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Não é para todo mundo. A VERA foi desenhada especificamente para quem exige performance sem a burocracia das agências tradicionais.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        {/* Card 1 */}
                        <div className="bg-[#15171E] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <Briefcase className="text-blue-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Empreendedores</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Que cansaram de microgerenciar freelancers e agências. Assuma o controle estratégico e deixe a execução operacional com a IA.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#15171E] p-8 rounded-3xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                <Building2 className="text-purple-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">PMEs em Expansão</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Empresas que precisam escalar a produção de conteúdo e anúncios mantendo a qualidade, sem inflar a folha de pagamento.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#15171E] p-8 rounded-3xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                                <Zap className="text-green-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Growth Leaders</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Profissionais que buscam consistência baseada em dados, não em "achismos". Teste criativos em escala e otimize com precisão.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-[#15171E] p-8 rounded-3xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                                <Globe className="text-yellow-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Marcas Digitais</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Negócios que precisam de presença ativa todos os dias ("Always On") para manter a relevância no algoritmo.
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-[#1A1D25] to-[#15171E] rounded-3xl p-10 md:p-14 border border-gray-800 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />

                        <div className="relative z-10 max-w-2xl">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Ainda tem dúvidas sobre como funciona?
                            </h3>
                            <p className="text-gray-400 text-lg">
                                Entenda detalhadamente nossos processos, segurança de dados e metodologia na nossa Central de Ajuda.
                            </p>
                        </div>

                        <div className="relative z-10 shrink-0">
                            <button
                                onClick={() => navigate('/faq')}
                                className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-3"
                            >
                                <HelpCircle size={20} />
                                Acessar FAQ Oficial
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* DOBRA 8 – BLOG CAROUSEL */}
            <BlogCarouselSection />

            {/* DOBRA 8 – MODELO DE USO + CTA FINAL */}
            <section className="py-24 px-6 md:px-20 text-center">
                <div className="max-w-4xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Você continua decidindo.<br />A VERA continua executando.</h2>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Nada é publicado sem sua aprovação. Nada é respondido com achismo.
                        A VERA organiza, sugere, executa e aprende. <span className="text-white font-bold">Você valida. Sempre.</span>
                    </p>
                </div>

                <div className="bg-[#15171E] p-8 md:p-16 rounded-3xl border border-gray-800 max-w-5xl mx-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/5"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Marketing não precisa ser caótico.</h3>
                        <p className="text-xl text-gray-400 mb-12">Precisa ser organizado, contínuo e inteligente.</p>

                        <button
                            onClick={handleCtaClick}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                        >
                            Ative a VERA e teste na prática <ArrowRight />
                        </button>
                        <p className="mt-6 text-sm text-gray-500 uppercase tracking-widest">Sem promessa vazia. Sem dependência. Sem ruído.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
