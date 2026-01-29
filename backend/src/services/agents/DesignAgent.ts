/**
 * Design Agent - Senior Web Designer
 * Cria imagens profissionais usando IA
 * Integrado com DALL-E, Midjourney, Stable Diffusion
 */

import { prisma } from "../../database/prismaClient";
import { replicateService } from "../video/ReplicateService";
import { grokService } from "../video/GrokService";

export interface DesignBrief {
    id: string;
    platform: string;
    theme: string;
    style: string;
    colors: string[];
    dimensions: string;
    contentType: "post" | "story" | "banner" | "thumbnail" | "video_viral" | "video_avatar";
    trend?: string;
    targetAudience?: string;
    brandGuidelines?: any;
}

export interface GeneratedDesign {
    id: string;
    briefId: string;
    imageUrl: string;
    prompt: string;
    aiProvider: string;
    quality: number;
    engagementScore?: number;
    variations: string[];
    createdAt: Date;
}

export class DesignAgent {
    private agentId = "design_expert";
    // Providers now map to internal services
    private aiProviders = [
        "sdxl_lightning", // via Replicate
        "grok_imagine",   // via xAI
        "sadtalker"       // via Replicate
    ];

    async receiveBrief(brief: DesignBrief): Promise<GeneratedDesign[]> {
        try {
            console.log(`[DesignAgent] Recebido brief para ${brief.contentType} em ${brief.platform}`);

            const analysis = await this.analyzeBrief(brief);
            const prompts = await this.generatePrompts(brief, analysis);
            const designs = await this.generateDesigns(brief, prompts);

            for (const design of designs) {
                design.quality = await this.evaluateQuality(design, brief);
            }

            await this.saveDesigns(brief.id, designs);

            return designs.sort((a, b) => b.quality - a.quality).slice(0, 3);
        } catch (error) {
            console.error("[DesignAgent] Erro ao processar brief:", error);
            return [];
        }
    }

    private async analyzeBrief(brief: DesignBrief): Promise<any> {
        return {
            platform: brief.platform,
            contentType: brief.contentType,
            styleGuide: this.getStyleGuide(brief.style),
            colorPalette: brief.colors,
            dimensions: brief.dimensions,
            mood: this.determineMood(brief.theme),
            complexity: this.calculateComplexity(brief),
            trendInfluence: brief.trend ? 0.7 : 0.3,
        };
    }

    private async generatePrompts(brief: DesignBrief, analysis: any): Promise<string[]> {
        const basePrompt = this.buildBasePrompt(brief, analysis);
        const variations = this.createPromptVariations(basePrompt, brief);
        return [basePrompt, ...variations.slice(0, 2)];
    }

    private buildBasePrompt(brief: DesignBrief, analysis: any): string {
        const styleDescriptor = this.getStyleDescriptor(brief.style);
        const colorDescriptor = brief.colors.join(", ");
        const moodDescriptor = analysis.mood;

        let prompt = `Professional ${brief.contentType} design for ${brief.platform}`;
        prompt += ` in ${styleDescriptor} style`;
        prompt += ` with colors: ${colorDescriptor}`;
        prompt += ` mood: ${moodDescriptor}`;
        prompt += ` dimensions: ${brief.dimensions}`;

        if (brief.trend) {
            prompt += ` inspired by trend: ${brief.trend}`;
        }

        if (brief.targetAudience) {
            prompt += ` target audience: ${brief.targetAudience}`;
        }

        prompt += `, high quality, professional, modern, engaging, trending`;

        return prompt;
    }

    private createPromptVariations(basePrompt: string, brief: DesignBrief): string[] {
        const variations = [
            basePrompt.replace("professional", "minimalist professional"),
            basePrompt.replace("modern", "vibrant modern"),
            basePrompt.replace("professional", "artistic professional"),
        ];
        return variations;
    }

    private async generateDesigns(brief: DesignBrief, prompts: string[]): Promise<GeneratedDesign[]> {
        const designs: GeneratedDesign[] = [];

        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];

            try {
                let imageUrl = "";
                // VIDEO HANDLING
                if (brief.contentType === "video_viral") {
                    // Grok for Viral Video
                    imageUrl = await grokService.generateViralVideo(prompt);
                }
                else if (brief.contentType === "video_avatar") {
                    // Replicate for Avatar (requires audio, placeholder for now or integrated flow)
                    // For this Agent, we might just return a frame or trigger the full flow
                    imageUrl = "https://placeholder-avatar-flow-pending"; // To be connected to CopyAgent audio
                }
                else {
                    // IMAGE HANDLING (SDXL)
                    // Convert dimensions string (1080x1080) to aspect ratio (1:1)
                    const ar = brief.dimensions === "1080x1920" ? "9:16" : "1:1";
                    imageUrl = await replicateService.generateImage(prompt, ar);
                }

                const design: GeneratedDesign = {
                    id: `design_${Date.now()}_${i}`,
                    briefId: brief.id,
                    imageUrl,
                    prompt,
                    aiProvider: brief.contentType.includes("video") ? "grok" : "replicate_sdxl",
                    quality: 0,
                    variations: [],
                    createdAt: new Date(),
                };

                designs.push(design);
            } catch (error) {
                console.error(`[DesignAgent] Erro ao gerar design:`, error);
            }
        }

        return designs;
    }

    // Old mock method removed.
    // private async callAIProvider...

    // selectProvider removed


    private async evaluateQuality(design: GeneratedDesign, brief: DesignBrief): Promise<number> {
        let score = 50;
        score += 15;
        score += 20;
        if (brief.trend) {
            score += 15;
        }
        const engagementScore = this.estimateEngagementPotential(brief);
        score += engagementScore;

        return Math.min(100, score);
    }

    private estimateEngagementPotential(brief: DesignBrief): number {
        let score = 0;
        if (brief.platform === "tiktok") score += 10;
        if (brief.platform === "instagram") score += 8;
        if (brief.platform === "linkedin") score += 5;
        if (brief.contentType === "post") score += 5;
        if (brief.contentType === "story") score += 3;
        if (brief.trend) score += 5;

        return Math.min(20, score);
    }

    private async saveDesigns(briefId: string, designs: GeneratedDesign[]): Promise<void> {
        try {
            for (const design of designs) {
                await prisma.generatedDesign.create({
                    data: {
                        briefId,
                        imageUrl: design.imageUrl,
                        prompt: design.prompt,
                        aiProvider: design.aiProvider,
                        quality: design.quality,
                        engagementScore: design.engagementScore || 0,
                    },
                });
            }
        } catch (error) {
            console.error("[DesignAgent] Erro ao salvar designs:", error);
        }
    }

    private getStyleGuide(style: string): any {
        const guides: Record<string, any> = {
            modern: {
                characteristics: ["clean", "minimalist", "geometric"],
                fonts: ["sans-serif"],
                spacing: "generous",
            },
            vintage: {
                characteristics: ["retro", "warm", "nostalgic"],
                fonts: ["serif"],
                spacing: "tight",
            },
            artistic: {
                characteristics: ["creative", "expressive", "unique"],
                fonts: ["display"],
                spacing: "varied",
            },
            corporate: {
                characteristics: ["professional", "formal", "trustworthy"],
                fonts: ["sans-serif"],
                spacing: "structured",
            },
        };

        return guides[style] || guides.modern;
    }

    private getStyleDescriptor(style: string): string {
        const descriptors: Record<string, string> = {
            modern: "contemporary minimalist",
            vintage: "retro nostalgic",
            artistic: "creative expressive",
            corporate: "professional formal",
        };

        return descriptors[style] || "modern";
    }

    private determineMood(theme: string): string {
        const moodMap: Record<string, string> = {
            luxury: "sophisticated, elegant, premium",
            casual: "friendly, approachable, relaxed",
            energetic: "vibrant, dynamic, exciting",
            calm: "peaceful, serene, balanced",
            professional: "trustworthy, competent, formal",
        };

        return moodMap[theme] || "professional engaging";
    }

    private calculateComplexity(brief: DesignBrief): number {
        let complexity = 5;
        if (brief.colors.length > 3) complexity += 2;
        if (brief.contentType === "banner") complexity += 3;
        if (brief.trend) complexity += 2;

        return Math.min(10, complexity);
    }

    async getGeneratedDesigns(briefId: string): Promise<GeneratedDesign[]> {
        try {
            const designs = await prisma.generatedDesign.findMany({
                where: { briefId },
                orderBy: { quality: "desc" },
            });

            return designs as any;
        } catch (error) {
            console.error("[DesignAgent] Erro ao obter designs:", error);
            return [];
        }
    }

    async regenerateDesign(designId: string): Promise<GeneratedDesign | null> {
        try {
            const design = await prisma.generatedDesign.findUnique({
                where: { id: designId },
            });

            if (!design) return null;

            let newImageUrl = "";

            if (design.aiProvider === "grok") {
                newImageUrl = await grokService.generateViralVideo(design.prompt);
            } else {
                newImageUrl = await replicateService.generateImage(design.prompt);
            }

            const updated = await prisma.generatedDesign.update({
                where: { id: designId },
                data: { imageUrl: newImageUrl },
            });

            return updated as any;
        } catch (error) {
            console.error("[DesignAgent] Erro ao regenerar design:", error);
            return null;
        }
    }

    async getDesignStats(): Promise<any> {
        try {
            const totalDesigns = await prisma.generatedDesign.count();
            const avgQuality = await prisma.generatedDesign.aggregate({
                _avg: { quality: true },
            });
            const topProvider = await prisma.generatedDesign.groupBy({
                by: ["aiProvider"],
                _count: true,
                orderBy: { _count: { aiProvider: "desc" } },
                take: 1,
            });

            return {
                totalDesigns,
                averageQuality: avgQuality._avg.quality || 0,
                topProvider: topProvider[0]?.aiProvider || "N/A",
                providersUsed: this.aiProviders.length,
            };
        } catch (error) {
            console.error("[DesignAgent] Erro ao obter estatísticas:", error);
            return null;
        }
    }
}

export const designAgent = new DesignAgent();
