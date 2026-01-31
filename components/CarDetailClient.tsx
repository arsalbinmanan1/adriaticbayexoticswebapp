"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Car } from "@/lib/cars-data";
import Link from "next/link";
import {

  Phone,
  Mail,
  CheckCircle2,
  Gauge,
  Zap,
  Settings,
  Calendar,
  Shield,
  CreditCard,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react";

interface CarDetailClientProps {
  car: Car;
  otherCars: Car[];
}

export default function CarDetailClient({ car, otherCars }: CarDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(car.images.main);


  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />

      {/* Hero Section with Images */}
      <section className="pt-32 pb-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-amber-400">
              Home
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <Link href="/fleet" className="text-gray-400 hover:text-amber-400">
              Fleet
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-white">{car.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="mb-4 rounded-2xl overflow-hidden">
                <img
                  src={selectedImage}
                  alt={car.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {car.images.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === image
                        ? "border-red-600"
                        : "border-zinc-800 hover:border-amber-500/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${car.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Info */}
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-red-600/10 to-amber-500/10 text-amber-400 border-amber-500/30">
                {car.category.toUpperCase()}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {car.name}
              </h1>
              
              {/* The Vibe */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-amber-400 mb-2">The Vibe</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {car.detailedDescription.vibe}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-amber-400 mb-3">Key Highlights</h3>
                <ul className="space-y-2">
                  {car.detailedDescription.highlights.map((highlight, index) => (
                    <li key={index} className="text-gray-300 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-400 mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-zinc-800/50 rounded-lg">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Exterior Color</p>
                  <p className="text-white font-semibold">{car.colors.exterior}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Interior Color</p>
                  <p className="text-white font-semibold">{car.colors.interior}</p>
                </div>
              </div>

              {/* Pricing */}
              <Card className="bg-zinc-800 border-zinc-700 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Rental Pricing
                  </h3>
                  
                  {car.pricing.specialOffer && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-red-600/20 to-amber-500/20 border border-amber-500/30 rounded-lg">
                      <p className="text-amber-400 font-bold text-center text-sm">
                        🎉 {car.pricing.specialOffer}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-400" />
                        <span className="text-gray-300">Per Day</span>
                      </div>
                      <span className="text-3xl font-bold text-red-500">
                        ${car.pricing.perDay}
                      </span>
                    </div>
                    {car.pricing.fourHours && (
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-amber-400" />
                          <span className="text-gray-300">4 Hours</span>
                        </div>
                        <span className="text-2xl font-bold text-red-500">
                          ${car.pricing.fourHours}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">Security Deposit</span>
                      </div>
                      <span className="text-xl font-semibold text-white">
                        ${car.pricing.deposit}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact CTA */}
              <Card className="bg-gradient-to-br from-red-700 to-amber-600 border-0 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-white font-bold text-lg mb-4">
                    Contact Us for Booking
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    Have questions? Ready to book? Reach out to our CEOs directly.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/80 text-xs mb-2">CEO Emanuel</p>
                      <a
                        href="tel:+17272245544"
                        className="flex items-center gap-3 text-white hover:text-amber-100 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="font-semibold">+1 (727) 224-5544</span>
                      </a>
                      <p className="text-white/70 text-xs mt-1 ml-8">Italian, Spanish, English</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-xs mb-2">CEO Volis</p>
                      <a
                        href="tel:+17279220141"
                        className="flex items-center gap-3 text-white hover:text-amber-100 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="font-semibold">+1 (727) 922-0141</span>
                      </a>
                      <p className="text-white/70 text-xs mt-1 ml-8">Albanian, Greek, English</p>
                    </div>
                    <a
                      href="mailto:AdriaticBayExoticsLLC@gmail.com"
                      className="flex items-center gap-3 text-white hover:text-amber-100 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="font-semibold text-sm break-all">AdriaticBayExoticsLLC@gmail.com</span>
                    </a>
                    <div className="pt-3 border-t border-white/20">
                      <p className="text-white/80 text-xs">
                        <strong>Business Hours:</strong><br />
                        Monday - Sunday: 8am - 11pm<br />
                        <span className="text-white/60">After hours service available at additional fee</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Book Button */}
              <Link href={`/checkout/${car.slug}`}>
                <Button
                  id="book"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6 rounded-full"
                >
                  Book This Vehicle Now
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Specifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            <Card className="bg-zinc-900 border-zinc-800 text-center">
              <CardContent className="p-6">
                <Settings className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-1">Engine</p>
                <p className="text-white font-semibold text-sm">{car.specs.engine}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-center">
              <CardContent className="p-6">
                <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-1">Power</p>
                <p className="text-white font-semibold text-sm">{car.specs.horsepower}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-center">
              <CardContent className="p-6">
                <Gauge className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-1">0-60 mph</p>
                <p className="text-white font-semibold text-sm">
                  {car.specs.acceleration.replace("0-60 mph in ", "")}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-center">
              <CardContent className="p-6">
                <Gauge className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-1">Top Speed</p>
                <p className="text-white font-semibold text-sm">{car.specs.topSpeed}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-center">
              <CardContent className="p-6">
                <Settings className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-1">Trans.</p>
                <p className="text-white font-semibold text-sm">
                  {car.specs.transmission.replace("-Speed", "Spd")}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-center">
              <CardContent className="p-6">
                <Settings className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-1">Drive</p>
                <p className="text-white font-semibold text-sm">{car.specs.drivetrain}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {car.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Requirements */}
      <section className="py-16 bg-zinc-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Rental Requirements & Terms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Age Requirement</h3>
                    <p className="text-gray-400 text-sm">
                      Drivers must be at least 18 years old with a valid driver&apos;s
                      license. International licenses accepted with passport.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Valid License</h3>
                    <p className="text-gray-400 text-sm">
                      A valid driver&apos;s license held for at least 2 years is
                      required. Additional verification may be needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Credit Card</h3>
                    <p className="text-gray-400 text-sm">
                      A major credit card in the driver&apos;s name is required for
                      the security deposit and rental charges.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Driving Record</h3>
                    <p className="text-gray-400 text-sm">
                      Clean driving record required. No major violations or
                      accidents in the past 3 years.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Security Deposit</h3>
                    <p className="text-gray-400 text-sm">
                      ${car.pricing.deposit} refundable security deposit required.
                      Returned after inspection upon vehicle return.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Rental Period</h3>
                    <p className="text-gray-400 text-sm">
                      Minimum rental period applies. Extended rentals available
                      with special rates. Book in advance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherCars.map((otherCar) => (
              <Card
                key={otherCar.id}
                className="group bg-zinc-800 border-zinc-700 overflow-hidden hover:border-red-600 transition-all"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={otherCar.images.main}
                    alt={otherCar.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {otherCar.name}
                  </h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 text-sm">Per Day</span>
                    <span className="text-xl font-bold text-red-500">
                      ${otherCar.pricing.perDay}
                    </span>
                  </div>
                  <Link href={`/fleet/${otherCar.slug}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
