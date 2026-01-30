// backend/src/services/agents/VeraOrchestrator.ts
import { agentOrchestrator } from '../orchestration/AgentOrchestrator';
import { prisma } from '../../database/prismaClient';

export interface VeraRequest { [key: string]: any; }


export class VeraOrchestrator {
    /**
     * Processa requisições da VERA
     */
    async processRequest(request: VeraRequest): Promise<any> {
        const { type, payload, userId } = request;

        try {
            // 1. Validar requisição
            this.validateRequest(request);

            // 2. Mapear tipo para agente
            const agentType = this.mapRequestToAgent(type, payload);

            // 3. Criar task estruturada
            const task = this.createTask(type, payload);

            // 4. Orquestrar execução
            const result = await agentOrchestrator.orchestrate(
                agentType,
                userId,
                task
            );

            // 5. Notificar usuário (Telegram/Dashboard)
            await this.notifyUser(userId, result);

            // 6. Retornar resposta formatada
            return this.formatResponse(result);

        } catch (error: any) {
            console.error('Erro no VeraOrchestrator:', error);

            // Log do erro
            try {
                await prisma.systemLog.create({
                    data: {
                        type: 'ERROR',
                        source: 'VeraOrchestrator',
                        message: error.message,
                        metadata: { request }
                    }
                });
            } catch (e) {
                // Log table might not exist
            }

            return {
                success: false,
                error: error.message,
                suggestion: this.getErrorSuggestion(error)
            };
        }
    }

    /**
     * Mapeia tipo de requisição para agente
     */
    private mapRequestToAgent(type: string, payload: any): string {
        const mapping: Record<string, string> = {
            // Copywriting
            'CREATE_SOCIAL_POST': 'CopySocialShort',
            'CREATE_LONG_FORM': 'CopySocialLong',
            'CREATE_AD_COPY': 'CopyAdsAgent',
            'CREATE_EMAIL': 'CopyCRMAgent',

            // Estratégia
            'CREATE_STRATEGY': 'StrategyAgent',
            'ANALYZE_MARKET': 'TrendAgent',
            'ANALYZE_COMPETITORS': 'CompetitorAgent',

            // Design
            'CREATE_DESIGN': 'DesignSocialAgent',
            'CREATE_AD_DESIGN': 'DesignAdsAgent',
            'CREATE_LANDING_PAGE': 'DesignLandingAgent',
            'CREATE_VIDEO_SCRIPT': 'VideoScriptAgent',

            // Ads
            'MANAGE_META_ADS': 'MetaAdsManager',
            'MANAGE_GOOGLE_ADS': 'GoogleAdsManager',
            'MANAGE_TIKTOK_ADS': 'TikTokAdsManager',
            'MANAGE_LINKEDIN_ADS': 'LinkedInAdsManager',

            // Análise
            'GENERATE_BI_REPORT': 'BIAgent',
            'ANALYZE_TRENDS': 'TrendAgent',

            // CRM
            'MANAGE_LEADS': 'CloserAgent',
            'CUSTOMER_SUCCESS': 'SuccessAgent',
            'ENRICH_DATA': 'EnricherAgent',

            // Sistema
            'CHAT_SUPPORT': 'ChatAgent',
            'SYSTEM_MONITOR': 'SystemMonitor',
            'CHAT': 'ChatAgent' // Fallback
        };

        const agent = mapping[type];
        if (!agent) {
            // Fallback for direct agent calls or unknown types
            if (type.startsWith('AGENT_')) {
                return type.replace('AGENT_', '');
            }
            return 'ChatAgent';
        }

        return agent;
    }

    /**
     * Cria task estruturada
     */
    private createTask(type: string, payload: any): any {
        return {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            ...payload,
            budget: payload.budget || 'medium',
            priority: payload.priority || 'normal',
            allowRetry: payload.allowRetry !== false,
            createdAt: new Date().toISOString()
        };
    }

    /**
     * Notifica usuário do resultado
     */
    private async notifyUser(userId: string, result: any): Promise<void> {
        if (!result.success) return;

        try {
            // Verificar preferências do usuário
            const preferences = await prisma.userPreferences.findUnique({
                where: { userId },
                select: { notificationMethod: true }
            });

            const notificationMethod = preferences?.notificationMethod || 'telegram';

            switch (notificationMethod) {
                case 'telegram':
                    await this.sendTelegramNotification(userId, result);
                    break;
                case 'email':
                    break;
                case 'dashboard':
                    break;
            }
        } catch (e) {
            // Fail silently or log
        }
    }

    /**
     * Envia notificação via Telegram
     */
    private async sendTelegramNotification(userId: string, result: any): Promise<void> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { telegramChatId: true }
            });

            if (!user?.telegramChatId) return;

            const message = this.formatTelegramMessage(result);

            console.log(`[Telegram para ${userId}]: ${message}`);
            // Integration with TelegramService would go here

        } catch (error) {
            console.error('Erro ao enviar notificação Telegram:', error);
        }
    }

    /**
     * Formata mensagem para Telegram
     */
    private formatTelegramMessage(result: any): string {
        const { metadata, cost, validation } = result;

        return `
🎯 *Tarefa Concluída!*
        
📊 *Agente:* ${metadata.agent}
✅ *Status:* ${result.success ? 'Concluído' : 'Falhou'}
💰 *Custo:* ${cost} VC
🎯 *Qualidade:* ${validation.score}/100
⏱️ *Tempo:* ${metadata.executionTime}ms
${metadata.cached ? '💾 *Cache:* Sim (economia ativada)' : ''}

${validation.passed ? '✅ Aprovado automaticamente!' : '⚠️ Requer revisão'}
        `.trim();
    }

    /**
     * Formata resposta final
     */
    private formatResponse(result: any): any {
        return {
            success: result.success,
            data: result.result,
            cost: result.cost,
            validation: result.validation,
            metadata: result.metadata,
            timestamp: new Date().toISOString(),
            message: result.success ? "Tarefa executada com sucesso." : "Falha na execução."
        };
    }

    /**
     * Valida requisição
     */
    private validateRequest(request: any): void {
        const { type, userId, payload } = request;

        if (!type) throw new Error('Tipo de requisição obrigatório');
        if (!userId) throw new Error('ID do usuário obrigatório');
    }

    /**
     * Sugestões para erros comuns
     */
    private getErrorSuggestion(error: any): string {
        const errorMsg = error.message.toLowerCase();

        if (errorMsg.includes('créditos')) {
            return 'Adicione mais créditos ou atualize seu plano.';
        } else if (errorMsg.includes('não suportado')) {
            return 'Este tipo de tarefa ainda não está disponível no seu plano.';
        } else if (errorMsg.includes('api')) {
            return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
        } else {
            return 'Entre em contato com o suporte se o erro persistir.';
        }
    }
}

export const veraOrchestrator = new VeraOrchestrator();
