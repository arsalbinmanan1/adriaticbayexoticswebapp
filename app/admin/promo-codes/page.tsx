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
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { format } from "date-fns";
import { PromoDialog } from "@/components/admin/PromoDialog";

export default async function PromoCodesPage() {
  const supabase = createAdminClient();
  
  const { data: promos } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Promo Codes</h1>
          <p className="text-neutral-400 mt-1">Manage discounts and seasonal marketing campaigns.</p>
        </div>
        <PromoDialog trigger={
          <Button className="bg-white text-black hover:bg-neutral-200">
            <Plus className="mr-2 h-4 w-4" /> Create Promo Code
          </Button>
        } />
      </div>

      <div className="rounded-md border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900">
            <TableRow className="hover:bg-transparent border-neutral-800">
              <TableHead className="text-neutral-400">Code</TableHead>
              <TableHead className="text-neutral-400">Discount</TableHead>
              <TableHead className="text-neutral-400">Usage</TableHead>
              <TableHead className="text-neutral-400">Expiry</TableHead>
              <TableHead className="text-neutral-400">Status</TableHead>
              <TableHead className="text-right text-neutral-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos?.map((promo) => {
              const isExpired = promo.expires_at && new Date(promo.expires_at) < new Date();
              const isMaxed = promo.max_uses && promo.used_count >= promo.max_uses;
              const isActive = promo.status === 'active' && !isExpired && !isMaxed;

              return (
                <TableRow key={promo.id} className="hover:bg-neutral-800/50 border-neutral-800">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-neutral-500" />
                        <span className="font-mono font-bold text-white">{promo.code}</span>
                      </div>
                      {promo.description && (
                        <span className="text-xs text-neutral-500">{promo.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {promo.discount_type === "percentage" ? `${promo.discount_value}% OFF` : `$${promo.discount_value} OFF`}
                  </TableCell>
                  <TableCell className="text-neutral-400 text-sm">
                    {promo.used_count || 0} / {promo.max_uses || "∞"}
                  </TableCell>
                  <TableCell className="text-neutral-400 text-sm">
                    {promo.expires_at ? format(new Date(promo.expires_at), "MMM d, yyyy") : "No expiry"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "capitalize px-2 py-0.5",
                      isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {promo.status === 'inactive' ? 'Inactive' : isActive ? "Active" : isExpired ? "Expired" : "Maxed Out"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-neutral-400">
                     <div className="flex justify-end gap-2">
                        <PromoDialog promo={promo} trigger={
                          <Button variant="ghost" size="icon" className="hover:text-white hover:bg-neutral-800">
                            <Edit className="h-4 w-4" />
                          </Button>
                        } />
                        <Button variant="ghost" size="icon" className="hover:text-red-500 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {(!promos || promos.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-neutral-500">
                  No promo codes found.
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
