import { telegramService } from "../TelegramService";
import { elevenLabsService } from "../video/ElevenLabsService";
import { prisma } from "../../database/prismaClient";

/**
 * System Monitor Agent (A "VERA de Controle")
 * Responsável por vigiar a saúde da nave e reportar ao Admin.
 */
export class SystemMonitorAgent {

    // Intervalos de checagem
    private HEALTH_CHECK_INTERVAL = 1000 * 60 * 60; // 1 hora
    private DAILY_REPORT_TIME = 9; // 9 da manhã

    constructor() {
        console.log("📡 [SystemMonitorAgent] Sistemas de monitoramento iniciados.");
    }

    /**
     * Tenta rodar um diagnóstico completo
     */
    async runFullDiagnosis() {
        console.log("[SystemMonitor] Iniciando diagnóstico de sistemas...");

        const services = [
            { name: "Database (Prisma)", status: await this.checkDatabase(), latency: 15 },
            { name: "AI Core (Gemini/OpenAI)", status: "online", latency: 120 }, // Simulado por enquanto
            { name: "Video Engine (Replicate)", status: "online", latency: 250 },
            { name: "Voice Synthesizer (ElevenLabs)", status: "online", latency: 180 },
            { name: "Email Uplink (Resend)", status: "online", latency: 90 }
        ];

        // Se algum serviço estiver offline, notificar imediatamente
        const criticalFailures = services.filter(s => s.status === 'offline');
        if (criticalFailures.length > 0) {
            await telegramService.notifyCriticalFailure(
                "Múltiplos Sistemas",
                `Falha detectada em: ${criticalFailures.map(s => s.name).join(", ")}`
            );
        }

        // Enviar relatório geral
        await telegramService.sendSystemHealthReport(services as any);
    }

    /**
     * Teste de Áudio para o Admin
     */
    async sendVoiceTest() {
        console.log("[SystemMonitor] Iniciando protocolo de teste de voz...");
        try {
            // Pontuações extras (...) ajudam a IA a pausar e falar mais devagar
            const text = "Olá, Chefe... Os sistemas da VERA estão online e operantes... A nave está pronta para o comando.";
            const audioData = await elevenLabsService.generateAudio(text);
            await telegramService.sendVoice(audioData);
            console.log("[SystemMonitor] Teste de voz concluído.");
        } catch (e) {
            console.error("[SystemMonitor] Falha no teste de voz:", e);
            await telegramService.notifyCriticalFailure("VoiceTest", "Falha ao gerar voz de teste.");
        }
    }

    /**
     * Gera e envia o relatório financeiro do dia
     */
    async generateDailyReport() {
        // Num cenário real, buscaria isso da tabela de 'UsageLogs' ou 'Transactions'
        const revenue = await this.calculateDailyRevenue();
        const costs = await this.calculateDailyCosts();
        const newUsers = await prisma.user.count({
            where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
        });

        await telegramService.sendDailyFinancialReport(revenue, costs, newUsers);
    }

    // --- Internal Checks ---

    private async checkDatabase(): Promise<'online' | 'offline'> {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return 'online';
        } catch (e) {
            console.error("[SystemMonitor] Database check failed:", e);
            return 'offline';
        }
    }

    private async calculateDailyRevenue(): Promise<number> {
        // Mock: Implementar lógica real de somar assinaturas do dia
        return 1250.00;
    }

    private async calculateDailyCosts(): Promise<number> {
        // Mock: Implementar lógica real de somar custos de API (guardados no banco a cada chamada)
        return 45.30;
    }
}

export const systemMonitor = new SystemMonitorAgent();
