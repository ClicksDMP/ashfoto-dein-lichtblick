import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import SignUpDialog from "@/components/SignUpDialog";

interface HeaderProps {
  onBookClick?: () => void;
}

const Header = ({ onBookClick }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleNavClick = useCallback(
    (id: string) => {
      setMobileOpen(false);
      if (!isHome) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [isHome]
  );

  const show = scrolled || !isHome;

  const navLinks = [
    { label: "Über mich", id: "about" },
    { label: "So läuft's ab", id: "process" },
    { label: "Buchen", id: "booking" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/85 backdrop-blur-md border-b border-border shadow-soft"
            : "bg-transparent"
        }`}
      >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="font-display text-xl font-bold text-foreground">
                ashfoto
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-8">
                {isHome &&
                  navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Button size="sm" onClick={() => setSignUpOpen(true)}>
                  Konto erstellen
                </Button>
              </nav>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden text-foreground p-2"
                aria-label="Menü öffnen"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden overflow-hidden bg-background border-t border-border"
                >
                  <div className="flex flex-col gap-4 px-6 py-6">
                    {isHome &&
                      navLinks.map((link) => (
                        <button
                          key={link.id}
                          onClick={() => handleNavClick(link.id)}
                          className="text-left text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </button>
                      ))}
                    <Link
                      to="/login"
                      className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Login
                    </Link>
                    <Button size="sm" className="w-full" onClick={() => { setMobileOpen(false); setSignUpOpen(true); }}>
                      Konto erstellen
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
      </header>

      <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
    </>
  );
};

export default Header;
