"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Car,
  Users,
  Tag,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Bookings", icon: CalendarDays, href: "/admin/bookings" },
  { label: "Fleet", icon: Car, href: "/admin/cars" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Promo Codes", icon: Tag, href: "/admin/promo-codes" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const NavContent = ({ collapsed, pathname }: { collapsed: boolean; pathname: string }) => (
  <div className="flex flex-col h-full bg-neutral-950 text-white border-r border-neutral-800">
    <div className="p-6 flex items-center gap-3">
      <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-bold">A</div>
      {!collapsed && <span className="font-bold text-lg">Adriatic Admin</span>}
    </div>

    <ScrollArea className="flex-1 px-4">
      <nav className="space-y-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === item.href 
                ? "bg-white text-black" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </ScrollArea>

    <div className="p-4 border-t border-neutral-800">
      <button
        onClick={() => {
           // Handle logout
           fetch("/api/admin/logout", { method: "POST" }).then(() => window.location.href = "/admin/login");
        }}
        className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  </div>
);

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-neutral-900 border-neutral-800 text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-neutral-800 text-white">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <NavContent collapsed={false} pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Nav */}
      <aside className={cn(
        "hidden lg:block fixed left-0 top-0 h-screen transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}>
        <NavContent collapsed={collapsed} pathname={pathname} />
        <Button
          variant="secondary"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-neutral-800 bg-neutral-950 text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </aside>
    </>
  );
}
