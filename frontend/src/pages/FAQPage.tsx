import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, Rocket } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SupportChatModal from '../components/SupportChatModal';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

export default function FAQPage() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [showChat, setShowChat] = useState(false);

    const categories = [
        "Sobre a VERA",
        "Como Funciona",
        "Preços e Créditos",
        "Planos e Assinaturas",
        "Agentes e Redes Sociais",
        "Técnico e Integrações"
    ];

    const faqs: FAQItem[] = [
        // SOBRE A VERA
        {
            category: "Sobre a VERA",
            question: "O que é a VERA?",
            answer: "VERA é uma plataforma de Agentic Marketing com 23 agentes de IA especializados que automatizam e otimizam toda a operação de marketing da sua empresa. Diferente de ferramentas genéricas de IA, a VERA funciona como uma agência digital completa, com agentes que trabalham 24/7 em tarefas específicas: criação de conteúdo, design, análise de mercado, gestão de anúncios, atendimento a leads e muito mais."
        },
        {
            category: "Sobre a VERA",
            question: "Qual a diferença entre VERA e ChatGPT/outras IAs?",
            answer: "ChatGPT é uma ferramenta passiva que responde comandos. A VERA é um sistema ATIVO e AUTÔNOMO com 23 agentes especializados que:\n\n• Identificam oportunidades proativamente (4x ao dia)\n• Criam e publicam conteúdo automaticamente em 6 redes sociais\n• Monitoram concorrentes em tempo real\n• Otimizam anúncios continuamente (a cada hora)\n• Respondem leads automaticamente\n• Aprendem com feedback (Dopamine Loop)\n\nÉ como ter uma equipe de 23 especialistas trabalhando sem parar, não apenas uma ferramenta de chat."
        },
        {
            category: "Sobre a VERA",
            question: "A VERA substitui uma agência de marketing?",
            answer: "Sim, para a maioria das empresas. A VERA oferece:\n\n✅ Criação de conteúdo (copy, design, vídeo)\n✅ Gestão de 6 redes sociais (Instagram, LinkedIn, X, YouTube, Telegram, Email)\n✅ Campanhas de anúncios (Meta, Google, TikTok, LinkedIn)\n✅ Análise de concorrentes\n✅ Gestão de leads (CRM integrado)\n✅ Relatórios e métricas\n\nCom custos até 90% menores que uma agência tradicional e disponibilidade 24/7."
        },
        {
            category: "Sobre a VERA",
            question: "Para quem a VERA é indicada?",
            answer: "A VERA é ideal para:\n\n• MEIs e microempresas (automatizar marketing sem contratar equipe)\n• Pequenas e médias empresas (escalar operações de marketing)\n• Agências digitais (aumentar capacidade sem contratar)\n• Consultores e infoprodutores (automatizar vendas e nutrição de leads)\n• Empresas B2B (LinkedIn automation + email marketing)\n\nSe você investe (ou quer investir) em marketing digital, a VERA foi feita para você."
        },

        // COMO FUNCIONA
        {
            category: "Como Funciona",
            question: "Como funciona o sistema de 23 Agentes de IA?",
            answer: "A VERA possui 23 agentes organizados em 5 áreas:\n\n**1. Estratégia & Liderança (5 agentes):**\n• VERA Core (Orquestradora Geral)\n• Head de Estratégia (CMO)\n• Guardião Financeiro (CFO)\n• Editor Chefe (Qualidade)\n• Head de Vendas (CSO)\n\n**2. Inteligência & Análise (3 agentes):**\n• Analista de BI\n• Caçador de Tendências\n• Espião de Concorrência\n\n**3. Criação & Design (8 agentes):**\n• Copywriter Social (Posts Curtos)\n• Copywriter Artigos (Long Form)\n• Copywriter Ads (Performance)\n• Copywriter CRM (Email)\n• Designer Social\n• Designer Ads\n• Designer Landing Pages\n• Roteirista (Vídeo)\n\n**4. Growth & Mídia Paga (4 agentes):**\n• Gestor Meta Ads\n• Gestor Google Ads\n• Gestor TikTok Ads\n• Gestor LinkedIn Ads\n\n**5. CRM & Vendas (3 agentes):**\n• Closer SDR\n• Customer Success\n• Enriquecedor de Dados"
        },
        {
            category: "Como Funciona",
            question: "O que é o Dopamine Feedback Loop?",
            answer: "É o sistema de aprendizado da VERA. Funciona assim:\n\n1. Agente cria conteúdo/anúncio\n2. Você aprova (👍 dopamina) ou reprova (👎 correção)\n3. Sistema recompensa ou penaliza o agente\n4. Agente aprende suas preferências\n\nCom o tempo, a taxa de aprovação aumenta de ~60% para ~95%, porque os agentes entendem seu tom de voz, estética e estratégia."
        },
        {
            category: "Como Funciona",
            question: "⭐ Os agentes começam do zero ou já têm inteligência?",
            answer: "**Os agentes JÁ INICIAM COMO ESPECIALISTAS** na sua área, mas aprendem o SEU estilo! 🧠\n\n**📚 DIA 0 - CONHECIMENTO BASE (Já vem pronto):**\n\nCada agente inicia com expertise completa:\n\n✅ **Strategy Agent:** Frameworks (SMART, SWOT, Porter), OKRs, métricas estratégicas\n✅ **Copy Agent:** AIDA, PAS, gatilhos mentais, estruturas de conversão\n✅ **Design Agent:** Princípios de design, psicologia das cores, tendências 2026\n✅ **Ads Managers:** Best practices de cada plataforma (Meta, Google, TikTok, LinkedIn)\n\n**MAS eles NÃO sabem sobre VOCÊ:**\n❌ Qual seu tom de voz?\n❌ Quem é seu público?\n❌ Quais cores usar?\n❌ Suas preferências específicas?\n\n**🎯 DIAS 1-30 - ADAPTAÇÃO À SUA MARCA:**\n\nQuando você adiciona:\n\n**1. Brand Guidelines →** Efeito IMEDIATO\n• Tom de voz: \"Descontraído\"\n• Público: \"Empreendedores 25-40 anos\"\n• Missão: \"Simplificar marketing\"\n\n**2. Assets (logos, manuais) →** Efeito IMEDIATO\n• Paleta de cores\n• Tipografia\n• Estilo visual\n\n**3. Feedbacks 👍👎 →** Efeito PROGRESSIVO\n• Aprova post informal → Agente aprende\n• Reprova design minimalista → Agente evita\n\n**📈 PROGRESSÃO REAL:**\n\n```\nDia 0:  50% de aprovação (conhece área, não conhece você)\nDia 15: 75% de aprovação (já adaptou ao seu estilo)\nDia 60: 92% de aprovação (praticamente lê sua mente)\n```\n\n**💡 ANALOGIA:**\n\nÉ como contratar um **publicitário experiente:**\n\n**Dia 1:** Ele tem 10 anos de experiência (sabe fazer anúncios), mas não conhece sua empresa específica.\n\n**Dia 30:** Após briefing e feedback, ele domina perfeitamente seu negócio e cria no seu estilo.\n\n**Dia 90:** Taxa de aprovação altíssima! Ele entende suas preferências sem você precisar explicar.\n\n**🔄 SISTEMA DE PRIORIZAÇÃO:**\n\n1️⃣ **Custom Prompt** (você define) → PRIORIDADE MÁXIMA\n2️⃣ **Brand Guidelines** → Alta prioridade\n3️⃣ **Assets carregados** → Média prioridade\n4️⃣ **Knowledge base** (expertise geral) → Complemento\n\n**RESUMO:** Agentes = **Especialistas experientes** + **Aprendizado personalizado** do SEU negócio! 🚀"
        },
        {
            category: "Como Funciona",
            question: "Posso escolher quais agentes usar?",
            answer: "SIM! No painel \"Meus Agentes\" você pode:\n\n• Ativar/desativar cada um dos 23 agentes individualmente\n• Ver a performance de cada agente em tempo real\n• Dar feedback positivo (👍) ou negativo (👎)\n• Acompanhar o score de saúde de cada agente\n\nVocê tem controle total sobre qual agente trabalha pra você."
        },
        {
            category: "Como Funciona",
            question: "Preciso aprovar tudo ou a VERA publica sozinha?",
            answer: "VOCÊ decide! Existem 3 modos:\n\n**Modo Soberano (padrão):** Você aprova cada conteúdo antes da publicação\n**Modo Assistido:** VERA publica automaticamente em redes, mas anúncios pagos precisam de aprovação\n**Modo Autônomo:** VERA opera 100% sozinha (recomendado após 30 dias de treinamento)\n\nVocê pode alternar entre os modos a qualquer momento no painel S.A.L.A."
        },

        // PREÇOS E CRÉDITOS
        {
            category: "Preços e Créditos",
            question: "Como funciona o sistema de créditos (VC)?",
            answer: "VeraCredits (VC) é a moeda interna da plataforma. Cada ação consome créditos:\n\n• Copy de post: 5 VC\n• Design de imagem: 12 VC\n• Publicação Instagram: 15 VC\n• Publicação LinkedIn: 25 VC\n• Vídeo curto (AI): 150 VC\n• Análise de concorrentes: 50 VC\n\n**IMPORTANTE:** Créditos NUNCA expiram em nenhum plano. Se sobrar, acumula para o próximo mês."
        },
        {
            category: "Preços e Créditos",
            question: "Quanto custa cada crédito (VC)?",
            answer: "Depende do plano:\n\n**Planos Mensais:**\n• Anjo: R$ 0,12/VC (500 VC/mês)\n• Starter: R$ 0,10/VC (2.500 VC/mês)\n• Growth: R$ 0,08/VC (7.500 VC/mês)\n\n**Planos Anuais (-20%):**\n• Anjo: R$ 0,09/VC\n• Starter: R$ 0,07/VC\n• Growth: R$ 0,06/VC\n\n**Packs Avulsos:**\n• 400 VC: R$ 0,14/VC\n• 2.000 VC: R$ 0,12/VC\n• 6.000 VC: R$ 0,10/VC\n\nQuanto maior o plano, menor o custo por ação."
        },
        {
            category: "Preços e Créditos",
            question: "Os créditos expiram?",
            answer: "NÃO! Em nenhum plano. Todos os créditos são acumuláveis indefinidamente.\n\nExemplo: Se você tem o plano Starter (2.500 VC/mês) e usou apenas 1.000 VC, os 1.500 VC restantes ficam na sua conta e você terá 4.000 VC no mês seguinte."
        },
        {
            category: "Preços e Créditos",
            question: "Como sei quantos créditos vou gastar?",
            answer: "No painel financeiro você vê:\n\n• Consumo em tempo real\n• Previsão de gasto mensal\n• Histórico detalhado por agente\n• Alertas quando atingir 80% do saldo\n\nAlém disso, cada ação mostra o custo ANTES de executar."
        },

        // PLANOS E ASSINATURAS
        {
            category: "Planos e Assinaturas",
            question: "Qual a diferença entre os planos?",
            answer: "Todos os planos têm acesso TOTAL aos 23 agentes e todas as funcionalidades. A diferença é só na quantidade de créditos mensais:\n\n**Grátis (300 VC/mês):**\n• ~17 posts Instagram OU 12 posts LinkedIn\n• Requer CNPJ válido\n\n**Anjo (500 VC/mês) - R$ 59,90:**\n• ~29 posts Instagram OU 20 posts LinkedIn\n\n**Starter (2.500 VC/mês) - R$ 249,90:**\n• ~147 posts Instagram OU 100 posts LinkedIn\n\n**Growth (7.500 VC/mês) - R$ 599,90:**\n• Operação completa de agência\n• Múltiplas marcas"
        },
        {
            category: "Planos e Assinaturas",
            question: "Posso testar antes de assinar?",
            answer: "SIM! Cadastre-se gratuitamente com CNPJ e receba 300 VC/mês permanentemente.\n\nSe alguém te indicou, você ganha +200 VC de bônus, totalizando 500 VC no primeiro mês."
        },
        {
            category: "Planos e Assinaturas",
            question: "Posso cancelar a qualquer momento?",
            answer: "SIM, sem multa ou burocracia. Planos mensais podem ser cancelados a qualquer momento.\n\nCréditos já pagos e não utilizados permanecem na sua conta (eles nunca expiram)."
        },

        // AGENTES E REDES SOCIAIS
        {
            category: "Agentes e Redes Sociais",
            question: "Em quais redes sociais a VERA atua?",
            answer: "A VERA gerencia 6 redes sociais de forma nativa:\n\n**Instagram:**\n• Posts no feed (copy + design + publicação)\n• Stories\n• Resposta automática de DMs\n• Análise de métricas\n\n**LinkedIn:**\n• Posts orgânicos\n• Artigos long-form\n• Anúncios (LinkedIn Ads)\n• Networking automatizado\n\n**X (Twitter):**\n• Tweets\n• Threads\n• Respostas automatizadas\n• Monitoramento de menções\n\n**YouTube:**\n• Roteiros de vídeo\n• Títulos e descrições otimizados (SEO)\n• Google Ads (YouTube Ads)\n\n**Telegram:**\n• Mensagens em grupos/canais\n• Atendimento automatizado\n• Broadcasts\n\n**Email Marketing:**\n• Fluxos de automação\n• Newsletters\n• Email de vendas\n• Segmentação inteligente"
        },
        {
            category: "Agentes e Redes Sociais",
            question: "Como funciona a integração com cada rede social?",
            answer: "Cada rede tem seu processo de integração:\n\n**Instagram/Facebook (Meta):**\n• Conecte via Meta Business Suite\n• OAuth 2.0 seguro\n• Tempo: 2 minutos\n\n**LinkedIn:**\n• API oficial LinkedIn\n• Autorização via OAuth\n• Tempo: 1 minuto\n\n**X (Twitter):**\n• Twitter API v2\n• Autorização via OAuth 2.0\n• Tempo: 2 minutos\n\n**YouTube:**\n• Google Cloud (mesma conta Google Ads)\n• OAuth 2.0\n• Tempo: 3 minutos\n\n**Telegram:**\n• Conecte via Bot API\n• QR Code ou Token\n• Tempo: 1 minuto\n\n**Email:**\n• SMTP próprio ou Resend/SendGrid\n• Configuração de domínio\n• Tempo: 5 minutos\n\nTodas as integrações podem ser revogadas a qualquer momento."
        },
        {
            category: "Agentes e Redes Sociais",
            question: "Quais agentes trabalham em cada rede social?",
            answer: "Cada rede tem agentes dedicados:\n\n**Instagram:** Designer Social + Copywriter Social + Gestor Meta Ads\n**LinkedIn:** Copywriter Artigos + Gestor LinkedIn Ads + Closer SDR\n**X (Twitter):** Copywriter Social + Caçador de Tendências\n**YouTube:** Roteirista + Designer Landing + Gestor Google Ads\n**Telegram:** Closer SDR + Customer Success\n**Email:** Copywriter CRM + Customer Success + Enriquecedor\n\nA VERA Core orquestra todos eles para trabalharem em harmonia."
        },
        {
            category: "Agentes e Redes Sociais",
            question: "O que é a S.A.L.A. (Live Ops)?",
            answer: "S.A.L.A. é o centro de comando em tempo real onde você:\n\n• Monitora todos os 23 agentes simultaneamente\n• Vê ameaças bloqueadas pelo Guardião Financeiro\n• Ativa contramedidas (Modo Furtivo, Freeze Budget, Turbo Copy)\n• Recebe alertas críticos\n• Aprova/reprova ações dos agentes\n\nFunciona como uma sala de controle da NASA, mas para seu marketing."
        },
        {
            category: "Agentes e Redes Sociais",
            question: "Como funciona o Guardião Financeiro?",
            answer: "É o agente de proteção que monitora anúncios 24/7:\n\n• Detecta gastos anormais\n• Pausa campanhas com ROAS baixo automaticamente\n• Bloqueia fraudes de clique\n• Protege orçamento de picos inesperados\n\nExemplo: Se uma campanha gastar 50% do orçamento diário em 2 horas sem conversões, ele pausa e te avisa."
        },
        {
            category: "Agentes e Redes Sociais",
            question: "Os agentes aprendem com minha marca?",
            answer: "SIM! Você pode fazer upload de:\n\n• Manual da marca (PDF)\n• Logos e assets visuais\n• Referências de tom de voz\n• Exemplos de conteúdo aprovado\n\nOs agentes analisam esses materiais e passam a criar conteúdo alinhado ao seu branding desde o início."
        },
        {
            category: "Agentes e Redes Sociais",
            question: "⭐ A VERA consegue analisar concorrentes mesmo SEM integração com API?",
            answer: "**SIM! E isso é um DIFERENCIAL PODEROSO da VERA!** 🚀\n\nMesmo que você NÃO tenha conectado sua conta Instagram, LinkedIn ou qualquer rede social, os agentes conseguem analisar concorrentes através de **Web Scraping de Perfis Públicos**.\n\n**O QUE A VERA CONSEGUE EXTRAIR (perfis públicos):**\n\n✅ Posts recentes (últimos 12-20 visíveis)\n✅ Número de seguidores/seguindo\n✅ Bio e descrição\n✅ Hashtags mais usadas\n✅ Frequência de postagem\n✅ Tipos de conteúdo (foto/vídeo/carousel)\n✅ Engajamento médio (curtidas/comentários)\n✅ Padrões de copy e tom de voz\n✅ Estratégias de CTA\n\n**COMO USAR:**\n\n1. Vá em \"Configurações\" → \"Concorrentes\"\n2. Adicione o link do perfil público (ex: instagram.com/concorrente)\n3. O Espião de Concorrência analisa automaticamente\n4. Receba relatório com insights e recomendações\n\n**EXEMPLO REAL:**\n\nVocê adiciona o Instagram de um concorrente.\nO agente identifica:\n• Tom informal + emojis frequentes\n• Posts 2x ao dia (manhã/noite)\n• Foco em carrosséis educativos\n• Hashtags: #tech #inovacao #startup\n• Engajamento: 2.8% (acima da média)\n\n**E SUGERE:**\n• \"Testar carrosséis (seu concorrente tem 3x mais engajamento com esse formato)\"\n• \"Use hashtags de nicho ao invés de genéricas\"\n• \"Teste postagens às 18h (horário de pico do concorrente)\"\n\n**LIMITAÇÕES (sem API oficial):**\n\n❌ Stories (desaparecem em 24h)\n❌ Métricas internas (impressões, alcance, saves)\n❌ Dados de anúncios pagos\n❌ Perfis privados\n\n**MAS com integração API você ganha:**\n✅ Analytics completos\n✅ Dados históricos extensos\n✅ Publicação automática\n✅ Resposta de DMs\n\n**RESUMO:** A VERA funciona MESMO sem conectar suas redes! Você pode analisar, aprender e criar estratégias baseadas em concorrentes que estão performando bem, sem precisar de nenhuma integração. 🎯"
        },

        // TÉCNICO E INTEGRAÇÕES
        {
            category: "Técnico e Integrações",
            question: "A VERA funciona em português?",
            answer: "SIM! A VERA é 100% em português brasileiro e foi treinada com contexto cultural BR.\n\nEla entende gírias, datas comemorativas locais, tendências brasileiras e cria conteúdo naturalizado para o público brasileiro."
        },
        {
            category: "Técnico e Integrações",
            question: "Preciso de conhecimento técnico?",
            answer: "NÃO! A interface é visual e intuitiva. Se você usa Instagram ou WhatsApp, consegue usar a VERA.\n\nPara integrações, temos tutoriais em vídeo de 3-5 minutos cada."
        },
        {
            category: "Técnico e Integrações",
            question: "Como funciona o suporte?",
            answer: "Suporte em múltiplos canais:\n\n• **Chat VERA** (IA responde em segundos + escalação humana)\n• **Telegram em tempo real** (suporte direto com a equipe)\n• **Email** (suporte@veramkt.com)\n• **Base de conhecimento** com tutoriais\n\nTempo médio de resposta: Imediato (IA) ou 15 minutos (humano).\n\nClique em \"Falar com Suporte\" para abrir o chat agora mesmo!"
        },
        {
            category: "Técnico e Integrações",
            question: "Meus dados estão seguros?",
            answer: "SIM! Segurança é prioridade:\n\n• Criptografia SSL/TLS em todas as conexões\n• Dados armazenados em servidores brasileiros\n• Compliance com LGPD\n• OAuth 2.0 para todas as integrações\n• Você pode revogar acessos a qualquer momento\n• Backup automático diário\n\nNunca compartilhamos ou vendemos seus dados."
        }
    ];

    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);


    return (
        <Layout>
            <div className="min-h-screen bg-black text-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    {/* ... existing content ... */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center relative z-10"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Perguntas Frequentes
                        </h1>
                        <p className="text-xl text-gray-300">
                            Tudo sobre nossos 23 agentes de IA, 6 redes sociais e como revolucionar seu marketing
                        </p>
                    </motion.div>
                </section>

                {/* Categories */}
                <section className="px-6 pb-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setOpenIndex(null);
                                    }}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${activeCategory === category
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Items */}
                <section className="px-6 pb-20">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {filteredFAQs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
                                >
                                    <span className="text-lg font-semibold pr-8">{faq.question}</span>
                                    <ChevronDown
                                        className={`flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                        size={24}
                                    />
                                </button>

                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="px-6 pb-5"
                                    >
                                        <div className="text-gray-300 leading-relaxed whitespace-pre-line border-t border-gray-800 pt-5">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 pb-32">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-blue-500/30 text-center"
                        >
                            <h2 className="text-3xl font-bold mb-4">Ainda tem dúvidas?</h2>
                            <p className="text-gray-300 mb-8 text-lg">
                                Nossa VERA e equipe estão prontos para esclarecer qualquer questão em tempo real
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => setShowChat(true)}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all"
                                >
                                    <MessageCircle size={20} />
                                    Falar com Suporte (Chat)
                                </button>

                                <button
                                    onClick={() => navigate('/signup')}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/50"
                                >
                                    <Rocket size={20} />
                                    Testar Grátis Agora
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Chat Modal */}
                <SupportChatModal isOpen={showChat} onClose={() => setShowChat(false)} />
            </div>
        </Layout>
    );
}
