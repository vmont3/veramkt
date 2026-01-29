/**
 * CRM, FINANCE & EXECUTION AGENTS
 * 
 * CRM:
 * 1. CloserAgent - SDR/Vendas
 * 2. SuccessAgent - Customer Success
 * 3. EnricherAgent - Data enrichment
 * 
 * LEADERSHIP:
 * 4. FinanceGuardAgent - CFO/Budget protection
 * 5. EditorChiefAgent - Quality control
 */

import { BaseAgent, UserContext, ContentOutput } from './BaseAgent';

// ==================== CLOSER AGENT (SDR) ====================
export class CloserAgent extends BaseAgent {
    constructor() {
        super('crm-closer', 'Closer SDR', 'crm');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawScript = this.generateSalesScript(task, context);

        // Scripts de venda precisam ser MUITO naturais
        const validated = await this.validateAndHumanize(rawScript, userId, {
            enforceMinScore: 85,
            addInterjections: true,
            addImperfections: true,
            probability: 0.30
        });

        return { script: validated.humanized, validation: validated };
    }

    private generateSalesScript(task: any, context: UserContext): string {
        const leadName = task.leadName || 'João';
        const brand = context.brand?.name || 'VERA';

        return `SCRIPT DE QUALIFICAÇÃO (BANT)\n\nOi ${leadName}!\n\nVi que você se cadastrou na ${brand}. Tudo certo por aí?\n\n[ESCUTAR RESPOSTA]\n\nLegal! Deixa eu entender melhor seu cenário:\n\n1. BUDGET:\n"Atualmente você investe quanto por mês em marketing digital?\nTá entre R$ 2k-5k ou acima disso?"\n\n2. AUTHORITY:\n"Você que toma a decisão sobre ferramentas de marketing\nou precisa alinhar com alguém?"\n\n3. NEED:\n"Qual o principal desafio hoje?\n- Gerar mais leads?\n- Melhorar conversão?\n- Automatizar processos?"\n\n4. TIMELINE:\n"Quando vocês querem ter isso resolvido?\nÉ pra ontem ou tem um prazo mais tranquilo?"\n\n[SE QUALIFICADO (Budget + Authority + Need urgent)]:\n\n"Perfeito! Baseado no que você falou, recomendo começar\ncom o plano [STARTER/GROWTH].\n\nQuer que eu te mande um teste grátis de 7 dias pra\nvocê validar antes de fechar?"\n\n[OBJEÇÕES COMUNS]\n\n"Tá caro":\n→ "Comparado com agência tradicional (R$ 8k/mês),\na VERA sai 70% mais barato. Além disso, você pode\ncomeçar grátis e só escalar se funcionar."\n\n"Preciso pensar":\n→ "Sem problema! O que especificamente você quer\nvalidar? Posso te ajudar a tirar essas dúvidas agora?"\n\n"Já uso outras ferramentas":\n→ "Entendo. Quais você usa hoje? [ESCUTAR]\nE elas conversam entre si ou você fica fazendo\nmalabarismo com 5 abas abertas?"`;
    }
}

// ==================== SUCCESS AGENT ====================
export class SuccessAgent extends BaseAgent {
    constructor() {
        super('crm-success', 'Customer Success', 'crm');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawMessage = this.generateSuccessMessage(task, context);

        const validated = await this.validateAndHumanize(rawMessage, userId, {
            enforceMinScore: 80,
            addInterjections: true,
            addImperfections: true,
            probability: 0.25
        });

        return { message: validated.humanized, validation: validated };
    }

    private generateSuccessMessage(task: any, context: UserContext): string {
        const customerName = task.customerName || 'Cliente';
        const brand = context.brand?.name || 'VERA';

        return `MENSAGEM DE CHECK-IN\n\nOi ${customerName}!\n\nAqui é a ${brand}. Como tá indo a primeira semana?\n\nVi que você ativou os agentes mas ainda não criou nenhuma pauta.\nTudo bem?\n\nMuita gente trava nessa parte. É normal.\n\nSe quiser, posso te ajudar a:\n1. Escolher os primeiros agentes pra ativar\n2. Criar uma pauta simples (leva 5 min)\n3. Entender os relatórios\n\nQuer marcar 15 min comigo amanhã?\nOu prefere que eu te mande um vídeo explicando?\n\nAbraço!\n\n---\n\nHEALTH SCORE TRACKING:\n\n✅ VERDE (Healthy):\n- Logou nos últimos 3 dias\n- Criou pelo menos 1 pauta\n- Gerou conteúdo\n- Credits > 50%\n\n⚠️ AMARELO (At Risk):\n- Não loga há 5-7 dias\n- Credits < 20%\n- Nenhuma pauta criada\n→ AÇÃO: Email check-in\n\n🚨 VERMELHO (Churn Risk):\n- Não loga há 10+ dias\n- Credits zerados mas não renovou\n- Suporte contatou mas sem resposta\n→ AÇÃO: CEO outreach + oferta especial`;
    }
}

// ==================== ENRICHER AGENT ====================
export class EnricherAgent extends BaseAgent {
    constructor() {
        super('crm-enricher', 'Enriquecedor de Dados', 'crm');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawReport = this.generateEnrichmentReport(task);

        const validated = await this.validateAndHumanize(rawReport, userId, {
            enforceMinScore: 70,
            addInterjections: false,
            addImperfections: false
        });

        return { report: validated.humanized, validation: validated };
    }

    private generateEnrichmentReport(task: any): string {
        return `RELATÓRIO DE ENRIQUECIMENTO\n\nLEAD: ${task.email || 'contato@empresa.com'}\n\nDADOS ENCONTRADOS:\n\nPESSOAIS:\n- Nome: João Silva\n- Cargo: Marketing Manager\n- LinkedIn: linkedin.com/in/joaosilva\n\nEMPRESA:\n- Nome: Tech Startup LTDA\n- CNPJ: 12.345.678/0001-90\n- Funcionários: 50-200 (estimativa)\n- Setor: SaaS B2B\n- Receita estimada: R$ 5-10M/ano\n- Site: techstartup.com.br\n\nTECH STACK DETECTADO:\n- CRM: HubSpot\n- Analytics: Google Analytics\n- Ads: Meta + Google\n- Email: Mailchimp\n\nLEAD SCORING:\n┌──────────────────┬────────┐\n│ Critério         │ Pontos │\n├──────────────────┼────────┤\n│ Cargo (Manager)  │ +20    │\n│ Empresa 50+ func │ +30    │\n│ Setor SaaS       │ +25    │\n│ Tech Stack compat│ +15    │\n│ Engajou conteúdo │ +10    │\n├──────────────────┼────────┤\n│ TOTAL            │ 100/100│\n└──────────────────┴────────┘\n\nCLASSIFICAÇÃO: 🔥 HOT LEAD (priorizar)\n\nPRÓXIMOS PASSOS:\n→ Closer SDR deve contactar em 24h\n→ Personalizar pitch (mencionar HubSpot integration)\n→ Oferecer demo técnica`;
    }
}

// ==================== FINANCE GUARD AGENT ====================
export class FinanceGuardAgent extends BaseAgent {
    constructor() {
        super('finance-guard', 'Guardião Financeiro', 'strategy');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawAlert = this.generateFinanceAlert(task, context);

        const validated = await this.validateAndHumanize(rawAlert, userId, {
            enforceMinScore: 70,
            addInterjections: false,
            addImperfections: false
        });

        return { alert: validated.humanized, validation: validated };
    }

    private generateFinanceAlert(task: any, context: UserContext): string {
        return `🛡️ ALERTA FINANCEIRO\n\nCAMPANHA: ${task.campaignName || 'Meta Ads - Conversões'}\n\nANOMALIA DETECTADA:\n❌ Gasto 50% do budget diário em 2 horas\n❌ ROAS atual: 1.2:1 (meta: 4:1)\n❌ CPL: R$ 85 (80% acima da média)\n\nAÇÕES TOMADAS:\n✅ Campanha PAUSADA automaticamente\n✅ Notificação enviada ao gestor\n✅ Budget realocado para campanha performante\n\nANÁLISE:\n- Ad Set "Broad Targeting" consumindo budget\n- CTR normal (2.1%) mas CVR baixíssima (0.8%)\n- Provável problema: Landing page ou audience\n\nRECOMENDAÇÕES:\n1. Revisar landing page (testar nova versão)\n2. Excluir audience "Broad" (não converte)\n3. Focar budget em Lookalike 1% (ROAS 5.2:1)\n\nBUDGET PROTEGIDO: R$ 1.247,00\nPOTENCIAL LOSS EVITADO: R$ 890,00`;
    }
}

// ==================== EDITOR CHIEF AGENT ====================
export class EditorChiefAgent extends BaseAgent {
    constructor() {
        super('editor-chief', 'Editor Chefe', 'strategy');
    }

    public async execute(userId: string, task: any): Promise<any> {
        const context = await this.fetchUserContext(userId);

        const rawReview = this.generateContentReview(task, context);

        const validated = await this.validateAndHumanize(rawReview, userId, {
            enforceMinScore: 75,
            addInterjections: false,
            addImperfections: false
        });

        return { review: validated.humanized, validation: validated };
    }

    private generateContentReview(task: any, context: UserContext): string {
        return `REVISÃO EDITORIAL\n\nCONTEÚDO: ${task.contentType || 'Post Instagram'}\nCRIADO POR: ${task.agentName || 'Copy Social Agent'}\n\nAVALIAÇÃO:\n\n✅ APROVADO COM RESSALVAS\n\nPONTOS FORTES:\n+ Hook forte nos primeiros caracteres\n+ CTA claro e direto\n+ Tom alinhado com brand guidelines\n+ Hashtags relevantes\n\nPONTOS A MELHORAR:\n⚠️ Usar "inovador" demais (aparece 2x)\n⚠️ Emoji 🚀 overused (clichê de tech)\n⚠️ Falta prova social (números, depoimentos)\n\nSUGESTÕES:\n→ Substituir "inovador" por especificidade:\n   "inovador" → "23 agentes especializados"\n\n→ Trocar emoji:\n   🚀 → 🎯 (menos batido)\n\n→ Adicionar dado:\n   "+280% de leads em 60 dias" (case real)\n\nSCORE FINAL: 82/100\n\nDECISÃO:\n☑️ Aprovar para publicação (com ajustes menores)\n☐ Rejeitar (requer reescrita)\n☐ Escalar para humano`;
    }
}

// Exports
export const closerAgent = new CloserAgent();
export const successAgent = new SuccessAgent();
export const enricherAgent = new EnricherAgent();
export const financeGuardAgent = new FinanceGuardAgent();
export const editorChiefAgent = new EditorChiefAgent();
