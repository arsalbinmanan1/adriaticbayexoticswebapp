import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  CalendarDays, 
  Car, 
  User, 
  CreditCard, 
  MapPin, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { StatusUpdater } from "@/components/admin/StatusUpdater";

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createAdminClient();
  const { id } = await params;

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, cars(*)")
    .eq("id", id)
    .single();

  if (!booking) {
    notFound();
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("booking_id", id)
    .order("created_at", { ascending: false });

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
      <div className="flex items-center justify-between">
        <Link href="/admin/bookings" className="flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
        </Link>
        <div className="flex gap-2">
           <StatusUpdater bookingId={booking.id} currentStatus={booking.status} />
           <Button variant="outline" className="border-neutral-800 text-white hover:bg-neutral-900">
             Print Receipt
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Booking #{booking.id.slice(0, 8).toUpperCase()}
            </h1>
            <Badge variant="outline" className={cn("capitalize text-sm font-medium", getStatusColor(booking.status))}>
              {booking.status}
            </Badge>
          </div>
          <p className="text-neutral-400 mt-1">
            Created on {format(new Date(booking.created_at), "PPP p")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Rental Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-neutral-800 pb-4">
              <User className="h-5 w-5 text-neutral-400" />
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-neutral-500 font-bold tracking-wider">Full Name</p>
                  <p className="text-sm">{booking.customer_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-neutral-500 font-bold tracking-wider">Contact Info</p>
                  <p className="text-sm">{booking.customer_email}</p>
                  <p className="text-sm text-neutral-400">{booking.customer_phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-neutral-500 font-bold tracking-wider">Driver&apos;s License</p>
                  <p className="text-sm font-mono">{booking.license_number || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-neutral-500 font-bold tracking-wider">Customer ID</p>
                  <p className="text-xs font-mono text-neutral-500">{booking.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-neutral-800 pb-4">
              <Car className="h-5 w-5 text-neutral-400" />
              <CardTitle className="text-lg">Rental Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="h-16 w-24 relative rounded overflow-hidden">
                  <img src={booking.cars.images?.[0] || ""} alt="" className="object-cover h-full w-full" />
                </div>
                <div>
                  <h3 className="font-bold">{booking.cars.make} {booking.cars.model}</h3>
                  <p className="text-xs text-neutral-500">VIN: {booking.cars.vin}</p>
                </div>
                <Link href={`/admin/cars/${booking.cars.id}/edit`} className="ml-auto">
                   <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">View Car</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-neutral-500" />
                    <div>
                      <p className="text-xs uppercase text-neutral-500 font-bold tracking-wider">Pickup</p>
                      <p className="text-sm font-medium">{booking.pickup_location}</p>
                      <p className="text-xs text-neutral-400">{format(new Date(booking.pickup_datetime), "PPP p")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-neutral-500" />
                    <div>
                      <p className="text-xs uppercase text-neutral-500 font-bold tracking-wider">Dropoff</p>
                      <p className="text-sm font-medium">{booking.dropoff_location}</p>
                      <p className="text-xs text-neutral-400">{format(new Date(booking.dropoff_datetime), "PPP p")}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-neutral-500" />
                    <div>
                      <p className="text-xs uppercase text-neutral-500 font-bold tracking-wider">Duration</p>
                      <p className="text-sm font-medium">
                        {Math.ceil((new Date(booking.dropoff_datetime).getTime() - new Date(booking.pickup_datetime).getTime()) / (1000 * 60 * 60 * 24))} Days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Log / Notifications */}
          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader className="border-b border-neutral-800 pb-4">
              <CardTitle className="text-lg">Notification History</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {notifications?.map((notif) => (
                  <div key={notif.id} className="flex gap-3 text-sm pb-4 border-b border-neutral-800/50 last:border-0">
                    <div className={cn(
                      "mt-0.5 h-2 w-2 rounded-full shrink-0",
                      notif.delivery_status === "sent" ? "bg-green-500" : "bg-red-500"
                    )} />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{notif.subject}</p>
                        <p className="text-xs text-neutral-500">{format(new Date(notif.created_at), "MMM d, HH:mm")}</p>
                      </div>
                      <p className="text-xs text-neutral-400 uppercase tracking-tighter">Type: {notif.type.replace('_', ' ')}</p>
                      {notif.error_message && <p className="text-xs text-red-500">{notif.error_message}</p>}
                    </div>
                  </div>
                ))}
                {(!notifications || notifications.length === 0) && (
                  <p className="text-center py-4 text-neutral-500 text-sm">No notifications logged for this booking.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Financials */}
        <div className="space-y-6">
          <Card className="border-neutral-800 bg-neutral-900 shadow-xl text-white">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-neutral-800 pb-4">
              <CreditCard className="h-5 w-5 text-neutral-400" />
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Total Rental</span>
                  <span>${Number(booking.total_amount).toLocaleString()}</span>
                </div>
                {booking.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">Discount Applied</span>
                    <span className="text-green-500">-${Number(booking.discount_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-neutral-800 pt-2 font-bold">
                  <span>Grand Total</span>
                  <span className="text-lg">${Number(booking.total_amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                   <p className="text-xs uppercase text-neutral-500 font-bold">Payment Status</p>
                   <Badge className={cn(
                     "text-[10px] px-2 py-0",
                      booking.payment_status === "deposit_paid" ? "bg-green-500/10 text-green-500" : "bg-neutral-500/10 text-neutral-400"
                   )}>
                     {booking.payment_status.replace('_', ' ')}
                   </Badge>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-neutral-400 text-xs">Deposit Paid</span>
                   <span className="font-medium">${Number(booking.deposit_amount).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Manage Reservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <Button className="w-full justify-start text-xs border-neutral-800" variant="outline">
                 <CalendarDays className="mr-2 h-3 w-3" /> Reschedule Booking
               </Button>
                <Button className="w-full justify-start text-xs border-neutral-800 text-red-500 hover:text-red-400 hover:bg-red-500/10" variant="outline">
                 <XCircle className="mr-2 h-3 w-3" /> Cancel & Refund
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
