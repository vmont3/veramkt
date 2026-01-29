import { Router } from 'express';
import { prisma } from '../database/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * POST /api/integrations/save
 * Salva ou atualiza uma integração genérica (API Key/Token)
 */
router.post('/save', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { platform, apiKey, metadata } = req.body;

        if (!platform || !apiKey) {
            return res.status(400).json({ error: 'Plataforma e Chave de API são obrigatórios.' });
        }

        // Upsert integration
        const integration = await prisma.integration.upsert({
            where: {
                userId_platform: {
                    userId,
                    platform: platform.toLowerCase()
                }
            },
            create: {
                userId,
                platform: platform.toLowerCase(),
                accessToken: apiKey, // Armazenamos a chave no campo accessToken
                isActive: true,
                metadata: metadata ? JSON.stringify(metadata) : null
            },
            update: {
                accessToken: apiKey,
                isActive: true,
                metadata: metadata ? JSON.stringify(metadata) : null,
                updatedAt: new Date()
            }
        });

        res.json({ success: true, message: `${platform} conectado com sucesso!`, integration: { platform: integration.platform, isActive: integration.isActive } });

    } catch (error) {
        console.error('Error saving integration:', error);
        res.status(500).json({ error: 'Falha ao salvar integração.' });
    }
});

/**
 * GET /api/integrations/status
 * Retorna o status de todas as integrações do usuário (sem vazar tokens)
 */
router.get('/status', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const integrations = await prisma.integration.findMany({
            where: { userId },
            select: {
                platform: true,
                isActive: true,
                updatedAt: true,
                expiresAt: true
            }
        });

        res.json(integrations);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar status das integrações.' });
    }
});

/**
 * DELETE /api/integrations/:platform
 * Remove uma integração
 */
router.delete('/:platform', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { platform } = req.params;

        await prisma.integration.delete({
            where: {
                userId_platform: {
                    userId,
                    platform: platform.toLowerCase()
                }
            }
        });

        res.json({ success: true, message: `Integração com ${platform} removida.` });
    } catch (error) {
        res.status(500).json({ error: 'Falha ao remover integração.' });
    }
});

export default router;
