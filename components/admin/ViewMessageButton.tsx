"use client";

import { Button } from "@/components/ui/button";

interface ViewMessageButtonProps {
  customerName: string;
  message: string;
}

export default function ViewMessageButton({ customerName, message }: ViewMessageButtonProps) {
  const handleViewMessage = () => {
    alert(`Message from ${customerName}:\n\n${message}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-neutral-400 hover:text-white hover:bg-neutral-800"
      onClick={handleViewMessage}
    >
      View Message
    </Button>
  );
}
