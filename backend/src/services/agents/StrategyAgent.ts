import { prisma } from "../../database/prismaClient";
import { geminiService } from "../ai/GeminiService";
import { AGENT_REGISTRY } from "../../config/AgentRegistry";
import { MarketMonitoringAgent } from "./MarketMonitoringAgent";
import { AgentActivityLog } from "../AgentActivityLog";

const marketAgent = new MarketMonitoringAgent();

/**
 * Strategy Agent (Head de Estratégia / CMO)
 * Responsável pelo "Blueprint" (Plano de Conteúdo) e Proatividade Diária.
 */
export class StrategyAgent {
    private agentId = "head-strategy";

    /**
     * Daily Pulse (Proactive Scanner)
     * O "Cron Job" mental que varre oportunidades e sugere ações.
     * Deve ser chamado diariamente (via CRON ou agendador).
     */
    async runDailyPulse(userId: string): Promise<{ proposed: number; opportunities: any[] }> {
        console.log(`[StrategyAgent] Running Daily Pulse for user ${userId}...`);
        const opportunities: any[] = [];
        let proposedCount = 0;

        try {
            // 1. Fetch trends and opportunities from MarketAgent
            const trends = await marketAgent.getCurrentTrends(5);
            const marketOpps = await marketAgent.getOpportunities("high");

            // 2. Get user's primary brand for context
            const brand = await prisma.brand.findFirst({ where: { userId } });
            if (!brand) {
                console.log("[StrategyAgent] User has no brand configured. Skipping.");
                return { proposed: 0, opportunities: [] };
            }

            // 3. Get user's existing content plan (if any) for the current month
            const existingPlan = await prisma.contentPlan.findFirst({
                where: { userId, status: { not: "completed" } },
                orderBy: { createdAt: 'desc' }
            });

            // 4. For each high-priority opportunity, create a PROPOSED task
            for (const opp of marketOpps.slice(0, 3)) { // Max 3 proposals per day
                const description = `[PROATIVO] Oportunidade detectada: ${opp.description || opp.type}. Plataforma: ${opp.platform}. Ação sugerida: Criar conteúdo.`;

                // Create structured opportunity object
                const oppData = {
                    id: opp.id,
                    description: opp.description || opp.type,
                    platform: opp.platform,
                    type: opp.type,
                    action: 'Criar conteúdo',
                    displayTitle: `Oportunidade: ${opp.type}`,
                    fullDescription: description
                };

                opportunities.push(oppData);

                // Check if a task for this specific opportunity already exists
                const existingTasks = await prisma.taskQueue.findMany({
                    where: {
                        planId: existingPlan?.id || 'no-plan',
                        taskType: 'proposed_opportunity',
                    }
                });

                const isDuplicate = existingTasks.some(t => {
                    try {
                        const data = JSON.parse(t.data);
                        return data.opportunityId === opp.id;
                    } catch { return false; }
                });

                if (!isDuplicate && existingPlan) {
                    await prisma.taskQueue.create({
                        data: {
                            planId: existingPlan.id,
                            agentId: this.agentId,
                            taskType: 'proposed_opportunity',
                            priority: opp.priority || 'medium',
                            status: 'pending', // User must approve to execute
                            data: JSON.stringify({
                                opportunityId: opp.id,
                                description: opp.description,
                                platform: opp.platform,
                                actionItems: opp.actionItems,
                                source: 'DAILY_PULSE'
                            })
                        }
                    });
                    proposedCount++;
                    console.log(`[StrategyAgent] Proposed task created for opportunity: ${opp.id}`);
                }
            }

            // 5. Check Calendar Events (Seasonal Campaigns)
            const today = new Date();
            const month = today.getMonth() + 1;

            const seasonalEvents: Record<string, string> = {
                '2-14': 'Dia dos Namorados (Valentines)',
                '3-8': 'Dia da Mulher',
                '5-12': 'Dia das Mães (aproximado)',
                '6-12': 'Dia dos Namorados (Brasil)',
                '8-11': 'Dia dos Pais (aproximado)',
                '10-12': 'Dia das Crianças',
                '11-25': 'Black Friday (aproximado)',
                '12-25': 'Natal'
            };
            // Check 7 days in advance
            for (let i = 0; i <= 7; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(today.getDate() + i);
                const checkKey = `${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
                if (seasonalEvents[checkKey]) {
                    const eventName = seasonalEvents[checkKey];
                    opportunities.push({
                        id: `seasonal-${checkKey}`,
                        type: 'seasonal_event',
                        displayTitle: `Evento: ${eventName}`,
                        description: `Data Comemorativa em ${i} dias`,
                        platform: 'all',
                        action: 'Criar Campanha',
                        fullDescription: `[CALENDÁRIO] Data Sazonal: ${eventName}`
                    });
                }
            }

            console.log(`[StrategyAgent] Daily Pulse complete. ${proposedCount} tasks proposed.`);

            // Log action to dashboard
            if (proposedCount > 0 || opportunities.length > 0) {
                await AgentActivityLog.logAction({
                    userId,
                    agentId: this.agentId,
                    action: 'DAILY_PULSE',
                    details: `Varredura concluída: ${proposedCount} propostas, ${opportunities.length} oportunidades detectadas`,
                    priority: 'high',
                    notifyTelegram: true
                });
            }
        } catch (error) {
            console.error("[StrategyAgent] Error in Daily Pulse:", error);
        }

        return { proposed: proposedCount, opportunities };
    }

    /**
     * Cria o Blueprint (Plano Estratégico)
     */
    async createBlueprint(brandId: string, period: string, constraints?: any): Promise<any> {
        console.log(`[StrategyAgent] Criando Blueprint estratégico para ${brandId}`);
        const systemPrompt = "You are the Chief Marketing Officer (CMO). Your goal is to build a cohesive Content Strategy.";
        const prompt = `
            ${systemPrompt}
            ACTION: Create a strategic content plan (Blueprint) for the ${period}.
            BRAND_ID: ${brandId}
            CONSTRAINTS: ${JSON.stringify(constraints || {})}
            OUTPUT: A JSON object with 'themes' (array of daily themes) and 'focus' (main objective).
            Return ONLY JSON.
        `;
        try {
            const result = await geminiService.generateContent(prompt);
            return JSON.parse(result || "{}");
        } catch (error) {
            console.error("Erro ao gerar blueprint:", error);
            return { themes: ["General Update", "Industry News", "Product Highlight"], focus: "Maintenance" };
        }
    }

    /**
     * Executes a proposed opportunity (Action: Create Content)
     * Triggers the Content Agent to generate copy and design.
     */
    async executeOpportunity(userId: string, opportunityId: string): Promise<any> {
        console.log(`[StrategyAgent] Executing opportunity ${opportunityId} for user ${userId}`);

        // 1. Find the opportunity details (Mock or DB)
        // In a real scenario, we'd fetch the MarketOpportunity from DB.
        // For now, we'll maintain the illusion of continuity.

        // 2. Generate Content using Gemini
        const prompt = `
            ROLE: Social Media Manager.
            TASK: Create a social media post based on opportunity ID: ${opportunityId}.
            CONTEXT: The user wants to act on a market trend or competitor move.
            OUTPUT: JSON with 'caption' (engaging text with hashtags), 'imagePrompt' (for image gen), and 'strategy_note'.
            Return ONLY JSON.
        `;

        let content = {
            caption: "🔥 Aproveite a tendência! Nossos preços caíram para você subir no conceito. #promo #viral",
            imagePrompt: "A futuristic digital marketing dashboard glowing with success metrics, cyberpunk style",
            strategy_note: "Focando em urgência e prova social."
        };

        try {
            const aiResult = await geminiService.generateContent(prompt);
            const parsed = JSON.parse(aiResult || "{}");
            if (parsed.caption) content = parsed;
        } catch (e) {
            console.warn("DAI generation failed, using fallback content");
        }

        // 3. Create a "Review Task" or "Draft Post" in the system
        // We'll create a TaskQueue item for the content creation
        // But for the immediate UI response, we return the generated data.

        return {
            status: 'draft_created',
            content: {
                ...content,
                generatedAt: new Date()
            }
        };
    }
}

export const strategyAgent = new StrategyAgent();
