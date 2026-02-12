import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all service thumbnail URLs from the service_images table.
 * Returns a map of service_slug -> thumbnail_url.
 */
export function useServiceThumbnails() {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("service_images")
        .select("service_slug, file_url")
        .eq("image_type", "thumbnail");

      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row) => {
          map[row.service_slug] = row.file_url;
        });
        setThumbnails(map);
      }
    };

    fetch();
  }, []);

  return thumbnails;
}
