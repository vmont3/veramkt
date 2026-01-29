/**
 * Onboarding API Routes - Website Learner
 */

import express from 'express';
import { websiteLearner } from '../services/onboarding/WebsiteLearner';
import { prisma } from '../database/prismaClient';

const router = express.Router();

/**
 * POST /api/onboarding/learn-website - Start website learning
 */
router.post('/learn-website', async (req, res) => {
    try {
        const { url, userId } = req.body;

        if (!url || !userId) {
            return res.status(400).json({ error: 'url and userId required' });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // Start learning process (async)
        res.json({
            success: true,
            message: 'Website learning started',
            estimatedTime: '2-3 minutes'
        });

        // Learn in background
        websiteLearner.learnFromWebsite(url, userId, (progress) => {
            console.log(`[Onboarding] ${progress.message} (${progress.progress}%)`);
            // In production, would send progress via WebSocket or SSE
        }).then(analysis => {
            console.log(`[Onboarding] Analysis complete for ${url}`);
        }).catch(error => {
            console.error(`[Onboarding] Learning error:`, error);
        });

    } catch (error: any) {
        console.error('[Onboarding API] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/onboarding/quick-scan - Quick website scan (faster)
 */
router.post('/quick-scan', async (req, res) => {
    try {
        const { url, userId } = req.body;

        if (!url || !userId) {
            return res.status(400).json({ error: 'url and userId required' });
        }

        const analysis = await websiteLearner.quickScan(url, userId);

        res.json({
            success: true,
            analysis
        });

    } catch (error: any) {
        console.error('[Onboarding API] Quick scan error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/onboarding/analysis/:userId - Get latest analysis
 */
router.get('/analysis/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const brand = await prisma.brand.findFirst({
            where: { userId },
            include: {
                analyses: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!brand || !brand.analyses[0]) {
            return res.status(404).json({ error: 'No analysis found' });
        }

        const analysis = JSON.parse(brand.analyses[0].analysis as string);

        res.json({
            success: true,
            brandId: brand.id,
            analysis,
            analyzedAt: brand.analyses[0].createdAt
        });

    } catch (error: any) {
        console.error('[Onboarding API] Get analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/onboarding/status/:userId - Check learning status
 */
router.get('/status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const brand = await prisma.brand.findFirst({
            where: { userId },
            include: {
                analyses: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!brand) {
            return res.json({
                status: 'not_started',
                hasAnalysis: false
            });
        }

        const hasAnalysis = brand.analyses.length > 0;

        res.json({
            status: hasAnalysis ? 'completed' : 'not_started',
            hasAnalysis,
            brandId: brand.id,
            analyzedAt: hasAnalysis ? brand.analyses[0].createdAt : null
        });

    } catch (error: any) {
        console.error('[Onboarding API] Status error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
