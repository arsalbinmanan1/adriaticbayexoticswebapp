import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AboutPageContent from "@/components/AboutPageContent";

export const metadata = {
  title: "About Us | Adriaticbay Exotics - Premium Luxury Car Rentals",
  description: "Learn about Adriaticbay Exotics, our mission to redefine luxury car rentals, our core values, and our commitment to exceptional service.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />
      <AboutPageContent />
      <Footer />
    </div>
  );
}
