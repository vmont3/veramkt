import express from 'express';
import { prisma } from '../database/prismaClient';
import { agencyOrchestrator } from '../services/agents/AgencyOrchestrator';

const router = express.Router();

// Get all plans for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId as string; // in real app, get from auth token
        if (!userId) return res.status(400).json({ error: 'UserId required' });

        const plans = await prisma.contentPlan.findMany({
            where: { userId }
        });

        // Parse JSON fields
        const parsedPlans = plans.map(p => ({
            ...p,
            platforms: JSON.parse(p.platforms as string),
            themes: JSON.parse(p.themes as string)
        }));

        res.json(parsedPlans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
});

// Get all tasks for a user's plans (simulating content items)
router.get('/tasks', async (req, res) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) return res.status(400).json({ error: 'UserId required' });

        const plans = await prisma.contentPlan.findMany({
            where: { userId },
            select: { id: true }
        });

        const planIds = plans.map(p => p.id);

        const tasks = await prisma.taskQueue.findMany({
            where: {
                planId: { in: planIds },
                // Filter for "creative" tasks usually implies content
                taskType: { in: ['design', 'copy', 'publish'] }
            },
            include: { plan: true },
            orderBy: { createdAt: 'desc' }
        });

        const parsedTasks = tasks.map(t => ({
            ...t,
            data: JSON.parse(t.data as string),
            result: t.result ? JSON.parse(t.result as string) : null
        }));

        res.json(parsedTasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a new plan
router.post('/', async (req, res) => {
    try {
        const { userId, name, objective, platforms, themes } = req.body;

        // 1. Ensure User has a Brand (Create default if needed)
        let brand = await prisma.brand.findFirst({ where: { userId } });
        if (!brand) {
            brand = await prisma.brand.create({
                data: {
                    userId,
                    name: `Marca de ${userId.substring(0, 5)}...`
                }
            });
        }

        // 2. Prepare Plan Data for Orchestrator
        // We simulate some fields that might be missing from frontend
        const planData: any = {
            userId,
            brandId: brand.id,
            period: 'monthly',
            platforms: platforms || ['instagram', 'linkedin'],
            contentCount: 12, // Default
            themes: themes || ['Educacional', 'Vendas', 'Inspiração'],
            status: 'draft',
            createdAt: new Date()
        };

        // 3. Call Orchestrator
        const createdPlan = await agencyOrchestrator.createContentPlan(planData);

        res.status(201).json(createdPlan);

    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ error: 'Failed to create plan' });
    }
});

export default router;
