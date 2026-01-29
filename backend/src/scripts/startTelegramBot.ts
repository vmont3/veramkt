/**
 * Start Telegram Bot
 *
 * Usage:
 * ts-node src/scripts/startTelegramBot.ts
 */

import { telegramBotService } from '../services/telegram/TelegramBotService';

async function main() {
    console.log('🤖 Starting VERA Telegram Bot...');
    console.log('');

    try {
        await telegramBotService.start();

        console.log('✅ Bot is running!');
        console.log('');
        console.log('Users can now:');
        console.log('- Send /start to link their account');
        console.log('- Use /status to check system');
        console.log('- Use /leads to see hot leads');
        console.log('- Use /create to generate content');
        console.log('- Ask questions naturally');
        console.log('');
        console.log('Press Ctrl+C to stop');

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n\n⏹️  Stopping bot...');
            await telegramBotService.stop();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('\n\n⏹️  Stopping bot...');
            await telegramBotService.stop();
            process.exit(0);
        });

    } catch (error: any) {
        console.error('❌ Failed to start bot:', error.message);
        console.log('');
        console.log('Make sure you have:');
        console.log('1. Created a bot with @BotFather');
        console.log('2. Set TELEGRAM_BOT_TOKEN in .env');
        console.log('3. Installed dependencies: npm install node-telegram-bot-api');
        process.exit(1);
    }
}

main();
