import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves the hero image for a service.
 * Checks storage for an uploaded hero (service-gallery/{slug}/hero-*),
 * falls back to the static asset from serviceData.
 */
export function useServiceHeroImage(slug: string, fallbackImage: string) {
  const [heroUrl, setHeroUrl] = useState(fallbackImage);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      // List files in the hero folder for this service
      const { data } = await supabase.storage
        .from("service-gallery")
        .list(`${slug}`, { search: "hero-" });

      if (cancelled) return;

      if (data && data.length > 0) {
        // Take the most recent hero file
        const heroFile = data.sort((a, b) =>
          (b.created_at || "").localeCompare(a.created_at || "")
        )[0];

        const { data: urlData } = supabase.storage
          .from("service-gallery")
          .getPublicUrl(`${slug}/${heroFile.name}`);

        if (urlData?.publicUrl) {
          setHeroUrl(urlData.publicUrl);
          return;
        }
      }

      setHeroUrl(fallbackImage);
    };

    resolve();
    return () => { cancelled = true; };
  }, [slug, fallbackImage]);

  return heroUrl;
}
