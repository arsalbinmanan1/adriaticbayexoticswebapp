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
import { format } from "date-fns";
import Link from "next/link";
import { Eye, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createAdminClient();
  
  // Extract filters from URL
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const search = typeof searchParams.q === "string" ? searchParams.q : undefined;

  let query = supabase
    .from("bookings")
    .select("*, cars(make, model)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
  }

  const { data: bookings } = await query;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "confirmed": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-neutral-500/10 text-neutral-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Bookings</h1>
          <p className="text-neutral-400 mt-1">Manage and track all car rental reservations.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button className="bg-white text-black hover:bg-neutral-200">Export CSV</Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input 
            placeholder="Search bookings..." 
            className="pl-10 border-neutral-800 bg-neutral-900 text-white" 
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-neutral-900 border border-neutral-800 text-white rounded-md px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-md border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900">
            <TableRow className="hover:bg-transparent border-neutral-800">
              <TableHead className="text-neutral-400">Reference</TableHead>
              <TableHead className="text-neutral-400">Customer</TableHead>
              <TableHead className="text-neutral-400">Car</TableHead>
              <TableHead className="text-neutral-400">Dates</TableHead>
              <TableHead className="text-neutral-400">Status</TableHead>
              <TableHead className="text-neutral-400">Total</TableHead>
              <TableHead className="text-right text-neutral-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-neutral-800/50 border-neutral-800">
                <TableCell className="font-mono text-xs text-neutral-300">
                  {booking.id.slice(0, 8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{booking.customer_name}</span>
                    <span className="text-xs text-neutral-500">{booking.customer_email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-neutral-300 text-sm">
                  {booking.cars.make} {booking.cars.model}
                </TableCell>
                <TableCell className="text-neutral-300 text-sm">
                  <div className="flex flex-col">
                    <span>{format(new Date(booking.pickup_datetime), "MMM d, yyyy")}</span>
                    <span className="text-xs text-neutral-500">to {format(new Date(booking.dropoff_datetime), "MMM d")}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize px-2 py-0.5", getStatusColor(booking.status))}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-white font-medium">
                  ${Number(booking.total_amount).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {(!bookings || bookings.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-neutral-500">
                  No bookings found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Simple helper for CN if not available in this scope
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
