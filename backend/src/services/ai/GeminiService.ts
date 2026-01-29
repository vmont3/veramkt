
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

export class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private visionModel: any = null;

    constructor() {
        this.initialize();
    }

    private initialize() {
        if (process.env.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            // Gemini 2.5 Flash (Verified Available)
            this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            // Vision Model
            this.visionModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            console.log("✅ [GeminiService] Vertex AI/Gemini Conectado.");
        } else {
            console.warn("⚠️ [GeminiService] GEMINI_API_KEY não encontrada. Módulo de Visão desativado.");
        }
    }

    /**
     * Analisa uma imagem (URL) e descreve o que vê.
     * Útil para: Espionagem de Anúncios, Análise de Design, Leitura de Prints.
     */
    async analyzeImage(imageUrl: string, prompt: string = "Descreva esta imagem em detalhes."): Promise<string> {
        if (!this.visionModel) return "Módulo de Visão não configurado (Falta GEMINI_API_KEY).";

        try {
            // 1. Download image as buffer
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data);

            // 2. Prepare parts
            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: response.headers['content-type'] || 'image/jpeg',
                },
            };

            // 3. Generate content
            const result = await this.visionModel.generateContent([prompt, imagePart]);
            const responseText = result.response.text();

            return responseText;
        } catch (error) {
            console.error("❌ [GeminiService] Erro ao analisar imagem:", error);
            return "Falha na análise visual. Verifique a URL ou a Chave de API.";
        }
    }

    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Gera conteúdo criativo com contexto longo (ex: analisar PDF de marca).
     * Com Retry (Tentativa e Erro) para evitar Rate Limits (429)
     * Agora suporta Multimodalidade (Áudio/Imagens)
     */
    private models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];

    /**
     * Gera conteúdo criativo com contexto longo (ex: analisar PDF de marca).
     * Com Retry e Fallback de Modelos para evitar Erros 404/429
     */
    async generateContent(prompt: string, audioBuffer?: Buffer, mimeType: string = "audio/mp3"): Promise<string> {
        if (!this.genAI) return "Erro: Gemini não configurado (Falta API Key).";

        for (const modelName of this.models) {
            try {
                // console.log(`[GeminiService] Tentando modelo: ${modelName}`);
                const model = this.genAI.getGenerativeModel({ model: modelName });

                let request: any = prompt;

                // Se houver áudio, monta o payload multimodal
                if (audioBuffer) {
                    request = [
                        prompt,
                        {
                            inlineData: {
                                data: audioBuffer.toString('base64'),
                                mimeType: mimeType
                            }
                        }
                    ];
                }

                const result = await model.generateContent(request);
                return result.response.text();

            } catch (error: any) {
                const isRateLimit = error.message?.includes("429") || error.status === 429;
                const isNotFound = error.message?.includes("404") || error.status === 404;
                const isForbidden = error.message?.includes("403") || error.status === 403;

                console.error(`❌ [GeminiService] Falha no modelo ${modelName}:`, error.message);

                if (isForbidden) {
                    console.error("🚨 [GeminiService] ERRO CRÍTICO: API KEY Inválida ou sem permissão (403). Verifique o .env");
                    return "Erro Crítico: Chave de API Inválida.";
                }

                if (isNotFound) {
                    console.warn(`⚠️ [GeminiService] Modelo ${modelName} não encontrado. Tentando próximo...`);
                    continue;
                }

                if (isRateLimit) {
                    console.warn(`⏳ [GeminiService] Rate Limit (429) em ${modelName}. Tentando próximo...`);
                    continue;
                }
            }
        }

        return "⚠️ Todos os modelos de IA falharam ou estão ocupados. Tente novamente em instantes.";
    }

    /**
     * Analisa um anúncio da concorrência e extrai estratégia.
     */
    async spyOnAd(imageUrl: string): Promise<any> {
        const prompt = `
            Aja como um Estrategista de Marketing Sênior. Analise este anúncio (imagem) e extraia:
            1. A "Big Idea" ou gancho principal.
            2. O público-alvo provável.
            3. As cores predominantes (hex codes aproximados).
            4. A emoção que tenta evocar (urgência, medo, alegria, status).
            5. Uma sugestão de como podemos fazer um anúncio SUPERIOR a este.
            
            Responda em JSON válido no formato:
            {
                "bigIdea": "...",
                "target": "...",
                "colors": ["..."],
                "emotion": "...",
                "counterStrategy": "..."
            }
        `;

        const rawText = await this.analyzeImage(imageUrl, prompt);

        // Limpeza básica de JSON markdown
        const jsonBlock = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
            return JSON.parse(jsonBlock);
        } catch (e) {
            return { rawAnalysis: rawText };
        }
    }
}

export const geminiService = new GeminiService();
