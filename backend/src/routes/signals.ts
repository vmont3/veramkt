/**
 * Buyer Signals API Routes
 */

import express from 'express';
import { buyerSignalTracker, SignalType, SignalSource } from '../services/signals/BuyerSignalTracker';
import { prisma } from '../database/prismaClient';

const router = express.Router();

/**
 * POST /api/v1/signals - Receive signals from tracking script
 */
router.post('/v1/signals', async (req, res) => {
    try {
        const { signals } = req.body;
        const apiKey = req.headers['x-vera-api-key'];

        // Validate API key
        if (!apiKey) {
            return res.status(401).json({ error: 'API key required' });
        }

        // Find user by API key
        const user = await prisma.user.findFirst({
            where: { apiKey: apiKey as string }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        // Validate signals
        if (!Array.isArray(signals) || signals.length === 0) {
            return res.status(400).json({ error: 'Invalid signals format' });
        }

        // Track each signal
        const tracked = [];

        for (const signal of signals) {
            try {
                const result = await buyerSignalTracker.trackSignal({
                    visitorId: signal.visitorId,
                    sessionId: signal.sessionId,
                    userId: user.id,
                    type: signal.type as SignalType,
                    source: signal.source as SignalSource,
                    data: signal.data,
                    metadata: signal.metadata,
                    timestamp: new Date(signal.metadata.timestamp)
                });

                tracked.push(result.id);

            } catch (error) {
                console.error('[Signals API] Error tracking signal:', error);
            }
        }

        res.json({
            success: true,
            tracked: tracked.length,
            message: `${tracked.length} signals tracked`
        });

    } catch (error: any) {
        console.error('[Signals API] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/signals/profile/:visitorId - Get intent profile
 */
router.get('/profile/:visitorId', async (req, res) => {
    try {
        const { visitorId } = req.params;
        const userId = req.query.userId as string;

        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }

        const profile = await buyerSignalTracker.getIntentProfile(visitorId);

        res.json(profile);

    } catch (error: any) {
        console.error('[Signals API] Error getting profile:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/signals/hot-leads - Get hot leads
 */
router.get('/hot-leads', async (req, res) => {
    try {
        const userId = req.query.userId as string;
        const minScore = parseInt(req.query.minScore as string) || 50;

        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }

        const hotLeads = await buyerSignalTracker.getHotLeads(userId, minScore);

        res.json({
            total: hotLeads.length,
            leads: hotLeads
        });

    } catch (error: any) {
        console.error('[Signals API] Error getting hot leads:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/signals/analytics - Get analytics
 */
router.get('/analytics', async (req, res) => {
    try {
        const userId = req.query.userId as string;
        const startDate = new Date(req.query.startDate as string || Date.now() - 7 * 24 * 60 * 60 * 1000);
        const endDate = new Date(req.query.endDate as string || Date.now());

        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }

        const analytics = await buyerSignalTracker.batchProcessSignals(userId, startDate, endDate);

        res.json(analytics);

    } catch (error: any) {
        console.error('[Signals API] Error getting analytics:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/signals/test - Test signal tracking
 */
router.post('/test', async (req, res) => {
    try {
        const userId = req.query.userId as string;

        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }

        // Create test signals
        const testVisitorId = `test_visitor_${Date.now()}`;
        const testSessionId = `test_session_${Date.now()}`;

        const testSignals = [
            {
                type: SignalType.PAGE_VIEW,
                data: { page: '/pricing' }
            },
            {
                type: SignalType.TIME_ON_PAGE,
                data: { seconds: 45 }
            },
            {
                type: SignalType.FORM_INTERACTION,
                data: { fieldName: 'email' }
            }
        ];

        for (const signal of testSignals) {
            await buyerSignalTracker.trackSignal({
                visitorId: testVisitorId,
                sessionId: testSessionId,
                userId,
                type: signal.type,
                source: SignalSource.WEBSITE,
                data: signal.data,
                metadata: {
                    page: '/test',
                    device: 'desktop'
                },
                timestamp: new Date()
            });
        }

        const profile = await buyerSignalTracker.getIntentProfile(testVisitorId);

        res.json({
            success: true,
            testVisitorId,
            profile
        });

    } catch (error: any) {
        console.error('[Signals API] Test error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
