/**
 * Brand Agent
 * Responsável pelo fortalecimento da marca e posicionamento no mercado
 * Garante consistência em todas as plataformas
 */

import { prisma } from "../../database/prismaClient";

export interface BrandProfile {
    id: string;
    userId: string;
    brandName: string;
    tagline: string;
    mission: string;
    vision: string;
    values: string[];
    targetAudience: string;
    positioning: string;
    uniqueValue: string;
    competitors: string[];
}

export interface BrandGuidelines {
    id: string;
    brandId: string;
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
        neutral: string[];
    };
    typography: {
        primary: string;
        secondary: string;
        sizes: Record<string, number>;
    };
    tone: string; // "professional", "casual", "humorous", "inspirational"
    voiceCharacteristics: string[];
    visualStyle: string; // "modern", "vintage", "artistic", "corporate"
    imagery: string[];
    messaging: {
        headline: string;
        subheadline: string;
        keyMessages: string[];
    };
}

export interface BrandConsistencyReport {
    id: string;
    brandId: string;
    platform: string;
    consistencyScore: number; // 0-100
    issues: string[];
    recommendations: string[];
    analyzedAt: Date;
}

export class BrandAgent {
    private agentId = "brand_expert";

    /**
     * Criar perfil de marca
     */
    async createBrandProfile(profile: BrandProfile): Promise<BrandProfile> {
        try {
            console.log("[BrandAgent] Criando perfil de marca:", profile.brandName);

            const created = await prisma.brandProfile.create({
                data: {
                    userId: profile.userId,
                    brandName: profile.brandName,
                    tagline: profile.tagline,
                    mission: profile.mission,
                    vision: profile.vision,
                    values: JSON.stringify(profile.values),
                    targetAudience: profile.targetAudience,
                    positioning: profile.positioning,
                    uniqueValue: profile.uniqueValue,
                    competitors: JSON.stringify(profile.competitors),
                },
            });

            // Criar guidelines padrão
            await this.createDefaultGuidelines(created.id);

            console.log("[BrandAgent] Perfil de marca criado com sucesso");
            return {
                ...created,
                values: JSON.parse(created.values as string),
                competitors: JSON.parse(created.competitors as string),
            } as any;
        } catch (error) {
            console.error("[BrandAgent] Erro ao criar perfil:", error);
            throw error;
        }
    }

    /**
     * Criar guidelines padrão
     */
    private async createDefaultGuidelines(brandId: string): Promise<void> {
        try {
            const guidelines: BrandGuidelines = {
                id: `guidelines_${brandId}`,
                brandId,
                colorPalette: {
                    primary: "#1F2937",
                    secondary: "#3B82F6",
                    accent: "#F59E0B",
                    neutral: ["#F3F4F6", "#E5E7EB", "#D1D5DB"],
                },
                typography: {
                    primary: "Inter",
                    secondary: "Poppins",
                    sizes: {
                        h1: 48,
                        h2: 36,
                        h3: 28,
                        body: 16,
                        small: 14,
                    },
                },
                tone: "professional",
                voiceCharacteristics: ["authentic", "helpful", "innovative"],
                visualStyle: "modern",
                imagery: ["lifestyle", "product", "people"],
                messaging: {
                    headline: "Transformando negócios com tecnologia",
                    subheadline: "Soluções inteligentes para crescimento",
                    keyMessages: [
                        "Inovação",
                        "Confiabilidade",
                        "Crescimento",
                    ],
                },
            };

            await prisma.brandGuidelines.create({
                data: {
                    ...guidelines,
                    colorPalette: JSON.stringify(guidelines.colorPalette),
                    typography: JSON.stringify(guidelines.typography),
                    voiceCharacteristics: JSON.stringify(guidelines.voiceCharacteristics),
                    imagery: JSON.stringify(guidelines.imagery),
                    messaging: JSON.stringify(guidelines.messaging),
                    // id and brandId are kept, tone and visualStyle are strings
                } as any,
            });
        } catch (error) {
            console.error("[BrandAgent] Erro ao criar guidelines:", error);
        }
    }

    /**
     * Atualizar guidelines
     */
    async updateGuidelines(
        brandId: string,
        guidelines: Partial<BrandGuidelines>
    ): Promise<BrandGuidelines> {
        try {
            console.log("[BrandAgent] Atualizando guidelines da marca");

            const data: any = { ...guidelines };
            if (guidelines.colorPalette) data.colorPalette = JSON.stringify(guidelines.colorPalette);
            if (guidelines.typography) data.typography = JSON.stringify(guidelines.typography);
            if (guidelines.voiceCharacteristics) data.voiceCharacteristics = JSON.stringify(guidelines.voiceCharacteristics);
            if (guidelines.imagery) data.imagery = JSON.stringify(guidelines.imagery);
            if (guidelines.messaging) data.messaging = JSON.stringify(guidelines.messaging);

            const updated = await prisma.brandGuidelines.update({
                where: { brandId },
                data,
            });

            // Notificar outros agentes sobre mudanças
            await this.notifyAgentsOfChange(brandId, "guidelines_updated");

            return {
                ...updated,
                colorPalette: JSON.parse(updated.colorPalette as string),
                typography: JSON.parse(updated.typography as string),
                voiceCharacteristics: JSON.parse(updated.voiceCharacteristics as string),
                imagery: JSON.parse(updated.imagery as string),
                messaging: JSON.parse(updated.messaging as string),
            } as any;
        } catch (error) {
            console.error("[BrandAgent] Erro ao atualizar guidelines:", error);
            throw error;
        }
    }

    /**
     * Analisar consistência da marca
     */
    async analyzeBrandConsistency(
        brandId: string,
        platform: string
    ): Promise<BrandConsistencyReport> {
        try {
            console.log(
                `[BrandAgent] Analisando consistência em ${platform}`
            );

            // Obter guidelines
            const guidelinesRaw = await prisma.brandGuidelines.findUnique({
                where: { brandId },
            });

            if (!guidelinesRaw) {
                throw new Error("Guidelines não encontradas");
            }

            const guidelines = {
                ...guidelinesRaw,
                colorPalette: JSON.parse(guidelinesRaw.colorPalette as string),
                typography: JSON.parse(guidelinesRaw.typography as string),
                voiceCharacteristics: JSON.parse(guidelinesRaw.voiceCharacteristics as string),
                imagery: JSON.parse(guidelinesRaw.imagery as string),
                messaging: JSON.parse(guidelinesRaw.messaging as string),
            };

            // Obter conteúdo recente da plataforma
            const recentContent = await this.getRecentContent(brandId, platform);

            // Analisar consistência
            const analysis = await this.performConsistencyAnalysis(
                recentContent,
                guidelines
            );

            // Salvar relatório
            const report = await prisma.brandConsistencyReport.create({
                data: {
                    brandId,
                    platform,
                    consistencyScore: analysis.score,
                    issues: JSON.stringify(analysis.issues),
                    recommendations: JSON.stringify(analysis.recommendations),
                },
            });

            return {
                ...report,
                issues: JSON.parse(report.issues as string),
                recommendations: JSON.parse(report.recommendations as string),
            } as any;
        } catch (error) {
            console.error("[BrandAgent] Erro ao analisar consistência:", error);
            throw error;
        }
    }

    /**
     * Obter conteúdo recente
     */
    private async getRecentContent(
        brandId: string,
        platform: string
    ): Promise<any[]> {
        try {
            // Simular obtenção de conteúdo
            return [
                {
                    id: "post_1",
                    text: "Novo produto lançado!",
                    colors: ["#1F2937", "#3B82F6"],
                    tone: "professional",
                    engagement: 250,
                },
                {
                    id: "post_2",
                    text: "Confira nossas novidades",
                    colors: ["#3B82F6", "#F59E0B"],
                    tone: "casual",
                    engagement: 180,
                },
            ];
        } catch (error) {
            console.error("[BrandAgent] Erro ao obter conteúdo:", error);
            return [];
        }
    }

    /**
     * Realizar análise de consistência
     */
    private async performConsistencyAnalysis(
        content: any[],
        guidelines: any
    ): Promise<any> {
        let score = 100;
        const issues: string[] = [];
        const recommendations: string[] = [];

        // Verificar cores
        const colorIssues = this.checkColorConsistency(content, guidelines);
        if (colorIssues.length > 0) {
            score -= 15;
            issues.push(...colorIssues);
            recommendations.push(
                "Revisar paleta de cores em posts recentes"
            );
        }

        // Verificar tom
        const toneIssues = this.checkToneConsistency(content, guidelines);
        if (toneIssues.length > 0) {
            score -= 10;
            issues.push(...toneIssues);
            recommendations.push("Manter tom consistente em todas as mensagens");
        }

        // Verificar engajamento
        const avgEngagement = content.reduce((sum, c) => sum + c.engagement, 0) / content.length;
        if (avgEngagement < 100) {
            score -= 5;
            issues.push("Engajamento abaixo da média");
            recommendations.push("Aumentar qualidade do conteúdo");
        }

        return {
            score: Math.max(0, score),
            issues,
            recommendations,
        };
    }

    /**
     * Verificar consistência de cores
     */
    private checkColorConsistency(content: any[], guidelines: any): string[] {
        const issues: string[] = [];
        const primaryColor = guidelines.colorPalette.primary;

        for (const item of content) {
            if (!item.colors.includes(primaryColor)) {
                issues.push(
                    `Post "${item.id}" não usa cor primária da marca`
                );
            }
        }

        return issues;
    }

    /**
     * Verificar consistência de tom
     */
    private checkToneConsistency(content: any[], guidelines: any): string[] {
        const issues: string[] = [];
        const expectedTone = guidelines.tone;

        for (const item of content) {
            if (item.tone !== expectedTone) {
                issues.push(
                    `Post "${item.id}" usa tom "${item.tone}" em vez de "${expectedTone}"`
                );
            }
        }

        return issues;
    }

    /**
     * Gerar recomendações de posicionamento
     */
    async generatePositioningRecommendations(
        brandId: string
    ): Promise<string[]> {
        try {
            console.log("[BrandAgent] Gerando recomendações de posicionamento");

            const profile = await prisma.brandProfile.findUnique({
                where: { id: brandId },
            });

            if (!profile) {
                throw new Error("Perfil de marca não encontrado");
            }

            const parsedProfile = {
                ...profile,
                values: JSON.parse(profile.values as string),
                competitors: JSON.parse(profile.competitors as string)
            };

            const recommendations: string[] = [];

            // Análise de competitors
            const competitorAnalysis = await this.analyzeCompetitors(
                parsedProfile.competitors
            );

            // Identificar gaps
            const gaps = this.identifyMarketGaps(
                parsedProfile,
                competitorAnalysis
            );

            for (const gap of gaps) {
                recommendations.push(
                    `Oportunidade: Posicionar-se como especialista em ${gap}`
                );
            }

            // Recomendações de diferenciação
            recommendations.push(
                `Enfatizar valor único: ${parsedProfile.uniqueValue}`
            );
            recommendations.push(
                `Fortalecer presença em plataformas onde audiência está mais ativa`
            );
            recommendations.push(
                `Criar conteúdo que reforce os valores: ${parsedProfile.values.join(", ")}`
            );

            return recommendations;
        } catch (error) {
            console.error(
                "[BrandAgent] Erro ao gerar recomendações:",
                error
            );
            return [];
        }
    }

    /**
     * Analisar competitors
     */
    private async analyzeCompetitors(competitors: string[]): Promise<any[]> {
        // Simular análise de competitors
        return competitors.map((c) => ({
            name: c,
            strength: "Forte presença em redes sociais",
            weakness: "Conteúdo genérico",
            opportunity: "Diferenciação com conteúdo único",
        }));
    }

    /**
     * Identificar gaps de mercado
     */
    private identifyMarketGaps(profile: any, competitorAnalysis: any[]): string[] {
        const gaps: string[] = [];

        // Simular identificação de gaps
        if (!profile.positioning.includes("educação")) {
            gaps.push("Educação do mercado");
        }

        if (!profile.positioning.includes("comunidade")) {
            gaps.push("Construção de comunidade");
        }

        if (!profile.positioning.includes("inovação")) {
            gaps.push("Liderança em inovação");
        }

        return gaps.slice(0, 3);
    }

    /**
     * Criar estratégia de brand awareness
     */
    async createBrandAwarenessStrategy(
        brandId: string
    ): Promise<any> {
        try {
            console.log("[BrandAgent] Criando estratégia de brand awareness");

            const profile = await prisma.brandProfile.findUnique({
                where: { id: brandId },
            });

            if (!profile) {
                throw new Error("Perfil de marca não encontrado");
            }

            const strategy = {
                phase1: {
                    name: "Awareness",
                    duration: "30 dias",
                    tactics: [
                        "Conteúdo educativo sobre a indústria",
                        "Participação em conversas relevantes",
                        "Parcerias com influenciadores",
                        "Campanhas de hashtag",
                    ],
                    goal: "Atingir 10.000 pessoas novas",
                },
                phase2: {
                    name: "Consideration",
                    duration: "30 dias",
                    tactics: [
                        "Case studies",
                        "Webinars",
                        "Comparações com competitors",
                        "Testimonials",
                    ],
                    goal: "Converter 5% em leads",
                },
                phase3: {
                    name: "Decision",
                    duration: "30 dias",
                    tactics: [
                        "Ofertas exclusivas",
                        "Prova social",
                        "Urgência",
                        "Suporte personalizado",
                    ],
                    goal: "Converter 20% dos leads",
                },
            };

            // Salvar estratégia
            await prisma.brandStrategy.create({
                data: {
                    brandId,
                    name: "Brand Awareness Strategy",
                    strategy: JSON.stringify(strategy),
                },
            });

            return strategy;
        } catch (error) {
            console.error(
                "[BrandAgent] Erro ao criar estratégia:",
                error
            );
            throw error;
        }
    }

    /**
     * Notificar outros agentes sobre mudanças
     */
    private async notifyAgentsOfChange(
        brandId: string,
        changeType: string
    ): Promise<void> {
        try {
            console.log(
                `[BrandAgent] Notificando agentes sobre: ${changeType}`
            );

            // Aqui você notificaria os outros agentes
            // Por exemplo, Design Agent e Copy Agent precisam saber sobre mudanças
            // para ajustar seu trabalho
        } catch (error) {
            console.error("[BrandAgent] Erro ao notificar agentes:", error);
        }
    }

    /**
     * Obter relatório de brand health
     */
    async getBrandHealthReport(brandId: string): Promise<any> {
        try {
            const profile = await prisma.brandProfile.findUnique({
                where: { id: brandId },
            });

            const guidelinesRaw = await prisma.brandGuidelines.findUnique({
                where: { brandId },
            });

            const consistencyReports = await prisma.brandConsistencyReport.findMany({
                where: { brandId },
                orderBy: { analyzedAt: "desc" },
                take: 5,
            });

            const avgConsistency =
                consistencyReports.length > 0
                    ? consistencyReports.reduce((sum, r) => sum + r.consistencyScore, 0) /
                    consistencyReports.length
                    : 0;

            return {
                brandName: profile?.brandName,
                positioning: profile?.positioning,
                consistencyScore: Math.round(avgConsistency),
                guidelines: guidelinesRaw ? {
                    ...guidelinesRaw,
                    // parse JSON fields if needed
                    colorPalette: JSON.parse(guidelinesRaw.colorPalette as string),
                } : null,
                recentReports: consistencyReports,
                health: avgConsistency > 80 ? "Excelente" : avgConsistency > 60 ? "Bom" : "Precisa melhorar",
            };
        } catch (error) {
            console.error("[BrandAgent] Erro ao obter relatório:", error);
            return null;
        }
    }
}

export const brandAgent = new BrandAgent();
