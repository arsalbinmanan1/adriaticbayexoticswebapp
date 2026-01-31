import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BrandLogos from "@/components/BrandLogos";
import FeaturesSection from "@/components/FeaturesSection";
import CarListings from "@/components/CarListings";
import AboutSection from "@/components/AboutSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      <Hero />
      <BrandLogos />
      <FeaturesSection />
      <CarListings />
      <AboutSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
