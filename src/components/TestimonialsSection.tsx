import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  client_name: string;
  service_name: string;
  rating: number;
  feedback_text: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("customer_feedbacks")
        .select("id, client_name, service_name, rating, feedback_text")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (data) setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-warm-cream" id="testimonials">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-primary font-body mb-3">
            Kundenstimmen
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Was meine Kunden sagen
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Echte Bewertungen von echten Menschen – weil Vertrauen zählt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-lg transition-shadow duration-300"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-3" />
              <p className="text-foreground/80 italic text-sm leading-relaxed mb-4">
                "{t.feedback_text}"
              </p>
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= t.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{t.client_name}</p>
                <p className="text-xs text-muted-foreground">{t.service_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
