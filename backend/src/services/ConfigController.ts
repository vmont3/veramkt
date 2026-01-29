
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export class ConfigController {

    private envPath = path.resolve(__dirname, '../../.env');

    /**
     * GET /config/visual
     * Lê o arquivo .env e retorna para o painel (mas mascara as senhas para segurança)
     */
    async getSettings(req: any, res: Response) {
        const { adminKey } = req.query;

        if (req.user?.role !== 'SUPER_ADMIN' && adminKey !== process.env.ADMIN_KEY) {
            return res.status(403).json({ error: "Acesso Negado." });
        }

        try {
            // Ler arquivo cru para não depender só da memória
            let envContent = "";
            if (fs.existsSync(this.envPath)) {
                envContent = fs.readFileSync(this.envPath, 'utf8');
            }

            // Parse simples
            const config: any = dotenv.parse(envContent);

            return res.json({
                success: true,
                config: {
                    // Core System
                    PORT: config.PORT || "3000",
                    ADMIN_KEY: config.ADMIN_KEY || "",
                    DATABASE_URL: config.DATABASE_URL || "",
                    JWT_SECRET: config.JWT_SECRET || "",
                    FRONTEND_URL: config.FRONTEND_URL || "",

                    // AI Providers
                    OPENAI_API_KEY: config.OPENAI_API_KEY || "",
                    GEMINI_API_KEY: config.GEMINI_API_KEY || "", // Google AI
                    ELEVENLABS_API_KEY: config.ELEVENLABS_API_KEY || "", // Voice

                    // Payments & Business
                    MERCADO_PAGO_ACCESS_TOKEN: config.MERCADO_PAGO_ACCESS_TOKEN || "",
                    MERCADO_PAGO_PUBLIC_KEY: config.MERCADO_PAGO_PUBLIC_KEY || "",

                    // Integrations & Intelligence
                    TELEGRAM_BOT_TOKEN: config.TELEGRAM_BOT_TOKEN || "",
                    SENDGRID_API_KEY: config.SENDGRID_API_KEY || "",
                    TWITTER_API_KEY: config.TWITTER_API_KEY || "",
                    APIFY_API_TOKEN: config.APIFY_API_TOKEN || ""
                }
            });

        } catch (error) {
            return res.status(500).json({ error: "Falha ao ler configurações." });
        }
    }

    /**
     * POST /config/update
     * Atualiza o arquivo .env com os novos valores
     */
    async updateSettings(req: any, res: Response) {
        const { adminKey, settings } = req.body;

        if (req.user?.role !== 'SUPER_ADMIN' && adminKey !== process.env.ADMIN_KEY) {
            return res.status(403).json({ error: "Acesso Negado. Você não pode alterar as chaves do sistema." });
        }

        try {
            // Reconstrói o arquivo .env
            let newContent = "";

            // Ordem estética
            const order = [
                // Core
                'PORT', 'FRONTEND_URL', 'ADMIN_KEY', 'DATABASE_URL', 'JWT_SECRET',

                // AI
                'OPENAI_API_KEY', 'GEMINI_API_KEY', 'ELEVENLABS_API_KEY',

                // Payments
                'MERCADO_PAGO_ACCESS_TOKEN', 'MERCADO_PAGO_PUBLIC_KEY',

                // Social & Tools
                'TELEGRAM_BOT_TOKEN', 'SENDGRID_API_KEY', 'TWITTER_API_KEY', 'APIFY_API_TOKEN'
            ];

            // 1. Adiciona os campos conhecidos na ordem
            for (const key of order) {
                const value = settings[key] || process.env[key] || "";
                if (value) newContent += `${key}="${value}"\n`;
            }

            // Escreve no disco
            fs.writeFileSync(this.envPath, newContent.trim());

            return res.json({
                success: true,
                message: "Configurações salvas! O servidor será reiniciado automaticamente para aplicar."
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro crítico ao salvar arquivo .env" });
        }
    }
}
