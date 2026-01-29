/**
 * ANTI-CLICHÊ RULES
 * Biblioteca de regras para eliminar vícios de linguagem de IA
 */

export const BANNED_PHRASES = [
    // Padrões corporativos genéricos
    'no cenário atual',
    'é importante ressaltar',
    'vale destacar',
    'nesse contexto',
    'por outro lado',
    'além disso',
    'dessa forma',
    'sendo assim',
    'diante disso',
    'tendo em vista',
    'cabe ressaltar',
    'é fundamental',
    'é crucial',
    'é imprescindível',
    'não podemos deixar de mencionar',

    // Frases vazias de conclusão
    'em suma',
    'em resumo',
    'concluindo',
    'portanto podemos afirmar',
    'fica evidente que',

    // Conectivos overused
    'ademais',
    'outrossim',
    'destarte',
    'porquanto',

    // Redundâncias
    'totalmente completo',
    'completamente cheio',
    'absolutamente certo',
    'perfeitamente ideal'
];

export const CLICHE_PATTERNS = [
    // Estruturas previsíveis
    /^(Descubra|Aprenda|Saiba) (como|por que|quando)/i,
    /você (não vai acreditar|precisa saber|vai adorar)/i,
    /\d+ (dicas|estratégias|passos|formas) para/i,
    /o segredo (para|de)/i,

    // Emojis em excesso (mais de 3 por parágrafo)
    /([\u{1F300}-\u{1F9FF}].*){4,}/u,

    // Listas sempre com 3 itens
    /^[•✓✔️]\s.+\n[•✓✔️]\s.+\n[•✓✔️]\s.+$/m
];

export interface AntiClicheConfig {
    // Estrutura
    minParagraphs: number;
    maxParagraphs: number;
    varyLength: boolean;
    avoidPatterns: boolean;

    // Tom
    allowSlang: boolean;
    allowIncomplete: boolean;
    allowEllipsis: boolean;
    regionalExpressions: string[];
    informalQuestions: boolean;

    // Especificidade
    avoidGeneric: boolean;
    useExamples: boolean;
    nameNames: boolean;
    useNumbers: boolean;

    // Imperfeições intencionais
    imperfections: {
        enabled: boolean;
        probability: number; // 0.0 a 1.0
        types: ('ellipsis' | 'interjection' | 'incomplete' | 'emDash')[];
    };
}

export const DEFAULT_ANTI_CLICHE_CONFIG: AntiClicheConfig = {
    minParagraphs: 2,
    maxParagraphs: 7,
    varyLength: true,
    avoidPatterns: true,

    allowSlang: true,
    allowIncomplete: true,
    allowEllipsis: true,
    regionalExpressions: ['BR'],
    informalQuestions: true,

    avoidGeneric: true,
    useExamples: true,
    nameNames: true,
    useNumbers: true,

    imperfections: {
        enabled: true,
        probability: 0.15,
        types: ['ellipsis', 'interjection', 'incomplete', 'emDash']
    }
};

/**
 * Substituições para humanizar conteúdo
 */
export const HUMANIZATION_REPLACEMENTS: Record<string, string[]> = {
    // Genérico → Específico
    'muitas empresas': ['47% das PMEs', '6 em cada 10 empresas', 'a maioria das startups'],
    'muito tempo': ['3 horas por dia', '15 horas semanais', 'metade do expediente'],
    'crescimento significativo': ['aumento de 247%', 'dobrou em 6 meses', 'triplicou o faturamento'],
    'recentemente': ['na semana passada', 'há 3 dias', 'ontem'],

    // Formal → Informal (quando apropriado)
    'realizar': ['fazer', 'executar'],
    'utilizar': ['usar'],
    'efetuar': ['fazer'],
    'necessita': ['precisa', 'precisa de'],
    'possui': ['tem']
};

/**
 * Interjections brasileiras para naturalidade
 */
export const BR_INTERJECTIONS = [
    'Nossa',
    'Caramba',
    'Olha só',
    'Pois é',
    'Sabe o que eu percebi?',
    'Tipo assim',
    'Tá ligado?',
    'E aí',
    'Ó',
    'Cara'
];

/**
 * Frases de transição naturais (alternativas aos clichês)
 */
export const NATURAL_TRANSITIONS = [
    'Agora',
    'Mas ó',
    'E sabe o pior?',
    'Aqui vai o lance',
    'A questão é',
    'O problema é que',
    'Olha isso',
    'Deixa eu te contar'
];

export default {
    BANNED_PHRASES,
    CLICHE_PATTERNS,
    DEFAULT_ANTI_CLICHE_CONFIG,
    HUMANIZATION_REPLACEMENTS,
    BR_INTERJECTIONS,
    NATURAL_TRANSITIONS
};
