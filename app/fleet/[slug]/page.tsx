import { getCarBySlug, getAllCars } from "@/lib/supabase/cars";
import { notFound } from "next/navigation";
import CarDetailClient from "@/components/CarDetailClient";

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CarDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) {
    notFound();
  }

  const allCars = await getAllCars();
  const otherCars = allCars.filter(c => c.id !== car.id).slice(0, 4);

  return <CarDetailClient car={car} otherCars={otherCars} />;
}
