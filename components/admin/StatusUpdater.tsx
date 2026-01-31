"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface StatusUpdaterProps {
  bookingId: string;
  currentStatus: string;
}

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "active", label: "Active (Picked Up)" },
  { value: "completed", label: "Completed (Returned)" },
  { value: "cancelled", label: "Cancelled" },
];

export function StatusUpdater({ bookingId, currentStatus }: StatusUpdaterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [reason, setReason] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-neutral-200">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="border-neutral-800 bg-neutral-900 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Changing the status may trigger automated notifications to the customer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">New Status</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="bg-neutral-950 border-neutral-800">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-950 border-neutral-800 text-white font-medium">
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
             <label className="text-sm font-medium">Internal Note (Optional)</label>
             <textarea 
               className="flex min-h-[80px] w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
               placeholder="Why is this status being updated?"
               value={reason}
               onChange={(e) => setReason(e.target.value)}
             />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)}
            className="text-neutral-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={loading || newStatus === currentStatus}
            className="bg-white text-black hover:bg-neutral-200"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
