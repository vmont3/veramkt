import Layout from '../components/Layout';

export default function TermosPage() {
    return (
        <Layout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
                    <div className="prose prose-invert prose-lg text-gray-400">
                        <p>Última atualização: 13 de Janeiro de 2026</p>

                        <h3>1. Aceitação</h3>
                        <p>Ao acessar e usar a plataforma VERA, você concorda cumbrir estes termos. Se você não concorda, não use nossos serviços.</p>

                        <h3>2. Serviços de Automação</h3>
                        <p>A VERA fornece agentes de IA para marketing. Embora nos esforcemos pela precisão, a IA pode cometer erros. Você é responsável por revisar o conteúdo antes da publicação final (embora nosso sistema de fallback minimize riscos).</p>

                        <h3>3. Pagamentos e Assinaturas</h3>
                        <p>Os serviços são cobrados mensalmente ou anualmente. Cancelamentos devem ser feitos antes da renovação automática.</p>

                        <h3>4. Propriedade Intelectual</h3>
                        <p>Todo o conteúdo gerado pela VERA para sua marca pertence a você. A tecnologia subjacente (código, agentes, modelos) pertence à VERA Marketing Ltd.</p>

                        {/* More legalese placeholder */}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
