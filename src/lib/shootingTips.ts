/**
 * Tips and preparation info for each shooting type shown in the customer portal.
 */

interface ShootingTip {
  icon: string;
  title: string;
  text: string;
}

const DEFAULT_TIPS: ShootingTip[] = [
  { icon: "👗", title: "Outfits vorbereiten", text: "Wähle aufeinander abgestimmte Farben in Erd- oder Pastelltönen. Vermeide große Logos und sehr bunte Muster." },
  { icon: "⏰", title: "Pünktlich sein", text: "Plane genügend Zeit für die Anreise ein, damit das Shooting entspannt starten kann." },
  { icon: "😊", title: "Entspannt bleiben", text: "Die besten Bilder entstehen, wenn du dich wohlfühlst. Sei einfach du selbst!" },
  { icon: "💧", title: "Ausreichend trinken", text: "Hydrierte Haut sieht auf Fotos besser aus. Trinke am Tag des Shootings ausreichend Wasser." },
];

const SERVICE_TIPS: Record<string, ShootingTip[]> = {
  "Familien Fotoshooting": [
    { icon: "👨‍👩‍👧‍👦", title: "Alle einbeziehen", text: "Bringt Lieblingsspielzeug oder Snacks für die Kleinen mit – so bleiben alle gut gelaunt." },
    { icon: "🎨", title: "Outfits abstimmen", text: "Nicht identisch, aber farblich harmonisch. Erdtöne und Pastellfarben wirken besonders edel." },
    { icon: "📍", title: "Location bedenken", text: "Euer Wohnzimmer, Garten oder ein Park – überlegt, wo ihr euch am wohlsten fühlt." },
    ...DEFAULT_TIPS.slice(2),
  ],
  "Baby Fotoshooting": [
    { icon: "🍼", title: "Baby füttern", text: "Ein sattes, zufriedenes Baby ist das beste Model. Füttert kurz vor dem Termin." },
    { icon: "🌡️", title: "Raum vorheizen", text: "Ca. 24°C Raumtemperatur ist ideal, besonders bei Bildern mit weniger Kleidung." },
    { icon: "🧸", title: "Lieblingsspielzeug", text: "Vertraute Gegenstände helfen eurem Baby, sich wohlzufühlen." },
    { icon: "😌", title: "Entspannt bleiben", text: "Babys spüren eure Energie. Je entspannter ihr seid, desto ruhiger wird auch euer Baby." },
  ],
  "Newborn Fotoshooting": [
    { icon: "🍼", title: "Vor dem Shooting füttern", text: "Ein sattes Neugeborenes schläft tiefer und lässt sich leichter in Posen betten." },
    { icon: "🌡️", title: "Raum auf 24-26°C heizen", text: "Wärme ist essentiell, besonders wenn euer Baby teilweise unbekleidet fotografiert wird." },
    { icon: "🤱", title: "Keine Sorgen", text: "Ich bringe alles mit – Wraps, Decken, Props. Ihr müsst nichts vorbereiten." },
    { icon: "⏳", title: "Zeit einplanen", text: "Plant 2-3 Stunden ein. Euer Baby bestimmt das Tempo mit Pausen zum Füttern und Kuscheln." },
  ],
  "Babybauch Fotoshooting": [
    { icon: "👗", title: "Figurbetonte Kleidung", text: "Eng anliegende Tops, Kleider oder auch nur ein BH zeigen den Babybauch am schönsten." },
    { icon: "💄", title: "Make-up", text: "Dezentes Make-up betont euren natürlichen Glow. Feuchtigkeitscreme für strahlende Haut." },
    { icon: "💍", title: "Accessoires", text: "Babyschuhe, Ultraschallbilder oder ein Brief an euer Baby machen die Bilder noch persönlicher." },
    { icon: "👫", title: "Partner einbeziehen", text: "Gemeinsame Bilder mit Partner halten diese besondere Verbindung fest." },
  ],
  "Hochzeitsfotografie": [
    { icon: "📋", title: "Timeline teilen", text: "Schicke mir den Ablaufplan eurer Hochzeit, damit ich jeden wichtigen Moment einfangen kann." },
    { icon: "📸", title: "Must-Have Shots", text: "Erstellt eine Liste mit Bildern, die euch besonders wichtig sind (z.B. mit bestimmten Gästen)." },
    { icon: "⏰", title: "Pufferzeit", text: "Plant 15-20 Minuten extra für Paarfotos ein – ohne Stress entstehen die schönsten Bilder." },
    { icon: "🌅", title: "Goldene Stunde", text: "Die schönsten Paarfotos entstehen im weichen Licht kurz vor Sonnenuntergang." },
  ],
  "Paar Fotoshooting": [
    { icon: "❤️", title: "Seid natürlich", text: "Vergesst die Kamera und konzentriert euch aufeinander. Die ehrlichsten Momente sind die schönsten." },
    { icon: "👗", title: "Outfits abstimmen", text: "Farblich harmonisch, aber nicht identisch. Neutrale Töne oder elegante Akzente wirken toll." },
    { icon: "📍", title: "Bedeutungsvoller Ort", text: "Wo habt ihr euch kennengelernt? Euer Lieblingsort erzählt eure Geschichte." },
    ...DEFAULT_TIPS.slice(3),
  ],
};

export function getTipsForService(serviceName: string): ShootingTip[] {
  return SERVICE_TIPS[serviceName] || DEFAULT_TIPS;
}

export function getStatusInfo(status: string): { label: string; color: string; description: string } {
  switch (status) {
    case "confirmed":
      return {
        label: "Bestätigt",
        color: "bg-green-100 text-green-800",
        description: "Dein Shooting ist bestätigt! Wir sehen uns zum vereinbarten Termin.",
      };
    case "cancelled":
      return {
        label: "Storniert",
        color: "bg-red-100 text-red-800",
        description: "Diese Buchung wurde storniert.",
      };
    default:
      return {
        label: "Ausstehend",
        color: "bg-yellow-100 text-yellow-800",
        description: "Deine Buchung ist eingegangen! Wir melden uns in Kürze bei dir, um den Termin zu bestätigen.",
      };
  }
}
