import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches homepage-level images (hero, deal images) from service_images table.
 * Uses service_slug = 'homepage' for the main hero,
 * and service_slug = 'deal-{dealId}' for deal-specific images.
 */
export function useHomepageHeroImage(fallback: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("service_images")
        .select("file_url")
        .eq("service_slug", "homepage")
        .eq("image_type", "hero")
        .maybeSingle();

      if (!cancelled && data?.file_url) {
        setUrl(data.file_url);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return url || fallback;
}

export function useDealImage(dealId: string, fallback: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("service_images")
        .select("file_url")
        .eq("service_slug", `deal-${dealId}`)
        .eq("image_type", "thumbnail")
        .maybeSingle();

      if (!cancelled && data?.file_url) {
        setUrl(data.file_url);
      }
    })();
    return () => { cancelled = true; };
  }, [dealId]);

  return url || fallback;
}
