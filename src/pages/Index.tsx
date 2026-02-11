import { useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProcessSection from "@/components/ProcessSection";
import ServiceAreaSection from "@/components/ServiceAreaSection";
import BookingFlow from "@/components/BookingFlow";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  const bookingRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = useCallback(() => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen">
      <Header onBookClick={scrollToBooking} />
      <HeroSection onBookClick={scrollToBooking} onConsultClick={scrollToBooking} />
      <div id="about">
        <AboutSection onCtaClick={scrollToBooking} />
      </div>
      <div id="process">
        <ProcessSection onCtaClick={scrollToBooking} />
      </div>
      <ServiceAreaSection />
      <div id="booking" ref={bookingRef} className="scroll-mt-8">
        <BookingFlow />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
