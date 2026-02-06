"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Shield, Users, Zap, TrendingUp, Heart } from "lucide-react";

export default function AboutPageContent() {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in vehicle selection, maintenance, and customer service.",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Building lasting relationships through transparency, reliability, and integrity.",
    },
    {
      icon: Heart,
      title: "Service",
      description: "Personalized attention and 24/7 concierge support for every client.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Continuously evolving to provide cutting-edge luxury experiences.",
    },
  ];

  const stats = [
    {
      value: "5+",
      label: "Exotic Vehicles",
      icon: TrendingUp,
    },
    {
      value: "100+",
      label: "Happy Clients",
      icon: Users,
    },
    {
      value: "3+",
      label: "Years Experience",
      icon: Award,
    },
    {
      value: "24/7",
      label: "Customer Service",
      icon: Shield,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-red-600/10 to-yellow-500/10 text-yellow-400 border-yellow-500/30">
              Our Story
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              About{" "}
              <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                Adriatic Bay Exotics
              </span>
            </h1>
            <p className="text-xl text-gray-400 italic mb-2">
              European soul. Coastal luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Heritage Section */}
      <section className="py-16 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Adriatic Bay
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent mb-6">
                Exotics
              </h3>
            </div>
            
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 md:p-12">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                <span className="text-yellow-400 font-semibold">Adriatic Bay</span> represents the heritage and power of the Adriatic Sea, which connects Italy and Albania—the homelands of our owners.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                The <span className="text-yellow-400 font-semibold">"Bay"</span> perfectly captures our Florida spirit, evoking the sophistication of Monaco, Split, and Milan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Our Mission
                </h2>
                <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                  <p>
                    At Adriatic Bay Exotics, we believe that driving should be an extraordinary experience. Our mission is to provide discerning clients with access to the world&apos;s most exclusive and high-performance vehicles, paired with exceptional service that exceeds expectations.
                  </p>
                  <p>
                    Founded by automotive enthusiasts, we&apos;ve curated a collection of the finest exotic and luxury vehicles. Each car in our fleet is meticulously maintained and presented in pristine condition, ensuring every journey is memorable.
                  </p>
                  <p>
                    We don&apos;t just rent cars—we provide access to automotive masterpieces. From the raw power of Italian supercars to the refined elegance of British luxury, our fleet represents the pinnacle of automotive engineering and design.
                  </p>
                  <p>
                    Whether you&apos;re celebrating a special occasion, making a statement at an event, or simply fulfilling a lifelong dream, Adriatic Bay Exotics transforms ordinary moments into extraordinary memories.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/landingpage.jpeg"
                    alt="Luxury Supercar"
                    className="w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-red-600/20 to-yellow-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-red-600/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-gray-400 text-lg">
              The principles that guide everything we do
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-500 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="group bg-zinc-900 border-zinc-800 hover:border-red-600 transition-all duration-300 hover:transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600/20 to-amber-500/20 flex items-center justify-center group-hover:from-red-600/30 group-hover:to-amber-500/30 transition-all">
                      <Icon className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      
      {/* Why Choose Us Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                  Adriatic Bay Exotics
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Experience the difference that sets us apart in luxury car rentals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600/20 to-amber-500/20 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Curated Collection
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Every vehicle in our fleet is hand-selected for its performance, design, and prestige. We only offer cars that meet our exacting standards of excellence.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600/20 to-amber-500/20 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Pristine Maintenance
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Our dedicated team ensures every vehicle is maintained to factory specifications and detailed to showroom condition before every rental.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600/20 to-amber-500/20 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    White-Glove Service
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    From your first inquiry to vehicle return, our concierge team provides personalized attention and support at every step.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600/20 to-amber-500/20 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Seamless Experience
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    We handle all the details—delivery, insurance, documentation—so you can focus on enjoying your dream car.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-24 bg-gradient-to-br from-red-700 via-red-600 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Commitment to You
            </h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              At Adriatic Bay Exotics, your satisfaction and safety are our top priorities. Every rental includes comprehensive insurance, 24/7 roadside assistance, and our commitment to making your luxury car experience unforgettable.
            </p>
            <p className="text-lg text-white/80">
              Join thousands of satisfied clients who have trusted us to deliver the ultimate driving experience.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
