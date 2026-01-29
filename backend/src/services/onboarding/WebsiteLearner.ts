/**
 * Website Learner - Auto-Learn from Client Website
 *
 * Killer Feature #1: Klaviyo-style onboarding
 * - Crawl client website (3 clicks)
 * - Extract brand voice, products, tone
 * - Generate persona automatically
 * - 10x faster onboarding
 *
 * Tech Stack:
 * - Puppeteer (headless browser)
 * - Claude (brand voice analysis)
 * - OpenAI Embeddings (semantic search)
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { claudeService } from '../ai/ClaudeService';
import { prisma } from '../../database/prismaClient';

export interface WebsiteAnalysis {
    url: string;
    brandName: string;
    brandVoice: {
        tone: string;                    // 'professional', 'casual', 'playful', etc
        personality: string[];            // ['friendly', 'expert', 'trustworthy']
        writingStyle: string;             // 'concise', 'detailed', 'storytelling'
        vocabulary: string[];             // Common words/phrases
    };
    products: {
        name: string;
        description: string;
        category: string;
        price?: string;
    }[];
    targetAudience: {
        demographics: string;
        painPoints: string[];
        goals: string[];
    };
    competitors: string[];
    uniqueSellingPoints: string[];
    colorPalette: string[];
    contentExamples: {
        headlines: string[];
        descriptions: string[];
        ctas: string[];
    };
    metadata: {
        industry: string;
        location?: string;
        socialMedia: {
            instagram?: string;
            facebook?: string;
            linkedin?: string;
            twitter?: string;
        };
    };
}

export interface LearningProgress {
    step: string;
    progress: number;
    message: string;
}

export class WebsiteLearner {
    private browser: Browser | null = null;
    private progressCallback?: (progress: LearningProgress) => void;

    /**
     * Main entry point - Learn everything from website
     */
    async learnFromWebsite(
        url: string,
        userId: string,
        onProgress?: (progress: LearningProgress) => void
    ): Promise<WebsiteAnalysis> {
        this.progressCallback = onProgress;

        try {
            this.updateProgress('initializing', 0, 'Iniciando análise do website...');

            // 1. Initialize browser
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            this.updateProgress('crawling', 10, 'Navegando pelo website...');

            // 2. Crawl main pages
            const pages = await this.crawlWebsite(url);

            this.updateProgress('extracting', 30, 'Extraindo conteúdo...');

            // 3. Extract content
            const content = await this.extractContent(pages);

            this.updateProgress('analyzing', 50, 'Analisando brand voice...');

            // 4. Analyze brand voice with Claude
            const brandVoice = await this.analyzeBrandVoice(content);

            this.updateProgress('products', 60, 'Identificando produtos...');

            // 5. Extract products
            const products = await this.extractProducts(content);

            this.updateProgress('audience', 70, 'Analisando audiência...');

            // 6. Identify target audience
            const targetAudience = await this.identifyAudience(content, brandVoice);

            this.updateProgress('competitors', 80, 'Buscando concorrentes...');

            // 7. Find competitors (optional, can be slow)
            const competitors = await this.findCompetitors(url);

            this.updateProgress('finalizing', 90, 'Finalizando análise...');

            // 8. Extract USPs and metadata
            const usps = await this.extractUSPs(content);
            const colorPalette = await this.extractColors(pages);
            const contentExamples = this.extractContentExamples(content);
            const metadata = await this.extractMetadata(content, url);

            // 9. Build final analysis
            const analysis: WebsiteAnalysis = {
                url,
                brandName: metadata.brandName || new URL(url).hostname,
                brandVoice,
                products,
                targetAudience,
                competitors,
                uniqueSellingPoints: usps,
                colorPalette,
                contentExamples,
                metadata: {
                    industry: metadata.industry,
                    location: metadata.location,
                    socialMedia: metadata.socialMedia
                }
            };

            // 10. Save to database
            await this.saveAnalysis(userId, analysis);

            this.updateProgress('complete', 100, 'Análise concluída!');

            return analysis;

        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    /**
     * Crawl website main pages
     */
    private async crawlWebsite(baseUrl: string): Promise<Array<{ url: string; html: string }>> {
        const pages: Array<{ url: string; html: string }> = [];
        const visited = new Set<string>();
        const maxPages = 10; // Limit crawling

        const page = await this.browser!.newPage();

        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

        // Function to crawl a single page
        const crawlPage = async (url: string) => {
            if (visited.has(url) || visited.size >= maxPages) return;

            try {
                visited.add(url);

                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

                const html = await page.content();
                pages.push({ url, html });

                // Get internal links
                const links = await page.evaluate((baseUrl) => {
                    const anchors = Array.from(document.querySelectorAll('a'));
                    return anchors
                        .map(a => a.href)
                        .filter(href => href && href.startsWith(baseUrl))
                        .slice(0, 5); // Limit per page
                }, baseUrl);

                // Crawl important pages first
                const priorityPages = [
                    '/about',
                    '/produtos',
                    '/products',
                    '/servicos',
                    '/services',
                    '/contato',
                    '/contact'
                ];

                for (const link of links) {
                    if (visited.size >= maxPages) break;

                    const isPriority = priorityPages.some(p => link.includes(p));
                    if (isPriority) {
                        await crawlPage(link);
                    }
                }

            } catch (error) {
                console.error(`Error crawling ${url}:`, error);
            }
        };

        await crawlPage(baseUrl);

        await page.close();

        return pages;
    }

    /**
     * Extract text content from HTML
     */
    private async extractContent(pages: Array<{ url: string; html: string }>): Promise<string> {
        const textContents: string[] = [];

        for (const { html } of pages) {
            // Remove scripts, styles, and extract text
            const cleanText = html
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            textContents.push(cleanText);
        }

        // Combine and truncate (Claude has token limits)
        const combined = textContents.join('\n\n').substring(0, 15000);

        return combined;
    }

    /**
     * Analyze brand voice using Claude
     */
    private async analyzeBrandVoice(content: string): Promise<WebsiteAnalysis['brandVoice']> {
        const prompt = `Analyze this website content and identify the brand voice:

CONTENT:
${content}

Return JSON with:
{
    "tone": "professional|casual|playful|authoritative|friendly",
    "personality": ["adjective1", "adjective2", "adjective3"],
    "writingStyle": "concise|detailed|storytelling|technical",
    "vocabulary": ["common phrase 1", "common phrase 2", ...]
}

Focus on:
- How they address customers (formal vs informal)
- Common words and phrases
- Sentence structure (short vs long)
- Emotional tone

Return ONLY valid JSON, no explanations.`;

        try {
            const response = await claudeService.generate({
                prompt,
                systemPrompt: 'You are a brand voice analyst. Return only valid JSON.',
                maxTokens: 1000,
                temperature: 0.3
            });

            const analysis = JSON.parse(response.content);

            return {
                tone: analysis.tone || 'professional',
                personality: analysis.personality || ['friendly', 'trustworthy'],
                writingStyle: analysis.writingStyle || 'concise',
                vocabulary: analysis.vocabulary || []
            };

        } catch (error) {
            console.error('Error analyzing brand voice:', error);

            // Fallback
            return {
                tone: 'professional',
                personality: ['friendly', 'trustworthy'],
                writingStyle: 'concise',
                vocabulary: []
            };
        }
    }

    /**
     * Extract products from content
     */
    private async extractProducts(content: string): Promise<WebsiteAnalysis['products']> {
        const prompt = `Extract products/services from this website content:

CONTENT:
${content.substring(0, 10000)}

Return JSON array with up to 10 products:
[
    {
        "name": "Product Name",
        "description": "Brief description",
        "category": "Category",
        "price": "Price if found"
    }
]

Return ONLY valid JSON array, no explanations.`;

        try {
            const response = await claudeService.generate({
                prompt,
                systemPrompt: 'You are a product analyst. Return only valid JSON.',
                maxTokens: 1500,
                temperature: 0.3
            });

            const products = JSON.parse(response.content);

            return Array.isArray(products) ? products.slice(0, 10) : [];

        } catch (error) {
            console.error('Error extracting products:', error);
            return [];
        }
    }

    /**
     * Identify target audience
     */
    private async identifyAudience(
        content: string,
        brandVoice: WebsiteAnalysis['brandVoice']
    ): Promise<WebsiteAnalysis['targetAudience']> {
        const prompt = `Based on this website content and brand voice, identify the target audience:

CONTENT:
${content.substring(0, 8000)}

BRAND VOICE:
${JSON.stringify(brandVoice)}

Return JSON:
{
    "demographics": "Who is the target audience?",
    "painPoints": ["pain point 1", "pain point 2", "pain point 3"],
    "goals": ["goal 1", "goal 2", "goal 3"]
}

Return ONLY valid JSON, no explanations.`;

        try {
            const response = await claudeService.generate({
                prompt,
                systemPrompt: 'You are a market research analyst. Return only valid JSON.',
                maxTokens: 800,
                temperature: 0.3
            });

            return JSON.parse(response.content);

        } catch (error) {
            console.error('Error identifying audience:', error);
            return {
                demographics: 'General public',
                painPoints: [],
                goals: []
            };
        }
    }

    /**
     * Find competitors (basic Google search simulation)
     */
    private async findCompetitors(url: string): Promise<string[]> {
        // In production, use Google Custom Search API or similar
        // For now, return empty or use heuristics

        try {
            const domain = new URL(url).hostname;
            const industry = domain.split('.')[0]; // Very basic

            // Mock competitors for demo
            return [
                `competitor1-${industry}.com`,
                `competitor2-${industry}.com`
            ];

        } catch {
            return [];
        }
    }

    /**
     * Extract USPs (Unique Selling Points)
     */
    private async extractUSPs(content: string): Promise<string[]> {
        const prompt = `Extract the unique selling points (USPs) from this content:

CONTENT:
${content.substring(0, 8000)}

Return JSON array of 3-5 USPs:
["USP 1", "USP 2", "USP 3"]

Focus on what makes this brand unique/different.

Return ONLY valid JSON array, no explanations.`;

        try {
            const response = await claudeService.generate({
                prompt,
                systemPrompt: 'You are a marketing strategist. Return only valid JSON.',
                maxTokens: 500,
                temperature: 0.4
            });

            const usps = JSON.parse(response.content);
            return Array.isArray(usps) ? usps : [];

        } catch (error) {
            console.error('Error extracting USPs:', error);
            return [];
        }
    }

    /**
     * Extract color palette from pages
     */
    private async extractColors(pages: Array<{ url: string; html: string }>): Promise<string[]> {
        // Extract hex colors from CSS/HTML
        const colors = new Set<string>();

        for (const { html } of pages) {
            const hexMatches = html.match(/#[0-9A-Fa-f]{6}/g);
            if (hexMatches) {
                hexMatches.forEach(color => colors.add(color.toLowerCase()));
            }

            if (colors.size >= 5) break;
        }

        return Array.from(colors).slice(0, 5);
    }

    /**
     * Extract content examples
     */
    private extractContentExamples(content: string): WebsiteAnalysis['contentExamples'] {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);

        return {
            headlines: sentences.filter(s => s.length < 100).slice(0, 5),
            descriptions: sentences.filter(s => s.length > 100 && s.length < 300).slice(0, 5),
            ctas: [] // Would need more sophisticated extraction
        };
    }

    /**
     * Extract metadata
     */
    private async extractMetadata(content: string, url: string): Promise<any> {
        const prompt = `Extract metadata from this website:

CONTENT:
${content.substring(0, 5000)}

URL: ${url}

Return JSON:
{
    "brandName": "Official brand name",
    "industry": "Industry/sector",
    "location": "Location if found",
    "socialMedia": {
        "instagram": "handle or null",
        "facebook": "handle or null",
        "linkedin": "handle or null",
        "twitter": "handle or null"
    }
}

Return ONLY valid JSON, no explanations.`;

        try {
            const response = await claudeService.generate({
                prompt,
                systemPrompt: 'You are a metadata extractor. Return only valid JSON.',
                maxTokens: 500,
                temperature: 0.2
            });

            return JSON.parse(response.content);

        } catch (error) {
            console.error('Error extracting metadata:', error);
            return {
                brandName: new URL(url).hostname,
                industry: 'Unknown',
                socialMedia: {}
            };
        }
    }

    /**
     * Save analysis to database
     */
    private async saveAnalysis(userId: string, analysis: WebsiteAnalysis): Promise<void> {
        try {
            // Find or create brand for user
            let brand = await prisma.brand.findFirst({
                where: { userId }
            });

            if (!brand) {
                brand = await prisma.brand.create({
                    data: {
                        userId,
                        name: analysis.brandName,
                        website: analysis.url,
                        industry: analysis.metadata.industry
                    }
                });
            }

            // Save full analysis as JSON
            await prisma.brandAnalysis.create({
                data: {
                    brandId: brand.id,
                    analysis: JSON.stringify(analysis),
                    source: 'website_learner',
                    createdAt: new Date()
                }
            });

            console.log(`[WebsiteLearner] Analysis saved for brand ${brand.id}`);

        } catch (error) {
            console.error('[WebsiteLearner] Error saving analysis:', error);
        }
    }

    /**
     * Update progress callback
     */
    private updateProgress(step: string, progress: number, message: string): void {
        if (this.progressCallback) {
            this.progressCallback({ step, progress, message });
        }
    }

    /**
     * Quick scan (faster version for MVP)
     */
    async quickScan(url: string, userId: string): Promise<Partial<WebsiteAnalysis>> {
        try {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });

            const page = await this.browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

            const html = await page.content();
            const content = this.extractTextFromHTML(html);

            // Quick brand voice analysis only
            const brandVoice = await this.analyzeBrandVoice(content);

            await this.browser.close();

            return {
                url,
                brandName: new URL(url).hostname,
                brandVoice
            };

        } catch (error) {
            console.error('[WebsiteLearner] Quick scan error:', error);
            throw error;
        }
    }

    /**
     * Helper: Extract text from HTML
     */
    private extractTextFromHTML(html: string): string {
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 10000);
    }
}

// Singleton
export const websiteLearner = new WebsiteLearner();
