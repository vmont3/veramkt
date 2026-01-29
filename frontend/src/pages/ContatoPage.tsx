import { useState } from 'react';
import Layout from '../components/Layout';
import { Mail, MessageSquare, MapPin } from 'lucide-react';
import SupportChatModal from '../components/SupportChatModal';

export default function ContatoPage() {
    const [showChat, setShowChat] = useState(false);

    return (
        <Layout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Fale com a <span className="text-blue-500">Inteligência</span></h1>
                        <p className="text-xl text-gray-400">
                            A VERA está pronta para escalar sua operação. Escolha como quer iniciar.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Card Email */}
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Suporte & Vendas</h3>
                            <p className="text-gray-400 mb-6">Resposta em até 24h úteis.</p>
                            <a href="mailto:contato@vera.mkt" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                                contato@vera.mkt &rarr;
                            </a>
                        </div>

                        {/* Card Chat */}
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Chat em Tempo Real</h3>
                            <p className="text-gray-400 mb-6">Fale diretamente com nossa IA de triagem.</p>
                            <button onClick={() => setShowChat(true)} className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                                Iniciar Conversa &rarr;
                            </button>
                        </div>
                    </div>

                    <div className="mt-20 text-center border-t border-gray-900 pt-10">
                        <div className="inline-flex items-center gap-2 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>São Paulo, SP • Brasil (Operação 100% Remota)</span>
                        </div>
                    </div>
                </div>
            </div>
            <SupportChatModal isOpen={showChat} onClose={() => setShowChat(false)} />
        </Layout>
    );
}
