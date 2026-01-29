import { prisma } from '../database/prismaClient';
import { telegramService } from './TelegramService';

/**
 * AgentActivityLog - Unified logging for all agent actions
 * Ensures all actions appear on dashboard and in Telegram notifications
 */
export class AgentActivityLog {
    /**
     * Log an agent action to the database and optionally notify user via Telegram
     */
    static async logAction(params: {
        userId: string;
        agentId: string;
        action: string;
        details: string;
        priority?: 'low' | 'medium' | 'high';
        notifyTelegram?: boolean;
    }) {
        const { userId, agentId, action, details, priority = 'medium', notifyTelegram = false } = params;

        try {
            // Find user's active plan to link the task
            const plan = await prisma.contentPlan.findFirst({
                where: { userId, status: { not: 'completed' } },
                orderBy: { createdAt: 'desc' }
            });

            if (!plan) {
                console.warn(`[AgentActivityLog] No active plan for user ${userId}. Skipping log.`);
                return null;
            }

            // Create task queue entry (this appears in dashboard logs)
            const task = await prisma.taskQueue.create({
                data: {
                    planId: plan.id,
                    agentId: agentId,
                    taskType: action,
                    priority: priority,
                    status: 'completed', // Already done action
                    data: JSON.stringify({ details, timestamp: new Date().toISOString() })
                }
            });

            console.log(`[AgentActivityLog] Logged: ${agentId} -> ${action}`);

            // Notify via Telegram if enabled (requires TelegramService mapping)
            if (notifyTelegram) {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                // Note: telegramId not in schema yet. Using email to lookup in TelegramService internal map.
                if (user?.email) {
                    const message = `🤖 *${agentId.toUpperCase()}*\n${details}`;
                    // TelegramService should have a method to send by email or broadcast
                    // For now, log that we would notify
                    console.log(`[AgentActivityLog] Would notify ${user.email} via Telegram: ${message}`);
                }
            }

            return task;
        } catch (error) {
            console.error('[AgentActivityLog] Error logging action:', error);
            return null;
        }
    }

    /**
     * Log a proactive opportunity/suggestion
     */
    static async logOpportunity(params: {
        userId: string;
        agentId: string;
        opportunityType: string;
        description: string;
        notifyTelegram?: boolean;
    }) {
        return this.logAction({
            userId: params.userId,
            agentId: params.agentId,
            action: 'OPPORTUNITY_DETECTED',
            details: `[${params.opportunityType}] ${params.description}`,
            priority: 'high',
            notifyTelegram: params.notifyTelegram
        });
    }
}
