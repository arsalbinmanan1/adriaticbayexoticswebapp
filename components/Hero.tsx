"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="animate-fadeInUp">
          <div className="inline-block mb-4">
            <span className="text-yellow-400 text-sm font-semibold tracking-[0.3em] uppercase">
              Luxury Exotics
            </span>
          </div>
          
          <div className="mb-6">
            <img 
              src="/adriaticlogo.png" 
              alt="Adriatic Bay Exotics" 
              className="h-32 md:h-40 lg:h-70 w-auto mx-auto"
            />
          </div>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Unleash the thrill of driving world-class luxury vehicles. Experience unparalleled elegance,
            performance, and sophistication with our premium fleet of exotic cars.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/fleet">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
              >
                View Our Collection
              </Button>
            </a>
            <a href="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
              >
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-yellow-400" />
      </div>
    </section>
  );
}
