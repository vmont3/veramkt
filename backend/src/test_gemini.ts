
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';

// Load env from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ GEMINI_API_KEY not found in .env");
        return;
    }
    console.log(`✅ GEMINI_API_KEY found: ${key.substring(0, 5)}...`);

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("Attempting to generate content...");
        const result = await model.generateContent("Hello, are you working?");
        console.log("Response:", result.response.text());
        console.log("✅ Gemini API is working!");
    } catch (error) {
        console.error("❌ Gemini API Error:", error);
    }
}

testGemini();
