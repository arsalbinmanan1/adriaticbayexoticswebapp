"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Gift, Copy, Check } from "lucide-react";
import Swal from "sweetalert2";

interface DiscountPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  phoneNumber: string;
}

export default function DiscountPopup({ isOpen, onClose }: DiscountPopupProps) {
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Submit to backend to create promo code
      const response = await fetch("/api/marketing/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          discountPercentage: 7,
        }),
      });

      const result = await response.json();

      if (response.ok && result.promoCode) {
        setPromoCode(result.promoCode);
        setShowPromoCode(true);
        
        // Show success message
        Swal.fire({
          title: "🎉 Success!",
          text: `You've got a 7% discount! Your promo code: ${result.promoCode}`,
          icon: "success",
          background: "#18181b",
          color: "#fff",
          confirmButtonColor: "#dc2626",
        });
      } else {
        console.error("API Error:", result);
        throw new Error(result.message || "Failed to generate promo code");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    Swal.fire({
      title: "Copied!",
      text: "Promo code copied to clipboard",
      icon: "success",
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleClose = () => {
    reset();
    setShowPromoCode(false);
    setPromoCode("");
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="relative bg-zinc-900 border-zinc-800 max-w-md w-full">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <CardContent className="p-8">
          {!showPromoCode ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Get 7% Off Your Rental!
                </h2>
                <p className="text-gray-400">
                  Enter your details below to receive your exclusive discount code
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    {...register("fullName", { required: "Full name is required" })}
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[\d\s\-\+\(\)]+$/,
                        message: "Invalid phone number",
                      },
                    })}
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-bold py-3 rounded-lg"
                >
                  {isSubmitting ? "Processing..." : "Get My Discount"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                Congratulations! 🎉
              </h2>
              
              <p className="text-gray-400 mb-6">
                You've unlocked a 7% discount on any car!
              </p>

              <div className="p-4 bg-gradient-to-r from-red-600/20 to-yellow-500/20 border-2 border-yellow-500 rounded-lg mb-6">
                <p className="text-sm text-gray-400 mb-2">Your Promo Code:</p>
                <p className="text-3xl font-bold text-yellow-400 tracking-wider mb-3">
                  {promoCode}
                </p>
                <Button
                  onClick={copyPromoCode}
                  variant="outline"
                  size="sm"
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <a href="/fleet">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600">
                    Browse Our Fleet
                  </Button>
                </a>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
