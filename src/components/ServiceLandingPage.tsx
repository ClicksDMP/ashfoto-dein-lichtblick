import { useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronDown, Star, Camera, Heart, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ServiceGallery from "@/components/ServiceGallery";
import BookingFlow from "@/components/BookingFlow";
import Footer from "@/components/Footer";
import { useServiceImages } from "@/hooks/useServiceImages";
import type { ServiceData } from "@/data/serviceData";

interface ServiceLandingPageProps {
  service: ServiceData;
}

/* ── Enhanced animation variants ─────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: "spring" as const, stiffness: 100, damping: 18 },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerFast = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const whyIcons = [Camera, Star, Heart, Sparkles, Shield, CheckCircle2];

const LOCATION_FAQ = {
  question: "In welchen Städten bist du verfügbar?",
  answer:
    "Ich bin mit Sitz in Mannheim in der gesamten Metropolregion Rhein-Neckar unterwegs. Dazu gehören unter anderem Heidelberg, Ludwigshafen am Rhein, Frankenthal, Speyer, Worms, Weinheim, Viernheim, Lampertheim, Hockenheim, Leimen, Wiesloch, Bensheim und Neustadt an der Weinstraße. Deine Stadt ist nicht dabei? Schreib mir – oft ist mehr möglich, als du denkst.",
};

/* ── Parallax Image Divider ──────────────────────────────── */

const ParallaxDivider = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className="relative h-72 md:h-96 overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        style={{ y, filter: "brightness(0.85)" }}
        className="absolute inset-0 w-full h-[130%] object-cover object-center -top-[15%]"
        loading="lazy"
      />
      {/* Decorative edge lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-warm-brown/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-warm-brown/30 to-transparent" />
    </div>
  );
};

/* ── Section Divider ─────────────────────────────────────── */

const SectionDivider = () => (
  <div className="flex items-center justify-center py-2">
    <div className="h-px w-16 bg-warm-brown/20" />
    <div className="mx-3 w-1.5 h-1.5 rounded-full bg-warm-brown/30" />
    <div className="h-px w-16 bg-warm-brown/20" />
  </div>
);

/* ── Main Component ──────────────────────────────────────── */

const ServiceLandingPage = ({ service }: ServiceLandingPageProps) => {
  const bookingRef = useRef<HTMLDivElement>(null);
  const { resolvedHero: heroImage, resolvedBanner: bannerImage } = useServiceImages(service.slug, service.heroImage);

  const scrollToBooking = useCallback(() => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [service.slug]);

  // SEO: update document title, meta, and JSON-LD
  useEffect(() => {
    document.title = service.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", service.metaDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = service.metaDescription;
      document.head.appendChild(meta);
    }

    const jsonLdId = "service-jsonld";
    let script = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = jsonLdId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": "https://ashfoto.de/#business",
          name: "ashfoto",
          description: "Mobiler Fotograf – Professionelle Fotoshootings direkt bei dir vor Ort.",
          url: "https://ashfoto.de",
          telephone: "+4917670027200",
          email: "booking@ashfoto.de",
          priceRange: "€€",
          areaServed: [
            "Mannheim", "Heidelberg", "Ludwigshafen am Rhein", "Frankenthal", "Speyer",
            "Worms", "Weinheim", "Viernheim", "Lampertheim", "Hockenheim",
            "Leimen", "Wiesloch", "Bensheim", "Neustadt an der Weinstraße",
          ].map((city) => ({ "@type": "City", name: city })),
        },
        {
          "@type": "Service",
          "@id": `https://ashfoto.de/shooting/${service.slug}#service`,
          name: service.title,
          description: service.description,
          provider: { "@id": "https://ashfoto.de/#business" },
          url: `https://ashfoto.de/shooting/${service.slug}`,
          image: heroImage,
          areaServed: { "@type": "Country", name: "Germany" },
        },
        {
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    };

    script.textContent = JSON.stringify(structuredData);

    return () => {
      const el = document.getElementById(jsonLdId);
      if (el) el.remove();
    };
  }, [service]);

  return (
    <main className="min-h-screen bg-background">
      {/* ── HERO with zoom-out entrance ───────────────────────── */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img
            src={heroImage}
            alt={service.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-warm-dark/85 via-warm-dark/40 to-warm-dark/10"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </motion.div>

        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-warm-white/80 hover:text-warm-white transition-colors font-body text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <div className="relative z-10 container mx-auto px-6 md:px-12 pb-20 pt-32">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p
              variants={fadeUp}
              className="text-warm-gold font-body font-semibold tracking-[0.3em] uppercase text-sm mb-4"
            >
              ashfoto
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white leading-tight mb-4"
            >
              {service.title}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-warm-white/90 text-xl md:text-2xl font-body max-w-2xl mb-3"
            >
              {service.subtitle}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-warm-white/60 text-base md:text-lg font-body italic max-w-xl mb-10"
            >
              {service.heroTagline}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" onClick={scrollToBooking}>
                Jetzt Termin sichern
              </Button>
              <Button
                variant="heroOutline"
                size="xl"
                onClick={scrollToBooking}
                className="border-warm-white/50 text-warm-white hover:bg-warm-white hover:text-warm-dark"
              >
                Verfügbarkeit prüfen
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-warm-white/60" />
        </div>
      </section>

      {/* ── EMOTIONAL INTRO ──────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-warm-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
            >
              {service.title} – {service.subtitle}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto mb-8"
            >
              {service.description}
            </motion.p>
            {/* Emotional paragraph */}
            <motion.div
              variants={fadeUp}
              className="bg-warm-ivory/60 border-l-4 border-warm-brown/40 rounded-r-lg p-6 md:p-8 max-w-3xl mx-auto mb-12"
            >
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-body italic">
                {service.emotionalIntro}
              </p>
            </motion.div>

            {/* Highlights with staggered scale-in */}
            <motion.div
              variants={staggerFast}
              className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
            >
              {service.highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="flex items-start gap-3 bg-card rounded-lg p-4 shadow-soft"
                >
                  <CheckCircle2 className="w-5 h-5 text-warm-brown mt-0.5 shrink-0" />
                  <span className="text-foreground font-body">{highlight}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ── PARALLAX IMAGE DIVIDER ───────────────────────────── */}
      <ParallaxDivider src={bannerImage} alt={service.title} />

      <SectionDivider />

      {/* ── EXPERIENCE SECTION ───────────────────────────────── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-primary font-body font-semibold tracking-[0.25em] uppercase text-sm mb-4 text-center"
            >
              Dein Erlebnis
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center"
            >
              So läuft dein {service.title} ab
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-center mb-14 max-w-2xl mx-auto"
            >
              Du brauchst keine Erfahrung vor der Kamera. Ich leite dich Schritt für Schritt – von der ersten Idee bis zum fertigen Bild.
            </motion.p>

            <motion.div variants={stagger} className="space-y-6">
              {service.experienceSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="flex gap-5 md:gap-8 items-start"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-warm-brown/15 flex items-center justify-center">
                    <span className="text-warm-brown font-display font-bold text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground font-body leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="text-center mt-14">
              <Button variant="cta" size="xl" onClick={scrollToBooking}>
                Jetzt Termin sichern
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PHOTO GALLERY ────────────────────────────────────── */}
      <section className="py-20 bg-warm-ivory">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center"
            >
              Galerie
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-center mb-10"
            >
              Eindrücke aus vergangenen Shootings
            </motion.p>
            <motion.div variants={fadeUp}>
              <ServiceGallery
                serviceSlug={service.slug}
                fallbackImage={heroImage}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-warm-white">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-primary font-body font-semibold tracking-[0.25em] uppercase text-sm mb-4 text-center"
            >
              Warum ashfoto
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center"
            >
              Was mein {service.title} besonders macht
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-center mb-14 max-w-2xl mx-auto"
            >
              Kein Massenprodukt. Keine Fließbandarbeit. Jedes Shooting ist so einzigartig wie die Menschen davor – und dahinter.
            </motion.p>

            <motion.div
              variants={staggerFast}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {service.whyChooseUs.map((reason, i) => {
                const Icon = whyIcons[i % whyIcons.length];
                return (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    className="bg-card rounded-xl p-6 shadow-soft flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-warm-brown/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-warm-brown" />
                    </div>
                    <p className="text-foreground font-body text-sm leading-relaxed">{reason}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TIPS SECTION ─────────────────────────────────────── */}
      <section className="py-20 bg-warm-ivory">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center"
            >
              Tipps für dein Shooting
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-center mb-10"
            >
              So holst du das Beste aus deinem {service.title} heraus
            </motion.p>
            <motion.div variants={staggerFast} className="grid md:grid-cols-3 gap-6">
              {service.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="bg-card rounded-xl p-6 shadow-card text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-warm-brown/15 flex items-center justify-center mx-auto mb-4">
                    <span className="text-warm-brown font-display font-bold text-lg">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body">
                    {tip.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ── PARALLAX IMAGE DIVIDER 2 ─────────────────────────── */}
      <ParallaxDivider src={bannerImage} alt={service.title} />

      <SectionDivider />

      {/* ── FAQ SECTION ──────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center"
            >
              Häufig gestellte Fragen
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-center mb-10"
            >
              Alles, was du über dein {service.title} wissen musst
            </motion.p>
            <motion.div variants={fadeUp}>
              <Accordion type="single" collapsible className="space-y-3">
                {[...service.faqs, LOCATION_FAQ].map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-card rounded-xl shadow-soft border-none px-6"
                  >
                    <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-body pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CINEMATIC CLOSING CTA ────────────────────────────── */}
      <section className="py-20 md:py-28 bg-warm-dark">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-warm-white mb-6"
            >
              {service.closingHeadline}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-warm-white/70 text-lg md:text-xl mb-10 font-body leading-relaxed"
            >
              {service.closingText}
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                variant="hero"
                size="xl"
                onClick={scrollToBooking}
                className="bg-warm-white text-warm-dark hover:bg-warm-white/90"
              >
                Jetzt Termin sichern
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── EMBEDDED BOOKING FLOW ────────────────────────────── */}
      <div ref={bookingRef} className="scroll-mt-8">
        <BookingFlow preselectedService={service.serviceName} />
      </div>

      <Footer />
    </main>
  );
};

export default ServiceLandingPage;
