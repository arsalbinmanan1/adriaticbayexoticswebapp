"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import MarketingHooks from "./MarketingHooks";

/**
 * Wrapper component that only shows MarketingHooks on public pages
 * Hides marketing popups and banners on admin pages
 */
export default function ConditionalMarketingHooks() {
  const pathname = usePathname();
  
  // Don't show marketing hooks on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <Suspense fallback={null}>
      <MarketingHooks />
    </Suspense>
  );
}
