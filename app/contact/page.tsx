import ContactForm from "@/components/ContactForm";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Adriatic Bay Exotics",
  description: "Get in touch with Adriatic Bay Exotics for luxury car rentals in Tampa Bay, FL",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-700 via-red-600 to-amber-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Ready to experience luxury? Contact us today and let's make your dream drive a reality.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Contact Information
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Reach out to our team directly. We're here to help you with any questions about our luxury fleet.
                </p>
              </div>

              {/* CEO Emanuel */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">CEO Emanuel</h3>
                    <a
                      href="tel:+17272245544"
                      className="text-amber-400 hover:text-amber-300 text-lg font-semibold transition-colors"
                    >
                      +1 (727) 224-5544
                    </a>
                    <p className="text-gray-500 text-sm mt-1">Italian, Spanish, English</p>
                  </div>
                </div>
              </div>

              {/* CEO Volis */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">CEO Volis</h3>
                    <a
                      href="tel:+17279220141"
                      className="text-amber-400 hover:text-amber-300 text-lg font-semibold transition-colors"
                    >
                      +1 (727) 922-0141
                    </a>
                    <p className="text-gray-500 text-sm mt-1">Albanian, Greek, English</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Email Us</h3>
                    <a
                      href="mailto:AdriaticBayExoticsLLC@gmail.com"
                      className="text-amber-400 hover:text-amber-300 transition-colors break-all"
                    >
                      AdriaticBayExoticsLLC@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Business Hours</h3>
                    <p className="text-gray-300">Monday - Sunday</p>
                    <p className="text-gray-300">8:00 AM - 11:00 PM</p>
                    <p className="text-gray-500 text-sm mt-1">After hours available</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Location</h3>
                    <p className="text-gray-300">Tampa Bay, Florida</p>
                    <p className="text-gray-500 text-sm mt-1">Serving the greater Tampa Bay area</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
