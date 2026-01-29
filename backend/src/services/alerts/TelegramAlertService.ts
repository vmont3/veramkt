/**
 * Telegram Alert Service - Send alerts via Telegram Bot
 *
 * Setup:
 * 1. Create bot with @BotFather: /newbot
 * 2. Get bot token
 * 3. Add to .env: TELEGRAM_BOT_TOKEN=xxxxx
 * 4. User needs to start chat with bot and get their chat_id
 */

import axios from 'axios';

export interface TelegramAlert {
    chatId: string;  // Telegram user/group chat ID
    message: string;
    parseMode?: 'HTML' | 'Markdown';
    disableNotification?: boolean;
}

export class TelegramAlertService {
    private botToken: string;
    private apiUrl: string;

    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;

        if (!this.botToken) {
            console.warn('[TelegramAlertService] TELEGRAM_BOT_TOKEN not set. Telegram alerts disabled.');
        }
    }

    /**
     * Send alert message to Telegram
     */
    async sendAlert(alert: TelegramAlert): Promise<boolean> {
        if (!this.botToken) {
            console.warn('[TelegramAlertService] Cannot send alert - bot token not configured');
            return false;
        }

        try {
            const response = await axios.post(`${this.apiUrl}/sendMessage`, {
                chat_id: alert.chatId,
                text: alert.message,
                parse_mode: alert.parseMode || 'HTML',
                disable_notification: alert.disableNotification || false
            });

            if (response.data.ok) {
                console.log(`[TelegramAlertService] Alert sent to ${alert.chatId}`);
                return true;
            } else {
                console.error('[TelegramAlertService] Failed to send alert:', response.data);
                return false;
            }
        } catch (error: any) {
            console.error('[TelegramAlertService] Error sending alert:', error.message);
            return false;
        }
    }

    /**
     * Format hot lead alert message
     */
    formatHotLeadAlert(data: {
        visitorId: string;
        totalScore: number;
        stage: string;
        lastSeen: Date;
        highValueActions: number;
    }): string {
        return `
🔥 <b>HOT LEAD DETECTED!</b>

<b>Visitor:</b> <code>${data.visitorId.substring(0, 20)}...</code>
<b>Intent Score:</b> ${data.totalScore}/100
<b>Stage:</b> ${data.stage.toUpperCase()}
<b>High-Value Actions:</b> ${data.highValueActions}
<b>Last Seen:</b> ${data.lastSeen.toLocaleString('pt-BR')}

🚨 <b>Action Required:</b> Contact this lead immediately!
        `.trim();
    }

    /**
     * Format qualified lead alert message
     */
    formatQualifiedLeadAlert(data: {
        visitorId: string;
        totalScore: number;
        sessionCount: number;
        signalCount: number;
    }): string {
        return `
⭐ <b>QUALIFIED LEAD!</b>

<b>Visitor:</b> <code>${data.visitorId.substring(0, 20)}...</code>
<b>Intent Score:</b> ${data.totalScore}/100 ✨
<b>Sessions:</b> ${data.sessionCount}
<b>Total Signals:</b> ${data.signalCount}

💎 <b>Premium Lead:</b> Very high conversion probability!
        `.trim();
    }

    /**
     * Test connection by sending a test message
     */
    async testConnection(chatId: string): Promise<boolean> {
        return this.sendAlert({
            chatId,
            message: '✅ <b>VERA Alert System Connected!</b>\n\nYou will now receive hot lead notifications here.',
            parseMode: 'HTML'
        });
    }

    /**
     * Get bot info
     */
    async getBotInfo(): Promise<any> {
        if (!this.botToken) {
            return null;
        }

        try {
            const response = await axios.get(`${this.apiUrl}/getMe`);
            return response.data.result;
        } catch (error) {
            console.error('[TelegramAlertService] Error getting bot info:', error);
            return null;
        }
    }
}

// Singleton
export const telegramAlertService = new TelegramAlertService();
