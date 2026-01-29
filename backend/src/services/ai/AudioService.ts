
import fs from 'fs';
import OpenAI from 'openai';

/**
 * Audio Service
 * Gerencia Transcrição (STT) e Síntese de Voz (TTS)
 */
export class AudioService {
    private openai: OpenAI | undefined;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey && apiKey.startsWith('sk-')) {
            this.openai = new OpenAI({ apiKey });
        } else {
            console.warn("[AudioService] OPENAI_API_KEY inválida ou ausente. STT/TTS desativados.");
        }
    }

    /**
     * Transcrever Áudio (Whisper)
     */
    async transcribe(filePath: string): Promise<string> {
        if (!this.openai) {
            console.warn("[AudioService] OpenAI não inicializada. Ignorando STT.");
            return "";
        }
        try {
            console.log(`[AudioService] Transcrevendo arquivo: ${filePath}`);
            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(filePath),
                model: "whisper-1",
                language: "pt", // Forçar português
            });

            console.log(`[AudioService] Transcrição: "${transcription.text}"`);
            return transcription.text;
        } catch (error) {
            console.error("[AudioService] Erro na transcrição:", error);
            return ""; // Retorna vazio em caso de erro
        }
    }

    /**
     * Gerar Áudio (TTS-1)
     */
    async textToSpeech(text: string, voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'nova'): Promise<Buffer | null> {
        if (!this.openai) {
            console.warn("[AudioService] OpenAI não inicializada. Ignorando TTS.");
            return null;
        }
        try {
            console.log(`[AudioService] Gerando áudio para: "${text.substring(0, 50)}..."`);
            const mp3 = await this.openai.audio.speech.create({
                model: "tts-1",
                voice: voice,
                input: text,
            });

            const buffer = Buffer.from(await mp3.arrayBuffer());
            return buffer;
        } catch (error) {
            console.error("[AudioService] Erro no TTS:", error);
            return null;
        }
    }
}

export const audioService = new AudioService();
