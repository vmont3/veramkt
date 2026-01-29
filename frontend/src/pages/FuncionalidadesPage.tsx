import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPen, FaVideo, FaSearch, FaRobot, FaLightbulb, FaChartLine, FaShieldAlt, FaQuestionCircle, FaArrowRight, FaClock, FaDollarSign, FaMicrophone } from 'react-icons/fa';

// Componente de Item Educativo
const EducativeItem = ({ title, subtitle, icon, description, howItWorks, marketComparison, credits }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-gray-900/30 rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all mb-4">
            <div
                className="p-6 cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gray-800 text-blue-400 text-xl">
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white">{title}</h4>
                        <p className="text-sm text-gray-400">{subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <span className="block text-xs text-gray-500 uppercase tracking-widest">Custo Vera</span>
                        <span className="text-blue-400 font-mono font-bold">{credits} VC</span>
                    </div>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <FaQuestionCircle className="text-gray-500 hover:text-white" />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="px-6 pb-6 pt-0 border-t border-white/5 bg-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div>
                            <h5 className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FaRobot /> Como a Vera faz?
                            </h5>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {description}
                            </p>
                            <div className="bg-gray-800/50 p-4 rounded-xl text-xs text-gray-400 border-l-2 border-blue-500">
                                <strong className="text-white block mb-1">Bastidores (Técnico):</strong>
                                {howItWorks}
                            </div>
                        </div>

                        <div>
                            <h5 className="text-green-400 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FaDollarSign /> Por que vale a pena?
                            </h5>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Se você fizesse sozinho:</p>
                                    <p className="text-gray-300 text-sm">{marketComparison.human}</p>
                                </div>
                                <div className="border-t border-white/5 pt-3">
                                    <p className="text-xs text-gray-500 mb-1">Com a VERA:</p>
                                    <p className="text-white font-bold text-sm">{marketComparison.vera}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente Glossário
const GlossaryTerm = ({ term, definition }: any) => (
    <div className="bg-black/40 p-4 rounded-lg border border-white/5">
        <strong className="text-blue-400 block mb-1">{term}</strong>
        <p className="text-gray-400 text-xs leading-relaxed">{definition}</p>
    </div>
);

export default function FuncionalidadesPage() {
    return (
        <Layout>
            <div className="bg-black min-h-screen pt-32 pb-24 px-4 font-sans focus:scroll-auto">
                <div className="container mx-auto max-w-5xl">

                    {/* Header Educacional */}
                    <div className="text-center mb-20">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                            Entenda a <span className="text-blue-600">Máquina.</span>
                        </h1>
                        <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                            Muitas empresas acham que marketing é "postar foto".<br />
                            Nós tratamos marketing como <strong>engenharia de receita</strong>.
                            Abaixo, explicamos cada engrenagem do nosso motor e quanto ela custa.
                        </p>
                    </div>

                    {/* TELEGRAM & VOICE BANNER */}
                    <div className="bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/30 rounded-3xl p-8 mb-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="p-5 rounded-full bg-blue-600/20 text-blue-400 text-3xl animate-pulse">
                                <FaMicrophone />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">"Vera, cria um post sobre..."</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Você não precisa de computador. Envie áudios ou textos direto no <strong>Telegram</strong> e a Vera executa.
                                    Para relatórios complexos, use o Dashboard. Para o dia a dia, use a voz.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SEÇÃO 1: CÉREBRO (ESTRATÉGIA) */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-4">
                            <FaLightbulb className="text-3xl text-yellow-500" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Estratégia & Planejamento (O Cérebro)</h2>
                                <p className="text-gray-500 text-sm">Antes de agir, a Vera pensa. Sem isso, você só está fazendo barulho.</p>
                            </div>
                        </div>

                        <EducativeItem
                            title="Blueprint Mensal"
                            subtitle="O Mapa do Tesouro da sua marca."
                            icon={<FaVideo />}
                            credits="~50 VC"
                            description="Imagine contratar um Diretor de Marketing (CMO) para analisar seu mês, seus concorrentes e definir exatamente o que deve ser postado para vender. É isso que o Blueprint faz."
                            howItWorks="O agente StrategyAI cruza dados do seu nicho, notícias em alta (Google Trends) e performance passada para criar um calendário editorial blindado."
                            marketComparison={{
                                human: "Consultoria de Marketing: R$ 2.000,00/mês + 10 horas de reuniões.",
                                vera: "Pronto em 4 minutos. Focado em dados, zero 'achismo'."
                            }}
                        />

                        <EducativeItem
                            title="Deep Dive de Concorrente"
                            subtitle="Espionagem corporativa ética."
                            icon={<FaSearch />}
                            credits="~20 VC"
                            description="A Vera visita o site, Instagram e LinkedIn dos seus 3 maiores rivais. Ela descobre o que eles estão vendendo, como estão falando e onde estão falhando. Depois, te entrega a estratégia para superá-los."
                            howItWorks="Crawlers de navegação varrem a web pública, analisam a copy e estrutura de ofertas dos concorrentes."
                            marketComparison={{
                                human: "Horas de pesquisa manual e planilhas confusas.",
                                vera: "Raio-X completo com pontos fracos exploráveis."
                            }}
                        />
                    </div>

                    {/* SEÇÃO 2: PRODUÇÃO (MÃOS) */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-4">
                            <FaPen className="text-3xl text-purple-500" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Fábrica de Conteúdo (As Mãos)</h2>
                                <p className="text-gray-500 text-sm">Escala infinita. Seus posts nunca tiram férias.</p>
                            </div>
                        </div>

                        <EducativeItem
                            title="Post Social Completo"
                            subtitle="Copy + Arte + Legenda."
                            icon={<FaPen />}
                            credits="~5 VC"
                            description="Não é apenas 'gerar um texto'. A Vera entende sua 'Persona' (seu cliente ideal), escreve uma legenda persuasiva usando gatilhos mentais e cria uma imagem única e exclusiva para acompanhar."
                            howItWorks="Orquestração entre GPT-4o (Texto) + DALL-E 3 (Imagem) + Validador de Marca (Garante que as cores seguem seu manual)."
                            marketComparison={{
                                human: "Designer + Copywriter: R$ 3.000+/mês. Demora dias para aprovar.",
                                vera: "Pronto em segundos. Custo de centavos."
                            }}
                        />

                        <EducativeItem
                            title="Vídeo AI Short"
                            subtitle="O formato que domina a internet."
                            icon={<FaVideo />}
                            credits="~150 VC"
                            description="Vídeos curtos (Reels/TikTok) são a maior fonte de tráfego gratuito hoje. A Vera cria roteiros, gera cenas inéditas com IA (sem banco de imagem genérico) e adiciona narração profissional."
                            howItWorks="Integração pesada de Runway/Grok (Vídeo) + ElevenLabs (Áudio Neural). O custo é alto em créditos pois usamos as IAs mais caras do mundo."
                            marketComparison={{
                                human: "Editor de Vídeo: R$ 200,00 a R$ 500,00 por vídeo.",
                                vera: "Cerca de R$ 15,00 (conversão direta de créditos)."
                            }}
                        />
                    </div>

                    {/* SEÇÃO 3: PERFORMANCE (BOLSO) */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-4">
                            <FaShieldAlt className="text-3xl text-green-500" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Performance & Dinheiro (O Bolso)</h2>
                                <p className="text-gray-500 text-sm">Gestão financeira rigorosa. Lucro acima de tudo.</p>
                            </div>
                        </div>

                        <EducativeItem
                            title="Vigilância de Ads 24/7"
                            subtitle="Seu guardião financeiro."
                            icon={<FaChartLine />}
                            credits="Incluso no Plano"
                            description="Gestores de tráfego humanos dormem. A Vera não. Ela monitora suas campanhas no Meta/Google a cada 15 minutos. Se um anúncio está gastando e não vendendo, ela mata. Se está vendendo, ela escala."
                            howItWorks="Conexão API em tempo real com Meta Ads e Google Ads. O 'FinanceGuard Agent' analisa CPC, CTR e ROAS continuamente."
                            marketComparison={{
                                human: "Gestor de Tráfego: cobra % do investimento ou fixo alto. Olha a conta 1x ao dia.",
                                vera: "Monitoramento contínuo. Focado puramente em ROI."
                            }}
                        />
                    </div>

                    {/* TOTAL MARKET COST SUMMARY & CTA */}
                    <div className="bg-gray-100 rounded-3xl p-8 md:p-12 mb-20 text-black text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-6 uppercase">Quanto custaria essa equipe fora da Vera?</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
                                <div className="p-4 bg-white rounded-xl shadow-lg">
                                    <p className="text-xs font-bold text-gray-500 uppercase">CMO + Estrategista</p>
                                    <p className="text-xl font-bold">R$ 5.000+</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl shadow-lg">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Copy + Design + Video</p>
                                    <p className="text-xl font-bold">R$ 4.000+</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl shadow-lg">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Gestor de Tráfego</p>
                                    <p className="text-xl font-bold">R$ 2.500+</p>
                                </div>
                            </div>

                            <div className="mb-10">
                                <p className="text-5xl font-black text-red-600 mb-2">R$ 11.500/mês</p>
                                <p className="text-gray-600 font-medium">Custo médio estimado de uma equipe júnior/plena.</p>
                            </div>

                            <div className="bg-black text-white p-8 rounded-2xl max-w-2xl mx-auto border-2 border-blue-600 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                <p className="text-blue-400 font-bold tracking-widest uppercase mb-2">Oferta Freemium</p>
                                <h4 className="text-3xl md:text-4xl font-black mb-4">Teste a Vera com <span className="text-yellow-400">300 Créditos Grátis</span></h4>
                                <p className="text-gray-400 mb-8 text-sm">
                                    Sem cartão de crédito. Cadastre-se, receba seus créditos e tire suas próprias conclusões.
                                    Se gostar, você assina.
                                </p>
                                <a
                                    href="/signup"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-black text-lg px-8 py-4 rounded-full transition-colors w-full md:w-auto"
                                >
                                    Resgatar Meus 300 Créditos
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* GLOSSÁRIO SIMPLIFICADO */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-black rounded-3xl p-8 md:p-12 border border-blue-500/20">
                        <h3 className="text-2xl font-bold text-white mb-6 md:mb-8 text-center">Dicionário de Marketing para <span className="text-blue-500">Donos de Negócio</span></h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <GlossaryTerm
                                term="ROI"
                                definition="Retorno sobre Investimento. Se você colocou R$ 100 e voltou R$ 300, seu ROI é positivo."
                            />
                            <GlossaryTerm
                                term="Persona"
                                definition="Seu cliente ideal fictício. A Vera precisa saber quem ele é para escrever textos que conectam."
                            />
                            <GlossaryTerm
                                term="Tráfego Orgânico"
                                definition="Atenção gratuita. Clientes que vêm pelo seu conteúdo (posts, vídeos) sem você pagar anúncio."
                            />
                            <GlossaryTerm
                                term="Tráfego Pago (Ads)"
                                definition="Atenção comprada. Você paga ao Google/Facebook para mostrar seu produto para X pessoas."
                            />
                            <GlossaryTerm
                                term="Lead"
                                definition="Alguém interessado. Uma pessoa que deixou email ou telefone pedindo orçamento."
                            />
                            <GlossaryTerm
                                term="Copywriting"
                                definition="A arte de escrever para vender. Textos focados em convencer o leitor a agir."
                            />
                            <GlossaryTerm
                                term="VeraCredits (VC)"
                                definition="Nossa moeda interna. Você compra potência computacional, não horas de trabalho."
                            />
                            <GlossaryTerm
                                term="Omnichannel"
                                definition="Estar em todo lugar. A Vera garante que sua marca exista no Instagram, Google, LinkedIn, etc."
                            />
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
