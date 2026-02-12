import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Upload, Crop, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { compressImages } from "@/lib/imageCompressor";
import CropDialog from "./CropDialog";
import type { Area } from "react-easy-crop";

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

const IMAGE_TYPES = [
  { key: "thumbnail", label: "Thumbnail (Karte)", aspect: 16 / 9, description: "Wird auf der Hauptseite als Kartenbild angezeigt" },
  { key: "hero", label: "Hero (Cover)", aspect: 16 / 9, description: "Großes Titelbild auf der Service-Seite" },
  { key: "banner", label: "Banner (Trennbild)", aspect: 21 / 9, description: "Breitbild-Trenner in der Mitte der Service-Seite" },
] as const;

const ServiceImageManager = ({ serviceSlug, serviceTitle, fallbackImage }: ServiceImageManagerProps) => {
  const [images, setImages] = useState<Record<string, ImageRecord | null>>({
    thumbnail: null,
    hero: null,
    banner: null,
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const [cropDialog, setCropDialog] = useState<{
    open: boolean;
    imageType: string;
    imageUrl: string;
    aspect: number;
    title: string;
  } | null>(null);

  const fetchImages = useCallback(async () => {
    const { data } = await supabase
      .from("service_images")
      .select("id, image_type, file_url, crop_data")
      .eq("service_slug", serviceSlug);

    const result: Record<string, ImageRecord | null> = { thumbnail: null, hero: null, banner: null };
    if (data) {
      data.forEach((row) => {
        result[row.image_type] = row;
      });
    }
    setImages(result);
  }, [serviceSlug]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpload = async (imageType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(imageType);

    const [compressed] = await compressImages([file]);
    const fileExt = compressed.name.split(".").pop() || "jpg";
    const fileName = `${serviceSlug}/${imageType}-${Date.now()}.${fileExt}`;

    // Remove old file from storage if exists
    const existing = images[imageType];
    if (existing) {
      const urlParts = existing.file_url.split("/service-gallery/");
      if (urlParts.length > 1) {
        await supabase.storage.from("service-gallery").remove([urlParts[1]]);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("service-gallery")
      .upload(fileName, compressed);

    if (uploadError) {
      toast.error("Upload fehlgeschlagen: " + uploadError.message);
      setUploading(null);
      e.target.value = "";
      return;
    }

    const { data: urlData } = supabase.storage.from("service-gallery").getPublicUrl(fileName);

    // Upsert into service_images
    const { error: dbError } = await supabase
      .from("service_images")
      .upsert(
        {
          service_slug: serviceSlug,
          image_type: imageType,
          file_url: urlData.publicUrl,
          crop_data: null,
        },
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

    // Remove from storage
    const urlParts = existing.file_url.split("/service-gallery/");
    if (urlParts.length > 1) {
      await supabase.storage.from("service-gallery").remove([urlParts[1]]);
    }

    await supabase.from("service_images").delete().eq("id", existing.id);
    toast.success("Bild entfernt – Standard wird verwendet.");
    fetchImages();
  };

  const handleCropSave = async (imageType: string, croppedArea: Area, _croppedAreaPixels: Area) => {
    const existing = images[imageType];
    if (!existing) return;

    await supabase
      .from("service_images")
      .update({ crop_data: { area: croppedArea, pixels: _croppedAreaPixels } })
      .eq("id", existing.id);

    toast.success("Zuschnitt gespeichert!");
    fetchImages();
  };

  const handleUseAsSource = async (sourceType: string, targetType: string) => {
    const source = images[sourceType];
    if (!source) return;

    await supabase
      .from("service_images")
      .upsert(
        {
          service_slug: serviceSlug,
          image_type: targetType,
          file_url: source.file_url,
          crop_data: null,
        },
        { onConflict: "service_slug,image_type" }
      );

    toast.success("Bild übernommen! Du kannst den Zuschnitt separat anpassen.");
    fetchImages();
  };

  return (
    <div className="space-y-4">
      {IMAGE_TYPES.map(({ key, label, aspect, description }) => {
        const img = images[key];
        const isUploading = uploading === key;
        const displayUrl = img?.file_url || fallbackImage;

        // Determine which other types can be used as source
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
                  style={
                    img?.crop_data?.area
                      ? {
                          objectPosition: `${50 + (img.crop_data.area.x || 0)}% ${50 + (img.crop_data.area.y || 0)}%`,
                        }
                      : undefined
                  }
                />
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap gap-2">
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

                {/* Use existing image from another type */}
                {otherTypes.length > 0 && !img && (
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

      {cropDialog && (
        <CropDialog
          open={cropDialog.open}
          onClose={() => setCropDialog(null)}
          imageUrl={cropDialog.imageUrl}
          aspect={cropDialog.aspect}
          title={cropDialog.title}
          onCropComplete={(area, pixels) => {
            handleCropSave(cropDialog.imageType, area, pixels);
            setCropDialog(null);
          }}
        />
      )}
    </div>
  );
};

export default ServiceImageManager;
