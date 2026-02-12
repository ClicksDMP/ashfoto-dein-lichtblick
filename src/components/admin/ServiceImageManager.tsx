import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Upload, Crop, Loader2, ImageIcon, Images } from "lucide-react";
import { toast } from "sonner";
import { compressImages } from "@/lib/imageCompressor";
import CropDialog from "./CropDialog";

interface ServiceImageManagerProps {
  serviceSlug: string;
  serviceTitle: string;
  fallbackImage: string;
}

interface ImageRecord {
  id: string;
  image_type: string;
  file_url: string;
  crop_data: any;
}

interface GalleryPhoto {
  id: string;
  file_url: string;
  file_name: string;
}

const IMAGE_TYPES = [
  { key: "thumbnail", label: "Thumbnail (Karte)", aspect: 16 / 9, description: "Wird auf der Hauptseite als Kartenbild angezeigt" },
  { key: "hero", label: "Hero (Cover)", aspect: 16 / 9, description: "Großes Titelbild auf der Service-Seite" },
  { key: "banner", label: "Banner (Trennbild)", aspect: 21 / 9, description: "Breitbild-Trenner in der Mitte der Service-Seite" },
] as const;

const ServiceImageManager = ({ serviceSlug, serviceTitle, fallbackImage }: ServiceImageManagerProps) => {
  const [images, setImages] = useState<Record<string, ImageRecord | null>>({
    thumbnail: null, hero: null, banner: null,
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const [cropDialog, setCropDialog] = useState<{
    open: boolean;
    imageType: string;
    imageUrl: string;
    aspect: number;
    title: string;
  } | null>(null);
  const [galleryPicker, setGalleryPicker] = useState<{
    open: boolean;
    targetType: string;
  } | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);

  const fetchImages = useCallback(async () => {
    const { data } = await supabase
      .from("service_images")
      .select("id, image_type, file_url, crop_data")
      .eq("service_slug", serviceSlug);

    const result: Record<string, ImageRecord | null> = { thumbnail: null, hero: null, banner: null };
    if (data) {
      data.forEach((row) => { result[row.image_type] = row; });
    }
    setImages(result);
  }, [serviceSlug]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const fetchGalleryPhotos = useCallback(async () => {
    const { data } = await supabase
      .from("service_gallery_photos")
      .select("id, file_url, file_name")
      .eq("service_slug", serviceSlug)
      .order("sort_order", { ascending: true });
    setGalleryPhotos(data || []);
  }, [serviceSlug]);

  const uploadBlob = async (imageType: string, blob: Blob, filenameHint?: string) => {
    const ext = "jpg";
    const fileName = `${serviceSlug}/${imageType}-${Date.now()}.${ext}`;

    // Remove old file
    const existing = images[imageType];
    if (existing) {
      const urlParts = existing.file_url.split("/service-gallery/");
      if (urlParts.length > 1) {
        await supabase.storage.from("service-gallery").remove([urlParts[1]]);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("service-gallery")
      .upload(fileName, blob, { contentType: "image/jpeg" });

    if (uploadError) {
      toast.error("Upload fehlgeschlagen: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("service-gallery").getPublicUrl(fileName);

    await supabase.from("service_images").upsert(
      { service_slug: serviceSlug, image_type: imageType, file_url: urlData.publicUrl, crop_data: null },
      { onConflict: "service_slug,image_type" }
    );

    toast.success(`${imageType === "thumbnail" ? "Thumbnail" : imageType === "hero" ? "Hero" : "Banner"} aktualisiert!`);
    fetchImages();
  };

  const handleUpload = async (imageType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(imageType);

    const [compressed] = await compressImages([file]);
    const fileExt = compressed.name.split(".").pop() || "jpg";
    const fileName = `${serviceSlug}/${imageType}-${Date.now()}.${fileExt}`;

    const existing = images[imageType];
    if (existing) {
      const urlParts = existing.file_url.split("/service-gallery/");
      if (urlParts.length > 1) {
        await supabase.storage.from("service-gallery").remove([urlParts[1]]);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("service-gallery").upload(fileName, compressed);

    if (uploadError) {
      toast.error("Upload fehlgeschlagen: " + uploadError.message);
      setUploading(null);
      e.target.value = "";
      return;
    }

    const { data: urlData } = supabase.storage.from("service-gallery").getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("service_images").upsert(
      { service_slug: serviceSlug, image_type: imageType, file_url: urlData.publicUrl, crop_data: null },
      { onConflict: "service_slug,image_type" }
    );

    if (dbError) {
      toast.error("DB-Fehler: " + dbError.message);
    } else {
      toast.success(`${imageType === "thumbnail" ? "Thumbnail" : imageType === "hero" ? "Hero" : "Banner"} aktualisiert!`);
    }

    setUploading(null);
    fetchImages();
    e.target.value = "";
  };

  const handleDelete = async (imageType: string) => {
    const existing = images[imageType];
    if (!existing) return;
    const urlParts = existing.file_url.split("/service-gallery/");
    if (urlParts.length > 1) {
      await supabase.storage.from("service-gallery").remove([urlParts[1]]);
    }
    await supabase.from("service_images").delete().eq("id", existing.id);
    toast.success("Bild entfernt – Standard wird verwendet.");
    fetchImages();
  };

  const handleCropSave = async (imageType: string, croppedBlob: Blob) => {
    setUploading(imageType);
    await uploadBlob(imageType, croppedBlob);
    setUploading(null);
  };

  const handleUseAsSource = async (sourceType: string, targetType: string) => {
    const source = images[sourceType];
    if (!source) return;
    // Open crop dialog with the source image so user can crop for target dimensions
    const targetConfig = IMAGE_TYPES.find(t => t.key === targetType);
    if (!targetConfig) return;
    setCropDialog({
      open: true,
      imageType: targetType,
      imageUrl: source.file_url,
      aspect: targetConfig.aspect,
      title: `${targetConfig.label} zuschneiden`,
    });
  };

  const handleOpenGalleryPicker = async (targetType: string) => {
    await fetchGalleryPhotos();
    setGalleryPicker({ open: true, targetType });
  };

  const handleSelectGalleryPhoto = (photo: GalleryPhoto) => {
    if (!galleryPicker) return;
    const targetConfig = IMAGE_TYPES.find(t => t.key === galleryPicker.targetType);
    if (!targetConfig) return;
    setGalleryPicker(null);
    setCropDialog({
      open: true,
      imageType: galleryPicker.targetType,
      imageUrl: photo.file_url,
      aspect: targetConfig.aspect,
      title: `${targetConfig.label} zuschneiden`,
    });
  };

  return (
    <div className="space-y-4">
      {IMAGE_TYPES.map(({ key, label, aspect, description }) => {
        const img = images[key];
        const isUploading = uploading === key;
        const displayUrl = img?.file_url || fallbackImage;
        const otherTypes = IMAGE_TYPES.filter(t => t.key !== key && images[t.key]);

        return (
          <div key={key} className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  {label}
                </h5>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              {img ? (
                <Badge variant="default" className="text-[10px]">Custom</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">Standard</Badge>
              )}
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-48 rounded-lg overflow-hidden border border-border bg-secondary/10 flex-shrink-0"
                style={{ aspectRatio: aspect }}
              >
                <img
                  src={displayUrl}
                  alt={`${label}: ${serviceTitle}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap gap-2">
                  {/* Upload button */}
                  <Label htmlFor={`img-upload-${serviceSlug}-${key}`} className="cursor-pointer">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium">
                      {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      {isUploading ? "Lädt..." : img ? "Ersetzen" : "Hochladen"}
                    </div>
                  </Label>
                  <Input
                    id={`img-upload-${serviceSlug}-${key}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(key, e)}
                    disabled={isUploading}
                    className="hidden"
                  />

                  {/* Gallery picker button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleOpenGalleryPicker(key)}
                  >
                    <Images className="w-3 h-3 mr-1" /> Aus Galerie
                  </Button>

                  {img && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() =>
                          setCropDialog({
                            open: true,
                            imageType: key,
                            imageUrl: img.file_url,
                            aspect,
                            title: `${label} zuschneiden`,
                          })
                        }
                      >
                        <Crop className="w-3 h-3 mr-1" /> Zuschneiden
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => handleDelete(key)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Entfernen
                      </Button>
                    </>
                  )}
                </div>

                {/* Reuse from other type */}
                {otherTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {otherTypes.map((ot) => (
                      <Button
                        key={ot.key}
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] text-muted-foreground"
                        onClick={() => handleUseAsSource(ot.key, key)}
                      >
                        {ot.label} übernehmen
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Crop Dialog */}
      {cropDialog && (
        <CropDialog
          open={cropDialog.open}
          onClose={() => setCropDialog(null)}
          imageUrl={cropDialog.imageUrl}
          aspect={cropDialog.aspect}
          title={cropDialog.title}
          onCropComplete={(blob) => {
            handleCropSave(cropDialog.imageType, blob);
            setCropDialog(null);
          }}
        />
      )}

      {/* Gallery Picker Dialog */}
      {galleryPicker && (
        <Dialog open={galleryPicker.open} onOpenChange={(o) => !o && setGalleryPicker(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bild aus Galerie wählen</DialogTitle>
            </DialogHeader>
            {galleryPhotos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Keine Galerie-Bilder vorhanden. Lade zuerst Bilder in die Galerie hoch.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {galleryPhotos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => handleSelectGalleryPhoto(photo)}
                    className="rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors focus:outline-none focus:border-primary"
                  >
                    <img
                      src={photo.file_url}
                      alt={photo.file_name}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ServiceImageManager;
