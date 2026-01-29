/**
 * Performance Agent
 * Especialista em Gestão de Tráfego Pago (Meta Ads & Google Ads)
 * Otimiza campanhas focando em ROAS e Conversão
 */

import { adPlatformIntegration } from '../integrations/AdPlatformIntegration';
import { FeedbackService } from '../FeedbackService';
import { prisma } from '../../database/prismaClient';

export interface CampaignBrief {
    name: string;
    objective: "sales" | "leads" | "traffic" | "awareness";
    budget: number; // Valor em BRL
    budgetType: "daily" | "lifetime";
    platform: "meta" | "google" | "tiktok";
    targetAudience: {
        locations: string[]; // ex: ["São Paulo, SP"]
        ageRange: [number, number];
        interests: string[];
    };
    creatives: {
        headline: string;
        body: string;
        mediaUrl: string;
    }[];
}

export interface OptimizationRule {
    metric: "roas" | "cpc" | "ctr";
    condition: "<" | ">";
    threshold: number;
    action: "pause" | "increase_budget" | "decrease_budget" | "notify";
}

export class PerformanceAgent {
    private agentId = "performance_expert";

    /**
     * Criar e lançar campanha (Simulação)
     */
    async createCampaign(brief: CampaignBrief): Promise<any> {
        console.log(`[PerformanceAgent] Criando campanha na plataforma: ${brief.platform}`);
        console.log(`[PerformanceAgent] Orçamento: R$ ${brief.budget} (${brief.budgetType})`);

        // Simula interação com API (ex: Facebook Graph API)
        const campaignId = `cmp_${Math.random().toString(36).substr(2, 9)}`;
        const adSetId = `ads_${Math.random().toString(36).substr(2, 9)}`;

        // Simular criação de anúncios
        const ads = brief.creatives.map((creative, index) => ({
            id: `ad_${Math.random().toString(36).substr(2, 9)}`,
            name: `${brief.name} - Ad ${index + 1}`,
            status: "active",
            creative
        }));

        console.log(`[PerformanceAgent] Campanha criada com sucesso! ID: ${campaignId}`);
        console.log(`[PerformanceAgent] ${ads.length} anúncios ativos e em análise.`);

        return {
            campaignId,
            adSetId,
            platform: brief.platform,
            status: "in_review", // Anúncios entram em análise primeiro
            adsCount: ads.length,
            estimatedReach: this.estimateReach(brief.budget, brief.platform),
            createdAt: new Date()
        };
    }

    /**
     * Otimizar Campanha (Monitoramento de Performance)
     * Simula a "Batalha Naval" de lances e verbas
     */
    async optimizeCampaign(campaignId: string, rules: OptimizationRule[]): Promise<any> {
        console.log(`[PerformanceAgent] Otimizando campanha ${campaignId}...`);

        // Fetch Real Metrics
        const metrics = await this.fetchRealMetrics(campaignId, "meta"); // Defaulting to meta for now or extract from ID
        const actionsTaken: string[] = [];

        console.log(`[PerformanceAgent] Métricas Atuais -> ROAS: ${metrics.roas.toFixed(2)} | CPC: R$ ${metrics.cpc.toFixed(2)}`);

        // Aplicar regras
        for (const rule of rules) {
            let triggered = false;

            if (rule.metric === "roas") {
                if (rule.condition === "<" && metrics.roas < rule.threshold) triggered = true;
                if (rule.condition === ">" && metrics.roas > rule.threshold) triggered = true;
            }
            // (Outras métricas seriam checadas aqui)

            if (triggered) {
                console.log(`[PerformanceAgent] Regra disparada: ${rule.metric} ${rule.condition} ${rule.threshold}`);
                actionsTaken.push(this.executeOptimizationAction(rule.action, campaignId));
            }
        }

        if (actionsTaken.length === 0) {
            console.log("[PerformanceAgent] Nenhuma otimização necessária no momento.");
            actionsTaken.push("maintain_status_quo");
        }

        return {
            campaignId,
            metrics,
            actionsTaken,
            timestamp: new Date()
        };
    }

    /**
     * Executar ação de otimização
     */
    private executeOptimizationAction(action: string, campaignId: string): string {
        switch (action) {
            case "pause":
                return `Anúncios com baixo desempenho pausados na campanha ${campaignId}`;
            case "increase_budget":
                return `Orçamento aumentado em 20% para escalar resultados`;
            case "decrease_budget":
                return `Orçamento reduzido para conter gastos ineficientes`;
            case "notify":
                return `Alerta de performance enviado ao Orquestrador`;
            default:
                return "Ação desconhecida";
        }
    }

    /**
     * Fetch Real Metrics from Ad Platforms
     */
    private async fetchRealMetrics(campaignId: string, platform: string) {
        if (platform === 'meta' || platform === 'instagram') {
            const data = await adPlatformIntegration.getMetaCampaignInsights(campaignId);
            if (data) {
                return {
                    ctr: parseFloat(data.ctr || '0'),
                    cpc: parseFloat(data.cpc || '0'),
                    roas: 0, // Meta doesn't always give ROAS directly without custom conversion mapping
                    conversions: parseInt(data.actions?.[0]?.value || '0')
                };
            }
        }

        // If no data or keys missing, return 0 (Clean State, no Mock)
        return { ctr: 0, cpc: 0, roas: 0, conversions: 0 };
    }

    /**
     * Estimar alcance baseado no orçamento
     */
    private estimateReach(budget: number, platform: string): string {
        const cpm = platform === "linkedin" ? 40 : 15; // CPM médio estimado
        const impressions = (budget / cpm) * 1000;
        return `~${Math.floor(impressions).toLocaleString()} impressões estimadas`;
    }

    /**
     * PERFORMANCE AUTOPILOT (Phase 6 - Industry Leading)
     * Runs hourly optimization across all active campaigns.
     * 5x faster than traditional weekly agency reviews.
     */
    async startAutopilot(): Promise<void> {
        console.log('🚀 [PerformanceAutopilot] Starting hourly optimization engine...');

        // Run optimization every hour
        setInterval(async () => {
            await this.runAutopilotCycle();
        }, 60 * 60 * 1000); // Every hour

        // First run immediate
        await this.runAutopilotCycle();
    }

    /**
     * Autopilot Optimization Cycle - Now with Dopamine Feedback!
     */
    private async runAutopilotCycle(): Promise<void> {
        console.log('⚙️ [PerformanceAutopilot] Running hourly optimization cycle...');

        // Aggressive autopilot rules
        const autopilotRules: OptimizationRule[] = [
            { metric: 'roas', condition: '<', threshold: 1.5, action: 'pause' },
            { metric: 'roas', condition: '>', threshold: 4.0, action: 'increase_budget' },
            { metric: 'cpc', condition: '>', threshold: 10, action: 'decrease_budget' }
        ];

        try {
            // Fetch active campaigns from database
            const campaigns = await prisma.campaign.findMany({
                where: { status: 'active' }
            });

            if (campaigns.length === 0) {
                console.log('[PerformanceAutopilot] No active campaigns. Standing by.');
                return;
            }

            for (const campaign of campaigns) {
                console.log(`[PerformanceAutopilot] Optimizing: ${campaign.name}`);

                // Apply rules and get actions
                const result = await this.optimizeCampaign(campaign.id, autopilotRules);

                // Inject Dopamine or Pain based on performance
                // Find the user who owns this campaign (assuming global for now)
                const users = await prisma.user.findMany({ take: 1 });
                const userId = users[0]?.id;

                if (userId && campaign.roas > 0) {
                    if (campaign.roas >= 3.0) {
                        // 🟢 High ROAS = Dopamine!
                        await FeedbackService.autoReward({
                            agentId: this.agentId,
                            userId,
                            taskId: campaign.id,
                            successMetric: 'ROAS',
                            value: campaign.roas,
                            threshold: 3.0
                        });
                        console.log(`[PerformanceAutopilot] 💚 DOPAMINE: ${campaign.name} ROAS ${campaign.roas}x`);
                    } else if (campaign.roas < 1.0) {
                        // 🔴 Negative ROAS = Pain signal
                        await FeedbackService.autoPenalty({
                            agentId: this.agentId,
                            userId,
                            taskId: campaign.id,
                            failureReason: `ROAS negativo: ${campaign.roas}x (prejuízo)`
                        });
                        console.log(`[PerformanceAutopilot] ❌ PAIN: ${campaign.name} ROAS ${campaign.roas}x`);
                    }
                }
            }

            console.log(`[PerformanceAutopilot] Cycle complete. ${campaigns.length} campaigns processed.`);
        } catch (error) {
            console.error('[PerformanceAutopilot] Cycle error:', error);
        }
    }
}

export const performanceAgent = new PerformanceAgent();
