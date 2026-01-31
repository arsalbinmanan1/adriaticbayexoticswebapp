"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

interface CarFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function CarForm({ initialData, isEdit }: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    make: initialData?.make || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    vin: initialData?.vin || "",
    license_plate: initialData?.license_plate || "",
    category: initialData?.category || "exotic",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    exterior_color: initialData?.exterior_color || "",
    interior_color: initialData?.interior_color || "",
    daily_rate: initialData?.daily_rate || "",
    four_hour_rate: initialData?.four_hour_rate || "",
    weekly_rate: initialData?.weekly_rate || "",
    monthly_rate: initialData?.monthly_rate || "",
    security_deposit: initialData?.security_deposit || "",
    status: initialData?.status || "available",
    current_location: initialData?.current_location || "",
    images: initialData?.images || [],
    features: initialData?.features || [],
    specifications: initialData?.specifications || {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/admin/cars/${initialData.id}` : "/api/admin/cars";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/cars");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save car");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt("Enter Image URL");
    if (url) {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/cars" className="flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fleet
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input 
                    id="make" 
                    value={formData.make} 
                    onChange={e => setFormData({...formData, make: e.target.value})}
                    required 
                    className="bg-neutral-950 border-neutral-800"
                    placeholder="Lamborghini"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input 
                    id="model" 
                    value={formData.model} 
                    onChange={e => setFormData({...formData, model: e.target.value})}
                    required 
                    className="bg-neutral-950 border-neutral-800"
                    placeholder="Huracan"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    type="number"
                    value={formData.year} 
                    onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                    required 
                    className="bg-neutral-950 border-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={val => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger className="bg-neutral-950 border-neutral-800">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                      <SelectItem value="exotic">Exotic</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input 
                  id="slug" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  required 
                  className="bg-neutral-950 border-neutral-800 font-mono"
                  placeholder="lamborghini-huracan"
                />
                <p className="text-xs text-neutral-500">Used in URL: /fleet/{formData.slug || 'car-slug'}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-sm"
                  placeholder="Enter a detailed description of the vehicle..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={val => setFormData({...formData, status: val})}
                >
                  <SelectTrigger className="bg-neutral-950 border-neutral-800">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader>
              <CardTitle>Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
                <Input 
                  id="vin" 
                  value={formData.vin} 
                  onChange={e => setFormData({...formData, vin: e.target.value})}
                  required 
                  className="bg-neutral-950 border-neutral-800 font-mono"
                  placeholder="1HGBH41JXMN109186"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_plate">License Plate</Label>
                <Input 
                  id="license_plate" 
                  value={formData.license_plate} 
                  onChange={e => setFormData({...formData, license_plate: e.target.value})}
                  required 
                  className="bg-neutral-950 border-neutral-800 font-mono"
                  placeholder="ABC123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_location">Current Location</Label>
                <Input 
                  id="current_location" 
                  value={formData.current_location} 
                  onChange={e => setFormData({...formData, current_location: e.target.value})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="Tampa Bay, FL"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daily_rate">Daily Rate ($)</Label>
                  <Input 
                    id="daily_rate" 
                    type="number"
                    step="0.01"
                    value={formData.daily_rate} 
                    onChange={e => setFormData({...formData, daily_rate: e.target.value})}
                    required 
                    className="bg-neutral-950 border-neutral-800"
                    placeholder="499.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="four_hour_rate">4-Hour Rate ($)</Label>
                  <Input 
                    id="four_hour_rate" 
                    type="number"
                    step="0.01"
                    value={formData.four_hour_rate} 
                    onChange={e => setFormData({...formData, four_hour_rate: e.target.value})}
                    className="bg-neutral-950 border-neutral-800"
                    placeholder="299.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weekly_rate">Weekly Rate ($)</Label>
                  <Input 
                    id="weekly_rate" 
                    type="number"
                    step="0.01"
                    value={formData.weekly_rate} 
                    onChange={e => setFormData({...formData, weekly_rate: e.target.value})}
                    className="bg-neutral-950 border-neutral-800"
                    placeholder="2999.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_rate">Monthly Rate ($)</Label>
                  <Input 
                    id="monthly_rate" 
                    type="number"
                    step="0.01"
                    value={formData.monthly_rate} 
                    onChange={e => setFormData({...formData, monthly_rate: e.target.value})}
                    className="bg-neutral-950 border-neutral-800"
                    placeholder="9999.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="security_deposit">Security Deposit ($)</Label>
                <Input 
                  id="security_deposit" 
                  type="number"
                  step="0.01"
                  value={formData.security_deposit} 
                  onChange={e => setFormData({...formData, security_deposit: e.target.value})}
                  required 
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="1000.00"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/50 text-white">
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exterior_color">Exterior Color</Label>
                <Input 
                  id="exterior_color" 
                  value={formData.exterior_color} 
                  onChange={e => setFormData({...formData, exterior_color: e.target.value})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="Giallo Orion (Pearl Yellow)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interior_color">Interior Color</Label>
                <Input 
                  id="interior_color" 
                  value={formData.interior_color} 
                  onChange={e => setFormData({...formData, interior_color: e.target.value})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="Black Alcantara"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-neutral-800 bg-neutral-900/50 text-white">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Engine</Label>
                <Input 
                  value={formData.specifications?.engine || ""} 
                  onChange={e => setFormData({...formData, specifications: {...formData.specifications, engine: e.target.value}})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="5.2L V10"
                />
              </div>
              <div className="space-y-2">
                <Label>Horsepower</Label>
                <Input 
                  value={formData.specifications?.horsepower || ""} 
                  onChange={e => setFormData({...formData, specifications: {...formData.specifications, horsepower: e.target.value}})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="610 HP"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>0-60 mph</Label>
                <Input 
                  value={formData.specifications?.acceleration || ""} 
                  onChange={e => setFormData({...formData, specifications: {...formData.specifications, acceleration: e.target.value}})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="2.9 seconds"
                />
              </div>
              <div className="space-y-2">
                <Label>Top Speed</Label>
                <Input 
                  value={formData.specifications?.topSpeed || ""} 
                  onChange={e => setFormData({...formData, specifications: {...formData.specifications, topSpeed: e.target.value}})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="202 mph"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transmission</Label>
                <Input 
                  value={formData.specifications?.transmission || ""} 
                  onChange={e => setFormData({...formData, specifications: {...formData.specifications, transmission: e.target.value}})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="7-Speed Dual-Clutch"
                />
              </div>
              <div className="space-y-2">
                <Label>Drivetrain</Label>
                <Input 
                  value={formData.specifications?.drivetrain || ""} 
                  onChange={e => setFormData({...formData, specifications: {...formData.specifications, drivetrain: e.target.value}})}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="AWD"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vehicle Images</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addImageUrl}
              className="border-neutral-700 hover:bg-neutral-800"
            >
              <Upload className="h-4 w-4 mr-2" /> Add URL
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((url: string, index: number) => (
                <div key={index} className="relative aspect-video rounded-md bg-neutral-950 border border-neutral-800 group overflow-hidden">
                  <img src={url} alt="Vehicle" className="h-full w-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className="col-span-full border-2 border-dashed border-neutral-800 rounded-lg p-8 text-center text-neutral-500">
                  No images added yet. Click &quot;Add URL&quot; to add vehicle photos.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50 text-white">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <textarea 
                value={Array.isArray(formData.features) ? formData.features.join('\n') : ""} 
                onChange={e => setFormData({...formData, features: e.target.value.split('\n').filter(f => f.trim())})}
                rows={8}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-sm font-mono"
                placeholder={"Premium Sound System\nCarbon Fiber Interior\nSport Exhaust\nLift System\nRear-View Camera\nParking Sensors"}
              />
              <p className="text-xs text-neutral-500">Enter each feature on a new line</p>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <div className="flex justify-end gap-3">
          <Link href="/admin/cars">
            <Button type="button" variant="ghost" className="text-neutral-400 hover:text-white">Cancel</Button>
          </Link>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-white text-black hover:bg-neutral-200 min-w-[120px]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? "Update Vehicle" : "Create Vehicle"}
          </Button>
        </div>
      </form>
    </div>
  );
}
