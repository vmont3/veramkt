/**
 * STRATEGY AGENT (Head de Estratégia / CMO)
 * Domain: strategy
 * Expertise: Frameworks, OKRs, Posicionamento, Análise de Mercado
 */

import { BaseAgent, UserContext, ContentOutput } from './BaseAgent';

export interface StrategyBrief {
    objective: string;
    targetAudience?: string;
    budget?: number;
    platforms?: string[];
    timeline?: string;
}

export interface StrategyOutput {
    strategy: {
        positioning: string;
        northStarMetric: string;
        okrs: Array<{ objective: string; keyResults: string[] }>;
        channels: Array<{ platform: string; reason: string; budget: number }>;
    };
    validated: ContentOutput;
}

export class StrategyAgentMigrated extends BaseAgent {
    constructor() {
        super('head-strategy', 'Head de Estratégia', 'strategy');
    }

    public async execute(userId: string, brief: StrategyBrief): Promise<StrategyOutput> {
        console.log(`[${this.agentName}] 🎯 Executando análise estratégica...`);

        // 1. Fetch contexto do usuário
        const context = await this.fetchUserContext(userId);

        // 2. Build prompt especializado
        const prompt = this.buildPrompt(context, `
OBJETIVO: ${brief.objective}
PÚBLICO: ${brief.targetAudience || 'A definir'}
ORÇAMENTO: ${brief.budget ? `R$ ${brief.budget}` : 'Flexível'}
PRAZO: ${brief.timeline || '90 dias'}

TAREFA:
Crie uma estratégia de marketing completa incluindo:
1. Posicionamento da marca
2. North Star Metric (métrica única mais importante)
3. 3 OKRs com Key Results mensuráveis
4. Recomendação de canais (com budget allocation)
5. Plano de execução em fases

IMPORTANTE:
- Use frameworks reconhecidos (SMART, Porter, SWOT)
- Seja ESPECÍFICO (números, não generalidades)
- Priorize GUIDELINES DA MARCA acima de tudo
        `);

        // 3. Gerar estratégia (simulado - será substituído por Claude API)
        const rawStrategy = this.generateStrategy(brief, context);

        // 4. 🎯 VALIDAR E HUMANIZAR
        const validated = await this.validateAndHumanize(
            JSON.stringify(rawStrategy, null, 2),
            userId,
            {
                enforceMinScore: 75,
                addInterjections: false,  // Estratégia é mais formal
                addImperfections: false,
                probability: 0.05
            }
        );

        console.log(`[${this.agentName}] ✅ Estratégia criada. Score: ${validated.validation.score}/100`);

        return {
            strategy: rawStrategy,
            validated
        };
    }

    private generateStrategy(brief: StrategyBrief, context: UserContext): any {
        const brandName = context.brand?.name || 'Sua Marca';
        const tone = context.guidelines?.tone || 'Profissional';

        return {
            positioning: `${brandName} se posiciona como líder em ${brief.objective.toLowerCase()}, diferenciando-se pela ${tone.toLowerCase()} abordagem e foco em resultados mensuráveis.`,
            northStarMetric: this.getNorthStarMetric(brief.objective),
            okrs: [
                {
                    objective: `Estabelecer ${brandName} como autoridade`,
                    keyResults: [
                        'Alcançar 10.000 seguidores orgânicos em 90 dias',
                        'Publicar 1 estudo de caso por semana',
                        'Obter 50 menções de influenciadores do setor'
                    ]
                },
                {
                    objective: `Maximizar conversão de leads`,
                    keyResults: [
                        'CVR de 5% em landing pages',
                        'Reduzir CAC em 30%',
                        'Aumentar LTV em 40%'
                    ]
                },
                {
                    objective: `Otimizar ROI de mídia paga`,
                    keyResults: [
                        'ROAS mínimo de 4:1',
                        'CTR acima de 2.5%',
                        'CPC abaixo de R$ 1,50'
                    ]
                }
            ],
            channels: this.recommendChannels(brief)
        };
    }

    private getNorthStarMetric(objective: string): string {
        const lower = objective.toLowerCase();
        if (lower.includes('lead')) return 'Número de Leads Qualificados (SQL)';
        if (lower.includes('awareness')) return 'Alcance Orgânico Mensal';
        if (lower.includes('vendas')) return 'MRR (Monthly Recurring Revenue)';
        return 'Crescimento de Usuários Ativos (MAU)';
    }

    private recommendChannels(brief: StrategyBrief): Array<{ platform: string; reason: string; budget: number }> {
        const totalBudget = brief.budget || 5000;
        return [
            {
                platform: 'Meta Ads (Facebook + Instagram)',
                reason: 'Maior alcance, ótimo para awareness e conversão',
                budget: totalBudget * 0.40
            },
            {
                platform: 'Google Search Ads',
                reason: 'Alta intenção de compra, conversão direta',
                budget: totalBudget * 0.35
            },
            {
                platform: 'LinkedIn Ads',
                reason: 'Segmentação por cargo e empresa (B2B)',
                budget: totalBudget * 0.25
            }
        ];
    }
}

export const strategyAgentMigrated = new StrategyAgentMigrated();
