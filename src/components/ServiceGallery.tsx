import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceGalleryProps {
  serviceSlug: string;
  fallbackImage: string;
}

/* ── Lightbox ─────────────────────────────────────────────── */

interface LightboxProps {
  photos: { id: string; file_url: string; file_name: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({ photos, index, onClose, onPrev, onNext }: LightboxProps) => {
  // Keyboard nav
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
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2 rounded-full bg-warm-dark/60 text-warm-white/80 hover:text-warm-white transition-colors"
        aria-label="Schließen"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 md:left-8 z-10 p-2 rounded-full bg-warm-dark/60 text-warm-white/80 hover:text-warm-white transition-colors"
          aria-label="Vorheriges Bild"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 md:right-8 z-10 p-2 rounded-full bg-warm-dark/60 text-warm-white/80 hover:text-warm-white transition-colors"
          aria-label="Nächstes Bild"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}

      {/* Image */}
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

      {/* Counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-warm-white/60 font-body text-sm">
        {index + 1} / {photos.length}
      </div>
    </motion.div>,
    document.body
  );
};

/* ── Gallery Grid ─────────────────────────────────────────── */

const ServiceGallery = ({ serviceSlug, fallbackImage }: ServiceGalleryProps) => {
  const [photos, setPhotos] = useState<{ id: string; file_url: string; file_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from("service_gallery_photos")
        .select("id, file_url, file_name")
        .eq("service_slug", serviceSlug)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setPhotos(data);
      }
      setLoading(false);
    };
    fetchPhotos();
  }, [serviceSlug]);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null)), [photos.length]);
  const goNext = useCallback(() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null)), [photos.length]);

  if (loading) {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-full h-64 bg-secondary/30 rounded-xl animate-pulse break-inside-avoid" />
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
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {displayPhotos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 120 }}
            className="break-inside-avoid group relative cursor-pointer rounded-xl overflow-hidden"
            onClick={() => openLightbox(i)}
          >
            <img
              src={photo.file_url}
              alt={photo.file_name}
              className="w-full h-auto rounded-xl transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-warm-dark/0 group-hover:bg-warm-dark/30 transition-colors duration-300 flex items-center justify-center rounded-xl">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 rounded-full bg-warm-white/20 backdrop-blur-sm">
                <Expand className="w-6 h-6 text-warm-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
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
