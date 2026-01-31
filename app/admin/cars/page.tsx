import { createAdminClient } from "@/lib/supabase/admin";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Trash2, Car as CarIcon } from "lucide-react";
import Image from "next/image";

export default async function CarsPage() {
  const supabase = createAdminClient();
  
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "booked": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "maintenance": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "inactive": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-neutral-500/10 text-neutral-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Car Fleet</h1>
          <p className="text-neutral-400 mt-1">Manage your luxury vehicle inventory and availability.</p>
        </div>
        <Link href="/admin/cars/new">
          <Button className="bg-white text-black hover:bg-neutral-200">
            <Plus className="mr-2 h-4 w-4" /> Add New Car
          </Button>
        </Link>
      </div>

      <div className="rounded-md border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900">
            <TableRow className="hover:bg-transparent border-neutral-800">
              <TableHead className="text-neutral-400 w-[80px]">Image</TableHead>
              <TableHead className="text-neutral-400">Vehicle</TableHead>
              <TableHead className="text-neutral-400">VIN & Plate</TableHead>
              <TableHead className="text-neutral-400">Daily Rate</TableHead>
              <TableHead className="text-neutral-400">Status</TableHead>
              <TableHead className="text-right text-neutral-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars?.map((car) => (
              <TableRow key={car.id} className="hover:bg-neutral-800/50 border-neutral-800">
                <TableCell>
                  <div className="h-10 w-16 relative rounded overflow-hidden bg-neutral-800">
                    {car.images?.[0] ? (
                      <Image 
                        src={car.images[0]} 
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                         <CarIcon className="h-4 w-4 text-neutral-600" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{car.make} {car.model}</span>
                    <span className="text-xs text-neutral-500">{car.year}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-neutral-300">{car.vin}</span>
                    <span className="text-xs text-neutral-500">{car.license_plate}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white font-medium">
                  ${Number(car.daily_rate).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize px-2 py-0.5", getStatusColor(car.status))}>
                    {car.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/cars/${car.id}/edit`}>
                      <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-red-500 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!cars || cars.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-neutral-500">
                  No cars found in your fleet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
