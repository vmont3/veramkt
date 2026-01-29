import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AgentService {
    /**
     * Get all agent configurations for a user
     */
    static async getConfigs(userId: string) {
        // Fetch all configs for this user
        const configs = await prisma.agentConfig.findMany({
            where: { userId }
        });

        // Convert to map for easier frontend consumption
        const configMap: Record<string, { isEnabled: boolean, prompt: string }> = {};
        configs.forEach(c => {
            configMap[c.agentId] = { isEnabled: c.isEnabled, prompt: c.prompt || '' };
        });
        return configMap;
    }

    /**
     * Update configuration for a specific agent
     */
    static async updateConfig(userId: string, agentId: string, isEnabled: boolean, prompt?: string) {
        return await prisma.agentConfig.upsert({
            where: {
                userId_agentId: { userId, agentId }
            },
            update: { isEnabled, prompt },
            create: { userId, agentId, isEnabled, prompt }
        });
    }

    /**
     * Update VERA's global prompt
     */
    static async updateVeraPrompt(userId: string, prompt: string) {
        // Special case for VERA (or treat as agentId="vera")
        return await this.updateConfig(userId, 'vera', true, prompt);
    }
}
