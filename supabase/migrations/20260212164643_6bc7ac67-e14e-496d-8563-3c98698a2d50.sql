
-- Create service_images table for managing thumbnail, hero, and banner images per service
CREATE TABLE public.service_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_slug TEXT NOT NULL,
  image_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  crop_data JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id),
  UNIQUE(service_slug, image_type)
);

-- Enable RLS
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

-- Public read access (images are public on the website)
CREATE POLICY "Anyone can view service images"
  ON public.service_images FOR SELECT
  USING (true);

-- Only admins can manage service images
CREATE POLICY "Admins can insert service images"
  ON public.service_images FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service images"
  ON public.service_images FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service images"
  ON public.service_images FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_service_images_updated_at
  BEFORE UPDATE ON public.service_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
