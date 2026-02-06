"use client";

import Image from "next/image";
import Corvette from "@/public/logos/Corvette.png";
import mclaren from "@/public/logos/mclaren.png";
import lamborghini from "@/public/logos/lamborghini.png";
import maserati from "@/public/logos/maserati.png";

export default function BrandLogos() {
  const brands = [
    { name: "Corvette", icon: Corvette },
    { name: "McLaren", icon: mclaren },
    { name: "Lamborghini", icon: lamborghini },
    { name: "Maserati", icon: maserati },
  ];

  return (
    <section className="py-16 bg-zinc-950 border-y border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="text-center opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-2 grayscale hover:grayscale-0 transition-all flex items-center justify-center h-20 hover:ring-2 hover:ring-gray-400 rounded-lg p-4">
                <Image
                  src={brand.icon}
                  alt={`${brand.name} logo`}
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 font-semibold tracking-wider">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
