import { createAdminClient } from "@/lib/supabase/admin";
import { CarForm } from "@/components/admin/CarForm";
import { notFound } from "next/navigation";

export default async function EditCarPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createAdminClient();
  const { id } = await params;

  const { data: car } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (!car) {
    notFound();
  }

  return <CarForm initialData={car} isEdit />;
}
