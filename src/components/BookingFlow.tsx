import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Check, Minus, Plus, Mail, Phone } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────
interface BookingData {
  service: string;
  participants: { adults: number; children: number; babies: number; animals: number };
  duration: string;
  durationPrice: number;
  photoPackage: string;
  packagePrice: number;
  babybaumKombi: boolean;
  date: Date | null;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  zip: string;
  city: string;
  notes: string;
  agreedToTerms: boolean;
}

const INITIAL_BOOKING: BookingData = {
  service: "",
  participants: { adults: 1, children: 0, babies: 0, animals: 0 },
  duration: "",
  durationPrice: 0,
  photoPackage: "",
  packagePrice: 0,
  babybaumKombi: false,
  date: null,
  time: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  zip: "",
  city: "",
  notes: "",
  agreedToTerms: false,
};

// ── Services ───────────────────────────────────────────────────
const SERVICES = [
  "Familien Fotoshooting",
  "Baby Fotoshooting",
  "Newborn Fotoshooting",
  "Babybauch Fotoshooting",
  "Kinder Fotoshooting",
  "Freunde Fotoshooting",
  "Paar Fotoshooting",
  "Akt und Erotik Fotoshooting",
  "Männer Fotoshooting",
  "Beauty und Portrait Fotoshooting",
  "Mini Shooting",
  "Tier Fotoshooting",
  "Hochzeitsfotografie",
  "Mitarbeiterfotos",
  "Live und Event Fotografie",
  "Messe Fotografie",
  "Food und Produkt Fotografie",
];

const RESTRICTED_DURATION_SERVICES = ["Live und Event Fotografie", "Messe Fotografie", "Hochzeitsfotografie"];
const ALL_FOTOS_REQUIRED = ["Live und Event Fotografie", "Messe Fotografie"];

const STANDARD_DURATIONS = [
  { label: "1 Stunde", value: "1h", price: 99.99 },
  { label: "2 Stunden", value: "2h", price: 199.99 },
  { label: "4 Stunden", value: "4h", price: 399.99 },
  { label: "8 Stunden", value: "8h", price: 799.99 },
];

const MINI_DURATIONS = [
  { label: "30 Minuten", value: "30min", price: 49.99 },
  { label: "45 Minuten", value: "45min", price: 69.99 },
];

const PHOTO_PACKAGES = [
  { label: "10 Bilder", value: "10", price: 169.99 },
  { label: "15 Bilder", value: "15", price: 209.99 },
  { label: "20 Bilder", value: "20", price: 249.99 },
  { label: "30 Bilder", value: "30", price: 369.99 },
  { label: "40 Bilder", value: "40", price: 399.99 },
  { label: "Alle Fotos", value: "all", price: 449.99 },
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

const TOTAL_STEPS = 3;

// ── Component ──────────────────────────────────────────────────
const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1); // start at step 1
  const [booking, setBooking] = useState<BookingData>(INITIAL_BOOKING);
  const [showFoodMessage, setShowFoodMessage] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToStep = useCallback((step: number) => {
    setTimeout(() => {
      stepRefs.current[step]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    scrollToStep(step);
  }, [scrollToStep]);

  // ── Helpers ──────────────────────────────────────────────────
  const isMini = booking.service === "Mini Shooting";
  const isRestricted = RESTRICTED_DURATION_SERVICES.includes(booking.service);
  const requiresAllFotos = ALL_FOTOS_REQUIRED.includes(booking.service);
  const isBabybauch = booking.service === "Babybauch Fotoshooting";
  const isNewborn = booking.service === "Newborn Fotoshooting";

  const getAvailableDurations = () => {
    if (isMini) return MINI_DURATIONS;
    if (isRestricted) return STANDARD_DURATIONS.filter(d => ["2h", "4h", "8h"].includes(d.value));
    return STANDARD_DURATIONS;
  };

  const getAvailablePackages = () => {
    if (requiresAllFotos) return PHOTO_PACKAGES.filter(p => p.value === "all");
    if (isMini) return PHOTO_PACKAGES; // no "ohne" for mini
    return PHOTO_PACKAGES;
  };

  const canSelectOhne = !isMini && !requiresAllFotos;

  const totalPrice = () => {
    let total = booking.durationPrice + booking.packagePrice;
    if (isBabybauch && booking.babybaumKombi) {
      total += 49.99; // baby shooting add-on
    }
    return total;
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  // ── Service selection ────────────────────────────────────────
  const handleServiceSelect = (service: string) => {
    if (service === "Food und Produkt Fotografie") {
      setShowFoodMessage(true);
      return;
    }
    setShowFoodMessage(false);
    setBooking({
      ...INITIAL_BOOKING,
      service,
    });
    scrollToStep(2); // scroll to participants (still within step 1)
  };

  // ── Counter ──────────────────────────────────────────────────
  const updateParticipant = (key: keyof BookingData["participants"], delta: number) => {
    setBooking(prev => ({
      ...prev,
      participants: {
        ...prev.participants,
        [key]: Math.max(0, prev.participants[key] + delta),
      },
    }));
  };

  // ── Duration ─────────────────────────────────────────────────
  const handleDurationSelect = (value: string, price: number) => {
    setBooking(prev => ({ ...prev, duration: value, durationPrice: price }));

    if (requiresAllFotos) {
      setBooking(prev => ({
        ...prev,
        duration: value,
        durationPrice: price,
        photoPackage: "all",
        packagePrice: 449.99,
      }));
      setCurrentStep(3);
      scrollToStep(5); // scroll to calendar
    } else {
      scrollToStep(4); // scroll to package selection (still within step 2)
    }
  };

  const handlePackageSelect = (value: string, price: number) => {
    setBooking(prev => ({ ...prev, photoPackage: value, packagePrice: price }));
    setCurrentStep(3);
    scrollToStep(5); // scroll to calendar
  };

  // ── Babybauch Kombi ──────────────────────────────────────────
  useEffect(() => {
    if (booking.babybaumKombi) {
      setBooking(prev => ({ ...prev, photoPackage: "all", packagePrice: 449.99 }));
    }
  }, [booking.babybaumKombi]);

  // ── Render Steps ─────────────────────────────────────────────
  const renderProgress = () => {
    if (confirmed) return null;
    const displayStep = Math.min(currentStep, TOTAL_STEPS);
    return (
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground font-body tracking-wide">
          Schritt {displayStep} von {TOTAL_STEPS}
        </p>
        <div className="w-full max-w-md mx-auto h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(displayStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  if (confirmed) {
    return (
      <section className="py-24 bg-warm-white" id="booking">
        <div className="container mx-auto px-6 md:px-12 max-w-2xl text-center">
          <div className="bg-card rounded-xl p-12 shadow-card">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Buchung bestätigt!
            </h2>
            <p className="text-muted-foreground text-lg mb-2">
              Vielen Dank für deine Buchung. Ich freue mich auf dein Shooting!
            </p>
            <p className="text-muted-foreground">
              Eine Bestätigung wurde an {booking.email} gesendet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-warm-white" id="booking">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {renderProgress()}

        {/* STEP 1: Services */}
        <div ref={el => (stepRefs.current[1] = el)} className="scroll-mt-24">
          <div className="text-center mb-12">
            <p className="text-primary font-body font-semibold tracking-[0.25em] uppercase text-sm mb-4">
              Schritt 1
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Wähle dein Shooting
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {SERVICES.map(service => (
              <button
                key={service}
                onClick={() => handleServiceSelect(service)}
                className={cn(
                  "p-4 rounded-lg border-2 text-left font-body font-medium transition-all hover:shadow-card",
                  booking.service === service
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                )}
              >
                {service}
              </button>
            ))}
          </div>

          {showFoodMessage && (
            <div className="bg-card rounded-xl p-8 shadow-card text-center">
              <p className="text-foreground font-medium mb-4">
                Für Food und Produkt Fotografie erstelle ich individuelle Angebote.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
                <a href="mailto:booking@ashfoto.de" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" /> booking@ashfoto.de
                </a>
                <a href="tel:+4917670027200" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" /> +49 176 70027200
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Participants (part of Step 1) */}
        <div ref={el => (stepRefs.current[2] = el)} className="mt-20 scroll-mt-24">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Wie viele Personen nehmen teil?
              </h2>
            </div>

            <div className="max-w-md mx-auto space-y-4 mb-8">
              {([
                { key: "adults" as const, label: "Anzahl Erwachsene" },
                { key: "children" as const, label: "Anzahl Kinder" },
                { key: "babies" as const, label: "Anzahl Babys" },
                { key: "animals" as const, label: "Anzahl Tiere" },
              ]).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between bg-card rounded-lg p-4 shadow-soft">
                  <span className="font-medium text-foreground">{label}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateParticipant(key, -1)}
                      className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4 text-foreground" />
                    </button>
                    <span className="w-8 text-center font-semibold text-foreground">
                      {booking.participants[key]}
                    </span>
                    <button
                      onClick={() => updateParticipant(key, 1)}
                      className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="booking" size="lg" onClick={() => { setCurrentStep(2); scrollToStep(3); }}>
                Weiter
              </Button>
            </div>
          </div>

        {/* STEP 2: Duration */}
        <div ref={el => (stepRefs.current[3] = el)} className="mt-20 scroll-mt-24">
            <div className="text-center mb-10">
              <p className="text-primary font-body font-semibold tracking-[0.25em] uppercase text-sm mb-4">
                Schritt 2
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Wähle die Dauer deines Shootings
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {getAvailableDurations().map(dur => (
                <button
                  key={dur.value}
                  onClick={() => handleDurationSelect(dur.value, dur.price)}
                  className={cn(
                    "p-6 rounded-lg border-2 text-center transition-all hover:shadow-card",
                    booking.duration === dur.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  <p className="font-display text-xl font-bold text-foreground">{dur.label}</p>
                  <p className="text-primary font-semibold mt-1">{formatPrice(dur.price)}</p>
                </button>
              ))}
            </div>
          </div>

        {/* Photo Package (part of Step 2) */}
        <div ref={el => (stepRefs.current[4] = el)} className="mt-20 scroll-mt-24">
            <div className="text-center mb-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Wähle dein Bildpaket
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Jedes Shooting beinhaltet 1 Bild als digitale Datei. Nach dem Shooting
                kannst du weitere Bilder flexibel auswählen.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Ein einzelnes zusätzliches Bild kostet 29,99 €.
              </p>
            </div>

            {/* Babybauch Kombi */}
            {isBabybauch && (
              <div className="max-w-xl mx-auto mb-8 bg-accent/20 rounded-xl p-6 border border-accent/40">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="babykombi"
                    checked={booking.babybaumKombi}
                    onCheckedChange={(checked) =>
                      setBooking(prev => ({ ...prev, babybaumKombi: checked === true }))
                    }
                  />
                  <label htmlFor="babykombi" className="cursor-pointer">
                    <p className="font-semibold text-foreground">
                      Ich möchte die Babybauch plus Baby Kombi buchen
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      1 Stunde Baby Shooting 49,99 € statt 99,99 €
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Nur gültig mit Alle Fotos Paket 449,99 €
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      Gesamtpreis 499,99 € · Flexibler Termin
                    </p>
                  </label>
                </div>
              </div>
            )}

            {/* Newborn 2h message */}
            {isNewborn && booking.duration === "2h" && (
              <div className="max-w-xl mx-auto mb-8 bg-accent/20 rounded-xl p-6 border border-accent/40">
                <p className="text-sm text-foreground">
                  Wenn ich früher fertig werde, kann die restliche Zeit innerhalb von 6 Monaten
                  für ein weiteres Shooting genutzt werden.
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-4">
              {getAvailablePackages().map(pkg => (
                <button
                  key={pkg.value}
                  onClick={() => handlePackageSelect(pkg.value, pkg.price)}
                  disabled={booking.babybaumKombi && pkg.value !== "all"}
                  className={cn(
                    "p-5 rounded-lg border-2 text-center transition-all hover:shadow-card",
                    booking.photoPackage === pkg.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/40",
                    booking.babybaumKombi && pkg.value !== "all" && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <p className="font-display text-lg font-bold text-foreground">{pkg.label}</p>
                  <p className="text-primary font-semibold mt-1">{formatPrice(pkg.price)}</p>
                </button>
              ))}

              {canSelectOhne && (
                <button
                  onClick={() => handlePackageSelect("none", 0)}
                  disabled={booking.babybaumKombi}
                  className={cn(
                    "p-5 rounded-lg border-2 text-center transition-all hover:shadow-card",
                    booking.photoPackage === "none"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/40",
                    booking.babybaumKombi && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <p className="font-display text-lg font-bold text-foreground">Ohne Paket</p>
                  <p className="text-muted-foreground text-sm mt-1">Nur das enthaltene Bild</p>
                </button>
              )}
            </div>
          </div>

        {/* STEP 3: Calendar */}
        <div ref={el => (stepRefs.current[5] = el)} className="mt-20 scroll-mt-24">
            <div className="text-center mb-10">
              <p className="text-primary font-body font-semibold tracking-[0.25em] uppercase text-sm mb-4">
                Schritt 3
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Wähle Datum und Uhrzeit
              </h2>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              {/* Date */}
              <div>
                <Label className="text-foreground font-medium mb-2 block">Datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !booking.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {booking.date ? format(booking.date, "PPP", { locale: de }) : "Datum wählen"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={booking.date || undefined}
                      onSelect={(date) => setBooking(prev => ({ ...prev, date: date || null }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div>
                <Label className="text-foreground font-medium mb-2 block">Uhrzeit</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setBooking(prev => ({ ...prev, time: slot }))}
                      className={cn(
                        "py-2 rounded-md text-sm font-medium transition-all border",
                        booking.time === slot
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-foreground hover:border-primary/40"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  variant="booking"
                  size="lg"
                  disabled={!booking.date || !booking.time}
                  onClick={() => scrollToStep(6)}
                >
                  Weiter
                </Button>
              </div>
            </div>
          </div>

        {/* Customer Data (part of Step 3) */}
        <div ref={el => (stepRefs.current[6] = el)} className="mt-20 scroll-mt-24">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Deine Angaben
              </h2>
            </div>

            <div className="max-w-xl mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-foreground">Vorname</Label>
                  <Input
                    id="firstName"
                    value={booking.firstName}
                    onChange={e => setBooking(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-foreground">Nachname</Label>
                  <Input
                    id="lastName"
                    value={booking.lastName}
                    onChange={e => setBooking(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1 h-12"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">E Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={booking.email}
                  onChange={e => setBooking(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground">Telefonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={booking.phone}
                  onChange={e => setBooking(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label htmlFor="street" className="text-foreground">Straße und Hausnummer</Label>
                <Input
                  id="street"
                  value={booking.street}
                  onChange={e => setBooking(prev => ({ ...prev, street: e.target.value }))}
                  className="mt-1 h-12"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zip" className="text-foreground">PLZ</Label>
                  <Input
                    id="zip"
                    value={booking.zip}
                    onChange={e => setBooking(prev => ({ ...prev, zip: e.target.value }))}
                    className="mt-1 h-12"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="city" className="text-foreground">Ort</Label>
                  <Input
                    id="city"
                    value={booking.city}
                    onChange={e => setBooking(prev => ({ ...prev, city: e.target.value }))}
                    className="mt-1 h-12"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes" className="text-foreground">Zusätzliche Hinweise</Label>
                <Textarea
                  id="notes"
                  value={booking.notes}
                  onChange={e => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={booking.agreedToTerms}
                  onCheckedChange={(checked) =>
                    setBooking(prev => ({ ...prev, agreedToTerms: checked === true }))
                  }
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  Ich akzeptiere die Buchungsbedingungen und Datenschutz
                </label>
              </div>

              <div className="text-center pt-4">
                <Button
                  variant="booking"
                  size="lg"
                  disabled={
                    !booking.firstName || !booking.lastName || !booking.email ||
                    !booking.phone || !booking.street || !booking.zip ||
                    !booking.city || !booking.agreedToTerms
                  }
                  onClick={() => { setCurrentStep(4); scrollToStep(7); }}
                >
                  Weiter zur Zusammenfassung
                </Button>
              </div>
            </div>
          </div>

        {/* Summary */}
        {currentStep >= 4 && (
          <div ref={el => (stepRefs.current[7] = el)} className="mt-20 scroll-mt-24 animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Zusammenfassung
              </h2>
            </div>

            <div className="max-w-xl mx-auto bg-card rounded-xl p-8 shadow-card space-y-4">
              <SummaryRow label="Shooting" value={booking.service} />
              <SummaryRow
                label="Teilnehmer"
                value={`${booking.participants.adults} Erwachsene, ${booking.participants.children} Kinder, ${booking.participants.babies} Babys, ${booking.participants.animals} Tiere`}
              />
              <SummaryRow
                label="Dauer"
                value={`${getDurationLabel(booking.duration)} · ${formatPrice(booking.durationPrice)}`}
              />
              <SummaryRow
                label="Bildpaket"
                value={
                  booking.photoPackage === "none"
                    ? "Ohne Paket"
                    : `${getPackageLabel(booking.photoPackage)} · ${formatPrice(booking.packagePrice)}`
                }
              />
              {isBabybauch && booking.babybaumKombi && (
                <SummaryRow label="Kombi" value={`Baby Shooting Zusatz · ${formatPrice(49.99)}`} />
              )}
              <SummaryRow
                label="Termin"
                value={
                  booking.date
                    ? `${format(booking.date, "PPP", { locale: de })} um ${booking.time} Uhr`
                    : ""
                }
              />
              <SummaryRow
                label="Adresse"
                value={`${booking.street}, ${booking.zip} ${booking.city}`}
              />
              <SummaryRow label="Name" value={`${booking.firstName} ${booking.lastName}`} />
              <SummaryRow label="E Mail" value={booking.email} />
              <SummaryRow label="Telefon" value={booking.phone} />

              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-display text-xl font-bold text-foreground">Gesamtsumme</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
              </div>

              <div className="text-center pt-6">
                <Button
                  variant="booking"
                  size="xl"
                  className="w-full"
                  onClick={() => setConfirmed(true)}
                >
                  Buchung verbindlich bestätigen
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ── Helpers ────────────────────────────────────────────────────
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">{label}</span>
      <span className="text-foreground text-sm text-right">{value}</span>
    </div>
  );
}

function getDurationLabel(value: string): string {
  const all = [...STANDARD_DURATIONS, ...MINI_DURATIONS];
  return all.find(d => d.value === value)?.label || value;
}

function getPackageLabel(value: string): string {
  return PHOTO_PACKAGES.find(p => p.value === value)?.label || value;
}

export default BookingFlow;
