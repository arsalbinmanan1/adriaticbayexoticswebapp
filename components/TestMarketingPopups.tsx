"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SpinWheelPopup from "./SpinWheelPopup";
import ValentinesPopup from "./ValentinesPopup";

export default function TestMarketingPopups() {
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showValentines, setShowValentines] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button
        onClick={() => setShowSpinWheel(true)}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
      >
        Test Spin Wheel
      </Button>
      <Button
        onClick={() => setShowValentines(true)}
        className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg"
      >
        Test Valentine's
      </Button>

      <SpinWheelPopup isOpen={showSpinWheel} onClose={() => setShowSpinWheel(false)} />
      <ValentinesPopup isOpen={showValentines} onClose={() => setShowValentines(false)} />
    </div>
  );
}
