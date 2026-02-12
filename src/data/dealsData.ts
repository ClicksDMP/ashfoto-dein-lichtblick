import imgPaar from "@/assets/shooting-paar.jpg";
import imgAkt from "@/assets/shooting-akt.jpg";

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
    id: "akt-erotik-200",
    title: "Akt & Erotik Special 🔥",
    subtitle: "Akt und Erotik Fotoshooting · 1 Stunde · 10 Bilder",
    service: "Akt und Erotik Fotoshooting",
    duration: "1h",
    durationLabel: "1 Stunde",
    photoPackage: "10",
    photoPackageLabel: "10 Bilder",
    fixedPrice: 199.99,
    originalPrice: 269.98,
    image: imgAkt,
    badge: "Spare 70 €",
    validUntil: "2026-03-14",
    description: "Entdecke deine sinnliche Seite – ein professionelles Akt-Shooting mit 10 kunstvoll bearbeiteten Bildern.",
  },
];

export function getActivDeals(): Deal[] {
  const now = new Date();
  return DEALS.filter(d => new Date(d.validUntil) >= now);
}
