import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash2, Upload, ImageIcon, ChevronDown, ChevronRight, Eye,
  Image as ImageLucide, FolderOpen, ArrowUp, ArrowDown, Loader2, CheckSquare,
} from "lucide-react";
import { SERVICES_DATA } from "@/data/serviceData";
import { getActivDeals } from "@/data/dealsData";
import { toast } from "sonner";
import { compressImages } from "@/lib/imageCompressor";
import { cn } from "@/lib/utils";
import ServiceImageManager from "./ServiceImageManager";

interface GalleryPhoto {
  id: string;
  service_slug: string;
  file_url: string;
  file_name: string;
  sort_order: number;
}

const AdminGallery = () => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [allPhotos, setAllPhotos] = useState<Record<string, GalleryPhoto[]>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [serviceImageUrls, setServiceImageUrls] = useState<Record<string, string | null>>({});
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchServiceImageUrls = useCallback(async () => {
    const { data } = await supabase
      .from("service_images")
      .select("service_slug, file_url, image_type")
      .eq("image_type", "thumbnail");

    const urls: Record<string, string | null> = {};
    SERVICES_DATA.forEach((s) => { urls[s.slug] = null; });
    if (data) {
      data.forEach((row) => { urls[row.service_slug] = row.file_url; });
    }
    setServiceImageUrls(urls);
  }, []);

  const fetchAllPhotos = useCallback(async () => {
    setInitialLoading(true);
    const { data } = await supabase
      .from("service_gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (data) {
      const grouped: Record<string, GalleryPhoto[]> = {};
      SERVICES_DATA.forEach((s) => { grouped[s.slug] = []; });
      data.forEach((photo) => {
        if (grouped[photo.service_slug]) {
          grouped[photo.service_slug].push(photo);
        }
      });
      setAllPhotos(grouped);
    }
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    fetchAllPhotos();
    fetchServiceImageUrls();
  }, [fetchAllPhotos, fetchServiceImageUrls]);

  const toggleExpand = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
    setSelectedPhotos(new Set());
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  const selectAllInSlug = (slug: string) => {
    const photos = allPhotos[slug] || [];
    const allSelected = photos.every(p => selectedPhotos.has(p.id));
    if (allSelected) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map(p => p.id)));
    }
  };

  const handleBulkDelete = async (slug: string) => {
    if (selectedPhotos.size === 0) return;
    if (!confirm(`${selectedPhotos.size} Foto(s) endgültig löschen?`)) return;
    setBulkDeleting(true);

    const photos = (allPhotos[slug] || []).filter(p => selectedPhotos.has(p.id));
    const filePaths: string[] = [];
    for (const photo of photos) {
      const urlParts = photo.file_url.split("/service-gallery/");
      if (urlParts.length > 1) filePaths.push(urlParts[1]);
    }

    if (filePaths.length > 0) {
      await supabase.storage.from("service-gallery").remove(filePaths);
    }

    for (const photo of photos) {
      await supabase.from("service_gallery_photos").delete().eq("id", photo.id);
    }

    toast.success(`${photos.length} Foto(s) gelöscht!`);
    setSelectedPhotos(new Set());
    setBulkDeleting(false);
    fetchAllPhotos();
  };

  const handleUpload = async (slug: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(slug);
    setUploadProgress(0);
    setUploadTotal(files.length);

    toast.info(`Optimiere ${files.length} Bilder...`);
    const fileArray = Array.from(files);
    const compressed = await compressImages(fileArray);

    const existing = allPhotos[slug] || [];
    const maxOrder = existing.length > 0 ? Math.max(...existing.map((p) => p.sort_order)) : 0;

    let successCount = 0;
    for (let i = 0; i < compressed.length; i++) {
      const file = compressed[i];
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${slug}/${Date.now()}-${i}.${fileExt}`;

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
        service_slug: slug,
        file_url: urlData.publicUrl,
        file_name: fileArray[i].name,
        sort_order: maxOrder + i + 1,
      });

      successCount++;
      setUploadProgress(i + 1);
    }

    toast.success(`${successCount} Bilder erfolgreich hochgeladen!`);
    setUploading(null);
    setUploadProgress(0);
    setUploadTotal(0);
    fetchAllPhotos();
    e.target.value = "";
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    if (!confirm("Dieses Foto endgültig löschen?")) return;
    setDeletingId(photo.id);
    const urlParts = photo.file_url.split("/service-gallery/");
    const filePath = urlParts.length > 1 ? urlParts[1] : "";
    if (filePath) {
      await supabase.storage.from("service-gallery").remove([filePath]);
    }
    await supabase.from("service_gallery_photos").delete().eq("id", photo.id);
    setDeletingId(null);
    toast.success("Foto gelöscht!");
    fetchAllPhotos();
  };

  const handleMovePhoto = async (slug: string, photoId: string, direction: "up" | "down") => {
    const photos = [...(allPhotos[slug] || [])];
    const idx = photos.findIndex((p) => p.id === photoId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= photos.length) return;
    const tempOrder = photos[idx].sort_order;
    const otherOrder = photos[swapIdx].sort_order;
    await Promise.all([
      supabase.from("service_gallery_photos").update({ sort_order: otherOrder }).eq("id", photos[idx].id),
      supabase.from("service_gallery_photos").update({ sort_order: tempOrder }).eq("id", photos[swapIdx].id),
    ]);
    fetchAllPhotos();
  };

  const totalPhotos = Object.values(allPhotos).reduce((sum, arr) => sum + arr.length, 0);
  const servicesWithPhotos = Object.values(allPhotos).filter((arr) => arr.length > 0).length;

  if (initialLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Gallery Management</h2>
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-secondary/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gallery Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Photos are automatically compressed to max 1MB for web optimization
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
            {servicesWithPhotos}/{SERVICES_DATA.length} Services
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <ImageLucide className="w-3.5 h-3.5 mr-1.5" />
            {totalPhotos} Photos
          </Badge>
        </div>
      </div>

      {/* Homepage Images Section */}
      <div className="bg-card border-2 border-primary/20 rounded-xl overflow-hidden">
        <button
          onClick={() => { setExpandedSlug(expandedSlug === "__homepage__" ? null : "__homepage__"); setSelectedPhotos(new Set()); }}
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-primary/30 bg-primary/10 flex items-center justify-center">
            <ImageLucide className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm">🏠 Homepage Bilder</p>
            <p className="text-xs text-muted-foreground">Hero-Bild & Deal-Bilder der Startseite</p>
          </div>
          {expandedSlug === "__homepage__" ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSlug === "__homepage__" && (
          <div className="border-t border-border px-4 py-4 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <ImageLucide className="w-4 h-4 text-primary" /> Hero-Bild (Startseite)
              </h4>
              <ServiceImageManager serviceSlug="homepage" serviceTitle="Startseite" fallbackImage="/placeholder.svg" />
            </div>
            {getActivDeals().map(deal => (
              <div key={deal.id}>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <ImageLucide className="w-4 h-4 text-primary" /> Deal: {deal.title}
                </h4>
                <ServiceImageManager serviceSlug={`deal-${deal.id}`} serviceTitle={deal.title} fallbackImage="/placeholder.svg" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {SERVICES_DATA.map((service) => {
          const photos = allPhotos[service.slug] || [];
          const isExpanded = expandedSlug === service.slug;
          const isUploading = uploading === service.slug;
          const selectedInSlug = photos.filter(p => selectedPhotos.has(p.id)).length;

          return (
            <div key={service.slug} className="bg-card border border-border rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleExpand(service.slug)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border bg-secondary/20">
                  <img src={serviceImageUrls[service.slug] || service.heroImage} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{service.title}</p>
                  <p className="text-xs text-muted-foreground truncate">/shooting/{service.slug}</p>
                </div>
                <Badge variant={photos.length > 0 ? "default" : "outline"} className="text-xs flex-shrink-0">
                  {photos.length} {photos.length === 1 ? "Photo" : "Photos"}
                </Badge>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </button>

              {isExpanded && (
                <div className="border-t border-border px-4 py-4 space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <ImageLucide className="w-4 h-4 text-primary" /> Bilder verwalten
                    </h4>
                    <ServiceImageManager serviceSlug={service.slug} serviceTitle={service.title} fallbackImage={service.heroImage} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-primary" /> Gallery Photos ({photos.length})
                      </h4>
                      <div className="flex items-center gap-2">
                        {photos.length > 0 && (
                          <>
                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => selectAllInSlug(service.slug)}>
                              <CheckSquare className="w-3.5 h-3.5" />
                              {photos.every(p => selectedPhotos.has(p.id)) ? "Alle abwählen" : "Alle auswählen"}
                            </Button>
                            {selectedInSlug > 0 && (
                              <Button variant="destructive" size="sm" className="h-8 text-xs gap-1.5" onClick={() => handleBulkDelete(service.slug)} disabled={bulkDeleting}>
                                {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                {selectedInSlug} löschen
                              </Button>
                            )}
                          </>
                        )}
                        <Label htmlFor={`upload-${service.slug}`} className="cursor-pointer">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium">
                            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            {isUploading ? `Uploading ${uploadProgress}/${uploadTotal}...` : "Upload Photos"}
                          </div>
                        </Label>
                        <Input id={`upload-${service.slug}`} type="file" accept="image/*" multiple onChange={(e) => handleUpload(service.slug, e)} disabled={isUploading} className="hidden" />
                      </div>
                    </div>

                    {isUploading && (
                      <div className="mb-4">
                        <Progress value={(uploadProgress / uploadTotal) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Compressing and uploading {uploadProgress} of {uploadTotal}...</p>
                      </div>
                    )}

                    {photos.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-border rounded-lg bg-secondary/5">
                        <ImageIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No gallery photos uploaded yet.</p>
                        <p className="text-xs text-muted-foreground mt-1">Upload multiple photos at once – they'll be automatically optimized.</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {photos.map((photo, idx) => (
                          <div key={photo.id} className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors group",
                            selectedPhotos.has(photo.id) ? "bg-primary/10 border border-primary/30" : "bg-secondary/10 hover:bg-secondary/20"
                          )}>
                            <Checkbox
                              checked={selectedPhotos.has(photo.id)}
                              onCheckedChange={() => togglePhotoSelection(photo.id)}
                              className="flex-shrink-0"
                            />
                            <span className="text-xs text-muted-foreground w-5 text-center font-mono flex-shrink-0">{idx + 1}</span>
                            <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 border border-border">
                              <img src={photo.file_url} alt={photo.file_name} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <p className="text-xs text-foreground truncate flex-1 min-w-0">{photo.file_name}</p>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={idx === 0} onClick={() => handleMovePhoto(service.slug, photo.id, "up")}>
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={idx === photos.length - 1} onClick={() => handleMovePhoto(service.slug, photo.id, "down")}>
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            <a href={photo.file_url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                            </a>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(photo)} disabled={deletingId === photo.id}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <a href={`/shooting/${service.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Preview landing page
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminGallery;
