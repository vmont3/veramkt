import 'dotenv/config';
import express from 'express';
import { audioService } from './services/ai/AudioService';
import cors from 'cors';
import dotenv from 'dotenv';
import { agencyOrchestrator } from './services/agents/AgencyOrchestrator';
import { marketMonitoringAgent } from './services/agents/MarketMonitoringAgent';
import { systemMonitor } from './services/agents/SystemMonitorAgent';
import { designAgent } from './services/agents/DesignAgent';
import { copyAgent } from './services/agents/CopyAgent';
import { telegramService } from './services/TelegramService'; // Import Telegram
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { telegramSupportHandler } from './services/TelegramSupportHandler'; // Support Chat Handler
import { strategyAgent } from './services/agents/StrategyAgent'; // Proactive Engine
import { performanceAgent } from './services/agents/PerformanceAgent'; // Performance Autopilot
import { veraOrchestrator } from './services/agents/VeraOrchestrator'; // V2 Orchestrator
import { prisma } from './database/prismaClient';

/**
 * ProactiveScheduler - 4x Daily Strategic Pulse
 * Runs at 06:00, 12:00, 18:00, 22:00 (Brazil time)
 * 5x ahead of traditional agencies that scan once daily
 */
class ProactiveScheduler {
    private pulseHours = [6, 12, 18, 22];
    private lastPulseHour: number | null = null;

    async start() {
        console.log('⚡ [ProactiveScheduler] Initializing 4x Daily Pulse Engine...');

        // Check every 5 minutes if it's time for a pulse
        setInterval(async () => {
            await this.checkAndRunPulse();
        }, 5 * 60 * 1000); // Every 5 minutes

        // Also run once on startup
        await this.checkAndRunPulse();
    }

    private async checkAndRunPulse() {
        const now = new Date();
        const currentHour = now.getHours();

        // Check if current hour matches any pulse hour and we haven't run this hour yet
        if (this.pulseHours.includes(currentHour) && this.lastPulseHour !== currentHour) {
            console.log(`⚡ [ProactiveScheduler] PULSE TRIGGERED at ${currentHour}:00`);
            this.lastPulseHour = currentHour;

            // Get all active users and run pulse for each
            try {
                const users = await prisma.user.findMany({ where: { role: { not: 'deactivated' } }, take: 50 });
                for (const user of users) {
                    try {
                        await strategyAgent.runDailyPulse(user.id);
                    } catch (e) {
                        console.error(`[ProactiveScheduler] Pulse failed for user ${user.id}:`, e);
                    }
                }
                console.log(`⚡ [ProactiveScheduler] Pulse complete for ${users.length} users`);
            } catch (err) {
                console.error('[ProactiveScheduler] Error running pulse:', err);
            }
        }
    }
}

const proactiveScheduler = new ProactiveScheduler();

dotenv.config();

// All imports at top
import authRoutes from './routes/auth';
import planRoutes from './routes/plans';
import creditRoutes from './routes/credits';
import usersRoutes from './routes/users';
import dashboardRoutes from './routes/dashboard';
import { orchestratorRoutes } from './routes/orchestrator';
import brandRoutes from './routes/brand';
import leadsRoutes from './routes/leads';
import referralRoutes from './routes/referral';
import contactRoutes from './routes/contact';
import supportRoutes from './routes/support';
import agentRoutes from './routes/agents';
import integrationRoutes from './routes/integrations';
import filesRoutes from './routes/files';

import { authenticateToken, requireSuperAdmin } from './middleware/auth';
import { HealthCheckController } from './services/HealthCheckController';
import { ConfigController } from './services/ConfigController';

const app = express();
app.use(cors({ origin: '*' })); // Allow all for development stability
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vera', orchestratorRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/files', filesRoutes);

// Controllers
const healthCheckController = new HealthCheckController();
const configController = new ConfigController();

// Health Check Routes (Protected)
app.get('/health/detailed', authenticateToken, requireSuperAdmin, (req, res) => healthCheckController.getDetailedReport(req, res));
app.get('/health/metrics', authenticateToken, requireSuperAdmin, (req, res) => healthCheckController.getSystemMetrics(req, res));
app.post('/health/emergency-protocol', authenticateToken, requireSuperAdmin, (req, res) => healthCheckController.emergencyProtocol(req, res));
app.post('/health/resume-system', authenticateToken, requireSuperAdmin, (req, res) => healthCheckController.resumeSystem(req, res));
app.post('/health/circuit-breaker', authenticateToken, requireSuperAdmin, (req, res) => healthCheckController.toggleCircuit(req, res));
app.post('/health/verify-admin', authenticateToken, requireSuperAdmin, (req, res) => healthCheckController.verifyAdmin(req, res));
app.post('/health/reset-agent', authenticateToken, requireSuperAdmin, (req, res) => healthCheckController.resetAgent(req, res));

// Config Routes (Protected)
app.get('/config/visual', authenticateToken, requireSuperAdmin, (req, res) => configController.getSettings(req, res));
app.post('/config/update', authenticateToken, requireSuperAdmin, (req, res) => configController.updateSettings(req, res));

app.get('/', (req, res) => {
    res.send('✨ VERA Backend Running Successfully!');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        orchestrator: 'running',
        agents: {
            marketMonitor: 'active',
            design: 'active',
            copy: 'active',
            agency: 'active'
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/analytics', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'User ID not found' });

        const report = await agencyOrchestrator.generateAgencyReport(userId, 'monthly');
        res.json(report);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate analytics report' });
    }
});

async function start() {
    try {
        console.log('🚀 Starting VERA agents...');

        // Start monitoring agent
        console.log('📊 Starting Market Monitoring Agent...');
        await marketMonitoringAgent.startMonitoring();

        // Start orchestrator (LEGACY - Disabled Loop)
        // console.log('🎯 Starting Agency Orchestrator...');
        // await agencyOrchestrator.startOrchestration();
        console.log('✅ VERA Orchestrator V2 Ready (Reactive Mode)');

        // Start Telegram Uplink (Listening Mode)
        console.log('👂 Starting Telegram Command Listener...');
        telegramService.startPolling(async (senderId, text, mediaBuffer, mediaType) => {
            // 🔍 PRIORITY: Check for Support Chat Commands (/reply)
            if (text.trim().startsWith('/reply')) {
                const replyMatch = text.match(/^\/reply\s+([a-f0-9-]+)\s+(.+)$/i);
                if (replyMatch) {
                    const [, chatId, message] = replyMatch;
                    // Process support reply via TelegramSupportHandler
                    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
                    const ADMIN_REPLY_TOKEN = process.env.ADMIN_REPLY_TOKEN || 'your-secret-token';

                    try {
                        const axios = require('axios');
                        const response = await axios.post(
                            `${BACKEND_URL}/api/support/admin/reply`,
                            { chatId, message, adminToken: ADMIN_REPLY_TOKEN }
                        );

                        if (response.data.success) {
                            return `✅ Resposta enviada com sucesso!\n\n💬 Chat: #${chatId.substring(0, 8)}\n📝 Mensagem: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`;
                        } else {
                            return `❌ Erro: ${response.data.error}`;
                        }
                    } catch (error: any) {
                        return `❌ Erro ao enviar resposta: ${error.message}`;
                    }
                } else {
                    return '❌ Formato inválido.\n\nUso: /reply [chatId] [mensagem]';
                }
            }

            // Normal VERA chat processing
            const cmd = text ? text.toLowerCase() : "";
            if (cmd.includes("relatorio") || cmd.includes("status")) {
                await systemMonitor.generateDailyReport();
                return "Trabalhando nisso, Chefe. Relatório enviado.";
            }

            // Route to VERA Brain (V2 ORCHESTRATION)
            try {
                const files: string[] = [];
                let fileRecordForStt: any = null;

                // 📸 HANDLE MEDIA UPLOAD
                if (mediaBuffer && mediaType) {
                    try {
                        const UPLOAD_DIR = path.join(__dirname, '../../uploads');
                        if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

                        const ext = mediaType === 'image' ? '.jpg' : mediaType === 'video' ? '.mp4' : '.mp3';
                        const filename = `${uuidv4()}${ext}`;
                        const filePath = path.join(UPLOAD_DIR, filename);

                        // Save to disk
                        fs.writeFileSync(filePath, mediaBuffer);

                        // Save to DB
                        const fileRecord = await prisma.uploadedFile.create({
                            data: {
                                userId: 'admin_telegram', // Generic admin user
                                filename: filename,
                                originalName: `telegram_${mediaType}_${Date.now()}${ext}`,
                                mimeType: mediaType === 'image' ? 'image/jpeg' : mediaType === 'video' ? 'video/mp4' : 'audio/mpeg',
                                size: mediaBuffer.length,
                                type: mediaType,
                                path: filePath
                            }
                        });

                        fileRecordForStt = fileRecord;
                        files.push(fileRecord.id);
                        console.log(`[Telegram] Mídia salva: ${fileRecord.id} (${mediaType})`);

                    } catch (err) {
                        console.error("[Telegram] Erro ao salvar mídia:", err);
                        return "Recebi sua mensagem, mas tive um erro ao processar o arquivo anexo.";
                    }
                }



                // 🎤 AUDIO TRANSCRIPTION (STT)
                if (mediaType === 'audio' && fileRecordForStt) {
                    try {
                        const audioPath = fileRecordForStt.path || path.join(__dirname, '../../uploads', fileRecordForStt.filename);
                        const transcription = await audioService.transcribe(audioPath);
                        if (transcription) {
                            text = transcription;
                            console.log(`[Telegram] 🗣️ Transcrição: "${text}"`);
                        }
                    } catch (sttError) {
                        console.error("[Telegram] ❌ Falha na transcrição:", sttError);
                    }
                }

                // Pass message to Vera Orchestrator -> Chat Agent
                const response = await veraOrchestrator.processRequest({
                    requestId: `tg_${senderId}_${Date.now()}`,
                    type: 'CHAT',
                    payload: {
                        userId: 'admin_telegram',
                        platform: 'telegram',
                        message: text || "(Arquivo Enviado)", // Use transcribed text if available
                        context: {
                            audio: mediaType === 'audio',
                            hasMedia: !!mediaBuffer,
                            mediaType: mediaType
                        }
                    },
                    files: files
                });

                // Chat Agent returns { reply, ... } in data
                if (response.success && response.data?.reply) {
                    const replyText = response.data.reply;

                    // 🗣️ AUDIO RESPONSE (TTS) - If user sent audio, reply with audio
                    if (mediaType === 'audio') {
                        try {
                            const audioResponse = await audioService.textToSpeech(replyText);
                            if (audioResponse) {
                                await telegramService.sendVoice(audioResponse);
                                return ""; // Already sent voice, avoid double message (or return text as fallback/caption? usually voice is enough)
                            }
                        } catch (ttsError) {
                            console.error("[Telegram] ❌ Falha no TTS:", ttsError);
                            // Fallback to text
                        }
                    }

                    return replyText;
                }
                return response.message || "Sem resposta da VERA.";

            } catch (error: any) {
                console.error("Erro no processamento Telegram:", error);
                return "Desculpe, tive um erro interno de processamento.";
            }
        });

        // Start Proactive Scheduler (4x Daily Pulse - Industry Leading)
        console.log('⚡ Starting Proactive Scheduler (4x Daily)...');
        await proactiveScheduler.start();

        // Start Performance Autopilot (Hourly Optimization - 5x faster than agencies)
        console.log('🚀 Starting Performance Autopilot (Hourly)...');
        await performanceAgent.startAutopilot();

        console.log('✅ All agents started successfully!');
    } catch (err) {
        console.error('❌ Failed to start agents:', err);
    }
}

start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🌟 ================================================`);
    console.log(`   VERA Backend Server`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   Status: ✅ ACTIVE`);
    console.log(`================================================\n`);
});
