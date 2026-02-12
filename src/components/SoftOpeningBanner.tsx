import { Heart, Camera, Sparkles } from "lucide-react";

const SoftOpeningBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary/40">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon cluster */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Willkommen – ashfoto wächst!
          </h2>

          <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              Ich habe bereits zahlreiche wunderschöne Shootings umgesetzt – doch als Fotograf ist mir eines
              besonders wichtig: <span className="text-foreground font-medium">der Schutz meiner Kunden.</span> Viele
              meiner besten Arbeiten darf ich ohne ausdrückliche Einwilligung nicht veröffentlichen, und das
              respektiere ich selbstverständlich.
            </p>
            <p>
              Mein Portfolio auf dieser Seite wächst mit jedem neuen Projekt. Ich arbeite kontinuierlich daran,
              dir hier einen authentischen Einblick in meine Arbeit zu geben – Schritt für Schritt, Bild für Bild.
            </p>
            <p className="text-foreground font-medium">
              Wenn du mich buchst, unterstützt du nicht nur ein professionelles Shooting – sondern auch den
              Aufbau dieses gesamten Projekts. Danke für dein Vertrauen.{" "}
              <Heart className="w-4 h-4 inline text-primary fill-primary" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoftOpeningBanner;
