import { createAdminClient } from "@/lib/supabase/admin";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, ExternalLink, Users, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ViewMessageButton from "@/components/admin/ViewMessageButton";

export default async function CustomersPage() {
  const supabase = createAdminClient();
  
  // Fetch customers from bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("customer_name, customer_email, customer_phone, created_at")
    .order("created_at", { ascending: false });

  // Fetch marketing leads
  const { data: leads } = await supabase
    .from("marketing_leads")
    .select("*")
    .order("created_at", { ascending: false });

  // Combine and deduplicate customers
  const customerMap = new Map();

  // Add booking customers
  bookings?.forEach((booking) => {
    const email = booking.customer_email;
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
        source: "booking",
        created_at: booking.created_at,
      });
    }
  });

  // Add marketing leads
  leads?.forEach((lead) => {
    const email = lead.email || `phone_${lead.phone_number}`;
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        name: lead.full_name,
        email: lead.email || "N/A",
        phone: lead.phone_number,
        source: lead.source,
        created_at: lead.created_at,
        meta: lead.meta,
      });
    }
  });

  const allCustomers = Array.from(customerMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-500" />
            Customers & Leads
          </h1>
          <p className="text-neutral-400 mt-1">
            Manage your customer database from bookings and marketing campaigns.
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="border-green-500 text-green-400">
            {bookings?.length || 0} Bookings
          </Badge>
          <Badge variant="outline" className="border-amber-500 text-amber-400">
            {leads?.length || 0} Leads
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <Input 
          placeholder="Search by name, email, or phone..." 
          className="pl-10 border-neutral-800 bg-neutral-900 text-white" 
        />
      </div>

      <div className="rounded-md border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900">
            <TableRow className="hover:bg-transparent border-neutral-800">
              <TableHead className="text-neutral-400">Name</TableHead>
              <TableHead className="text-neutral-400">Email</TableHead>
              <TableHead className="text-neutral-400">Phone</TableHead>
              <TableHead className="text-neutral-400">Source</TableHead>
              <TableHead className="text-right text-neutral-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCustomers?.map((customer, idx) => (
              <TableRow key={idx} className="hover:bg-neutral-800/50 border-neutral-800">
                <TableCell className="font-medium text-white">
                  {customer.name}
                </TableCell>
                <TableCell className="text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-neutral-500" />
                    {customer.email}
                  </div>
                </TableCell>
                <TableCell className="text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-neutral-500" />
                    {customer.phone}
                  </div>
                </TableCell>
                <TableCell>
                  {customer.source === "booking" ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      Booking
                    </Badge>
                  ) : customer.source === "spin_wheel" ? (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Spin Wheel
                    </Badge>
                  ) : customer.source === "contact_form" ? (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                      <Mail className="w-3 h-3 mr-1" />
                      Contact Form
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-neutral-600 text-neutral-400">
                      {customer.source}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {customer.source === "booking" && customer.email !== "N/A" ? (
                    <Link href={`/admin/bookings?q=${customer.email}`}>
                      <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                        View Bookings <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  ) : customer.meta?.message ? (
                    <ViewMessageButton 
                      customerName={customer.name} 
                      message={customer.meta.message} 
                    />
                  ) : (
                    <span className="text-neutral-600 text-sm">Lead</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!allCustomers || allCustomers.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-neutral-500">
                  No customers or leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
