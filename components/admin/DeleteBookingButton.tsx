"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteBookingButtonProps {
  bookingId: string;
  bookingRef: string;
}

export function DeleteBookingButton({ bookingId, bookingRef }: DeleteBookingButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/bookings");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete booking");
      }
    } catch (error) {
      alert("Failed to delete booking");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-red-600 text-red-500 hover:bg-red-500/10"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Booking
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-neutral-900 border-neutral-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            Are you sure you want to delete booking <span className="font-mono font-bold text-red-500">#{bookingRef}</span>?
            This action cannot be undone and will permanently remove all booking data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
