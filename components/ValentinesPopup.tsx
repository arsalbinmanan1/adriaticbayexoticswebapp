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

      <Card className="relative bg-gradient-to-br from-red-900/95 via-pink-900/95 to-red-900/95 border-red-600 max-w-md w-full my-4 shadow-2xl overflow-hidden backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <CardContent className="p-4 md:p-5">
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

            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Valentine's Special</h2>
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full mb-2">
              <p className="text-base md:text-lg font-bold text-white">20% OFF</p>
            </div>
            <p className="text-pink-100 text-sm">Use code or click "Book Now"</p>
          </div>

          {/* Promo Code Display */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 text-center group cursor-pointer hover:bg-white/10 transition-colors" onClick={copyToClipboard}>
            <p className="text-pink-200 text-[10px] uppercase tracking-widest mb-1">Promo Code</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-xl md:text-2xl font-mono font-bold text-white tracking-wider">
                {PROMO_CODE}
              </code>
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />}
            </div>
          </div>


          <div className="flex gap-2 justify-center">
            <Link href={`/fleet?promo=${PROMO_CODE}`} className="flex-1">
              <Button
                onClick={onClose}
                className="bg-white text-red-600 hover:bg-pink-100 font-bold px-4 py-2 rounded-full w-full text-sm"
              >
                Book Now & Save
              </Button>
            </Link>
          </div>
          <p className="text-white/40 text-[8px] text-center mt-3">
            * Valid Feb 10-17, 2026. Cannot be combined with other offers.
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
