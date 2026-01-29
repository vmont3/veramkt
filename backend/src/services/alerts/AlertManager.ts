/**
 * Alert Manager - Coordinates all alert channels with rate limiting
 *
 * Features:
 * - Multi-channel alerts (Telegram, Slack, Email)
 * - Rate limiting (prevents spam)
 * - Alert history logging
 * - Retry logic for failed alerts
 */

import { telegramAlertService } from './TelegramAlertService';
import { slackAlertService } from './SlackAlertService';
import { emailAlertService } from './EmailAlertService';
import { prisma } from '../../database/prismaClient';

export interface HotLeadData {
    userId: string;
    visitorId: string;
    totalScore: number;
    stage: string;
    lastSeen: Date;
    sessionCount: number;
    signalCount: number;
    highValueActions: number;
}

export interface AlertSettings {
    telegram?: {
        enabled: boolean;
        chatId?: string;
    };
    slack?: {
        enabled: boolean;
        webhookUrl?: string;
    };
    email?: {
        enabled: boolean;
        address?: string;
    };
}

export class AlertManager {
    private alertCache: Map<string, number> = new Map(); // visitorId -> lastAlertTimestamp
    private readonly RATE_LIMIT_MINUTES = 60; // Don't alert same visitor twice within 1 hour

    /**
     * Send hot lead alert to all enabled channels
     */
    async sendHotLeadAlert(
        data: HotLeadData,
        settings: AlertSettings
    ): Promise<{ success: boolean; channels: string[] }> {
        // Check rate limiting
        if (this.isRateLimited(data.visitorId)) {
            console.log(`[AlertManager] Rate limited: visitor ${data.visitorId} already alerted recently`);
            return { success: false, channels: [] };
        }

        const channels: string[] = [];
        let anySuccess = false;

        // Send to Telegram
        if (settings.telegram?.enabled && settings.telegram.chatId) {
            try {
                const message = telegramAlertService.formatHotLeadAlert(data);
                const sent = await telegramAlertService.sendAlert({
                    chatId: settings.telegram.chatId,
                    message,
                    parseMode: 'HTML'
                });

                if (sent) {
                    channels.push('telegram');
                    anySuccess = true;
                }
            } catch (error) {
                console.error('[AlertManager] Telegram alert failed:', error);
            }
        }

        // Send to Slack
        if (settings.slack?.enabled && settings.slack.webhookUrl) {
            try {
                const message = slackAlertService.formatHotLeadAlert(data);
                const sent = await slackAlertService.sendAlert({
                    webhookUrl: settings.slack.webhookUrl,
                    message
                });

                if (sent) {
                    channels.push('slack');
                    anySuccess = true;
                }
            } catch (error) {
                console.error('[AlertManager] Slack alert failed:', error);
            }
        }

        // Send to Email
        if (settings.email?.enabled && settings.email.address) {
            try {
                const emailContent = emailAlertService.formatHotLeadAlert({
                    ...data,
                    dashboardUrl: `https://vera.ai/painel/hot-leads?visitor=${data.visitorId}`
                });

                const sent = await emailAlertService.sendAlert({
                    to: settings.email.address,
                    ...emailContent
                });

                if (sent) {
                    channels.push('email');
                    anySuccess = true;
                }
            } catch (error) {
                console.error('[AlertManager] Email alert failed:', error);
            }
        }

        // Update rate limit cache if any alert was sent
        if (anySuccess) {
            this.alertCache.set(data.visitorId, Date.now());

            // Log alert to database
            await this.logAlert(data, channels);
        }

        return { success: anySuccess, channels };
    }

    /**
     * Check if visitor was already alerted recently (rate limiting)
     */
    private isRateLimited(visitorId: string): boolean {
        const lastAlert = this.alertCache.get(visitorId);

        if (!lastAlert) {
            return false;
        }

        const timeSinceLastAlert = Date.now() - lastAlert;
        const rateLimitMs = this.RATE_LIMIT_MINUTES * 60 * 1000;

        return timeSinceLastAlert < rateLimitMs;
    }

    /**
     * Log alert to database for audit trail
     */
    private async logAlert(data: HotLeadData, channels: string[]): Promise<void> {
        try {
            // TODO: Create AlertLog model in Prisma schema
            console.log(`[AlertManager] Alert sent for visitor ${data.visitorId} via: ${channels.join(', ')}`);

            // For now, log to CreditTransaction as metadata
            await prisma.creditTransaction.create({
                data: {
                    userId: data.userId,
                    amount: 0,
                    type: 'USAGE',
                    description: `Hot lead alert sent`,
                    metadata: JSON.stringify({
                        type: 'hot_lead_alert',
                        visitorId: data.visitorId,
                        totalScore: data.totalScore,
                        stage: data.stage,
                        channels: channels,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        } catch (error) {
            console.error('[AlertManager] Failed to log alert:', error);
        }
    }

    /**
     * Get alert settings for a user
     */
    async getUserAlertSettings(userId: string): Promise<AlertSettings> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                return {};
            }

            // TODO: Store alert settings in User model or separate table
            // For now, return default settings
            return {
                telegram: {
                    enabled: false
                },
                slack: {
                    enabled: false
                },
                email: {
                    enabled: true,
                    address: user.email
                }
            };
        } catch (error) {
            console.error('[AlertManager] Error getting alert settings:', error);
            return {};
        }
    }

    /**
     * Test all configured alert channels
     */
    async testAlertChannels(userId: string, settings: AlertSettings): Promise<{
        telegram: boolean;
        slack: boolean;
        email: boolean;
    }> {
        const results = {
            telegram: false,
            slack: false,
            email: false
        };

        // Test Telegram
        if (settings.telegram?.enabled && settings.telegram.chatId) {
            results.telegram = await telegramAlertService.testConnection(settings.telegram.chatId);
        }

        // Test Slack
        if (settings.slack?.enabled && settings.slack.webhookUrl) {
            results.slack = await slackAlertService.testConnection(settings.slack.webhookUrl);
        }

        // Test Email
        if (settings.email?.enabled && settings.email.address) {
            results.email = await emailAlertService.testConnection(settings.email.address);
        }

        return results;
    }

    /**
     * Clear rate limit cache (for testing or manual override)
     */
    clearRateLimitCache(visitorId?: string): void {
        if (visitorId) {
            this.alertCache.delete(visitorId);
        } else {
            this.alertCache.clear();
        }
    }
}

// Singleton
export const alertManager = new AlertManager();
