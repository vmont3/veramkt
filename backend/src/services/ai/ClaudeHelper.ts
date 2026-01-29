/**
 * CLAUDE AI HELPER
 * Wrapper simplificado para uso fácil em qualquer agente
 */

import { claudeService } from './ClaudeService';
import { BANNED_PHRASES } from '../../config/AntiClicheRules';

export interface ClaudeHelperOptions {
    task: string;
    context?: string;
    maxLength?: number;
    tone?: 'formal' | 'informal' | 'conversational' | 'technical';
    enforceAntiCliche?: boolean;
    creativity?: number; // 0.0 - 1.0
}

export class ClaudeHelper {

    /**
     * Gerar conteúdo genérico (uso rápido)
     */
    public static async generate(options: ClaudeHelperOptions): Promise<string> {
        const {
            task,
            context = '',
            maxLength = 500,
            tone = 'conversational',
            enforceAntiCliche = true,
            creativity = 0.7
        } = options;

        const systemPrompt = this.buildSystemPrompt(tone, enforceAntiCliche);
        const userPrompt = this.buildUserPrompt(task, context, maxLength);

        try {
            const response = await claudeService.generate({
                systemPrompt,
                prompt: userPrompt,
                maxTokens: Math.ceil(maxLength * 1.5), // tokens ≈ palavras * 1.5
                temperature: creativity
            });

            return response.content;

        } catch (error: any) {
            console.error('[ClaudeHelper] Erro ao gerar:', error.message);
            throw error;
        }
    }

    /**
     * Gerar copy para social media
     */
    public static async generateSocialCopy(
        platform: string,
        objective: string,
        brand: string,
        maxChars: number = 150
    ): Promise<string> {
        return this.generate({
            task: `Criar post para ${platform}`,
            context: `
Marca: ${brand}
Objetivo: ${objective}
Max caracteres: ${maxChars}

IMPORTANTE:
- Hook forte nos primeiros 10 caracteres
- Use números específicos
- Seja conversacional (português BR)
- 1-2 emojis relevantes`,
            maxLength: maxChars,
            tone: 'conversational',
            creativity: 0.8
        });
    }

    /**
     * Gerar estratégia de marketing
     */
    public static async generateStrategy(
        objective: string,
        context: string
    ): Promise<string> {
        return this.generate({
            task: 'Criar estratégia de marketing',
            context: `
Objetivo: ${objective}

${context}

Incluir:
1. Posicionamento
2. OKRs (3 objectives com key results)
3. Canais recomendados
4. Timeline`,
            maxLength: 1500,
            tone: 'formal',
            creativity: 0.6,
            enforceAntiCliche: true
        });
    }

    /**
     * Gerar email marketing
     */
    public static async generateEmail(
        subject: string,
        purpose: string,
        recipientName: string = 'Cliente'
    ): Promise<string> {
        return this.generate({
            task: 'Criar email marketing',
            context: `
Assunto: ${subject}
Destinatário: ${recipientName}
Objetivo: ${purpose}

Tom: Pessoal mas profissional
Estrutura: Saudação → Contexto → Valor → CTA`,
            maxLength: 800,
            tone: 'conversational',
            creativity: 0.7
        });
    }

    /**
     * Gerar roteiro de vídeo
     */
    public static async generateVideoScript(
        platform: string,
        duration: string,
        topic: string
    ): Promise<string> {
        return this.generate({
            task: 'Criar roteiro de vídeo',
            context: `
Plataforma: ${platform}
Duração: ${duration}
Tema: ${topic}

Estrutura:
[0-3s] HOOK (captura atenção)
[3-15s] PROBLEMA  
[15-30s] SOLUÇÃO
[30-45s] PROVA/EXEMPLO
[45-60s] CTA

Incluir: Indicações de VISUAL e TEXTO separados`,
            maxLength: 1000,
            tone: 'conversational',
            creativity: 0.8
        });
    }

    /**
     * Build system prompt baseado em preferências
     */
    private static buildSystemPrompt(tone: string, enforceAntiCliche: boolean): string {
        let prompt = 'Você é um assistente de marketing digital profissional especializado em conteúdo brasileiro.\n\n';

        // Tom
        const toneMap: Record<string, string> = {
            formal: 'Use linguagem formal e profissional, adequada para B2B.',
            informal: 'Use linguagem informal e descontraída, como amigo falando.',
            conversational: 'Use linguagem conversacional natural, equilibrando profissionalismo e proximidade.',
            technical: 'Use linguagem técnica precisa, com termos específicos da área.'
        };

        prompt += toneMap[tone] || toneMap.conversational;
        prompt += '\n\n';

        // Anti-clichê
        if (enforceAntiCliche) {
            prompt += 'REGRAS ANTI-CLICHÊS RIGOROSAS:\n';
            prompt += `- PROIBIDO usar: ${BANNED_PHRASES.slice(0, 10).map(p => `"${p}"`).join(', ')}\n`;
            prompt += '- SEMPRE use números específicos ao invés de "muitos", "vários", "diversos"\n';
            prompt += '- Varie o tamanho das frases (curtas E longas)\n';
            prompt += '- NUNCA faça listas de exatamente 3 itens\n';
            prompt += '- Seja específico e concreto, evite generalidades\n';
            prompt += '- Use imperfeições intencionais para naturalidade (reticências, frases incompletas, etc)\n';
        }

        return prompt;
    }

    /**
     * Build user prompt
     */
    private static buildUserPrompt(task: string, context: string, maxLength: number): string {
        let prompt = `TAREFA:\n${task}\n\n`;

        if (context) {
            prompt += `CONTEXTO:\n${context}\n\n`;
        }

        prompt += `LIMITE DE TAMANHO: ${maxLength} caracteres aproximadamente.\n`;

        return prompt;
    }
}

export default ClaudeHelper;
