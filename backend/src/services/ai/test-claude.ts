/**
 * TESTE DE INTEGRAÇÃO - CLAUDE API
 * Para verificar se a API está funcionando corretamente
 */

import dotenv from 'dotenv';
dotenv.config();

import { claudeService } from './ClaudeService';

async function testClaude() {
    console.log('🧪 TESTANDO CLAUDE API...\n');

    try {
        // 1. Test connection
        console.log('1️⃣ Testando conexão básica...');
        const isConnected = await claudeService.testConnection();

        if (!isConnected) {
            throw new Error('Falha na conexão com Claude');
        }

        // 2. Gerar copy humanizado
        console.log('\n2️⃣ Gerando copy de teste...');

        const response = await claudeService.generate({
            prompt: `Crie um post curto para Instagram (max 100 caracteres) sobre marketing AI.

IMPORTANTE:
- Tom informal brasileiro
- NÃO use frases clichê como "no cenário atual", "é importante ressaltar"
- Seja específico, não genérico
- Adicione 1 emoji relevante`,
            maxTokens: 150,
            temperature: 0.8
        });

        console.log('\n📝 COPY GERADO:');
        console.log(response.content);
        console.log('\n📊 USAGE:');
        console.log(`- Input tokens: ${response.usage.inputTokens}`);
        console.log(`- Output tokens: ${response.usage.outputTokens}`);
        console.log(`- Custo estimado: $${claudeService.calculateCost(response.usage.inputTokens, response.usage.outputTokens).toFixed(4)}`);

        // 3. Gerar copy com anti-clichês
        console.log('\n3️⃣ Gerando copy com regras anti-clichês...');

        const response2 = await claudeService.generate({
            systemPrompt: `Você é um copywriter profissional brasileiro.

REGRAS ANTI-CLICHÊS:
- NUNCA use: "no cenário atual", "é importante ressaltar", "vale destacar"
- SEMPRE seja específico (números, exemplos reais)
- Use tom conversacional, como amigo falando
- Varie tamanho de frases
- Evite listas de exatamente 3 itens`,
            prompt: 'Crie um post LinkedIn sobre automação de marketing (200 caracteres max)',
            maxTokens: 200
        });

        console.log('\n📝 COPY ANTI-CLICHÊ:');
        console.log(response2.content);

        console.log('\n✅ TODOS OS TESTES PASSARAM!');

    } catch (error: any) {
        console.error('\n❌ ERRO NO TESTE:', error.message);
        process.exit(1);
    }
}

// Executar teste
testClaude();
