
import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
import { agencyOrchestrator } from './agents/AgencyOrchestrator';

/**
 * Health Check Controller
 * Gera um relatório detalhado para monitoramento sem acesso ao servidor.
 */
export class HealthCheckController {

    async verifyAdmin(req: any, res: Response) {
        const { adminKey } = req.body;
        if (req.user?.role === 'SUPER_ADMIN' || adminKey === process.env.ADMIN_KEY) {
            return res.json({ success: true, token: "session-valid" });
        }
        return res.status(403).json({ error: "Chave Inválida" });
    }

    async getDetailedReport(req: Request, res: Response) {
        try {
            const now = new Date();
            let status = "✅ OPERACIONAL";
            const alerts = [];

            let dbStatus = "✅ Conectado";
            try {
                await prisma.$queryRaw`SELECT 1`;
            } catch (e) {
                dbStatus = "❌ ERRO DE CONEXÃO";
                status = "🚨 CRÍTICO";
                alerts.push("Banco de Dados inacessível.");
            }

            // Safe fetch
            let sickAgents: any[] = [];
            let pausedAgents: any[] = [];
            try {
                sickAgents = await prisma.agentPerformance.findMany({
                    where: { healthScore: { lt: 50, gt: -1 } }
                });
                pausedAgents = await prisma.agentPerformance.findMany({
                    where: { healthScore: -1 }
                });
            } catch (e) {
                alerts.push("Erro ao ler tabela AgentPerformance.");
            }

            let agentStatus = "✅ Todos Saudáveis";
            if (sickAgents.length > 0) {
                agentStatus = `⚠️ ${sickAgents.length} Agente(s) Doente(s)`;
                if (status !== "🚨 CRÍTICO") status = "⚠️ ALERTA";
                sickAgents.forEach(a => alerts.push(`Agente ${a.agentId} com saúde baixa (${a.healthScore}%).`));
            }
            if (pausedAgents.length > 0) {
                alerts.push(`${pausedAgents.length} Agente(s) Pausado(s) Manualmente.`);
            }

            const report = `
=== RELATÓRIO DE DIAGNÓSTICO VERA ===
Data: ${now.toLocaleString('pt-BR')}
Versão do Sistema: 5.2.0

[STATUS GERAL]: ${status}

1. [INFRAESTRUTURA]
   - Banco de Dados: ${dbStatus}
   - Orquestrador: ${agencyOrchestrator ? "✅ Ativo" : "❌ Parado"}

2. [SAÚDE DOS AGENTES]
   - Status: ${agentStatus}
   ${sickAgents.map(a => `- ${a.agentId}: ${a.healthScore}% (Requer atenção)`).join('\n   ')}
   ${pausedAgents.map(a => `- ${a.agentId}: PAUSADO (Manual)`).join('\n   ')}

3. [ALERTAS TÉCNICOS]
   ${alerts.length > 0 ? alerts.map(a => `- ${a}`).join('\n   ') : "- Nenhum alerta ativo."}

[AÇÃO RECOMENDADA]
${status === "✅ OPERACIONAL"
                    ? "O sistema está operando normalmente."
                    : "Copie este relatório e envie para o suporte técnico para análise."}
`.trim();

            return res.status(200).send(report);

        } catch (error) {
            return res.status(500).send(`ERRO CRÍTICO AO GERAR RELATÓRIO: ${(error as Error).message}`);
        }
    }

    async emergencyProtocol(req: any, res: Response) {
        const { adminKey } = req.body;
        if (req.user?.role !== 'SUPER_ADMIN' && adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: "Acesso negado." });

        try {
            console.log("[EMERGENCY] Iniciando Reset Geral...");

            // 1. Queue Flush (Safe)
            try {
                await prisma.taskQueue.updateMany({
                    where: { status: "in_progress" },
                    data: { status: "failed", result: "Emergency Reset" }
                });
                await prisma.taskQueue.updateMany({
                    where: { status: "paused_emergency" },
                    data: { status: "pending" }
                });
            } catch (e) { console.error("Queue flush error:", e); }

            // 2. Agents Reset (Safe Upsert Loop)
            const agentIds = ['copy_expert', 'design_expert', 'market_monitor', 'interaction_agent', 'brand_strategy', 'agency_orchestrator'];
            for (const agentId of agentIds) {
                try {
                    await prisma.agentPerformance.upsert({
                        where: { agentId_platform: { agentId, platform: 'general' } },
                        update: { healthScore: 80, improvementTrend: 'recovering' },
                        create: {
                            agentId,
                            platform: 'general',
                            healthScore: 80,
                            engagementRate: 0, conversionRate: 0, responseTime: 0, accuracyScore: 0, improvementTrend: 'recovering'
                        }
                    });
                } catch (e) {
                    console.error(`Failed to reset ${agentId}:`, e);
                }
            }

            return res.json({ success: true, message: "SISTEMA RESTAURADO (Modo Seguro)." });
        } catch (error) {
            return res.status(500).json({ error: "Falha crítica no Reset Geral." });
        }
    }

    async resumeSystem(req: any, res: Response) {
        const { adminKey } = req.body;
        if (req.user?.role !== 'SUPER_ADMIN' && adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: "Acesso negado." });

        try {
            await prisma.taskQueue.updateMany({
                where: { status: "paused_emergency" },
                data: { status: "pending" }
            });
            await prisma.agentPerformance.updateMany({ data: { healthScore: 100 } });

            return res.json({ success: true, message: "Sistema retomado." });
        } catch (error) {
            return res.status(500).json({ error: "Falha ao retomar sistema." });
        }
    }

    async toggleCircuit(req: any, res: Response) {
        const { adminKey, circuit, action } = req.body;
        if (req.user?.role !== 'SUPER_ADMIN' && adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: "Acesso negado." });

        try {
            console.log(`[CIRCUIT] ${circuit} -> ${action}`);

            const targetStatus = action === 'pause' ? 'paused_emergency' : 'pending';
            const whereClause: any = {};
            if (circuit !== 'all') whereClause.agentId = circuit;
            if (action === 'pause') whereClause.status = 'pending';
            else whereClause.status = 'paused_emergency';

            const updatedTasks = await prisma.taskQueue.updateMany({
                where: whereClause,
                data: { status: targetStatus }
            });

            // Persistence
            const newHealth = action === 'pause' ? -1 : 100;
            const agentsToUpdate = circuit === 'all'
                ? ['copy_expert', 'design_expert', 'market_monitor', 'interaction_agent', 'brand_strategy', 'agency_orchestrator']
                : [circuit];

            for (const ag of agentsToUpdate) {
                try {
                    await prisma.agentPerformance.upsert({
                        where: { agentId_platform: { agentId: ag, platform: 'general' } },
                        update: { healthScore: newHealth },
                        create: {
                            agentId: ag,
                            platform: 'general',
                            healthScore: newHealth,
                            engagementRate: 0, conversionRate: 0, responseTime: 0, accuracyScore: 0, improvementTrend: 'manual_set'
                        }
                    });
                } catch (e) { console.error(`Error updating agent ${ag} health:`, e); }
            }

            return res.json({
                success: true,
                message: `Circuito ${circuit} ${action === 'pause' ? 'PAUSADO' : 'OPERACIONAL'}.`,
                queueUpdates: updatedTasks.count
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Falha no disjuntor." });
        }
    }

    async getSystemMetrics(req: Request, res: Response) {
        try {
            const agentsPerf = await prisma.agentPerformance.findMany();

            const agents = agentsPerf.map(a => {
                let status = 'healthy';
                if (a.healthScore === -1) status = 'paused';
                else if (a.healthScore < 50) status = 'critical';

                return {
                    id: a.agentId,
                    name: a.agentId.replace('_', ' ').toUpperCase(),
                    health: a.healthScore === -1 ? 0 : a.healthScore,
                    status: status,
                    lastReset: a.lastResetAt
                };
            });

            const pausedAgents = agents.filter(a => a.status === 'paused').length;
            const totalAgents = agents.length;

            let globalStatus = 'operational';
            // Se tivermos agentes E todos pausados
            if (totalAgents > 0 && pausedAgents >= totalAgents) globalStatus = 'paused';
            else if (pausedAgents > 0) globalStatus = 'warning';

            return res.json({
                globalStatus,
                agents,
                timestamp: new Date()
            });

        } catch (error) {
            console.error(error);
            // Return fallback data instead of 500
            return res.json({
                globalStatus: 'offline',
                agents: [],
                error: "Falha ao ler métricas"
            });
        }
    }

    async resetAgent(req: any, res: Response) {
        const { adminKey, agentId } = req.body;
        if (req.user?.role !== 'SUPER_ADMIN' && adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: "Acesso negado." });

        try {
            await prisma.taskQueue.updateMany({
                where: { agentId, status: 'in_progress' },
                data: { status: 'failed', result: 'Admin Force Reset' }
            });

            await prisma.agentPerformance.upsert({
                where: { agentId_platform: { agentId, platform: 'general' } },
                update: { healthScore: 100, lastResetAt: new Date() },
                create: {
                    agentId,
                    platform: 'general',
                    healthScore: 100,
                    lastResetAt: new Date(),
                    engagementRate: 0, conversionRate: 0, responseTime: 0, accuracyScore: 0, improvementTrend: 'reset'
                }
            });

            return res.json({ success: true, message: `Agente ${agentId} resetado.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Falha ao resetar agente." });
        }
    }
}
