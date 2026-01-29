/**
 * VERA Credits Pricing V2 - USD Based (Claude API)
 *
 * Conversion: 1 USD = 100 VC (VERACredits)
 *
 * Cost Structure:
 * - Claude Sonnet 4: $3/M input, $15/M output
 * - Average task: ~500 input + ~1000 output tokens
 * - Base cost: ~$0.0165 per task
 * - With optimizations: ~$0.005-0.010 per task
 *
 * Margin Strategy:
 * - Target: 60-70% gross margin
 * - Cache hits: 90% discount (customer loves it)
 * - Volume discounts built into plans
 */

export const CreditPricingV2 = {
    // ==============================================
    // AI CONTENT GENERATION (Claude Powered)
    // ==============================================

    // Copy/Text Generation
    // Cost: $0.005-0.010 -> Charge: 1-2 VC ($0.01-0.02) -> Margin: 50-75%
    'ai_text_short': 1,              // < 200 tokens (tweets, captions)
    'ai_text_medium': 2,             // 200-1000 tokens (posts, emails)
    'ai_text_long': 5,               // 1000-3000 tokens (articles, blogs)
    'ai_creative_writing': 8,        // High creativity (scripts, stories)
    'ai_strategy': 10,               // Strategic thinking (blueprints, plans)
    'ai_code_generation': 12,        // Technical precision (scripts, APIs)

    // Design (Still using Replicate/Grok)
    // Cost: $0.04/img -> Charge: 10 VC ($0.10) -> Margin: 60%
    'design_social_post': 10,
    'design_story': 8,
    'design_thumbnail': 8,
    'design_banner': 12,
    'design_logo_concept': 25,

    // Video
    // Cost: $0.01/sec -> Charge: 120 VC ($1.20/10sec) -> Margin: ~88%
    'video_creation_short': 120,     // 10-30 seconds
    'video_script': 8,
    'video_avatar': 150,             // SadTalker (premium)

    // Audio
    // Cost: ElevenLabs ~$0.008/char -> Charge: 15 base + var -> Margin 50%
    'audio_transcription': 2,        // Whisper (cheap)
    'audio_synthesis_short': 15,     // < 500 chars
    'audio_synthesis_long': 30,      // > 500 chars
    'elevenlabs_setup': 40,          // One-time config

    // ==============================================
    // PUBLISHING & DISTRIBUTION
    // ==============================================

    // Social Media (API Costs + Value)
    'instagram_post': 12,
    'instagram_story': 10,
    'instagram_reel': 15,
    'instagram_dm_reply': 2,

    'linkedin_post': 20,             // B2B premium
    'linkedin_article': 35,

    'twitter_post': 8,
    'twitter_thread': 15,

    'tiktok_post': 12,

    'facebook_post': 10,
    'facebook_story': 8,

    // Messaging (Session Costs)
    'whatsapp_message': 15,          // Per message sent
    'whatsapp_broadcast': 40,        // Per 10 recipients
    'telegram_message': 1,           // Free API

    // Email
    'email_send': 2,                 // Via SMTP
    'email_sequence': 10,            // 3-5 email sequence

    // ==============================================
    // INTELLIGENCE & ANALYSIS
    // ==============================================

    // Market Intelligence
    'market_trends_scan': 20,        // Daily scan
    'market_trends_report': 30,      // Full report with insights
    'competitor_analysis': 40,       // Deep dive single competitor
    'competitor_tracking': 15,       // Ongoing monitoring

    // Performance
    'ad_sync': 4,                    // Sync metrics from platform
    'ad_optimization': 8,            // Auto-optimize running campaign
    'performance_report': 12,        // Weekly/monthly report

    // Finance
    'finance_audit': 12,             // Cost analysis
    'roi_calculator': 5,             // ROI projection

    // ==============================================
    // CRM & LEADS
    // ==============================================

    'lead_enrichment': 5,            // Enrich single lead
    'lead_qualification': 3,         // BANT scoring
    'lead_nurture_sequence': 15,    // Automated follow-up
    'crm_sync': 2,                   // Per sync action

    // ==============================================
    // AUTOMATION & WORKFLOWS
    // ==============================================

    'workflow_execution': 5,         // Per workflow run
    'scheduled_task': 1,             // Per scheduled execution
    'webhook_trigger': 1,            // Per webhook received

} as const;

export type PricingActionV2 = keyof typeof CreditPricingV2;

/**
 * Pacotes de Créditos (USD Pricing)
 */
export const CreditPackages = {
    starter: {
        credits: 100,                // 100 VC
        priceUSD: 0,                 // FREE (Freemium)
        bonusCredits: 0,
        features: [
            '100 VERACredits (grátis)',
            '~10-50 tarefas de IA',
            '3 agentes básicos',
            'Suporte comunidade'
        ]
    },
    growth: {
        credits: 500,                // 500 VC
        priceUSD: 3.99,              // $3.99/mês
        bonusCredits: 50,            // 10% bonus
        features: [
            '550 VERACredits',
            '~50-200 tarefas de IA',
            '10 agentes completos',
            'Cache inteligente (economia 90%)',
            'Suporte prioritário'
        ]
    },
    pro: {
        credits: 2000,               // 2000 VC
        priceUSD: 14.99,             // $14.99/mês
        bonusCredits: 300,           // 15% bonus
        features: [
            '2300 VERACredits',
            '~200-800 tarefas de IA',
            'Todos os 23 agentes',
            'Autopilot (otimização 24/7)',
            'Analytics avançado',
            'Suporte premium'
        ]
    },
    business: {
        credits: 10000,              // 10k VC
        priceUSD: 69.99,             // $69.99/mês
        bonusCredits: 2000,          // 20% bonus
        features: [
            '12000 VERACredits',
            'Tarefas ilimitadas',
            'API dedicada',
            'Múltiplas marcas',
            'White-label',
            'Gerente de conta',
            'SLA 99.9%'
        ]
    },
    enterprise: {
        credits: 0,                  // Custom
        priceUSD: 0,                 // Custom pricing
        bonusCredits: 0,
        features: [
            'Créditos customizados',
            'Infraestrutura dedicada',
            'Treinamento on-site',
            'Integração personalizada',
            'Suporte 24/7',
            'Compliance avançado'
        ]
    }
};

/**
 * Calculadora de ROI
 */
export class PricingCalculator {
    /**
     * Calcula quantas tasks um plano suporta
     */
    static calculateTaskCapacity(credits: number, taskType: 'simple' | 'medium' | 'complex'): number {
        const avgCosts = {
            simple: 2,      // Tweets, captions
            medium: 10,     // Posts, emails
            complex: 30     // Articles, campaigns
        };

        return Math.floor(credits / avgCosts[taskType]);
    }

    /**
     * Calcula economia com cache
     */
    static calculateCacheSavings(credits: number, cacheHitRate: number): number {
        // Cache saves 90% of cost
        const savings = credits * cacheHitRate * 0.9;
        return Math.floor(savings);
    }

    /**
     * Compara VERA vs Agência Tradicional
     */
    static compareWithTraditional(monthlyTasks: number): {
        veraCredits: number;
        veraCostUSD: number;
        agencyCostUSD: number;
        savings: number;
        savingsPercent: number;
    } {
        // VERA: ~10 VC por tarefa média
        const veraCredits = monthlyTasks * 10;
        const veraCostUSD = veraCredits / 100; // 1 USD = 100 VC

        // Agência tradicional: $50-100 por tarefa
        const agencyCostUSD = monthlyTasks * 75; // Média $75/tarefa

        const savings = agencyCostUSD - veraCostUSD;
        const savingsPercent = (savings / agencyCostUSD) * 100;

        return {
            veraCredits,
            veraCostUSD,
            agencyCostUSD,
            savings,
            savingsPercent
        };
    }

    /**
     * Calcula CAC (Customer Acquisition Cost)
     */
    static calculateCAC(
        marketingSpend: number,
        newCustomers: number
    ): number {
        return marketingSpend / newCustomers;
    }

    /**
     * Calcula LTV (Lifetime Value)
     */
    static calculateLTV(
        avgMonthlyRevenue: number,
        avgLifetimeMonths: number,
        grossMargin: number = 0.65
    ): number {
        return avgMonthlyRevenue * avgLifetimeMonths * grossMargin;
    }

    /**
     * Calcula MRR (Monthly Recurring Revenue)
     */
    static calculateMRR(customers: Record<string, number>): number {
        return Object.entries(customers).reduce((mrr, [plan, count]) => {
            const prices: Record<string, number> = {
                starter: 0,
                growth: 3.99,
                pro: 14.99,
                business: 69.99
            };

            return mrr + (prices[plan] || 0) * count;
        }, 0);
    }

    /**
     * Projeção de crescimento
     */
    static projectGrowth(
        currentMRR: number,
        monthlyGrowthRate: number,
        months: number
    ): Array<{ month: number; mrr: number; arr: number }> {
        const projection = [];

        for (let month = 1; month <= months; month++) {
            const mrr = currentMRR * Math.pow(1 + monthlyGrowthRate, month);
            const arr = mrr * 12;

            projection.push({ month, mrr, arr });
        }

        return projection;
    }
}

/**
 * Exemplo de uso
 */
export const PricingExamples = {
    // Exemplo 1: Pequena Empresa
    smallBusiness: {
        plan: 'growth',
        monthlyTasks: 50,
        result: PricingCalculator.compareWithTraditional(50)
        // VERA: $5 vs Agência: $3,750 = $3,745 savings (99.8%)
    },

    // Exemplo 2: Startup em Crescimento
    growingStartup: {
        plan: 'pro',
        monthlyTasks: 200,
        result: PricingCalculator.compareWithTraditional(200)
        // VERA: $20 vs Agência: $15,000 = $14,980 savings (99.8%)
    },

    // Exemplo 3: Empresa Estabelecida
    establishedCompany: {
        plan: 'business',
        monthlyTasks: 800,
        result: PricingCalculator.compareWithTraditional(800)
        // VERA: $80 vs Agência: $60,000 = $59,920 savings (99.8%)
    }
};

export default CreditPricingV2;
