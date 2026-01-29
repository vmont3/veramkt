// backend/src/services/agents/CopyAgentsV2.ts
import { agentOrchestrator } from '../orchestration/AgentOrchestrator';
import { AgentPersonas } from './AgentPersonas';

// ==============================================
// COPY SOCIAL SHORT AGENT (Instagram, X, TikTok)
// ==============================================

export class CopySocialShortAgent {
    agentType = 'CopySocialShort';

    async execute(userId: string, task: any): Promise<any> {
        console.log(`[${this.agentType}] Iniciando execução`);

        try {
            // Delegar toda a orquestração para o AgentOrchestrator
            const result = await agentOrchestrator.orchestrate(
                this.agentType,
                userId,
                {
                    ...task,
                    // Adicionar parâmetros específicos do agente
                    agentSpecific: {
                        platform: task.platform,
                        maxLength: task.platform === 'Twitter' ? 280 : 300,
                        variations: task.variations || 3,
                        hashtagCount: task.hashtagCount || 5
                    }
                }
            );

            // Se a orquestração foi bem-sucedida, formatar resultado específico
            if (result.success) {
                return {
                    ...result,
                    result: this.formatCopyResult(result.result, task.platform)
                };
            }

            return result;

        } catch (error: any) {
            console.error(`[${this.agentType}] Erro:`, error);
            return {
                success: false,
                error: error.message,
                cost: 0,
                validation: { score: 0, passed: false, issues: [] },
                metadata: {
                    agent: this.agentType,
                    userId,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }

    private formatCopyResult(content: string, platform: string): any {
        // Extrair variações do conteúdo
        const variations = this.extractVariations(content);

        // Extrair hashtags
        const hashtags = this.extractHashtags(content);

        // Gerar prompt de imagem sugerido
        const imagePrompt = this.generateImagePrompt(variations[0], platform);

        return {
            variations,
            hashtags,
            bestVariation: variations[0] || content,
            characterCount: variations[0]?.length || content.length,
            imagePrompt,
            platform,
            format: this.getPlatformFormat(platform)
        };
    }

    private extractVariations(content: string): string[] {
        // Tentar encontrar variações por marcadores
        const markers = ['Variação 1:', 'Variação 2:', 'Variação 3:', 'Opção 1:', 'Opção 2:', 'Opção 3:'];

        for (const marker of markers) {
            if (content.includes(marker)) {
                return content.split(marker)
                    .slice(1)
                    .map(v => v.trim())
                    .filter(v => v.length > 20);
            }
        }

        // Se não encontrar marcadores, dividir por linhas em branco
        return content.split('\n\n')
            .filter(v => v.trim().length > 30)
            .slice(0, 3);
    }

    private extractHashtags(text: string): string[] {
        const hashtagRegex = /#[\w\u00C0-\u017F]+/g;
        const matches = text.match(hashtagRegex) || [];
        return [...new Set(matches)].slice(0, 8);
    }

    private generateImagePrompt(copy: string, platform: string): string {
        const basePrompt = `Crie uma imagem para post no ${platform} sobre: "${copy.substring(0, 100)}"`;

        const styles: Record<string, string> = {
            'Instagram': 'Estilo clean, cores vibrantes, composição moderna, iluminação natural',
            'Twitter': 'Design minimalista, tipografia forte, alto contraste',
            'TikTok': 'Estilo dinâmico, cores saturadas, elementos em movimento',
            'LinkedIn': 'Profissional, cores corporativas, layout limpo'
        };

        return `${basePrompt}. ${styles[platform] || 'Estilo moderno e atrativo'}`;
    }

    private getPlatformFormat(platform: string): string {
        const formats: Record<string, string> = {
            'Instagram': 'Linhas curtas, emojis estratégicos, espaçamento generoso',
            'Twitter': 'Texto conciso, hashtag principal, thread se necessário',
            'TikTok': 'Legenda curta, emojis, hashtags de trend',
            'LinkedIn': 'Tom profissional, parágrafos curtos, valor claro'
        };

        return formats[platform] || 'Texto otimizado para redes sociais';
    }
}

export const copySocialShortAgent = new CopySocialShortAgent();

// ==============================================
// COPY SOCIAL LONG AGENT (Artigos, LinkedIn, Blog)
// ==============================================

export class CopySocialLongAgent {
    agentType = 'CopySocialLong';

    async execute(userId: string, task: any): Promise<any> {
        console.log(`[${this.agentType}] Iniciando execução`);

        try {
            const result = await agentOrchestrator.orchestrate(
                this.agentType,
                userId,
                {
                    ...task,
                    agentSpecific: {
                        contentType: task.contentType || 'article',
                        minLength: task.minLength || 800,
                        maxLength: task.maxLength || 2000,
                        includeHeadings: task.includeHeadings !== false,
                        tone: task.tone || 'autoridade'
                    }
                }
            );

            if (result.success) {
                return {
                    ...result,
                    result: this.formatLongFormResult(result.result, task)
                };
            }

            return result;

        } catch (error: any) {
            console.error(`[${this.agentType}] Erro:`, error);
            return {
                success: false,
                error: error.message,
                cost: 0,
                validation: { score: 0, passed: false, issues: [] },
                metadata: {
                    agent: this.agentType,
                    userId,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }

    private formatLongFormResult(content: string, task: any): any {
        // Extrair título
        const title = this.extractTitle(content);

        // Extrair subtítulos
        const subtitles = this.extractSubtitles(content);

        // Contar palavras
        const wordCount = content.split(/\s+/).length;

        // Extrair pontos-chave
        const keyPoints = this.extractKeyPoints(content);

        // Sugerir metadados SEO
        const seoMetadata = this.generateSEOMetadata(title, content, task.keywords);

        return {
            title,
            content,
            subtitles,
            wordCount,
            keyPoints,
            seoMetadata,
            readingTime: `${Math.ceil(wordCount / 200)} min`,
            format: task.contentType || 'article'
        };
    }

    private extractTitle(content: string): string {
        // Tenta encontrar título no início
        const firstLine = content.split('\n')[0].trim();
        if (firstLine && firstLine.length < 120 && !firstLine.startsWith('#')) {
            return firstLine;
        }

        // Procura por marcações de título
        const titleMatch = content.match(/^# (.+)$/m);
        if (titleMatch) return titleMatch[1];

        // Fallback: primeira frase significativa
        const sentences = content.split(/[.!?]+/);
        return sentences[0]?.substring(0, 100) || 'Artigo';
    }

    private extractSubtitles(content: string): string[] {
        const subtitleRegex = /^## (.+)$/gm;
        const matches = [...content.matchAll(subtitleRegex)];
        return matches.map(match => match[1]).slice(0, 10);
    }

    private extractKeyPoints(content: string): string[] {
        // Procura por listas
        const listItemRegex = /^[•\-*]\s+(.+)$/gm;
        const matches = [...content.matchAll(listItemRegex)];

        if (matches.length > 0) {
            return matches.map(match => match[1]).slice(0, 5);
        }

        // Fallback: frases importantes
        return content.split(/[.!?]+/)
            .filter(s => s.length > 30 && s.length < 150)
            .slice(0, 5)
            .map(s => s.trim());
    }

    private generateSEOMetadata(title: string, content: string, keywords?: string[]): any {
        const description = content.substring(0, 160).replace(/\n/g, ' ') + '...';

        // Extrair palavras-chave do conteúdo
        const contentKeywords = this.extractKeywords(content);

        return {
            title: title.length > 60 ? title.substring(0, 60) + '...' : title,
            description,
            keywords: [...new Set([...(keywords || []), ...contentKeywords.slice(0, 5)])],
            slug: this.generateSlug(title),
            ogImagePrompt: `Imagem para artigo sobre ${title.substring(0, 50)}`
        };
    }

    private extractKeywords(text: string): string[] {
        const words = text.toLowerCase()
            .replace(/[^\w\s\u00C0-\u017F]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);

        const stopWords = new Set([
            'para', 'com', 'como', 'mais', 'mas', 'por', 'que', 'este', 'esta',
            'isso', 'isso', 'sobre', 'entre', 'após', 'antes', 'durante', 'quando',
            'onde', 'porque', 'pois', 'porém', 'todavia', 'entretanto', 'assim'
        ]);

        const frequency: Record<string, number> = {};
        words.forEach(word => {
            if (!stopWords.has(word)) {
                frequency[word] = (frequency[word] || 0) + 1;
            }
        });

        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    }

    private generateSlug(title: string): string {
        return title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .replace(/-+/g, '-') // Remove múltiplos hífens
            .substring(0, 60)
            .replace(/-$/, ''); // Remove hífen final
    }
}

export const copySocialLongAgent = new CopySocialLongAgent();

// ==============================================
// COPY ADS AGENT (Anúncios, Meta Ads, Google Ads)
// ==============================================

export class CopyAdsAgent {
    agentType = 'CopyAdsAgent';

    async execute(userId: string, task: any): Promise<any> {
        console.log(`[${this.agentType}] Iniciando execução`);

        try {
            const result = await agentOrchestrator.orchestrate(
                this.agentType,
                userId,
                {
                    ...task,
                    agentSpecific: {
                        platform: task.platform || 'meta',
                        adType: task.adType || 'traffic',
                        targetAudience: task.targetAudience,
                        painPoints: task.painPoints,
                        benefits: task.benefits,
                        urgency: task.urgency || false,
                        socialProof: task.socialProof || false
                    }
                }
            );

            if (result.success) {
                return {
                    ...result,
                    result: this.formatAdsResult(result.result, task)
                };
            }

            return result;

        } catch (error: any) {
            console.error(`[${this.agentType}] Erro:`, error);
            return {
                success: false,
                error: error.message,
                cost: 0,
                validation: { score: 0, passed: false, issues: [] },
                metadata: {
                    agent: this.agentType,
                    userId,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }

    private formatAdsResult(content: string, task: any): any {
        // Parsear estrutura de anúncio
        const adStructure = this.parseAdStructure(content);

        // Gerar variações para A/B testing
        const variations = this.generateABVariations(adStructure);

        // Sugerir criativos
        const creativeSuggestions = this.generateCreativeSuggestions(adStructure, task.platform);

        // Estimativa de performance
        const performanceEstimate = this.estimatePerformance(adStructure, task.platform);

        return {
            ...adStructure,
            variations,
            creativeSuggestions,
            performanceEstimate,
            platform: task.platform || 'meta',
            adType: task.adType || 'traffic',
            characterCounts: {
                headline: adStructure.headline?.length || 0,
                primaryText: adStructure.primaryText?.length || 0,
                description: adStructure.description?.length || 0
            }
        };
    }

    private parseAdStructure(content: string): any {
        // Tentar extrair por seções
        const sections: Record<string, string> = {};

        const patterns = {
            headline: /(?:Headline|Título):\s*([^\n]+)/i,
            primaryText: /(?:Primary Text|Texto Principal):\s*([\s\S]+?)(?=\n\n|$)/i,
            description: /(?:Description|Descrição):\s*([^\n]+)/i,
            cta: /(?:CTA|Call to Action):\s*([^\n]+)/i,
            displayUrl: /(?:Display URL|URL de Exibição):\s*([^\n]+)/i
        };

        for (const [key, pattern] of Object.entries(patterns)) {
            const match = content.match(pattern);
            if (match) {
                sections[key] = match[1].trim();
            }
        }

        // Se não encontrou por padrões, tentar heurística
        if (!sections.headline) {
            const lines = content.split('\n').filter(l => l.trim());
            if (lines[0]) sections.headline = lines[0];
            if (lines[1]) sections.primaryText = lines.slice(1).join('\n');
        }

        return sections;
    }

    private generateABVariations(adStructure: any): any[] {
        const variations = [];

        // Variação 1: Original
        variations.push({
            name: 'Variação A (Original)',
            ...adStructure,
            angle: 'Benefício principal'
        });

        // Variação 2: Foco em dor
        if (adStructure.headline) {
            variations.push({
                name: 'Variação B (Foco na Dor)',
                headline: this.transformToPainAngle(adStructure.headline),
                primaryText: adStructure.primaryText,
                cta: adStructure.cta,
                angle: 'Solução para dor específica'
            });
        }

        // Variação 3: Foco em urgência
        if (adStructure.headline) {
            variations.push({
                name: 'Variação C (Urgência)',
                headline: this.addUrgency(adStructure.headline),
                primaryText: this.addUrgencyElements(adStructure.primaryText),
                cta: this.addUrgencyToCTA(adStructure.cta),
                angle: 'Oferta limitada/Urgência'
            });
        }

        return variations;
    }

    private transformToPainAngle(headline: string): string {
        const transformations = [
            headline => headline.replace(/transforme/i, 'cansado de'),
            headline => headline.replace(/aprenda/i, 'pare de sofrer com'),
            headline => headline.replace(/aumente/i, 'resolva o problema de')
        ];

        for (const transform of transformations) {
            const transformed = transform(headline);
            if (transformed !== headline) {
                return transformed;
            }
        }

        return `Cansado de não ter resultados? ${headline}`;
    }

    private addUrgency(text: string): string {
        if (!text) return text;

        const urgencyPhrases = [
            '⚠️ Oferta limitada: ',
            '⏰ Última chance: ',
            '🔥 Só hoje: ',
            '🚀 Exclusivo para os primeiros: '
        ];

        const phrase = urgencyPhrases[Math.floor(Math.random() * urgencyPhrases.length)];
        return phrase + text;
    }

    private addUrgencyElements(text: string): string {
        if (!text) return text;

        const urgencyElements = [
            '\n\n⏰ Oferta válida apenas por 24 horas!',
            '\n\n🚀 Vagas limitadas!',
            '\n\n🔥 Promoção relâmpago!',
            '\n\n💎 Oportunidade exclusiva!'
        ];

        return text + urgencyElements[Math.floor(Math.random() * urgencyElements.length)];
    }

    private addUrgencyToCTA(cta?: string): string {
        const baseCTA = cta || 'Saiba mais';
        const urgencyCTAs = [
            `${baseCTA} agora!`,
            `Garanta sua vaga!`,
            `Não perca essa chance!`,
            `Reserve seu lugar!`
        ];

        return urgencyCTAs[Math.floor(Math.random() * urgencyCTAs.length)];
    }

    private generateCreativeSuggestions(adStructure: any, platform: string): string[] {
        const suggestions = [];

        if (platform === 'meta') {
            suggestions.push(
                '📱 Vídeo de 15s mostrando antes/depois',
                '🎯 Imagem com overlay de texto destacando o benefício principal',
                '📊 Carrossel com 3 cards: problema → solução → resultado'
            );
        } else if (platform === 'google') {
            suggestions.push(
                '🔍 Imagem limpa com foco no produto',
                '📈 Gráfico mostrando resultado',
                '👥 Foto real de cliente satisfeito'
            );
        } else if (platform === 'tiktok') {
            suggestions.push(
                '🎬 UGC (User Generated Content) autêntico',
                '📱 Tela dividida mostrando comparação',
                '💬 Vídeo com texto na tela e música trend'
            );
        }

        return suggestions.slice(0, 3);
    }

    private estimatePerformance(adStructure: any, platform: string): any {
        const baseCTR = {
            'meta': 0.02,
            'google': 0.04,
            'tiktok': 0.08,
            'linkedin': 0.015
        }[platform] || 0.02;

        // Fatores de qualidade
        let qualityScore = 1.0;

        // Headline curto (+)
        if (adStructure.headline && adStructure.headline.length < 40) qualityScore *= 1.1;

        // CTA clara (+)
        if (adStructure.cta && adStructure.cta.includes('!')) qualityScore *= 1.05;

        // Urgência (+)
        if (adStructure.headline?.match(/agora|hoje|limitad[oa]|últim[oa]/i)) qualityScore *= 1.15;

        const estimatedCTR = baseCTR * qualityScore;

        return {
            estimatedCTR: `${(estimatedCTR * 100).toFixed(2)}%`,
            qualityScore: qualityScore.toFixed(2),
            suggestions: this.getPerformanceSuggestions(adStructure)
        };
    }

    private getPerformanceSuggestions(adStructure: any): string[] {
        const suggestions = [];

        if (!adStructure.headline || adStructure.headline.length < 10) {
            suggestions.push('Headline muito curto - adicione mais benefícios');
        }

        if (!adStructure.cta) {
            suggestions.push('Adicione uma CTA clara');
        }

        if (adStructure.primaryText && adStructure.primaryText.length > 200) {
            suggestions.push('Texto muito longo - simplifique para mobile');
        }

        return suggestions.length > 0 ? suggestions : ['Copy bem otimizada!'];
    }
}

export const copyAdsAgent = new CopyAdsAgent();

// ==============================================
// COPY CRM AGENT (Email Marketing, Sequências)
// ==============================================

export class CopyCRMAgent {
    agentType = 'CopyCRMAgent';

    async execute(userId: string, task: any): Promise<any> {
        console.log(`[${this.agentType}] Iniciando execução`);

        try {
            const result = await agentOrchestrator.orchestrate(
                this.agentType,
                userId,
                {
                    ...task,
                    agentSpecific: {
                        emailType: task.emailType || 'nurture',
                        sequenceLength: task.sequenceLength || 3,
                        personalization: task.personalization || ['{nome}'],
                        goal: task.goal || 'engagement',
                        includeUnsubscribe: task.includeUnsubscribe !== false
                    }
                }
            );

            if (result.success) {
                return {
                    ...result,
                    result: this.formatCRMResult(result.result, task)
                };
            }

            return result;

        } catch (error: any) {
            console.error(`[${this.agentType}] Erro:`, error);
            return {
                success: false,
                error: error.message,
                cost: 0,
                validation: { score: 0, passed: false, issues: [] },
                metadata: {
                    agent: this.agentType,
                    userId,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }

    private formatCRMResult(content: string, task: any): any {
        // Parsear sequência de emails
        const emails = this.parseEmailSequence(content, task.sequenceLength || 3);

        // Analisar taxa de abertura estimada
        const openRateAnalysis = this.analyzeOpenRate(emails);

        // Sugerir melhorias
        const improvements = this.suggestImprovements(emails);

        // Gerar variáveis de personalização
        const personalizationVariables = this.extractPersonalizationVariables(emails);

        return {
            emails,
            sequenceLength: emails.length,
            openRateAnalysis,
            improvements,
            personalizationVariables,
            totalWordCount: emails.reduce((sum, email) => sum + email.wordCount, 0),
            estimatedReadingTime: this.calculateReadingTime(emails),
            emailType: task.emailType || 'nurture'
        };
    }

    private parseEmailSequence(content: string, expectedLength: number): any[] {
        const emails = [];

        // Tentar dividir por marcadores de email
        const emailSections = content.split(/(?:Email \d+|Email \d+:|Dia \d+:|###)/gi);

        for (let i = 1; i < emailSections.length; i++) {
            const section = emailSections[i].trim();
            if (!section) continue;

            const email = this.parseEmail(section);
            emails.push(email);

            if (emails.length >= expectedLength) break;
        }

        // Se não encontrou marcadores, dividir por linhas em branco duplas
        if (emails.length === 0) {
            const sections = content.split('\n\n\n');
            sections.forEach((section, index) => {
                if (section.trim() && index < expectedLength) {
                    emails.push(this.parseEmail(section));
                }
            });
        }

        return emails.slice(0, expectedLength);
    }

    private parseEmail(content: string): any {
        // Extrair subject
        let subject = '';
        let body = content;

        const subjectMatch = content.match(/Assunto:\s*(.+?)(?=\n|$)/i);
        if (subjectMatch) {
            subject = subjectMatch[1].trim();
            body = content.replace(subjectMatch[0], '').trim();
        } else {
            // Tentar extrair primeira linha como subject
            const lines = content.split('\n');
            if (lines[0] && lines[0].length < 100) {
                subject = lines[0].trim();
                body = lines.slice(1).join('\n').trim();
            }
        }

        // Extrair preheader
        let preheader = '';
        const preheaderMatch = body.match(/Preheader:\s*(.+?)(?=\n|$)/i);
        if (preheaderMatch) {
            preheader = preheaderMatch[1].trim();
            body = body.replace(preheaderMatch[0], '').trim();
        }

        // Calcular métricas
        const wordCount = body.split(/\s+/).length;
        const paragraphCount = body.split('\n\n').filter(p => p.trim()).length;

        // Identificar CTA
        const cta = this.extractCTA(body);

        // Verificar elementos de personalização
        const hasPersonalization = body.includes('{') || body.includes('[');

        return {
            subject,
            preheader,
            body,
            wordCount,
            paragraphCount,
            cta,
            hasPersonalization,
            characterCounts: {
                subject: subject.length,
                preheader: preheader.length,
                body: body.length
            }
        };
    }

    private extractCTA(body: string): string {
        const ctaPatterns = [
            /(?:Clique aqui|Saiba mais|Garanta já|Acesse agora|Quero saber mais)[^.!?]*[.!?]/gi,
            /🔗[^\n]+/g,
            /\[([^\]]+)\]\([^)]+\)/g
        ];

        for (const pattern of ctaPatterns) {
            const matches = body.match(pattern);
            if (matches && matches[0]) {
                return matches[0].trim();
            }
        }

        // Última frase como fallback
        const sentences = body.split(/[.!?]+/);
        return sentences[sentences.length - 2]?.trim() || '';
    }

    private analyzeOpenRate(emails: any[]): any {
        let totalScore = 0;
        const factors = [];

        emails.forEach((email, index) => {
            let emailScore = 50; // Base

            // Análise do subject
            if (email.subject) {
                // Comprimento ideal
                if (email.subject.length >= 30 && email.subject.length <= 50) {
                    emailScore += 10;
                    factors.push(`Email ${index + 1}: Subject com comprimento ideal`);
                }

                // Urgência/Curiosidade
                if (email.subject.match(/\?|!|urgente|agora|novo|exclusivo/i)) {
                    emailScore += 15;
                    factors.push(`Email ${index + 1}: Subject com gatilho de atenção`);
                }

                // Personalização
                if (email.subject.includes('{nome}') || email.subject.includes('[NOME]')) {
                    emailScore += 20;
                    factors.push(`Email ${index + 1}: Subject personalizável`);
                }
            }

            // Preheader
            if (email.preheader) {
                emailScore += 5;
            }

            totalScore += emailScore;
        });

        const avgScore = totalScore / emails.length;
        const estimatedOpenRate = 15 + (avgScore * 0.3); // 15-45%

        return {
            estimatedOpenRate: `${estimatedOpenRate.toFixed(1)}%`,
            score: avgScore.toFixed(1),
            factors,
            rating: avgScore > 70 ? 'Excelente' : avgScore > 50 ? 'Bom' : 'Pode melhorar'
        };
    }

    private suggestImprovements(emails: any[]): string[] {
        const suggestions = [];

        emails.forEach((email, index) => {
            // Verificar subject
            if (!email.subject) {
                suggestions.push(`Email ${index + 1}: Adicione um subject`);
            } else if (email.subject.length < 20) {
                suggestions.push(`Email ${index + 1}: Subject muito curto - adicione mais contexto`);
            } else if (email.subject.length > 70) {
                suggestions.push(`Email ${index + 1}: Subject muito longo - pode ser cortado no mobile`);
            }

            // Verificar preheader
            if (!email.preheader) {
                suggestions.push(`Email ${index + 1}: Adicione um preheader para aumentar abertura`);
            }

            // Verificar CTA
            if (!email.cta) {
                suggestions.push(`Email ${index + 1}: Adicione uma CTA clara`);
            }

            // Verificar comprimento
            if (email.wordCount > 300) {
                suggestions.push(`Email ${index + 1}: Muito longo - simplifique para melhor engajamento`);
            }
        });

        return suggestions.length > 0 ? suggestions : ['Sequência bem estruturada!'];
    }

    private extractPersonalizationVariables(emails: any[]): string[] {
        const variables = new Set<string>();

        emails.forEach(email => {
            const text = `${email.subject} ${email.preheader} ${email.body}`;

            // Encontrar variáveis como {nome}, [EMAIL], etc.
            const varMatches = text.match(/\{(.+?)\}|\[(.+?)\]/g);
            if (varMatches) {
                varMatches.forEach(match => {
                    variables.add(match);
                });
            }
        });

        return Array.from(variables);
    }

    private calculateReadingTime(emails: any[]): string {
        const totalWords = emails.reduce((sum, email) => sum + email.wordCount, 0);
        const minutes = Math.ceil(totalWords / 200);
        return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }
}

export const copyCRMAgent = new CopyCRMAgent();
