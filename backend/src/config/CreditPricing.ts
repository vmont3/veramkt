export const CreditPricing = {
    // --- CORE AI GENERATION (High Margin) ---
    // Cost: ~$0.001/req -> Charge: 1-2 credits (R$0.10-0.20)
    'ai_text_generation': 2,        // Base for any text response
    'ai_creative_writing': 5,       // Blogs, scripts (Long context)
    'ai_code_generation': 10,       // Technical precision

    // Cost: ~$0.04/img -> Charge: 12 credits (R$1.20) -> Margin ~80%
    'design_social_post': 12,
    'design_thumbnail': 8,
    'design_logo_concept': 25,

    // Cost: ~$0.01/sec -> Charge: 150 credits (R$15.00) -> Margin ~90% (Premium feature)
    'video_creation_sadtalker': 150,
    'video_script_generation': 10,

    // Cost: Free (Whispter/Gemini) -> Charge: 3 credits -> Pure Profit
    'audio_transcription': 3,
    // Cost: ElevenLabs ~$0.01/char -> Charge: 20 base + var -> Margin 50%
    'audio_synthesis': 20,
    'elevenlabs_setup': 50,         // One-time setup per account

    // --- NETWORK ACTIONS (Publishing & Interaction) ---
    // WhatsApp: ~$0.05/msg (Session) -> Charge: 20 credits (R$2.00) -> Margin ~70%
    'whatsapp_send_msg': 20,
    'whatsapp_broadcast': 50,      // Per block of 10 users? (Careful with pricing)

    // Instagram: API Free (mostly) -> Charge for "Connector Value" & Maintenance
    'instagram_publish_post': 15,
    'instagram_publish_story': 12,
    'instagram_reply_dm': 2,        // Automated reply

    // LinkedIn: High B2B Value -> Charge Premium
    'linkedin_publish_post': 25,
    'linkedin_publish_article': 40,

    // Twitter/X: API Costs are High -> Charge accordingly
    'twitter_post': 10,
    'twitter_thread': 20,

    // Telegram: Free API -> Charge for Logic/Bot Hosting
    'telegram_send_msg': 1,         // Token cost mostly

    // --- DATA & INTELLIGENCE ---
    // Scrapers/Proxies cost money
    'market_trends_report': 25,     // Aggregated data
    'competitor_deep_dive': 50,     // Multiple queries
    'finance_audit': 15,            // Database intensity
    'ad_platform_sync': 5,          // Per sync action
} as const;

export type PricingAction = keyof typeof CreditPricing;
