import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoVeraBlack from '../assets/logo_vera_black.png';
import logoVeraBlackRecreated from '../assets/logo_vera_black_recreated.png';


export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-0">
              <img src={logoVeraBlack} alt="VERA Mark" className="h-12 w-auto" />
              <img src={logoVeraBlackRecreated} alt="VERA" className="h-6 w-auto mt-1 -ml-2" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-sans">
              Potencializando o futuro dos negócios com inteligência autônoma. 23 Agentes trabalhando 24/7 pelo seu crescimento.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-white mb-6 font-sans">Produto</h4>
            <ul className="space-y-4">
              <li><Link to="/agentes" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Agentes IA</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Dashboard</Link></li>
              <li><Link to="/guia-integracoes" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Guia de Integrações</Link></li>
              <li><Link to="/precos" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Preços</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 font-sans">Empresa</h4>
            <ul className="space-y-4">
              <li><Link to="/sobre" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Sobre Nós</Link></li>
              <li><Link to="/sobre" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Carreiras</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Blog</Link></li>
              <li><Link to="/contato" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 font-sans">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Privacidade</Link></li>
              <li><Link to="/termos" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">Segurança</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-sans">
            © 2026 VERA Marketing. Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <span className="text-gray-300 text-xs uppercase tracking-widest font-bold font-mono">Powered by Artificial Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
