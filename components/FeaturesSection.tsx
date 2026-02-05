"use client";

import { Shield, Clock, Award, Headphones } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Fully Insured",
      description: "Comprehensive coverage for complete peace of mind during your luxury experience.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance to ensure your journey is always smooth.",
    },
    {
      icon: Award,
      title: "Premium Service",
      description: "White-glove service tailored to your every need and preference.",
    },
    {
      icon: Headphones,
      title: "Concierge",
      description: "Dedicated concierge team ready to handle all your special requests.",
    },
  ];

  return (
    <section className="py-24 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            FULLY INSURED
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-red-600 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600/20 to-yellow-500/20 flex items-center justify-center mb-4 group-hover:from-red-600/30 group-hover:to-yellow-500/30 transition-colors">
                  <Icon className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
