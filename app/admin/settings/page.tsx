import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Clock, DollarSign, ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const supabase = createAdminClient();
  
  const { data: settings } = await supabase.from("settings").select("*");
  
  const companyInfo = settings?.find(s => s.key === 'company_info')?.value || {};
  const businessHours = settings?.find(s => s.key === 'business_hours')?.value || {};
  const pricingConfig = settings?.find(s => s.key === 'pricing_config')?.value || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-neutral-400 mt-1">Configure your business rules, pricing, and company profile.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-neutral-900 border-neutral-800 text-neutral-400">
          <TabsTrigger value="general" className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white">General</TabsTrigger>
          <TabsTrigger value="hours" className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Business Hours</TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Pricing & Tax</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-neutral-400" /> Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue={companyInfo.name} className="bg-neutral-950 border-neutral-800" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue={companyInfo.email} className="bg-neutral-950 border-neutral-800" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue={companyInfo.phone} className="bg-neutral-950 border-neutral-800" />
                </div>
                <div className="space-y-2">
                  <Label>Full Address</Label>
                  <Input defaultValue={companyInfo.address} className="bg-neutral-950 border-neutral-800" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-neutral-800 pt-6">
              <Button className="ml-auto bg-white text-black hover:bg-neutral-200">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-neutral-400" /> Operation Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Object.entries(businessHours).map(([day, hours]) => (
                   <div key={day} className="space-y-2">
                     <Label className="capitalize">{day}</Label>
                     <Input defaultValue={hours as string} className="bg-neutral-950 border-neutral-800" />
                   </div>
                 ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-neutral-800 pt-6">
              <Button className="ml-auto bg-white text-black hover:bg-neutral-200">Save Hours</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-neutral-400" /> Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" defaultValue={pricingConfig.tax_rate} className="bg-neutral-950 border-neutral-800" />
                  <p className="text-xs text-neutral-500">Applied to all rental totals.</p>
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit (%)</Label>
                  <Input type="number" defaultValue={pricingConfig.security_deposit_percentage} className="bg-neutral-950 border-neutral-800" />
                  <p className="text-xs text-neutral-500">Percentage of total amount collected upfront.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-neutral-800 pt-6">
              <Button className="ml-auto bg-white text-black hover:bg-neutral-200">Update Pricing Rules</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
