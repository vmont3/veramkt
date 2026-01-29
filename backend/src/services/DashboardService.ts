
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
    /**
     * Get Overview Metrics for a specific User
     */
    static async getOverviewMetrics(userId: string) {
        // 1. Get User's Brands to filter related data
        const brands = await prisma.brand.findMany({
            where: { userId },
            select: { id: true }
        });
        const brandIds = brands.map(b => b.id);

        // 2. Calculate Revenue/ROAS (Mock logic for now as Campaign model might not be fully linked yet)
        // In a real scenario, we'd sum 'roas' or 'revenue' from Campaigns linked to these brands.
        // For now, let's look at satisfied interactions or simulate based on completed tasks.

        // Let's try to get real Campaign data if it exists, otherwise 0
        // Campaign model in schema doesn't seemingly have brandId/userId. 
        // Assuming for MVP it might be global or missing relation. 
        // We will return 0 for safe "real" data if no link found.

        // 3. Count Leads (Assuming Leads are global or we need to filter by something if available)
        // Schema shows Lead has no relation to User/Brand. 
        // We'll count ALL leads for now (if single tenant) or 0.
        // TODO: Add relation to Lead model.
        const leadsCount = await prisma.lead.count();

        // 4. Posts Created (Completed Tasks of type 'design' or 'copy' or 'publish')
        const postsCreated = await prisma.taskQueue.count({
            where: {
                plan: {
                    brandId: { in: brandIds }
                },
                status: 'completed',
                taskType: { in: ['design', 'copy', 'publish'] }
            }
        });

        // 5. Media Balance (User Credits)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });

        // 6. System Status (Agent Performance Health)
        const agentHealth = await prisma.agentPerformance.findMany({
            take: 3,
            orderBy: { healthScore: 'desc' },
            select: { agentId: true, healthScore: true } // Maps to status
        });

        // 7. Recent Activity / Performance Chart (Mocking a curve based on recent tasks)
        // We can aggregate completed tasks by month for the chart.

        return {
            roas: 0, // Placeholder until Campaign linked
            leads: leadsCount,
            postsCreated,
            mediaBalance: user?.credits || 0,
            recentGrowth: {
                roas: 0,
                leads: 0,
                posts: 0
            },
            systemStatus: agentHealth.map(a => ({
                name: a.agentId,
                status: a.healthScore > 80 ? 'Online' : 'Warning',
                health: a.healthScore
            }))
        };
    }

    /**
     * Get Analytics Page Data
     */
    static async getAnalyticsMetrics(userId: string) {
        // Real data fetch - defaulting to 0/empty if no data exists
        return {
            kpi: {
                reach: 0,
                engagement: 0,
                leads: await prisma.lead.count(),
                roas: 0
            },
            funnel: [
                { stage: "Impressões", count: 0, pc: "0%", color: "bg-blue-900" },
                { stage: "Cliques", count: 0, pc: "0%", color: "bg-blue-800" },
                { stage: "Leads", count: await prisma.lead.count(), pc: "0%", color: "bg-blue-600" },
                { stage: "Vendas", count: 0, pc: "0%", color: "bg-green-500" },
            ],
            platforms: [], // No platform data yet
            ads: [], // No ad intelligence data yet
            alerts: [] // No brand sentinel alerts yet
        };
    }

    /**
     * Get Finance Page Data
     */
    static async getFinanceMetrics(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                credits: true,
                adBudget: true
            }
        });

        const transactions = await prisma.creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return {
            balance: user?.adBudget || 0, // Now using real Ad Budget
            credits: user?.credits || 0,  // Separate credit balance if needed frontend side
            transactions: transactions.map(t => ({
                id: t.id,
                type: t.amount > 0 ? 'credit' : 'debit',
                desc: t.description,
                date: t.createdAt, // Frontend will format
                amount: t.amount,
                status: 'completed'
            }))
        };
    }

    /**
     * Get Content Page Data
     */
    static async getContentMetrics(userId: string) {
        // Fetch tasks that represent content creation
        // We link tasks -> plans -> brand -> user
        const tasks = await prisma.taskQueue.findMany({
            where: {
                plan: {
                    userId: userId
                },
                taskType: { in: ['copy', 'design', 'publish'] } // Assuming these are content tasks
            },
            orderBy: { createdAt: 'desc' },
            include: {
                plan: true
            }
        });

        return tasks.map(t => ({
            id: t.id,
            title: (t.data as any)?.topic || t.taskType, // Try to find a title or fallback
            type: (t.data as any)?.platform || 'General',
            status: t.status === 'completed' ? 'approved' : t.status === 'failed' ? 'rejected' : 'pending',
            date: t.createdAt,
            preview: (t.result as any)?.imageUrl || null, // If result has image
            text: (t.result as any)?.content || (t.data as any)?.description || 'No content yet',
            archived: false
        }));
    }

    /**
     * Create Content Task
     */
    static async createContentTask(userId: string, title: string, type: string, description: string) {
        // Find user's plan to link
        // We'll try to find a plan or use a default if possible (logic simplified)
        const plan = await prisma.contentPlan.findFirst({ where: { userId } });

        // For now, if no plan flows, we might fail or need a fallback.
        // Let's assume user has a plan or we create a dummy one if totally empty?
        // Actually, let's just create one if missing for robustness in demo.
        let planId = plan?.id;

        if (!planId) {
            // Create a default plan on fly? Or just throw?
            // Throwing might break the flow for new users without setup.
            // Let's create a Default Plan if none.
            const brand = await prisma.brand.findFirst({ where: { userId } });
            if (brand) {
                const newPlan = await prisma.contentPlan.create({
                    data: {
                        userId,
                        brandId: brand.id,
                        status: 'active',
                        period: new Date().toISOString().slice(0, 7),
                        platforms: '[]',
                        contentCount: 0,
                        themes: '[]'
                    }
                });
                planId = newPlan.id;
            } else {
                throw new Error("User has no Brand or Plan configured.");
            }
        }

        const task = await prisma.taskQueue.create({
            data: {
                taskType: 'CONTENT_CREATION',
                status: 'pending',
                data: JSON.stringify({ topic: title, platform: type, description }),
                planId: planId,
                agentId: 'vera',
                priority: "high"
            }
        });

        return task;
    }

    /**
     * Get Live Operations Data
     */
    static async getLiveMetrics(userId: string) {
        // 1. Get User's Brand for Config
        const brand = await prisma.brand.findFirst({ where: { userId } });
        const liveOpsConfig = brand?.liveOpsConfig ? JSON.parse(brand.liveOpsConfig) : {
            stealthMode: false,
            freezeBudget: false,
            turboCopy: false
        };

        // 2. Fetch recent logs from various sources
        // Tasks (Agency)
        const tasks = await prisma.taskQueue.findMany({
            take: 6,
            orderBy: { createdAt: 'desc' },
            where: { plan: { userId } }
        });

        // Alerts (Sentinel)
        const alerts = await prisma.brandAlert.findMany({
            take: 6,
            orderBy: { detectedAt: 'desc' }
        });

        // Combine and format as logs
        const logs = [
            ...tasks.map(t => ({
                id: `task-${t.id}`,
                timestamp: t.createdAt,
                msg: `[${t.agentId?.toUpperCase() || 'AGENT'}] ${t.taskType}: ${t.status}`,
                type: t.status === 'completed' ? 'success' : t.status === 'failed' ? 'error' : 'info',
                source: t.agentId || 'VERA',
                agentId: t.agentId // Explicit agent ID for frontend
            })),
            ...alerts.map(a => ({
                id: `alert-${a.id}`,
                timestamp: a.detectedAt,
                msg: `[SENTINEL] ${a.type}: ${a.description}`,
                type: 'warning',
                source: 'market-monitor',
                agentId: 'market-monitor'
            }))
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 15);

        // 3. Stats (Real Data)
        const adsCount = await prisma.adIntelligence.count(); // Total ads scanned
        const threatsBlocked = await prisma.brandAlert.count(); // Total alerts = blocked threats

        // Calculate "Budget Saved" (Mock heuristic: $50 per threat blocked + real saved spend if we had it)
        const budgetSaved = threatsBlocked * 150;

        const activeAgents = await prisma.agentConfig.count({ where: { userId, isEnabled: true } });

        return {
            config: liveOpsConfig,
            logs: logs.map(l => ({
                ...l,
                timestamp: l.timestamp.toLocaleTimeString()
            })),
            stats: {
                adsScanned: adsCount,
                threatsBlocked: threatsBlocked,
                budgetSaved: 0, // Needs adoption of AdSpend entity to be real
                activeAgents: activeAgents // Real count from DB
            }
        };
    }

    /**
     * Update Live Ops Config (Countermeasures)
     */
    static async updateLiveOpsConfig(userId: string, config: any) {
        console.log(`[DashboardService] UPDATE Config Request for User ${userId}`, config);
        const brand = await prisma.brand.findFirst({ where: { userId } });
        if (!brand) {
            console.error(`[DashboardService] Brand NOT FOUND for User ${userId}`);
            throw new Error("Brand not found for user");
        }

        console.log(`[DashboardService] Found Brand ${brand.id}. Updating...`);
        // Merge with existing or overwrite? Let's overwrite for simplicity of switches
        // But better to merge if we have other keys.
        // For now, frontend sends full state.

        const updated = await prisma.brand.update({
            where: { id: brand.id },
            data: { liveOpsConfig: JSON.stringify(config) }
        });
        console.log(`[DashboardService] Update Success. New Config:`, updated.liveOpsConfig);

        return { success: true };
    }

    /**
     * Emergency Stop
     */
    static async emergencyStop(userId: string) {
        // Pauses all agents for this user (or globally if single tenant, assuming strict user scope for now)
        // Since AgentPerformance is by agentId (global?), we might be affecting everyone.
        // Assuming single tenant VERA install for now as per "HealthCheckController".

        await prisma.agentPerformance.updateMany({
            data: { healthScore: -1 } // Mark as paused
        });

        await prisma.taskQueue.updateMany({
            where: { status: 'in_progress' },
            data: { status: 'paused_emergency' }
        });

        return { success: true };
    }
}
