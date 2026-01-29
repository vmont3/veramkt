
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { DashboardService } from '../services/DashboardService';
import { strategyAgent } from '../services/agents/StrategyAgent';
import { veraOrchestrator } from '../services/agents/VeraOrchestrator';

const router = Router();

router.get('/overview', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'User ID required' });

        const metrics = await DashboardService.getOverviewMetrics(userId);
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/analytics', authenticateToken, async (req: any, res) => {
    try {
        const metrics = await DashboardService.getAnalyticsMetrics(req.user.id);
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/finance', authenticateToken, async (req: any, res) => {
    try {
        const metrics = await DashboardService.getFinanceMetrics(req.user.id);
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching finance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/content', authenticateToken, async (req: any, res) => {
    try {
        const metrics = await DashboardService.getContentMetrics(req.user.id);
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/content', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { title, type, description, files } = req.body; // Added files support

        // Route through VERA Brain (V2 Orchestration)
        const result = await veraOrchestrator.processRequest({
            requestId: `dash_${Date.now()}`,
            type: 'CONTENT',
            payload: {
                userId,
                title,
                platform: type, // Map 'type' to 'platform'
                description,
                format: 'post' // Default format
            },
            files: files || []
        });

        res.json(result);
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({ error: 'Failed to create content task via VERA Core' });
    }
});

router.get('/live', authenticateToken, async (req: any, res) => {
    try {
        const metrics = await DashboardService.getLiveMetrics(req.user.id);
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching live metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/live/config', authenticateToken, async (req: any, res) => {
    try {
        const { config } = req.body;
        if (!config) return res.status(400).json({ error: 'Config object required' });

        await DashboardService.updateLiveOpsConfig(req.user.id, config);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating live config:', error);
        res.status(500).json({ error: 'Failed to update config' });
    }
});

router.post('/live/emergency-stop', authenticateToken, async (req: any, res) => {
    try {
        await DashboardService.emergencyStop(req.user.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error executing emergency stop:', error);
        res.status(500).json({ error: 'Failed to stop operation' });
    }
});

// Proactive Engine: Get/Generate Opportunities
router.get('/live/opportunities', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'User ID required' });

        const result = await strategyAgent.runDailyPulse(userId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).json({ error: 'Failed to fetch opportunities' });
    }
});

// Execute Opportunity (Generate Content)
router.post('/live/opportunities/:id/execute', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const opportunityId = req.params.id;

        if (!userId) return res.status(401).json({ error: 'User ID required' });

        const result = await strategyAgent.executeOpportunity(userId, opportunityId);
        res.json(result);
    } catch (error) {
        console.error('Error executing opportunity:', error);
        res.status(500).json({ error: 'Failed to execute opportunity' });
    }
});


export default router;
