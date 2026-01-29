/**
 * Fallback Controller
 * Responsável por gerenciar os 4 níveis de falhas do sistema (A, B, C, D)
 * Regras baseadas em VERA_ARCHITECTURE_SOP.md
 */

export enum FailureType {
    LOCAL = 'A',           // Correção Local (ex: copy fraca)
    PARTIAL = 'B',         // Falha Sistêmica Parcial (ex: conflito de heads)
    CRITICAL = 'C',        // Falha Crítica (ex: alucinação)
    FINANCIAL = 'D'        // Risco Financeiro (ex: CPA alto)
}

export interface FallbackResult {
    success: boolean;
    actionTaken: string;
    safeResponse?: string;
    shouldRetry: boolean;
    requiresHumanIntervention: boolean;
}

export class FallbackController {

    /**
     * Intercepta e trata erros baseado no seu tipo
     */
    public async handleFailure(type: FailureType, context: any): Promise<FallbackResult> {
        console.log(`[FallbackController] Tratando falha tipo ${type}`);

        switch (type) {
            case FailureType.LOCAL:
                return this.handleLocalFailure(context);
            case FailureType.PARTIAL:
                return this.handlePartialFailure(context);
            case FailureType.CRITICAL:
                return this.handleCriticalFailure(context);
            case FailureType.FINANCIAL:
                return this.handleFinancialFailure(context);
            default:
                return {
                    success: false,
                    actionTaken: "Erro desconhecido",
                    shouldRetry: false,
                    requiresHumanIntervention: true
                };
        }
    }

    /**
     * Nível 1 - Correção Local (Tipo A)
     * Reexecuta apenas o agente defeituoso mantendo o plano original.
     */
    private async handleLocalFailure(context: any): Promise<FallbackResult> {
        return {
            success: true,
            actionTaken: "Retrying specific agent execution",
            shouldRetry: true,
            requiresHumanIntervention: false
        };
    }

    /**
     * Nível 2 - Replanejamento Parcial (Tipo B)
     * Vera pausa, emite plano simplificado e reexecuta validação.
     */
    private async handlePartialFailure(context: any): Promise<FallbackResult> {
        // Verifica ciclos de replanejamento
        if (context.retryCount >= 2) {
            // Escala para Nível 3 se exceder limite
            return this.handleCriticalFailure(context);
        }

        return {
            success: true,
            actionTaken: "Triggering simplified replanning",
            shouldRetry: true,
            requiresHumanIntervention: false
        };
    }

    /**
     * Nível 3 - Contenção Total (Tipo C)
     * Bloqueio imediato e Rollback. Resposta segura ao usuário.
     */
    private async handleCriticalFailure(context: any): Promise<FallbackResult> {
        return {
            success: false,
            actionTaken: "System Rollback & Block",
            safeResponse: "Estamos revisando este conteúdo para garantir precisão e segurança. Avisaremos em instantes.",
            shouldRetry: false,
            requiresHumanIntervention: true
        };
    }

    /**
     * Nível 4 - Proteção Financeira (Tipo D) - GOLDEN RULE
     * STOP LOSS imediato sem aprovação humana.
     */
    private async handleFinancialFailure(context: any): Promise<FallbackResult> {
        console.error("⛔ [STOP LOSS] RISCO FINANCEIRO DETECTADO PELA VERA.");

        // Simulação de parada de campanha
        // await AdPlatform.pauseCampaign(context.campaignId);

        return {
            success: false,
            actionTaken: "IMMEDIATE FINANCIAL FREEZE (STOP LOSS)",
            safeResponse: "Investimento pausado preventivamente para proteção de capital.",
            shouldRetry: false,
            requiresHumanIntervention: true
        };
    }
}

export const fallbackController = new FallbackController();
