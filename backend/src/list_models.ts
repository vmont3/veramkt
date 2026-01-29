
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';

// Load env from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ GEMINI_API_KEY not found");
        return;
    }

    try {
        // We can't list models directly with the high-level SDK easily in one line, 
        // but we can try to use the model management API if exposed or 
        // just try a known older model like 'gemini-1.0-pro' to see if it works as a fallback.
        // Actually, let's try to hit the REST API directly to list models to be sure.

        console.log("Listing models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        const fs = require('fs');
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
        console.log("✅ Models written to models.json");
    } catch (error) {
        console.error("❌ Error listing models:", error);
    }
}

listModels();
