import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { blogPosts, BlogPost } from '../data/blogPosts';
import { ArrowLeft, Clock, Calendar, Share2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogPage() {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    // Scroll to top when opening a post or the page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedPost]);

    return (
        <Layout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-4">

                    <AnimatePresence mode="wait">
                        {!selectedPost ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="max-w-4xl mx-auto mb-16 text-center">
                                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                                        Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">VERA</span>
                                    </h1>
                                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                        Insights profundos sobre a revolução do <span className="text-blue-400">Agentic Marketing</span> e o futuro da autonomia digital.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {blogPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            onClick={() => setSelectedPost(post)}
                                            className={`bg-gray-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:bg-gray-900 transition-all group cursor-pointer flex flex-col ${post.highlight ? 'lg:col-span-2 lg:flex-row' : ''}`}
                                        >
                                            <div className={`overflow-hidden relative ${post.highlight ? 'lg:w-1/2 h-64 lg:h-auto' : 'h-52'}`}>
                                                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10" />
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className={`p-8 flex flex-col flex-1 ${post.highlight ? 'lg:w-1/2 justify-center' : ''}`}>
                                                <div className="flex gap-4 text-xs font-mono mb-4 uppercase tracking-wider">
                                                    <span className="text-blue-400">{post.category}</span>
                                                    <span className="text-gray-600">•</span>
                                                    <span className="text-gray-500">{post.readTime}</span>
                                                </div>
                                                <h3 className={`font-bold mb-4 group-hover:text-blue-400 transition-colors ${post.highlight ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center text-white font-bold text-sm group-hover:text-blue-400 transition-colors mt-auto">
                                                    Ler Artigo Completo <ChevronRight size={16} className="ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-4xl mx-auto relative"
                            >
                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="fixed top-24 left-4 md:left-10 lg:left-20 z-50 flex items-center gap-2 text-gray-400 hover:text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all hover:pl-2"
                                >
                                    <ArrowLeft size={18} /> Voltar
                                </button>

                                {/* Article Header */}
                                <div className="mb-12 text-center">
                                    <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                                        {selectedPost.category}
                                    </span>
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
                                        {selectedPost.title}
                                    </h1>
                                    <div className="flex items-center justify-center gap-8 text-sm text-gray-400 font-mono border-t border-b border-gray-800 py-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-blue-500" />
                                            {selectedPost.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-blue-500" />
                                            {selectedPost.readTime} leitura
                                        </div>
                                        {/* Share Button (Mock) */}
                                        <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                            <Share2 size={16} />
                                            Compartilhar
                                        </button>
                                    </div>
                                </div>

                                {/* Featured Image */}
                                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 border border-gray-800 shadow-2xl shadow-blue-900/10">
                                    <img
                                        src={selectedPost.image}
                                        alt={selectedPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <article
                                    className="prose prose-invert prose-lg max-w-none pt-2 pb-20 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h3:text-blue-400 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white prose-blockquote:border-blue-500 prose-blockquote:bg-blue-900/10 prose-blockquote:p-6 prose-blockquote:rounded-lg prose-img:rounded-xl"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                />

                                {/* Footer Navigation */}
                                <div className="border-t border-gray-800 pt-12 mt-12 flex justify-center">
                                    <button
                                        onClick={() => setSelectedPost(null)}
                                        className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
                                    >
                                        Ler Outros Artigos
                                    </button>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </Layout>
    );
}
