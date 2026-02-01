"use client";

import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-gradient-to-r from-red-600/10 to-amber-500/10 text-amber-400 border-amber-500/30">
              About Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              REDEFINING LUXURY
              <br />
              <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
                CAR RENTALS
              </span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              At Adriatic Bay Exotics, we believe that driving should be more than just transportation—it should be an unforgettable experience. Our curated collection features the world&apos;s most prestigious automotive masterpieces.
            </p>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              From the raw power of Italian supercars to the refined elegance of British luxury, each vehicle in our fleet represents the pinnacle of automotive excellence.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-sm text-gray-500">Rentals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent mb-2">50+</div>
                <div className="text-sm text-gray-500">Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent mb-2">4.9</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
            
            <Button 
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-full"
            >
              Discover Our Story
            </Button>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&auto=format&fit=crop"
                alt="Luxury Car"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
