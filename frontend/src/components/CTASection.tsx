import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-12 lg:p-20 overflow-hidden text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12 shadow-[0_0_50px_rgba(59,130,246,0.1)]">

          {/* Background Patterns */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight font-sans tracking-tight">
              Pronto para demitir sua agência tradicional?
            </h2>
            <p className="text-gray-400 text-lg lg:text-xl mb-8 leading-relaxed font-sans font-light">
              Junte-se a +5.000 empresas que automatizaram seu crescimento com a VERA.
              Experimente grátis por 7 dias.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-white font-medium bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="font-sans">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2 text-white font-medium bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="font-sans">Cancela quando quiser</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-4 w-full sm:w-auto">
            <Link to="/signup" className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:pr-10 w-full sm:w-auto group">
              Testar Gratuitamente
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-gray-500 text-sm text-center font-sans">
              Acesso imediato ao Dashboard
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
