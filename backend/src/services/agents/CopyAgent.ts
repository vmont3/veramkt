/**
 * Copy Agent
 * Cria textos atraentes, engajadores e persuasivos
 * Especializado em H2H (Human to Human) selling
 */

import { prisma } from "../../database/prismaClient";
import { geminiService } from "../ai/GeminiService";

export interface CopyBrief {
    id: string;
    platform: string;
    contentType: string;
    tone: string;
    targetAudience: string;
    objective: string;
    keywords: string[];
    trend?: string;
    brandVoice?: string;
    callToAction?: string;
}

export interface GeneratedCopy {
    id: string;
    briefId: string;
    text: string;
    characterCount: number;
    wordCount: number;
    estimatedEngagement: number;
    sentiment: string;
    callToActionStrength: number;
    personalityScore: number;
    variations: string[];
    createdAt: Date;
}

export class CopyAgent {
    private agentId = "copy_expert";
    private psychologicalTriggers = [
        "urgency",
        "scarcity",
        "social_proof",
        "fomo",
        "reciprocity",
        "authority",
        "liking",
        "commitment",
    ];

    async receiveBrief(brief: CopyBrief, profile?: any): Promise<GeneratedCopy[]> {
        try {
            console.log(`[CopyAgent] Recebido brief para ${brief.contentType} em ${brief.platform}`);

            const analysis = await this.analyzeBrief(brief);
            const copies = await this.generateCopies(brief, analysis, profile);

            for (const copy of copies) {
                copy.estimatedEngagement = await this.evaluateEngagement(copy, brief);
                copy.callToActionStrength = this.evaluateCTA(copy);
                copy.personalityScore = this.evaluatePersonality(copy, brief);
            }

            await this.saveCopies(brief.id, copies);

            return copies.sort((a, b) => b.estimatedEngagement - a.estimatedEngagement).slice(0, 5);
        } catch (error) {
            console.error("[CopyAgent] Erro ao processar brief:", error);
            return [];
        }
    }

    private async analyzeBrief(brief: CopyBrief): Promise<any> {
        return {
            platform: brief.platform,
            contentType: brief.contentType,
            tone: brief.tone,
            objective: brief.objective,
            characterLimit: this.getCharacterLimit(brief.platform, brief.contentType),
            triggers: this.selectTriggers(brief.objective),
            keywords: brief.keywords,
            brandVoice: brief.brandVoice || "friendly",
        };
    }

    private async generateCopies(brief: CopyBrief, analysis: any, profile?: any): Promise<GeneratedCopy[]> {
        const copies: GeneratedCopy[] = [];

        // Generating real AI copies for different triggers
        const triggers = ["urgency", "social_proof", "benefit", "curiosity", "story"];

        for (const trigger of triggers) {
            try {
                const text = await this.generateCopyWithGemini(brief, analysis, trigger, profile);
                copies.push(this.formatCopy(text, brief, trigger));
            } catch (e) {
                console.error(`[CopyAgent] Falha ao gerar copy para ${trigger}:`, e);
            }
        }

        return copies;
    }

    private async generateCopyWithGemini(brief: CopyBrief, analysis: any, trigger: string, profile?: any): Promise<string> {
        // Use Profile System Prompt if available (Factory Pattern)
        const systemInstruction = profile?.systemPrompt
            ? `ROLE: ${profile.systemPrompt}`
            : "Act as a world-class copywriter.";

        const prompt = `
            ${systemInstruction}
            
            TASK: Write a ${brief.contentType} for ${brief.platform}.
            Goal: ${brief.objective}.
            Topic: ${brief.keywords.join(", ")}.
            Target Audience: ${brief.targetAudience}.
            Psychological Trigger: ${trigger}.
            Tone: ${brief.tone}.
            
            Requirements:
            - Use the trigger "${trigger}" heavily.
            - Keep it under ${analysis.characterLimit} chars if possible.
            - Include 1-2 relevant hashtags if instagram/twitter.
            - Include a CTA: "${brief.callToAction || 'Default CTA'}".
            - Language: Portuguese (Brazil).
            
            Output ONLY the ad copy text, no explanations.
        `;

        return await geminiService.generateContent(prompt) || "Erro na geração de texto.";
    }

    private formatCopy(text: string, brief: CopyBrief, trigger: string): GeneratedCopy {
        const sentiment = this.analyzeSentiment(text);
        return {
            id: `copy_${Date.now()}_${Math.random()}`,
            briefId: brief.id,
            text,
            characterCount: text.length,
            wordCount: text.split(" ").length,
            estimatedEngagement: 0, // Will be calculated next
            sentiment,
            callToActionStrength: 0,
            personalityScore: 0,
            variations: [],
            createdAt: new Date(),
        };
    }

    // Removed hardcoded templates (generateUrgencyCopy, etc.) as we now use Gemini.


    private generateCTA(objective: string): string {
        const ctas: Record<string, string[]> = {
            engagement: [
                "Comenta aqui o que você acha! 👇",
                "Qual é a sua opinião? 🤔",
                "Deixa seu like se concorda! ❤️",
            ],
            conversion: [
                "Clique aqui e comece agora → [link]",
                "Garanta seu acesso exclusivo → [link]",
                "Não perca! Acesse agora → [link]",
            ],
            awareness: [
                "Compartilha com quem precisa! 📢",
                "Salva para ver depois! 📌",
                "Manda para um amigo! 👥",
            ],
            retention: [
                "Volte em breve para mais! 🔔",
                "Ative as notificações! 🔔",
                "Siga para não perder nada! 👉",
            ],
        };

        const ctaList = ctas[objective] || ctas.engagement;
        return ctaList[Math.floor(Math.random() * ctaList.length)];
    }

    private generateHashtags(keywords: string[]): string {
        const hashtags = keywords
            .slice(0, 5)
            .map((k) => `#${k.replace(/\s+/g, "")}`)
            .join(" ");

        return hashtags;
    }

    private async evaluateEngagement(copy: GeneratedCopy, brief: CopyBrief): Promise<number> {
        let score = 50;

        if (copy.characterCount > 100 && copy.characterCount < 280) {
            score += 15;
        }

        // Check for emojis using string methods to avoid regex issues
        const hasEmoji = copy.text.includes('👇') || copy.text.includes('→') ||
            copy.text.includes('✨') || copy.text.includes('🚀') ||
            copy.text.includes('🎯') || copy.text.includes('❤️');
        if (hasEmoji) {
            score += 10;
        }

        if (
            copy.text.includes("→") ||
            copy.text.includes("👇") ||
            copy.text.includes("clique")
        ) {
            score += 10;
        }

        if (/\d+/.test(copy.text)) {
            score += 5;
        }

        if (copy.sentiment === "positive") {
            score += 10;
        }

        return Math.min(100, score);
    }

    private evaluateCTA(copy: GeneratedCopy): number {
        let score = 0;

        const strongCTAs = [
            "clique",
            "acesse",
            "garanta",
            "comenta",
            "compartilha",
            "salva",
            "ativa",
        ];

        for (const cta of strongCTAs) {
            if (copy.text.toLowerCase().includes(cta)) {
                score += 20;
            }
        }

        if (copy.text.includes("→") || copy.text.includes("👇")) {
            score += 20;
        }

        return Math.min(100, score);
    }

    private evaluatePersonality(copy: GeneratedCopy, brief: CopyBrief): number {
        let score = 50;

        if (brief.tone === "casual" && copy.text.includes("Olá")) {
            score += 15;
        }
        if (brief.tone === "professional" && !copy.text.includes("😂")) {
            score += 15;
        }

        for (const keyword of brief.keywords) {
            if (copy.text.toLowerCase().includes(keyword.toLowerCase())) {
                score += 5;
            }
        }

        return Math.min(100, score);
    }

    private analyzeSentiment(text: string): string {
        const positiveWords = [
            "ótimo",
            "incrível",
            "fantástico",
            "amor",
            "sucesso",
            "ganhar",
        ];
        const negativeWords = [
            "ruim",
            "horrível",
            "fracasso",
            "perder",
            "problema",
            "erro",
        ];

        let positiveCount = 0;
        let negativeCount = 0;

        for (const word of positiveWords) {
            if (text.toLowerCase().includes(word)) positiveCount++;
        }

        for (const word of negativeWords) {
            if (text.toLowerCase().includes(word)) negativeCount++;
        }

        if (positiveCount > negativeCount) return "positive";
        if (negativeCount > positiveCount) return "negative";
        return "neutral";
    }

    private getCharacterLimit(platform: string, contentType: string): number {
        const limits: Record<string, Record<string, number>> = {
            instagram: { caption: 2200, dm: 1000, story: 500 },
            tiktok: { caption: 2200, dm: 1000 },
            twitter: { post: 280, dm: 1000 },
            linkedin: { post: 3000, dm: 1000 },
            facebook: { post: 63206, dm: 1000 },
        };

        return limits[platform]?.[contentType] || 280;
    }

    private selectTriggers(objective: string): string[] {
        const triggerMap: Record<string, string[]> = {
            engagement: ["curiosity", "social_proof", "fomo"],
            conversion: ["urgency", "scarcity", "social_proof"],
            awareness: ["authority", "liking", "commitment"],
            retention: ["reciprocity", "commitment", "liking"],
        };

        return triggerMap[objective] || this.psychologicalTriggers.slice(0, 3);
    }

    private async saveCopies(briefId: string, copies: GeneratedCopy[]): Promise<void> {
        try {
            for (const copy of copies) {
                await prisma.generatedCopy.create({
                    data: {
                        briefId,
                        text: copy.text,
                        characterCount: copy.characterCount,
                        wordCount: copy.wordCount,
                        estimatedEngagement: copy.estimatedEngagement,
                        sentiment: copy.sentiment,
                        callToActionStrength: copy.callToActionStrength,
                        personalityScore: copy.personalityScore,
                    },
                });
            }
        } catch (error) {
            console.error("[CopyAgent] Erro ao salvar copies:", error);
        }
    }

    async getGeneratedCopies(briefId: string): Promise<GeneratedCopy[]> {
        try {
            const copies = await prisma.generatedCopy.findMany({
                where: { briefId },
                orderBy: { estimatedEngagement: "desc" },
            });

            return copies as any;
        } catch (error) {
            console.error("[CopyAgent] Erro ao obter copies:", error);
            return [];
        }
    }

    async getCopyStats(): Promise<any> {
        try {
            const totalCopies = await prisma.generatedCopy.count();
            const avgEngagement = await prisma.generatedCopy.aggregate({
                _avg: { estimatedEngagement: true },
            });
            const topSentiment = await prisma.generatedCopy.groupBy({
                by: ["sentiment"],
                _count: true,
                orderBy: { _count: { sentiment: "desc" } },
                take: 1,
            });

            return {
                totalCopies,
                averageEngagement: avgEngagement._avg.estimatedEngagement || 0,
                topSentiment: topSentiment[0]?.sentiment || "neutral",
            };
        } catch (error) {
            console.error("[CopyAgent] Erro ao obter estatísticas:", error);
            return null;
        }
    }
}

export const copyAgent = new CopyAgent();
