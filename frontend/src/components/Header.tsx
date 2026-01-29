import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "./Logo";

/**
 * Header - Navegação principal
 * Design: Minimalista com logo e CTA
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo className="w-auto" style={{ height: '25px' }} />
          </div>
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/funcionalidades"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Funcionalidades
            </Link>
            <Link
              to="/agentes"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Agentes
            </Link>
            <Link
              to="/precos"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Preços
            </Link>
            <Link
              to="/faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
              >
                Entrar
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header >
  );
}
