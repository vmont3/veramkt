import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { AgentService } from '../services/AgentService';
import { FeedbackService } from '../services/FeedbackService';

const router = express.Router();

// Get configurations
router.get('/config', authenticateToken, async (req: any, res) => {
    try {
        const configs = await AgentService.getConfigs(req.user.id);
        res.json(configs);
    } catch (error) {
        console.error('Error fetching agent configs:', error);
        res.status(500).json({ error: 'Failed to fetch agent configs' });
    }
});

// Update configurations (Single or Batch)
router.post('/config', authenticateToken, async (req: any, res) => {
    try {
        if (req.body.updates && Array.isArray(req.body.updates)) {
            // Handle batch
            for (const up of req.body.updates) {
                await AgentService.updateConfig(req.user.id, up.agentId, up.isEnabled, up.prompt);
            }
            res.json({ success: true, message: 'Batch update successful' });
        } else {
            // Handle single
            const { agentId, isEnabled, prompt } = req.body;
            if (!agentId) return res.status(400).json({ error: 'agentId is required' });

            await AgentService.updateConfig(req.user.id, agentId, isEnabled, prompt);
            res.json({ success: true });
        }
    } catch (error) {
        console.error('Error updating agent config:', error);
        res.status(500).json({ error: 'Failed to update agent config' });
    }
});

router.post('/reset', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { agentId } = req.body;
        console.log(`Resetting agent ${agentId} for user ${userId}`);
        res.json({ success: true, message: `Memória do agente ${agentId} reiniciada.` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset agent' });
    }
});

// Dopamine Feedback Loop - Train/Inject Signal
router.post('/feedback', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { agentId, type, reason } = req.body;

        if (!agentId || !type || !reason) {
            return res.status(400).json({ error: 'agentId, type (dopamine/pain), and reason are required' });
        }

        const feedback = await FeedbackService.injectFeedback({
            agentId,
            userId,
            type: type as 'dopamine' | 'pain',
            reason,
            source: 'manual'
        });

        res.json({ success: true, feedback });
    } catch (error) {
        console.error('Error injecting feedback:', error);
        res.status(500).json({ error: 'Failed to inject feedback' });
    }
});

// Get Agent Health Scores
router.get('/health', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const healthMap = await FeedbackService.getAllAgentHealth(userId);
        res.json(healthMap);
    } catch (error) {
        console.error('Error fetching agent health:', error);
        res.status(500).json({ error: 'Failed to fetch agent health' });
    }
});

// Get Single Agent Health
router.get('/health/:agentId', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { agentId } = req.params;
        const health = await FeedbackService.getAgentHealth(agentId, userId);
        res.json(health);
    } catch (error) {
        console.error('Error fetching agent health:', error);
        res.status(500).json({ error: 'Failed to fetch agent health' });
    }
});

// Legacy train endpoint (redirects to feedback)
router.post('/train', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { agentId, signal } = req.body;

        const feedback = await FeedbackService.injectFeedback({
            agentId,
            userId,
            type: signal === 'dopamine' ? 'dopamine' : 'pain',
            reason: signal === 'dopamine' ? 'Reforço positivo do usuário' : 'Correção solicitada pelo usuário',
            source: 'manual'
        });

        res.json({ success: true, feedback, message: `Feedback registrado para ${agentId}.` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to train agent' });
    }
});

export default router;
