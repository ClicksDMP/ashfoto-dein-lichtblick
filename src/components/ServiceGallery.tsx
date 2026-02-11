import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface ServiceGalleryProps {
  serviceSlug: string;
  fallbackImage: string;
}

const ServiceGallery = ({ serviceSlug, fallbackImage }: ServiceGalleryProps) => {
  const [photos, setPhotos] = useState<{ id: string; file_url: string; file_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from("service_gallery_photos")
        .select("id, file_url, file_name")
        .eq("service_slug", serviceSlug)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setPhotos(data);
      }
      setLoading(false);
    };
    fetchPhotos();
  }, [serviceSlug]);

  if (loading) {
    return (
      <div className="w-full h-80 bg-secondary/30 rounded-xl animate-pulse" />
    );
  }

  if (photos.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aspect-[4/3] rounded-xl overflow-hidden">
          <img src={fallbackImage} alt="Galerie" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
    );
  }

  if (photos.length <= 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-[4/3] rounded-xl overflow-hidden">
            <img src={photo.file_url} alt={photo.file_name} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent className="-ml-4">
        {photos.map((photo) => (
          <CarouselItem key={photo.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={photo.file_url}
                alt={photo.file_name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 md:-left-6" />
      <CarouselNext className="-right-4 md:-right-6" />
    </Carousel>
  );
};

export default ServiceGallery;
