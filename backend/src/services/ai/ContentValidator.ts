/**
 * CONTENT VALIDATOR
 * Valida e detecta vícios de linguagem de IA em conteúdo gerado
 */

import {
    BANNED_PHRASES,
    CLICHE_PATTERNS,
    AntiClicheConfig,
    DEFAULT_ANTI_CLICHE_CONFIG
} from '../../config/AntiClicheRules';

export interface ValidationResult {
    isValid: boolean;
    score: number; // 0-100 (quanto maior, mais natural)
    issues: ValidationIssue[];
    suggestions: string[];
}

export interface ValidationIssue {
    type: 'banned_phrase' | 'cliche_pattern' | 'structure' | 'tone' | 'specificity';
    severity: 'low' | 'medium' | 'high';
    message: string;
    position?: number;
    suggestion?: string;
}

export class ContentValidator {
    private config: AntiClicheConfig;

    constructor(config?: Partial<AntiClicheConfig>) {
        this.config = { ...DEFAULT_ANTI_CLICHE_CONFIG, ...config };
    }

    /**
     * Valida conteúdo e retorna score + issues
     */
    public validate(content: string): ValidationResult {
        const issues: ValidationIssue[] = [];
        let penalties = 0;

        // 1. Verificar frases banidas
        const bannedIssues = this.checkBannedPhrases(content);
        issues.push(...bannedIssues);
        penalties += bannedIssues.length * 10;

        // 2. Verificar padrões clichê
        const patternIssues = this.checkClichePatterns(content);
        issues.push(...patternIssues);
        penalties += patternIssues.length * 8;

        // 3. Verificar estrutura
        const structureIssues = this.checkStructure(content);
        issues.push(...structureIssues);
        penalties += structureIssues.length * 5;

        // 4. Verificar especificidade
        const specificityIssues = this.checkSpecificity(content);
        issues.push(...specificityIssues);
        penalties += specificityIssues.length * 6;

        // 5. Verificar excesso de emojis
        const emojiIssues = this.checkEmojiOveruse(content);
        issues.push(...emojiIssues);
        penalties += emojiIssues.length * 7;

        // Score final (100 - penalidades)
        const score = Math.max(0, Math.min(100, 100 - penalties));

        // Gerar sugestões
        const suggestions = this.generateSuggestions(issues);

        return {
            isValid: score >= 70,
            score,
            issues,
            suggestions
        };
    }

    /**
     * Verifica frases banidas
     */
    private checkBannedPhrases(content: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const lowerContent = content.toLowerCase();

        for (const phrase of BANNED_PHRASES) {
            const index = lowerContent.indexOf(phrase.toLowerCase());
            if (index !== -1) {
                issues.push({
                    type: 'banned_phrase',
                    severity: 'high',
                    message: `Frase clichê detectada: "${phrase}"`,
                    position: index,
                    suggestion: 'Reformule de forma mais específica e natural'
                });
            }
        }

        return issues;
    }

    /**
     * Verifica padrões clichê (regex)
     */
    private checkClichePatterns(content: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        for (const pattern of CLICHE_PATTERNS) {
            const matches = content.match(pattern);
            if (matches) {
                issues.push({
                    type: 'cliche_pattern',
                    severity: 'medium',
                    message: `Padrão clichê detectado: "${matches[0]}"`,
                    suggestion: 'Use estrutura menos previsível'
                });
            }
        }

        return issues;
    }

    /**
     * Verifica estrutura do texto
     */
    private checkStructure(content: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

        // Verificar número de parágrafos
        if (this.config.varyLength) {
            if (paragraphs.length < this.config.minParagraphs) {
                issues.push({
                    type: 'structure',
                    severity: 'low',
                    message: `Texto muito curto (${paragraphs.length} parágrafos)`,
                    suggestion: `Use pelo menos ${this.config.minParagraphs} parágrafos`
                });
            }

            if (paragraphs.length > this.config.maxParagraphs) {
                issues.push({
                    type: 'structure',
                    severity: 'low',
                    message: `Texto muito longo (${paragraphs.length} parágrafos)`,
                    suggestion: `Mantenha entre ${this.config.minParagraphs}-${this.config.maxParagraphs} parágrafos`
                });
            }
        }

        // Verificar listas com exatamente 3 itens (padrão IA)
        const listPattern = /^[•\-\*]\s.+$/gm;
        const listMatches = content.match(listPattern);
        if (listMatches && listMatches.length === 3) {
            issues.push({
                type: 'structure',
                severity: 'medium',
                message: 'Lista com exatamente 3 itens (padrão IA típico)',
                suggestion: 'Varie: use 2, 4 ou 5 itens em listas'
            });
        }

        return issues;
    }

    /**
     * Verifica especificidade (evita termos genéricos)
     */
    private checkSpecificity(content: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        const genericTerms = [
            { term: 'muitas empresas', suggestion: 'Use números específicos (ex: 47% das PMEs)' },
            { term: 'muito tempo', suggestion: 'Seja específico (ex: 3 horas por dia)' },
            { term: 'recentemente', suggestion: 'Diga quando (ex: na semana passada)' },
            { term: 'diversos', suggestion: 'Quantos exatamente?' },
            { term: 'vários', suggestion: 'Quantos exatamente?' }
        ];

        for (const { term, suggestion } of genericTerms) {
            if (content.toLowerCase().includes(term)) {
                issues.push({
                    type: 'specificity',
                    severity: 'medium',
                    message: `Termo genérico: "${term}"`,
                    suggestion
                });
            }
        }

        return issues;
    }

    /**
     * Verifica excesso de emojis
     */
    private checkEmojiOveruse(content: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
        const emojis = content.match(emojiRegex) || [];

        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

        for (const paragraph of paragraphs) {
            const paragraphEmojis = paragraph.match(emojiRegex) || [];
            if (paragraphEmojis.length > 3) {
                issues.push({
                    type: 'tone',
                    severity: 'low',
                    message: `Excesso de emojis em um parágrafo (${paragraphEmojis.length})`,
                    suggestion: 'Use no máximo 2-3 emojis por parágrafo'
                });
            }
        }

        // Emojis repetidos demais (mais de 3 vezes o mesmo)
        const emojiCounts = emojis.reduce((acc, emoji) => {
            acc[emoji] = (acc[emoji] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        for (const [emoji, count] of Object.entries(emojiCounts)) {
            if (count > 3) {
                issues.push({
                    type: 'tone',
                    severity: 'medium',
                    message: `Emoji "${emoji}" usado ${count} vezes (repetitivo)`,
                    suggestion: 'Varie os emojis ou use menos'
                });
            }
        }

        return issues;
    }

    /**
     * Gera sugestões baseadas nos issues encontrados
     */
    private generateSuggestions(issues: ValidationIssue[]): string[] {
        const suggestions: string[] = [];

        const highSeverity = issues.filter(i => i.severity === 'high').length;
        const mediumSeverity = issues.filter(i => i.severity === 'medium').length;

        if (highSeverity > 0) {
            suggestions.push('🚨 CRÍTICO: Remova frases clichê corporativas. Use linguagem natural.');
        }

        if (mediumSeverity >= 3) {
            suggestions.push('⚠️ Vários padrões de IA detectados. Torne o texto mais humano e específico.');
        }

        const hasGeneric = issues.some(i => i.type === 'specificity');
        if (hasGeneric) {
            suggestions.push('📊 Use números e exemplos específicos ao invés de termos genéricos.');
        }

        const hasStructure = issues.some(i => i.type === 'structure');
        if (hasStructure) {
            suggestions.push('📝 Varie a estrutura: misture parágrafos curtos e longos.');
        }

        return suggestions;
    }
}

export default ContentValidator;
