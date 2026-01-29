/**
 * CONTENT HUMANIZER
 * Transforma conteúdo genérico de IA em texto natural e humanizado
 */

import {
    HUMANIZATION_REPLACEMENTS,
    BR_INTERJECTIONS,
    NATURAL_TRANSITIONS,
    BANNED_PHRASES
} from '../../config/AntiClicheRules';

export class ContentHumanizer {

    /**
     * Humaniza conteúdo removendo vícios e adicionando naturalidade
     */
    public humanize(content: string, options: {
        addInterjections?: boolean;
        addImperfections?: boolean;
        replaceGeneric?: boolean;
        probability?: number;
    } = {}): string {
        const {
            addInterjections = true,
            addImperfections = true,
            replaceGeneric = true,
            probability = 0.15
        } = options;

        let humanized = content;

        // 1. Remover frases banidas
        humanized = this.removeBannedPhrases(humanized);

        // 2. Substituir termos genéricos por específicos
        if (replaceGeneric) {
            humanized = this.replaceGenericTerms(humanized);
        }

        // 3. Adicionar interjections brasileiras
        if (addInterjections && Math.random() < probability) {
            humanized = this.addBrazilianInterjections(humanized);
        }

        // 4. Adicionar imperfeições intencionais
        if (addImperfections && Math.random() < probability) {
            humanized = this.addIntentionalImperfections(humanized);
        }

        // 5. Variar estrutura de frases
        humanized = this.varyStructure(humanized);

        return humanized;
    }

    /**
     * Remove frases corporativas genéricas
     */
    private removeBannedPhrases(content: string): string {
        let cleaned = content;

        for (const phrase of BANNED_PHRASES) {
            const regex = new RegExp(phrase, 'gi');

            // Substituir por alternativas naturais
            cleaned = cleaned.replace(regex, (match) => {
                // Se começa frase, capitalizar alternativa
                const isStart = cleaned.indexOf(match) === 0 ||
                    cleaned[cleaned.indexOf(match) - 1] === '.';

                let replacement = this.getBetterAlternative(phrase);

                if (isStart && replacement) {
                    replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
                }

                return replacement || '';
            });
        }

        // Limpar espaços duplos resultantes
        cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

        return cleaned;
    }

    /**
     * Retorna alternativa melhor para frases clichê
     */
    private getBetterAlternative(cliche: string): string {
        const alternatives: Record<string, string> = {
            'no cenário atual': 'hoje',
            'é importante ressaltar': '',
            'vale destacar': 'olha só',
            'nesse contexto': '',
            'por outro lado': 'mas',
            'além disso': 'e',
            'sendo assim': 'então',
            'diante disso': 'por isso',
            'é fundamental': 'você precisa',
            'é crucial': 'é essencial',
            'em suma': 'resumindo',
            'portanto': 'então'
        };

        return alternatives[cliche.toLowerCase()] || '';
    }

    /**
     * Substitui termos genéricos por específicos
     */
    private replaceGenericTerms(content: string): string {
        let specific = content;

        for (const [generic, specifics] of Object.entries(HUMANIZATION_REPLACEMENTS)) {
            const regex = new RegExp(generic, 'gi');

            if (regex.test(specific)) {
                // Escolher substituto aleatório
                const replacement = specifics[Math.floor(Math.random() * specifics.length)];
                specific = specific.replace(regex, replacement);
            }
        }

        return specific;
    }

    /**
     * Adiciona interjections brasileiras para naturalidade
     */
    private addBrazilianInterjections(content: string): string {
        const sentences = content.split(/([.!?])\s+/);

        // Adicionar interjection em 1-2 frases aleatórias
        if (sentences.length >= 4) {
            const targetIndex = Math.floor(Math.random() * (sentences.length / 2));
            const interjection = BR_INTERJECTIONS[Math.floor(Math.random() * BR_INTERJECTIONS.length)];

            // Inserir no início da frase escolhida
            if (sentences[targetIndex * 2]) {
                sentences[targetIndex * 2] = `${interjection}, ` +
                    sentences[targetIndex * 2].charAt(0).toLowerCase() +
                    sentences[targetIndex * 2].slice(1);
            }
        }

        return sentences.join('');
    }

    /**
     * Adiciona imperfeições intencionais (humanização)
     */
    private addIntentionalImperfections(content: string): string {
        const imperfectionTypes = [
            this.addEllipsis,
            this.addEmDash,
            this.makeIncomplete
        ];

        // Escolher tipo de imperfeição aleatório
        const imperfection = imperfectionTypes[Math.floor(Math.random() * imperfectionTypes.length)];

        return imperfection.call(this, content);
    }

    /**
     * Adiciona reticências para pausa/reflexão
     */
    private addEllipsis(content: string): string {
        const sentences = content.split('. ');

        if (sentences.length > 2) {
            const targetIndex = Math.floor(Math.random() * sentences.length);
            sentences[targetIndex] = sentences[targetIndex].replace('.', '...');
        }

        return sentences.join('. ');
    }

    /**
     * Adiciona travessão para inserção de pensamento
     */
    private addEmDash(content: string): string {
        const sentences = content.split('. ');

        if (sentences.length > 2) {
            const targetIndex = Math.floor(Math.random() * sentences.length);
            const insertion = ' — sabe como é';
            sentences[targetIndex] += insertion;
        }

        return sentences.join('. ');
    }

    /**
     * Torna uma frase propositalmente incompleta (naturalidade)
     */
    private makeIncomplete(content: string): string {
        const endings = ['E é isso.', 'Simples assim.', 'Pronto.', 'Basicamente.'];
        const ending = endings[Math.floor(Math.random() * endings.length)];

        return content + '\n\n' + ending;
    }

    /**
     * Varia estrutura de frases (mix de curtas e longas)
     */
    private varyStructure(content: string): string {
        const paragraphs = content.split('\n\n');

        // Adicionar uma frase muito curta se tudo estiver muito uniforme
        if (paragraphs.length > 1) {
            const shortSentences = ['Tipo assim.', 'Saca?', 'E aí.', 'Pois é.'];
            const randomShort = shortSentences[Math.floor(Math.random() * shortSentences.length)];

            // Inserir em posição aleatória
            const insertPos = Math.floor(Math.random() * paragraphs.length);
            paragraphs.splice(insertPos, 0, randomShort);
        }

        return paragraphs.join('\n\n');
    }

    /**
     * Score de naturalidade (0-100)
     */
    public calculateNaturalnessScore(content: string): number {
        let score = 100;

        // Penalidades
        BANNED_PHRASES.forEach(phrase => {
            if (content.toLowerCase().includes(phrase)) {
                score -= 10;
            }
        });

        // Bônus por características naturais
        if (/\.{3}/.test(content)) score += 5; // Tem reticências
        if (/—/.test(content)) score += 5; // Tem travessão
        if (BR_INTERJECTIONS.some(i => content.includes(i))) score += 10; // Tem interjection BR

        return Math.max(0, Math.min(100, score));
    }
}

export default ContentHumanizer;
