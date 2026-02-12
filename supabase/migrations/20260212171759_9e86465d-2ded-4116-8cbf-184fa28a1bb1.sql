-- Fix 1: Tighten storage policies for service-gallery to require admin role
DROP POLICY IF EXISTS "Admins can upload service gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update service gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete service gallery files" ON storage.objects;

CREATE POLICY "Admins can upload service gallery files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'service-gallery' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update service gallery files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'service-gallery' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete service gallery files"
ON storage.objects FOR DELETE
USING (bucket_id = 'service-gallery' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Fix 2: Tighten offers SELECT policy - users only see their targeted offers, not all general codes
DROP POLICY IF EXISTS "Users can view their offers" ON public.offers;

CREATE POLICY "Users can view their targeted offers"
ON public.offers
FOR SELECT
USING (auth.uid() = target_user_id);