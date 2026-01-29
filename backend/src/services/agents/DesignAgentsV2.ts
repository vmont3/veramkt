/**
 * DESIGN & VIDEO AGENTS - 4 Especializações
 * 1. DesignSocial - Posts, Stories, Reels visuais
 * 2. DesignAds - Criativos de anúncios
 * 3. DesignLanding - Landing pages/websites
 * 4. VideoScript - Roteiros de vídeo
 */

import { BaseAgent, UserContext, ContentOutput } from './BaseAgent';
import { getAgentPersonality } from '../../config/AgentPersonas';

export interface DesignTask {
    type: 'social' | 'ad' | 'landing' | 'video_script';
    platform: string;
    dimensions?: string;
    objective: string;
    productOrService?: string;
    references?: string[];
}

export interface DesignOutput {
    concept: string;
    colors: string[];
    typography?: string;
    layout?: string;
    validation: ContentOutput;
}

// ==================== DESIGN SOCIAL ====================
export class DesignSocialAgent extends BaseAgent {
    constructor() {
        super('design-social', 'Designer Social', 'design');
    }

    public async execute(userId: string, task: DesignTask): Promise<DesignOutput> {
        const context = await this.fetchUserContext(userId);
        const personality = getAgentPersonality(this.agentId);

        const prompt = this.buildPrompt(context, `
PLATAFORMA: ${task.platform}
OBJETIVO: ${task.objective}
DIMENSÕES: ${task.dimensions || '1080x1080px (quadrado)'}

BRAND ASSETS DISPONÍVEIS:
${context.assets?.map(a => `- ${a.name} (${a.type})`).join('\n') || 'Nenhum'}

GUIDELINES DE CORES:
${context.guidelines?.colorPalette || 'Livre'}

PERSONALIDADE:
- ${personality.tone}
- ${personality.traits.join(', ')}

TAREFA:
Crie um conceito visual que:
1. Chame atenção nos primeiros 0.5s (scroll rápido)
2. Siga tendências 2026 (glassmorphism, gradientes vibrantes)
3. Mantenha identidade da marca
4. Seja otimizado para ${task.platform}
        `);

        const rawConcept = this.generateDesignConcept(task, context);

        // Design precisa de descrição clara mas não precisa ser super humanizada
        const validated = await this.validateAndHumanize(rawConcept, userId, {
            enforceMinScore: 70,
            addInterjections: false,
            addImperfections: false,
            probability: 0.05
        });

        return {
            concept: validated.humanized,
            colors: this.extractColors(context),
            typography: context.guidelines?.typography || 'Sans-serif moderna',
            layout: 'Z-Pattern (esquerda-cima → direita-baixo)',
            validation: validated
        };
    }

    private generateDesignConcept(task: DesignTask, context: UserContext): string {
        const brand = context.brand?.name || 'Marca';

        return `CONCEITO VISUAL - ${task.platform.toUpperCase()}

COMPOSIÇÃO:
- Background: Gradiente diagonal (azul escuro → roxo vibrante)
- Elemento principal: Produto em destaque (centro-direita)
- Glassmorphism card: Informações chave (esquerda)
- Micro-animação: Partículas flutuantes

HIERARQUIA:
1. Logo ${brand} (canto superior esquerdo, 80px)
2. Headline impactante (fonte bold, 64px)
3. Subheadline explicativa (font regular, 32px)
4. CTA button (gradiente, 48px altura)

PALETA:
${this.extractColors(context).join(', ')}

MOOD:
Moderno, premium, tech-forward, confiável`;
    }

    private extractColors(context: UserContext): string[] {
        try {
            const palette = JSON.parse(context.guidelines?.colorPalette || '{}');
            return palette.colors || ['#4F46E5', '#7C3AED', '#EC4899'];
        } catch {
            return ['#4F46E5', '#7C3AED', '#EC4899'];
        }
    }
}

// ==================== DESIGN ADS ====================
export class DesignAdsAgent extends BaseAgent {
    constructor() {
        super('design-ads', 'Designer de Anúncios', 'design');
    }

    public async execute(userId: string, task: DesignTask): Promise<DesignOutput> {
        const context = await this.fetchUserContext(userId);

        const rawConcept = this.generateAdDesign(task, context);

        const validated = await this.validateAndHumanize(rawConcept, userId, {
            enforceMinScore: 75,  // Ads precisam converter
            addInterjections: false,
            addImperfections: false,
            probability: 0.03
        });

        return {
            concept: validated.humanized,
            colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'], // Cores de alta conversão
            validation: validated
        };
    }

    private generateAdDesign(task: DesignTask, context: UserContext): string {
        return `AD CREATIVE - ${task.platform}

FORMATO: ${task.dimensions || '1200x628px (Meta Feed)'}

ESTRATÉGIA DE CONVERSÃO:
- Contraste ALTO (vermelho/amarelo para CTAs)
- Faces humanas (aumentam CTR em 38%)
- Números grandes e visíveis
- Seta apontando para CTA

ELEMENTOS:
1. Headline em negrito (max 5 palavras)
2. Benefício principal em destaque
3. Prova social (logo de clientes ou nº de usuários)
4. CTA button contrastante
5. Badge "Oferta Limitada" (escassez)

SPECS TÉCNICAS:
- Texto ocupa max 20% da imagem (regra Meta)
- Logo visível mesmo em thumbnail
- Mobile-first (70% do tráfego)`;
    }
}

// ==================== DESIGN LANDING ====================
export class DesignLandingAgent extends BaseAgent {
    constructor() {
        super('design-landing', 'Designer de Landing Pages', 'design');
    }

    public async execute(userId: string, task: DesignTask): Promise<DesignOutput> {
        const context = await this.fetchUserContext(userId);

        const rawConcept = this.generateLandingDesign(task, context);

        const validated = await this.validateAndHumanize(rawConcept, userId, {
            enforceMinScore: 75,
            addInterjections: false,
            addImperfections: false,
            probability: 0.05
        });

        return {
            concept: validated.humanized,
            layout: 'F-Pattern com hero section',
            colors: this.extractColors(context),
            validation: validated
        };
    }

    private generateLandingDesign(task: DesignTask, context: UserContext): string {
        return `LANDING PAGE - ${task.objective}

ESTRUTURA (acima da dobra):
1. HERO SECTION
   - Headline poderosa (H1, 56px)
   - Subheadline explicativa (24px)
   - CTA primário (botão grande, cor contrastante)
   - Hero image/vídeo (direita)

2. TRUST BAR
   - Logos de clientes
   - "Usado por 10.000+ empresas"

SEÇÕES:
3. Benefícios (3 colunas, ícones)
4. Como funciona (3 passos visuais)
5. Prova social (depoimentos + fotos)
6. Pricing (3 planos, destaque no Pro)
7. FAQ (accordion, 5-7 perguntas)
8. CTA final (repetir)

UX OTIMIZAÇÕES:
- Loading < 2s
- Mobile responsive
- Sticky CTA button (mobile)
- Exit-intent popup
- Chat widget (canto inferior direito)`;
    }

    private extractColors(context: UserContext): string[] {
        return ['#1E293B', '#3B82F6', '#10B981', '#F59E0B'];
    }
}

// ==================== VIDEO SCRIPT AGENT ====================
export class VideoScriptAgent extends BaseAgent {
    constructor() {
        super('video-script', 'Roteirista de Vídeo', 'design');
    }

    public async execute(userId: string, task: DesignTask): Promise<DesignOutput> {
        const context = await this.fetchUserContext(userId);

        const rawScript = this.generateVideoScript(task, context);

        // Scripts precisam ser MUITO naturais (voz humana)
        const validated = await this.validateAndHumanize(rawScript, userId, {
            enforceMinScore: 80,
            addInterjections: true,
            addImperfections: true,
            probability: 0.30  // ALTA probabilidade
        });

        return {
            concept: validated.humanized,
            colors: [],
            validation: validated
        };
    }

    private generateVideoScript(task: DesignTask, context: UserContext): string {
        const brand = context.brand?.name || 'nossa plataforma';

        return `ROTEIRO - ${task.platform} (${task.objective})

DURAÇÃO: 30-60 segundos
FORMATO: Vertical 9:16 (TikTok/Reels)

[CENA 1 - HOOK (0-3s)]
VISUAL: Close no rosto, olhando direto pra câmera
TEXTO: "Você perde 3 horas por dia fazendo isso manualmente?"

[CENA 2 - PROBLEMA (3-10s)]
VISUAL: Tela de computador com 20 abas abertas
TEXTO: "Criar post no Canva, agendar no Facebook, checar métricas no Google Analytics, responder DM..."
[Suspiro cansado]

[CENA 3 - SOLUÇÃO (10-20s)]
VISUAL: Interface da ${brand} em ação
TEXTO: "${brand} faz TUDO isso automaticamente. 23 agentes de IA trabalhando 24/7."

[CENA 4 - PROVA (20-25s)]
VISUAL: Gráfico subindo
TEXTO: "Resultado real: cliente aumentou leads em 280% no primeiro mês"

[CENA 5 - CTA (25-30s)]
VISUAL: QR Code + link na bio
TEXTO: "Link na bio. Teste grátis. Sem cartão."

LEGENDAS: SIM (80% assistem sem som)
MÚSICA: Upbeat, energética (royalty-free)`;
    }
}

// Exports
export const designSocialAgent = new DesignSocialAgent();
export const designAdsAgent = new DesignAdsAgent();
export const designLandingAgent = new DesignLandingAgent();
export const videoScriptAgent = new VideoScriptAgent();
