import logoHeader from '../assets/logo_header.png';
import logoFooter from '../assets/logo_footer.png';
import logoVeraBlack from '../assets/logo_vera_black.png';
import logoVeraBlackPiano from '../assets/logo_vera_black_piano.png';
import logoGlossy from '../assets/logo_vera_glossy_black_white_bg.png';
import logoVeraBlackRecreated from '../assets/logo_vera_black_recreated.png';

interface LogoProps {
    className?: string;
    variant?: 'header' | 'footer' | 'sidebar';
    style?: React.CSSProperties;
}

export const LogoMarkWhite = logoVeraBlack;
export const LogoMarkBlackPiano = logoVeraBlackPiano;

export default function Logo({ className = "h-8", variant = 'header', style }: LogoProps) {
    if (variant === 'sidebar' || variant === 'footer') {
        return (
            <div className={`flex items-center gap-2 ${className}`} style={style}>
                <img
                    src={logoVeraBlackPiano}
                    alt="VERA Mark"
                    className="h-full w-auto object-contain flex-shrink-0"
                />
                <img
                    src={logoVeraBlackRecreated}
                    alt="VERA"
                    className="h-[60%] w-auto object-contain"
                />
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-0 ${className}`} style={style}>
            <img
                src={logoVeraBlackPiano}
                alt="VERA Mark"
                className="h-full w-auto object-contain relative z-10"
            />
            <img
                src={logoGlossy}
                alt="VERA"
                className="h-[45%] w-auto object-contain -ml-2 relative z-0"
            />
        </div>
    );
}
