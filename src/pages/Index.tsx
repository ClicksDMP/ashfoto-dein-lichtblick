import { useRef, useCallback, useState } from "react";
import HeroSection from "@/components/HeroSection";
import SoftOpeningBanner from "@/components/SoftOpeningBanner";
import PromoBannerSlider from "@/components/PromoBannerSlider";
import AboutSection from "@/components/AboutSection";
import ProcessSection from "@/components/ProcessSection";
import ServiceAreaSection from "@/components/ServiceAreaSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookingFlow from "@/components/BookingFlow";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  const bookingRef = useRef<HTMLDivElement>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | undefined>();

  const scrollToBooking = useCallback(() => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleDealSelect = useCallback((dealId: string) => {
    setSelectedDealId(dealId);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen">
      <Header onBookClick={scrollToBooking} />
      <HeroSection onBookClick={scrollToBooking} onConsultClick={scrollToBooking} />
      <SoftOpeningBanner />
      <PromoBannerSlider onBookClick={scrollToBooking} onDealSelect={handleDealSelect} />
      <div id="about">
        <AboutSection onCtaClick={scrollToBooking} />
      </div>
      <div id="process">
        <ProcessSection onCtaClick={scrollToBooking} />
      </div>
      <ServiceAreaSection />
      <TestimonialsSection />
      <div id="booking" ref={bookingRef} className="scroll-mt-8">
        <BookingFlow preselectedDealId={selectedDealId} onClearDeal={() => setSelectedDealId(undefined)} />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
