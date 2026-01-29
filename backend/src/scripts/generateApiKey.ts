/**
 * Generate API Key for User
 *
 * Usage:
 * ts-node src/scripts/generateApiKey.ts <userId>
 * or
 * npm run generate-api-key <userId>
 */

import { prisma } from '../database/prismaClient';
import crypto from 'crypto';

async function generateApiKey(userId: string) {
    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            console.error(`❌ User not found: ${userId}`);
            process.exit(1);
        }

        // Generate secure API key
        const apiKey = 'vk_' + crypto.randomBytes(32).toString('hex');

        // Update user with new API key
        await prisma.user.update({
            where: { id: userId },
            data: { apiKey }
        });

        console.log('✅ API Key generated successfully!');
        console.log('');
        console.log('═'.repeat(60));
        console.log('User:', user.email);
        console.log('API Key:', apiKey);
        console.log('═'.repeat(60));
        console.log('');
        console.log('Installation Instructions:');
        console.log('Add this script to your website <head>:');
        console.log('');
        console.log(`<script src="https://vera.ai/track.js" data-vera-key="${apiKey}"></script>`);
        console.log('');
        console.log('Or use the npm package:');
        console.log('npm install @vera/track');
        console.log('');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error generating API key:', error);
        process.exit(1);
    }
}

// Get userId from command line
const userId = process.argv[2];

if (!userId) {
    console.error('Usage: ts-node src/scripts/generateApiKey.ts <userId>');
    process.exit(1);
}

generateApiKey(userId);
