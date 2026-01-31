"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface PromoDialogProps {
  promo?: any;
  trigger: React.ReactNode;
}

export function PromoDialog({ promo, trigger }: PromoDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    code: promo?.code || "",
    discount_type: promo?.discount_type || "percentage",
    discount_value: promo?.discount_value || "",
    max_uses: promo?.max_uses || "",
    starts_at: promo?.starts_at ? new Date(promo.starts_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    expires_at: promo?.expires_at ? new Date(promo.expires_at).toISOString().split('T')[0] : "",
    min_booking_amount: promo?.min_booking_amount || 0,
    campaign_source: promo?.campaign_source || "",
    description: promo?.description || "",
    status: promo?.status || "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = promo ? `/api/admin/promo-codes/${promo.id}` : "/api/admin/promo-codes";
      const method = promo ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to save promo code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-neutral-800 bg-neutral-900 text-white sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{promo ? "Edit Promo Code" : "Create Promo Code"}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Set up discounts for your customers. Codes must be unique.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="code">Promo Code</Label>
              <Input
                id="code"
                placeholder="SUMMER24"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="bg-neutral-950 border-neutral-800 font-mono font-bold"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Summer 2024 promotion"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select 
                  value={formData.discount_type} 
                  onValueChange={(val) => setFormData({ ...formData, discount_type: val })}
                >
                  <SelectTrigger className="bg-neutral-950 border-neutral-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Discount Value</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="10"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="bg-neutral-950 border-neutral-800"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="starts_at">Start Date</Label>
                <Input
                  id="starts_at"
                  type="date"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  className="bg-neutral-950 border-neutral-800"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expires_at">Expiry Date</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="bg-neutral-950 border-neutral-800"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max_uses">Max Uses (Optional)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  placeholder="100"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                  className="bg-neutral-950 border-neutral-800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min_amount">Min Booking Amount ($)</Label>
                <Input
                  id="min_amount"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={formData.min_booking_amount}
                  onChange={(e) => setFormData({ ...formData, min_booking_amount: e.target.value })}
                  className="bg-neutral-950 border-neutral-800"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="campaign_source">Campaign Source</Label>
                <Input
                  id="campaign_source"
                  placeholder="spin_wheel, valentines, etc."
                  value={formData.campaign_source}
                  onChange={(e) => setFormData({ ...formData, campaign_source: e.target.value })}
                  className="bg-neutral-950 border-neutral-800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="bg-neutral-950 border-neutral-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black hover:bg-neutral-200"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {promo ? "Update Promo Code" : "Create Promo Code"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
