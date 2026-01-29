/**
 * CLAUDE SERVICE (Anthropic)
 * Serviço para integração com Claude API
 * Usado para: Copy humanizado, Chat, Estratégia
 */

import Anthropic from '@anthropic-ai/sdk';

export interface ClaudeRequest {
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
}

export interface ClaudeResponse {
    content: string;
    usage: {
        inputTokens: number;
        outputTokens: number;
    };
    model: string;
}

export class ClaudeService {
    private client: Anthropic;
    private model = 'claude-sonnet-4-20250514'; // Modelo mais recente

    constructor() {
        const apiKey = process.env.CLAUDE_API_KEY;

        if (!apiKey) {
            throw new Error('CLAUDE_API_KEY não configurada no .env');
        }

        this.client = new Anthropic({
            apiKey
        });

        console.log('[ClaudeService] ✅ Inicializado com sucesso');
    }

    /**
     * Gerar conteúdo com Claude
     */
    public async generate(request: ClaudeRequest): Promise<ClaudeResponse> {
        const {
            prompt,
            maxTokens = 2048,
            temperature = 0.7,
            systemPrompt
        } = request;

        try {
            console.log(`[ClaudeService] 🤖 Gerando conteúdo... (${maxTokens} tokens max)`);

            const messages: Anthropic.MessageParam[] = [
                { role: 'user', content: prompt }
            ];

            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: maxTokens,
                temperature,
                system: systemPrompt,
                messages
            });

            // Extrair texto da resposta
            const content = response.content
                .filter((block) => block.type === 'text')
                .map((block) => (block as Anthropic.TextBlock).text)
                .join('\n');

            console.log(`[ClaudeService] ✅ Conteúdo gerado: ${content.length} caracteres`);

            return {
                content,
                usage: {
                    inputTokens: response.usage.input_tokens,
                    outputTokens: response.usage.output_tokens
                },
                model: response.model
            };

        } catch (error: any) {
            console.error('[ClaudeService] ❌ Erro ao gerar:', error.message);
            throw new Error(`Claude API Error: ${error.message}`);
        }
    }

    /**
     * Testar conexão (health check)
     */
    public async testConnection(): Promise<boolean> {
        try {
            console.log('[ClaudeService] 🧪 Testando conexão...');

            const response = await this.generate({
                prompt: 'Responda apenas "OK" se você está funcionando.',
                maxTokens: 10
            });

            const isWorking = response.content.toLowerCase().includes('ok');

            if (isWorking) {
                console.log('[ClaudeService] ✅ Conexão OK!');
            } else {
                console.log('[ClaudeService] ⚠️ Resposta inesperada:', response.content);
            }

            return isWorking;

        } catch (error) {
            console.error('[ClaudeService] ❌ Falha na conexão');
            return false;
        }
    }

    /**
     * Calcular custo estimado
     */
    public calculateCost(inputTokens: number, outputTokens: number): number {
        // Claude Sonnet 4 pricing (estimado)
        const INPUT_COST_PER_1M = 3.00;   // $3 per 1M input tokens
        const OUTPUT_COST_PER_1M = 15.00; // $15 per 1M output tokens

        const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_1M;
        const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_1M;

        return inputCost + outputCost;
    }
}

// Singleton instance
export const claudeService = new ClaudeService();

export default ClaudeService;
