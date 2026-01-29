import React, { useState } from 'react';
import { Layers, Plug, HelpCircle, ChevronDown, ChevronUp, Globe, User, Brain, FileText, Save } from 'lucide-react';
// React Icons - Premium Brand Icons
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaLinkedin, FaTiktok, FaTwitter, FaTelegram, FaGoogle, FaShopify, FaWordpress } from 'react-icons/fa';
import { SiGoogleads, SiMercadopago, SiWoo } from 'react-icons/si';
import { MdEmail, MdAttachMoney, MdSearch, MdMessage, MdSmartphone, MdShoppingCart } from 'react-icons/md';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'memory' | 'identity'>('integrations');
    const [brandAssets, setBrandAssets] = useState<any[]>([]);
    const [isUploadingAsset, setIsUploadingAsset] = useState(false);

    // --- PROFILE STATE ---
    const [profile, setProfile] = useState({
        name: '',
        surname: '',
        email: '',
        company: '',
        gender: 'masculino',
        phone: '',
        website: '',
        profilePictureUrl: ''
    });

    const [memory, setMemory] = useState({
        brandVoice: '',
        targetAudience: '',
        forbiddenTerms: '',
        coreValues: '',
        mission: '',
        vision: ''
    });

    // --- CONSOLIDATED INTEGRATION DATA ---
    const integrations = [
        {
            category: "📱 Redes Sociais & Comunidade",
            items: [
                {
                    title: "Meta Business",
                    icon: FaFacebook,
                    color: "bg-blue-600",
                    desc: "Facebook + Instagram + WhatsApp + Meta Ads.",
                    connects: ["Facebook", "Instagram", "WhatsApp", "Meta Ads"],
                    fields: [
                        { label: "Business Manager ID", name: "businessId", type: "text", placeholder: "123456789012345" },
                        { label: "Ad Account ID (Para Ads)", name: "adAccountId", type: "text", placeholder: "act_1234567890", helper: "Opcional, apenas para anúncios" },
                        { label: "Access Token (Longa Duração)", name: "accessToken", type: "password", placeholder: "EAAxxxxxxxxxxxxx...", helper: "System User Token" }
                    ]
                },
                {
                    title: "Google",
                    icon: FaGoogle,
                    color: "bg-red-600",
                    desc: "YouTube + Gmail + Google Ads.",
                    connects: ["YouTube", "Gmail", "Google Ads"],
                    fields: [
                        { label: "Customer ID (Para Ads)", name: "customerId", type: "text", placeholder: "123-456-7890", helper: "Opcional, apenas para Google Ads" },
                        { label: "OAuth Refresh Token", name: "refreshToken", type: "password", placeholder: "1//xxxxxxxxxxxxx", helper: "Token OAuth do Google" }
                    ]
                },
                {
                    title: "LinkedIn",
                    icon: FaLinkedin,
                    color: "bg-blue-700",
                    desc: "LinkedIn + LinkedIn Ads.",
                    connects: ["LinkedIn", "LinkedIn Ads"],
                    fields: [
                        { label: "Access Token", name: "accessToken", type: "password", placeholder: "AQVxxxxxxxxxx" },
                        { label: "Organization ID", name: "orgId", type: "text", placeholder: "12345678" },
                        { label: "Ad Account ID (Para Ads)", name: "adAccountId", type: "text", placeholder: "123456789", helper: "Opcional, apenas para anúncios" }
                    ]
                },
                {
                    title: "TikTok",
                    icon: FaTiktok,
                    color: "bg-black border border-gray-700",
                    desc: "TikTok + TikTok Ads.",
                    connects: ["TikTok", "TikTok Ads"],
                    fields: [
                        { label: "Client Key", name: "clientKey", type: "password", placeholder: "aw1xxxxxxxxx" },
                        { label: "Client Secret", name: "clientSecret", type: "password", placeholder: "xxxxxxxxx" },
                        { label: "Advertiser ID (Para Ads)", name: "advertiserId", type: "text", placeholder: "7000000000000000", helper: "Opcional, apenas para anúncios" }
                    ]
                },
                {
                    title: "Telegram",
                    icon: FaTelegram,
                    color: "bg-cyan-500",
                    desc: "Bot para Canais e Grupos.",
                    connects: ["Telegram Bot", "Canais"],
                    fields: [
                        { label: "Bot Token", name: "botToken", type: "password", placeholder: "123456789:ABCdef...", helper: "Via @BotFather" },
                        { label: "Chat ID (Opcional)", name: "chatId", type: "text", placeholder: "-1001234567890" }
                    ]
                },
                {
                    title: "X / Twitter",
                    icon: FaTwitter,
                    color: "bg-gray-800",
                    desc: "Twitter + X Ads.",
                    connects: ["X/Twitter", "X Ads"],
                    fields: [
                        { label: "API Key", name: "apiKey", type: "password", placeholder: "xxxxxxxxxxxxx" },
                        { label: "API Secret", name: "apiSecret", type: "password", placeholder: "xxxxxxxxxxxxx" },
                        { label: "Access Token", name: "accessToken", type: "password", placeholder: "xxxxxxxxxxxxx" },
                        { label: "Access Token Secret", name: "accessTokenSecret", type: "password", placeholder: "xxxxxxxxxxxxx" }
                    ]
                }
            ]
        },
        {
            category: "📧 Comunicação",
            items: [
                {
                    title: "Email (SMTP)",
                    icon: MdEmail,
                    color: "bg-gray-500",
                    desc: "Email marketing via SMTP.",
                    connects: ["SMTP"],
                    fields: [
                        { label: "SMTP Host", name: "smtpHost", type: "text", placeholder: "smtp.gmail.com" },
                        { label: "SMTP Port", name: "smtpPort", type: "text", placeholder: "587" },
                        { label: "SMTP User", name: "smtpUser", type: "text", placeholder: "seu@email.com" },
                        { label: "SMTP Password", name: "smtpPassword", type: "password", placeholder: "••••••••" }
                    ]
                }
            ]
        },
        {
            category: "🛒 E-commerce",
            items: [
                {
                    title: "Shopify",
                    icon: FaShopify,
                    color: "bg-green-700",
                    desc: "Loja Shopify.",
                    connects: ["Shopify Store"],
                    fields: [
                        { label: "Store URL", name: "storeUrl", type: "text", placeholder: "minhaloja.myshopify.com" },
                        { label: "API Key", name: "apiKey", type: "password", placeholder: "xxxxxxxxxxxxxxxx" },
                        { label: "API Secret", name: "apiSecret", type: "password", placeholder: "xxxxxxxxxxxxxxxx" }
                    ]
                },
                {
                    title: "WooCommerce",
                    icon: FaWordpress,
                    color: "bg-purple-700",
                    desc: "WordPress WooCommerce.",
                    connects: ["WooCommerce"],
                    fields: [
                        { label: "Site URL", name: "siteUrl", type: "text", placeholder: "https://minhaloja.com.br" },
                        { label: "Consumer Key", name: "consumerKey", type: "password", placeholder: "ck_xxxxxxxxxxxxxxxx" },
                        { label: "Consumer Secret", name: "consumerSecret", type: "password", placeholder: "cs_xxxxxxxxxxxxxxxx" }
                    ]
                },
                {
                    title: "Mercado Livre",
                    icon: SiMercadopago,
                    color: "bg-yellow-400",
                    desc: "Marketplace LATAM.",
                    connects: ["Mercado Livre"],
                    fields: [
                        { label: "App ID", name: "appId", type: "text", placeholder: "1234567890123456" },
                        { label: "App Secret", name: "appSecret", type: "password", placeholder: "xxxxxxxxxxxxxxxx" }
                    ]
                },
                {
                    title: "Nuvemshop",
                    icon: MdShoppingCart,
                    color: "bg-blue-500",
                    desc: "Loja Nuvemshop.",
                    connects: ["Nuvemshop"],
                    fields: [
                        { label: "App ID", name: "appId", type: "text", placeholder: "1234" },
                        { label: "App Secret", name: "appSecret", type: "password", placeholder: "xxxxxxxxxxxxxxxx" }
                    ]
                }
            ]
        }
    ];

    const IntegrationCard = ({ item }: any) => {
        const [showGuide, setShowGuide] = useState(false);
        const [isConnecting, setIsConnecting] = useState(false);
        const [formData, setFormData] = useState<any>({});

        const handleSave = async () => {
            const hasData = Object.values(formData).some((val: any) => val && val.trim() !== '');
            if (!hasData) {
                alert("Por favor, preencha pelo menos um campo.");
                return;
            }

            setIsConnecting(true);
            try {
                const token = localStorage.getItem('token');
                const firstField = item.fields?.[0];
                const apiKey = firstField ? formData[firstField.name] || '' : '';

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/integrations/save`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        platform: item.title,
                        apiKey: apiKey,
                        metadata: JSON.stringify(formData)
                    })
                });

                if (res.ok) {
                    setIsConnecting(false);
                    setShowGuide(false);
                    if (item.title === 'Telegram') {
                        const suffix = profile.gender === 'feminino' ? 'a' : 'o';
                        alert(`✅ INTEGRAÇÃO BEM-SUCEDIDA!\n\n🔊 A VERA acabou de te enviar uma mensagem de ÁUDIO no Telegram:\n\n\"Bem-vind${suffix}, Chefe!\"\n\nVerifique seu chat para ouvir as instruções e o Manual de Boas Vindas.`);
                    } else {
                        alert(`✅ ${item.title} conectado com sucesso! A VERA já está analisando os dados.`);
                    }
                    fetchIntegrationsStatus();
                    setFormData({});
                } else {
                    alert("Erro ao salvar integração.");
                }
            } catch (error) {
                console.error("Error saving integration", error);
                alert("Erro de conexão ao salvar.");
            } finally {
                setIsConnecting(false);
            }
        };

        return (
            <div className="bg-[#1A1625] border border-[#292348] rounded-xl overflow-hidden transition-all hover:border-blue-500/30">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center flex-1">
                        {/* MULTIPLE PLATFORM ICONS */}
                        {item.connects && item.connects.length > 1 ? (
                            <div className="flex -space-x-3 shrink-0">
                                {item.connects.slice(0, 4).map((p: string, i: number) => {
                                    const icons: any = {
                                        'Facebook': { Icon: FaFacebook, color: 'bg-blue-600' },
                                        'Instagram': { Icon: FaInstagram, color: 'bg-pink-600' },
                                        'WhatsApp': { Icon: FaWhatsapp, color: 'bg-green-500' },
                                        'Meta Ads': { Icon: MdAttachMoney, color: 'bg-blue-500' },
                                        'YouTube': { Icon: FaYoutube, color: 'bg-red-600' },
                                        'Gmail': { Icon: MdEmail, color: 'bg-red-500' },
                                        'Google Ads': { Icon: SiGoogleads, color: 'bg-yellow-500' },
                                        'LinkedIn': { Icon: FaLinkedin, color: 'bg-blue-700' },
                                        'LinkedIn Ads': { Icon: FaLinkedin, color: 'bg-blue-800' },
                                        'TikTok': { Icon: FaTiktok, color: 'bg-black border border-gray-700' },
                                        'TikTok Ads': { Icon: FaTiktok, color: 'bg-black border border-white/20' },
                                        'X/Twitter': { Icon: FaTwitter, color: 'bg-gray-800' },
                                        'X Ads': { Icon: MdAttachMoney, color: 'bg-gray-900' },
                                        'Telegram Bot': { Icon: FaTelegram, color: 'bg-cyan-500' },
                                        'Canais': { Icon: MdMessage, color: 'bg-cyan-600' },
                                        'SMTP': { Icon: MdEmail, color: 'bg-gray-500' },
                                        'Shopify Store': { Icon: FaShopify, color: 'bg-green-700' },
                                        'WooCommerce': { Icon: FaWordpress, color: 'bg-purple-700' },
                                        'Mercado Livre': { Icon: SiMercadopago, color: 'bg-yellow-400' },
                                        'Nuvemshop': { Icon: MdShoppingCart, color: 'bg-blue-500' }
                                    };
                                    const { Icon, color } = icons[p] || { Icon: item.icon, color: item.color };
                                    return (
                                        <div
                                            key={i}
                                            className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center border-2 border-[#0B0915] relative transition-transform hover:scale-110`}
                                            style={{ zIndex: 10 - i }}
                                            title={p}
                                        >
                                            <Icon className="text-white w-5 h-5" />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                                <item.icon className="text-white w-5 h-5" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                {item.title}
                                {item.connects && item.connects.length > 1 && (
                                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-500/30">
                                        {item.connects.length} em 1
                                    </span>
                                )}
                            </h3>
                            <p className="text-gray-400 text-xs mb-1">{item.desc}</p>
                            {item.connects && item.connects.length > 1 && (
                                <div className="flex flex-wrap gap-1">
                                    {item.connects.map((c: string, i: number) => (
                                        <span key={i} className="text-[9px] bg-gray-800/50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">{c}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${integrationStatus.find(s => s.platform.toLowerCase() === item.title.toLowerCase())?.isActive ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                            {integrationStatus.find(s => s.platform.toLowerCase() === item.title.toLowerCase())?.isActive ? 'ON' : 'OFF'}
                        </span>
                        <button onClick={() => setShowGuide(!showGuide)} className="bg-[#292348] hover:bg-white/10 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold">
                            {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            Configurar
                        </button>
                    </div>
                </div>
                {showGuide && (
                    <div className="bg-[#0B0915] p-6 border-t border-[#292348] text-sm text-gray-400 space-y-4 animate-in slide-in-from-top-2">
                        {item.fields && item.fields.map((field: any, idx: number) => (
                            <div key={idx}>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                    {field.label}
                                    {field.helper && (
                                        <span className="text-gray-600 font-normal normal-case text-[10px]">({field.helper})</span>
                                    )}
                                </label>
                                <input
                                    type={field.type || 'text'}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                    placeholder={field.placeholder}
                                    autoComplete="off"
                                    className="w-full bg-[#1A1625] border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none font-mono text-xs"
                                />
                            </div>
                        ))}

                        <button
                            onClick={handleSave}
                            disabled={isConnecting}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-3 rounded transition-colors text-xs uppercase tracking-wider flex justify-center items-center gap-2"
                        >
                            {isConnecting ? 'Validando Conexão...' : 'Salvar Integração'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // --- INTEGRATIONS STATUS ---
    const [integrationStatus, setIntegrationStatus] = useState<any[]>([]);

    const fetchIntegrationsStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/integrations/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setIntegrationStatus(data);
            }
        } catch (error) {
            console.error("Error fetching integration status", error);
        }
    };

    // --- FETCH DATA ON MOUNT ---
    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const resAssets = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/brand/assets`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resAssets.ok) {
                    const assetsData = await resAssets.json();
                    setBrandAssets(assetsData);
                }

                if (res.ok) {
                    const data = await res.json();
                    setProfile(prev => ({ ...prev, ...data.profile }));
                    setMemory(prev => ({ ...prev, ...data.memory }));
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        };
        fetchProfile();
        fetchIntegrationsStatus();
    }, []);

    const handleSaveProfile = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...profile,
                    ...memory
                })
            });

            if (res.ok) {
                alert("✅ Configurações salvas com sucesso! A VERA já atualizou sua memória.");
            } else {
                alert("Erro ao salvar perfil.");
            }
        } catch (error) {
            console.error("Error saving profile", error);
            alert("Erro de conexão ao salvar.");
        }
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("O arquivo é muito grande (Máx 2MB).");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(prev => ({ ...prev, profilePictureUrl: data.url }));
                alert("✅ Foto de perfil atualizada!");
            } else {
                alert("Erro ao enviar foto.");
            }
        } catch (error) {
            console.error("Upload error", error);
            alert("Erro de conexão no upload.");
        }
    };

    const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'LOGO' | 'MANUAL') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("O arquivo é muito grande (Máx 10MB).");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        setIsUploadingAsset(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/brand/assets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setBrandAssets(prev => [data.asset, ...prev]);
                alert(`✅ ${type === 'LOGO' ? 'Logo' : 'Manual'} enviado com sucesso! A VERA está analisando...`);
            } else {
                alert("Erro ao enviar arquivo.");
            }
        } catch (error) {
            console.error("Asset Upload error", error);
            alert("Erro de conexão no upload.");
        } finally {
            setIsUploadingAsset(false);
        }
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
                <p className="text-gray-400">Gerencie integrações, perfil e o Cérebro da VERA.</p>
            </div>

            <div className="flex gap-2 bg-[#1A1625] p-1.5 rounded-xl w-fit border border-[#292348] flex-wrap">
                <button onClick={() => setActiveTab('integrations')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'integrations' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                    <Plug size={16} /> Integrações
                </button>
                <button onClick={() => setActiveTab('memory')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'memory' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                    <Brain size={16} /> Memória Neural
                </button>
                <button onClick={() => setActiveTab('identity')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'identity' ? 'bg-pink-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                    <Layers size={16} /> Identidade Visual
                </button>
                <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                    <User size={16} /> Perfil
                </button>
            </div>

            {activeTab === 'integrations' && (
                <>
                    {/* Help Banner */}
                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <HelpCircle className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Precisa de ajuda para conectar?</h3>
                                \u003cp className="text-gray-400 text-sm"\u003eAcesse nosso guia completo com tutoriais passo a passo para cada plataforma.\u003c/p\u003e
                            </div>
                        </div>
                        <a
                            href="/guia-integracoes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <Globe size={20} />
                            Ver Tutoriais
                        </a>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {integrations.map((cat, i) => (
                            <div key={i} className="space-y-4">
                                <h2 className="text-white font-bold border-l-4 border-blue-600 pl-3">{cat.category}</h2>
                                <div className="space-y-3">
                                    {cat.items.map((item, idx) => <IntegrationCard key={idx} item={item} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'memory' && (
                <div className="max-w-4xl">
                    <div className="bg-[#1A1625] border border-[#292348] rounded-xl p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
                                <Brain className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Diretrizes da Rede Neural</h3>
                                <p className="text-gray-400 text-sm">Estas regras são <span className="text-white font-bold">injetadas no contexto</span> de todos os agentes.</p>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleSaveProfile}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Voz da Marca</label>
                                    <textarea
                                        className="w-full bg-[#0B0915] border border-gray-700 rounded-xl p-4 text-white h-32 focus:border-purple-500 outline-none transition-colors text-sm"
                                        placeholder="Descreva como a marca fala. Ex: Ousada, jovem, usa emojis, direta..."
                                        value={memory.brandVoice}
                                        onChange={e => setMemory({ ...memory, brandVoice: e.target.value })}
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Público-Alvo (Persona)</label>
                                    <textarea
                                        className="w-full bg-[#0B0915] border border-gray-700 rounded-xl p-4 text-white h-32 focus:border-purple-500 outline-none transition-colors text-sm"
                                        placeholder="Quem queremos atingir? Ex: CEOs de startups, 30-45 anos, classe A/B..."
                                        value={memory.targetAudience}
                                        onChange={e => setMemory({ ...memory, targetAudience: e.target.value })}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Visão</label>
                                    <textarea
                                        className="w-full bg-[#0B0915] border border-gray-700 rounded-xl p-4 text-white h-32 focus:border-purple-500 outline-none transition-colors text-sm"
                                        placeholder="Onde a marca quer estar em 5 anos?"
                                        value={memory.vision}
                                        onChange={e => setMemory({ ...memory, vision: e.target.value })}
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Valores Fundamentais</label>
                                    <textarea
                                        className="w-full bg-[#0B0915] border border-gray-700 rounded-xl p-4 text-white h-32 focus:border-purple-500 outline-none transition-colors text-sm"
                                        placeholder="No que a marca acredita? Ex: Transparência, Inovação..."
                                        value={memory.coreValues}
                                        onChange={e => setMemory({ ...memory, coreValues: e.target.value })}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Missão & Propósito</label>
                                    <textarea
                                        className="w-full bg-[#0B0915] border border-gray-700 rounded-xl p-4 text-white h-32 focus:border-purple-500 outline-none transition-colors text-sm"
                                        placeholder="Qual o objetivo maior da empresa?"
                                        value={memory.mission}
                                        onChange={e => setMemory({ ...memory, mission: e.target.value })}
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Termos Proibidos (Lista Negra)</label>
                                    <textarea
                                        className="w-full bg-[#0B0915] border border-red-900/40 rounded-xl p-4 text-white h-32 focus:border-red-500 outline-none transition-colors text-sm"
                                        placeholder="Palavras que NUNCA devem ser usadas. Ex: Barato, Promoção, Urgente..."
                                        value={memory.forbiddenTerms}
                                        onChange={e => setMemory({ ...memory, forbiddenTerms: e.target.value })}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-purple-900/20 flex items-center gap-2 transition-all w-full md:w-auto justify-center">
                                <Save size={18} /> Atualizar Cérebro da VERA
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'identity' && (
                <div className="space-y-6">
                    <div className="bg-[#1A1625] border border-[#292348] rounded-xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                                <Layers className="text-pink-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Identidade Visual & Marca</h3>
                                <p className="text-gray-400 text-sm">A VERA analisa estes arquivos para manter a consistência visual e de tom.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-[#0B0915] rounded-xl p-6 border border-gray-800">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-pink-500 rounded-full"></div> Logotipo Principal</h4>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-40 h-40 bg-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700 overflow-hidden relative">
                                        {brandAssets.find(a => a.type === 'LOGO') ? (
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}${brandAssets.find(a => a.type === 'LOGO')?.url}`} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-gray-600 text-xs text-center p-2">Sem Logo</span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2">
                                        {isUploadingAsset ? 'Enviando...' : 'Enviar Logo (PNG/SVG)'}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAssetUpload(e, 'LOGO')} disabled={isUploadingAsset} />
                                    </label>
                                    <p className="text-[10px] text-gray-500 text-center">A I.A. extrairá a paleta de cores automaticamente.</p>
                                </div>
                            </div>

                            <div className="bg-[#0B0915] rounded-xl p-6 border border-gray-800">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Manual da Marca / Docs</h4>

                                <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                                    {brandAssets.filter(a => a.type === 'MANUAL').length === 0 && <p className="text-gray-600 text-xs italic">Nenhum manual enviado.</p>}
                                    {brandAssets.filter(a => a.type === 'MANUAL').map(asset => (
                                        <div key={asset.id} className="flex items-center justify-between bg-gray-900/50 p-3 rounded border border-gray-800">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileText size={16} className="text-blue-400 shrink-0" />
                                                <div className="truncate">
                                                    <p className="text-gray-300 text-xs font-bold truncate">{asset.name}</p>
                                                    <p className="text-[10px] text-gray-500">{asset.summary ? "✅ Analisado pela IA" : "Aguardando Análise..."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <label className="cursor-pointer border border-gray-700 hover:bg-gray-800/50 text-gray-400 hover:text-white font-bold py-4 px-4 rounded-lg text-sm transition-all flex flex-col items-center gap-2 border-dashed w-full">
                                    <span className="flex items-center gap-2"><Plug size={16} /> Adicionar PDF, DOC ou PPT</span>
                                    <span className="text-[10px] font-normal text-gray-600">Brandbooks, Apresentações institucionais...</span>
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => handleAssetUpload(e, 'MANUAL')} disabled={isUploadingAsset} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="bg-[#1A1625] border border-[#292348] rounded-xl p-8 max-w-3xl">
                    <h3 className="text-white font-bold mb-6 text-xl">Perfil do Usuário</h3>
                    <div className="flex flex-col md:flex-row gap-8">

                        <div className="flex flex-col items-center gap-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                            />
                            <div
                                onClick={handleAvatarClick}
                                className="w-32 h-32 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700 transition-all relative group overflow-hidden"
                            >
                                {profile.profilePictureUrl ? (
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}${profile.profilePictureUrl}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={40} className="text-gray-400 group-hover:text-white" />
                                )}

                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold text-white">Alterar Foto</span>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">JPG ou PNG (Max 2MB)</span>
                        </div>

                        <form className="space-y-4 flex-1" onSubmit={handleSaveProfile}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Nome</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-[#0B0915] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Sobrenome</label>
                                    <input
                                        type="text"
                                        value={profile.surname}
                                        onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                                        className="w-full bg-[#0B0915] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Gênero (Para tratamento da VERA)</label>
                                <select
                                    value={profile.gender}
                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                    className="w-full bg-[#0B0915] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="masculino">Masculino ("Bem-vindo, Chefe")</option>
                                    <option value="feminino">Feminino ("Bem-vinda, Chefe")</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-[#0B0915] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Empresa</label>
                                <input
                                    type="text"
                                    value={profile.company}
                                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                    className="w-full bg-[#0B0915] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Website / Link Principal</label>
                                <input
                                    type="text"
                                    value={profile.website}
                                    placeholder="https://suaempresa.com.br"
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                    className="w-full bg-[#0B0915] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Telefone (WhatsApp para VERA)</label>
                                <input
                                    type="tel"
                                    placeholder="+55 ..."
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full bg-[#0B0915] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    autoComplete="off"
                                />
                                <p className="text-[10px] text-gray-500">Este é o número que a VERA usará para te chamar em caso de urgência.</p>
                            </div>

                            <div className="pt-4">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all w-full">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
