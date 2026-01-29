import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Início', path: '/' },
        { name: 'Funcionalidades', path: '/funcionalidades' },
        { name: 'Agentes IA', path: '/agentes' },
        { name: 'Integrações', path: '/guia-integracoes' },
        { name: 'Preços', path: '/precos' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contato', path: '/contato' },
    ];

    return (
        <nav className="fixed w-full z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <Logo className="h-[25px] w-auto text-black group-hover:scale-105 transition-transform duration-300" />
                </Link>


                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-sm font-medium text-gray-500 hover:text-black transition-colors tracking-wide"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex items-center gap-4 ml-6 border-l border-gray-200 pl-6">
                        <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-gray-200 hover:shadow-xl">
                            Começar
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-base font-medium text-gray-600 hover:text-black py-2 border-b border-gray-50 last:border-0"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                        <Link
                            to="/login"
                            className="text-center font-semibold text-gray-700 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="text-center font-bold text-white py-3 bg-black rounded-lg hover:bg-gray-900 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Começar Agora
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
