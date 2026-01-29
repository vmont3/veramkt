/**
 * Head Guardião do Dinheiro (Paid Media Governor)
 * Responsável pela Regra de Ouro: "Nenhum real é investido sem passar por mim"
 */
import { fallbackController, FailureType } from "./FallbackController";

export interface CampaignMetrics {
    cpa: number;        // Cost Per Action
    roas: number;       // Return on Ad Spend
    ctr: number;        // Click Through Rate
    cpm: number;        // Cost Per Mille
    frequency: number;  // Ad Frequency
    spend: number;      // Total Spend
    budget: number;     // Total Budget
}

export interface GuardVerdict {
    approved: boolean;
    action: 'APPROVE' | 'PAUSE' | 'OPTIMIZE' | 'SCALE';
    reason: string;
    adjustmentFactor?: number; // Para escala ou redução de bid
}

export class FinanceGuardAgent {
    private agentId = "head_guardiao";

    // Limites de Segurança (Hard Limits) - Definidos no briefing
    private readonly MAX_CPA = 50.0;
    private readonly MIN_ROAS = 2.0;
    private readonly MIN_CTR = 0.8; // 0.8%
    private readonly MAX_FREQ = 4.0;

    /**
     * Avalia se uma campanha deve continuar rodando ou ser travada
     * Ponto de decisão autônomo.
     */
    public async evaluateCampaign(metrics: CampaignMetrics): Promise<GuardVerdict> {
        console.log(`[FinanceGuard] Avaliando métricas: CPA R$${metrics.cpa}, ROAS ${metrics.roas}x`);

        // 1. CHECAGEM DE SEGURANÇA IMEDIATA (STOP LOSS)
        if (metrics.cpa > this.MAX_CPA) {
            await this.triggerEmergencyStop(metrics, `CPA R$${metrics.cpa} excedeu o teto de R$${this.MAX_CPA}`);
            return {
                approved: false,
                action: 'PAUSE',
                reason: `CPA CRÍTICO: R$${metrics.cpa} > R$${this.MAX_CPA}`
            };
        }

        if (metrics.roas < this.MIN_ROAS && metrics.spend > 100) { // Só avalia ROAS após gasto mínimo
            await this.triggerEmergencyStop(metrics, `ROAS ${metrics.roas}x abaixo do mínimo de ${this.MIN_ROAS}x`);
            return {
                approved: false,
                action: 'PAUSE',
                reason: `ROAS INSUFICIENTE: ${metrics.roas}x`
            };
        }

        // 2. CHECAGEM DE OTIMIZAÇÃO
        if (metrics.ctr < this.MIN_CTR) {
            return {
                approved: true, // Ainda roda, mas pede otimização
                action: 'OPTIMIZE',
                reason: `Criativo fadigado. CTR ${metrics.ctr}% abaixo do padrão.`,
                adjustmentFactor: 0.8 // Reduz bid em 20%
            };
        }

        if (metrics.frequency > this.MAX_FREQ) {
            return {
                approved: true,
                action: 'OPTIMIZE',
                reason: `Frequência alta (${metrics.frequency}). Nível de saturação atingido.`,
                adjustmentFactor: 0.7
            };
        }

        // 3. ESTRATÉGIA DE ESCALA (Métricas Excelentes)
        if (metrics.roas > (this.MIN_ROAS * 1.5) && metrics.cpa < (this.MAX_CPA * 0.7)) {
            return {
                approved: true,
                action: 'SCALE',
                reason: `Campanha Unicórnio detectada! ROAS ${metrics.roas}x`,
                adjustmentFactor: 1.2 // Aumenta budget em 20%
            };
        }

        // 4. APROVAÇÃO PADRÃO
        return {
            approved: true,
            action: 'APPROVE',
            reason: "Métricas dentro da zona de estabilidade.",
            adjustmentFactor: 1.0
        };
    }

    /**
     * Aciona o Fallback Controller com Tipo D (Financeiro)
     */
    private async triggerEmergencyStop(metrics: CampaignMetrics, reason: string): Promise<void> {
        console.error(`🚨 [FinanceGuard] STOP LOSS ACIONADO: ${reason}`);

        // Aciona o Fallback Controller para tratar o risco financeiro
        await fallbackController.handleFailure(FailureType.FINANCIAL, {
            metrics,
            reason,
            timestamp: new Date()
        });
    }
}

export const financeGuard = new FinanceGuardAgent();
