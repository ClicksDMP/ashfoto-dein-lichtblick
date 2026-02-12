import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceGalleryProps {
  serviceSlug: string;
  fallbackImage: string;
}

type Photo = { id: string; file_url: string; file_name: string };

/* ── Overlay color palette (classical muted tones) ────────── */
const overlayColors = [
  "rgba(62, 47, 40, 0.55)",   // warm umber
  "rgba(44, 54, 57, 0.55)",   // slate charcoal
  "rgba(72, 60, 50, 0.55)",   // bronze brown
  "rgba(38, 50, 46, 0.55)",   // deep forest
  "rgba(58, 42, 48, 0.55)",   // muted plum
  "rgba(50, 50, 62, 0.55)",   // dusty indigo
];

/* ── Direction configs for alternating reveals ────────────── */
const slideDirections = [
  { x: "-100%", y: "0%" },   // from left
  { x: "100%",  y: "0%" },   // from right
  { x: "0%",    y: "-100%" }, // from top
  { x: "0%",    y: "100%" },  // from bottom
];

/* ── Lightbox ─────────────────────────────────────────────── */

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({ photos, index, onClose, onPrev, onNext }: LightboxProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  const photo = photos[index];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-warm-dark/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2 rounded-full bg-warm-dark/60 text-warm-white/80 hover:text-warm-white transition-colors"
        aria-label="Schließen"
      >
        <X className="w-6 h-6" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 md:left-8 z-10 p-2 rounded-full bg-warm-dark/60 text-warm-white/80 hover:text-warm-white transition-colors"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 md:right-8 z-10 p-2 rounded-full bg-warm-dark/60 text-warm-white/80 hover:text-warm-white transition-colors"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      <motion.img
        key={photo.id}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3 }}
        src={photo.file_url}
        alt={photo.file_name}
        className="max-h-[90vh] max-w-[92vw] object-contain rounded-lg select-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-warm-white/60 font-body text-sm">
        {index + 1} / {photos.length}
      </div>
    </motion.div>,
    document.body
  );
};

/* ── Full-screen reveal card ──────────────────────────────── */

interface RevealCardProps {
  photo: Photo;
  index: number;
  onClick: () => void;
}

const RevealCard = ({ photo, index, onClick }: RevealCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const dir = slideDirections[index % slideDirections.length];
  const overlay = overlayColors[index % overlayColors.length];

  // Image slides in from direction as user scrolls into view
  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [dir.x, "0%", "0%", "0%"]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [dir.y, "0%", "0%", "0%"]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.95]);

  return (
    <div
      ref={ref}
      className="h-screen w-full flex items-center justify-center sticky top-0 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        style={{ x, y, opacity, scale }}
        className="relative w-full h-full"
      >
        {/* Full-screen image */}
        <img
          src={photo.file_url}
          alt={photo.file_name}
          className="w-full h-full object-cover"
          loading="lazy"
        />


        {/* Photo counter bottom-right */}
        <div className="absolute bottom-6 right-6 font-body text-primary-foreground/50 text-sm select-none">
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Gallery ──────────────────────────────────────────────── */

const ServiceGallery = ({ serviceSlug, fallbackImage }: ServiceGalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from("service_gallery_photos")
        .select("id, file_url, file_name")
        .eq("service_slug", serviceSlug)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) setPhotos(data);
      setLoading(false);
    };
    fetchPhotos();
  }, [serviceSlug]);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => setLightboxIndex((p) => (p !== null ? (p - 1 + photos.length) % photos.length : null)), [photos.length]);
  const goNext = useCallback(() => setLightboxIndex((p) => (p !== null ? (p + 1) % photos.length : null)), [photos.length]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-screen w-full bg-secondary/20 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  const displayPhotos =
    photos.length > 0
      ? photos
      : [{ id: "fallback", file_url: fallbackImage, file_name: "Galerie" }];

  return (
    <>
      <div className="relative">
        {displayPhotos.map((photo, i) => (
          <RevealCard
            key={photo.id}
            photo={photo}
            index={i}
            onClick={() => openLightbox(i)}
          />
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={displayPhotos}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceGallery;
