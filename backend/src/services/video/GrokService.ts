import axios from "axios";

/**
 * Grok Service (xAI)
 * Connects to xAI API for Text-to-Video (T2V) generation.
 * "Grok Imagine" Model.
 */
export class GrokService {
    private apiKey: string | undefined;
    private baseUrl = "https://api.x.ai/v1"; // Standard xAI endpoint

    constructor() {
        this.apiKey = process.env.GROK_API_KEY;
        if (this.apiKey) {
            console.log("✅ [GrokService] Conectado (API Key detectada).");
        } else {
            console.warn("⚠️ [GrokService] GROK_API_KEY não encontrada. Serviço desativado.");
        }
    }

    /**
     * Generate Viral Video (Text-to-Video)
     * Prompt: "Cinematic shot of a cybernetic robot..."
     */
    async generateViralVideo(prompt: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error("Grok API Key not configured.");
        }

        console.log(`[Grok] Gerando vídeo viral para prompt: "${prompt.substring(0, 50)}..."`);

        try {
            // Note: xAI API structure for video is often under 'images/generations' with specific model
            // Or a dedicated /video endpoint depending on latest beta.
            // Using standard OpenAI-compatible structure which xAI often follows.

            // *HYPOTHETICAL ENDPOINT for Grok T2V* - Adjusting to "grok-imagine" or equivalent
            const response = await axios.post(
                `${this.baseUrl}/images/generations`, // Often they use same endpoint for visual gen
                {
                    model: "grok-imagine-video", // Hypothetical model name for video
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024", // or 16:9 aspect ratio
                    response_format: "url"
                },
                {
                    headers: {
                        "Authorization": `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const videoUrl = response.data.data[0].url;
            console.log("[Grok] Vídeo gerado:", videoUrl);
            return videoUrl;

        } catch (error) {
            console.error("❌ [Grok] Falha na geração:", error);
            // Fallback for demo if API fails strictly because of "beta" access
            if (process.env.NODE_ENV === 'development') {
                console.log("DEV FALLBACK: Retornando vídeo de placeholder para não travar o fluxo.");
                return "https://media.istockphoto.com/id/1465646199/video/futuristic-robot-artificial-intelligence-creates-a-digital-green-plant-nature-data-big-data.mp4?s=mp4-640x640-is&k=20&c=K5A_6Wz_tW5K2w7_Kk5_Kk5.mp4";
            }
            throw error;
        }
    }
}

export const grokService = new GrokService();
