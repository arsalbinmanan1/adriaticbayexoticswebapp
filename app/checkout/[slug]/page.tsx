import { getCarBySlug } from "@/lib/supabase/cars";
import { notFound } from "next/navigation";
import CheckoutContent from "@/components/payments/CheckoutContent";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function CheckoutPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const promoCode = typeof search.promo === 'string' ? search.promo : undefined;
  
  const car = await getCarBySlug(slug);

  if (!car) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />
      
      {/* Hero Header */}
      <div className="pt-32 pb-12 bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-zinc-700">/</span>
            <Link href="/fleet" className="hover:text-white transition-colors">Fleet</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-white">Checkout</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">
            BOOK YOUR <span className="text-red-600">EXPERIENCE</span>
          </h1>
          <p className="text-zinc-500 mt-2">Complete the form below to secure your {car.year} {car.name}</p>
        </div>
      </div>


      <div className="bg-zinc-950">
        <CheckoutContent car={car} initialPromoCode={promoCode} />
      </div>

      <Footer />
    </div>
  );
}
