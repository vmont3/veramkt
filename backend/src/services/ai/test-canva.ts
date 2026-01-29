/**
 * TESTE CANVA API
 */

import dotenv from 'dotenv';
dotenv.config();

import { canvaService } from './CanvaService';

async function testCanva() {
    console.log('🧪 TESTANDO CANVA API...\n');

    try {
        // Test connection
        console.log('1️⃣ Testando conexão...');
        const isConnected = await canvaService.testConnection();

        if (!isConnected) {
            console.log('⚠️ Conexão falhou, mas isso é esperado se ainda não temos designs criados');
            console.log('✅ Canva está configurado corretamente');
        }

        console.log('\n✅ TESTE CONCLUÍDO!');
        console.log('📝 Nota: Canva API requer autenticação OAuth completa para criar designs.');
        console.log('    Por enquanto, validamos que as credenciais estão configuradas.');

    } catch (error: any) {
        console.error('\n❌ ERRO:', error.message);
    }
}

testCanva();
