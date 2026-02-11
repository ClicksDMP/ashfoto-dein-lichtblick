
-- Create storage bucket for service gallery photos
INSERT INTO storage.buckets (id, name, public) VALUES ('service-gallery', 'service-gallery', true);

-- Create table for service gallery photos
CREATE TABLE public.service_gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_slug TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.service_gallery_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view gallery photos (public landing pages)
CREATE POLICY "Anyone can view service gallery photos"
ON public.service_gallery_photos
FOR SELECT
USING (true);

-- Admins can manage gallery photos
CREATE POLICY "Admins can manage service gallery photos"
ON public.service_gallery_photos
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for service-gallery bucket
CREATE POLICY "Anyone can view service gallery files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-gallery');

CREATE POLICY "Admins can upload service gallery files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'service-gallery' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update service gallery files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'service-gallery' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete service gallery files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'service-gallery' AND auth.uid() IS NOT NULL);
