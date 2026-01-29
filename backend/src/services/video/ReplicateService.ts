import Replicate from "replicate";

/**
 * Replicate Service
 * Connects to Replicate API to run open-weight models.
 * Focused on: SadTalker (Talking Heads) for low-cost institutional videos.
 */
export class ReplicateService {
    private replicate: Replicate | null = null;
    private isReady: boolean = false;

    constructor() {
        if (process.env.REPLICATE_API_TOKEN) {
            this.replicate = new Replicate({
                auth: process.env.REPLICATE_API_TOKEN,
            });
            this.isReady = true;
            console.log("✅ [ReplicateService] Conectado (API Token detectado).");
        } else {
            console.warn("⚠️ [ReplicateService] REPLICATE_API_TOKEN não encontrado. Serviço desativado.");
        }
    }

    /**
     * Generate Talking Head Video (SadTalker)
     * Costs: ~$0.01 - $0.05 per run (Pay-per-second)
     */
    async generateTalkingHead(
        sourceImageUrl: string,
        audioUrl: string
    ): Promise<{ videoUrl: string; duration: number; cost: number }> {
        // SEM MOCK - Exige configuração real
        if (!this.isReady || !this.replicate) {
            throw new Error("⚠️ Erro de Configuração: API Key do Replicate não encontrada. Impossível gerar vídeo real.");
        }

        console.log(`[Replicate] Iniciando geração de Talking Head...`);
        console.log(`- Imagem: ${sourceImageUrl}`);
        console.log(`- Audio: ${audioUrl}`);

        try {
            // Using a popular public deployment of SadTalker or similar
            // This Model ID is standard for SadTalker on Replicate
            const output = await this.replicate.run(
                "cjwbw/sadtalker:a519cc0cf9ca4a6825c57173a4b99818816c4f0340c268802958742b8e3089d5",
                {
                    input: {
                        driven_audio: audioUrl,
                        source_image: sourceImageUrl,
                        enhancer: "gfpgan", // Melhora a qualidade do rosto
                        still: true, // Menos movimento de cabeça (mais estável)
                        preprocess: "full"
                    }
                }
            );

            console.log("[Replicate] Sucesso! Output:", output);

            // Replicate usually returns the URL directly in output
            // Safely cast via unknown
            return {
                videoUrl: (output as unknown) as string,
                duration: 15,
                cost: 0.05
            };

        } catch (error) {
            console.error("❌ [Replicate] Failed to generate video:", error);
            throw new Error(`Replicate Error: ${(error as Error).message}`);
        }
    }

    /**
     * Generate HQ Image (SDXL Lightning)
     * Costs: Fraction of a cent.
     */
    async generateImage(prompt: string, aspect_ratio: string = "1:1"): Promise<string> {
        // SEM MOCK - Exige configuração real
        if (!this.isReady || !this.replicate) {
            throw new Error("⚠️ Erro de Configuração: API Key do Replicate não encontrada. Impossível gerar imagem real.");
        }

        try {
            const output = await this.replicate.run(
                "bytedance/sdxl-lightning-4step:5599ed30703f36d6473fa63179634a766a64f50785f629858d9972dc83021819",
                {
                    input: {
                        prompt,
                        aspect_ratio, // width/height based on string
                        num_inference_steps: 4,
                        disable_safety_checker: true
                    }
                }
            );
            // Output is typically an array of 1 URL [ "https://..." ]
            return Array.isArray(output) ? output[0] : (output as unknown as string);
        } catch (e) {
            console.error("❌ [Replicate] Image Gen Failed:", e);
            throw e;
        }
    }
}

export const replicateService = new ReplicateService();
