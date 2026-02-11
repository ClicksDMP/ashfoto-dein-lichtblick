import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Upload,
  ImageIcon,
  ChevronDown,
  ChevronRight,
  Eye,
  GripVertical,
  Image as ImageLucide,
  FolderOpen,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { SERVICES_DATA } from "@/data/serviceData";
import { toast } from "sonner";

interface GalleryPhoto {
  id: string;
  service_slug: string;
  file_url: string;
  file_name: string;
  sort_order: number;
}

interface ServicePhotoData {
  slug: string;
  title: string;
  heroImage: string;
  photos: GalleryPhoto[];
  loading: boolean;
}

const AdminGallery = () => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [allPhotos, setAllPhotos] = useState<Record<string, GalleryPhoto[]>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [heroImages, setHeroImages] = useState<Record<string, string | null>>({});
  const [uploadingHero, setUploadingHero] = useState<string | null>(null);

  // Fetch hero images from storage
  const fetchHeroImages = useCallback(async () => {
    const heroes: Record<string, string | null> = {};
    for (const service of SERVICES_DATA) {
      const { data } = await supabase.storage
        .from("service-gallery")
        .list(service.slug, { search: "hero-" });

      if (data && data.length > 0) {
        const heroFile = data.sort((a, b) =>
          (b.created_at || "").localeCompare(a.created_at || "")
        )[0];
        const { data: urlData } = supabase.storage
          .from("service-gallery")
          .getPublicUrl(`${service.slug}/${heroFile.name}`);
        heroes[service.slug] = urlData?.publicUrl || null;
      } else {
        heroes[service.slug] = null;
      }
    }
    setHeroImages(heroes);
  }, []);

  // Fetch all photos for all services in one query
  const fetchAllPhotos = useCallback(async () => {
    setInitialLoading(true);
    const { data } = await supabase
      .from("service_gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (data) {
      const grouped: Record<string, GalleryPhoto[]> = {};
      SERVICES_DATA.forEach((s) => {
        grouped[s.slug] = [];
      });
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
    fetchHeroImages();
  }, [fetchAllPhotos, fetchHeroImages]);

  const handleHeroUpload = async (slug: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(slug);

    // Remove existing hero images for this service
    const { data: existing } = await supabase.storage
      .from("service-gallery")
      .list(slug, { search: "hero-" });

    if (existing && existing.length > 0) {
      await supabase.storage
        .from("service-gallery")
        .remove(existing.map((f) => `${slug}/${f.name}`));
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${slug}/hero-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("service-gallery")
      .upload(fileName, file);

    if (error) {
      toast.error("Hero upload failed: " + error.message);
    } else {
      toast.success("Hero image updated!");
    }

    setUploadingHero(null);
    fetchHeroImages();
    e.target.value = "";
  };

  const handleHeroDelete = async (slug: string) => {
    const { data: existing } = await supabase.storage
      .from("service-gallery")
      .list(slug, { search: "hero-" });

    if (existing && existing.length > 0) {
      await supabase.storage
        .from("service-gallery")
        .remove(existing.map((f) => `${slug}/${f.name}`));
    }

    toast.success("Hero image removed – falling back to default.");
    fetchHeroImages();
  };

  const toggleExpand = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  const handleUpload = async (slug: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(slug);

    const existing = allPhotos[slug] || [];
    const maxOrder = existing.length > 0 ? Math.max(...existing.map((p) => p.sort_order)) : 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
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
        file_name: file.name,
        sort_order: maxOrder + i + 1,
      });
    }

    setUploading(null);
    fetchAllPhotos();
    e.target.value = "";
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    setDeletingId(photo.id);
    const urlParts = photo.file_url.split("/service-gallery/");
    const filePath = urlParts.length > 1 ? urlParts[1] : "";

    if (filePath) {
      await supabase.storage.from("service-gallery").remove([filePath]);
    }
    await supabase.from("service_gallery_photos").delete().eq("id", photo.id);
    setDeletingId(null);
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
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gallery Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage photos for all service landing pages
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

      {/* Service list */}
      <div className="space-y-2">
        {SERVICES_DATA.map((service) => {
          const photos = allPhotos[service.slug] || [];
          const isExpanded = expandedSlug === service.slug;
          const isUploading = uploading === service.slug;

          return (
            <div
              key={service.slug}
              className="bg-card border border-border rounded-xl overflow-hidden transition-colors"
            >
              {/* Service row header */}
              <button
                onClick={() => toggleExpand(service.slug)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
              >
                {/* Hero thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border bg-secondary/20">
                  <img
                    src={heroImages[service.slug] || service.heroImage}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title + info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {service.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    /shooting/{service.slug}
                  </p>
                </div>

                {/* Photo count badge */}
                <Badge
                  variant={photos.length > 0 ? "default" : "outline"}
                  className="text-xs flex-shrink-0"
                >
                  {photos.length} {photos.length === 1 ? "Photo" : "Photos"}
                </Badge>

                {/* Expand icon */}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border px-4 py-4 space-y-5">
                  {/* Hero Image Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <ImageLucide className="w-4 h-4 text-primary" />
                        Hero Image
                      </h4>
                      {heroImages[service.slug] ? (
                        <Badge variant="default" className="text-[10px]">Custom</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-48 aspect-[16/9] rounded-lg overflow-hidden border border-border bg-secondary/10">
                        <img
                          src={heroImages[service.slug] || service.heroImage}
                          alt={`Hero: ${service.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2 pt-1">
                        <p className="text-xs text-muted-foreground">
                          {heroImages[service.slug]
                            ? "Custom hero image uploaded. It replaces the default on the landing page."
                            : "Using default hero image. Upload a custom one to override it."}
                        </p>
                        <div className="flex gap-2">
                          <Label htmlFor={`hero-upload-${service.slug}`} className="cursor-pointer">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium">
                              <Upload className="w-3 h-3" />
                              {uploadingHero === service.slug ? "Uploading..." : heroImages[service.slug] ? "Replace" : "Upload Hero"}
                            </div>
                          </Label>
                          <Input
                            id={`hero-upload-${service.slug}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleHeroUpload(service.slug, e)}
                            disabled={uploadingHero === service.slug}
                            className="hidden"
                          />
                          {heroImages[service.slug] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-destructive hover:text-destructive"
                              onClick={() => handleHeroDelete(service.slug)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Photos Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-primary" />
                        Gallery Photos ({photos.length})
                      </h4>
                      <div>
                        <Label htmlFor={`upload-${service.slug}`} className="cursor-pointer">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium">
                            <Upload className="w-3.5 h-3.5" />
                            {isUploading ? "Uploading..." : "Upload Photos"}
                          </div>
                        </Label>
                        <Input
                          id={`upload-${service.slug}`}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleUpload(service.slug, e)}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {photos.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-border rounded-lg bg-secondary/5">
                        <ImageIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          No gallery photos uploaded yet.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload photos to display them in the gallery carousel on this landing page.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {photos.map((photo, idx) => (
                          <div
                            key={photo.id}
                            className="flex items-center gap-3 bg-secondary/10 hover:bg-secondary/20 rounded-lg px-3 py-2 transition-colors group"
                          >
                            {/* Order number */}
                            <span className="text-xs text-muted-foreground w-5 text-center font-mono flex-shrink-0">
                              {idx + 1}
                            </span>

                            {/* Thumbnail */}
                            <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 border border-border">
                              <img
                                src={photo.file_url}
                                alt={photo.file_name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>

                            {/* Filename */}
                            <p className="text-xs text-foreground truncate flex-1 min-w-0">
                              {photo.file_name}
                            </p>

                            {/* Reorder buttons */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={idx === 0}
                                onClick={() => handleMovePhoto(service.slug, photo.id, "up")}
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={idx === photos.length - 1}
                                onClick={() => handleMovePhoto(service.slug, photo.id, "down")}
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            {/* Preview link */}
                            <a
                              href={photo.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            </a>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDelete(photo)}
                              disabled={deletingId === photo.id}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick link */}
                  <div className="pt-2 border-t border-border">
                    <a
                      href={`/shooting/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Preview landing page
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
