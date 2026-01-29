import { PlayCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTelegramPlane, FaWhatsapp, FaTiktok, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';


import veraVideo from '../assets/vera.mp4';

import { LogoMarkWhite } from './Logo';

export default function HeroSection() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const getDuration = (base: number) => {
    if (hoveredIcon) return base * 5;
    if (isHovered) return base * 10;
    return base;
  };

  return (
    <section className="relative overflow-hidden h-screen flex flex-col items-center justify-center gap-12 py-0">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        src={veraVideo}
      />
      <div className="absolute inset-0 bg-black/50 z-0"></div> {/* Optional overlay to ensure text contrast */}

      <style>{`
        :root {
          /* Mobile Radii - Tighter packing */
          --orbit-radius-1: 125px;
          --orbit-radius-2: 175px;
          --orbit-radius-3: 225px;
          --orbit-radius-4: 275px;
          --orbit-radius-5: 325px;
        }
        @media (min-width: 768px) {
          :root {
            /* Desktop Radii - Much closer to center (Sun radius is ~160px) */
            --orbit-radius-1: 215px;
            --orbit-radius-2: 280px;
            --orbit-radius-3: 345px;
            --orbit-radius-4: 410px;
            --orbit-radius-5: 475px;
          }
        }

        .orbit-system {
          perspective: 1000px;
          transform-style: preserve-3d;
          pointer-events: none;
        }

        .orbit-plane {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* The Pivot: Spins the system around the center */
        .orbit-pivot {
          position: absolute;
          top: 0;
          left: 0;
          transform-style: preserve-3d;
          animation: orbit-rotate linear infinite;
        }

        /* The Translator: Moves the object out to the orbit radius */
        .orbit-translator {
          position: absolute;
          top: 0;
          left: 0;
          transform-style: preserve-3d;
          transform: translateY(calc(var(--orbit-radius) * -1));
        }

        /* The Counter-Pivot: Cancels the rotation */
        .orbit-counter {
          position: absolute;
          top: 0;
          left: 0;
          transform-style: preserve-3d;
          animation: orbit-rotate-reverse linear infinite;
        }

        /* Debug rings - optional, for visualization of "invisible lines" */
        /* .debug-ring {
        border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      position: absolute;
      transform-style: preserve-3d;
        } */

      /* 3D Spin of the planet itself */
      .planet-spin {
        transform - style: preserve-3d;
      animation: planet-spin linear infinite;
        }

      @keyframes orbit-rotate {
        from {transform: rotateZ(0deg); }
      to {transform: rotateZ(360deg); }
        }

      @keyframes orbit-rotate-reverse {
        from {transform: rotateZ(0deg); }
      to {transform: rotateZ(-360deg); }
        }

      @keyframes planet-spin {
        from {transform: rotateY(0deg); }
      to {transform: rotateY(360deg); }
        }
      .transform-3d {
        transform - style: preserve-3d;
        }
      `}</style>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 blur-3xl pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center overflow-visible orbit-system z-20">
        <div className="relative w-full h-full flex items-center justify-center transform-3d">

          {/* Sun */}
          <div
            className="w-[200px] h-[200px] md:w-[320px] md:h-[320px] flex items-center justify-center transition-all duration-700 cursor-pointer"
            style={{ transform: 'translateZ(0px)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 border border-gray-700/50 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden bg-black border-2 border-gray-800 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center z-20">
              <img src={LogoMarkWhite} alt="VERA Core" className="w-[90%] h-[90%] object-contain animate-spin-complex" />
            </div>
          </div>

          {/* Solar System */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center transform-3d">

            {/* ORBIT 1 (Radius 1) - Inner Shell - Horizontal-ish */}
            <PlanetaryOrbitFixed
              tiltX={70} tiltY={10} tiltZ={0}
              duration={20}
              radiusVar="--orbit-radius-1"
              Icon1={FaInstagram} Color1="#E1306C" Name1="Instagram"
              Icon2={FaFacebookF} Color2="#1877F2" Name2="Facebook"
              setHoveredIcon={setHoveredIcon}
            />

            {/* ORBIT 2 (Radius 2) - Second Shell - Vertical-ish (Opposite direction?) */}
            <PlanetaryOrbitFixed
              tiltX={10} tiltY={70} tiltZ={0}
              duration={25}
              radiusVar="--orbit-radius-2"
              Icon1={FaLinkedinIn} Color1="#0077B5" Name1="LinkedIn"
              Icon2={FaXTwitter} Color2="#fff" Name2="X"
              setHoveredIcon={setHoveredIcon}
            />

            {/* ORBIT 3 (Radius 3) - Third Shell - Diagonal 1 */}
            <PlanetaryOrbitFixed
              tiltX={45} tiltY={45} tiltZ={0}
              duration={30}
              radiusVar="--orbit-radius-3"
              Icon1={FaWhatsapp} Color1="#25D366" Name1="WhatsApp"
              Icon2={FaTelegramPlane} Color2="#0088cc" Name2="Telegram"
              setHoveredIcon={setHoveredIcon}
            />

            {/* ORBIT 4 (Radius 4) - Fourth Shell - Diagonal 2 */}
            <PlanetaryOrbitFixed
              tiltX={45} tiltY={-45} tiltZ={0}
              duration={35}
              radiusVar="--orbit-radius-4"
              Icon1={FaTiktok} Color1="#00f2ea" Name1="TikTok"
              Icon2={FaYoutube} Color2="#FF0000" Name2="YouTube"
              setHoveredIcon={setHoveredIcon}
            />

            {/* ORBIT 5 (Radius 5) - Outer Shell - Wide/Flat */}
            <PlanetaryOrbitFixed
              tiltX={80} tiltY={0} tiltZ={45}
              duration={40}
              radiusVar="--orbit-radius-5"
              Icon1={FcGoogle} Color1="#fff" Name1="Google"
              Icon2={FaEnvelope} Color2="#FFA500" Name2="Email"
              setHoveredIcon={setHoveredIcon}
            />

          </div>

        </div>

        {/* Title & CTA - Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between py-12 pointer-events-none md:pointer-events-auto z-30">
          <div className="w-full text-center mt-15">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-gray-200 via-gray-400 to-gray-300 tracking-tight leading-none drop-shadow-2xl uppercase">
              PRONTO PARA A <br className="hidden md:block" /> NOVA ERA DO MARKETING DIGITAL?
            </h1>
          </div>

          <div className="w-full px-8 flex flex-col md:flex-row items-end justify-between mb-10">
            <div className="w-full text-center absolute bottom-24 left-1/2 -translate-x-1/2 px-4 pointer-events-none">
              <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
                Prepare-se para conhecer um modelo de marketing descomplicado. <br /><span className="text-white font-medium">Tão simples quanto falar ao celular.</span>
              </p>
            </div>

            <button
              onClick={() => navigate('/signup')}
              className="absolute bottom-10 right-10 group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:scale-105 pointer-events-auto"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">Acesso Antecipado</span>
                <span className="text-sm font-bold text-white tracking-wider">TIRE A PROVA</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black border border-gray-600 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <ArrowRight size={16} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section >
  );
}

// Fixed Planet Body with Spin
function PlanetBody({ Icon, color, name, setHoveredIcon }: any) {
  return (
    <div className="planet-spin group w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-visible" style={{ animationDuration: '4s' }}>
      {/* Stronger visual presence */}
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0F172A] border-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center hover:scale-125 transition-transform duration-300 pointer-events-auto cursor-pointer"
        style={{ borderColor: color, boxShadow: `0 0 20px ${color}66` }}
        onMouseEnter={() => setHoveredIcon(name)}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: color }} />
      </div>
    </div>
  )
}

// Helper for responsive radius with dynamic props
function PlanetaryOrbitFixed({ tiltX, tiltY, tiltZ, duration, radiusVar, Icon1, Color1, Name1, Icon2, Color2, Name2, setHoveredIcon }: any) {
  const planeTransform = `translate(-50%, -50%) rotateZ(${tiltZ}deg) rotateY(${tiltY}deg) rotateX(${tiltX}deg)`;
  const counterTilt = `rotateX(${-tiltX}deg) rotateY(${-tiltY}deg) rotateZ(${-tiltZ}deg)`;

  // Simplified structure: Single Counter Div with CSS Variable for radius
  return (
    <div className="orbit-plane w-0 h-0" style={{ transform: planeTransform }}>
      {/* Planet 1 */}
      <div className="orbit-pivot" style={{ animationDuration: `${duration}s` }}>
        <div className="orbit-translator" style={{ '--orbit-radius': `var(${radiusVar})` } as any}>
          <div className="orbit-counter" style={{ animationDuration: `${duration}s` }}>
            <div style={{ transform: counterTilt }}>
              <PlanetBody Icon={Icon1} color={Color1} name={Name1} setHoveredIcon={setHoveredIcon} />
            </div>
          </div>
        </div>
      </div>
      {/* Planet 2 */}
      <div className="orbit-pivot" style={{ animationDuration: `${duration}s`, animationDelay: `-${duration / 2}s` }}>
        <div className="orbit-translator" style={{ '--orbit-radius': `var(${radiusVar})` } as any}>
          <div className="orbit-counter" style={{ animationDuration: `${duration}s`, animationDelay: `-${duration / 2}s` }}>
            <div style={{ transform: counterTilt }}>
              <PlanetBody Icon={Icon2} color={Color2} name={Name2} setHoveredIcon={setHoveredIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
