import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Upload, GripVertical, ImageIcon } from "lucide-react";
import { SERVICES_DATA } from "@/data/serviceData";

interface GalleryPhoto {
  id: string;
  service_slug: string;
  file_url: string;
  file_name: string;
  sort_order: number;
}

const AdminGallery = () => {
  const [selectedSlug, setSelectedSlug] = useState(SERVICES_DATA[0]?.slug || "");
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    if (!selectedSlug) return;
    setLoading(true);
    const { data } = await supabase
      .from("service_gallery_photos")
      .select("*")
      .eq("service_slug", selectedSlug)
      .order("sort_order", { ascending: true });
    if (data) setPhotos(data);
    setLoading(false);
  }, [selectedSlug]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    const maxOrder = photos.length > 0 ? Math.max(...photos.map(p => p.sort_order)) : 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${selectedSlug}/${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("service-gallery")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("service-gallery")
        .getPublicUrl(fileName);

      await supabase.from("service_gallery_photos").insert({
        service_slug: selectedSlug,
        file_url: urlData.publicUrl,
        file_name: file.name,
        sort_order: maxOrder + i + 1,
      });
    }

    setUploading(false);
    fetchPhotos();
    e.target.value = "";
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    // Extract path from URL
    const urlParts = photo.file_url.split("/service-gallery/");
    const filePath = urlParts.length > 1 ? urlParts[1] : "";

    if (filePath) {
      await supabase.storage.from("service-gallery").remove([filePath]);
    }
    await supabase.from("service_gallery_photos").delete().eq("id", photo.id);
    fetchPhotos();
  };

  const serviceLabel = SERVICES_DATA.find(s => s.slug === selectedSlug)?.title || selectedSlug;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Gallery Management</h2>
      </div>

      {/* Service selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="w-full sm:w-80">
          <Label className="text-foreground mb-2 block">Select Service</Label>
          <Select value={selectedSlug} onValueChange={setSelectedSlug}>
            <SelectTrigger>
              <SelectValue placeholder="Select service..." />
            </SelectTrigger>
            <SelectContent>
              {SERVICES_DATA.map(s => (
                <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gallery-upload" className="cursor-pointer">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Photos"}
            </div>
          </Label>
          <Input
            id="gallery-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      {/* Photo count */}
      <p className="text-sm text-muted-foreground">
        {serviceLabel}: {photos.length} photo{photos.length !== 1 ? "s" : ""}
      </p>

      {/* Photo grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[4/3] bg-secondary/30 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No photos uploaded yet for this service.</p>
          <p className="text-sm text-muted-foreground mt-1">Upload photos to display them on the landing page gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border">
              <img
                src={photo.file_url}
                alt={photo.file_name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(photo)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                <p className="text-xs text-white truncate">{photo.file_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
