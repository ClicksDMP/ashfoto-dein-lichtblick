import { useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProcessSection from "@/components/ProcessSection";
import BookingFlow from "@/components/BookingFlow";
import Footer from "@/components/Footer";

const Index = () => {
  const bookingRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = useCallback(() => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen">
      <HeroSection onBookClick={scrollToBooking} onConsultClick={scrollToBooking} />
      <AboutSection onCtaClick={scrollToBooking} />
      <ProcessSection onCtaClick={scrollToBooking} />
      <div ref={bookingRef} className="scroll-mt-8">
        <BookingFlow />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
