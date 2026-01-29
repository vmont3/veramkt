/**
 * CANVA OAUTH ROUTES
 * Handles OAuth flow for Canva API integration
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import axios from 'axios';
import { prisma } from '../database/prismaClient';

const router = Router();

const CANVA_AUTH_URL = 'https://www.canva.com/api/oauth/authorize';
const CANVA_TOKEN_URL = 'https://api.canva.com/rest/v1/oauth/token';
const CANVA_CLIENT_ID = process.env.CANVA_CLIENT_ID || '';
const CANVA_CLIENT_SECRET = process.env.CANVA_API_KEY || '';
// 🔴 IMPORTANTE: Trocar por domínio real após deploy
const REDIRECT_URI = process.env.CANVA_REDIRECT_URI || 'https://app.veramkt.com/api/canva/callback';

/**
 * GET /api/canva/connect
 * Iniciar OAuth flow
 */
router.get('/connect', authenticateToken, (req: any, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Gerar state token para segurança (prevent CSRF)
    const state = Buffer.from(JSON.stringify({
        userId,
        timestamp: Date.now()
    })).toString('base64');

    // Escopos necessários
    const scopes = [
        'design:content:read',
        'design:content:write',
        'design:meta:read',
        'asset:read',
        'asset:write'
    ].join(' ');

    // URL de autorização Canva
    const authUrl = `${CANVA_AUTH_URL}?` + new URLSearchParams({
        client_id: CANVA_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: scopes,
        state
    });

    res.json({
        success: true,
        authUrl,
        message: 'Redirect user to this URL to authorize Canva'
    });
});

/**
 * GET /api/canva/callback
 * OAuth callback (Canva redirects here after user authorizes)
 */
router.get('/callback', async (req, res) => {
    const { code, state, error } = req.query;

    // Se usuário negou permissão
    if (error) {
        console.error('[Canva OAuth] User denied:', error);
        return res.redirect('/dashboard?canva_error=denied');
    }

    if (!code || !state) {
        return res.redirect('/dashboard?canva_error=invalid');
    }

    try {
        // Validar state token
        const stateData = JSON.parse(Buffer.from(state as string, 'base64').toString());
        const { userId, timestamp } = stateData;

        // Verificar se state não expirou (5 minutos)
        if (Date.now() - timestamp > 5 * 60 * 1000) {
            return res.redirect('/dashboard?canva_error=expired');
        }

        // Trocar code por access token
        const tokenResponse = await axios.post(CANVA_TOKEN_URL, {
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CANVA_CLIENT_ID,
            client_secret: CANVA_CLIENT_SECRET
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const {
            access_token,
            refresh_token,
            expires_in,
            scope
        } = tokenResponse.data;

        // Salvar tokens no banco
        await prisma.integration.upsert({
            where: {
                userId_platform: {
                    userId,
                    platform: 'canva'
                }
            },
            create: {
                userId,
                platform: 'canva',
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: new Date(Date.now() + expires_in * 1000),
                scopes: scope,
                isActive: true
            },
            update: {
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: new Date(Date.now() + expires_in * 1000),
                scopes: scope,
                isActive: true
            }
        });

        console.log(`[Canva OAuth] ✅ User ${userId} connected successfully`);

        // Redirecionar de volta para dashboard
        res.redirect('/dashboard?canva_success=true');

    } catch (error: any) {
        console.error('[Canva OAuth] Error exchanging code:', error.response?.data || error.message);
        res.redirect('/dashboard?canva_error=token_exchange');
    }
});

/**
 * POST /api/canva/refresh
 * Refresh access token
 */
router.post('/refresh', authenticateToken, async (req: any, res) => {
    const userId = req.user?.id;

    try {
        // Buscar refresh token
        const integration = await prisma.integration.findUnique({
            where: {
                userId_platform: {
                    userId,
                    platform: 'canva'
                }
            }
        });

        if (!integration || !integration.refreshToken) {
            return res.status(404).json({ error: 'Canva not connected' });
        }

        // Refresh token
        const tokenResponse = await axios.post(CANVA_TOKEN_URL, {
            grant_type: 'refresh_token',
            refresh_token: integration.refreshToken,
            client_id: CANVA_CLIENT_ID,
            client_secret: CANVA_CLIENT_SECRET
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // Atualizar DB
        await prisma.integration.update({
            where: {
                userId_platform: {
                    userId,
                    platform: 'canva'
                }
            },
            data: {
                accessToken: access_token,
                refreshToken: refresh_token || integration.refreshToken,
                expiresAt: new Date(Date.now() + expires_in * 1000)
            }
        });

        res.json({
            success: true,
            message: 'Token refreshed'
        });

    } catch (error: any) {
        console.error('[Canva OAuth] Error refreshing token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});

/**
 * DELETE /api/canva/disconnect
 * Disconnect Canva integration
 */
router.delete('/disconnect', authenticateToken, async (req: any, res) => {
    const userId = req.user?.id;

    try {
        await prisma.integration.delete({
            where: {
                userId_platform: {
                    userId,
                    platform: 'canva'
                }
            }
        });

        res.json({
            success: true,
            message: 'Canva disconnected'
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to disconnect' });
    }
});

/**
 * GET /api/canva/status
 * Check connection status
 */
router.get('/status', authenticateToken, async (req: any, res) => {
    const userId = req.user?.id;

    try {
        const integration = await prisma.integration.findUnique({
            where: {
                userId_platform: {
                    userId,
                    platform: 'canva'
                }
            }
        });

        if (!integration) {
            return res.json({
                connected: false
            });
        }

        // Check if token expired
        const isExpired = integration.expiresAt ? integration.expiresAt < new Date() : true;

        res.json({
            connected: integration.isActive,
            scopes: integration.scopes,
            expiresAt: integration.expiresAt,
            needsRefresh: isExpired
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get status' });
    }
});

export default router;
