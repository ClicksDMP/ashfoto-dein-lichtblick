import { useState, useEffect, useCallback, useMemo } from "react";
import { Camera, Sparkles, Heart, Flame, ChevronLeft, ChevronRight, Clock, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivDeals, type Deal } from "@/data/dealsData";
import { cn } from "@/lib/utils";
import { useDealImage } from "@/hooks/useHomepageImages";

interface PromoBannerSliderProps {
  onBookClick: () => void;
  onDealSelect?: (dealId: string) => void;
}

const formatPrice = (p: number) => p.toFixed(2).replace(".", ",") + " €";

/* ── Model Release Card ── */
const ModelReleaseCard = ({ onBookClick }: { onBookClick: () => void }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card hover:shadow-elevated transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/8 blur-3xl" />
    <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-accent/8 blur-3xl" />

    <div className="relative p-6 md:p-8 flex flex-col h-full min-h-[320px] md:min-h-[340px]">
      {/* Tag */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary text-xs font-bold px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" />
          Exklusiv
        </span>
      </div>

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 rotate-3 group-hover:rotate-0 transition-transform duration-500">
        <Camera className="w-6 h-6 text-primary" />
      </div>

      {/* Content */}
      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-snug mb-2">
        Spare bis zu 99,99 €
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
        Erlaube mir, deine Fotos für mein Portfolio zu nutzen – und erhalte deine erste Stunde Shooting-Zeit geschenkt.
      </p>

      {/* Savings highlight */}
      <div className="flex items-center gap-3 mb-6">
        <span className="font-display text-3xl font-bold text-primary">99,99 €</span>
        <span className="text-xs text-muted-foreground">Ersparnis</span>
      </div>

      {/* CTA */}
      <Button
        variant="cta"
        size="lg"
        onClick={onBookClick}
        className="w-full group-hover:scale-[1.02] transition-transform"
      >
        Jetzt profitieren
      </Button>
    </div>
  </div>
);

/* ── Deal Card ── */
const DealCard = ({ deal, onSelect }: { deal: Deal; onSelect: () => void }) => {
  const isAkt = deal.service.toLowerCase().includes("akt");
  const dealImage = useDealImage(deal.id, "");

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card hover:shadow-elevated transition-all duration-500">
      {/* Background image hint or icon placeholder */}
      {dealImage ? (
        <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700">
          <img src={dealImage} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center">
          {isAkt ? <Flame className="w-48 h-48 text-destructive" /> : <Heart className="w-48 h-48 text-primary" />}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-card/95 via-card/90 to-card/80" />
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-destructive/5 blur-3xl" />

      <div className="relative p-6 md:p-8 flex flex-col h-full min-h-[320px] md:min-h-[340px]">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-destructive/10 text-destructive text-xs font-bold px-3 py-1 rounded-full">
            {deal.badge}
          </span>
          <span className="text-xs text-muted-foreground font-medium">Limitiert</span>
        </div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 -rotate-3 group-hover:rotate-0 transition-transform duration-500">
          {isAkt ? (
            <Flame className="w-6 h-6 text-destructive" />
          ) : (
            <Heart className="w-6 h-6 text-destructive fill-destructive" />
          )}
        </div>

        {/* Content */}
        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-snug mb-1">
          {deal.title}
        </h3>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {deal.durationLabel}
          </span>
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" />
            {deal.photoPackageLabel}
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
          {deal.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-muted-foreground/60 line-through text-sm">{formatPrice(deal.originalPrice)}</span>
          <span className="font-display text-3xl font-bold text-primary">{formatPrice(deal.fixedPrice)}</span>
          <span className="text-[10px] text-muted-foreground">inkl. MwSt.</span>
        </div>

        {/* CTA */}
        <Button
          variant="cta"
          size="lg"
          onClick={onSelect}
          className="w-full group-hover:scale-[1.02] transition-transform"
        >
          Deal sichern
        </Button>
      </div>
    </div>
  );
};

/* ── Main Slider ── */
const PromoBannerSlider = ({ onBookClick, onDealSelect }: PromoBannerSliderProps) => {
  const deals = getActivDeals();

  const slides = [
    { type: "model-release" as const },
    ...deals.map(d => ({ type: "deal" as const, deal: d })),
  ];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const visibleCount = windowWidth >= 1024 ? Math.min(slides.length, 3) : windowWidth >= 768 ? Math.min(slides.length, 2) : 1;

  const maxIndex = Math.max(0, slides.length - visibleCount);

  const next = useCallback(() => {
    setCurrent(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused, maxIndex]);




  return (
    <section
      className="py-8 md:py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Aktuelle Angebote
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Limitierte Deals – sichere dir jetzt deinen Vorteil
          </p>
        </div>

        {/* Cards container */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-4 md:gap-6"
              style={{
                transform: `translateX(-${current * (100 / visibleCount)}%)`,
              }}
            >
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className="shrink-0"
                  style={{ width: `calc(${100 / visibleCount}% - ${((visibleCount - 1) * (visibleCount <= 1 ? 0 : 16)) / visibleCount}px)` }}
                >
                  {slide.type === "model-release" ? (
                    <ModelReleaseCard onBookClick={onBookClick} />
                  ) : (
                    <DealCard deal={slide.deal!} onSelect={() => onDealSelect?.(slide.deal!.id)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Nav arrows */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-elevated transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-elevated transition-all z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoBannerSlider;
