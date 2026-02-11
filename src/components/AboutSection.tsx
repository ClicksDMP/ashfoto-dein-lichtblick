import { Button } from "@/components/ui/button";
import { Camera, Sun, Monitor } from "lucide-react";

interface AboutSectionProps {
  onCtaClick: () => void;
}

const AboutSection = ({ onCtaClick }: AboutSectionProps) => {
  return (
    <section className="py-24 bg-warm-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <p className="text-primary font-body font-semibold tracking-[0.25em] uppercase text-sm mb-4">
            Über mich
          </p>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
            Fotografie, die dich in Szene setzt
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            Ich bin Fotograf aus Leidenschaft und spezialisiert auf emotionale, moderne Fotografie.
            Mein Fokus liegt auf natürlichem Licht, authentischen Momenten und einem Ergebnis,
            das dich begeistert. Ich komme zu dir, egal ob Indoor oder Outdoor.
            Mit professionellem Equipment und einem klaren Blick für Details entstehen Bilder,
            die mehr erzählen als Worte. Alle Fotos erhältst du digital.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Mobil und flexibel</h3>
                <p className="text-muted-foreground text-sm">Ich komme zu dir. Kein Studio nötig.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Sun className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Indoor und Outdoor</h3>
                <p className="text-muted-foreground text-sm">Perfektes Licht in jeder Umgebung.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Digitale Lieferung</h3>
                <p className="text-muted-foreground text-sm">Alle Bilder als hochwertige Dateien.</p>
              </div>
            </div>
          </div>

          <Button variant="cta" size="xl" onClick={onCtaClick}>
            Jetzt Shooting auswählen
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
