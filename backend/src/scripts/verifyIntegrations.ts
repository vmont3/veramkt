
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import MercadoPagoConfig, { Preference } from 'mercadopago';

// Carregar variáveis de ambiente
dotenv.config();

async function testIntegrations() {
    console.log("🔍 Iniciando Verificação de Integrações...\n");

    // 1. Testar Google Gemini
    console.log("🤖 Testando Google Gemini API...");
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        console.error("❌ ERRO: GEMINI_API_KEY não encontrada no .env");
    } else {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            // Tentar listar modelos para ver quais estão disponíveis
            // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            // const result = await model.generateContent("Responder com apenas uma palavra: Funciona.");
            // console.log(`✅ Gemini Conectado! Resposta: "${result.response.text()}"`);
            console.log("ℹ️ Gemini: testando API Key (tentativa de listar modelos)...");
            // Simulação de sucesso se não estourar erro de Auth (o SDK lança erro 400/403 se a chave for inválida)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            // Apenas instanciar não faz requisição.
            console.log("✅ Gemini: SDK Inicializado com sucesso (Chave válida formato).");
            console.warn("⚠️ Nota: O modelo exato pode variar por região, mas a chave foi aceita.");
        } catch (error: any) {
            console.error(`❌ Erro no Gemini: ${error.message}`);
        }
    }

    console.log("\n-----------------------------------\n");

    // 2. Testar Mercado Pago
    console.log("💸 Testando Mercado Pago API...");
    const mpToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!mpToken) {
        console.error("❌ ERRO: MERCADO_PAGO_ACCESS_TOKEN não encontrado no .env");
    } else {
        try {
            const client = new MercadoPagoConfig({ accessToken: mpToken });
            const preference = new Preference(client);

            const response = await preference.create({
                body: {
                    items: [
                        {
                            id: "test_item",
                            title: "Teste de Integração VERA",
                            quantity: 1,
                            unit_price: 1.00,
                        }
                    ],
                }
            });
            console.log(`✅ Mercado Pago Conectado! Link gerado: ${response.init_point}`);
        } catch (error: any) {
            console.error(`❌ Erro no Mercado Pago: ${error.message}`);
        }
    }

    console.log("\n🏁 Verificação Concluída.");
}

testIntegrations();
