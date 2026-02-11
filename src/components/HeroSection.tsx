import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import SignUpDialog from "@/components/SignUpDialog";

interface HeroSectionProps {
  onBookClick: () => void;
  onConsultClick: () => void;
}

const HeroSection = ({ onBookClick, onConsultClick }: HeroSectionProps) => {
  const [signUpOpen, setSignUpOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Professionelles Fotoshooting im goldenen Licht"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-white/90 via-warm-ivory/75 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 py-24">
        <div className="max-w-2xl">
          {/* Brand */}
          <p className="text-primary font-body font-semibold tracking-[0.3em] uppercase text-sm mb-6 animate-fade-in">
            ashfoto
          </p>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up">
            Dein professionelles Fotoshooting, direkt bei dir
          </h1>

          {/* Subtext */}
          <div className="space-y-2 text-muted-foreground text-lg md:text-xl mb-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <p>Mobile Fotoshootings bei dir vor Ort</p>
            <p>Professionelles Licht und hochwertiges Equipment</p>
            <p>Private und Business Shootings</p>
            <p>Einfach buchen und Termin sichern</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" onClick={onBookClick}>
              Jetzt Termin buchen
            </Button>
            <Button variant="heroOutline" size="xl" onClick={onConsultClick}>
              Kostenlose Beratung anfragen
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => setSignUpOpen(true)}>
              Konto erstellen
            </Button>
          </div>
        </div>
      </div>

      <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
    </section>
  );
};

export default HeroSection;
