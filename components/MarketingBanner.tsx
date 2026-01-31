"use client";

import { useState, useEffect } from "react";
import { X, Timer } from "lucide-react";
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
}

export default function MarketingBanner({ campaign }: MarketingBannerProps) {
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
      <div className="flex items-center gap-2 font-medium text-sm md:text-base">
        <span className="hidden sm:inline">🔥</span>
        {campaign.bannerText}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-mono text-xs md:text-sm bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
          <Timer className="w-3.5 h-3.5" />
          <div className="flex gap-1">
            <span>{timeLeft.days}d</span>
            <span>{timeLeft.hours.toString().padStart(2, '0')}h</span>
            <span>{timeLeft.minutes.toString().padStart(2, '0')}m</span>
            <span>{timeLeft.seconds.toString().padStart(2, '0')}s</span>
          </div>
        </div>

        <Link href={`/fleet?promo=${campaign.promoCode}`}>
          <Button 
            size="sm" 
            className="bg-white text-zinc-900 border-none hover:bg-gray-100 h-8 px-4 rounded-full font-bold text-xs"
          >
            Apply Code
          </Button>
        </Link>

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
