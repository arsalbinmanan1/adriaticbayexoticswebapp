"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { getAllCars } from "@/lib/supabase/cars";
import { Car } from "@/lib/cars-data";
import Link from "next/link";


export default function CarListings() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const FALLBACK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#0b1220"/><text x="50%" y="50%" fill="#6b7280" font-family="Inter, Arial" font-size="20" text-anchor="middle" dominant-baseline="middle">No image available</text></svg>')}`;

  function normalizeSrc(src?: string) {
    if (!src) return '';
    const s = src.trim();
    if (/^https?:\/\//i.test(s)) return s;
    if (s.startsWith('/')) return s.replace(/^\/public/, '');
    const out = s.replace(/^\.\//, '').replace(/^public\//, '');
    return out.startsWith('/') ? out : `/${out}`;
  }

  useEffect(() => {
    async function loadCars() {
      const data = await getAllCars();
      setCars(data.slice(0, 4));
      setLoading(false);
    }
    loadCars();
  }, []);

  const handleCarClick = (slug: string) => {
    router.push(`/fleet/${slug}`);
  };


  return (
    <section id="fleet" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-red-600/10 to-yellow-500/10 text-yellow-400 border-yellow-500/30">
            New Arrivals
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            EXPLORE OUR FLEET
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our handpicked collection of the world&apos;s most prestigious vehicles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car, index) => (
            <Card
              key={car.id}
              className="group bg-zinc-900 border-zinc-800 overflow-hidden hover:border-red-600 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCarClick(car.slug)}
            >
              <div className="relative overflow-hidden">
                {car.images?.main ? (
                  <img
                    src={normalizeSrc(car.images.main)}
                    alt={car.name}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_SVG; }}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-56 bg-zinc-800 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
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
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {car.name}
                </h3>
                
                {car.location && (
                  <div className="flex items-center gap-1.5 mb-3 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{car.location}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-300 font-semibold">
                      {car.year}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-500">
                      ${car.pricing.perDay}
                    </div>
                    <div className="text-xs text-gray-500">per day</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/fleet/${car.slug}`} className="flex-1" scroll={true}>
                    <Button 
                      variant="outline"
                      className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 font-semibold rounded-full"
                    >
                      Details
                    </Button>
                  </Link>
                  <Link href={`/checkout/${car.slug}`} className="flex-1" scroll={true}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full">
                      Book Now
                    </Button>
                  </Link>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/fleet">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 px-8 rounded-full"
            >
              View Complete Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
