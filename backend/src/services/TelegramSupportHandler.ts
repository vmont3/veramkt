import { telegramService } from './TelegramService';
import axios from 'axios';

/**
 * 🤖 Telegram Command Handler para Chat de Suporte
 * Processa comandos enviados pelo admin via Telegram
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const ADMIN_REPLY_TOKEN = process.env.ADMIN_REPLY_TOKEN || 'your-secret-token';

export class TelegramSupportHandler {
    private isRunning = false;

    /**
     * Iniciar handler de comandos
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️ [TelegramSupport] Handler já está rodando');
            return;
        }

        this.isRunning = true;
        console.log('🚀 [TelegramSupport] Iniciando handler de comandos...');

        // Registrar callback no TelegramService
        await telegramService.startPolling(async (senderId, text, audioBuffer) => {
            return await this.handleCommand(text);
        });

        console.log('✅ [TelegramSupport] Handler ativado com sucesso');
    }

    /**
     * Processar comando recebido
     */
    /**
     * Processar comando ou mensagem recebida do Telegram
     */
    private async handleCommand(text: string, mediaBuffer?: Buffer, mediaType?: 'audio' | 'image' | 'video'): Promise<string> {
        try {
            // 1. Comando explícito: /reply [chatId] [mensagem]
            const replyMatch = text.match(/^\/reply\s+([a-f0-9-]+)\s+(.+)$/i);
            if (replyMatch) {
                const [, chatId, message] = replyMatch;
                return await this.sendAdminReply(chatId, message);
            }

            // 2. Comandos de Sistema
            if (text.toLowerCase().trim() === '/help' || text.toLowerCase().trim() === '/ajuda') {
                return this.getHelpMessage();
            }

            // 3. Conversa Direta com VERA (Audio ou Texto)
            // Se não for comando, tratamos como chat direto com o Admin
            let messageContent = text;

            // Se for áudio, transcrever
            if (mediaType === 'audio' && mediaBuffer) {
                // Precisamos salvar temporariamente para o Whisper (ele pede arquivo) - ou streamar
                // Como AudioService usa fs.createReadStream, vamos salvar num temp
                const fs = require('fs');
                const path = require('path');
                const os = require('os');
                const tempFile = path.join(os.tmpdir(), `telegram_voice_${Date.now()}.mp3`);

                try {
                    fs.writeFileSync(tempFile, mediaBuffer);
                    const { audioService } = require('./ai/AudioService'); // Lazy load
                    const transcription = await audioService.transcribe(tempFile);

                    if (transcription) {
                        messageContent = transcription;
                        console.log(`[TelegramSupport] 🗣️ Transcrição: "${messageContent}"`);
                    } else {
                        return "⚠️ Recebi o áudio, mas não consegui entender (transcrição vazia). Tente falar um pouco mais alto ou perto do microfone.";
                    }
                } catch (err: any) {
                    console.error("[TelegramSupport] Erro na transcrição:", err);
                    if (err?.error?.code === 'insufficient_quota') {
                        return "⚠️ **ERRO DE CRÉDITO AI:** Não consigo ouvir seu áudio por falta de saldo na API da OpenAI.";
                    }
                    return "⚠️ Falha técnica ao processar seu áudio.";
                } finally {
                    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                }
            }

            // Se tiver conteúdo (texto ou transcrição), enviar para VERA
            if (messageContent) {
                const { veraOrchestrator } = require('./agents/VeraOrchestrator'); // Lazy load

                const response = await veraOrchestrator.processRequest({
                    requestId: `telegram_${Date.now()}`,
                    type: 'CHAT',
                    payload: {
                        userId: 'admin_telegram', // Contexto do Admin
                        platform: 'telegram_bot',
                        message: messageContent
                    }
                });

                return response.data?.reply || response.message || "Estou sem respostas hoje. 🤖";
            }

            return "🎵 Envie um áudio ou digite algo para falar comigo. Use /help para ver comandos de admin.";

        } catch (error: any) {
            console.error('❌ [TelegramSupport] Erro ao processar mensagem:', error);
            if (error?.error?.code === 'insufficient_quota' || error?.message?.includes('quota')) {
                return "⚠️ **BATERIA FRACA (Quota Exceeded):** Minha conexão com a inteligência (OpenAI) está pausada por falta de créditos. Por favor verifique o faturamento.";
            }
            return `⚠️ Erro no processamento: ${error.message}`;
        }
    }

    /**
     * Enviar resposta do admin para o backend
     */
    private async sendAdminReply(chatId: string, message: string): Promise<string> {
        try {
            console.log(`📤 [TelegramSupport] Enviando resposta para chat ${chatId}...`);

            const response = await axios.post(
                `${BACKEND_URL}/api/support/admin/reply`,
                {
                    chatId,
                    message,
                    adminToken: ADMIN_REPLY_TOKEN
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                console.log('✅ [TelegramSupport] Resposta enviada com sucesso');
                return `✅ Resposta enviada com sucesso!\n\n💬 Chat: #${chatId.substring(0, 8)}\n📝 Mensagem: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`;
            } else {
                throw new Error(response.data.error || 'Erro desconhecido');
            }
        } catch (error: any) {
            console.error('❌ [TelegramSupport] Erro ao enviar resposta:', error.message);

            if (error.response?.status === 404) {
                return `❌ Chat não encontrado.\n\nVerifique o ID: ${chatId}`;
            } else if (error.response?.status === 401) {
                return '❌ Token de autenticação inválido.';
            } else {
                return `❌ Erro ao enviar resposta: ${error.message}`;
            }
        }
    }

    /**
     * Mensagem de ajuda
     */
    private getHelpMessage(): string {
        return `🤖 **VERA Support Bot - Comandos**

📍 **Responder a um chat:**
\`/reply [chatId] [sua mensagem]\`

Exemplo:
\`/reply 12345678 Olá! Como posso ajudar?\`

💡 **Dicas:**
- O chatId é fornecido em cada notificação de mensagem
- Você pode responder com texto multilinea
- O usuário receberá a resposta em tempo real

📋 **Ajuda:**
\`/help\` ou \`/ajuda\` - Mostrar esta mensagem

---
✨ Powered by VERA AI Marketing`;
    }

    /**
     * Parar handler
     */
    stop() {
        this.isRunning = false;
        console.log('🛑 [TelegramSupport] Handler parado');
    }
}

// Exportar instância singleton
export const telegramSupportHandler = new TelegramSupportHandler();
