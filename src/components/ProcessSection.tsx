import { Button } from "@/components/ui/button";

interface ProcessSectionProps {
  onCtaClick: () => void;
}

const steps = [
  { num: 1, text: "Shooting auswählen" },
  { num: 2, text: "Teilnehmer angeben" },
  { num: 3, text: "Dauer auswählen" },
  { num: 4, text: "Bildpaket wählen" },
  { num: 5, text: "Termin auswählen" },
  { num: 6, text: "Daten eingeben" },
  { num: 7, text: "Buchung bestätigen" },
  { num: 8, text: "Shooting bei dir vor Ort" },
  { num: 9, text: "Bilder auswählen und digital erhalten" },
];

const ProcessSection = ({ onCtaClick }: ProcessSectionProps) => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-body font-semibold tracking-[0.25em] uppercase text-sm mb-4">
            Der Ablauf
          </p>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-16">
            So läuft dein Shooting ab
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative bg-card rounded-lg p-6 shadow-soft text-left group hover:shadow-card transition-shadow"
              >
                <span className="text-3xl font-display font-bold text-accent/60 mb-2 block">
                  {String(step.num).padStart(2, "0")}
                </span>
                <p className="text-foreground font-medium">{step.text}</p>
              </div>
            ))}
          </div>

          <Button variant="cta" size="xl" onClick={onCtaClick}>
            Jetzt starten
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
