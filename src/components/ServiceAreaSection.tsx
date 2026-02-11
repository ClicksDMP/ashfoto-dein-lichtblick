import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const CITIES = [
  "Mannheim",
  "Heidelberg",
  "Ludwigshafen am Rhein",
  "Frankenthal",
  "Speyer",
  "Worms",
  "Weinheim",
  "Viernheim",
  "Lampertheim",
  "Hockenheim",
  "Leimen",
  "Wiesloch",
  "Bensheim",
  "Neustadt an der Weinstraße",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.04 } },
};

const ServiceAreaSection = () => {
  return (
    <section className="py-24 bg-warm-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-primary font-body font-semibold tracking-[0.25em] uppercase text-sm mb-4"
          >
            Einsatzgebiet
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Ich komme zu dir
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Mit Sitz in <span className="text-foreground font-semibold">Mannheim</span> bin ich
            in der gesamten Metropolregion Rhein-Neckar für dich unterwegs. Mobil, flexibel und immer direkt bei dir vor Ort.
          </motion.p>

          <motion.div
            variants={stagger}
            className="flex flex-wrap justify-center gap-3"
          >
            {CITIES.map((city) => (
              <motion.span
                key={city}
                variants={fadeUp}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-body transition-colors ${
                  city === "Mannheim"
                    ? "bg-primary text-primary-foreground font-semibold shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/30"
                }`}
              >
                {city === "Mannheim" && <MapPin className="w-4 h-4" />}
                {city}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-sm mt-8"
          >
            Deine Stadt ist nicht dabei? Schreib mir – oft ist mehr möglich, als du denkst.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceAreaSection;
