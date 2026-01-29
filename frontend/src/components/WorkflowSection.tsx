import { Link2, Sparkles, Bot, CheckCircle2 } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      icon: Link2,
      title: "1. Conecte",
      description: "Vincule suas contas de redes sociais e site em poucos cliques. Seguro e criptografado."
    },
    {
      icon: Sparkles,
      title: "2. Personalize",
      description: "Defina sua voz de marca, cores e objetivos. A VERA absorve sua identidade instantaneamente."
    },
    {
      icon: Bot,
      title: "3. Automatize",
      description: "Os agentes começam a criar, agendar e interagir. Você vê o plano de conteúdo preenchido magicamente."
    },
    {
      icon: CheckCircle2,
      title: "4. Aprove",
      description: "Revise o trabalho da IA ou ative o 'Modo Autônomo' para publicação direta sem intervenção humana."
    }
  ];

  return (
    <section id="funciona" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gray-200/50 blur-[100px] -translate-y-1/2 pointer-events-none opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6 font-sans tracking-tight">
            De 0 a Automação em <span className="text-gray-500">Minutos</span>
          </h2>
          <p className="text-gray-600 text-lg font-light font-sans">
            Esqueça onboarding complexo. VERA foi desenhada para ser Plug & Play.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[2.5rem] left-[10%] right-[10%] h-px bg-gray-300 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-6 shadow-sm group-hover:border-black group-hover:shadow-md transition-all duration-300">
                  <Icon className="w-8 h-8 text-black transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-black mb-3 font-sans">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-[240px] font-sans">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
