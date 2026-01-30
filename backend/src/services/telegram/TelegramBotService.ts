/**
 * Telegram Bot Service - DIFERENCIAL DISRUPTIVO
 *
 * Control VERA directly from Telegram with natural language commands!
 *
 * Features:
 * - Natural language command parsing with Claude
 * - Execute marketing tasks via Telegram
 * - Real-time status updates
 * - Multi-user support
 * - Secure authentication
 *
 * Setup:
 * 1. Create bot with @BotFather
 * 2. Get bot token
 * 3. Add to .env: TELEGRAM_BOT_TOKEN=xxxxx
 * 4. Start bot: ts-node src/services/telegram/startBot.ts
 *
 * Commands:
 * /start - Link Telegram to VERA account
 * /status - Get system status
 * /leads - Show hot leads
 * /create post sobre [tema] - Create social media post
 * /analytics - Get analytics summary
 * /help - Show available commands
 * Or use natural language: "me mostre os leads quentes"
 */

import TelegramBot from 'node-telegram-bot-api';
import { prisma } from '../../database/prismaClient';
import { claudeService } from '../ai/ClaudeService';
import { agentOrchestrator } from '../orchestration/AgentOrchestrator';

export interface TelegramUser {
    telegramId: string;
    userId: string;     // VERA user ID
    chatId: string;
    username?: string;
    isAuthorized: boolean;
    createdAt: Date;
}

export interface CommandContext {
    telegramId: string;
    chatId: string;
    userId?: string;
    message: string;
}

export class TelegramBotService {
    private bot: TelegramBot | null = null;
    private botToken: string;
    private isRunning: boolean = false;
    private commandRateLimit: Map<string, number> = new Map();

    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';

        if (!this.botToken) {
            console.warn('[TelegramBot] TELEGRAM_BOT_TOKEN not set. Bot disabled.');
        }
    }

    /**
     * Start the bot (use long polling for development, webhooks for production)
     */
    async start(): Promise<void> {
        if (!this.botToken) {
            throw new Error('Telegram bot token not configured');
        }

        if (this.isRunning) {
            console.log('[TelegramBot] Bot already running');
            return;
        }

        this.bot = new TelegramBot(this.botToken, { polling: true });
        this.isRunning = true;

        // Register command handlers
        this.registerHandlers();

        console.log('🤖 [TelegramBot] Bot started successfully!');
        console.log('[TelegramBot] Users can now control VERA via Telegram');
    }

    /**
     * Stop the bot
     */
    async stop(): Promise<void> {
        if (this.bot) {
            await this.bot.stopPolling();
            this.bot = null;
            this.isRunning = false;
            console.log('[TelegramBot] Bot stopped');
        }
    }

    /**
     * Register all command handlers
     */
    private registerHandlers(): void {
        if (!this.bot) return;

        // /start - Link Telegram account
        this.bot.onText(/\/start(.*)/, async (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
            await this.handleStart(msg, match?.[1]);
        });

        // /status - System status
        this.bot.onText(/\/status/, async (msg: TelegramBot.Message) => {
            await this.handleStatus(msg);
        });

        // /leads - Hot leads
        this.bot.onText(/\/leads/, async (msg: TelegramBot.Message) => {
            await this.handleLeads(msg);
        });

        // /analytics - Analytics summary
        this.bot.onText(/\/analytics/, async (msg: TelegramBot.Message) => {
            await this.handleAnalytics(msg);
        });

        // /create - Create content
        this.bot.onText(/\/create (.+)/, async (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
            await this.handleCreate(msg, match?.[1]);
        });

        // /help - Show help
        this.bot.onText(/\/help/, async (msg: TelegramBot.Message) => {
            await this.handleHelp(msg);
        });

        // Natural language fallback
        this.bot.on('message', async (msg: TelegramBot.Message) => {
            if (msg.text && !msg.text.startsWith('/')) {
                await this.handleNaturalLanguage(msg);
            }
        });

        // Handle callback queries (inline buttons)
        this.bot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
            await this.handleCallbackQuery(query);
        });
    }

    /**
     * Handle /start - Link Telegram to VERA account
     */
    private async handleStart(msg: TelegramBot.Message, linkCode?: string): Promise<void> {
        const chatId = msg.chat.id;
        const telegramId = msg.from!.id.toString();

        try {
            // Check if already linked
            const existing = await this.getTelegramUser(telegramId);

            if (existing) {
                await this.sendMessage(chatId, `
✅ *Já está conectado!*

Sua conta Telegram já está vinculada à VERA.

Use /help para ver os comandos disponíveis.
                `.trim(), { parse_mode: 'Markdown' });
                return;
            }

            // If link code provided, link immediately
            if (linkCode?.trim()) {
                const userId = await this.validateLinkCode(linkCode.trim());

                if (userId) {
                    await this.linkTelegramAccount(telegramId, userId, chatId.toString(), msg.from?.username);

                    await this.sendMessage(chatId, `
🎉 *Conta Vinculada com Sucesso!*

Agora você pode controlar a VERA diretamente pelo Telegram!

Experimente:
• /status - Ver status do sistema
• /leads - Consultar hot leads
• /create post sobre IA - Criar post
• Ou pergunte naturalmente: "me mostre os leads quentes"

Use /help para ver todos os comandos.
                    `.trim(), { parse_mode: 'Markdown' });
                    return;
                }
            }

            // Generate link code
            const code = await this.generateLinkCode(telegramId);

            await this.sendMessage(chatId, `
🔗 *Vincular Conta VERA*

Para vincular sua conta Telegram à VERA:

1. Acesse: https://vera.ai/painel/settings
2. Vá em "Integrações Telegram"
3. Cole este código: \`${code}\`
4. Clique em "Vincular"

Ou envie: /start ${code}

Código válido por 10 minutos.
            `.trim(), { parse_mode: 'Markdown' });

        } catch (error) {
            console.error('[TelegramBot] Error in /start:', error);
            await this.sendMessage(chatId, '❌ Erro ao processar comando. Tente novamente.');
        }
    }

    /**
     * Handle /status - System status
     */
    private async handleStatus(msg: TelegramBot.Message): Promise<void> {
        const chatId = msg.chat.id;
        const telegramId = msg.from!.id.toString();

        try {
            const user = await this.getTelegramUser(telegramId);

            if (!user) {
                await this.sendUnauthorized(chatId);
                return;
            }

            // Get system status
            const stats = await this.getSystemStatus(user.userId);

            await this.sendMessage(chatId, `
📊 *Status do Sistema VERA*

💰 *Créditos:* ${stats.credits} VC
🔥 *Hot Leads:* ${stats.hotLeads}
📝 *Posts Criados:* ${stats.postsCreated}
📈 *ROAS:* R$ ${stats.roas}

🤖 *Agentes Ativos:* ${stats.activeAgents}/${stats.totalAgents}

⏱️ Atualizado: ${new Date().toLocaleTimeString('pt-BR')}
            `.trim(), { parse_mode: 'Markdown' });

        } catch (error) {
            console.error('[TelegramBot] Error in /status:', error);
            await this.sendMessage(chatId, '❌ Erro ao obter status.');
        }
    }

    /**
     * Handle /leads - Show hot leads
     */
    private async handleLeads(msg: TelegramBot.Message): Promise<void> {
        const chatId = msg.chat.id;
        const telegramId = msg.from!.id.toString();

        try {
            const user = await this.getTelegramUser(telegramId);

            if (!user) {
                await this.sendUnauthorized(chatId);
                return;
            }

            // Fetch hot leads
            const leads = await this.getHotLeads(user.userId);

            if (leads.length === 0) {
                await this.sendMessage(chatId, '🔍 Nenhum hot lead no momento.');
                return;
            }

            let message = `🔥 *Hot Leads (${leads.length})*\n\n`;

            leads.slice(0, 5).forEach((lead, idx) => {
                message += `${idx + 1}. Score: ${lead.totalScore}/100 • Stage: ${lead.stage}\n`;
                message += `   Visitor: \`${lead.visitorId.substring(0, 15)}...\`\n`;
                message += `   Last seen: ${new Date(lead.lastSeen).toLocaleString('pt-BR')}\n\n`;
            });

            message += `\n[Ver todos no dashboard](https://vera.ai/painel/hot-leads)`;

            await this.sendMessage(chatId, message, { parse_mode: 'Markdown' });

        } catch (error) {
            console.error('[TelegramBot] Error in /leads:', error);
            await this.sendMessage(chatId, '❌ Erro ao buscar leads.');
        }
    }

    /**
     * Handle /analytics - Analytics summary
     */
    private async handleAnalytics(msg: TelegramBot.Message): Promise<void> {
        const chatId = msg.chat.id;
        const telegramId = msg.from!.id.toString();

        try {
            const user = await this.getTelegramUser(telegramId);

            if (!user) {
                await this.sendUnauthorized(chatId);
                return;
            }

            // Get analytics
            const analytics = await this.getAnalytics(user.userId);

            await this.sendMessage(chatId, `
📊 *Analytics - Últimos 7 Dias*

👥 *Visitantes:* ${analytics.totalVisitors}
🔥 *Hot Leads:* ${analytics.hotLeads}
⭐ *Qualified:* ${analytics.qualified}
📈 *Conversion Rate:* ${analytics.conversionRate}%

💬 *Total Sinais:* ${analytics.totalSignals}
📍 *Sessions:* ${analytics.totalSessions}

[Ver relatório completo](https://vera.ai/painel/analytics)
            `.trim(), { parse_mode: 'Markdown' });

        } catch (error) {
            console.error('[TelegramBot] Error in /analytics:', error);
            await this.sendMessage(chatId, '❌ Erro ao buscar analytics.');
        }
    }

    /**
     * Handle /create - Create content
     */
    private async handleCreate(msg: TelegramBot.Message, topic?: string): Promise<void> {
        const chatId = msg.chat.id;
        const telegramId = msg.from!.id.toString();

        if (!topic) {
            await this.sendMessage(chatId, 'ℹ️ Use: /create post sobre [tema]');
            return;
        }

        try {
            const user = await this.getTelegramUser(telegramId);

            if (!user) {
                await this.sendUnauthorized(chatId);
                return;
            }

            // Check rate limit
            if (this.isRateLimited(telegramId)) {
                await this.sendMessage(chatId, '⏱️ Aguarde um momento antes de criar outro conteúdo.');
                return;
            }

            await this.sendMessage(chatId, `⏳ Criando post sobre "${topic}"...`);

            // Create post using AgentOrchestrator
            const result = await agentOrchestrator.orchestrate('copy_agent', user.userId, {
                goal: `Criar post para redes sociais sobre: ${topic}`,
                context: { platform: 'instagram', maxLength: 2200 },
                allowCache: true
            });

            if (result.success) {
                await this.sendMessage(chatId, `
✅ *Post Criado!*

${result.result}

💰 Custo: ${result.cost} VC
⏱️ ${result.cached ? 'Cache' : 'Novo'}

[Ver no dashboard](https://vera.ai/painel/content)
                `.trim(), { parse_mode: 'Markdown' });

                this.setRateLimit(telegramId);
            } else {
                await this.sendMessage(chatId, '❌ Erro ao criar post. Tente novamente.');
            }

        } catch (error) {
            console.error('[TelegramBot] Error in /create:', error);
            await this.sendMessage(chatId, '❌ Erro ao criar conteúdo.');
        }
    }

    /**
     * Handle /help - Show help
     */
    private async handleHelp(msg: TelegramBot.Message): Promise<void> {
        const chatId = msg.chat.id;

        await this.sendMessage(chatId, `
🤖 *Comandos VERA Telegram Bot*

*Comandos Básicos:*
/status - Ver status do sistema
/leads - Consultar hot leads
/analytics - Ver analytics
/create post sobre [tema] - Criar post
/help - Mostrar esta ajuda

*Linguagem Natural:*
Você também pode perguntar naturalmente:
• "me mostre os leads quentes"
• "crie um post sobre inteligência artificial"
• "qual o status do sistema?"
• "quanto tenho de créditos?"

*Dica:* Use botões inline para ações rápidas!

💡 VERA responde comandos em segundos!
        `.trim(), { parse_mode: 'Markdown' });
    }

    /**
     * Handle natural language commands
     */
    private async handleNaturalLanguage(msg: TelegramBot.Message): Promise<void> {
        const chatId = msg.chat.id;
        const telegramId = msg.from!.id.toString();
        const text = msg.text || '';

        try {
            const user = await this.getTelegramUser(telegramId);

            if (!user) {
                await this.sendUnauthorized(chatId);
                return;
            }

            // Parse intent with Claude
            const intent = await this.parseIntent(text);

            switch (intent.action) {
                case 'status':
                    await this.handleStatus(msg);
                    break;
                case 'leads':
                    await this.handleLeads(msg);
                    break;
                case 'analytics':
                    await this.handleAnalytics(msg);
                    break;
                case 'create':
                    await this.handleCreate(msg, intent.parameters?.topic);
                    break;
                default:
                    await this.sendMessage(chatId, `
Não entendi o comando. Tente:
• /status
• /leads
• /create post sobre [tema]
• Ou use /help para ver todos os comandos
                    `.trim());
            }

        } catch (error) {
            console.error('[TelegramBot] Error in natural language:', error);
            await this.sendMessage(chatId, '❌ Erro ao processar comando.');
        }
    }

    /**
     * Handle callback queries (inline buttons)
     */
    private async handleCallbackQuery(query: TelegramBot.CallbackQuery): Promise<void> {
        const chatId = query.message!.chat.id;
        const data = query.data || '';

        // Acknowledge callback
        await this.bot!.answerCallbackQuery(query.id);

        // Handle different callback actions
        if (data.startsWith('lead_')) {
            const visitorId = data.replace('lead_', '');
            await this.sendMessage(chatId, `Ver detalhes do lead: ${visitorId}`);
        }
    }

    // ==================== HELPER METHODS ====================

    private async sendMessage(chatId: number, text: string, options?: any): Promise<void> {
        if (this.bot) {
            await this.bot.sendMessage(chatId, text, options);
        }
    }

    private async sendUnauthorized(chatId: number): Promise<void> {
        await this.sendMessage(chatId, `
🔒 *Conta Não Vinculada*

Você precisa vincular sua conta Telegram à VERA.

Use: /start
        `.trim(), { parse_mode: 'Markdown' });
    }

    private async getTelegramUser(telegramId: string): Promise<TelegramUser | null> {
        // TODO: Implement database lookup
        // For now, return mock data for testing
        return null;
    }

    private async linkTelegramAccount(telegramId: string, userId: string, chatId: string, username?: string): Promise<void> {
        // TODO: Implement database save
        console.log(`[TelegramBot] Linked ${telegramId} to ${userId}`);
    }

    private async generateLinkCode(telegramId: string): Promise<string> {
        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // TODO: Store in database with expiration
        return code;
    }

    private async validateLinkCode(code: string): Promise<string | null> {
        // TODO: Validate code from database
        return null;
    }

    private async getSystemStatus(userId: string): Promise<any> {
        // TODO: Fetch real data
        return {
            credits: 1500,
            hotLeads: 5,
            postsCreated: 23,
            roas: '3.500,00',
            activeAgents: 8,
            totalAgents: 23
        };
    }

    private async getHotLeads(userId: string): Promise<any[]> {
        // TODO: Fetch from database
        return [];
    }

    private async getAnalytics(userId: string): Promise<any> {
        // TODO: Fetch real analytics
        return {
            totalVisitors: 150,
            hotLeads: 12,
            qualified: 5,
            conversionRate: 3.3,
            totalSignals: 450,
            totalSessions: 200
        };
    }

    private async parseIntent(text: string): Promise<{ action: string; parameters?: any }> {
        // Use Claude to parse natural language intent
        try {
            const prompt = `Parse this user command and return JSON with {action, parameters}:
"${text}"

Actions: status, leads, analytics, create
For "create", include topic in parameters.

Return ONLY JSON.`;

            const response = await claudeService.generate({
                prompt,
                systemPrompt: 'You are a command parser. Return only JSON.',
                maxTokens: 200,
                temperature: 0.1
            });

            return JSON.parse(response.content);
        } catch (error) {
            console.error('[TelegramBot] Intent parsing error:', error);
            return { action: 'unknown' };
        }
    }

    private isRateLimited(telegramId: string): boolean {
        const lastCommand = this.commandRateLimit.get(telegramId);
        if (!lastCommand) return false;

        const elapsed = Date.now() - lastCommand;
        return elapsed < 10000; // 10 seconds
    }

    private setRateLimit(telegramId: string): void {
        this.commandRateLimit.set(telegramId, Date.now());
    }
}

// Singleton
export const telegramBotService = new TelegramBotService();
