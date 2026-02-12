import { useState, useEffect, useCallback } from "react";
import { Camera, Sparkles, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivDeals } from "@/data/dealsData";
import { cn } from "@/lib/utils";

interface PromoBannerSliderProps {
  onBookClick: () => void;
  onDealSelect?: (dealId: string) => void;
}

const PromoBannerSlider = ({ onBookClick, onDealSelect }: PromoBannerSliderProps) => {
  const deals = getActivDeals();
  
  // Slides: Model Release banner + active deals
  const slides = [
    { type: "model-release" as const },
    ...deals.map(d => ({ type: "deal" as const, deal: d })),
  ];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused]);

  const formatPrice = (p: number) => p.toFixed(2).replace(".", ",") + " €";

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "transition-all duration-700 ease-in-out",
              i === current ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
            )}
          >
            {slide.type === "model-release" ? (
              /* Model Release Banner */
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-foreground/85" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                <div className="relative container mx-auto px-6 md:px-12 py-10 md:py-14">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
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
                    <Button variant="hero" size="xl" onClick={onBookClick} className="shrink-0 whitespace-nowrap">
                      Jetzt profitieren
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Deal Banner */
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-foreground/85" />
                <div className="absolute top-0 right-0 w-72 h-72 bg-destructive/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                <div className="relative container mx-auto px-6 md:px-12 py-10 md:py-14">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center shrink-0 -rotate-3">
                        <Heart className="w-7 h-7 text-destructive fill-destructive" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {slide.deal!.badge}
                          </span>
                          <span className="text-primary font-body font-semibold tracking-wider uppercase text-xs">
                            Limitiertes Angebot
                          </span>
                        </div>
                        <h3 className="font-display text-xl md:text-2xl font-bold text-background leading-snug">
                          {slide.deal!.title}
                        </h3>
                        <p className="text-background/70 text-sm mt-1 font-medium">
                          {slide.deal!.subtitle}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-background/40 line-through text-sm">{formatPrice(slide.deal!.originalPrice)}</span>
                          <span className="font-display text-2xl font-bold text-primary">{formatPrice(slide.deal!.fixedPrice)}</span>
                          <span className="text-background/50 text-xs">inkl. MwSt.</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="hero"
                      size="xl"
                      onClick={() => onDealSelect?.(slide.deal!.id)}
                      className="shrink-0 whitespace-nowrap"
                    >
                      Deal sichern
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background/70 hover:text-background hover:bg-background/30 transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background/70 hover:text-background hover:bg-background/30 transition-all z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === current ? "bg-primary w-6" : "bg-background/40 hover:bg-background/60"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default PromoBannerSlider;
