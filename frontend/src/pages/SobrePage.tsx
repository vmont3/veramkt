import Layout from '../components/Layout';
import { Target, Eye, Heart } from 'lucide-react';

export default function SobrePage() {
    return (
        <Layout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Sobre a <span className="text-blue-500">VERA</span></h1>
                        <p className="text-xl text-gray-400">
                            Não somos apenas uma plataforma de IA. Somos o fim do trabalho braçal no marketing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Missão */}
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors">
                            <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Missão</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Libertar criativos e estrategistas da escravidão operacional, permitindo que foquem 100% em inovação enquanto a IA executa o tático.
                            </p>
                        </div>

                        {/* Visão */}
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors">
                            <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                                <Eye className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Visão</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Ser o sistema operacional padrão de 1 milhão de empresas até 2030, tornando o conceito de "agência tradicional" obsoleto.
                            </p>
                        </div>

                        {/* Valores */}
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors">
                            <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                                <Heart className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Valores</h3>
                            <ul className="text-gray-400 space-y-2">
                                <li>• Autonomia Radical</li>
                                <li>• Velocidade é Segurança</li>
                                <li>• Dados &gt; Opinião</li>
                                <li>• Transparência Total</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
