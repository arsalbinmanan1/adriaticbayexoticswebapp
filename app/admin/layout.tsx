"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
