"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCars } from "@/lib/supabase/cars";
import { Car } from "@/lib/cars-data";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function FleetPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadCars() {
      const data = await getAllCars();
      setCars(data);
      setLoading(false);
    }
    loadCars();
  }, []);

  const filteredCars = selectedCategory === "all" 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);


  const categories = [
    { id: "all", label: "All Vehicles" },
    { id: "exotic", label: "Exotic" },
    { id: "luxury", label: "Luxury" },
    { id: "sports", label: "Sports" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-red-600/10 to-yellow-500/10 text-yellow-400 border-yellow-500/30">
              Premium Collection
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our Exclusive Fleet
            </h1>
            <p className="text-gray-400 text-lg">
              Discover our carefully curated collection of the world&apos;s most prestigious and high-performance vehicles. Each car is maintained to the highest standards for your ultimate driving experience.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-zinc-950 sticky top-20 z-40 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`rounded-full px-6 ${
                  selectedCategory === category.id
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-zinc-700 text-gray-400 hover:border-yellow-500 hover:text-yellow-400"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-16 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, index) => (
              <Card
                key={car.id}
                className="group bg-zinc-900 border-zinc-800 overflow-hidden hover:border-red-600 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={car.images.main}
                    alt={car.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {car.available && (
                    <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                      Available
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">
                      {car.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {car.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-400">
                    <div>
                      <span className="text-gray-500">Exterior:</span> {car.colors.exterior}
                    </div>
                    <div>
                      <span className="text-gray-500">Interior:</span> {car.colors.interior}
                    </div>
                  </div>

                  {car.pricing.specialOffer && (
                    <div className="mb-4 p-2 bg-gradient-to-r from-red-600/20 to-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-400 font-bold text-center text-xs">
                        🎉 {car.pricing.specialOffer}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-zinc-800 pt-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Per Day</span>
                        <span className="text-2xl font-bold text-red-500">
                          ${car.pricing.perDay}
                        </span>
                      </div>
                      {car.pricing.fourHours && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">4 Hours</span>
                          <span className="text-lg font-semibold text-red-500">
                            ${car.pricing.fourHours}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Deposit</span>
                        <span className="text-gray-300">${car.pricing.deposit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/fleet/${car.slug}`} className="flex-1" scroll={true}>
                      <Button
                        variant="outline"
                        className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 rounded-full"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/checkout/${car.slug}`} className="flex-1" scroll={true}>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                No vehicles found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
