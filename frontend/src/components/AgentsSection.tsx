import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaTimes, FaRobot, FaBrain, FaNetworkWired } from 'react-icons/fa';

// Image paths
const avatars = {
  maestra: "/avatars/avatar_maestra_vera_1768038994316.png",
  trend: "/avatars/agent_trend_monitor.png",
  finance: "/avatars/agent_finance_guard.png",
  support: "/avatars/agent_site_support.png",
  telegram: "/avatars/agent_tele_pulse.png",
  x_comms: "/avatars/agent_x_comms.png",
  google: "/avatars/avatar_googlemaster_google_1768039064114.png",
  linkedin: "/avatars/avatar_linklead_linkedin_1768039007951.png",
  instagram: "/avatars/avatar_instaexpert_instagram_1768039022316.png",
  facebook: "/avatars/avatar_facemanager_facebook_1768039037474.png",
  tiktok: "/avatars/avatar_toktrend_tiktok_1768039078455.png",
  whatsapp: "/avatars/avatar_zapcloser_whatsapp_1768039093427.png",
  youtube: "/avatars/avatar_tubevision_youtube_1768039108976.png",
  email: "/avatars/avatar_mailmind_email.png",
  scribe: "/avatars/avatar_scribe_copywriter.png"
};

// SQUAD DE ELITE (4 Especialistas Diretos)
// SQUAD DE ELITE (4 Especialistas Diretos)
const strategicAgents = [
  {
    id: "spec_designer",
    name: "Visual Designer",
    role: "Especialista Visual",
    image: avatars.instagram,
    color: "text-pink-500",
    border: "border-pink-500",
    description: "Responsável por toda a identidade visual, criativos de anúncios e estética da marca.",
    methodology: "Design Comportamental & Branding",
    reportsTo: "Maestra VERA",
    commandSource: "Diretrizes Visuais",
    dopamine: 92,
    squad: [
      { name: "Motion", role: "Videmaker", description: "Cria animações e vídeos dinâmicos." },
      { name: "Static", role: "Designer UI", description: "Posts, carrosséis e interfaces." },
      { name: "Thumb", role: "Artist", description: "Capas de alta conversão (CTR)." }
    ]
  },
  {
    id: "spec_copy",
    name: "Senior Copywriter",
    role: "Especialista de Voz",
    image: avatars.scribe,
    color: "text-blue-400",
    border: "border-blue-400",
    description: "Cria narrativas persuasivas, roteiros de vendas e define o tom de voz da marca.",
    methodology: "Storytelling & Neuromarketing",
    reportsTo: "Maestra VERA",
    commandSource: "Briefing de Conteúdo",
    dopamine: 88,
    squad: [
      { name: "Script", role: "Roteirista", description: "Vídeos de vendas (VSL) e Reels." },
      { name: "Email", role: "Email Mkt", description: "Sequências de fidelização." },
      { name: "Blog", role: "Redator SEO", description: "Artigos de fundo de funil." }
    ]
  },
  {
    id: "spec_growth",
    name: "Head of Growth",
    role: "Especialista de Dados",
    image: avatars.trend,
    color: "text-green-500",
    border: "border-green-500",
    description: "Analisa métricas e otimiza a arquitetura de conversão.",
    methodology: "Data-Driven Marketing",
    reportsTo: "Maestra VERA",
    commandSource: "Metas de Conversão",
    dopamine: 95,
    squad: [
      { name: "Funnel", role: "Arquiteto de Funil", description: "Desenha a jornada do cliente." },
      { name: "Dash", role: "Analista de Dados", description: "Relatórios e Insights." },
      { name: "CRO", role: "Otimizador", description: "Testes A/B em páginas." }
    ]
  },
  {
    id: "spec_finance",
    name: "Head Guardião",
    role: "Paid Media Governor",
    image: avatars.finance,
    color: "text-yellow-500",
    border: "border-yellow-500",
    description: "Controle, otimização e contenção financeira. Monitora métricas em tempo real e possui VETO SUPREMO para travar campanhas ruins.",
    methodology: "PROTEÇÃO DE CAPITAL & STOP LOSS",
    reportsTo: "Maestra VERA (Autonomia Total)",
    commandSource: "Dashboard Financeiro",
    dopamine: 94,
    squad: [
      { name: "Sniper", role: "Auditor de ROI", description: "Verifica se o lucro justifica o gasto." },
      { name: "Shield", role: "Bloqueador", description: "Trava anúncios com CPA alto instantaneamente." },
      { name: "Bidder", role: "Otimizador", description: "Ajusta lances para escala segura." }
    ]
  },
  {
    id: "spec_chat",
    name: "Chat Expert",
    role: "Especialista de Conversão",
    image: avatars.support,
    color: "text-purple-500",
    border: "border-purple-500",
    description: "Gerencia o atendimento ao cliente, automações de chat e fechamento de vendas.",
    methodology: "Conversational Commerce",
    reportsTo: "Maestra VERA",
    commandSource: "Fluxos de Mensagem",
    dopamine: 90,
    squad: [
      { name: "Bot", role: "Arquiteto de Chat", description: "Fluxos automáticos 24/7." },
      { name: "Closer", role: "Vendedor Híbrido", description: "Fechamento de high-ticket." },
      { name: "Support", role: "Customer Success", description: "Retenção e satisfação." }
    ]
  }
];

// AGENTES TÁTICOS (Plataformas)
const platformAgents = [
  { id: "dir_fb", name: "Head of Facebook", role: "Diretor de Comunidade", image: avatars.facebook, color: "text-blue-600", border: "border-blue-600", description: "Gerencia grupos e campanhas no ecossistema Meta.", methodology: "Community Building", reportsTo: "Growth & Designer", dopamine: 88 },
  { id: "dir_insta", name: "Head of Instagram", role: "Diretor de Branding", image: avatars.instagram, color: "text-pink-500", border: "border-pink-500", description: "Define a estética e o crescimento visual.", methodology: "Branding Visual", reportsTo: "Designer & Copy", dopamine: 92 },
  { id: "dir_whats", name: "Head of WhatsApp", role: "Diretor de Vendas", image: avatars.whatsapp, color: "text-green-500", border: "border-green-500", description: "Lidera força de vendas direta.", methodology: "Conversational Commerce", reportsTo: "Chat Expert", dopamine: 96 },
  { id: "dir_tele", name: "Head of Telegram", role: "Diretor de Canais", image: avatars.telegram, color: "text-cyan-500", border: "border-cyan-500", description: "Gerencia canais VIP e broadcast.", methodology: "Broadcast Strategy", reportsTo: "Copy & Growth", dopamine: 85 },
  { id: "dir_tube", name: "Head of YouTube", role: "Diretor de Audiovisual", image: avatars.youtube, color: "text-red-600", border: "border-red-600", description: "Controla grade de vídeos longos e shorts.", methodology: "Video SEO", reportsTo: "Visual Designer", dopamine: 91 },
  { id: "dir_x", name: "Head of X", role: "Diretor de PR", image: avatars.x_comms, color: "text-gray-400", border: "border-gray-500", description: "Gerencia reputação em tempo real.", methodology: "Real-Time Marketing", reportsTo: "Copywriter", dopamine: 89 },
  { id: "dir_linked", name: "Head of LinkedIn", role: "Diretor B2B", image: avatars.linkedin, color: "text-blue-500", border: "border-blue-500", description: "Foca em autoridade corporativa.", methodology: "Social Selling", reportsTo: "Growth", dopamine: 87 },
  { id: "dir_google", name: "Head of Google", role: "Diretor de Search", image: avatars.google, color: "text-blue-400", border: "border-blue-400", description: "Cuida do SEO e Campanhas de Pesquisa.", methodology: "SEM & SEO", reportsTo: "Growth", dopamine: 95 },
  { id: "dir_email", name: "Head of Email", role: "Diretor de CRM", image: avatars.email, color: "text-orange-400", border: "border-orange-400", description: "Gerencia réguas de relacionamento.", methodology: "Email Mkt", reportsTo: "Copy & Chat", dopamine: 90 },
  { id: "dir_tiktok", name: "Head of TikTok", role: "Diretor de Trends", image: avatars.tiktok, color: "text-cyan-400", border: "border-cyan-400", description: "Identifica trends virais.", methodology: "Viral Loop", reportsTo: "Visual Designer", dopamine: 93 }
];


export default function AgentsSection() {
  const [dopamineLevel, setDopamineLevel] = useState(50);
  const [painLevel, setPainLevel] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [activePulse, setActivePulse] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  // Carousel Ref (Mantido para compatibilidade, mas não usado ativamente no Grid)
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [carouselRef.current]);

  const handleReward = () => {
    if (isResetting) return;
    setDopamineLevel(prev => Math.min(prev + 15, 100));
    setPainLevel(prev => Math.max(prev - 10, 0));
    triggerPulse();
  };

  const handleError = () => {
    if (isResetting) return;
    const newPain = painLevel + 15;
    if (newPain >= 25) {
      setPainLevel(100);
      setIsResetting(true);
      setTimeout(() => {
        setPainLevel(0);
        setDopamineLevel(50);
        setIsResetting(false);
      }, 2000);
    } else {
      setPainLevel(newPain);
      setDopamineLevel(prev => Math.max(prev - 10, 0));
    }
  };

  const triggerPulse = () => {
    setActivePulse(true);
    setTimeout(() => setActivePulse(false), 1000);
  };

  // Vera Data
  const veraAgent = {
    name: "Maestra VERA",
    role: "Orquestradora Neural",
    image: avatars.maestra,
    color: "text-blue-500",
    border: "border-blue-500",
    description: "A inteligência central que coordena todos os agentes. Vera entende seus objetivos de negócio, traduz para estratégias acionáveis e garante que toda a equipe funcione em harmonia.",
    methodology: "Rede Neural Central & Processamento de Linguagem Natural Avançado",
    reportsTo: "O CEO (Você)",
    commandSource: "Sua Voz ou Texto",
    dopamine: 100
  };

  return (
    <section className="py-24 bg-black relative min-h-screen flex flex-col justify-center">
      {/* Background Neural Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      <div className="container mx-auto px-4 relative z-10">

        {/* HEADLINE */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            HIERARQUIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">NEURAL</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl">
            Comando Central (Vera) &rarr; Especialistas (Squad) &rarr; Execução Total
          </p>
        </div>

        {/* --- HIERARQUIA ARQUITETURAL VERA (NOVA) --- */}
        <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center gap-16 py-12">

          {/* SVG CONNECTOR LAYER (BACKGROUND) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Central Spine: Maestra -> Blueprint */}
              <line x1="50" y1="15" x2="50" y2="35" stroke="url(#blue-gradient)" strokeWidth="0.5" strokeDasharray="2 2" className="animate-pulse" />

              {/* Blueprint Branches to Heads */}
              <path d="M 50 45 C 50 60 20 50 20 70" fill="none" stroke="rgba(255,255,255,0.2)" />
              <path d="M 50 45 C 50 60 80 50 80 70" fill="none" stroke="rgba(255,255,255,0.2)" />
              <path d="M 50 45 C 50 60 50 60 50 70" fill="none" stroke="rgba(255,255,255,0.3)" />

              <defs>
                <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 1. NÍVEL SOBERANO: MAESTRA VERA */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedAgent(veraAgent)}
            >
              {/* Rings */}
              <div className="absolute inset-0 rounded-full border border-blue-500/50 animate-[spin_10s_linear_infinite]" />
              <div className="absolute -inset-4 rounded-full border border-purple-500/30 animate-[spin_15s_linear_infinite_reverse]" />

              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-[0_0_80px_rgba(59,130,246,0.6)] bg-black z-10 relative">
                <img src={avatars.maestra} alt="Maestra VERA" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <div className="text-center mt-4">
              <h3 className="text-3xl font-black text-white tracking-widest">MAESTRA</h3>
              <p className="text-blue-400 font-mono text-xs uppercase tracking-[0.3em]">Interface Humana & Contexto</p>
            </div>
          </div>

          {/* 2. NÍVEL DE GOVERNANÇA: BLUEPRINT ENGINE */}
          <div className="relative z-20 w-full max-w-4xl">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-blue-900 to-transparent"></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="bg-gray-900/80 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 mx-auto max-w-2xl relative shadow-2xl"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded text-[10px] font-bold text-white tracking-widest uppercase">
                Núcleo de Governança
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded bg-black/40 border border-white/5">
                  <FaBrain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-white font-bold text-sm">BLUEPRINT ENGINE</h4>
                  <p className="text-gray-500 text-[10px] mt-1">Ética, Verdade, Ordem</p>
                </div>
                <div className="p-4 rounded bg-black/40 border border-white/5">
                  <FaNetworkWired className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <h4 className="text-white font-bold text-sm">INTELLIGENCE 2.0</h4>
                  <p className="text-gray-500 text-[10px] mt-1">Sinais Passivos (Não age)</p>
                </div>
              </div>
              <div className="mt-4 text-[10px] text-gray-400 text-center font-mono border-t border-white/5 pt-2">
                ⚠️ REGRA: NENHUM AGENTE EXECUTA SEM VALIDAÇÃO DUPLA DESTE NÚCLEO.
              </div>
            </motion.div>
          </div>

          {/* 3. NÍVEL ESTRATÉGICO: HEADS (GUARDIÕES) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4 justify-items-center">

            {/* HEAD DE GROWTH */}
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                <span className="text-[10px] font-mono uppercase text-green-500 tracking-wider">Estratégia</span>
                <h4 className="text-xl font-bold text-white">HEAD OF GROWTH</h4>
              </div>
              <div className="relative group cursor-pointer" onClick={() => setSelectedAgent(strategicAgents.find(a => a.id === 'spec_growth'))}>
                <div className="w-24 h-24 rounded-2xl border-2 border-green-500 overflow-hidden grayscale group-hover:grayscale-0 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <img src={avatars.trend} className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Squad List */}
              <div className="mt-4 space-y-2 w-full max-w-[180px]">
                {platformAgents.filter(a => a.reportsTo.includes('Growth')).slice(0, 3).map(sub => (
                  <div key={sub.id} className="flex items-center gap-2 bg-gray-900/50 p-2 rounded border border-gray-800 text-xs text-gray-400">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    {sub.name}
                  </div>
                ))}
              </div>
            </div>

            {/* HEAD DE DINHEIRO (CENTRAL) */}
            <div className="flex flex-col items-center mt-8 md:mt-0">
              <div className="mb-4 text-center">
                <span className="text-[10px] font-mono uppercase text-yellow-500 tracking-wider bg-yellow-900/20 px-2 py-1 rounded">Poder de Veto</span>
                <h4 className="text-xl font-bold text-white mt-1">HEAD GUARDIÃO</h4>
              </div>
              <div className="relative group cursor-pointer" onClick={() => setSelectedAgent(strategicAgents.find(a => a.id === 'spec_finance'))}>
                <div className="w-28 h-28 rounded-2xl border-4 border-yellow-500 overflow-hidden grayscale group-hover:grayscale-0 transition-all shadow-[0_0_50px_rgba(234,179,8,0.5)] z-20 relative">
                  <img src={avatars.finance} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded z-30">STOP LOSS</div>
              </div>
              <p className="mt-4 text-xs text-gray-500 text-center max-w-[200px]">
                "Eu não aprovo campanhas, eu aprovo lucro. Se o ROAS cair, eu corto."
              </p>
            </div>

            {/* HEAD DE PLATAFORMA */}
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                <span className="text-[10px] font-mono uppercase text-pink-500 tracking-wider">Criativo & Voz</span>
                <h4 className="text-xl font-bold text-white">HEAD DE PLATAFORMAS</h4>
              </div>
              <div className="flex gap-4">
                <div className="relative group cursor-pointer" onClick={() => setSelectedAgent(strategicAgents.find(a => a.id === 'spec_designer'))}>
                  <div className="w-20 h-20 rounded-2xl border-2 border-pink-500 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src={avatars.instagram} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[9px] text-center mt-1 text-pink-400">DESIGN</div>
                </div>
                <div className="relative group cursor-pointer" onClick={() => setSelectedAgent(strategicAgents.find(a => a.id === 'spec_copy'))}>
                  <div className="w-20 h-20 rounded-2xl border-2 border-blue-400 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src={avatars.scribe} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[9px] text-center mt-1 text-blue-400">COPY</div>
                </div>
              </div>
              {/* Squad List */}
              <div className="mt-4 space-y-2 w-full max-w-[180px]">
                {platformAgents.filter(a => a.reportsTo.includes('Designer') || a.reportsTo.includes('Copy')).slice(0, 3).map(sub => (
                  <div key={sub.id} className="flex items-center gap-2 bg-gray-900/50 p-2 rounded border border-gray-800 text-xs text-gray-400">
                    <div className="w-1 h-1 bg-pink-500 rounded-full"></div>
                    {sub.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-12 mb-8">
            <p className="text-gray-500 text-sm max-w-xl">
              Esta não é uma lista de ferramentas. É uma <strong className="text-white">Cadeia de Comando Militar</strong>.
              Cada nó superior valida o trabalho do nó inferior. Nada chega ao cliente sem passar pelo crivo do Blueprint.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className={`bg-gray-900 border-2 ${selectedAgent.border.replace('/50', '')} rounded-3xl p-6 md:p-8 max-w-4xl w-full relative shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden`}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedAgent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 z-10">
                <FaTimes size={24} />
              </button>

              <div className="flex flex-col md:flex-row gap-10">
                {/* Agent Avatar */}
                <div className="w-full md:w-2/5 relative">
                  <div className={`aspect-[3/4] rounded-2xl overflow-hidden border ${selectedAgent.border} shadow-2xl`}>
                    <img src={selectedAgent.image} alt={selectedAgent.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-black border border-gray-700 p-4 rounded-xl shadow-xl">
                    <div className="text-xs text-gray-400 uppercase font-mono mb-1">Dopamina</div>
                    <div className="text-2xl font-bold text-green-500">{selectedAgent.dopamine}%</div>
                  </div>
                </div>

                {/* Agent Details */}
                <div className="w-full md:w-3/5 space-y-8 pt-4">
                  <div>
                    <h3 className="text-4xl font-black text-white mb-2">{selectedAgent.name}</h3>
                    <span className={`text-sm px-3 py-1 rounded border ${selectedAgent.border} ${selectedAgent.color} bg-black/50 font-mono uppercase tracking-widest`}>
                      {selectedAgent.role}
                    </span>
                    <p className="text-gray-300 mt-6 text-xl leading-relaxed font-light border-l-4 border-white/10 pl-4">
                      "{selectedAgent.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <FaBrain />
                        <span className="text-xs font-bold uppercase">Tecnologia</span>
                      </div>
                      <p className="text-white font-medium text-sm">{selectedAgent.methodology}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <FaNetworkWired />
                        <span className="text-xs font-bold uppercase">Reporta a</span>
                      </div>
                      <p className="text-white font-medium text-sm">{selectedAgent.reportsTo}</p>
                    </div>
                  </div>

                  {/* SQUAD SECTION (New) */}
                  {selectedAgent.squad && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FaNetworkWired /> Squad de Execução
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedAgent.squad.map((member: any, i: number) => (
                          <div key={i} className="bg-black/40 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                            <div className={`text-[10px] font-mono uppercase mb-1 ${selectedAgent.color.replace('text-', 'text-opacity-80 text-')}`}>{member.role}</div>
                            <div className="font-bold text-white text-sm mb-1">{member.name}</div>
                            <p className="text-xs text-gray-400 leading-snug">{member.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
