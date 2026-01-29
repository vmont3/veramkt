/**
 * Slack Alert Service - Send alerts via Slack Incoming Webhooks
 *
 * Setup:
 * 1. Go to https://api.slack.com/messaging/webhooks
 * 2. Create Incoming Webhook
 * 3. Get webhook URL
 * 4. Configure in user settings
 */

import axios from 'axios';

export interface SlackAlert {
    webhookUrl: string;
    message: string;
    username?: string;
    iconEmoji?: string;
}

export class SlackAlertService {
    /**
     * Send alert message to Slack
     */
    async sendAlert(alert: SlackAlert): Promise<boolean> {
        if (!alert.webhookUrl) {
            console.warn('[SlackAlertService] Cannot send alert - webhook URL not provided');
            return false;
        }

        try {
            const payload = {
                text: alert.message,
                username: alert.username || 'VERA Bot',
                icon_emoji: alert.iconEmoji || ':fire:'
            };

            const response = await axios.post(alert.webhookUrl, payload);

            if (response.status === 200) {
                console.log('[SlackAlertService] Alert sent successfully');
                return true;
            } else {
                console.error('[SlackAlertService] Failed to send alert:', response.status);
                return false;
            }
        } catch (error: any) {
            console.error('[SlackAlertService] Error sending alert:', error.message);
            return false;
        }
    }

    /**
     * Format hot lead alert with Slack blocks
     */
    formatHotLeadAlert(data: {
        visitorId: string;
        totalScore: number;
        stage: string;
        lastSeen: Date;
        highValueActions: number;
    }): string {
        return `
:fire: *HOT LEAD DETECTED!*

*Visitor:* \`${data.visitorId.substring(0, 20)}...\`
*Intent Score:* ${data.totalScore}/100
*Stage:* ${data.stage.toUpperCase()}
*High-Value Actions:* ${data.highValueActions}
*Last Seen:* ${data.lastSeen.toLocaleString('pt-BR')}

:rotating_light: *Action Required:* Contact this lead immediately!
        `.trim();
    }

    /**
     * Format qualified lead alert
     */
    formatQualifiedLeadAlert(data: {
        visitorId: string;
        totalScore: number;
        sessionCount: number;
        signalCount: number;
    }): string {
        return `
:star: *QUALIFIED LEAD!*

*Visitor:* \`${data.visitorId.substring(0, 20)}...\`
*Intent Score:* ${data.totalScore}/100 :sparkles:
*Sessions:* ${data.sessionCount}
*Total Signals:* ${data.signalCount}

:gem: *Premium Lead:* Very high conversion probability!
        `.trim();
    }

    /**
     * Test connection by sending a test message
     */
    async testConnection(webhookUrl: string): Promise<boolean> {
        return this.sendAlert({
            webhookUrl,
            message: ':white_check_mark: *VERA Alert System Connected!*\n\nYou will now receive hot lead notifications here.'
        });
    }
}

// Singleton
export const slackAlertService = new SlackAlertService();
