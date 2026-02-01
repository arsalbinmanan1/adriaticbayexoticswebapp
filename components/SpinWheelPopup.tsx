"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Gift, Copy, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface SpinWheelPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  phoneNumber: string;
}

const prizes = [
  { id: 1, text: "5% Off", color: "from-blue-600 to-blue-700", isWin: true },
  { id: 2, text: "10% Off", color: "from-red-600 to-red-700", isWin: true },
  { id: 3, text: "Try Again", color: "from-zinc-700 to-zinc-800", isWin: false },
  { id: 4, text: "15% Off", color: "from-amber-500 to-amber-600", isWin: true },
  { id: 5, text: "5% Off", color: "from-blue-600 to-blue-700", isWin: true },
  { id: 6, text: "10% Off", color: "from-red-600 to-red-700", isWin: true },
  { id: 7, text: "Try Again", color: "from-zinc-700 to-zinc-800", isWin: false },
  { id: 8, text: "20% Off", color: "from-green-600 to-green-700", isWin: true },
  { id: 9, text: "5% Off", color: "from-blue-600 to-blue-700", isWin: true },
  { id: 10, text: "10% Off", color: "from-red-600 to-red-700", isWin: true },
  { id: 11, text: "Try Again", color: "from-zinc-700 to-zinc-800", isWin: false },
  { id: 12, text: "15% Off", color: "from-amber-500 to-amber-600", isWin: true },
];

export default function SpinWheelPopup({ isOpen, onClose }: SpinWheelPopupProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<{text: string, isWin: boolean, promoCode?: string} | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setLocalFormData] = useState<FormData | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  // Reset state when popup opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all state when popup closes
      setHasSubmitted(false);
      setIsSpinning(false);
      setShowResult(false);
      setSelectedPrize(null);
      setLocalFormData(null);
      setCopied(false);
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: FormData) => {
    setLocalFormData(data);
    setHasSubmitted(true);
  };

  const spinWheel = async () => {
    if (isSpinning || !formData) return;

    setIsSpinning(true);
    setShowResult(false);

    try {
      const response = await fetch("/api/marketing/spin", {
        method: "POST",
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          campaignSlug: "spin-the-wheel",
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      // Find index of the prize to land on
      const prizeIndex = prizes.findIndex(p => p.text === result.prize);
      const segmentAngle = 360 / prizes.length;
      const targetAngle = 360 - (prizeIndex * segmentAngle) - (segmentAngle / 2);
      const spins = 8; 
      const finalRotation = rotation - (rotation % 360) + (360 * spins) + targetAngle;

      setRotation(finalRotation);
      setSelectedPrize({
        text: result.prize,
        isWin: !!result.promoCode,
        promoCode: result.promoCode,
      });

      setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);
        if (result.promoCode) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#dc2626', '#f59e0b', '#ffffff']
          });
        }
      }, 4000);
    } catch (error) {
      console.error("Spin error:", error);
      setIsSpinning(false);
    }
  };

  const copyToClipboard = () => {
    if (selectedPrize?.promoCode) {
      navigator.clipboard.writeText(selectedPrize.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setHasSubmitted(false);
    setShowResult(false);
    setRotation(0);
    setSelectedPrize(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="relative bg-zinc-900 border-zinc-800 max-w-3xl w-full my-4">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <CardContent className="p-6 md:p-8">
          {!hasSubmitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Spin to Win!</h2>
              <p className="text-gray-400 mb-6">Enter your details for a chance to win exclusive prizes</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
                <div>
                  <input
                    {...register("fullName", { required: "Full name is required" })}
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <input
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-bold py-3 rounded-lg"
                >
                  Continue to Spin
                </Button>

                <p className="text-xs text-gray-500 mt-4">
                  By submitting, you agree to receive promotional messages from Adriatic Bay Exotics.
                </p>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Spin the Wheel!</h2>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <div className="relative w-64 h-64 flex-shrink-0">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10">
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
                  </div>

                  <svg
                    className="w-full h-full drop-shadow-2xl"
                    viewBox="0 0 200 200"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                    }}
                  >
                    {prizes.map((prize, index) => {
                      const segmentAngle = 360 / prizes.length;
                      const startAngle = index * segmentAngle - 90;
                      const endAngle = startAngle + segmentAngle;
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const x1 = 100 + 100 * Math.cos(startRad);
                      const y1 = 100 + 100 * Math.sin(startRad);
                      const x2 = 100 + 100 * Math.cos(endRad);
                      const y2 = 100 + 100 * Math.sin(endRad);
                      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                      const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                      const midAngle = startAngle + segmentAngle / 2;
                      const textRadius = 65;
                      const textX = 100 + textRadius * Math.cos((midAngle * Math.PI) / 180);
                      const textY = 100 + textRadius * Math.sin((midAngle * Math.PI) / 180);
                      const textRotation = midAngle + 90;
                      
                      return (
                        <g key={prize.id}>
                          <path
                            d={pathData}
                            fill={prize.color.includes('red') ? '#dc2626' : prize.color.includes('amber') ? '#f59e0b' : prize.color.includes('green') ? '#16a34a' : prize.color.includes('blue') ? '#2563eb' : '#3f3f46'}
                            stroke="#1f1f1f"
                            strokeWidth="1"
                          />
                          <text
                            fill="white"
                            fontSize="8"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                          >
                            {prize.text}
                          </text>
                        </g>
                      );
                    })}
                    <circle cx="100" cy="100" r="15" fill="#18181b" stroke="white" strokeWidth="3" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  {!showResult ? (
                    <div className="text-center">
                      <Button
                        onClick={spinWheel}
                        disabled={isSpinning}
                        className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg disabled:opacity-50 shadow-xl"
                      >
                        {isSpinning ? "Spinning..." : "SPIN NOW!"}
                      </Button>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className={`p-4 rounded-xl ${selectedPrize?.isWin ? "bg-gradient-to-br from-red-600/20 to-amber-500/20 border-2 border-amber-500" : "bg-zinc-800 border border-zinc-700"}`}>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {selectedPrize?.isWin ? "🎉 Congratulations!" : "Better Luck Next Time!"}
                        </h3>
                        <p className="text-base text-gray-300 mb-3">
                          You won: <span className="font-bold text-amber-400">{selectedPrize?.text}</span>
                        </p>
                        
                        {selectedPrize?.promoCode && (
                          <div className="mb-4">
                            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 flex items-center justify-between gap-2 group">
                              <code className="text-xl font-mono font-bold text-white tracking-wider">
                                {selectedPrize.promoCode}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={copyToClipboard}
                                className="text-gray-400 hover:text-white"
                              >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              * Code valid for 7 days. Apply at checkout.
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={handleClose}
                            variant="outline"
                            size="sm"
                            className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
                          >
                            Close
                          </Button>
                          <a href="/fleet">
                            <Button size="sm" className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600">
                              Book Now
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
