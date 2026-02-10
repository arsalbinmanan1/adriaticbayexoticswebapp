'use client'

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CheckCircle2, Calendar, Mail, FileText, Share2, Download } from "lucide-react";
import { useSearchParams } from 'next/navigation';


function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    if (bookingId) {
      verifyPayment();
    } else {
      setVerificationError('No booking ID provided');
      setIsVerifying(false);
    }
  }, [bookingId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });

      const data = await response.json();

      if (data.success) {
        setBookingData(data.booking);
      } else {
        setVerificationError(data.error || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationError('An error occurred while verifying your payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const downloadICS = () => {
    // Basic ICS generation logic
    const content = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Car Rental - Adriatic Bay Exotics\nDESCRIPTION:Your luxury car rental experience.\nEND:VEVENT\nEND:VCALENDAR";
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'booking.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navigation />
        <div className="pt-40 pb-24 container mx-auto px-4 max-w-3xl text-center">
          <div className="mb-12 inline-block p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-full animate-pulse">
            <CheckCircle2 className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-6">
            VERIFYING <span className="text-yellow-600">PAYMENT</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-12">
            Please wait while we confirm your payment...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (verificationError) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navigation />
        <div className="pt-40 pb-24 container mx-auto px-4 max-w-3xl text-center">
          <div className="mb-12 inline-block p-4 bg-red-600/10 border border-red-600/20 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-6">
            VERIFICATION <span className="text-red-600">FAILED</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-12">
            {verificationError}
          </p>
          <Link href="/">
            <Button className="px-8 bg-red-600 hover:bg-red-700 text-white rounded-full h-14 font-bold">
              Return Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />

      <div className="pt-40 pb-24 container mx-auto px-4 max-w-3xl text-center">
        <div className="mb-12 inline-block p-4 bg-green-600/10 border border-green-600/20 rounded-full">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-6">
          BOOKING <span className="text-red-600">CONFIRMED</span>
        </h1>
        
        <p className="text-xl text-zinc-400 mb-12">
          Your payment has been received. Our team will contact you shortly to finalize your rental.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-left">
            <Mail className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-white font-bold mb-2">Check Your Email</h3>
            <p className="text-zinc-500 text-sm">We&apos;ve sent a confirmation and receipt to your inbox.</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-left">
            <FileText className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-white font-bold mb-2">Booking Reference</h3>
            <p className="text-zinc-200 font-mono text-sm">{bookingData?.reference || 'N/A'}</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-left md:col-span-2 lg:col-span-1">
            <Share2 className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-white font-bold mb-2">Share Experience</h3>
            <div className="flex gap-4 mt-2">
              <button className="text-zinc-500 hover:text-white transition-colors">Instagram</button>
              <button className="text-zinc-500 hover:text-white transition-colors">Facebook</button>
            </div>
          </div>
        </div>

        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-white font-bold">Add to your calendar</h4>
            <p className="text-zinc-500 text-xs">Don&apos;t forget your pickup date!</p>
          </div>
          <Button 
            onClick={downloadICS}
            variant="outline" 
            className="border-zinc-700 text-white hover:bg-zinc-800 rounded-full flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download .ics
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full md:w-auto px-8 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full h-14 font-bold">
              Return Home
            </Button>
          </Link>
          <Link href="/fleet">
            <Button className="w-full md:w-auto px-8 bg-red-600 hover:bg-red-700 text-white rounded-full h-14 font-bold">
              Explore More Fleet
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
