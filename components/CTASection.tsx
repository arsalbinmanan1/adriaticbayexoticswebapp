"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-red-700 via-red-600 to-amber-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            BEGIN YOUR JOURNEY
          </h2>
          
          <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            Experience the pinnacle of automotive luxury. Book your dream car today and create memories that last a lifetime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/fleet">
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-amber-50 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 group"
              >
                Book Your Experience
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
              >
                Contact Us
              </Button>
            </a>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold mb-2">8am-11pm</div>
              <div className="text-white/90">Daily Service Hours</div>
              <div className="text-sm text-white/70 mt-1">After hours available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-white/90">Fully Insured</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">18+</div>
              <div className="text-white/90">Age Requirement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
