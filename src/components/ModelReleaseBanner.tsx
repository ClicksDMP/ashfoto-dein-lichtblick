import { Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModelReleaseBannerProps {
  onBookClick: () => void;
}

const ModelReleaseBanner = ({ onBookClick }: ModelReleaseBannerProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-foreground/85" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative container mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
          {/* Left: Icon + Text */}
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 rotate-3">
              <Camera className="w-7 h-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary font-body font-semibold tracking-wider uppercase text-xs">
                  Exklusives Angebot
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-background leading-snug">
                Spare bis zu 99,99 € auf deine Shooting-Zeit!
              </h3>
              <p className="text-background/60 text-sm mt-2 max-w-lg leading-relaxed">
                Erlaube mir, deine Fotos für mein Portfolio und Social Media zu nutzen – und erhalte
                dafür deine erste Stunde Shooting-Zeit geschenkt. Fair, transparent und freiwillig.
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <Button
            variant="hero"
            size="xl"
            onClick={onBookClick}
            className="shrink-0 whitespace-nowrap"
          >
            Jetzt profitieren
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModelReleaseBanner;
