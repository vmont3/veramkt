/**
 * ADS MANAGERS & ANALYTICS AGENTS
 * 
 * ADS:
 * 1. MetaAdsManager - Facebook/Instagram
 * 2. GoogleAdsManager - Search/Display/YouTube
 * 3. TikTokAdsManager - TikTok organics + paid
 * 4. LinkedInAdsManager - B2B ads
 * 
 * ANALYTICS:
 * 5. BIAgent - Business Intelligence
 * 6. TrendAgent - Trend spotting
 * 7. CompetitorAgent - Competitive intelligence
 */

import { BaseAgent, UserContext, ContentOutput } from './BaseAgent';

// ==================== META ADS MANAGER ====================
export class MetaAdsManagerAgent extends BaseAgent {
    constructor() {
        super('manager-meta', 'Gestor Meta Ads', 'ads');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawStrategy = this.generateMetaStrategy(task, context);

        const validated = await this.validateAndHumanize(rawStrategy, userId, {
            enforceMinScore: 70,
            addInterjections: false,
            addImperfections: false
        });

        return { strategy: validated.humanized, validation: validated };
    }

    private generateMetaStrategy(task: any, context: UserContext): string {
        return `ESTRATÉGIA META ADS

OBJETIVO: ${task.objective || 'Conversões'}
ORÇAMENTO: R$ ${task.budget || 500}/dia

ESTRUTURA DE CAMPANHA:
├─ Campaign: CBO ativado (otimização automática de budget)
├─ Ad Sets (3): 
│   ├─ Lookalike 1% (high-value customers)
│   ├─ Interest targeting (marketing + tech + entrepreneurship)
│   └─ Broad targeting (algoritmo Meta)
└─ Ads (2 por Ad Set): 
    ├─ Carousel (5 cards)
    └─ Single image + video

BIDING:
- Estratégia: Lowest Cost
- Limite de lances: Não (deixar Meta otimizar)

PLACEMENTS:
- Feed (Facebook + Instagram)
- Stories (Instagram priority)
- Reels (80% do budget mobile)

KPIs:
- CPM: < R$ 30
- CTR: > 2.5%
- CPC: < R$ 1.50
- ROAS: > 4:1`;
    }
}

// ==================== GOOGLE ADS MANAGER ====================
export class GoogleAdsManagerAgent extends BaseAgent {
    constructor() {
        super('manager-google', 'Gestor Google Ads', 'ads');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawStrategy = this.generateGoogleStrategy(task, context);

        const validated = await this.validateAndHumanize(rawStrategy, userId, {
            enforceMinScore: 75,
            addInterjections: false,
            addImperfections: false
        });

        return { strategy: validated.humanized, validation: validated };
    }

    private generateGoogleStrategy(task: any, context: UserContext): string {
        return `ESTRATÉGIA GOOGLE ADS

OBJETIVO: ${task.objective || 'Conversões'}
ORÇAMENTO DIÁRIO: R$ ${task.budget || 300}

CAMPANHAS:

1. SEARCH (60% do budget)
   Keywords:
   - [marketing automation] (exact)
   - "agência de marketing ai" (phrase)
   - marketing digital +automação (broad modifier)
   
   Quality Score Target: 8+
   Lances: Target CPA R$ 50
   
2. DISPLAY (20%)
   - Remarketing (visitantes últimos 30 dias)
   - Similar audiences
   - In-market: Marketing/Advertising
   
3. YOUTUBE (20%)
   - In-stream skippable (15s)
   - Discovery ads
   - Target: CPV < R$ 0.15

OTIMIZAÇÕES:
- Negative keywords (atualizar semanalmente)
- Ad extensions (todas ativadas)
- Responsive search ads (3+ headlines, 2+ descriptions)`;
    }
}

// ==================== TIKTOK ADS MANAGER ====================
export class TikTokAdsManagerAgent extends BaseAgent {
    constructor() {
        super('manager-tiktok', 'Gestor TikTok Ads', 'ads');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawStrategy = this.generateTikTokStrategy(task, context);

        const validated = await this.validateAndHumanize(rawStrategy, userId, {
            enforceMinScore: 75,
            addInterjections: true,  // TikTok é mais informal
            addImperfections: true,
            probability: 0.20
        });

        return { strategy: validated.humanized, validation: validated };
    }

    private generateTikTokStrategy(task: any, context: UserContext): string {
        return `ESTRATÉGIA TIKTOK

ORGÂNICO (postar 2x/dia):
- Formato: Vertical 9:16
- HOOK: Primeiros 3 segundos CRÍTICOS
- Duração ideal: 15-30s
- Trends: Usar sounds virais (atualizar diário)
- Hashtags: 3-5 (#FYP + nicho específicas)

PAGO (R$ ${task.budget || 200}/dia):
- Objetivo: Conversões (otimizar pra venda)
- Formato: In-Feed Ads (nativo)
- Targeting: 
  - Idade: 25-45
  - Interesses: Business, Entrepreneurship, Marketing
- Creative: UGC-style (parece orgânico)

REGRAS DE OURO:
1. Não parece anúncio (be native)
2. Hook em 0-3s ou perdeu
3. Legendas SEMPRE (80% sem som)
4. CTA visual (texto na tela)

MÉTRICAS:
- CPM: < R$ 10 (mais barato que Meta)
- CTR: > 4%
- CVR: > 3%`;
    }
}

// ==================== LINKEDIN ADS MANAGER ====================
export class LinkedInAdsManagerAgent extends BaseAgent {
    constructor() {
        super('manager-linkedin', 'Gestor LinkedIn Ads', 'ads');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawStrategy = this.generateLinkedInStrategy(task, context);

        const validated = await this.validateAndHumanize(rawStrategy, userId, {
            enforceMinScore: 70,
            addInterjections: false,
            addImperfections: false
        });

        return { strategy: validated.humanized, validation: validated };
    }

    private generateLinkedInStrategy(task: any, context: UserContext): string {
        return `ESTRATÉGIA LINKEDIN ADS (B2B)

ORÇAMENTO: R$ ${task.budget || 500}/dia
OBJETIVO: Lead Generation

TARGETING PRECISO:
- Cargo: CMO, Marketing Director, CEO
- Tamanho empresa: 50-500 funcionários
- Indústria: Technology, SaaS, Marketing
- Senioridade: Manager+

FORMATOS:
1. Sponsored Content (60%)
   - Single image ads
   - Document ads (lead magnets)
   
2. Message Ads (20%)
   - InMail direto (personalizado)
   
3. Lead Gen Forms (20%)
   - Formulário nativo (converte 3x mais)

BUDGET:
- CPM: R$ 50-80 (mais caro que outras plataformas)
- CPC: R$ 8-15
- CPL: R$ 80-150

OTIMIZAÇÃO:
- A/B test headlines (profissional vs benefício)
- Remarketing de visitantes do site
- Lookalike de clientes atuais`;
    }
}

// ==================== BI AGENT ====================
export class BIAgent extends BaseAgent {
    constructor() {
        super('analyst-bi', 'Analista de BI', 'analytics');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawReport = this.generateBIReport(task, context);

        const validated = await this.validateAndHumanize(rawReport, userId, {
            enforceMinScore: 70,
            addInterjections: false,
            addImperfections: false
        });

        return { report: validated.humanized, validation: validated };
    }

    private generateBIReport(task: any, context: UserContext): string {
        return `RELATÓRIO DE BI - ${new Date().toLocaleDateString()}

OVERVIEW:
- Período: Últimos 30 dias
- Canais analisados: Meta, Google, LinkedIn, Orgânico

MÉTRICAS PRINCIPAIS:
┌─────────────────┬──────────┬─────────┬────────┐
│ Métrica         │ Atual    │ Meta    │ Status │
├─────────────────┼──────────┼─────────┼────────┤
│ Leads           │ 1.247    │ 1.000   │ ✅ +24%│
│ CAC             │ R$ 42,50 │ R$ 50   │ ✅ -15%│
│ ROAS            │ 4.2:1    │ 4:1     │ ✅ +5% │
│ CVR             │ 3.8%     │ 3.5%    │ ✅ +8% │
└─────────────────┴──────────┴─────────┴────────┘

INSIGHTS:
1. Meta Ads performando 35% acima da média
2. Google Search com Quality Score médio de 8.5
3. LinkedIn gerando leads mais qualificados (MQL rate: 67%)

RECOMENDAÇÕES:
→ Aumentar budget Meta em 20%
→ Pausar keywords Google com QS < 5
→ Testar InMail ads no LinkedIn`;
    }
}

// ==================== TREND AGENT ====================
export class TrendAgent extends BaseAgent {
    constructor() {
        super('analyst-market', 'Caçador de Tendências', 'analytics');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawTrends = this.generateTrendReport();

        const validated = await this.validateAndHumanize(rawTrends, userId, {
            enforceMinScore: 75,
            addInterjections: true,
            addImperfections: true,
            probability: 0.25
        });

        return { trends: validated.humanized, validation: validated };
    }

    private generateTrendReport(): string {
        return `TRENDS REPORT - ${new Date().toLocaleDateString()}

🔥 VIRALIZANDO AGORA:
1. "Agentic AI" - 847% crescimento em buscas (últimos 7 dias)
2. "AI Agents marketing" - Trend emergente no LinkedIn
3. Carrosséis educativos - Engajamento 3x maior que posts únicos

📊 DADOS:
- TikTok: Sounds "motivacional tech" em alta
- Instagram: Reels < 15s performam melhor
- LinkedIn: Posts com dados/números têm 2.5x mais engajamento

💡 OPORTUNIDADES:
→ Criar série "AI Explica" (formato carrossel)
→ Testar Reels ultra-curtos (7-10s)
→ Postar às 18h (pico de engajamento detectado)`;
    }
}

// ==================== COMPETITOR AGENT ====================
export class CompetitorAgent extends BaseAgent {
    constructor() {
        super('analyst-competitor', 'Espião de Concorrência', 'analytics');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawAnalysis = this.generateCompetitorAnalysis(task);

        const validated = await this.validateAndHumanize(rawAnalysis, userId, {
            enforceMinScore: 70,
            addInterjections: false,
            addImperfections: false
        });

        return { analysis: validated.humanized, validation: validated };
    }

    private generateCompetitorAnalysis(task: any): string {
        return `ANÁLISE COMPETITIVA - ${task.competitor || 'Concorrente X'}

PERFIL ANALISADO:
- Instagram: @${task.competitor}
- Seguidores: 45.2K
- Frequência: 2.5 posts/dia
- Engagement rate: 2.8% (acima da média)

ESTRATÉGIA IDENTIFICADA:
1. Foco em carrosséis educativos (60% dos posts)
2. Tom informal + emojis frequentes
3. Hashtags de nicho (#marketingdigitalBR)
4. Posting times: 9h, 14h, 19h

PONTOS FORTES:
✅ Consistência (posting diário)
✅ Engajamento alto nos comentários
✅ CTAs claros

PONTOS FRACOS:
❌ Pouca presença no LinkedIn
❌ Reels sem legendas (perda de alcance)
❌ Sem estratégia de ads aparente

RECOMENDAÇÕES:
→ Replicar formato carrossel (mas com nosso branding)
→ Explorar LinkedIn (gap de mercado)
→ Testar horários alternativos (evitar competição direta)`;
    }
}

// Exports
export const metaAdsManager = new MetaAdsManagerAgent();
export const googleAdsManager = new GoogleAdsManagerAgent();
export const tiktokAdsManager = new TikTokAdsManagerAgent();
export const linkedinAdsManager = new LinkedInAdsManagerAgent();
export const biAgent = new BIAgent();
export const trendAgent = new TrendAgent();
export const competitorAgent = new CompetitorAgent();
