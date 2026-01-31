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
import { Search, Mail, Phone, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function CustomersPage() {
  const supabase = createAdminClient();
  
  // Fetch distinct customers based on email
  // In a more complex app, there'd be a separate customers table
  // but here we derive it from bookings for simplicity.
  const { data: bookings } = await supabase
    .from("bookings")
    .select("customer_name, customer_email, customer_phone")
    .order("customer_name");

  // Filter unique customers by email
  const uniqueCustomers = Array.from(new Set(bookings?.map(b => b.customer_email)))
    .map(email => bookings?.find(b => b.customer_email === email));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Customers</h1>
          <p className="text-neutral-400 mt-1">Manage your customer database and viewing their booking history.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <Input 
          placeholder="Search by name or email..." 
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
              <TableHead className="text-right text-neutral-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueCustomers?.map((customer, idx) => (
              <TableRow key={idx} className="hover:bg-neutral-800/50 border-neutral-800">
                <TableCell className="font-medium text-white">
                  {customer?.customer_name}
                </TableCell>
                <TableCell className="text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-neutral-500" />
                    {customer?.customer_email}
                  </div>
                </TableCell>
                <TableCell className="text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-neutral-500" />
                    {customer?.customer_phone}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/bookings?q=${customer?.customer_email}`}>
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                      View Bookings <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {(!uniqueCustomers || uniqueCustomers.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-neutral-500">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
