import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../data/blogPosts';
import { ChevronLeft, ChevronRight, Brain, Clock, PlusCircle } from 'lucide-react';

export default function BlogCarouselSection() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % blogPosts.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
    };

    // Calculate visible posts for the "window"
    // We want to show 3 posts at a time on desktop.
    // Logic: get 3 items starting from currentIndex, wrapping around.
    const getVisiblePosts = () => {
        const posts = [];
        for (let i = 0; i < 3; i++) {
            posts.push(blogPosts[(currentIndex + i) % blogPosts.length]);
        }
        return posts;
    };

    const visiblePosts = getVisiblePosts();

    return (
        <section className="py-24 px-6 md:px-20 border-b border-gray-800/50 bg-[#0B0C10] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-2 block">Biblioteca de Inteligência</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Insights de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Agentic Marketing</span></h2>
                        <p className="text-gray-400 text-lg">
                            Artigos aprofundados para dominar a era da autonomia digital.
                            Conteúdo orgânico para educar o algoritmo e o mercado.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full border border-gray-700 bg-gray-900/50 text-white hover:bg-blue-600 hover:border-blue-500 transition-all hover:scale-110 active:scale-95"
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full border border-gray-700 bg-gray-900/50 text-white hover:bg-blue-600 hover:border-blue-500 transition-all hover:scale-110 active:scale-95"
                            aria-label="Próximo"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {visiblePosts.map((post, idx) => (
                                <motion.div
                                    key={`${post.id}-${idx}`}
                                    layout
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="group cursor-pointer h-full"
                                    onClick={() => navigate('/blog')}
                                >
                                    <div className="bg-[#15171E] border border-gray-800 rounded-2xl overflow-hidden h-full flex flex-col hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300">
                                        <div className="h-48 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#15171E] to-transparent z-10 opacity-60" />
                                            <img
                                                src={post.image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop'}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-blue-400 uppercase tracking-wider">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-mono">
                                                <Clock size={12} /> {post.readTime} leitura
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>

                                            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            <div className="mt-auto pt-4 border-t border-gray-800 flex items-center text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                                Ler artigo completo <PlusCircle size={16} className="ml-2 text-blue-500 group-hover:rotate-90 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => navigate('/blog')}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white border-b border-transparent hover:border-blue-500 pb-1 transition-all"
                    >
                        Ver todos os artigos na Central de Conhecimento <Brain size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
