/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [uploading, setUploading] = useState(false);
  const [uploadingItems, setUploadingItems] = useState<Record<string, boolean>>({});
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
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
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const normalizeAdminInput = (input: string) => {
    let v = input.trim()
    v = v.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
    if (/^https?:\/\//i.test(v)) return v
    v = v.replace(/^\.\//, '').replace(/^public\//, '')
    if (!v.startsWith('/')) v = `/${v}`
    return v
  }
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    const maxBytes = 5 * 1024 * 1024

    fileArray.forEach((file) => {
      if (!allowed.includes(file.type)) {
        alert(`"${file.name}" is not allowed. Only PNG, JPG/JPEG and WEBP are supported.`)
        return
      }
      if (file.size > maxBytes) {
        alert(`"${file.name}" is too large (max 5 MB).`)
        return
      }

      const preview = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, images: [...prev.images, preview] }))
      setUploadingItems(prev => {
        const next = { ...prev, [preview]: true }
        setUploading(Object.keys(next).length > 0)
        return next
      })
      uploadFileAndReplace(file, preview)
    })
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    processFiles(files)
    e.currentTarget.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDropZoneActive(false)
    const files = e.dataTransfer.files
    if (!files?.length) return
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (imageFiles.length) processFiles(imageFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.types.includes('Files')) setDropZoneActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropZoneActive(false)
  }

  const uploadFileAndReplace = async (file: File, previewSrc: string) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowed.includes(file.type)) {
      alert('Only PNG, JPG/JPEG and WEBP are allowed')
      // cleanup preview
      setFormData(prev => ({ ...prev, images: prev.images.filter((i: string) => i !== previewSrc) }))
      URL.revokeObjectURL(previewSrc)
      setUploadingItems(prev => {
        const next = { ...prev }
        delete next[previewSrc]
        setUploading(Object.keys(next).length > 0)
        return next
      })
      return
    }
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) {
      alert('Image must be smaller than 5 MB')
      setFormData(prev => ({ ...prev, images: prev.images.filter((i: string) => i !== previewSrc) }))
      URL.revokeObjectURL(previewSrc)
      setUploadingItems(prev => {
        const next = { ...prev }
        delete next[previewSrc]
        setUploading(Object.keys(next).length > 0)
        return next
      })
      return
    }

    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Upload failed')
        // remove preview
        setFormData(prev => ({ ...prev, images: prev.images.filter((i: string) => i !== previewSrc) }))
        return
      }

      // replace preview with returned path
      setFormData(prev => ({ ...prev, images: prev.images.map((i: string) => (i === previewSrc ? data.path : i)) }))
    } catch (err) {
      console.error('Upload error', err)
      alert('Upload failed')
      setFormData(prev => ({ ...prev, images: prev.images.filter((i: string) => i !== previewSrc) }))
    } finally {
      // cleanup preview state + revoke object url
      setUploadingItems(prev => {
        const next = { ...prev }
        delete next[previewSrc]
        setUploading(Object.keys(next).length > 0)
        return next
      })
      try { URL.revokeObjectURL(previewSrc) } catch {};
    }
  }

  const triggerFileSelect = () => fileInputRef.current?.click()

  const processFilesRef = useRef(processFiles)
  processFilesRef.current = processFiles
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items?.length) return
      const files: File[] = []
      for (let i = 0; i < items.length; i++) {
        const file = items[i].getAsFile()
        if (file?.type.startsWith('image/')) files.push(file)
      }
      if (files.length) {
        e.preventDefault()
        processFilesRef.current(files)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])
  const addImageUrl = () => {
    const raw = prompt("Enter Image URL or path (e.g. /car-images/xx.jpg or https://...)")
    if (!raw) return
    const normalized = normalizeAdminInput(raw)
    if (!/\.(jpe?g|png|webp|gif|svg)$/i.test(normalized)) {
      if (!confirm('The value does not look like an image file. Add anyway?')) return
    }
    setFormData({ ...formData, images: [...formData.images, normalized] })
  };

  const removeImage = (index: number) => {
    const url = formData.images[index]
    // revoke blob preview URL if present
    if (typeof url === 'string' && url.startsWith('blob:')) {
      try { URL.revokeObjectURL(url) } catch {}
      setUploadingItems(prev => {
        const next = { ...prev }
        delete next[url]
        setUploading(Object.keys(next).length > 0)
        return next
      })
    }

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

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={triggerFileSelect}
                className="border-neutral-700 hover:bg-neutral-800 flex items-center"
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Upload
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageUrl}
                className="border-neutral-700 hover:bg-neutral-800"
              >
                <Upload className="h-4 w-4 mr-2" /> Add URL
              </Button>
            </div>
          </CardHeader>
          <CardContent
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={dropZoneActive ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-neutral-900 rounded-lg" : ""}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((url: string, index: number) => {
                const isUploading = !!uploadingItems[url]
                const isPreview = typeof url === 'string' && url.startsWith('blob:')
                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', String(index)); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
                    onDragEnter={() => setDragOverIndex(index)}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverIndex(null)
                      if (e.dataTransfer.files?.length) {
                        processFiles(e.dataTransfer.files)
                        return
                      }
                      const src = Number(e.dataTransfer.getData('text/plain'))
                      if (!isNaN(src) && src !== index) {
                        setFormData(prev => {
                          const imgs = [...prev.images]
                          const [moved] = imgs.splice(src, 1)
                          imgs.splice(index, 0, moved)
                          return { ...prev, images: imgs }
                        })
                      }
                    }}
                    className={`relative aspect-video rounded-md bg-neutral-950 border border-neutral-800 group overflow-hidden ${dragOverIndex === index ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    <img src={url} alt={`Vehicle ${index + 1}`} className="h-full w-full object-cover" />

                    {/* overlay for uploading / preview */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}

                    {isPreview && !isUploading && (
                      <div className="absolute left-2 bottom-2 bg-black/60 text-xs text-white px-2 py-1 rounded-md">Preview</div>
                    )}

                    <div className="absolute top-1 right-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-black/50 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="absolute left-1 bottom-1 text-xs text-neutral-300 bg-black/40 rounded px-2 py-1">
                      {index + 1}
                    </div>
                  </div>
                )
              })}
              {formData.images.length > 0 && (
                <div
                  onClick={triggerFileSelect}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    dropZoneActive
                      ? "border-yellow-400 bg-yellow-400/10 text-yellow-200"
                      : "border-neutral-700 bg-neutral-900/30 hover:border-neutral-600 hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-300"
                  }`}
                >
                  <Upload className="h-8 w-8 mb-2 opacity-60" />
                  <span className="text-xs font-medium">Add more</span>
                </div>
              )}
              {formData.images.length === 0 && (
                <div
                  onClick={triggerFileSelect}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`col-span-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                    dropZoneActive
                      ? "border-yellow-400 bg-yellow-400/10 text-yellow-200"
                      : "border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/30 text-neutral-400 hover:text-neutral-300"
                  }`}
                >
                  <Upload className="mx-auto h-12 w-12 mb-4 opacity-60" />
                  <p className="font-medium mb-1">
                    {dropZoneActive ? "Drop images here" : "Drag & drop images here or click to browse"}
                  </p>
                  <p className="text-sm">PNG, JPG, WEBP up to 5 MB each</p>
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
            disabled={loading || Object.keys(uploadingItems).length > 0}
            className="bg-white text-black hover:bg-neutral-200 min-w-[120px]"
            title={Object.keys(uploadingItems).length > 0 ? 'Wait for uploads to finish' : undefined}
          >
            {loading || Object.keys(uploadingItems).length > 0 ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? "Update Vehicle" : "Create Vehicle"}
          </Button>
        </div>
      </form>
    </div>
  );
}
