"use client";

import Image from "next/image";

export default function PaymentMethodsBanner() {
  const paymentMethods = [
    { name: "Zelle", logo: "/payment-logos/zelle.png" },
    { name: "Cash App", logo: "/payment-logos/cashapp.png" },
    { name: "Venmo", logo: "/payment-logos/venmo.png" },
    { name: "Square", logo: "/payment-logos/square.png" },
    { name: "PayPal", logo: "/payment-logos/paypal.png" },
    { name: "Apple Pay", logo: "/payment-logos/applepay.png" },
    { name: "Google Pay", logo: "/payment-logos/googlepay.png" },
  ];

  return (
    <section className="py-8 bg-zinc-900 border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-400 text-sm mb-4 font-semibold">
          We Accept
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {paymentMethods.map((method) => (
            <div
              key={method.name}
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={method.logo}
                alt={`${method.name} payment`}
                width={80}
                height={40}
                className="object-contain h-8 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
