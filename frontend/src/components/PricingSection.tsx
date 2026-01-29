import React, { useState } from 'react';
import { FaCheck, FaRocket, FaBolt, FaMicrochip, FaFeather, FaInfinity, FaLinkedin, FaYoutube, FaWhatsapp, FaTelegram, FaEnvelope, FaGoogle, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6"; // Ensure react-icons is updated or use alternative if missing
import { motion } from 'framer-motion';

const PricingSection = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    // ... (plans definition omitted for brevity, keeping existing) ...
    const plans = [
        {
            name: "Anjo",
            description: "A porta de entrada para criadores e MEIs iniciarem sua jornada com IA.",
            monthlyPrice: 59.90,
            annualPrice: 47.92,
            credits: 500,
            creditsDetail: "mensais (Acumuláveis)",
            features: [
                "500 VeraCredits mensais",
                "Acesso ao GPT-4o e Gemini Ultra",
                "Geração de Imagens (DALL-E 3)",
                "Respostas de DM Automáticas",
                "Suporte da Comunidade",
                "Cancele quando quiser"
            ],
            highlight: false,
            cta: "Assinar Anjo",
            icon: <FaFeather />,
            color: "blue"
        },
        {
            name: "Starter",
            description: "Para pequenas agências e marcas em crescimento escalarem com segurança.",
            monthlyPrice: 249.90,
            annualPrice: 199.92,
            credits: 2500,
            creditsDetail: "mensais (Acumuláveis)",
            features: [
                "2.500 VeraCredits mensais",
                "Acesso Total aos 10 Agentes",
                "Guardião Financeiro (Ads Protection)",
                "Criação de Vídeos AI (Runway/Grok)",
                "Vozes Neurais (ElevenLabs)",
                "CRM Integrado (Vera Sales)"
            ],
            highlight: true,
            popularLabel: "MAIS ESCOLHIDO",
            cta: "Assinar Starter",
            icon: <FaBolt />,
            color: "purple"
        },
        {
            name: "Growth",
            description: "Potência máxima para agências consolidadas e operações de alto volume.",
            monthlyPrice: 599.90,
            annualPrice: 479.92,
            credits: 7500,
            creditsDetail: "mensais (Acumuláveis)",
            features: [
                "7.500 VeraCredits mensais",
                "Múltiplas Squads de IA",
                "🛍️ Integrações E-commerce (Mercado Livre, Shopify, Nuvemshop)",
                "Prioridade de Processamento",
                "API Dedicada (Opcional)",
                "Gerente de Conta Dedicado",
                "Treinamento de Equipe"
            ],
            highlight: false,
            cta: "Assinar Growth",
            icon: <FaRocket />,
            color: "green"
        }
    ];

    const tokenPacks = [
        { name: "Pack Boost", credits: 400, price: "59,90", unit: "0,14" },
        { name: "Pack Pro", credits: 2000, price: "249,90", unit: "0,12", highlight: true },
        { name: "High-Scale", credits: 6000, price: "599,90", unit: "0,10" },
    ];

    const creditExamples = [
        { action: "1 Post Completo (Copy + Arte)", cost: "~5 Créditos" },
        { action: "1 Vídeo AI Short (15 seg)", cost: "~150 Créditos" },
        { action: "1 Minuto Narração (ElevenLabs)", cost: "~30 Créditos" },
        { action: "100 Prospecções (Email/LinkedIn)", cost: "~200 Créditos" },
    ];

    return (
        <section className="py-24 bg-black relative overflow-hidden font-sans" id="planos">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none neural-bg" />

            <div className="container mx-auto px-4 relative z-10">

                {/* HEADER OMNICHANNEL */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                        Não somos uma <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                            Agência de Tráfego.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
                        Somos sua inteligência de crescimento 360º. Do orgânico ao pago.
                        Do LinkedIn ao TikTok. A Vera orquestra tudo.
                    </p>

                    {/* Social Icons Grid */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-gray-500 mb-12">
                        <FaGoogle className="text-3xl hover:text-red-500 transition-colors cursor-pointer" title="Google Ads" />
                        <FaFacebook className="text-3xl hover:text-blue-600 transition-colors cursor-pointer" title="Facebook" />
                        <FaInstagram className="text-3xl hover:text-pink-500 transition-colors cursor-pointer" title="Instagram" />
                        <FaTiktok className="text-3xl hover:text-pink-400 transition-colors cursor-pointer" title="TikTok" />
                        <FaLinkedin className="text-3xl hover:text-blue-500 transition-colors cursor-pointer" title="LinkedIn" />
                        <FaYoutube className="text-3xl hover:text-red-600 transition-colors cursor-pointer" title="YouTube" />
                        <FaXTwitter className="text-3xl hover:text-white transition-colors cursor-pointer" title="X (Twitter)" />
                        <FaWhatsapp className="text-3xl hover:text-green-500 transition-colors cursor-pointer" title="WhatsApp" />
                        <FaTelegram className="text-3xl hover:text-blue-400 transition-colors cursor-pointer" title="Telegram" />
                        <FaEnvelope className="text-3xl hover:text-yellow-500 transition-colors cursor-pointer" title="Email Cold" />
                    </div>

                    {/* Toggle Annual/Monthly */}
                    <div className="flex items-center justify-center mt-8 gap-4 bg-gray-900/50 w-fit mx-auto p-2 rounded-full border border-gray-800">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Anual <span className="text-xs bg-black/20 px-2 py-0.5 rounded text-white">-20%</span>
                        </button>
                    </div>
                </div>

                {/* PLANS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-[2rem] border transition-all duration-300 group hover:translate-y-[-5px] flex flex-col justify-between
                                ${plan.highlight
                                    ? 'bg-gray-900/90 border-blue-500/50 shadow-[0_0_60px_rgba(59,130,246,0.15)] z-10 scale-105'
                                    : 'bg-black/60 border-gray-800 hover:border-gray-700'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg tracking-widest uppercase mb-4">
                                    {plan.popularLabel}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-4 rounded-2xl bg-gray-800/50 text-${plan.color === 'purple' ? 'purple-400' : plan.color === 'green' ? 'green-400' : 'blue-400'} text-3xl`}>
                                        {plan.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-wide">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm text-gray-500 font-medium">R$</span>
                                            <span className="text-4xl font-black text-white tracking-tighter">
                                                {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                            </span>
                                            <span className="text-gray-500 font-medium">/mês</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                                    {plan.description}
                                </p>

                                {/* Credits Highlihgt */}
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 mb-8 border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaMicrochip className={plan.highlight ? "text-blue-400" : "text-gray-500"} />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Potência Mensal</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-3xl font-black ${plan.highlight ? 'text-white' : 'text-gray-200'}`}>
                                            {plan.credits.toLocaleString()} <span className="text-lg text-blue-500/80">VC</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{plan.creditsDetail}</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                                            <FaCheck className={`mt-1 flex-shrink-0 text-[10px] ${plan.highlight ? 'text-blue-400' : 'text-gray-600'}`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <button className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300
                                    ${plan.highlight
                                        ? 'bg-white text-black hover:bg-gray-200 hover:shadow-lg hover:shadow-white/10'
                                        : 'bg-transparent border border-gray-700 text-white hover:border-white hover:bg-white/5'
                                    }`}>
                                    {plan.cta}
                                </button>
                                {plan.highlight && (
                                    <p className="text-center text-[10px] text-green-400 mt-3 font-mono">
                                        Renovação Antecipada: +10% Bônus
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* TOKEN PACKS & EDUCATION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-24">

                    {/* Education Left */}
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-6">
                            Você paga pelo <span className="text-blue-500">cérebro</span>.<br />
                            O resto é com você.
                        </h3>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Na Vera, "Créditos" (VC) compram inteligência. Textos, imagens, vídeos de alta complexidade e horas de raciocínio de agentes como o <strong className="text-white">Head de Estratégia</strong>.
                        </p>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            O orçamento de tráfego (Ads) é gerenciado pelo <strong className="text-white">Guardião Financeiro</strong>, mas o dinheiro vai direto para as plataformas (Meta/Google). Nós não tocamos na sua verba de mídia.
                        </p>

                        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                                Custo de Inteligência (Estimado)
                            </h4>
                            <ul className="space-y-3">
                                {creditExamples.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-300 font-medium">{item.action}</span>
                                        <span className="font-mono font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                                            {item.cost}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Token Packs Right */}
                    <div className="bg-gray-900/30 rounded-3xl p-8 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white">Pacotes de Energia Extra</h3>
                                <p className="text-sm text-gray-500">Para quando a escala for maior que o planejado.</p>
                            </div>
                            <FaBolt className="text-yellow-500 text-2xl animate-pulse" />
                        </div>

                        <div className="space-y-4">
                            {tokenPacks.map((pack, idx) => (
                                <div key={idx} className={`flex items-center justify-between p-5 rounded-xl border transition-colors ${pack.highlight ? 'bg-gray-800/80 border-blue-500/30' : 'bg-black/40 border-gray-800 hover:border-gray-700'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pack.highlight ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                            <FaMicrochip size={14} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{pack.name}</h4>
                                            <p className="text-xs text-blue-400 font-bold">{pack.credits} VC</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold">R$ {pack.price}</p>
                                        <p className="text-[10px] text-gray-600">~R$ {pack.unit}/crédito</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Dica de Assinante</p>
                            <p className="text-gray-300 text-sm">
                                É mais barato <strong>antecipar a renovação</strong> do seu plano do que comprar pacotes avulsos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ENTERPRISE */}
                <div className="max-w-7xl mx-auto bg-gradient-to-r from-gray-900 to-black rounded-[2rem] border border-gray-800 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                    <div className="relative z-10 md:w-2/3">
                        <div className="flex items-center gap-2 mb-4">
                            <FaInfinity className="text-blue-500" />
                            <span className="text-blue-500 font-bold tracking-widest text-sm uppercase">Vera Enterprise</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            Sua operação é complexa?<br />
                            <span className="text-gray-500">Nós construímos o workflow.</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl">
                            Para grandes redes, franquias e corporações. Agentes treinados na sua base de conhecimento proprietária, API dedicada e SLAs agressivos.
                        </p>
                    </div>

                    <div className="relative z-10 md:w-1/3 text-right">
                        <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                            Falar com Consultor
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default PricingSection;
