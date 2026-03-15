"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SpinWheelPopup from "./SpinWheelPopup";

export default function TestMarketingPopups() {
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button
        onClick={() => setShowSpinWheel(true)}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
      >
        Test Spin Wheel
      </Button>

      <SpinWheelPopup isOpen={showSpinWheel} onClose={() => setShowSpinWheel(false)} />
    </div>
  );
}
