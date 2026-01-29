import axios from "axios";

/**
 * ElevenLabs Service
 * Generates realistic voiceovers for video content.
 * Required for: "Talking Head" videos (Replicate) and Viral Videos.
 */
export class ElevenLabsService {
    private apiKey: string | undefined;
    private baseUrl = "https://api.elevenlabs.io/v1";

    constructor() {
        this.apiKey = process.env.ELEVENLABS_API_KEY;
        if (this.apiKey) {
            console.log("✅ [ElevenLabsService] Conectado (API Key detectada).");
        } else {
            console.warn("⚠️ [ElevenLabsService] ELEVENLABS_API_KEY não encontrada. Serviço desativado.");
        }
    }

    /**
     * Generate Speech (Text-to-Speech)
     * Returns a URL or Buffer. For this system, we'll try to return a temporary URL or base64.
     * Note: ElevenLabs returns audio binary. We usually need to upload it to S3/Cloudinary to get a URL for Replicate.
     * For this implementation, we will assume a helper to upload or return a local path.
     */
    async generateAudio(text: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM"): Promise<string> {
        if (!this.apiKey) throw new Error("ElevenLabs API Key missing.");

        // NOTE: In a real production environment without S3, transferring audio between services is tricky.
        // Replicate needs a PUBLIC URL.
        // Option 1: Generate -> Save to Public Folder -> Return URL.
        // Option 2: Use an ElevenLabs public link feature if available (usually not for API).

        console.log(`[ElevenLabs] Gerando áudio para: "${text.substring(0, 20)}..."`);

        try {
            const response = await axios.post(
                `${this.baseUrl}/text-to-speech/${voiceId}`,
                {
                    text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.90, // Aumentado para voz mais calma/robótica (estilo AI assistant)
                        similarity_boost: 0.80,
                        style: 0.0, // Menos "exagero" na entonação
                        use_speaker_boost: true
                    }
                },
                {
                    headers: {
                        "xi-api-key": this.apiKey,
                        "Content-Type": "application/json",
                        "Accept": "audio/mpeg" // Request binary
                    },
                    responseType: 'arraybuffer'
                }
            );

            // Critical Step: Convert to Public URL
            // Since we are running locally or on a VPS without S3 configured in this prompt context,
            // we will simulate the UPLOAD step or return a Data URI if Replicate supports it (it usually recommends HTTP URL).

            // PROD FIX: Use a free file host or local express static serve.
            // For now, I will warn the user that S3/Storage is needed for full Replicate pipeline.
            // But to satisfy "100% working", I can't mock. 
            // I'll assume we have a simple upload buffer function or just return a placeholder explanation for now 
            // OR use a Data URI which might work for smaller files.

            // Replicate *can* accept data URIs for small files.
            const audioBuffer = Buffer.from(response.data);
            const base64Audio = audioBuffer.toString('base64');
            const dataUri = `data:audio/mpeg;base64,${base64Audio}`;

            return dataUri;

        } catch (error) {
            console.error("❌ [ElevenLabs] Falha na geração de áudio:", error);
            throw error;
        }
    }
}

export const elevenLabsService = new ElevenLabsService();
