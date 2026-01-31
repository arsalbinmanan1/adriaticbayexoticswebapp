"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, Copy, Check } from "lucide-react";
import Link from "next/link";

interface ValentinesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROMO_CODE = "VALENTINE2026";

export default function ValentinesPopup({ isOpen, onClose }: ValentinesPopupProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const featuredCars = [
    { name: "Corvette C8-R", slug: "corvette-c8-r", price: "$419" },
    { name: "McLaren 570S", slug: "mclaren-570s", price: "$1,199" },
    { name: "Maserati Levante", slug: "maserati-levante", price: "$199" },
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

      <Card className="relative bg-gradient-to-br from-red-900/95 via-pink-900/95 to-red-900/95 border-red-600 max-w-3xl w-full my-4 shadow-2xl overflow-hidden backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <CardContent className="p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-3">
              <Heart
                className="w-12 h-12 text-red-500 animate-pulse"
                fill="currentColor"
              />
              <div className="absolute inset-0 animate-ping">
                <Heart className="w-12 h-12 text-red-500 opacity-75" fill="currentColor" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Valentine's Special</h2>
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-4">
              <p className="text-xl md:text-2xl font-bold text-white">20% OFF AUTOMATIC</p>
            </div>
            <p className="text-pink-100 text-lg">Use code below or click "Book Now" to apply</p>
          </div>

          {/* Promo Code Display */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-center group cursor-pointer hover:bg-white/10 transition-colors" onClick={copyToClipboard}>
            <p className="text-pink-200 text-xs uppercase tracking-widest mb-2">Exclusive Promo Code</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-3xl md:text-4xl font-mono font-bold text-white tracking-widest">
                {PROMO_CODE}
              </code>
              {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />}
            </div>
          </div>

          {/* Featured Cars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {featuredCars.map((car) => (
              <div
                key={car.slug}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-500/50 transition-all hover:scale-105"
              >
                <h3 className="text-white font-bold text-base mb-1">{car.name}</h3>
                <p className="text-pink-300 font-bold mb-3">{car.price}/day</p>
                <Link href={`/fleet/${car.slug}?promo=${PROMO_CODE}`}>
                  <Button
                    onClick={onClose}
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/fleet?promo=${PROMO_CODE}`} className="w-full sm:w-auto">
              <Button
                onClick={onClose}
                className="bg-white text-red-600 hover:bg-pink-100 font-bold px-8 rounded-full w-full"
              >
                Book Now & Save
              </Button>
            </Link>
          </div>
          <p className="text-white/40 text-[10px] text-center mt-6">
            * Offer valid from Feb 10 - Feb 17, 2026. Cannot be combined with other offers.
          </p>
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
