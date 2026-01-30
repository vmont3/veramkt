/**
 * Buyer Signal Tracker - Real-Time Intent Detection
 *
 * Killer Feature #2: Warmly-style buyer signals
 * - Track website behavior in real-time
 * - Detect buying intent
 * - Alert sales team instantly
 * - Intent scoring algorithm
 *
 * Signals Tracked:
 * - Page views (especially pricing, product pages)
 * - Time on site
 * - Repeat visits
 * - Form interactions
 * - Button clicks (CTA)
 * - Search queries
 * - Email opens/clicks
 * - Social media engagement
 */

import { prisma } from '../../database/prismaClient';
import { EventEmitter } from 'events';
import { alertManager } from '../alerts/AlertManager';

export interface BuyerSignal {
    id: string;
    visitorId: string;
    sessionId: string;
    userId?: string;               // If identified
    type: SignalType;
    source: SignalSource;
    data: any;
    intentScore: number;           // 0-100
    timestamp: Date;
    metadata: {
        page?: string;
        referrer?: string;
        device?: string;
        location?: string;
        company?: string;           // IP lookup
    };
}

export enum SignalType {
    PAGE_VIEW = 'page_view',
    TIME_ON_PAGE = 'time_on_page',
    FORM_INTERACTION = 'form_interaction',
    BUTTON_CLICK = 'button_click',
    DOWNLOAD = 'download',
    VIDEO_WATCH = 'video_watch',
    CHAT_MESSAGE = 'chat_message',
    EMAIL_OPEN = 'email_open',
    EMAIL_CLICK = 'email_click',
    SOCIAL_ENGAGEMENT = 'social_engagement',
    REPEAT_VISIT = 'repeat_visit',
    SEARCH_QUERY = 'search_query'
}

export enum SignalSource {
    WEBSITE = 'website',
    EMAIL = 'email',
    SOCIAL = 'social',
    AD = 'ad',
    DIRECT = 'direct'
}

export interface IntentProfile {
    visitorId: string;
    identifiedUser?: {
        email?: string;
        name?: string;
        company?: string;
    };
    totalScore: number;            // Sum of all signals
    scoreBreakdown: Record<SignalType, number>;
    firstSeen: Date;
    lastSeen: Date;
    sessionCount: number;
    signals: BuyerSignal[];
    stage: 'cold' | 'warm' | 'hot' | 'qualified';
    recommendations: string[];
}

export interface AlertConfig {
    minScore: number;
    channels: ('telegram' | 'slack' | 'email' | 'webhook')[];
    recipients: string[];
}

export class BuyerSignalTracker extends EventEmitter {
    private signalWeights: Record<SignalType, number> = {
        [SignalType.PAGE_VIEW]: 1,
        [SignalType.TIME_ON_PAGE]: 2,
        [SignalType.FORM_INTERACTION]: 15,
        [SignalType.BUTTON_CLICK]: 5,
        [SignalType.DOWNLOAD]: 10,
        [SignalType.VIDEO_WATCH]: 8,
        [SignalType.CHAT_MESSAGE]: 12,
        [SignalType.EMAIL_OPEN]: 3,
        [SignalType.EMAIL_CLICK]: 7,
        [SignalType.SOCIAL_ENGAGEMENT]: 4,
        [SignalType.REPEAT_VISIT]: 10,
        [SignalType.SEARCH_QUERY]: 3
    };

    private highIntentPages = [
        '/pricing',
        '/plans',
        '/demo',
        '/contact',
        '/trial',
        '/signup',
        '/checkout',
        '/compare',
        '/features'
    ];

    /**
     * Track a new signal
     */
    async trackSignal(signal: Omit<BuyerSignal, 'id' | 'intentScore'>): Promise<BuyerSignal> {
        // Calculate intent score
        const baseScore = this.signalWeights[signal.type] || 1;
        const pageMultiplier = this.getPageMultiplier(signal.metadata.page);
        const intentScore = Math.min(100, baseScore * pageMultiplier);

        const fullSignal: BuyerSignal = {
            ...signal,
            id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            intentScore,
            timestamp: new Date()
        };

        try {
            // Save to database
            await prisma.buyerSignal.create({
                data: {
                    visitorId: fullSignal.visitorId,
                    sessionId: fullSignal.sessionId,
                    userId: fullSignal.userId,
                    type: fullSignal.type,
                    source: fullSignal.source,
                    data: JSON.stringify(fullSignal.data),
                    intentScore: fullSignal.intentScore,
                    metadata: JSON.stringify(fullSignal.metadata),
                    timestamp: fullSignal.timestamp
                }
            });

            // Update visitor profile
            await this.updateVisitorProfile(fullSignal);

            // Check if should alert
            await this.checkAndAlert(fullSignal.visitorId);

            // Emit event for real-time processing
            this.emit('signal', fullSignal);

            console.log(`[BuyerSignals] Tracked: ${signal.type} (score: ${intentScore}) - Visitor: ${signal.visitorId}`);

            return fullSignal;

        } catch (error) {
            console.error('[BuyerSignals] Error tracking signal:', error);
            throw error;
        }
    }

    /**
     * Get intent profile for a visitor
     */
    async getIntentProfile(visitorId: string): Promise<IntentProfile> {
        try {
            // Fetch all signals for visitor
            const signals = await prisma.buyerSignal.findMany({
                where: { visitorId },
                orderBy: { timestamp: 'desc' },
                take: 100
            });

            if (signals.length === 0) {
                throw new Error('Visitor not found');
            }

            // Calculate scores
            const totalScore = signals.reduce((sum, s) => sum + s.intentScore, 0);
            const scoreBreakdown = signals.reduce((acc, s) => {
                acc[s.type as SignalType] = (acc[s.type as SignalType] || 0) + s.intentScore;
                return acc;
            }, {} as Record<SignalType, number>);

            // Determine stage
            const stage = this.determineStage(totalScore, signals.length);

            // Generate recommendations
            const recommendations = this.generateRecommendations(signals, stage);

            // Count unique sessions
            const uniqueSessions = new Set(signals.map(s => s.sessionId)).size;

            // Try to find identified user
            const identifiedSignal = signals.find(s => s.userId);
            let identifiedUser = undefined;

            if (identifiedSignal?.userId) {
                const user = await prisma.user.findUnique({
                    where: { id: identifiedSignal.userId },
                    select: { email: true, name: true }
                });

                if (user) {
                    identifiedUser = {
                        email: user.email,
                        name: user.name || undefined,
                        company: undefined // Would come from enrichment
                    };
                }
            }

            return {
                visitorId,
                identifiedUser,
                totalScore,
                scoreBreakdown,
                firstSeen: signals[signals.length - 1].timestamp,
                lastSeen: signals[0].timestamp,
                sessionCount: uniqueSessions,
                signals: signals.map(s => ({
                    id: s.id,
                    visitorId: s.visitorId,
                    sessionId: s.sessionId,
                    userId: s.userId || undefined,
                    type: s.type as SignalType,
                    source: s.source as SignalSource,
                    data: JSON.parse(s.data as string),
                    intentScore: s.intentScore,
                    timestamp: s.timestamp,
                    metadata: JSON.parse(s.metadata as string)
                })),
                stage,
                recommendations
            };

        } catch (error) {
            console.error('[BuyerSignals] Error getting profile:', error);
            throw error;
        }
    }

    /**
     * Get hot leads (high intent visitors)
     */
    async getHotLeads(userId: string, minScore: number = 50): Promise<IntentProfile[]> {
        try {
            // Get all unique visitors with signals
            const visitorIds = await prisma.buyerSignal.findMany({
                where: {
                    user: { id: userId }
                },
                select: { visitorId: true },
                distinct: ['visitorId']
            });

            const profiles: IntentProfile[] = [];

            for (const { visitorId } of visitorIds) {
                try {
                    const profile = await this.getIntentProfile(visitorId);

                    if (profile.totalScore >= minScore) {
                        profiles.push(profile);
                    }
                } catch (error) {
                    // Skip visitor if error
                    continue;
                }
            }

            // Sort by score descending
            return profiles.sort((a, b) => b.totalScore - a.totalScore);

        } catch (error) {
            console.error('[BuyerSignals] Error getting hot leads:', error);
            return [];
        }
    }

    /**
     * Update visitor profile in real-time
     */
    private async updateVisitorProfile(signal: BuyerSignal): Promise<void> {
        try {
            // Check if profile exists
            let profile = await prisma.visitorProfile.findUnique({
                where: { visitorId: signal.visitorId }
            });

            const totalScore = await this.calculateTotalScore(signal.visitorId);
            const sessionCount = await this.countSessions(signal.visitorId);

            if (profile) {
                // Update existing
                await prisma.visitorProfile.update({
                    where: { visitorId: signal.visitorId },
                    data: {
                        lastSeen: signal.timestamp,
                        totalScore,
                        sessionCount,
                        stage: this.determineStage(totalScore, sessionCount)
                    }
                });
            } else {
                // Create new
                await prisma.visitorProfile.create({
                    data: {
                        visitorId: signal.visitorId,
                        userId: signal.userId,
                        firstSeen: signal.timestamp,
                        lastSeen: signal.timestamp,
                        totalScore,
                        sessionCount,
                        stage: this.determineStage(totalScore, sessionCount)
                    }
                });
            }

        } catch (error) {
            console.error('[BuyerSignals] Error updating profile:', error);
        }
    }

    /**
     * Calculate total score for visitor
     */
    private async calculateTotalScore(visitorId: string): Promise<number> {
        const result = await prisma.buyerSignal.aggregate({
            where: { visitorId },
            _sum: { intentScore: true }
        });

        return result._sum.intentScore || 0;
    }

    /**
     * Count unique sessions
     */
    private async countSessions(visitorId: string): Promise<number> {
        const sessions = await prisma.buyerSignal.findMany({
            where: { visitorId },
            select: { sessionId: true },
            distinct: ['sessionId']
        });

        return sessions.length;
    }

    /**
     * Determine visitor stage based on score
     */
    private determineStage(totalScore: number, sessionCount: number): IntentProfile['stage'] {
        if (totalScore >= 80 || sessionCount >= 5) {
            return 'qualified';
        } else if (totalScore >= 50 || sessionCount >= 3) {
            return 'hot';
        } else if (totalScore >= 20 || sessionCount >= 2) {
            return 'warm';
        } else {
            return 'cold';
        }
    }

    /**
     * Generate action recommendations
     */
    private generateRecommendations(signals: any[], stage: IntentProfile['stage']): string[] {
        const recommendations: string[] = [];

        // Check for pricing page views
        const viewedPricing = signals.some(s =>
            s.metadata?.page?.includes('/pricing') ||
            s.metadata?.page?.includes('/plans')
        );

        if (viewedPricing) {
            recommendations.push('Visitor viewed pricing - Consider offering demo or trial');
        }

        // Check for repeat visits
        const uniqueDays = new Set(signals.map(s =>
            new Date(s.timestamp).toDateString()
        )).size;

        if (uniqueDays >= 3) {
            recommendations.push('Multiple visits over several days - High buying intent');
        }

        // Check for form interactions
        const hasFormInteraction = signals.some(s => s.type === SignalType.FORM_INTERACTION);

        if (hasFormInteraction) {
            recommendations.push('Started form - Follow up within 1 hour');
        }

        // Stage-specific recommendations
        if (stage === 'qualified') {
            recommendations.push('🔥 HOT LEAD - Contact immediately via phone or email');
        } else if (stage === 'hot') {
            recommendations.push('Send personalized email with case study');
        } else if (stage === 'warm') {
            recommendations.push('Add to nurture campaign');
        }

        return recommendations;
    }

    /**
     * Check if should alert and send notification
     */
    private async checkAndAlert(visitorId: string): Promise<void> {
        try {
            const profile = await this.getIntentProfile(visitorId);

            // Alert thresholds
            const shouldAlert = profile.stage === 'hot' || profile.stage === 'qualified';

            // Find the userId from the signals
            const userSignal = profile.signals.find(s => s.userId);
            const userId = userSignal?.userId;

            if (shouldAlert && userId) {
                // Get alert settings for user
                const settings = await alertManager.getUserAlertSettings(userId);

                // Calculate high value actions (form interactions, downloads, chat messages)
                const highValueActions = profile.signals.filter(s =>
                    s.type === SignalType.FORM_INTERACTION ||
                    s.type === SignalType.DOWNLOAD ||
                    s.type === SignalType.CHAT_MESSAGE
                ).length;

                // Prepare hot lead data
                const hotLeadData = {
                    userId: userId,
                    visitorId: profile.visitorId,
                    totalScore: profile.totalScore,
                    stage: profile.stage,
                    lastSeen: new Date(profile.lastSeen),
                    sessionCount: profile.sessionCount,
                    signalCount: profile.signals.length,
                    highValueActions: highValueActions
                };

                // Send alert through AlertManager (with rate limiting)
                const result = await alertManager.sendHotLeadAlert(hotLeadData, settings);

                if (result.success) {
                    console.log(`[BuyerSignals] 🔥 Alert sent for hot lead: ${visitorId} via ${result.channels.join(', ')}`);

                    // Emit alert event
                    this.emit('hot_lead', profile);
                }
            }

        } catch (error) {
            console.error('[BuyerSignals] Error checking alert:', error);
        }
    }

    /**
     * Send alert to configured channels
     */
    private async sendAlert(profile: IntentProfile, config: AlertConfig): Promise<void> {
        const message = this.formatAlertMessage(profile);

        // Send to each configured channel
        for (const channel of config.channels) {
            try {
                switch (channel) {
                    case 'telegram':
                        await this.sendTelegramAlert(message, config.recipients);
                        break;
                    case 'slack':
                        await this.sendSlackAlert(message, config.recipients);
                        break;
                    case 'email':
                        await this.sendEmailAlert(message, config.recipients);
                        break;
                    case 'webhook':
                        await this.sendWebhookAlert(profile, config.recipients);
                        break;
                }
            } catch (error) {
                console.error(`[BuyerSignals] Error sending ${channel} alert:`, error);
            }
        }

        console.log(`[BuyerSignals] 🔥 Alert sent for hot lead: ${profile.visitorId}`);
    }

    /**
     * Format alert message
     */
    private formatAlertMessage(profile: IntentProfile): string {
        const emoji = profile.stage === 'qualified' ? '🔥🔥🔥' : '🔥';

        return `
${emoji} HOT LEAD DETECTED

Visitor: ${profile.identifiedUser?.name || profile.visitorId}
${profile.identifiedUser?.email ? `Email: ${profile.identifiedUser.email}` : ''}
${profile.identifiedUser?.company ? `Company: ${profile.identifiedUser.company}` : ''}

Intent Score: ${profile.totalScore} (${profile.stage.toUpperCase()})
Sessions: ${profile.sessionCount}
Last Seen: ${profile.lastSeen.toLocaleString()}

Top Actions:
${Object.entries(profile.scoreBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, score]) => `• ${type}: ${score}`)
    .join('\n')}

Recommendations:
${profile.recommendations.map(r => `• ${r}`).join('\n')}

View Profile: [Dashboard Link]
        `.trim();
    }

    /**
     * Send Telegram alert
     */
    private async sendTelegramAlert(message: string, recipients: string[]): Promise<void> {
        // Integration with Telegram Bot API
        // Would use telegram bot token + chat IDs
        console.log('[BuyerSignals] Telegram alert:', message);
    }

    /**
     * Send Slack alert
     */
    private async sendSlackAlert(message: string, recipients: string[]): Promise<void> {
        // Integration with Slack Webhook
        console.log('[BuyerSignals] Slack alert:', message);
    }

    /**
     * Send Email alert
     */
    private async sendEmailAlert(message: string, recipients: string[]): Promise<void> {
        // Integration with email service
        console.log('[BuyerSignals] Email alert:', message);
    }

    /**
     * Send Webhook alert
     */
    private async sendWebhookAlert(profile: IntentProfile, webhookUrls: string[]): Promise<void> {
        // POST to webhook URLs
        console.log('[BuyerSignals] Webhook alert:', profile.visitorId);
    }

    /**
     * Get page multiplier for intent scoring
     */
    private getPageMultiplier(page?: string): number {
        if (!page) return 1;

        // High intent pages get higher multiplier
        if (this.highIntentPages.some(p => page.includes(p))) {
            return 3;
        }

        // Blog/content pages get lower multiplier
        if (page.includes('/blog') || page.includes('/article')) {
            return 0.5;
        }

        return 1;
    }

    /**
     * Batch process signals (for analytics)
     */
    async batchProcessSignals(userId: string, startDate: Date, endDate: Date): Promise<{
        totalSignals: number;
        uniqueVisitors: number;
        hotLeads: number;
        qualifiedLeads: number;
        topPages: Array<{ page: string; count: number }>;
        conversionFunnel: any;
    }> {
        try {
            const signals = await prisma.buyerSignal.findMany({
                where: {
                    user: { id: userId },
                    timestamp: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            });

            const uniqueVisitors = new Set(signals.map(s => s.visitorId)).size;

            // Count by stage
            const profiles = await this.getHotLeads(userId, 0);
            const hotLeads = profiles.filter(p => p.stage === 'hot').length;
            const qualifiedLeads = profiles.filter(p => p.stage === 'qualified').length;

            // Top pages
            const pageViews = signals
                .filter(s => s.type === SignalType.PAGE_VIEW)
                .map(s => JSON.parse(s.metadata as string).page)
                .filter(Boolean);

            const pageCounts: Record<string, number> = {};
            pageViews.forEach(page => {
                pageCounts[page] = (pageCounts[page] || 0) + 1;
            });

            const topPages = Object.entries(pageCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([page, count]) => ({ page, count }));

            return {
                totalSignals: signals.length,
                uniqueVisitors,
                hotLeads,
                qualifiedLeads,
                topPages,
                conversionFunnel: {} // Would calculate funnel stages
            };

        } catch (error) {
            console.error('[BuyerSignals] Error in batch processing:', error);
            throw error;
        }
    }
}

// Singleton
export const buyerSignalTracker = new BuyerSignalTracker();
