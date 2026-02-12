import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceImageSet {
  thumbnail: string | null;
  hero: string | null;
  banner: string | null;
  thumbnailCrop: any | null;
  heroCrop: any | null;
  bannerCrop: any | null;
}

/**
 * Fetches all managed images (thumbnail, hero, banner) for a service.
 * Falls back to the static asset from serviceData if none uploaded.
 */
export function useServiceImages(slug: string, fallbackImage: string) {
  const [images, setImages] = useState<ServiceImageSet>({
    thumbnail: null,
    hero: null,
    banner: null,
    thumbnailCrop: null,
    heroCrop: null,
    bannerCrop: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      const { data } = await supabase
        .from("service_images")
        .select("image_type, file_url, crop_data")
        .eq("service_slug", slug);

      if (cancelled) return;

      const result: ServiceImageSet = {
        thumbnail: null,
        hero: null,
        banner: null,
        thumbnailCrop: null,
        heroCrop: null,
        bannerCrop: null,
      };

      if (data) {
        for (const row of data) {
          if (row.image_type === "thumbnail") {
            result.thumbnail = row.file_url;
            result.thumbnailCrop = row.crop_data;
          } else if (row.image_type === "hero") {
            result.hero = row.file_url;
            result.heroCrop = row.crop_data;
          } else if (row.image_type === "banner") {
            result.banner = row.file_url;
            result.bannerCrop = row.crop_data;
          }
        }
      }

      setImages(result);
      setLoading(false);
    };

    fetch();
    return () => { cancelled = true; };
  }, [slug]);

  // Resolved URLs with fallbacks
  const resolvedThumbnail = images.thumbnail || fallbackImage;
  const resolvedHero = images.hero || images.thumbnail || fallbackImage;
  const resolvedBanner = images.banner || images.hero || images.thumbnail || fallbackImage;

  return {
    ...images,
    resolvedThumbnail,
    resolvedHero,
    resolvedBanner,
    loading,
  };
}
