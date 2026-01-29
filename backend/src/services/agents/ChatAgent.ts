/**
 * Chat Agent (Head de Relacionamento)
 * Responsável pelo atendimento, automação de DM e fechamento de vendas.
 * Reporta-se ao VERA Core.
 * VERSÃO 2.0 - INTEGRADA COM CLAUDE AI
 */

import { prisma } from "../../database/prismaClient";
import ContentValidator from '../ai/ContentValidator';
import ContentHumanizer from '../ai/ContentHumanizer';
import ClaudeHelper from "../ai/ClaudeHelper";

const validator = new ContentValidator();
const humanizer = new ContentHumanizer();

export interface ChatInteraction {
    userId: string;
    platform: string; // instagram_dm, whatsapp, site_chat
    message: string;
    context?: any;
}

export interface ChatResponse {
    reply: string;
    sentiment: "dúvida" | "reclamação" | "elogio" | "venda_potencial";
    suggestedAction?: "human_handoff" | "send_link" | "schedule_meeting";
}

interface UserContext {
    brand?: any;
    guidelines?: any;
    assets?: any[];
    plans?: any[];
    user?: any;
}

export class ChatAgent {
    private agentId = "head_chat";

    /**
     * Processa uma mensagem de entrada
     */
    public async processMessage(interaction: ChatInteraction): Promise<ChatResponse> {
        console.log(`[ChatHead] Processando mensagem de ${interaction.platform}`);

        // 1. Buscar Contexto e Histórico
        const context = await this.fetchUserContext(interaction.userId);
        const history = await this.getChatHistory(interaction.userId, interaction.platform);

        // 2. Análise de Intenção e Geração de Resposta com Claude
        const reply = await this.generateClaudeResponse(interaction.message, history, context);

        // 3. Detectar Intenção (Análise Simples para metadados)
        const intent = this.analyzeIntent(interaction.message);

        // 4. Salvar no Histórico
        await this.saveMessage(interaction.userId, interaction.platform, 'user', interaction.message);
        await this.saveMessage(interaction.userId, interaction.platform, 'assistant', reply);

        // 5. Log da interação (Business Analytics)
        await this.logInteraction(interaction, intent, reply);

        return {
            reply,
            sentiment: intent,
            suggestedAction: intent === "venda_potencial" ? "send_link" : undefined
        };
    }

    /**
     * Processa mensagem diretamente (para Support Chat) - COM INTELIGÊNCIA REAL
     */
    public async processMessageDirect(message: string, userId: string): Promise<string> {
        console.log(`[ChatHead] Processando suporte direto para user ${userId}`);

        try {
            const context = await this.fetchUserContext(userId);
            const history = await this.getChatHistory(userId, 'support_chat');

            const reply = await this.generateClaudeResponse(message, history, context);

            // Salvar histórico
            await this.saveMessage(userId, 'support_chat', 'user', message);
            await this.saveMessage(userId, 'support_chat', 'assistant', reply);

            return reply;

        } catch (error) {
            console.error('[ChatAgent] Erro ao processar mensagem:', error);
            return "Olá! Sou a VERA. Estou com uma pequena instabilidade agora, mas você pode tentar novamente em alguns segundos ou me perguntar sobre outra coisa! 😊";
        }
    }

    /**
     * GERA RESPOSTA USANDO CLAUDE AI COM CONTEXTO E HISTÓRICO
     */
    private async generateClaudeResponse(
        message: string,
        history: any[],
        context: UserContext
    ): Promise<string> {
        const userName = context.user?.name?.split(' ')[0] || 'Usuário';
        const brandName = context.brand?.name || 'sua marca';
        const credits = context.user?.credits || 0;
        const hasAssets = (context.assets?.length || 0) > 0;
        const planCount = context.plans?.length || 0;

        const systemPrompt = `Você é VERA (Virtual Expert Relationship Assistant), a assistente AI oficial da plataforma VERA MKT.
Sua missão é DE SUPORTE E VENDAS. Você deve tirar dúvidas, resolver problemas e ajudar o usuário a usar a plataforma.

SUA EQUIPE (OS 23 AGENTES):
Você não trabalha sozinha. Você é a "frente" de atendimento de uma agência completa. Se o usuário precisar de algo específico, saiba que temos estes especialistas prontos para atuar (o sistema vai rotear automaticamente):
1. **ESTRATÉGIA**: Head de Estratégia, Especialista de Marca.
2. **COPYWRITING**: Copy Social Short (Insta/Tiktok), Copy Social Long (Linkedin/Blog), Copy Ads (Conversão), Copy E-mail/CRM.
3. **DESIGN**: Design Social (Posts), Design Ads (Anúncios), Design Landing Pages, Roteirista de Vídeo (Scripts).
4. **ADS (TRÁFICO)**: Gestores de Meta Ads, Google Ads, TikTok Ads e LinkedIn Ads.
5. **DADOS (ANALYTICS)**: Analista de BI, Analista de Tendências, Espião de Concorrência.
6. **CRM**: Closer (Vendas), Sucesso do Cliente (Onboarding), Enriquecedor de Leads, Guardião Financeiro, Editor Chefe.

CONTEXTO DO USUÁRIO ATUAL:
- Nome: ${userName}
- Marca: ${brandName}
- Créditos: ${credits}
- Arquivos/Assets: ${hasAssets ? context.assets?.length + ' arquivos (Logos/Manuais)' : 'Nenhum'}
- Planos Ativos: ${planCount}

DIRETRIZES DE SEGURANÇA (IMPORTANTE):
1. **ESCOPO**: Você é uma assistente de SUPORTE. NÃO aja como um "Criador de Conteúdo" ou "Copywriter" a menos que o usuário peça explicitamente ajuda para criar algo AGORA.
2. **VERACIDADE**: NUNCA invente que você criou algo no passado (ex: "Fui eu que criei a legenda da vaca rosa"). Se você não tem registro disso no histórico imediato, não assuma autoria.
3. **ALUCINAÇÃO**: Se o usuário perguntar sobre algo que não está no contexto (ex: uma campanha antiga), diga que você não tem acesso a esse histórico específico no momento, mas pode ajudar a criar algo novo.
4. **PERSONALIDADE**: Profissional, eficiente, mas acolhedora. Use emojis moderadamente.

REGRAS DE INTERAÇÃO:
1. Responda diretamente à dúvida.
2. Mencione seus agentes especialistas quando apropriado (ex: "Posso pedir para o nosso especialista em Ads analisar isso...").
3. Se for problema técnico, peça detalhes.
4. Se for sobre preços/planos, explique os benefícios.
5. Se for solicitado contato humano, avise que a equipe foi notificada via Telegram.

HISTÓRICO RECENTE:
${history.map(h => `${h.role === 'user' ? 'Usuário' : 'Vera'}: ${h.content}`).join('\n')}
`;

        try {
            const rawReply = await ClaudeHelper.generate({
                task: `Responder ao usuário: "${message}"`,
                context: systemPrompt,
                maxLength: 800,
                tone: 'conversational',
                enforceAntiCliche: true,
                creativity: 0.7
            });

            // Humanizar para garantir o toque brasileiro e naturalidade extra
            return humanizer.humanize(rawReply, {
                addInterjections: true,
                addImperfections: false, // Menos imperfeições no chat de suporte para manter autoridade
                replaceGeneric: true,
                probability: 0.15
            });

        } catch (error) {
            console.error('[ChatAgent] Erro na geração Claude:', error);
            throw error;
        }
    }

    /**
     * BUSCAR CONTEXTO COMPLETO DO USUÁRIO
     */
    private async fetchUserContext(userId: string): Promise<UserContext> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { name: true, email: true, credits: true, role: true }
            });

            const brand = await prisma.brand.findFirst({
                where: { userId }
            });

            const guidelines = brand ? await prisma.brandGuidelines.findUnique({
                where: { brandId: brand.id }
            }) : null;

            const assets = brand ? await prisma.brandAsset.findMany({
                where: { brandId: brand.id },
                take: 5,
                orderBy: { createdAt: 'desc' }
            }) : [];

            const plans = await prisma.contentPlan.findMany({
                where: { userId },
                take: 3,
                orderBy: { createdAt: 'desc' }
            });

            return { user, brand, guidelines, assets, plans };

        } catch (error) {
            console.error('[ChatAgent] Erro ao buscar contexto:', error);
            return {};
        }
    }

    /**
     * BUSCAR HISTÓRICO DE MENSAGENS (Últimas 10)
     */
    private async getChatHistory(userId: string, chatId: string): Promise<any[]> {
        try {
            // Bypass TS check for dynamically added model if prisma generate is laggy in ts-node
            const prismaAny = prisma as any;
            if (!prismaAny.chatMessage) return [];

            return await prismaAny.chatMessage.findMany({
                where: {
                    userId,
                    chatId
                },
                take: 10,
                orderBy: { createdAt: 'asc' }
            });
        } catch (e) {
            return [];
        }
    }

    /**
     * SALVAR MENSAGEM NO HISTÓRICO
     */
    private async saveMessage(userId: string, chatId: string, role: string, content: string) {
        try {
            const prismaAny = prisma as any;
            if (!prismaAny.chatMessage) return;

            await prismaAny.chatMessage.create({
                data: {
                    userId,
                    chatId,
                    role,
                    content
                }
            });
        } catch (e) {
            console.warn('[ChatAgent] Falha ao salvar mensagem');
        }
    }

    private analyzeIntent(message: string): any {
        const lower = message.toLowerCase();
        if (lower.includes("preço") || lower.includes("quanto") || lower.includes("plano") || lower.includes("upgrade") || lower.includes("pagar")) return "venda_potencial";
        if (lower.includes("ajuda") || lower.includes("não consigo") || lower.includes("erro") || lower.includes("bug") || lower.includes("problema")) return "reclamação";
        if (lower.includes("bom") || lower.includes("gostei") || lower.includes("obrigado") || lower.includes("parabéns") || lower.includes("legal")) return "elogio";
        return "dúvida";
    }

    private async logInteraction(interaction: ChatInteraction, intent: string, reply: string) {
        try {
            await prisma.agentInteraction.create({
                data: {
                    agentId: this.agentId,
                    platform: interaction.platform,
                    userId: interaction.userId,
                    messageType: intent,
                    userResponse: interaction.message.substring(0, 200),
                    sentiment: intent,
                    engagementScore: 85,
                    responseTime: 150,
                    converted: false
                }
            });
        } catch (e: any) {
            console.log('[ChatAgent] Log de interação falhou:', e.message);
        }
    }
}

export const chatAgent = new ChatAgent();
