"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";
import Link from "next/link";

interface ValentinesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROMO_CODE = "RENT2GET1FREE";

export default function ValentinesPopup({ isOpen, onClose }: ValentinesPopupProps) {
  if (!isOpen) return null;

  const featuredCars = [
    { name: "Corvette C8-R", slug: "corvette-c8-r", price: "$419/day" },
    { name: "McLaren 570S", slug: "mclaren-570s", price: "$1,199/day" },
    { name: "Maserati Levante", slug: "maserati-levante", price: "$199/day" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-red-500 opacity-20 animate-float-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 15 + 15}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      <Card className="relative bg-gradient-to-br from-red-900/95 via-pink-900/95 to-red-900/95 border-red-600 max-w-2xl w-full my-4 shadow-2xl overflow-hidden backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-1 hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </button>

        <CardContent className="p-4 md:p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="relative inline-block mb-2">
              <Heart
                className="w-8 h-8 text-red-500 animate-pulse"
                fill="currentColor"
              />
              <div className="absolute inset-0 animate-ping">
                <Heart className="w-8 h-8 text-red-500 opacity-75" fill="currentColor" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Valentine's Special</h2>
            <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full mb-2">
              <p className="text-base md:text-lg font-bold text-white">Buy 2 Days, Get 1 FREE</p>
            </div>
            <p className="text-pink-100 text-sm">Make this Valentine's unforgettable!</p>
          </div>

          {/* Featured Cars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {featuredCars.map((car) => (
              <div
                key={car.slug}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 hover:bg-white/15 transition-all"
              >
                <h3 className="text-white font-bold text-sm mb-1">{car.name}</h3>
                <p className="text-white text-lg font-bold mb-2">{car.price}</p>
                <Link href={`/checkout/${car.slug}?promo=${PROMO_CODE}`} onClick={onClose}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/90 text-red-700 hover:bg-white hover:text-red-800 border-0 font-semibold text-xs"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
            <p className="text-white text-xs text-center mb-2">
              <span className="text-pink-200 font-semibold">Limited time only</span> • Subject to availability
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/fleet" onClick={onClose}>
                <Button
                  size="sm"
                  className="bg-white text-red-600 hover:bg-pink-100 font-bold px-4 py-2 rounded-full text-sm w-full sm:w-auto"
                >
                  Explore Fleet
                </Button>
              </Link>
              <a href="tel:+17272245544">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-white hover:bg-white/10 border-2 border-white font-bold px-4 py-2 rounded-full text-sm w-full sm:w-auto"
                >
                  Call to Book
                </Button>
              </a>
            </div>
            <p className="text-white/60 text-[10px] text-center mt-2">
              * Cannot be combined with other offers
            </p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes float-heart {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-float-heart { animation: float-heart linear infinite; }
      `}</style>
    </div>
  );
}
