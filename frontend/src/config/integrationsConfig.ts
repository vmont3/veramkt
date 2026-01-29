// Integration data configuration with detailed fields per platform

export const integrationsData = [
    {
        category: "📱 Redes Sociais & Comunidade",
        items: [
            {
                title: "Instagram",
                icon: "Instagram",
                color: "bg-pink-600",
                desc: "Posts e Stories automáticos.",
                fields: [
                    { label: "Access Token", name: "accessToken", type: "password", placeholder: "EAAxxxxxxxxxxxxx...", helper: "Token de longa duração do Facebook" },
                    { label: "Instagram Business Account ID", name: "accountId", type: "text", placeholder: "17841400000000000" }
                ]
            },
            {
                title: "Facebook",
                icon: "Facebook",
                color: "bg-blue-600",
                desc: "Gestão de Página.",
                fields: [
                    { label: "Page Access Token", name: "accessToken", type: "password", placeholder: "EAAxxxxxxxxxxxxx..." },
                    { label: "Page ID", name: "pageId", type: "text", placeholder: "1234567890" }
                ]
            },
            {
                title: "Telegram",
                icon: "Send",
                color: "bg-cyan-500",
                desc: "Bot para Canais.",
                fields: [
                    { label: "Bot Token", name: "botToken", type: "password", placeholder: "123456789:ABCdef...", helper: "Obtido via @BotFather" },
                    { label: "Chat ID (Opcional)", name: "chatId", type: "text", placeholder: "-1001234567890" }
                ]
            },
            {
                title: "TikTok",
                icon: "Video",
                color: "bg-black border border-gray-700",
                desc: "Vídeos curtos.",
                fields: [
                    { label: "Client Key", name: "clientKey", type: "password", placeholder: "aw1xxxxxxxxx" },
                    { label: "Client Secret", name: "clientSecret", type: "password", placeholder: "xxxxxxxxx" }
                ]
            },
            {
                title: "LinkedIn",
                icon: "Linkedin",
                color: "bg-blue-700",
                desc: "B2B Authority.",
                fields: [
                    { label: "Access Token", name: "accessToken", type: "password", placeholder: "AQVxxxxxxxxxx" },
                    { label: "Organization ID", name: "orgId", type: "text", placeholder: "12345678" }
                ]
            },
            {
                title: "YouTube",
                icon: "Youtube",
                color: "bg-red-600",
                desc: "Long-form video.",
                fields: [
                    { label: "API Key", name: "apiKey", type: "password", placeholder: "AIzaSyXXXXXXXXXX" },
                    { label: "Channel ID", name: "channelId", type: "text", placeholder: "UCxxxxxxxxxxxxxx" }
                ]
            },
            {
                title: "X / Twitter",
                icon: "Twitter",
                color: "bg-gray-800",
                desc: "Real-time updates.",
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
        category: "💰 Tráfego Pago (Ads)",
        items: [
            {
                title: "Meta Ads",
                icon: "DollarSign",
                color: "bg-blue-500",
                desc: "Facebook & Instagram Ads.",
                fields: [
                    { label: "Business Manager ID", name: "businessId", type: "text", placeholder: "123456789012345" },
                    { label: "Ad Account ID", name: "adAccountId", type: "text", placeholder: "act_1234567890", helper: "Deve começar com 'act_'" },
                    { label: "Pixel ID (Opcional)", name: "pixelId", type: "text", placeholder: "9876543210987654" },
                    { label: "Access Token", name: "accessToken", type: "password", placeholder: "EAAxxxxxxxxxxxxx...", helper: "System User Token" }
                ]
            },
            {
                title: "Google Ads",
                icon: "Search",
                color: "bg-yellow-500",
                desc: "Search & Display.",
                fields: [
                    { label: "Customer ID", name: "customerId", type: "text", placeholder: "123-456-7890" },
                    { label: "Developer Token", name: "developerToken", type: "password", placeholder: "xxxxxxxxxxxxxxxx" },
                    { label: "OAuth Refresh Token", name: "refreshToken", type: "password", placeholder: "1//xxxxxxxxxxxxx" }
                ]
            },
            {
                title: "TikTok Ads",
                icon: "Video",
                color: "bg-black border border-white/20",
                desc: "Viral Ads.",
                fields: [
                    { label: "Advertiser ID", name: "advertiserId", type: "text", placeholder: "7000000000000000" },
                    { label: "Access Token", name: "accessToken", type: "password", placeholder: "xxxxxxxxxxxxxxxxx" }
                ]
            },
            {
                title: "LinkedIn Ads",
                icon: "Linkedin",
                color: "bg-blue-800",
                desc: "B2B Ads.",
                fields: [
                    { label: "Ad Account ID", name: "adAccountId", type: "text", placeholder: "123456789" },
                    { label: "Access Token", name: "accessToken", type: "password", placeholder: "AQVxxxxxxxxxx" }
                ]
            }
        ]
    },
    {
        category: "📧 Comunicação & CRM",
        items: [
            {
                title: "WhatsApp API",
                icon: "Smartphone",
                color: "bg-green-500",
                desc: "Mensagens 1:1.",
                fields: [
                    { label: "Phone Number ID", name: "phoneNumberId", type: "text", placeholder: "123456789012345" },
                    { label: "Business Account ID", name: "businessAccountId", type: "text", placeholder: "987654321098765" },
                    { label: "Access Token", name: "accessToken", type: "password", placeholder: "EAAxxxxxxxxxxxxx..." }
                ]
            },
            {
                title: "Email (SMTP)",
                icon: "Mail",
                color: "bg-gray-500",
                desc: "Email marketing.",
                fields: [
                    { label: "SMTP Host", name: "smtpHost", type: "text", placeholder: "smtp.gmail.com" },
                    { label: "SMTP Port", name: "smtpPort", type: "text", placeholder: "587" },
                    { label: "SMTP User", name: "smtpUser", type: "text", placeholder: "seu@email.com" },
                    { label: "SMTP Password", name: "smtpPassword", type: "password", placeholder: "••••••••" }
                ]
            }
        ]
    }
];
