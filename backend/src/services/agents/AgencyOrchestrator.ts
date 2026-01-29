/**
 * Agency Orchestrator
 * Coordena todos os agentes da agência
 * Distribui tarefas, gerencia fluxo de trabalho e garante qualidade
 */

import { prisma } from "../../database/prismaClient";
import { CreditService } from "../CreditService";
import { CreditPricing } from "../../config/CreditPricing";

import { MarketMonitoringAgent } from "./MarketMonitoringAgent";
const marketMonitoringAgent = new MarketMonitoringAgent();

import { DesignAgent } from "./DesignAgent";
const designAgent = new DesignAgent();

import { CopyAgent } from "./CopyAgent";
const copyAgent = new CopyAgent();

import { geminiService } from "../ai/GeminiService";

import { BrandAgent } from "./BrandAgent";
const brandAgent = new BrandAgent();

import { EmailAgent } from "./EmailAgent";
const emailAgent = new EmailAgent();

import { PerformanceAgent } from "./PerformanceAgent";
const performanceAgent = new PerformanceAgent();

import { fallbackController, FailureType } from "./FallbackController";
import { AGENT_REGISTRY, getAgentProfile } from "../../config/AgentRegistry";

// Helper to route to specialized agents
function getSpecializedAgentId(platform: string, type: 'copy' | 'design' | 'manager'): string {
    if (type === 'design') {
        if (platform === 'instagram' || platform === 'facebook') return 'design-social-static';
        // Add more design logic here
        return 'design-social-static'; // Fallback
    }

    if (type === 'copy') {
        if (platform === 'tiktok' || platform === 'instagram' && (Math.random() > 0.5)) return 'copy-social-short'; // Reels/TikTok
        if (platform === 'instagram' || platform === 'twitter') return 'copy-social-short';
        if (platform === 'linkedin') return 'copy-social-long';
        if (platform === 'email') return 'copy-email-crm';
        return 'copy-social-short'; // Fallback
    }

    return 'vera-orchestrator';
}

export interface ContentPlan {
    id: string;
    userId: string;
    brandId: string;
    period: string; // "weekly", "monthly"
    platforms: string[];
    contentCount: number;
    themes: string[];
    status: "draft" | "approved" | "executing" | "completed";
    createdAt: Date;
}

export interface TaskQueue {
    id: string;
    planId: string;
    agentId: string;
    taskType: string; // "monitor", "design", "copy", "brand", "publish"
    priority: "high" | "medium" | "low";
    status: "pending" | "in_progress" | "completed" | "failed";
    data: any;
    result?: any;
    createdAt: Date;
    completedAt?: Date;
}

export interface AgencyReport {
    period: string;
    totalTasksCompleted: number;
    contentCreated: number;
    engagementGenerated: number;
    conversionRate: number;
    agentPerformance: Record<string, any>;
    recommendations: string[];
}

export class AgencyOrchestrator {
    private orchestratorId = "agency_orchestrator";
    private taskQueue: TaskQueue[] = [];
    private isProcessing = false;
    private isCheckingHealth = false;
    private isRunning = false;

    /**
     * Iniciar orquestração
     */
    async startOrchestration(): Promise<void> {
        console.log("[AgencyOrchestrator] Iniciando orquestração da agência...");

        this.isRunning = true;

        // Iniciar ciclo de processamento
        setInterval(async () => {
            await this.processTaskQueue();
        }, 60000); // A cada minuto

        // Primeira execução imediata
        await this.processTaskQueue();
    }

    /**
     * Criar plano de conteúdo
     */
    async createContentPlan(plan: ContentPlan): Promise<ContentPlan> {
        try {
            console.log("[AgencyOrchestrator] Criando plano de conteúdo");

            // 1. Validar plano
            await this.validatePlan(plan);

            // 1.1 ESTIMAR CUSTO & VALIDAR SALDO
            const nPosts = plan.contentCount;
            const estimatedCost =
                (CreditPricing['market_trends_report'] || 25) +
                ((CreditPricing['design_social_post'] || 12) * nPosts) +
                ((CreditPricing['ai_creative_writing'] || 5) * nPosts) +
                (CreditPricing['ai_text_generation'] || 2);

            const currentBalance = await CreditService.getBalance(plan.userId);
            if (currentBalance < estimatedCost) {
                throw new Error(`Saldo insuficiente. Custo estimado: ${estimatedCost} VC. Saldo atual: ${currentBalance} VC.`);
            }

            // 2. Obter tendências e oportunidades
            const trends = await marketMonitoringAgent.getCurrentTrends(5);
            const opportunities = await marketMonitoringAgent.getOpportunities("high");

            // 3. Criar tarefas para cada dia
            const tasks = await this.generateTasks(plan, trends, opportunities);

            // 4. Salvar plano
            const created = await prisma.contentPlan.create({
                data: {
                    userId: plan.userId,
                    brandId: plan.brandId,
                    period: plan.period,
                    platforms: JSON.stringify(plan.platforms),
                    contentCount: plan.contentCount,
                    themes: JSON.stringify(plan.themes),
                    status: "draft",
                },
            });

            // 5. Adicionar tarefas à fila
            for (const task of tasks) {
                await this.addTaskToQueue({
                    planId: created.id,
                    agentId: task.agentId,
                    taskType: task.taskType,
                    priority: task.priority,
                    status: "pending",
                    data: task.data,
                    createdAt: new Date(),
                });
            }

            console.log(`[AgencyOrchestrator] Plano criado com ${tasks.length} tarefas`);
            return {
                ...created,
                platforms: JSON.parse(created.platforms as string),
                themes: JSON.parse(created.themes as string)
            } as any;
        } catch (error) {
            console.error("[AgencyOrchestrator] Erro ao criar plano:", error);
            throw error;
        }
    }



    /**
     * Validar plano
     */
    private async validatePlan(plan: ContentPlan): Promise<void> {
        if (!plan.brandId) throw new Error("Brand ID é obrigatório");
        if (plan.platforms.length === 0) throw new Error("Pelo menos uma plataforma é obrigatória");
        if (plan.contentCount < 1) throw new Error("Conteúdo mínimo é 1");
    }

    /**
     * Gerar tarefas para o plano
     */
    private async generateTasks(
        plan: ContentPlan,
        trends: any[],
        opportunities: any[]
    ): Promise<any[]> {
        const tasks: any[] = [];

        // 1. Tarefa de monitoramento
        tasks.push({
            agentId: "market_monitor",
            taskType: "monitor",
            priority: "high",
            data: {
                planId: plan.id,
                platforms: plan.platforms,
            },
        });

        // 2. Tarefas de design
        for (const platform of plan.platforms) {
            for (let i = 0; i < Math.ceil(plan.contentCount / plan.platforms.length); i++) {
                tasks.push({
                    agentId: getSpecializedAgentId(platform, 'design'),
                    taskType: "design",
                    priority: "high",
                    data: {
                        platform,
                        theme: plan.themes[i % plan.themes.length],
                        trend: trends[i % trends.length]?.trend,
                        contentType: this.getContentType(platform),
                    },
                });
            }
        }

        // 3. Tarefas de copy
        for (const platform of plan.platforms) {
            for (let i = 0; i < Math.ceil(plan.contentCount / plan.platforms.length); i++) {
                tasks.push({
                    agentId: getSpecializedAgentId(platform, 'copy'),
                    taskType: "copy",
                    priority: "high",
                    data: {
                        platform,
                        theme: plan.themes[i % plan.themes.length],
                        objective: "engagement",
                    },
                });
            }
        }

        // 4. Tarefa de brand
        tasks.push({
            agentId: "brand_expert",
            taskType: "brand",
            priority: "medium",
            data: {
                brandId: plan.brandId,
                action: "validate_consistency",
            },
        });

        return tasks;
    }

    /**
     * Obter tipo de conteúdo por plataforma
     */
    private getContentType(platform: string): string {
        const contentTypes: Record<string, string> = {
            instagram: "post",
            tiktok: "video",
            linkedin: "article",
            facebook: "post",
            youtube: "thumbnail",
            email: "newsletter",
        };

        return contentTypes[platform] || "post";
    }

    /**
     * Adicionar tarefa à fila
     */
    private async addTaskToQueue(task: Partial<TaskQueue>): Promise<void> {
        try {
            await prisma.taskQueue.create({
                data: {
                    planId: task.planId!,
                    agentId: task.agentId!,
                    taskType: task.taskType!,
                    priority: task.priority || "medium",
                    status: "pending",
                    data: JSON.stringify(task.data || {}),
                },
            });
        } catch (error) {
            console.error("[AgencyOrchestrator] Erro ao adicionar tarefa:", error);
        }
    }

    /**
     * Processar fila de tarefas
     */
    private async processTaskQueue(): Promise<void> {
        if (this.isProcessing) {
            console.log("⏳ [AgencyOrchestrator] Processamento em andamento. Ignorando ciclo.");
            return;
        }

        this.isProcessing = true;
        try {
            // Obter tarefas pendentes
            const pendingTasks = await prisma.taskQueue.findMany({
                where: { status: "pending" },
                orderBy: {
                    priority: "desc", // High priority first
                },
                take: 5, // Processar 5 por vez
                include: { plan: true }
            });

            if (pendingTasks.length === 0) return;

            console.log(
                `[AgencyOrchestrator] Processando ${pendingTasks.length} tarefas`
            );

            for (const task of pendingTasks) {
                const parsedTask = {
                    ...task,
                    data: JSON.parse(task.data as string),
                    result: task.result ? JSON.parse(task.result as string) : undefined
                };
                await this.executeTask(parsedTask as any);
            }
        } catch (error) {
            console.error("[AgencyOrchestrator] Erro ao processar fila:", error);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Executar tarefa
     */
    private async executeTask(task: TaskQueue & { plan?: ContentPlan }): Promise<void> {
        try {
            // Determine Price
            // Determine Price
            let price = 0;
            if (task.taskType === 'monitor') price = CreditPricing['market_trends_report'] || 25;
            else if (task.taskType === 'design') price = CreditPricing['design_social_post'] || 12;
            else if (task.taskType === 'copy') price = CreditPricing['ai_creative_writing'] || 5;
            else if (task.taskType === 'brand') price = CreditPricing['ai_text_generation'] || 2;
            else if (task.taskType === 'publish') price = CreditPricing['instagram_publish_post'] || 15;
            else if (task.taskType === 'performance') price = CreditPricing['finance_audit'] || 15;
            else if (task.taskType === 'email') price = CreditPricing['ai_creative_writing'] || 5;

            // Check Balance
            if (task.plan && task.plan.userId && price > 0) {
                const balance = await CreditService.getBalance(task.plan.userId);
                if (balance < price) {
                    throw new Error(`Saldo insuficiente. Necessário: ${price}, Atual: ${balance}`);
                }
            }

            // Marcar como em progresso
            await prisma.taskQueue.update({
                where: { id: task.id },
                data: { status: "in_progress" },
            });

            let result: any = null;

            // Executar baseado no tipo
            switch (task.taskType) {
                case "monitor":
                    result = await this.executeMonitorTask(task);
                    break;
                case "design":
                    result = await this.executeDesignTask(task);
                    break;
                case "copy":
                    result = await this.executeCopyTask(task);
                    break;
                case "brand":
                    result = await this.executeBrandTask(task);
                    break;
                case "publish":
                    result = await this.executePublishTask(task);
                    break;
                case "email":
                    result = await this.executeEmailTask(task);
                    break;
                case "performance":
                    result = await this.executePerformanceTask(task);
                    break;
                default:
                    throw new Error(`Tipo de tarefa desconhecido: ${task.taskType}`);
            }

            // Deduct Credits
            if (task.plan && task.plan.userId && price > 0) {
                await CreditService.deductCredits(
                    task.plan.userId,
                    price,
                    `Execução: ${task.taskType} (${task.id})`,
                    task.agentId
                );
                console.log(`[Credits] Deduzido ${price} VC de user ${task.plan.userId}`);
            }

            // Marcar como completa
            await prisma.taskQueue.update({
                where: { id: task.id },
                data: {
                    status: "completed",
                    result: JSON.stringify(result),
                    completedAt: new Date(),
                },
            });

            console.log(`[AgencyOrchestrator] Tarefa ${task.id} concluída`);
        } catch (error) {
            console.error(`[AgencyOrchestrator] Erro ao executar tarefa ${task.id}:`, error);

            // Marcar como falha
            await prisma.taskQueue.update({
                where: { id: task.id },
                data: {
                    status: "failed",
                    result: JSON.stringify({ error: (error as Error).message }),
                },
            });
        }
    }

    /**
     * Executar tarefa de monitoramento
     */
    private async executeMonitorTask(task: TaskQueue): Promise<any> {
        const trends = await marketMonitoringAgent.getCurrentTrends(5);
        const opportunities = await marketMonitoringAgent.getOpportunities("high");

        return {
            trendsFound: trends.length,
            opportunitiesFound: opportunities.length,
            timestamp: new Date(),
        };
    }

    /**
     * Executar tarefa de design
     */
    private async executeDesignTask(task: TaskQueue): Promise<any> {
        const designProfile = getAgentProfile(task.agentId);

        const brief = {
            id: `brief_${task.id}`,
            platform: task.data.platform,
            theme: task.data.theme,
            style: designProfile?.name.includes("Social") ? "modern" : "corporate", // Simplistic mapping for now
            colors: ["#1F2937", "#3B82F6", "#F59E0B"],
            dimensions: "1080x1080",
            contentType: task.data.contentType,
            trend: task.data.trend,
        };

        const designs = await designAgent.receiveBrief(brief as any);

        return {
            designsGenerated: designs.length,
            topDesignQuality: designs[0]?.quality || 0,
            timestamp: new Date(),
        };
    }

    /**
     * Executar tarefa de copy
     */
    private async executeCopyTask(task: TaskQueue): Promise<any> {
        const brief = {
            id: `brief_${task.id}`,
            platform: task.data.platform,
            contentType: "caption",
            tone: "casual",
            targetAudience: "18-35 anos",
            objective: task.data.objective,
            keywords: [task.data.theme],
        };

        const copies = await copyAgent.receiveBrief(brief as any, getAgentProfile(task.agentId));

        return {
            copiesGenerated: copies.length,
            topCopyEngagement: copies[0]?.estimatedEngagement || 0,
            timestamp: new Date(),
        };
    }

    /**
     * Executar tarefa de brand
     */
    private async executeBrandTask(task: TaskQueue): Promise<any> {
        if (task.data.action === "validate_consistency") {
            const platforms = ["instagram", "facebook", "linkedin"];
            const reports = [];

            for (const platform of platforms) {
                try {
                    const report = await brandAgent.analyzeBrandConsistency(
                        task.data.brandId,
                        platform
                    );
                    reports.push(report);
                } catch (error) {
                    console.error(`Erro ao analisar ${platform}:`, error);
                }
            }

            return {
                platformsAnalyzed: reports.length,
                avgConsistency:
                    reports.reduce((sum, r) => sum + r.consistencyScore, 0) /
                    reports.length,
                timestamp: new Date(),
            };
        }

        return { status: "completed" };
    }

    /**
     * Executar tarefa de publicação
     */
    /**
     * Executar tarefa de publicação
     */
    private async executePublishTask(task: TaskQueue): Promise<any> {
        // Simular publicação
        return {
            published: true,
            platform: task.data.platform,
            timestamp: new Date(),
        };
    }

    /**
     * Executar tarefa de E-mail Marketing
     */
    private async executeEmailTask(task: TaskQueue): Promise<any> {
        const action = task.data.action || "newsletter";

        if (action === "capture_lead") {
            return await emailAgent.captureLead(task.data.lead);
        }

        if (action === "welcome_sequence") {
            return await emailAgent.sendWelcomeSequence(task.data.email, task.data.name);
        }

        if (action === "newsletter") {
            // Em um fluxo real, o CopyAgent já teria gerado o conteúdo e passado aqui
            // Simulando conteúdo se não vier
            const content = task.data.content || "<h1>Newsletter VERA</h1><p>Conteúdo gerado automaticamente.</p>";
            const subject = task.data.subject || "Sua atualização semanal";

            return await emailAgent.sendNewsletter(subject, content, task.data.segment);
        }

        return { error: "Ação de e-mail desconhecida" };
    }

    /**
     * Executar tarefa de Performance (Tráfego Pago)
     */
    private async executePerformanceTask(task: TaskQueue): Promise<any> {
        const action = task.data.action || "optimize";

        if (action === "create_campaign") {
            return await performanceAgent.createCampaign(task.data.brief);
        }

        if (action === "optimize") {
            // Regras padrão se não forem fornecidas
            const rules = task.data.rules || [
                { metric: "roas", condition: "<", threshold: 1.5, action: "pause" },
                { metric: "roas", condition: ">", threshold: 4.0, action: "increase_budget" }
            ];
            return await performanceAgent.optimizeCampaign(task.data.campaignId, rules);
        }

        return { error: "Ação de performance desconhecida" };
    }

    /**
     * Obter status do plano
     */
    async getPlanStatus(planId: string): Promise<any> {
        try {
            const plan = await prisma.contentPlan.findUnique({
                where: { id: planId },
            });

            const tasks = await prisma.taskQueue.findMany({
                where: { planId },
            });

            const completed = tasks.filter((t) => t.status === "completed").length;
            const failed = tasks.filter((t) => t.status === "failed").length;
            const pending = tasks.filter((t) => t.status === "pending").length;
            const inProgress = tasks.filter((t) => t.status === "in_progress").length;

            return {
                plan: plan ? {
                    ...plan,
                    platforms: JSON.parse(plan.platforms as string),
                    themes: JSON.parse(plan.themes as string)
                } : null,
                tasks: {
                    total: tasks.length,
                    completed,
                    failed,
                    pending,
                    inProgress,
                },
                progress: Math.round((completed / tasks.length) * 100),
            };
        } catch (error) {
            console.error("[AgencyOrchestrator] Erro ao obter status:", error);
            return null;
        }
    }

    /**
     * Gerar relatório da agência
     */
    async generateAgencyReport(userId: string, period: string): Promise<AgencyReport> {
        try {
            console.log("[AgencyOrchestrator] Gerando relatório da agência");

            // Obter planos completados
            const plans = await prisma.contentPlan.findMany({
                where: {
                    userId,
                    status: "completed",
                },
            });

            // Contar tarefas completadas
            const completedTasks = await prisma.taskQueue.findMany({
                where: {
                    status: "completed",
                    planId: {
                        in: plans.map((p) => p.id),
                    },
                },
            });

            // Calcular métricas
            const totalTasksCompleted = completedTasks.length;
            const contentCreated = plans.reduce((sum, p) => sum + p.contentCount, 0);

            // [REAL-DATA] Engagement & Conversion from Interactions
            const interactions = await prisma.agentInteraction.aggregate({
                where: { userId },
                _sum: { engagementScore: true },
                _count: { id: true, converted: true }
            });

            const engagementGenerated = interactions._sum.engagementScore || 0;

            // Calculate Conversion Rate (Converted / Total Interactions)
            // Note: Prisma aggregate count returns total rows. We need count of where converted=true.
            // SQLite/Prisma limitation: standard aggregate doesn't do conditional count efficiently in one go without raw query or grouping.
            // Simplified approach: Fetch converted count separately.
            const convertedCount = await prisma.agentInteraction.count({
                where: { userId, converted: true }
            });

            const totalInteractions = interactions._count.id;
            const conversionRate = totalInteractions > 0 ? (convertedCount / totalInteractions) : 0;

            // Obter performance dos agentes
            const agentPerformance = await this.calculateAgentPerformance(
                completedTasks as any
            );

            // Gerar recomendações
            const recommendations = this.generateRecommendations(
                totalTasksCompleted,
                conversionRate
            );

            return {
                period,
                totalTasksCompleted,
                contentCreated,
                engagementGenerated,
                conversionRate: Math.round(conversionRate * 100) / 100, // Format 2 decimal places
                agentPerformance,
                recommendations,
            };
        } catch (error) {
            console.error("[AgencyOrchestrator] Erro ao gerar relatório:", error);
            throw error;
        }
    }

    /**
     * Calcular performance dos agentes
     */
    private async calculateAgentPerformance(
        tasks: TaskQueue[]
    ): Promise<Record<string, any>> {
        const performance: Record<string, any> = {};

        const agents = new Set(tasks.map((t) => t.agentId));

        for (const agent of agents) {
            const agentTasks = tasks.filter((t) => t.agentId === agent);
            const completed = agentTasks.filter((t) => t.status === "completed").length;
            const failed = agentTasks.filter((t) => t.status === "failed").length;

            performance[agent] = {
                tasksCompleted: completed,
                tasksFailed: failed,
                successRate: Math.round((completed / agentTasks.length) * 100),
            };
        }

        return performance;
    }

    /**
     * Gerar recomendações
     */
    private generateRecommendations(
        tasksCompleted: number,
        conversionRate: number
    ): string[] {
        const recommendations: string[] = [];

        if (tasksCompleted < 10) {
            recommendations.push(
                "Aumentar volume de conteúdo para melhores resultados"
            );
        }

        if (conversionRate < 0.1) {
            recommendations.push(
                "Otimizar estratégia de conversão com gatilhos psicológicos"
            );
        }

        if (conversionRate > 0.15) {
            recommendations.push("Excelente performance! Escale o que está funcionando");
        }

        recommendations.push("Testar novos formatos de conteúdo");
        recommendations.push("Aumentar frequência de publicação");

        return recommendations;
    }

    /**
     * DOPAMINE METHOD: Processar Feedback do Usuário
     * O núcleo do Aprendizado por Reforço (RLHF) via Telegram
     */
    async processDopamineFeedback(
        agentId: string,
        brandId: string,
        platform: string,
        feedback: "POSITIVE" | "NEGATIVE"
    ): Promise<{ healthScore: number; action: string }> {
        console.log(`[Dopamine] Processando feedback ${feedback} para ${agentId}`);

        // 1. Buscar performance atual
        let performance = await prisma.agentPerformance.findUnique({
            where: { agentId_platform: { agentId, platform } }
        });

        if (!performance) {
            performance = await prisma.agentPerformance.create({
                data: {
                    agentId,
                    platform,
                    healthScore: 100, // Começa saudável
                    lastResetAt: new Date(),
                    engagementRate: 0,
                    conversionRate: 0,
                    responseTime: 0,
                    accuracyScore: 0,
                    improvementTrend: "neutral"
                }
            });
        }

        // 2. Calcular nova saúde
        let newScore = performance.healthScore;
        let action = "LOG_ONLY";

        if (feedback === "POSITIVE") {
            // Recompensa: Dopamina
            newScore = Math.min(100, newScore + 5);

            // Se atingir pico de saúde (>90) E não tiver reset recente -> Salvar Snapshot
            if (newScore > 90) {
                await this.createSmartSnapshot(agentId, brandId, "DOPAMINE_PEAK");
                action = "SNAPSHOT_CREATED";
            }
        } else {
            // Punição: Dano
            newScore = Math.max(0, newScore - 15); // Feedback negativo dói mais

            // Se ficar doente (<40) -> Sugerir Reset
            if (newScore < 40) {
                action = "SUGGEST_RESET";
            }
        }

        // 3. Atualizar Banco
        await prisma.agentPerformance.update({
            where: { id: performance.id },
            data: {
                healthScore: newScore,
                lastUpdated: new Date()
            }
        });

        return { healthScore: newScore, action };
    }

    /**
     * Criar Smart Snapshot (Save Point)
     */
    async createSmartSnapshot(agentId: string, brandId: string, reason: string): Promise<void> {
        console.log(`[Snapshot] Criando ponto de restauração para ${agentId}`);

        // Em um cenário real, aqui serializaríamos o Vector Store / Context Window
        // Como é um MVP, salvamos o estado "simbólico" e confirmação de saúde
        const snapshotData = {
            timestamp: new Date(),
            contextSize: 1024, // Simulado
            topPerformers: ["last_successful_post_id"]
        };

        await prisma.agentSnapshot.create({
            data: {
                agentId,
                brandId,
                reason,
                healthScore: 100, // Snapshot é sempre saudável
                data: JSON.stringify(snapshotData)
            }
        });
    }

    /**
     * Processar Chat do Usuário (Telegram)
     * Atua como a "Consciência" da VERA
     */
    // Memória de Curto Prazo (Volátil)
    private chatHistory: Map<string, Array<{ role: 'user' | 'model', message: string }>> = new Map();

    async handleUserChat(telegramId: string, message: string, audioBuffer?: Buffer): Promise<string> {
        console.log(`[AgencyOrchestrator] Processando chat de Telegram ID ${telegramId}: "${message}"`);

        // 1. RESOLVER USER ID (Telegram ID -> DB UUID)
        let userId = telegramId;

        // Se for o Admin Chat ID definido no .env, mapear para o Super Admin real
        if (telegramId === process.env.TELEGRAM_ADMIN_CHAT_ID) {
            const superAdmin = await prisma.user.findFirst({
                where: { role: 'SUPER_ADMIN' }
            });
            if (superAdmin) {
                userId = superAdmin.id;
                console.log(`[AgencyOrchestrator] Admin detectado. Mapeado para ${superAdmin.email}`);
            }
        } else {
            // Tentar encontrar via TelegramUser mapeado no DB
            const mappedUser = await prisma.telegramUser.findUnique({
                where: { telegramId },
                include: { brand: true }
            });
            if (mappedUser && mappedUser.brand?.userId) {
                userId = mappedUser.brand.userId;
            }
        }

        // 2. Recuperar e Atualizar Histórico (Usamos telegramId para manter o chat isolado por plataforma)
        let history = this.chatHistory.get(telegramId) || [];
        history.push({ role: 'user', message: audioBuffer ? "(Mensagem de Voz Recebida)" : message });

        // Limitar histórico (10 turnos = 20 mensagens)
        if (history.length > 20) history = history.slice(-20);

        // 2. Construir Contexto
        const historyContext = history.map(h => `${h.role === 'user' ? 'Comandante' : 'VERA'}: ${h.message}`).join("\n");

        // 3. Buscar Contexto do Usuário para a IA
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { brands: true } });
        const brandName = user?.brands[0]?.name || "Marca não configurada";
        const userCredits = user?.credits || 0;

        const systemPrompt = `
            Você é a VERA (Virtual Enterprise Resource Architect), a IA comandante da agência.
            
            CONTEXTO ATUAL:
            - Comandante: ${user?.name || "Desconhecido"}
            - Marca: ${brandName}
            - Saldo de Créditos: ${userCredits} VC
            
            PROTOCOLOS MESTRES (Siga rigorosamente):
            1. **SEM ALUCINAÇÕES**: Você NÃO cria artigos ou áudios sozinho. Você *comanda* agentes.
            2. **AÇÃO IMEDIATA**: Se o usuário pedir algo criativo (texto, áudio, dados), você **OBRIGATORIAMENTE** deve emitir uma tag [ACTION]. 
            3. **MEMÓRIA**: Se o usuário disser "estou esperando" ou "cadê", verifique o histórico. Se ele pediu algo antes, EMITA A TAG NOVAMENTE.
            4. **ÁUDIO**: Se você receber um áudio, transcreva-o mentalmente e obedeça ao comando falado. Se for apenas um cumprimento, responda naturalmente.
            5. **SALDO**: Se o usuário perguntar o saldo, você já sabe: ele tem ${userCredits} créditos. Responda amigavelmente.
            
            FORMATO DOS COMANDOS (Coloque NO FIM da resposta):
            [ACTION: GENERATE_COPY | tema: "..." | formato: "linkedin/instagram/blog"]
            [ACTION: GENERATE_IMAGE | tema: "..." | formato: "post/story"]
            [ACTION: SEND_AUDIO | texto: "..."]
            [ACTION: MARKET_REPORT]
            [ACTION: FINANCE_REPORT]
            
            Exemplos:
            User: "Crie um post sobre IA" -> VERA: "Afirmativo. Alocando CopyWriter..." [ACTION: GENERATE_COPY | tema: "IA" | formato: "linkedin"]
            User: "Qual meu saldo?" -> VERA: "Afirmativo, Comandante. Você possui ${userCredits} créditos disponíveis."
            
            Histórico Recente:
            ${historyContext}
            
            Comandante: "${message}"
            
            Responda como VERA:
        `;

        // 3. Gerar Resposta via Gemini
        let responseText = await geminiService.generateContent(systemPrompt, audioBuffer);

        // 4. Salvar resposta no histórico
        history.push({ role: 'model', message: responseText });
        this.chatHistory.set(telegramId, history);

        // 5. PROCESSAR AÇÕES (O "Corpo" da Vera)
        if (responseText.includes("[ACTION:")) {
            console.log("⚡ [AgencyOrchestrator] Ação detectada na resposta:", responseText);

            try {
                // --- SYSTEM CHECK: CREDIT ENFORCEMENT ---
                let actionCost = 0;
                let actionType = "";

                if (responseText.includes("MARKET_REPORT")) {
                    actionCost = CreditPricing.market_trends_report;
                    actionType = "Relatório de Mercado";
                } else if (responseText.includes("FINANCE_REPORT")) {
                    actionCost = CreditPricing.finance_audit;
                    actionType = "Relatório Financeiro";
                } else if (responseText.includes("GENERATE_COPY")) {
                    // Detectando plataforma para ajuste fino de preço
                    if (responseText.toLowerCase().includes("linkedin")) actionCost = CreditPricing.ai_creative_writing;
                    else if (responseText.toLowerCase().includes("blog")) actionCost = CreditPricing.ai_creative_writing;
                    else actionCost = CreditPricing.ai_text_generation;

                    actionType = "Geração de Copy (IA)";
                } else if (responseText.includes("GENERATE_IMAGE")) {
                    actionCost = CreditPricing.design_social_post;
                    actionType = "Design de Imagem";
                } else if (responseText.includes("SEND_AUDIO")) {
                    actionCost = CreditPricing.audio_synthesis;
                    actionType = "Resposta de Voz (Synthesis)";
                }

                // Custo Base de Processamento
                if (actionCost === 0) {
                    actionCost = CreditPricing.ai_text_generation;
                    actionType = "Processamento Cognitivo (Chat)";
                }

                if (actionCost > 0) {
                    console.log(`💰 [CreditSystem] Ação: ${actionType} | Custo: ${actionCost} créditos. Verificando saldo...`);
                    // Tenta debitar
                    await CreditService.deductCredits(userId, actionCost, `Vera: ${actionType}`, "System");
                    console.log(`✅ [CreditSystem] Saldo debitado com sucesso.`);

                    // Notificar saldo restante
                    const remainingBalance = await CreditService.getBalance(userId);
                    if (remainingBalance < 50) {
                        history.push({ role: 'model', message: `⚠️ **Aviso de Saldo Baixo:** Restam ${remainingBalance} créditos.` });
                    }
                }
                // ----------------------------------------

                if (responseText.includes("MARKET_REPORT")) {
                    const { marketMonitoringAgent } = require("./MarketMonitoringAgent");
                    const trends = await marketMonitoringAgent.getCurrentTrends(5);

                    let report = "📊 **Relatório de Mercado (Tempo Real)**\n\n";
                    if (trends.length === 0) {
                        report += "Nenhuma tendência crítica detectada no momento.";
                    } else {
                        trends.forEach((t: any, i: number) => {
                            report += `${i + 1}. **${t.trend}** (${t.platform})\n   Relevância: ${t.relevance.toFixed(0)}% | Volume: ${t.volume}\n`;
                        });
                    }

                    const finalResponse = `Ação Executada: Aqui está a análise solicitada:\n\n${report}`;
                    history.push({ role: 'model', message: finalResponse });
                    return finalResponse;
                }

                if (responseText.includes("FINANCE_REPORT")) {
                    const { financeGuard } = require("./FinanceGuardAgent");

                    // BUSCA REAL DO BANCO DE DADOS
                    const campaigns = await prisma.campaign.findMany({
                        where: { status: 'active' }
                    });

                    if (!campaigns || campaigns.length === 0) {
                        const msg = "💰 **Relatório Financeiro:** Não encontrei campanhas ativas no banco de dados para analisar.";
                        history.push({ role: 'model', message: msg });
                        return msg;
                    }

                    let report = "💰 **Relatório do Head Guardião (Financeiro)**\n\n";

                    for (const cam of campaigns) {
                        const metrics = {
                            cpa: cam.cpa,
                            roas: cam.roas,
                            ctr: cam.ctr,
                            cpm: cam.cpm,
                            frequency: cam.frequency,
                            spend: cam.spend,
                            budget: cam.budget
                        };

                        const verdict = await financeGuard.evaluateCampaign(metrics);
                        const icon = verdict.approved ? (verdict.action === 'SCALE' ? '🚀' : '✅') : '🛑';

                        report += `${icon} **${cam.name}**\n`;
                        report += `   - Status: ${verdict.action}\n`;
                        report += `   - Decisão: ${verdict.reason}\n`;
                        if (verdict.adjustmentFactor !== 1) {
                            report += `   - Ajuste de Orçamento: ${((verdict.adjustmentFactor || 1) * 100 - 100).toFixed(0)}%\n`;
                        }
                        report += `   - CPA: R$${cam.cpa} | ROAS: ${cam.roas}x\n\n`;
                    }

                    history.push({ role: 'model', message: report });
                    return report;
                }

                if (responseText.includes("GENERATE_COPY")) {
                    const copyRegex = /\[ACTION: GENERATE_COPY\s*\|\s*tema:\s*["']?([^"']+)["']?\s*\|\s*formato:\s*["']?([^"']+)["']?\]/i;
                    const match = responseText.match(copyRegex);
                    if (match) {
                        const tema = match[1];
                        const formato = match[2];
                        console.log(`[AgencyOrchestrator] Executando CopyAgent -> Tema: ${tema}, Formato: ${formato}`);

                        const { copyAgent } = require("./CopyAgent");
                        const brief = {
                            id: `auto_${Date.now()}`,
                            platform: formato.includes("linkedin") ? "linkedin" : "instagram",
                            contentType: "post",
                            tone: "professional",
                            targetAudience: "market",
                            objective: "engagement",
                            keywords: [tema]
                        };

                        const copies = await copyAgent.receiveBrief(brief as any);
                        const bestCopy = copies[0]?.text || "Erro ao gerar copy.";

                        const finalResponse = `📝 **Copy Gerada (Vera CopyWriter):**\n\n${bestCopy}`;
                        history.push({ role: 'model', message: finalResponse });
                        return finalResponse;
                    }
                }

                if (responseText.includes("GENERATE_IMAGE")) {
                    const imgRegex = /\[ACTION: GENERATE_IMAGE\s*\|\s*tema:\s*["']?([^"']+)["']?\s*\|\s*formato:\s*["']?([^"']+)["']?\]/i;
                    const match = responseText.match(imgRegex);
                    if (match) {
                        const tema = match[1];
                        const formato = match[2];
                        console.log(`[AgencyOrchestrator] Executando DesignAgent -> Tema: ${tema}, Formato: ${formato}`);

                        const { designAgent } = require("./DesignAgent");
                        const brief = {
                            id: `design_${Date.now()}`,
                            platform: "instagram",
                            theme: tema,
                            style: "modern",
                            colors: ["#000000", "#FFFFFF"],
                            dimensions: formato.includes("story") ? "1080x1920" : "1080x1080",
                            contentType: "post"
                        };

                        const designs = await designAgent.receiveBrief(brief as any);
                        const bestDesign = designs[0]?.imageUrl;

                        if (bestDesign) {
                            const finalResponse = `🎨 **Design Gerado (Vera Designer):**\n![Design Gerado](${bestDesign})`;
                            history.push({ role: 'model', message: finalResponse });
                            return finalResponse;
                        } else {
                            return "⚠️ Design Agent reportou falha na geração.";
                        }
                    }
                }

                if (responseText.includes("SEND_AUDIO")) {
                    const textMatch = responseText.match(/texto:\s*["']?(.*?)["']?(\s*\||\]|$)/);
                    if (textMatch) {
                        const audioText = textMatch[1].trim();
                        const { telegramService } = require("../TelegramService");
                        const { elevenLabsService } = require("../video/ElevenLabsService");

                        try {
                            const audioBuffer = await elevenLabsService.generateAudio(audioText);
                            await telegramService.sendVoice(audioBuffer);
                            return responseText.replace(/\[ACTION:.*?\]/, "") + "\n(Áudio transmitido pelo canal seguro.)";
                        } catch (e) {
                            console.error("Erro ao enviar áudio:", e);
                            return "Tentei enviar o áudio, mas houve uma interferência no sinal (Erro no serviço de voz).";
                        }
                    }
                }

                // Limpar o comando técnico
                responseText = responseText.replace(/\[ACTION:.*?\]/g, "").trim();

            } catch (error: any) {
                console.warn(`[AgencyOrchestrator] Bloqueio de Crédito ou Erro de Ação: ${error.message}`);

                if (error && error.message && (error.message.includes("Insufficient credits") || error.message.includes("Saldo insuficiente"))) {
                    const blockMsg = `🚫 **SALDO INSUFICIENTE**\n\nEsta ação requer créditos que você não possui no momento.\nPor favor, recarregue sua conta para continuar utilizando a VERA plenamente.\n\n[Comprar Créditos](http://localhost:3000/painel/finance)`;
                    history.push({ role: 'model', message: blockMsg });
                    return blockMsg;
                }
                return `⚠️ **Erro de Processamento:** ${error?.message || "Erro desconhecido"}`;
            }
        }

        return responseText;
    }

    async restoreAgentSnapshot(agentId: string, brandId: string): Promise<boolean> {
        console.log(`[Reset] Restaurando agente ${agentId} para último ponto saudável`);
        try {
            const lastSnapshot = await prisma.agentSnapshot.findFirst({
                where: { agentId, brandId },
                orderBy: { createdAt: 'desc' }
            });

            if (!lastSnapshot) console.log("Nenhum snapshot encontrado. Resetando para Factory Default.");

            await prisma.agentPerformance.updateMany({
                where: { agentId },
                data: {
                    healthScore: 100,
                    lastResetAt: new Date()
                }
            });
            return true;
        } catch (error) {
            console.error("Error restoring snapshot:", error);
            return false;
        }
    }
}

export const agencyOrchestrator = new AgencyOrchestrator();
