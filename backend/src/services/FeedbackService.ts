import { prisma } from '../database/prismaClient';

/**
 * FeedbackService - Dopamine Feedback Loop
 * Manages agent learning signals for continuous improvement
 */
export class FeedbackService {
    /**
     * Inject a feedback signal (dopamine or pain)
     */
    static async injectFeedback(params: {
        agentId: string;
        userId: string;
        type: 'dopamine' | 'pain';
        reason: string;
        source: 'auto' | 'manual';
        taskId?: string;
        score?: number;
    }) {
        const { agentId, userId, type, reason, source, taskId, score = 1.0 } = params;

        const feedback = await prisma.agentFeedback.create({
            data: {
                agentId,
                userId,
                type,
                reason,
                source,
                taskId,
                score
            }
        });

        console.log(`[FeedbackService] ${type.toUpperCase()} signal injected for ${agentId}: ${reason}`);
        return feedback;
    }

    /**
     * Get agent health score (ratio of dopamine vs pain)
     * Returns 0-100 score based on recent feedback (last 30 days)
     */
    static async getAgentHealth(agentId: string, userId: string): Promise<{
        score: number;
        dopamineCount: number;
        painCount: number;
        trend: 'improving' | 'declining' | 'stable';
    }> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const feedback = await prisma.agentFeedback.findMany({
            where: {
                agentId,
                userId,
                createdAt: { gte: thirtyDaysAgo }
            },
            orderBy: { createdAt: 'desc' }
        });

        const dopamineCount = feedback.filter(f => f.type === 'dopamine').reduce((acc, f) => acc + f.score, 0);
        const painCount = feedback.filter(f => f.type === 'pain').reduce((acc, f) => acc + f.score, 0);
        const total = dopamineCount + painCount;

        // Calculate score (0-100)
        const score = total > 0 ? Math.round((dopamineCount / total) * 100) : 50; // Default 50 if no data

        // Calculate trend based on last 7 days vs previous 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentFeedback = feedback.filter(f => f.createdAt >= sevenDaysAgo);
        const olderFeedback = feedback.filter(f => f.createdAt < sevenDaysAgo && f.createdAt >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));

        const recentDopamine = recentFeedback.filter(f => f.type === 'dopamine').length;
        const olderDopamine = olderFeedback.filter(f => f.type === 'dopamine').length;

        let trend: 'improving' | 'declining' | 'stable' = 'stable';
        if (recentDopamine > olderDopamine + 2) trend = 'improving';
        else if (recentDopamine < olderDopamine - 2) trend = 'declining';

        return {
            score,
            dopamineCount: Math.round(dopamineCount),
            painCount: Math.round(painCount),
            trend
        };
    }

    /**
     * Get all agent health scores for a user
     */
    static async getAllAgentHealth(userId: string): Promise<Record<string, { score: number; trend: string }>> {
        // Get unique agents for this user
        const agents = await prisma.agentFeedback.groupBy({
            by: ['agentId'],
            where: { userId }
        });

        const healthMap: Record<string, { score: number; trend: string }> = {};

        for (const agent of agents) {
            const health = await this.getAgentHealth(agent.agentId, userId);
            healthMap[agent.agentId] = { score: health.score, trend: health.trend };
        }

        return healthMap;
    }

    /**
     * Auto-inject dopamine after successful task completion
     */
    static async autoReward(params: {
        agentId: string;
        userId: string;
        taskId: string;
        successMetric: string;
        value: number;
        threshold: number;
    }) {
        const { agentId, userId, taskId, successMetric, value, threshold } = params;

        if (value >= threshold) {
            await this.injectFeedback({
                agentId,
                userId,
                type: 'dopamine',
                reason: `${successMetric} atingiu ${value} (meta: ${threshold})`,
                source: 'auto',
                taskId,
                score: Math.min(value / threshold, 2.0) // Max 2x reward
            });
        }
    }

    /**
     * Auto-inject pain after failed task
     */
    static async autoPenalty(params: {
        agentId: string;
        userId: string;
        taskId: string;
        failureReason: string;
    }) {
        await this.injectFeedback({
            agentId: params.agentId,
            userId: params.userId,
            type: 'pain',
            reason: params.failureReason,
            source: 'auto',
            taskId: params.taskId,
            score: 1.0
        });
    }
}
