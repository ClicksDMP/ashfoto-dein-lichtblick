import {
  Users,
  Baby,
  HeartHandshake,
  Flower2,
  Puzzle,
  PartyPopper,
  Heart,
  Gem,
  Flame,
  UserRound,
  Sparkles,
  Zap,
  PawPrint,
  Briefcase,
  Music,
  Landmark,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps each service slug to a unique Lucide icon.
 * Used as placeholder when no real photo is uploaded.
 */
export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  "familien-fotoshooting": Users,
  "baby-fotoshooting": Baby,
  "newborn-fotoshooting": HeartHandshake,
  "babybauch-fotoshooting": Flower2,
  "kinder-fotoshooting": Puzzle,
  "freunde-fotoshooting": PartyPopper,
  "paar-fotoshooting": Heart,
  "hochzeitsfotografie": Gem,
  "akt-erotik-fotoshooting": Flame,
  "maenner-fotoshooting": UserRound,
  "beauty-portrait-fotoshooting": Sparkles,
  "mini-shooting": Zap,
  "tier-fotoshooting": PawPrint,
  "mitarbeiterfotos": Briefcase,
  "event-fotografie": Music,
  "messe-fotografie": Landmark,
  "food-produkt-fotografie": UtensilsCrossed,
};

export const getServiceIcon = (slug: string): LucideIcon => {
  return SERVICE_ICON_MAP[slug] || Users;
};
