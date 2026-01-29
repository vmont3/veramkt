import axios from "axios";
import FormData from "form-data";
import { Buffer } from "buffer";

/**
 * Telegram Notification Service
 * Envia alertas em tempo real para o admin (Você) sobre o que a VERA está fazendo.
 */
export class TelegramService {
    private botToken: string | undefined;
    private adminChatId: string | undefined;
    private lastUpdateId: number = 0;
    private isPolling: boolean = false;

    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

        if (this.botToken && this.adminChatId) {
            console.log("✅ [SystemMonitor] VERA Admin Uplink Connectado.");
        }
    }

    private async sendMessage(text: string): Promise<void> {
        if (!this.botToken || !this.adminChatId) return;
        try {
            await axios.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                chat_id: this.adminChatId,
                text,
                parse_mode: "Markdown"
            });
        } catch (e) {
            console.error("[SystemMonitor] Falha no uplink:", e);
        }
    }

    /**
     * Relatório de Saúde do Sistema (APIs e Serviços)
     */
    async sendSystemHealthReport(services: { name: string; status: 'online' | 'offline' | 'degraded'; latency: number }[]) {
        let msg = "🖥️ *VERA System Health Report*\n\n";
        services.forEach(s => {
            const icon = s.status === 'online' ? '✅' : (s.status === 'degraded' ? '⚠️' : '❌');
            msg += `${icon} *${s.name}*: ${s.status.toUpperCase()} (${s.latency}ms)\n`;
        });
        msg += `\n🕒 ${new Date().toLocaleString('pt-BR')}`;
        await this.sendMessage(msg);
    }

    /**
     * Alerta de Créditos e API Balance
     */
    async notifyLowCredits(apiName: string, remainingCredits: number, threshold: number) {
        const msg = `⚠️ *ALERTA CRÍTICO: Bateria da Nave Baixa*\n\nA API *${apiName}* está com créditos baixos.\n\n🔻 Restante: ${remainingCredits}\n🔻 Mínimo: ${threshold}\n\nReabasteça imediatamente para evitar falha nos propulsores.`;
        await this.sendMessage(msg);
    }

    /**
     * Relatório Financeiro Diário
     */
    async sendDailyFinancialReport(revenue: number, costs: number, newUsers: number) {
        const profit = revenue - costs;
        const msg = `💰 *Diário de Bordo Financeiro*\n\n` +
            `🟢 Receita: R$ ${revenue.toFixed(2)}\n` +
            `🔴 Custos AI: R$ ${costs.toFixed(2)}\n` +
            `🔵 Lucro: R$ ${profit.toFixed(2)}\n` +
            `👥 Novos Passageiros: ${newUsers}\n\n` +
            `Status da Nave: ${profit > 0 ? "Em Órbita Estável 🚀" : "Queimando Combustível 🔥"}`;
        await this.sendMessage(msg);
    }

    /**
     * Alerta de Erro Crítico
     */
    async notifyCriticalFailure(component: string, error: string) {
        const msg = `🚨 *FALHA NO SISTEMA*\n\nComponente: *${component}*\nErro: \`${error}\`\n\nAção: Protocolo de reinicialização sugerido.`;
        await this.sendMessage(msg);
    }

    /**
     * Enviar Mensagem de Voz (MP3/OGG)
     */
    /**
     * Enviar Mensagem de Voz (MP3/OGG)
     */
    async sendVoice(audioData: string | Buffer) {
        await this.sendMedia('voice', audioData, 'voice_message.mp3', 'audio/mpeg');
    }

    /**
     * Enviar Foto
     */
    async sendPhoto(caption: string, photoData: string | Buffer) {
        await this.sendMedia('photo', photoData, 'image.jpg', 'image/jpeg', caption);
    }

    /**
     * Enviar Vídeo
     */
    async sendVideo(caption: string, videoData: string | Buffer) {
        await this.sendMedia('video', videoData, 'video.mp4', 'video/mp4', caption);
    }

    /**
     * Helper Genérico de Mídia
     */
    private async sendMedia(type: 'voice' | 'photo' | 'video', data: string | Buffer, filename: string, contentType: string, caption?: string) {
        if (!this.botToken || !this.adminChatId) return;

        try {
            console.log(`[Telegram] Preparando envio de ${type}...`);
            let buffer: Buffer;

            if (typeof data === 'string' && data.startsWith('data:')) {
                buffer = Buffer.from(data.split(',')[1], 'base64');
            } else if (Buffer.isBuffer(data)) {
                buffer = data;
            } else {
                console.error("[Telegram] Formato de mídia inválido.");
                return;
            }

            const form = new FormData();
            form.append('chat_id', this.adminChatId);
            form.append(type, buffer, { filename, contentType });
            if (caption) form.append('caption', caption);

            await axios.post(
                `https://api.telegram.org/bot${this.botToken}/send${type.charAt(0).toUpperCase() + type.slice(1)}`,
                form,
                { headers: form.getHeaders() }
            );
            console.log(`✅ [Telegram] ${type} enviado com sucesso.`);

        } catch (e) {
            console.error(`❌ [Telegram] Falha ao enviar ${type}:`, e);
        }
    }

    /**
     * Obter Link de Download de Arquivo (Telegram API)
     */
    async getFileLink(fileId: string): Promise<string | null> {
        if (!this.botToken) return null;
        try {
            const response = await axios.get(`https://api.telegram.org/bot${this.botToken}/getFile`, {
                params: { file_id: fileId }
            });
            const filePath = response.data.result.file_path;
            return `https://api.telegram.org/file/bot${this.botToken}/${filePath}`;
        } catch (error) {
            console.error("[Telegram] Erro ao obter link do arquivo:", error);
            return null;
        }
    }

    /**
     * Download arquivo como Buffer
     */
    async downloadFile(url: string): Promise<Buffer | null> {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(response.data);
        } catch (error) {
            console.error("[Telegram] Erro ao baixar arquivo:", error);
            return null;
        }
    }

    /**
     * Iniciar "Ouvido" da VERA (Long Polling)
     * Permite que o Admin mande comandos de volta.
     */
    async startPolling(onCommandRequest: (senderId: string, text: string, mediaBuffer?: Buffer, mediaType?: 'audio' | 'image' | 'video') => Promise<string>) {
        if (!this.botToken || this.isPolling) return;
        this.isPolling = true;
        console.log("👂 [Telegram] Ouvido da VERA ativado (Polling)...");

        const poll = async () => {
            try {
                const response = await axios.get(`https://api.telegram.org/bot${this.botToken}/getUpdates`, {
                    params: {
                        offset: this.lastUpdateId + 1,
                        timeout: 30 // Long polling
                    }
                });

                const updates = response.data.result;
                if (updates && updates.length > 0) {
                    for (const update of updates) {
                        this.lastUpdateId = update.update_id;

                        if (update.message) {
                            const senderId = String(update.message.from?.id);
                            const text = update.message.text || update.message.caption || ""; // Caption for media
                            const voice = update.message.voice;
                            const photo = update.message.photo;
                            const video = update.message.video;

                            console.log(`[Telegram] Msg recebida de ID: ${senderId}`);

                            if (senderId === this.adminChatId) {
                                let reply = "";
                                let mediaBuffer: Buffer | undefined;
                                let mediaType: 'audio' | 'image' | 'video' | undefined;

                                if (voice) {
                                    console.log("[Telegram] Áudio detectado. Baixando...");
                                    const fileLink = await this.getFileLink(voice.file_id);
                                    if (fileLink) mediaBuffer = await this.downloadFile(fileLink) || undefined;
                                    mediaType = 'audio';
                                } else if (photo) {
                                    console.log("[Telegram] Imagem detectada. Baixando...");
                                    // Get largest photo
                                    const fileId = photo[photo.length - 1].file_id;
                                    const fileLink = await this.getFileLink(fileId);
                                    if (fileLink) mediaBuffer = await this.downloadFile(fileLink) || undefined;
                                    mediaType = 'image';
                                } else if (video) {
                                    console.log("[Telegram] Vídeo detectado. Baixando...");
                                    const fileLink = await this.getFileLink(video.file_id);
                                    if (fileLink) mediaBuffer = await this.downloadFile(fileLink) || undefined;
                                    mediaType = 'video';
                                }

                                if (text || mediaBuffer) {
                                    reply = await onCommandRequest(senderId, text, mediaBuffer, mediaType);
                                }

                                if (reply) await this.sendMessage(reply);
                            }
                        }
                    }
                }
            } catch (e) {
                // Silencioso
                console.error("[Telegram Polling Error]", e);
            }

            if (this.isPolling) setTimeout(poll, 1000);
        };

        poll();
    }
}

export const telegramService = new TelegramService();
