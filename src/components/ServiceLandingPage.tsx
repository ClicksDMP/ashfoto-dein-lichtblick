import { useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
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
import type { ServiceData } from "@/data/serviceData";

interface ServiceLandingPageProps {
  service: ServiceData;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const ServiceLandingPage = ({ service }: ServiceLandingPageProps) => {
  const bookingRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = useCallback(() => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
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

    // JSON-LD structured data
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
          areaServed: { "@type": "Country", name: "Germany" },
          image: service.heroImage,
        },
        {
          "@type": "Service",
          "@id": `https://ashfoto.de/shooting/${service.slug}#service`,
          name: service.title,
          description: service.description,
          provider: { "@id": "https://ashfoto.de/#business" },
          url: `https://ashfoto.de/shooting/${service.slug}`,
          image: service.heroImage,
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
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={service.heroImage}
            alt={service.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-dark/80 via-warm-dark/40 to-transparent" />
        </div>

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-warm-white/80 hover:text-warm-white transition-colors font-body text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <div className="relative z-10 container mx-auto px-6 md:px-12 pb-16 pt-32">
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
              className="text-warm-white/80 text-xl md:text-2xl font-body max-w-2xl mb-8"
            >
              {service.subtitle}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" onClick={scrollToBooking}>
                Jetzt Termin buchen
              </Button>
              <Button
                variant="heroOutline"
                size="xl"
                onClick={scrollToBooking}
                className="border-warm-white/50 text-warm-white hover:bg-warm-white hover:text-warm-dark"
              >
                Mehr erfahren
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-warm-white/60" />
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 bg-warm-white">
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
              className="text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto mb-12"
            >
              {service.description}
            </motion.p>

            {/* Highlights */}
            <motion.div
              variants={stagger}
              className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
            >
              {service.highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
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

      {/* Full-width image divider */}
      <div className="h-72 md:h-96 overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          style={{ filter: "brightness(0.85)" }}
        />
      </div>

      {/* Photo Gallery Section */}
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
                fallbackImage={service.heroImage}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-warm-white">
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
            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
              {service.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
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

      {/* Another image divider */}
      <div className="h-64 md:h-80 overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.title}
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ filter: "brightness(0.8) saturate(1.1)", objectPosition: "center 30%" }}
        />
      </div>

      {/* FAQ Section */}
      <section className="py-20 bg-warm-ivory">
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
                {service.faqs.map((faq, i) => (
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

      {/* CTA Banner */}
      <section className="py-16 bg-warm-dark">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-white mb-4">
            Bereit für dein {service.title}?
          </h2>
          <p className="text-warm-white/70 text-lg mb-8 max-w-xl mx-auto font-body">
            Sichere dir jetzt deinen Wunschtermin und lass uns gemeinsam unvergessliche Erinnerungen schaffen.
          </p>
          <Button variant="hero" size="xl" onClick={scrollToBooking} className="bg-warm-white text-warm-dark hover:bg-warm-white/90">
            Jetzt Termin buchen
          </Button>
        </div>
      </section>

      {/* Embedded Booking Flow */}
      <div ref={bookingRef} className="scroll-mt-8">
        <BookingFlow preselectedService={service.serviceName} />
      </div>

      <Footer />
    </main>
  );
};

export default ServiceLandingPage;
