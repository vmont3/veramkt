import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { telegramNotification } from '../services/TelegramNotificationService';
import { prisma } from '../database/prismaClient';
import { veraOrchestrator } from '../services/agents/VeraOrchestrator'; // V2 Orchestrator
import { audioService } from '../services/ai/AudioService'; // Audio Service
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // For saving TTS files

const router = Router();

/**
 * 📋 GET /api/support/chats
 * Listar todas as conversas de suporte do usuário autenticado
 */
router.get('/chats', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;

        const chats = await prisma.supportChat.findMany({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1 // Última mensagem para preview
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json({
            success: true,
            data: chats
        });
    } catch (error: any) {
        console.error('❌ [Support] Erro ao listar chats:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao carregar conversas'
        });
    }
});

/**
 * 💬 POST /api/support/chats
 * Criar novo chat ou enviar mensagem em chat existente
 */
router.post('/chats', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { message, subject, files = [] } = req.body; // Added files support

        // Message is optional if there's a file (e.g. audio only or image only)
        if (!message && (!files || files.length === 0)) {
            return res.status(400).json({
                success: false,
                error: 'Mensagem ou arquivo é obrigatório'
            });
        }

        // Buscar usuário para contexto
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true }
        });

        // Buscar ou criar chat aberto
        let chat = await prisma.supportChat.findFirst({
            where: {
                userId,
                status: 'open'
            }
        });

        if (!chat) {
            // Criar novo chat
            chat = await prisma.supportChat.create({
                data: {
                    userId,
                    subject: subject || 'Nova Conversa',
                    lastMessage: message ? message.substring(0, 100) : 'Arquivo enviado',
                    unreadCount: 1
                }
            });
        } else {
            // Atualizar chat existente
            chat = await prisma.supportChat.update({
                where: { id: chat.id },
                data: {
                    lastMessage: message ? message.substring(0, 100) : 'Arquivo enviado',
                    unreadCount: { increment: 1 },
                    updatedAt: new Date()
                }
            });
        }

        // Criar mensagem do usuário
        // TODO: Associate files with message in DB if schema supports it, for now we assume generic context
        const supportMessage = await prisma.supportMessage.create({
            data: {
                chatId: chat.id,
                sender: 'user',
                message: message || "(Mídia Enviada)"
            }
        });

        // 🎤 STT: Check if valid audio file exists and transcribe
        let finalMessageText = message || "";
        let isAudioInput = false;

        if (files.length > 0) {
            // Check if any file is audio based on uploadedFile record
            // We need to fetch file records to know the type
            const fileRecords = await prisma.uploadedFile.findMany({
                where: { id: { in: files } }
            });

            const audioFile = fileRecords.find(f => f.type === 'audio' || f.mimeType.startsWith('audio/'));

            if (audioFile) {
                isAudioInput = true;
                try {
                    const UPLOAD_DIR = path.join(__dirname, '../../uploads');
                    const filePath = path.join(UPLOAD_DIR, audioFile.filename); // Assuming local storage

                    const transcription = await audioService.transcribe(filePath);
                    if (transcription && transcription.trim().length > 0) {
                        finalMessageText = `(Transcrição de Áudio): ${transcription}`;
                        console.log(`[Support] 🗣️ Transcrição: "${finalMessageText}"`);
                    } else {
                        // Transcription failed or was empty
                        console.warn("[Support] Transcrição vazia ou falhou.");
                        finalMessageText = ""; // Clear placeholder so we can handle it below
                    }
                } catch (sttErr) {
                    console.error("[Support] Falha no STT:", sttErr);
                    finalMessageText = ""; // Clear placeholder
                }
            }
        }

        // 🤖 ORCHESTRATION & RESPONSE LOGIC
        let veraResponse: string;
        let audioResponseIds: string[] = [];

        // Check for Audio Failure
        if (isAudioInput && (!finalMessageText || finalMessageText === '')) {
            console.warn("[Support] Áudio não transcrito. Pulando VeraOrchestrator.");
            veraResponse = "Desculpe, recebi seu áudio mas não consegui ouvir o conteúdo (problema na transcrição). Poderia escrever sua mensagem por favor? 📝";
        } else {
            // ✅ Normal Flow: Call Orchestrator
            try {
                // Pass message to Vera Orchestrator -> Chat Agent
                const response = await veraOrchestrator.processRequest({
                    requestId: `support_${userId}_${Date.now()}`,
                    type: 'CHAT',
                    payload: {
                        userId: userId,
                        platform: 'site_chat',
                        message: finalMessageText || "(Mídia Enviada)",
                        context: {
                            audio: isAudioInput,
                            hasMedia: files.length > 0,
                            mediaType: isAudioInput ? 'audio' : 'other'
                        }
                    },
                    files: files // Pass user files (images, etc)
                });

                veraResponse = response.data?.reply || response.message || "Estou sem palavras no momento.";

                // 🗣️ TTS: Generate audio if input was audio
                if (isAudioInput) {
                    try {
                        const audioBuffer = await audioService.textToSpeech(veraResponse);
                        if (audioBuffer) {
                            const UPLOAD_DIR = path.join(__dirname, '../../uploads');
                            if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

                            const filename = `${uuidv4()}.mp3`;
                            const filePath = path.join(UPLOAD_DIR, filename);
                            fs.writeFileSync(filePath, audioBuffer);

                            // Save file record
                            const ttsFile = await prisma.uploadedFile.create({
                                data: {
                                    userId: 'system_vera',
                                    filename: filename,
                                    originalName: `vera_reply_${Date.now()}.mp3`,
                                    mimeType: 'audio/mpeg',
                                    size: audioBuffer.length,
                                    type: 'audio',
                                    path: filePath
                                }
                            });
                            audioResponseIds.push(ttsFile.id);
                        }
                    } catch (ttsErr) {
                        console.error("[Support] Falha no TTS:", ttsErr);
                    }
                }

            } catch (error: any) {
                console.error('❌ Orquestrador falhou:', error);

                // Check for Quota Error
                if (error?.error?.code === 'insufficient_quota' || error?.message?.includes('quota')) {
                    veraResponse = "⚠️ **ERRO DE CRÉDITO OPENAI:**\nA chave de API configurada esgotou os créditos/quota. Por favor, verifique o faturamento na OpenAI (platform.openai.com).";
                } else {
                    veraResponse = `Olá! Recebi sua mensagem. Estou com uma pequena instabilidade técnica no momento, mas já registrei sua solicitação. 😊`;
                }
            }
        }

        // Salvar resposta da VERA
        const veraMessage = await prisma.supportMessage.create({
            data: {
                chatId: chat.id,
                sender: 'admin',
                message: veraResponse
            }
        });

        // Atualizar última mensagem do chat
        await prisma.supportChat.update({
            where: { id: chat.id },
            data: {
                lastMessage: veraResponse.substring(0, 100),
                unreadCount: 0 // VERA já respondeu
            }
        });

        // 📱 Notificar Telegram
        await telegramNotification.notifySupportMessage({
            userEmail: user?.email || 'Desconhecido',
            userName: user?.name || undefined,
            message: `🤖 VERA (Chat Web)\n\n💬 [Chat #${chat.id.substring(0, 8)}]\n📩 Usuário: ${finalMessageText}\n✅ VERA: ${veraResponse}\nFiles: ${files.length}`
        });

        res.json({
            success: true,
            data: {
                chat,
                message: supportMessage,
                responseMessage: veraMessage,
                responseAudio: audioResponseIds.length > 0 ? audioResponseIds[0] : null // Send audio ID to frontend
            }
        });
    } catch (error: any) {
        console.error('❌ [Support] Erro ao criar mensagem:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao enviar mensagem'
        });
    }
});

/**
 * 📜 GET /api/support/chats/:chatId/messages
 * Obter todas as mensagens de um chat específico
 */
router.get('/chats/:chatId/messages', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { chatId } = req.params;

        // Verificar se o chat pertence ao usuário
        const chat = await prisma.supportChat.findFirst({
            where: {
                id: chatId,
                userId
            }
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat não encontrado'
            });
        }

        // Buscar mensagens
        const messages = await prisma.supportMessage.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' }
        });

        // Marcar mensagens do admin como lidas
        await prisma.supportMessage.updateMany({
            where: {
                chatId,
                sender: 'admin',
                isRead: false
            },
            data: { isRead: true }
        });

        res.json({
            success: true,
            data: messages
        });
    } catch (error: any) {
        console.error('❌ [Support] Erro ao buscar mensagens:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao carregar mensagens'
        });
    }
});

/**
 * 🔐 POST /api/support/admin/reply
 * ENDPOINT INTERNO - Usado pelo sistema Telegram para enviar respostas do admin
 */
router.post('/admin/reply', async (req, res) => {
    try {
        const { chatId, message, adminToken } = req.body;

        // Validar token do admin (segurança)
        if (adminToken !== process.env.ADMIN_REPLY_TOKEN) {
            return res.status(401).json({
                success: false,
                error: 'Não autorizado'
            });
        }

        if (!chatId || !message) {
            return res.status(400).json({
                success: false,
                error: 'chatId e message são obrigatórios'
            });
        }

        // Verificar se o chat existe
        const chat = await prisma.supportChat.findUnique({
            where: { id: chatId }
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat não encontrado'
            });
        }

        // Criar mensagem do admin
        const supportMessage = await prisma.supportMessage.create({
            data: {
                chatId,
                sender: 'admin',
                message
            }
        });

        // Atualizar chat
        await prisma.supportChat.update({
            where: { id: chatId },
            data: {
                lastMessage: message.substring(0, 100),
                status: 'pending', // Aguardando resposta do usuário
                unreadCount: 0, // Resetar contador (admin respondeu)
                updatedAt: new Date()
            }
        });

        res.json({
            success: true,
            data: supportMessage
        });
    } catch (error: any) {
        console.error('❌ [Support] Erro ao enviar resposta admin:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao processar resposta'
        });
    }
});

/**
 * ✅ PATCH /api/support/chats/:chatId/close
 * Fechar um chat de suporte
 */
router.patch('/chats/:chatId/close', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { chatId } = req.params;

        // Verificar se o chat pertence ao usuário
        const chat = await prisma.supportChat.findFirst({
            where: {
                id: chatId,
                userId
            }
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat não encontrado'
            });
        }

        // Fechar chat
        await prisma.supportChat.update({
            where: { id: chatId },
            data: { status: 'closed' }
        });

        res.json({
            success: true,
            message: 'Chat fechado com sucesso'
        });
    } catch (error: any) {
        console.error('❌ [Support] Erro ao fechar chat:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao fechar chat'
        });
    }
});

// ========== LEGACY ENDPOINTS (mantidos para compatibilidade) ==========

// Send support message (DEPRECATED - use POST /chats instead)
router.post('/message', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        // Get user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Send to Telegram
        await telegramNotification.notifySupportMessage({
            userEmail: user.email,
            userName: user.name || undefined,
            message
        });

        res.json({
            success: true,
            message: 'Mensagem enviada! Nossa equipe responderá em breve.',
            from: 'VERA AI'
        });
    } catch (error: any) {
        console.error('[Support Chat] Error:', error);
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});

// Get chat history (DEPRECATED - use GET /chats/:chatId/messages instead)
router.get('/history', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;

        // Buscar chat mais recente do usuário
        const recentChat = await prisma.supportChat.findFirst({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 50
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        if (!recentChat) {
            return res.json({
                messages: [
                    {
                        id: '1',
                        from: 'VERA',
                        message: 'Olá! Sou a VERA, sua assistente de marketing AI 👋\n\nComo posso ajudar você hoje? Tire suas dúvidas sobre nossos agentes, planos, integrações ou qualquer outra coisa!',
                        timestamp: new Date().toISOString(),
                        isBot: true
                    }
                ]
            });
        }

        // Converter para formato legado
        const formattedMessages = recentChat.messages.map(msg => ({
            id: msg.id,
            from: msg.sender === 'admin' ? 'VERA' : 'Você',
            message: msg.message,
            timestamp: msg.createdAt.toISOString(),
            isBot: msg.sender === 'admin'
        }));

        res.json({ messages: formattedMessages });
    } catch (error: any) {
        console.error('[Support Chat] Error:', error);
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
});

export default router;

