import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  CalendarDays, 
  DollarSign, 
  Car,
  TrendingUp,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { Tag } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createAdminClient();

  // 1. Fetch Stats
  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, cars(make, model)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: revenueData } = await supabase
    .from("bookings")
    .select("total_amount")
    .eq("payment_status", "deposit_paid");

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

  const { count: activeRentals } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: pendingBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "Confirmed bookings",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Total Bookings",
      value: totalBookings || 0,
      description: "Lifetime rentals",
      icon: CalendarDays,
      color: "text-blue-500",
    },
    {
      title: "Active Rentals",
      value: activeRentals || 0,
      description: "Currently on the road",
      icon: Car,
      color: "text-purple-500",
    },
    {
      title: "Pending Actions",
      value: pendingBookings || 0,
      description: "Need confirmation",
      icon: Activity,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white underline decoration-white/20 underline-offset-8">Dashboard Overview</h1>
        <p className="text-neutral-400 mt-2">Welcome back to the Adriatic Bay Exotics command center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-neutral-400 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4 border-neutral-800 bg-neutral-900/50 text-white">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Quick Actions / Activity */}
        <Card className="col-span-3 border-neutral-800 bg-neutral-900/50 text-white">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <button className="flex items-center justify-between p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors text-sm">
                <span>Manage Fleet</span>
                <Car className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-between p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors text-sm">
                <span>View All Bookings</span>
                <CalendarDays className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-between p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors text-sm">
                <span>Update Promo Codes</span>
                <Tag className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
