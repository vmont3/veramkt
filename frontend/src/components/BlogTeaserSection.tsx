import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const articles = [
    {
        category: "Futuro do Trabalho",
        title: "Por que sua Agência Tradicional vai falir até 2027",
        excerpt: "O modelo de cobrar por hora-humana está morto. Entenda a economia da agência autônoma.",
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        category: "Tecnologia",
        title: "O Fim do 'Prompt Engineering'",
        excerpt: "Você não deveria ter que aprender a falar com máquinas. Elas que devem aprender a falar com você.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"
    },
    {
        category: "Estratégia",
        title: "Dopamina Digital: Como viciamos a IA no seu sucesso",
        excerpt: "A ciência por trás do nosso algoritmo de Aprendizado por Reforço que imita o cérebro humano.",
        image: "https://images.unsplash.com/photo-1555435024-2c4d456b73a2?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function BlogTeaserSection() {
    return (
        <section className="py-24 bg-black border-t border-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Insights <span className="text-gray-500">Agênticos</span></h2>
                        <p className="text-gray-400">O que estamos aprendendo enquanto construímos o futuro.</p>
                    </div>
                    <button className="hidden md:block text-white border-b border-white pb-1 hover:text-blue-400 hover:border-blue-400 transition-colors">
                        Ver todos os artigos
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="relative h-64 mb-6 overflow-hidden rounded-xl">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </div>

                            <div className="space-y-3">
                                <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">
                                    {article.category}
                                </span>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {article.excerpt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button className="text-white border-b border-white pb-1">
                        Ver todos os artigos
                    </button>
                </div>
            </div>
        </section>
    );
}
