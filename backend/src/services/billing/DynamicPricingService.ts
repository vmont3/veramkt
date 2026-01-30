export class DynamicPricingService {
    private pricingTable: Record<string, any> = {
        'claude': {
            'haiku': { costPer1K: 0.0015, vcPer1K: 1, minCharge: 1 },
            'sonnet': { costPer1K: 0.0180, vcPer1K: 2, minCharge: 2 },
            'opus': { costPer1K: 0.0900, vcPer1K: 9, minCharge: 5 }
        },
        'openai': {
            'gpt-4o': { costPer1K: 0.0200, vcPer1K: 2, minCharge: 2 },
            'gpt-4-turbo': { costPer1K: 0.0400, vcPer1K: 4, minCharge: 3 },
            'dall-e-3': { costPerImage: 0.040, vcPerImage: 4, minCharge: 4 }
        },
        'google': {
            'gemini-flash': { costPer1K: 0.000375, vcPer1K: 0.4, minCharge: 1 },
            'gemini-pro': { costPer1K: 0.0140, vcPer1K: 1.4, minCharge: 2 }
        },
        'xai': {
            'grok-1': { costPer1K: 0.00117, vcPer1K: 1.2, minCharge: 1 }
        }
    };

    calculateVCCost(provider: string, model: string, tokens: number, images: number = 0): number {
        const providerConfig = this.pricingTable[provider];
        if (!providerConfig) return 0;

        const config = providerConfig[model];
        if (!config) return 0;

        let cost = 0;

        // Custo por tokens
        if (config.costPer1K) {
            cost += (tokens / 1000) * config.vcPer1K;
        }

        // Custo por imagens
        if (config.costPerImage && images > 0) {
            cost += images * config.vcPerImage;
        }

        // Garantir margem mínima
        cost = Math.max(cost, config.minCharge || 0);

        return Math.ceil(cost);
    }

    estimateCost(agentType: string, taskComplexity: 'low' | 'medium' | 'high'): number {
        const estimates: Record<string, number> = {
            'low': 1,     // ~150 tokens Haiku
            'medium': 4,  // ~1000 tokens Sonnet/GPT-4o
            'high': 10    // ~2000+ tokens Opus/GPT-4-Turbo
        };
        return estimates[taskComplexity] || 4;
    }
}

export const dynamicPricingService = new DynamicPricingService();
