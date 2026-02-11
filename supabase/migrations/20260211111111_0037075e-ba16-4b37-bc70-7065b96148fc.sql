
-- Remove the overly permissive public SELECT policy that exposes PII
DROP POLICY "Anyone can view booking slots" ON public.bookings;

-- Make the existing SELECT policies PERMISSIVE so they actually work
-- (they were RESTRICTIVE before, which means they blocked access since no permissive policy existed)
DROP POLICY "Admins can view all bookings" ON public.bookings;
DROP POLICY "Users can view own bookings" ON public.bookings;
DROP POLICY "Admins can update bookings" ON public.bookings;

CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
