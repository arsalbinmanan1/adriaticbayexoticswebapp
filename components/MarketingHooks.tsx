"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SpinWheelPopup from "./SpinWheelPopup";
import ValentinesPopup from "./ValentinesPopup";
import MarketingBanner from "./MarketingBanner";

export default function MarketingHooks() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showValentines, setShowValentines] = useState(false);
  const [activeTime, setActiveTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);

  // Ensure component only runs on client side
  useEffect(() => {
    setIsMounted(true);
    
    // Auto-apply promo from URL
    const promo = searchParams.get("promo");
    if (promo) {
      localStorage.setItem("appliedPromoCode", promo.toUpperCase());
    }

    // Fetch active campaign for banner
    const fetchCampaign = async () => {
      try {
        const res = await fetch("/api/marketing/campaigns/active");
        if (res.ok) {
          const data = await res.json();
          setActiveCampaign(data);
        }
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };
    fetchCampaign();
  }, [searchParams]);

  // Valentine's season logic (February 10 - February 17)
  const isValentinesSeason = () => {
    const now = new Date();
    const month = now.getMonth(); 
    const day = now.getDate();
    return month === 1 && day >= 10 && day <= 17;
  };

  // Track user activity
  useEffect(() => {
    const handleActivity = () => setIsActive(true);
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => document.addEventListener(event, handleActivity));
    return () => events.forEach(event => document.removeEventListener(event, handleActivity));
  }, []);

  // Active time counter
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setActiveTime(prev => prev + 1), 1000);
    const inactivityTimeout = setTimeout(() => setIsActive(false), 30000);
    return () => {
      clearInterval(interval);
      clearTimeout(inactivityTimeout);
    };
  }, [isActive]);

  // Show Spin Wheel logic
  useEffect(() => {
    const lastSpinTime = localStorage.getItem('lastSpinWheelTime');
    if (!lastSpinTime) {
      const timer = setTimeout(() => setShowSpinWheel(true), 5000); // 5s delay
      return () => clearTimeout(timer);
    }
  }, []);

  // Show Spin Wheel on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight * 0.3; // 30% scroll
      if (scrollPos > threshold && !localStorage.getItem('lastSpinWheelTime')) {
        setShowSpinWheel(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show Valentine's popup
  useEffect(() => {
    if (!isMounted || !isValentinesSeason()) return;
    const hasSeenValentines = sessionStorage.getItem('hasSeenValentinesPopup');
    if (!hasSeenValentines) {
      const timer = setTimeout(() => {
        setShowValentines(true);
        sessionStorage.setItem('hasSeenValentinesPopup', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  const handleCloseSpinWheel = useCallback(() => {
    setShowSpinWheel(false);
    localStorage.setItem('lastSpinWheelTime', Date.now().toString());
  }, []);

  const handleCloseValentines = useCallback(() => {
    setShowValentines(false);
  }, []);

  const handleOpenSpinWheel = useCallback(() => {
    setShowSpinWheel(true);
  }, []);

  const handleOpenValentines = useCallback(() => {
    setShowValentines(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {activeCampaign && (
        <MarketingBanner 
          campaign={activeCampaign}
          onOpenSpinWheel={handleOpenSpinWheel}
          onOpenValentines={handleOpenValentines}
        />
      )}
      <SpinWheelPopup isOpen={showSpinWheel} onClose={handleCloseSpinWheel} />
      <ValentinesPopup isOpen={showValentines} onClose={handleCloseValentines} />
    </>
  );
}
