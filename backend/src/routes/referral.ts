import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { ReferralService } from '../services/ReferralService';

const router = express.Router();

// Get my referral code and link
router.get('/my-code', authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { prisma } = await import('../database/prismaClient');
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { referralCode: true }
        });

        if (!user || !user.referralCode) {
            return res.status(404).json({ error: 'Referral code not found' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const referralLink = `${frontendUrl}/signup?ref=${user.referralCode}`;

        res.json({
            referralCode: user.referralCode,
            referralLink
        });
    } catch (error) {
        console.error('Error fetching referral code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get referral statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const stats = await ReferralService.getReferralStats(userId);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching referral stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
