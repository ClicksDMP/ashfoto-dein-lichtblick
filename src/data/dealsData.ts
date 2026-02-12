import imgPaar from "@/assets/shooting-paar.jpg";

export interface Deal {
  id: string;
  title: string;
  subtitle: string;
  service: string; // must match SERVICES name
  duration: string; // e.g. "1h"
  durationLabel: string;
  photoPackage: string; // e.g. "10"
  photoPackageLabel: string;
  fixedPrice: number;
  originalPrice: number;
  image: string;
  badge: string;
  validUntil: string; // ISO date
  description: string;
}

export const DEALS: Deal[] = [
  {
    id: "valentinstag-200",
    title: "Valentinstag Special 💕",
    subtitle: "Paar Fotoshooting · 1 Stunde · 10 Bilder",
    service: "Paar Fotoshooting",
    duration: "1h",
    durationLabel: "1 Stunde",
    photoPackage: "10",
    photoPackageLabel: "10 Bilder",
    fixedPrice: 199.99,
    originalPrice: 269.98,
    image: imgPaar,
    badge: "Spare 70 €",
    validUntil: "2026-03-14",
    description: "Das perfekte Geschenk zum Valentinstag – ein romantisches Paar-Shooting mit 10 professionell bearbeiteten Bildern.",
  },
  {
    id: "valentinstag-250",
    title: "Valentinstag Premium 💖",
    subtitle: "Paar Fotoshooting · 1 Stunde · 15 Bilder",
    service: "Paar Fotoshooting",
    duration: "1h",
    durationLabel: "1 Stunde",
    photoPackage: "15",
    photoPackageLabel: "15 Bilder",
    fixedPrice: 249.99,
    originalPrice: 309.98,
    image: imgPaar,
    badge: "Spare 60 €",
    validUntil: "2026-03-14",
    description: "Mehr Bilder, mehr Erinnerungen – dein Premium Valentinstag Paar-Shooting mit 15 bearbeiteten Fotos.",
  },
];

export function getActivDeals(): Deal[] {
  const now = new Date();
  return DEALS.filter(d => new Date(d.validUntil) >= now);
}
