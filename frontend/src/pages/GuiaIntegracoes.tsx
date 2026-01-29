/**
 * GUIA DE INTEGRAÇÕES - VERA
 * Página completa com tutorial de cada plataforma
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    MessageCircle
} from 'lucide-react';
// React Icons - Premium Brand Icons
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaLinkedin, FaTwitter, FaTelegram, FaGoogle, FaShopify, FaWordpress } from 'react-icons/fa';
import { SiMercadopago, SiTiktok } from 'react-icons/si';
import { MdEmail, MdShoppingCart } from 'react-icons/md';
import './GuiaIntegracoes.css';

interface Platform {
    id: string;
    name: string;
    icon: any;
    color: string;
    plan: 'starter' | 'growth' | 'enterprise';
    connects: string[];
}

const platforms: Platform[] = [
    {
        id: 'meta',
        name: 'Meta Business',
        icon: FaFacebook,
        color: '#1877F2',
        plan: 'starter',
        connects: ['Facebook', 'Instagram', 'WhatsApp', 'Messenger', 'Ads']
    },
    {
        id: 'google',
        name: 'Google',
        icon: FaGoogle,
        color: '#FF0000',
        plan: 'starter',
        connects: ['YouTube', 'Gmail', 'Google Ads', 'Analytics']
    },
    {
        id: 'x',
        name: 'X (Twitter)',
        icon: FaTwitter,
        color: '#000000',
        plan: 'starter',
        connects: ['X/Twitter', 'X Ads']
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: FaLinkedin,
        color: '#0A66C2',
        plan: 'starter',
        connects: ['LinkedIn', 'LinkedIn Ads']
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        icon: SiTiktok,
        color: '#000000',
        plan: 'starter',
        connects: ['TikTok', 'TikTok Ads']
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: FaInstagram,
        color: '#E4405F',
        plan: 'starter',
        connects: ['Instagram', 'Stories', 'Reels', 'Direct']
    },
    {
        id: 'telegram',
        name: 'Telegram',
        icon: FaTelegram,
        color: '#0088CC',
        plan: 'starter',
        connects: ['Telegram Bot', 'Canais', 'Comunidades']
    },
    {
        id: 'mercadolivre',
        name: 'Mercado Livre',
        icon: SiMercadopago,
        color: '#FFE600',
        plan: 'growth',
        connects: ['Loja', 'Produtos', 'Pedidos', 'Mensagens']
    },
    {
        id: 'shopify',
        name: 'Shopify',
        icon: FaShopify,
        color: '#96BF48',
        plan: 'growth',
        connects: ['Loja', 'Catálogo', 'Clientes', 'Pedidos']
    },
    {
        id: 'woocommerce',
        name: 'WooCommerce',
        icon: FaWordpress,
        color: '#96588A',
        plan: 'growth',
        connects: ['WordPress', 'Produtos', 'Vendas']
    },
    {
        id: 'nuvemshop',
        name: 'Nuvemshop',
        icon: MdShoppingCart,
        color: '#0D6EFD',
        plan: 'growth',
        connects: ['Loja', 'Catálogo', 'Pedidos']
    }
];

const GuiaIntegracoes: React.FC = () => {
    const [activePlatform, setActivePlatform] = useState<string>('meta');
    const [expandedStep, setExpandedStep] = useState<number | null>(null);
    const navigate = useNavigate();

    const selectedPlatform = platforms.find(p => p.id === activePlatform);

    // Função para gerar o título claro e direto
    const getPlatformTitle = (platformId: string) => {
        const titles: Record<string, string> = {
            'meta': 'Como conectar seu Facebook, Instagram e WhatsApp',
            'google': 'Como conectar seu Google (YouTube + Gmail + Ads)',
            'x': 'Como conectar seu X (Twitter)',
            'linkedin': 'Como conectar seu LinkedIn',
            'tiktok': 'Como conectar seu TikTok',
            'instagram': 'Como conectar seu Instagram',
            'telegram': 'Como conectar seu Telegram',
            'mercadolivre': 'Como conectar seu Mercado Livre',
            'shopify': 'Como conectar sua loja Shopify',
            'woocommerce': 'Como conectar seu WooCommerce',
            'nuvemshop': 'Como conectar sua Nuvemshop'
        };
        return titles[platformId] || 'Como conectar';
    };

    return (
        <div className="guia-integracoes">
            {/* Header */}
            <header className="guia-header">
                <div className="container">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        ← Voltar
                    </button>
                    <h1>📚 Guia de Integrações</h1>
                    <p className="subtitle">
                        Tutoriais passo a passo para conectar suas plataformas à VERA. Escolha uma rede abaixo:
                    </p>
                </div>
            </header>

            {/* Platform Selector */}
            <section className="platform-selector">
                <div className="container">
                    <h2 className="section-title">Selecione a plataforma que deseja conectar:</h2>
                    <div className="platforms-grid">
                        {platforms.map(platform => {
                            const isActive = activePlatform === platform.id;
                            const isPro = platform.plan === 'growth' || platform.plan === 'enterprise';
                            const PlatformIcon = platform.icon;

                            return (
                                <button
                                    key={platform.id}
                                    className={`platform-card ${isActive ? 'active' : ''}`}
                                    onClick={() => setActivePlatform(platform.id)}
                                    style={{ borderColor: isActive ? '#3A7AFE' : undefined }}
                                >
                                    {/* UM único ícone representando a plataforma */}
                                    <div className="platform-icon-single" style={{ backgroundColor: `${platform.color}15` }}>
                                        <PlatformIcon size={48} color={platform.color} />
                                    </div>
                                    <h3>{platform.name}</h3>
                                    {isPro && (
                                        <span className="pro-badge">GROWTH+</span>
                                    )}
                                    <div className="connects-preview">
                                        {platform.connects.slice(0, 2).map((c, i) => (
                                            <span key={i} className="connect-tag">{c}</span>
                                        ))}
                                        {platform.connects.length > 2 && (
                                            <span className="connect-more">+{platform.connects.length - 2}</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Tutorial Content */}
            <section className="tutorial-content">
                <div className="container">
                    {selectedPlatform && (
                        <>
                            {/* Platform Header com título claro */}
                            <div className="tutorial-header">
                                <div className="tutorial-header-left">
                                    <div className="platform-icon-large" style={{ backgroundColor: `${selectedPlatform.color}15` }}>
                                        <selectedPlatform.icon size={48} color={selectedPlatform.color} />
                                    </div>
                                    <div>
                                        <h2>{getPlatformTitle(activePlatform)}</h2>
                                        <div className="connects-list">
                                            <span>Esta integração conecta:</span>
                                            {selectedPlatform.connects.map((c, i) => (
                                                <span key={i} className="connect-badge">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="tutorial-header-right">
                                    <span className={`plan-badge plan-${selectedPlatform.plan}`}>
                                        {selectedPlatform.plan.toUpperCase()}+
                                    </span>
                                </div>
                            </div>

                            {/* Tutorial Steps */}
                            <div className="tutorial-steps">
                                {getTutorialSteps(activePlatform).map((step, index) => {
                                    const isExpanded = expandedStep === index;

                                    return (
                                        <div key={index} className={`step-card ${isExpanded ? 'expanded' : ''}`}>
                                            <button
                                                className="step-header"
                                                onClick={() => setExpandedStep(isExpanded ? null : index)}
                                            >
                                                <div className="step-header-left">
                                                    <span className="step-number">{index + 1}</span>
                                                    <h3>{step.title}</h3>
                                                </div>
                                                {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                            </button>

                                            {isExpanded && (
                                                <div className="step-content">
                                                    <div className="step-description">
                                                        {step.description}
                                                    </div>

                                                    {step.substeps && (
                                                        <ol className="substeps-list">
                                                            {step.substeps.map((substep: string, i: number) => (
                                                                <li key={i} className="substep">
                                                                    <CheckCircle size={16} className="check-icon" />
                                                                    <span dangerouslySetInnerHTML={{ __html: substep }} />
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    )}

                                                    {step.important && (
                                                        <div className="alert alert-warning">
                                                            <AlertCircle size={20} />
                                                            <div>
                                                                <strong>⚠️ Importante:</strong>
                                                                <p>{step.important}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {step.links && (
                                                        <div className="external-links">
                                                            <h4>🔗 Links úteis:</h4>
                                                            <div className="links-grid">
                                                                {step.links.map((link: any, i: number) => (
                                                                    <a
                                                                        key={i}
                                                                        href={link.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="external-link"
                                                                    >
                                                                        <span>{link.label}</span>
                                                                        <ExternalLink size={16} />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Help Section - SEM GRADIENTE GENÉRICO */}
                            <div className="help-section">
                                <AlertCircle size={24} className="help-icon" />
                                <h3>Precisa de suporte?</h3>
                                <p>Nossa equipe está disponível para ajudar você com qualquer dúvida durante o processo de integração.</p>
                                <button className="btn-help" onClick={() => navigate('/painel/suporte')}>
                                    Abrir Chat de Suporte
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

// Tutorial steps por plataforma
function getTutorialSteps(platformId: string) {
    const tutorials: Record<string, any[]> = {
        meta: [
            {
                title: 'Criar Página Empresarial no Facebook',
                description: 'Primeiro, você precisa de uma Página para sua empresa no Facebook.',
                substeps: [
                    'Acesse <a href="https://www.facebook.com/pages/create" target="_blank">facebook.com/pages/create</a>',
                    'Clique em <strong>"Criar Página"</strong>',
                    'Escolha <strong>"Empresa ou Marca"</strong>',
                    'Preencha:<br>- Nome da Página: Nome da sua empresa<br>- Categoria: Marketing e Publicidade<br>- Descrição: Descreva seu negócio (mín. 50 caracteres)',
                    'Adicione foto de perfil (logo) e capa',
                    'Clique em <strong>"Criar Página"</strong>'
                ],
                important: 'Você precisa ser Admin da página para conectar à VERA.'
            },
            {
                title: 'Criar Conta de Negócios (Business Manager)',
                description: 'Agora vamos criar sua conta de anúncios profissional.',
                substeps: [
                    'Acesse <a href="https://business.facebook.com" target="_blank">business.facebook.com</a>',
                    'Clique em <strong>"Criar Conta"</strong>',
                    'Preencha nome da empresa e seu email de trabalho',
                    'No menu lateral: <strong>Configurações → Contas de anúncio → Adicionar</strong>',
                    'Escolha <strong>"Criar uma nova conta de anúncios"</strong>',
                    'Preencha:<br>- Nome da conta<br>- Fuso horário: Brasília (GMT-03:00)<br>- Moeda: BRL',
                    'Anote o <strong>ID da conta</strong> (formato: act_1234567890)'
                ],
                links: [
                    { label: 'Central de Ajuda Meta', url: 'https://business.help.instagram.com' }
                ]
            },
            {
                title: 'Adicionar Método de Pagamento',
                description: 'Configure seu cartão para anúncios.',
                substeps: [
                    'No Gerenciador de Anúncios: <strong>⚙️ → Configurações de pagamento</strong>',
                    'Clique em <strong>"Adicionar forma de pagamento"</strong>',
                    'Escolha <strong>"Cartão de crédito ou débito"</strong>',
                    'Preencha dados do cartão (use cartão internacional)',
                    'Facebook validará com cobrança de R$ 1,00 (depois estorna)'
                ],
                important: 'Cartões virtuais podem ser rejeitados. Use Visa, Mastercard ou Amex.'
            },
            {
                title: 'Conectar à VERA',
                description: 'Agora vamos autorizar VERA a acessar sua conta.',
                substeps: [
                    'No dashboard VERA, vá em <strong>Integrações</strong>',
                    'Localize <strong>"Meta Business"</strong> e clique <strong>"Conectar"</strong>',
                    'Faça login no Facebook quando solicitado',
                    'Aprove as permissões:<br>- Gerenciar páginas<br>- Gerenciar anúncios<br>- Ver estatísticas',
                    'Selecione sua <strong>Página</strong> e <strong>Conta de anúncios</strong>',
                    'Clique <strong>"Concluir"</strong>'
                ],
                important: 'Status deve mostrar 🟢 Conectado no dashboard.'
            }
        ],

        google: [
            {
                title: 'Criar Conta Google Ads',
                description: 'Configure sua conta de anúncios no Google.',
                substeps: [
                    'Acesse <a href="https://ads.google.com" target="_blank">ads.google.com</a>',
                    'Clique <strong>"Começar agora"</strong>',
                    'No canto inferior: <strong>"Mudar para Modo Especialista"</strong>',
                    'Depois: <strong>"Criar uma conta sem campanha"</strong>',
                    'Configure:<br>- Fuso horário: Brasília (GMT-03:00)<br>- Moeda: BRL',
                    '⚠️ Fuso e moeda NÃO podem ser alterados depois!'
                ],
                links: [
                    { label: 'Suporte Google Ads', url: 'https://support.google.com/google-ads' }
                ]
            },
            {
                title: 'Adicionar Método de Pagamento',
                description: 'Configure pagamentos automáticos.',
                substeps: [
                    '<strong>Ferramentas e configurações → Cobrança → Resumo</strong>',
                    'Clique <strong>"Adicionar forma de pagamento"</strong>',
                    'Selecione <strong>"Cartão de crédito"</strong>',
                    'Preencha dados do cartão',
                    'Tipo: <strong>"Pagamentos automáticos"</strong> (recomendado)'
                ]
            },
            {
                title: 'Conectar YouTube',
                description: 'Vincule seu canal do YouTube.',
                substeps: [
                    'Acesse <a href="https://studio.youtube.com" target="_blank">YouTube Studio</a>',
                    'Certifique-se de ter canal criado',
                    'Quando conectar Google na VERA, YouTube vem junto automaticamente'
                ],
                important: 'Precisa ter pelo menos 1 vídeo publicado para anúncios.'
            },
            {
                title: 'Conectar à VERA',
                description: 'Autorize VERA a gerenciar suas campanhas.',
                substeps: [
                    'Dashboard VERA → <strong>Integrações → Google</strong>',
                    'Clique <strong>"Conectar"</strong>',
                    'Escolha sua conta Google',
                    'Aprove permissões:<br>- Gerenciar Google Ads<br>- Upload vídeos YouTube<br>- Enviar emails Gmail',
                    '<strong>"Permitir"</strong>'
                ]
            }
        ],

        mercadolivre: [
            {
                title: 'Criar Conta Mercado Livre',
                description: 'Configure sua loja no Mercado Livre.',
                substeps: [
                    'Acesse <a href="https://www.mercadolivre.com.br" target="_blank">mercadolivre.com.br</a>',
                    'Clique <strong>"Vender"</strong> (topo direito)',
                    '<strong>"Criar conta"</strong> ou faça login',
                    'Complete cadastro com CPF ou CNPJ',
                    'Valide email e telefone'
                ],
                important: 'Contas CNPJ têm taxas menores e mais credibilidade.'
            },
            {
                title: 'Criar Aplicação (API)',
                description: 'Gere credenciais de API.',
                substeps: [
                    'Acesse <a href="https://developers.mercadolivre.com.br" target="_blank">developers.mercadolivre.com.br</a>',
                    '<strong>"Criar nova aplicação"</strong>',
                    'Preencha:<br>- Nome: VERA Integration<br>- Descrição: Integração com VERA Marketing<br>- Redirect URI: https://app.veramkt.com.br/api/mercadolivre/callback',
                    'Anote:<br>- <strong>App ID</strong><br>- <strong>Secret Key</strong>'
                ],
                links: [
                    { label: 'Documentação API', url: 'https://developers.mercadolivre.com.br/pt_br/api-docs' }
                ],
                important: '🔴 Recurso disponível apenas no plano GROWTH ou superior.'
            },
            {
                title: 'Conectar à VERA',
                description: 'Autorize VERA a gerenciar sua loja.',
                substeps: [
                    'Dashboard VERA → <strong>Integrações → Mercado Livre</strong>',
                    'Clique <strong>"Conectar" (GROWTH+)</strong>',
                    'Faça login no Mercado Livre',
                    'Aprove permissões:<br>- Gerenciar produtos<br>- Acessar pedidos<br>- Responder perguntas',
                    '<strong>"Autorizar"</strong>'
                ]
            }
        ],

        shopify: [
            {
                title: 'Criar Loja Shopify',
                description: 'Configure sua loja online.',
                substeps: [
                    'Acesse <a href="https://www.shopify.com/br" target="_blank">shopify.com/br</a>',
                    'Clique <strong>"Comece o teste grátis"</strong>',
                    'Preencha email e crie senha',
                    'Complete setup wizard',
                    'Escolha plano (após 14 dias de teste)'
                ],
                important: 'Shopify cobra USD (dólar). Plano básico: ~$29/mês.'
            },
            {
                title: 'Gerar API Credentials',
                description: 'Crie credenciais privadas.',
                substeps: [
                    'No admin Shopify: <strong>Configurações → Apps e canais de vendas</strong>',
                    '<strong>"Desenvolver apps"</strong>',
                    '<strong>"Criar um app"</strong>',
                    'Nome: VERA Integration',
                    '<strong>"Configurar escopo de API"</strong>',
                    'Selecione:<br>- read_products, write_products<br>- read_orders<br>- read_customers',
                    '<strong>"Salvar → Instalar app"</strong>',
                    'Copie <strong>API Key</strong> e <strong>Secret</strong>'
                ],
                links: [
                    { label: 'Shopify Admin API', url: 'https://shopify.dev/api/admin' }
                ],
                important: '🔴 Recurso disponível apenas no plano GROWTH ou superior.'
            },
            {
                title: 'Conectar à VERA',
                description: 'Conecte sua loja Shopify.',
                substeps: [
                    'Dashboard VERA → <strong>Integrações → Shopify</strong>',
                    'Clique <strong>"Conectar" (GROWTH+)</strong>',
                    'Digite sua <strong>URL da loja</strong> (ex: minhaloja.myshopify.com)',
                    'Cole <strong>API Key</strong> e <strong>Secret</strong>',
                    '<strong>"Conectar"</strong>'
                ]
            }
        ],

        instagram: [
            {
                title: 'Converter para Conta Profissional',
                description: 'Primeiro, você precisa ter uma conta Instagram Business ou Creator.',
                substeps: [
                    'Abra o app Instagram',
                    '<strong>Configurações → Conta → Mudar tipo de conta</strong>',
                    'Escolha <strong>"Conta Profissional"</strong>',
                    'Selecione categoria da empresa',
                    'Vincule com uma <strong>Página do Facebook</strong> (obrigatório)',
                    'Se não tiver Página, crie uma em <a href="https://facebook.com/pages/create" target="_blank">facebook.com/pages/create</a>'
                ],
                important: 'Sem uma Página do Facebook vinculada, a API não funcionará.'
            },
            {
                title: 'Obter Access Token via Graph API Explorer',
                description: 'Gere um token de acesso de longa duração.',
                substeps: [
                    'Acesse <a href="https://developers.facebook.com/tools/explorer/" target="_blank">Facebook Graph API Explorer</a>',
                    'Selecione sua aplicação (ou crie uma em <a href="https://developers.facebook.com/apps" target="_blank">developers.facebook.com/apps</a>)',
                    'Em "Permissions", adicione:<br>- <code>instagram_basic</code><br>- <code>instagram_content_publish</code><br>- <code>pages_show_list</code><br>- <code>pages_read_engagement</code>',
                    'Clique <strong>"Generate Access Token"</strong>',
                    'Autorize no popup',
                    '⚠️ Token de curta duração expira em 1h. Use token de longa duração!'
                ],
                links: [
                    { label: 'Gerar Token Longo Prazo', url: 'https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived' },
                    { label: 'Instagram Graph API', url: 'https://developers.facebook.com/docs/instagram-api' }
                ]
            },
            {
                title: 'Obter Instagram Business Account ID',
                description: 'Descubra o ID numérico da sua conta Business.',
                substeps: [
                    'Ainda no Graph API Explorer, cole o token gerado',
                    'Na consulta, digite: <code>me/accounts</code>',
                    'Encontre sua Página do Facebook e copie o <strong>ID</strong>',
                    'Faça nova consulta: <code>{PAGE_ID}?fields=instagram_business_account</code>',
                    'Copie o <strong>instagram_business_account > id</strong> (ex: 17841400000000000)'
                ],
                important: 'Este ID é diferente do @ do Instagram. É um número longo.'
            },
            {
                title: 'Conectar na VERA',
                description: 'Configure a integração na plataforma.',
                substeps: [
                    'Na VERA: <strong>Configurações → Integrações → Instagram</strong>',
                    'Cole o <strong>Access Token</strong> (token de longa duração)',
                    'Cole o <strong>Instagram Business Account ID</strong>',
                    'Clique <strong>"Salvar Integração"</strong>',
                    'Status mudará para <strong>🟢 CONECTADO</strong>'
                ]
            }
        ],

        telegram: [
            {
                title: 'Criar Bot via @BotFather',
                description: 'O BotFather é o bot oficial do Telegram para criar bots.',
                substeps: [
                    'No Telegram, procure por <strong>@BotFather</strong>',
                    'Envie <code>/newbot</code>',
                    'Escolha um <strong>nome</strong> (ex: "VERA Marketing Bot")',
                    'Escolha um <strong>username</strong> terminando em "bot" (ex: veramarketingbot)',
                    'O BotFather enviará um <strong>Token</strong>. Exemplo:<br><code>123456789:ABCdefGHIjklMNOpqrsTUVwxyz...</code>',
                    '⚠️ Guarde este token. Você não conseguirá vê-lo novamente!'
                ],
                links: [
                    { label: 'Telegram Bot API', url: 'https://core.telegram.org/bots/api' }
                ]
            },
            {
                title: 'Configurar Permissões do Bot',
                description: 'Ajuste configurações para permitir leitura de mensagens.',
                substeps: [
                    'No chat com @BotFather, envie <code>/mybots</code>',
                    'Selecione seu bot',
                    '<strong>Bot Settings → Group Privacy</strong>',
                    '<strong>Disable</strong> (para que o bot leia mensagens nos grupos)',
                    'Salve as alterações'
                ],
                important: 'Se o "Group Privacy" estiver ativo, o bot não verá mensagens de membros.'
            },
            {
                title: 'Adicionar Bot ao Canal/Grupo',
                description: 'Dê permissões administrativas ao bot.',
                substeps: [
                    'Vá no seu <strong>Canal</strong> ou <strong>Grupo</strong>',
                    '<strong>Gerenciar Canal → Administradores → Adicionar Administrador</strong>',
                    'Procure pelo username do bot (ex: @veramarketingbot)',
                    'Conceda permissões:<br>✅ Postar mensagens<br>✅ Editar mensagens<br>✅ Deletar mensagens'
                ]
            },
            {
                title: 'Obter Chat ID (Opcional)',
                description: 'Para envio automático em canal específico.',
                substeps: [
                    'Adicione o bot <strong>@getidsbot</strong> ao seu canal/grupo',
                    'Ele enviará automaticamente o <strong>Chat ID</strong>',
                    'Exemplo: <code>-1001234567890</code>',
                    'Anote este número (é negativo para canais/grupos)'
                ]
            },
            {
                title: 'Conectar na VERA',
                description: 'Configure o bot na plataforma.',
                substeps: [
                    'Na VERA: <strong>Configurações → Integrações → Telegram</strong>',
                    'Cole o <strong>Bot Token</strong>',
                    '(Opcional) Cole o <strong>Chat ID</strong> para publicações automáticas',
                    'Clique <strong>"Salvar Integração"</strong>',
                    'A VERA enviará uma mensagem de teste. Verifique se chegou!'
                ]
            }
        ],

        x: [
            {
                title: 'Criar Conta de Desenvolvedor',
                description: 'Solicite acesso à API do X (Twitter).',
                substeps: [
                    'Acesse <a href="https://developer.twitter.com" target="_blank">developer.twitter.com</a>',
                    'Clique <strong>"Apply for a developer account"</strong>',
                    'Escolha <strong>"Hobbyist" ou "Professional"</strong>',
                    'Preencha o questionário sobre como usará a API',
                    'Aguarde aprovação (pode levar 1-2 dias)'
                ],
                important: 'A API v2 do X é PAGA. Plano básico: $100/mês.',
                links: [
                    { label: 'X Developer Portal', url: 'https://developer.twitter.com/en/portal/dashboard' }
                ]
            },
            {
                title: 'Criar Aplicação',
                description: 'Gere suas credenciais de API.',
                substeps: [
                    'No Developer Portal: <strong>Projects & Apps → Create App</strong>',
                    'Nome: VERA Integration',
                    'Copie as chaves geradas:<br>- <strong>API Key</strong><br>- <strong>API Secret Key</strong><br>- <strong>Bearer Token</strong>'
                ]
            },
            {
                title: 'Gerar Access Tokens',
                description: 'Crie tokens de acesso para sua conta.',
                substeps: [
                    'Na aplicação: <strong>Keys and Tokens</strong>',
                    '<strong>Generate Access Token and Secret</strong>',
                    'Copie:<br>- <strong>Access Token</strong><br>- <strong>Access Token Secret</strong>',
                    '⚠️ Guarde em local seguro!'
                ]
            },
            {
                title: 'Conectar na VERA',
                description: 'Configure a integração.',
                substeps: [
                    'Na VERA: <strong>Configurações → Integrações → X (Twitter)</strong>',
                    'Cole as 4 credenciais',
                    'Clique <strong>"Salvar Integração"</strong>'
                ]
            }
        ],

        linkedin: [
            {
                title: 'Criar Aplicação',
                description: 'Obtenha credenciais via Microsoft.',
                substeps: [
                    'Acesse <a href="https://www.linkedin.com/developers/apps" target="_blank">linkedin.com/developers/apps</a>',
                    '<strong>Create App</strong>',
                    'Preencha nome, LinkedIn Page (obrigatório), logo',
                    'Anote <strong>Client ID</strong> e <strong>Client Secret</strong>'
                ],
                links: [
                    { label: 'LinkedIn API Docs', url: 'https://docs.microsoft.com/en-us/linkedin/' }
                ]
            },
            {
                title: 'Configurar Produtos',
                description: 'Ative as APIs necessárias.',
                substeps: [
                    'Na aplicação: <strong>Products</strong>',
                    'Request access para:<br>- <strong>Share on LinkedIn</strong><br>- <strong>Marketing Developer Platform</strong>',
                    'Aguarde aprovação (1-2 dias úteis)'
                ]
            },
            {
                title: 'Conectar na VERA',
                description: 'Autorize via OAuth.',
                substeps: [
                    'Na VERA: <strong>Configurações → Integrações → LinkedIn</strong>',
                    'Clique <strong>"Conectar com LinkedIn"</strong>',
                    'Faça login e autorize as permissões',
                    'Selecione a Organization/Page'
                ]
            }
        ],

        tiktok: [
            {
                title: 'Criar TikTok for Business',
                description: 'Configure conta empresarial.',
                substeps: [
                    'Acesse <a href="https://business.tiktok.com" target="_blank">business.tiktok.com</a>',
                    '<strong>Sign Up</strong> com email empresarial',
                    'Escolha <strong>"I\'m a Business"</strong>',
                    'Complete perfil da empresa'
                ],
                links: [
                    { label: 'TikTok for Developers', url: 'https://developers.tiktok.com/' }
                ]
            },
            {
                title: 'Criar Aplicação',
                description: 'Gere Client Key e Secret.',
                substeps: [
                    'Acesse <a href="https://developers.tiktok.com/apps/" target="_blank">developers.tiktok.com/apps/</a>',
                    '<strong>Create App</strong>',
                    'Nome: VERA Integration',
                    'Copie <strong>Client Key</strong> e <strong>Client Secret</strong>'
                ]
            },
            {
                title: 'Conectar na VERA',
                description: 'Configure a integração.',
                substeps: [
                    'Na VERA: <strong>Configurações → Integrações → TikTok</strong>',
                    'Cole Client Key e Client Secret',
                    '<strong>"Salvar Integração"</strong>'
                ]
            }
        ],

        woocommerce: [
            {
                title: 'Instalar WooCommerce',
                description: 'Configure o plugin no WordPress.',
                substeps: [
                    'No admin WordPress: <strong>Plugins → Adicionar Novo</strong>',
                    'Procure por <strong>"WooCommerce"</strong>',
                    '<strong>Instalar</strong> e <strong>Ativar</strong>',
                    'Complete o setup wizard'
                ],
                important: '🔴 Recurso disponível apenas no plano GROWTH ou superior.'
            },
            {
                title: 'Gerar Chaves de API',
                description: 'Crie credenciais REST API.',
                substeps: [
                    '<strong>WooCommerce → Configurações → Avançado → REST API</strong>',
                    '<strong>Adicionar chave</strong>',
                    'Descrição: VERA Integration',
                    'Usuário: selecione admin',
                    'Permissões: <strong>Leitura/Gravação</strong>',
                    'Copie:<br>- <strong>Consumer Key</strong><br>- <strong>Consumer Secret</strong>'
                ]
            },
            {
                title: 'Conectar na VERA',
                description: 'Configure a integração.',
                substeps: [
                    'Na VERA: <strong>Configurações → Integrações → WooCommerce</strong>',
                    'Cole URL da loja (ex: https://minhaloja.com.br)',
                    'Cole Consumer Key e Consumer Secret',
                    '<strong>"Salvar Integração"</strong>'
                ]
            }
        ],

        nuvemshop: [
            {
                title: 'Criar Loja Nuvemshop',
                description: 'Configure sua loja online.',
                substeps: [
                    'Acesse <a href="https://www.nuvemshop.com.br" target="_blank">nuvemshop.com.br</a>',
                    '<strong>Criar loja grátis</strong>',
                    'Complete cadastro',
                    'Escolha plano (após teste grátis)'
                ],
                important: '🔴 Recurso disponível apenas no plano GROWTH ou superior.'
            },
            {
                title: 'Criar Aplicação',
                description: 'Gere credenciais de API.',
                substeps: [
                    'Acesse <a href="https://partners.nuvemshop.com.br" target="_blank">partners.nuvemshop.com.br</a>',
                    '<strong>Criar App</strong>',
                    'Nome: VERA Integration',
                    'URL de redirecionamento: https://app.veramkt.com.br/api/nuvemshop/callback',
                    'Copie <strong>App ID</strong> e <strong>App Secret</strong>'
                ],
                links: [
                    { label: 'Nuvemshop API', url: 'https://dev.nuvemshop.com.br' }
                ]
            },
            {
                title: 'Conectar na VERA',
                description: 'Configure a integração.',
                substeps: [
                    'Na VERA: <strong>Configurações → Integrações → Nuvemshop</strong>',
                    'Cole App ID e App Secret',
                    '<strong>"Conectar com Nuvemshop"</strong>',
                    'Autorize o acesso na popup'
                ]
            }
        ]

        // Adicionar outros tutoriais (linkedin, tiktok, telegram, etc)
    };

    return tutorials[platformId] || [];
}

export default GuiaIntegracoes;
