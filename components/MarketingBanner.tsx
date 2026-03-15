"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MarketingBannerProps {
  campaign: {
    name: string;
    endDate: string;
    promoCode: string;
    bannerText: string;
    theme: {
      primary: string;
      accent: string;
    };
  };
  onOpenSpinWheel?: () => void;
}

export default function MarketingBanner({ campaign, onOpenSpinWheel }: MarketingBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(campaign.endDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [campaign.endDate]);

  if (!timeLeft || !isVisible) return null;

  return (
    <div 
      className="sticky top-0 z-40 w-full py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in slide-in-from-top duration-500"
      style={{ backgroundColor: campaign.theme.primary, color: campaign.theme.accent }}
    >

      <div className="flex items-center gap-2 sm:gap-4">

        {/* Spin Wheel Button */}
        {onOpenSpinWheel && (
          <Button 
            size="sm"
            onClick={onOpenSpinWheel}
            className="bg-amber-500 text-white border-none hover:bg-amber-600 h-8 px-3 sm:px-4 rounded-full font-bold text-xs transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">7% flat discount</span>
            <span className="sm:hidden">7% flat</span>
          </Button>
        )}

        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
