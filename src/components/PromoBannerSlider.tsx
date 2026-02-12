import { useRef } from "react";
import { Camera, Sparkles, Heart, Flame, Clock, Image as ImageIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getActivDeals, type Deal } from "@/data/dealsData";

interface PromoBannerSliderProps {
  onBookClick: () => void;
  onDealSelect?: (dealId: string) => void;
}

const formatPrice = (p: number) => p.toFixed(2).replace(".", ",") + " €";

/* ── Direction configs (same as gallery) ──────────────────── */
const slideDirections = [
  { x: "-100%", y: "0%" },
  { x: "100%",  y: "0%" },
  { x: "0%",    y: "-100%" },
  { x: "0%",    y: "100%" },
];

/* ── Full-screen reveal card for Model Release ────────────── */
const ModelReleaseReveal = ({ index, onBookClick }: { index: number; onBookClick: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const dir = slideDirections[index % slideDirections.length];

  const x = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [dir.x, "0%", "0%", "0%"]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [dir.y, "0%", "0%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.92, 1, 1, 0.97]);

  return (
    <div ref={ref} className="h-screen w-full flex items-center justify-center sticky top-0 overflow-hidden">
      <motion.div style={{ x, y, opacity, scale }} className="relative w-full h-full">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-dark via-warm-brown/80 to-warm-dark" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.15, 0.3, 0.7, 0.85], [0, 1, 1, 0]) }}
            className="max-w-lg"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-warm-white/15 text-warm-white text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                Exklusiv
              </span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-warm-white/10 flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
              <Camera className="w-8 h-8 text-warm-white" />
            </div>

            <h3 className="font-display text-3xl md:text-5xl font-bold text-warm-white leading-tight mb-4">
              Spare bis zu 99,99 €
            </h3>
            <p className="text-warm-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Erlaube mir, deine Fotos für mein Portfolio zu nutzen – und erhalte deine erste Stunde Shooting-Zeit geschenkt.
            </p>

            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="font-display text-4xl md:text-5xl font-bold text-warm-gold">99,99 €</span>
              <span className="text-warm-white/50 text-sm">Ersparnis</span>
            </div>

            <Button
              variant="hero"
              size="xl"
              onClick={onBookClick}
            >
              Jetzt profitieren
            </Button>
          </motion.div>
        </div>

        {/* Counter */}
        <div className="absolute bottom-6 right-6 font-body text-warm-white/30 text-sm select-none">
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Full-screen reveal card for Deal ─────────────────────── */
const DealReveal = ({ deal, index, onSelect }: { deal: Deal; index: number; onSelect: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const dir = slideDirections[index % slideDirections.length];
  const isAkt = deal.service.toLowerCase().includes("akt");

  const x = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [dir.x, "0%", "0%", "0%"]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [dir.y, "0%", "0%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.92, 1, 1, 0.97]);

  return (
    <div ref={ref} className="h-screen w-full flex items-center justify-center sticky top-0 overflow-hidden">
      <motion.div style={{ x, y, opacity, scale }} className="relative w-full h-full">
        {/* Background image */}
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-warm-dark/60" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.15, 0.3, 0.7, 0.85], [0, 1, 1, 0]) }}
            className="max-w-lg"
          >
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-destructive/20 text-warm-white text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">
                {deal.badge}
              </span>
              <span className="text-warm-white/50 text-xs font-medium">Limitiert</span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-warm-white/10 flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
              {isAkt ? (
                <Flame className="w-8 h-8 text-warm-white" />
              ) : (
                <Heart className="w-8 h-8 text-warm-white fill-warm-white/50" />
              )}
            </div>

            <h3 className="font-display text-3xl md:text-5xl font-bold text-warm-white leading-tight mb-2">
              {deal.title}
            </h3>

            <div className="flex items-center justify-center gap-4 text-warm-white/60 text-sm mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {deal.durationLabel}
              </span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                {deal.photoPackageLabel}
              </span>
            </div>

            <p className="text-warm-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
              {deal.description}
            </p>

            <div className="flex items-baseline justify-center gap-3 mb-8">
              <span className="text-warm-white/40 line-through text-lg">{formatPrice(deal.originalPrice)}</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-warm-gold">{formatPrice(deal.fixedPrice)}</span>
              <span className="text-warm-white/40 text-xs">inkl. MwSt.</span>
            </div>

            <Button
              variant="hero"
              size="xl"
              onClick={onSelect}
            >
              Deal sichern
            </Button>
          </motion.div>
        </div>

        {/* Counter */}
        <div className="absolute bottom-6 right-6 font-body text-warm-white/30 text-sm select-none">
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Main Component ───────────────────────────────────────── */
const PromoBannerSlider = ({ onBookClick, onDealSelect }: PromoBannerSliderProps) => {
  const deals = getActivDeals();

  return (
    <section className="bg-warm-dark">
      {/* Section header */}
      <div className="container mx-auto px-6 md:px-12 py-16 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-white">
          Aktuelle Angebote
        </h2>
        <p className="text-warm-white/50 text-sm mt-3">
          Limitierte Deals – sichere dir jetzt deinen Vorteil
        </p>
      </div>

      {/* Full-screen reveal cards */}
      <div className="relative">
        <ModelReleaseReveal index={0} onBookClick={onBookClick} />
        {deals.map((deal, i) => (
          <DealReveal
            key={deal.id}
            deal={deal}
            index={i + 1}
            onSelect={() => onDealSelect?.(deal.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default PromoBannerSlider;
