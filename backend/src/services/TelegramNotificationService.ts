import axios from 'axios';
import FormData from 'form-data';

interface TelegramMessage {
    text: string;
    parse_mode?: 'HTML' | 'Markdown';
}

interface LeadData {
    name?: string;
    email: string;
    phone?: string;
    cnpj?: string;
    company?: string;
    message?: string;
    source: 'signup' | 'contact' | 'pricing' | 'chat';
}

export class TelegramNotificationService {
    private botToken: string;
    private chatId: string;
    private baseUrl: string;

    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
        this.chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
        this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;

        if (!this.botToken || !this.chatId) {
            console.warn('⚠️ [TelegramNotification] Bot Token ou Chat ID não configurados');
        }
    }

    /**
     * Envia notificação de novo lead
     */
    async notifyNewLead(leadData: LeadData): Promise<void> {
        if (!this.botToken || !this.chatId) return;

        const emoji = this.getSourceEmoji(leadData.source);
        const sourceName = this.getSourceName(leadData.source);

        let message = `${emoji} <b>NOVO LEAD - ${sourceName}</b>\n\n`;

        if (leadData.name) {
            message += `👤 <b>Nome:</b> ${leadData.name}\n`;
        }

        message += `📧 <b>Email:</b> ${leadData.email}\n`;

        if (leadData.phone) {
            message += `📱 <b>Telefone:</b> ${leadData.phone}\n`;
        }

        if (leadData.cnpj) {
            message += `🏢 <b>CNPJ:</b> ${leadData.cnpj}\n`;
        }

        if (leadData.company) {
            message += `🏪 <b>Empresa:</b> ${leadData.company}\n`;
        }

        if (leadData.message) {
            message += `\n💬 <b>Mensagem:</b>\n${leadData.message}\n`;
        }

        message += `\n⏰ <b>Data:</b> ${new Date().toLocaleString('pt-BR')}\n`;
        message += `🌐 <b>Origem:</b> VERA Platform`;

        await this.sendMessage(message);
    }

    /**
     * Notifica novo cadastro/signup
     */
    async notifySignup(userData: { email: string; name?: string; cnpj?: string; referralCode?: string }): Promise<void> {
        const leadData: LeadData = {
            email: userData.email,
            name: userData.name,
            cnpj: userData.cnpj,
            source: 'signup'
        };

        let customMessage = `🎉 <b>NOVO CADASTRO NA PLATAFORMA!</b>\n\n`;
        customMessage += `👤 <b>Email:</b> ${userData.email}\n`;

        if (userData.name) {
            customMessage += `📛 <b>Nome:</b> ${userData.name}\n`;
        }

        if (userData.cnpj) {
            customMessage += `🏢 <b>CNPJ:</b> ${userData.cnpj}\n`;
        }

        if (userData.referralCode) {
            customMessage += `🔗 <b>Código Referência:</b> ${userData.referralCode}\n`;
        }

        customMessage += `\n✅ <b>Plano Inicial:</b> Free (300 VC)\n`;
        customMessage += `⏰ <b>Data:</b> ${new Date().toLocaleString('pt-BR')}`;

        await this.sendMessage(customMessage);
    }

    /**
     * Notifica mensagem do formulário de contato
     */
    async notifyContactForm(contactData: {
        name: string;
        email: string;
        phone?: string;
        company?: string;
        message: string;
    }): Promise<void> {
        const leadData: LeadData = {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            company: contactData.company,
            message: contactData.message,
            source: 'contact'
        };

        await this.notifyNewLead(leadData);
    }

    /**
     * Notifica intenção de compra (clique em upgrade/compra de créditos)
     */
    async notifyPurchaseIntent(userData: {
        email: string;
        name?: string;
        plan?: string;
        amount?: number;
    }): Promise<void> {
        let message = `💰 <b>INTENÇÃO DE COMPRA</b>\n\n`;
        message += `👤 <b>Email:</b> ${userData.email}\n`;

        if (userData.name) {
            message += `📛 <b>Nome:</b> ${userData.name}\n`;
        }

        if (userData.plan) {
            message += `📦 <b>Plano:</b> ${userData.plan}\n`;
        }

        if (userData.amount) {
            message += `💵 <b>Valor:</b> R$ ${userData.amount.toFixed(2)}\n`;
        }

        message += `\n⏰ <b>Data:</b> ${new Date().toLocaleString('pt-BR')}\n`;
        message += `⚠️ <b>Status:</b> Aguardando Pagamento`;

        await this.sendMessage(message);
    }

    /**
     * Notifica mensagem de chat de suporte
     */
    async notifySupportMessage(chatData: {
        userEmail: string;
        userName?: string;
        message: string;
        files?: { path: string, type: string }[];
    }): Promise<void> {
        let message = `💬 <b>MENSAGEM DE SUPORTE</b>\n\n`;
        message += `👤 <b>Usuário:</b> ${chatData.userName || chatData.userEmail}\n`;
        message += `📧 <b>Email:</b> ${chatData.userEmail}\n\n`;
        message += `💭 <b>Mensagem:</b>\n${chatData.message}\n\n`;
        message += `⏰ ${new Date().toLocaleString('pt-BR')}`;

        await this.sendMessage(message);

        // Send files if any
        if (chatData.files && chatData.files.length > 0) {
            for (const file of chatData.files) {
                await this.sendFile(file.path, file.type);
            }
        }
    }

    private async sendFile(filePath: string, type: string): Promise<void> {
        if (!this.botToken || !this.chatId) return;

        try {
            const formData = new FormData();
            formData.append('chat_id', this.chatId);

            // Determine endpoint and field name
            let method = 'sendDocument';
            if (type.startsWith('image/')) method = 'sendPhoto';
            else if (type.startsWith('audio/')) method = 'sendAudio';
            else if (type.startsWith('video/')) method = 'sendVideo';

            // Node.js FormData requires fs stream
            const fs = require('fs');
            if (fs.existsSync(filePath)) {
                formData.append(method === 'sendPhoto' ? 'photo' : method === 'sendAudio' ? 'audio' : method === 'sendVideo' ? 'video' : 'document', fs.createReadStream(filePath));

                await axios.post(`${this.baseUrl}/${method}`, formData, {
                    headers: formData.getHeaders()
                });
                console.log(`✅ [Telegram] Arquivo enviado: ${method}`);
            }
        } catch (error: any) {
            console.error(`❌ [Telegram] Falha ao enviar arquivo:`, error.message);
        }
    }

    /**
     * Envia mensagem customizada
     */
    async sendCustomAlert(title: string, details: string): Promise<void> {
        const message = `⚡ <b>${title}</b>\n\n${details}`;
        await this.sendMessage(message);
    }

    /**
     * Método privado para enviar mensagem ao Telegram
     */
    private async sendMessage(text: string): Promise<void> {
        if (!this.botToken || !this.chatId) {
            console.log('📱 [Telegram] (Desabilitado):', text.substring(0, 100));
            return;
        }

        try {
            await axios.post(`${this.baseUrl}/sendMessage`, {
                chat_id: this.chatId,
                text,
                parse_mode: 'HTML'
            });
            console.log('✅ [Telegram] Notificação enviada');
        } catch (error: any) {
            console.error('❌ [Telegram] Erro ao enviar:', error.message);
        }
    }

    /**
     * Helpers
     */
    private getSourceEmoji(source: string): string {
        const emojis: Record<string, string> = {
            signup: '🎉',
            contact: '📧',
            pricing: '💰',
            chat: '💬'
        };
        return emojis[source] || '📌';
    }

    private getSourceName(source: string): string {
        const names: Record<string, string> = {
            signup: 'CADASTRO',
            contact: 'CONTATO',
            pricing: 'INTENÇÃO DE COMPRA',
            chat: 'CHAT SUPORTE'
        };
        return names[source] || 'LEAD';
    }
}

export const telegramNotification = new TelegramNotificationService();
