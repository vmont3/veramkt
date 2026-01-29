
import dotenv from 'dotenv';
import { AgencyOrchestrator } from '../services/agents/AgencyOrchestrator';

dotenv.config();

async function testChat() {
    console.log("🧪 Testing VERA AI Chat...");

    // Check if API Key is present
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY is missing in .env");
        process.exit(1);
    }
    console.log("✅ API Key found.");

    const orchestrator = new AgencyOrchestrator();
    const testMessage = "Olá Vera, qual o status da agência hoje?";

    try {
        console.log(`\n📤 Sending: "${testMessage}"`);
        const response = await orchestrator.handleUserChat("TestAdmin", testMessage);
        console.log(`\n📥 VERA Response:\n${response}`);
        console.log("\n✅ Test Passed!");
    } catch (error) {
        console.error("\n❌ Test Failed:", error);
    }
}

testChat();
