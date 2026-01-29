import Layout from '../components/Layout';

export default function PrivacidadePage() {
    return (
        <Layout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
                    <div className="prose prose-invert prose-lg text-gray-400">
                        <p>Última atualização: 13 de Janeiro de 2026</p>

                        <h3>1. Coleta de Dados</h3>
                        <p>Coletamos apenas os dados necessários para a operação dos agentes: credenciais de redes sociais (via API oficial), histórico de campanhas e interações no dashboard.</p>

                        <h3>2. Uso de Dados</h3>
                        <p>Seus dados são usados EXCLUSIVAMENTE para treinar os agentes no contexto da SUA marca. Não vendemos dados para terceiros e não usamos seus dados proprietários para treinar modelos base de concorrentes.</p>

                        <h3>3. Segurança</h3>
                        <p>Utilizamos criptografia AES-256 em repouso e TLS 1.3 em trânsito. Nossos servidores são auditados regularmente.</p>

                        <h3>4. Seus Direitos</h3>
                        <p>Você pode solicitar a exclusão total dos seus dados a qualquer momento através do painel de controle ou contato com o suporte.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
