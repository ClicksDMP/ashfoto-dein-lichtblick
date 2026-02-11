
-- The "Anyone can create bookings" policy is intentionally permissive for guest bookings.
-- Let's tighten it slightly: require at least basic fields to be non-empty
-- But the WITH CHECK (true) is needed for unauthenticated booking flow.
-- We'll add a check that email must be provided
DROP POLICY "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (
  email IS NOT NULL AND email <> '' AND first_name IS NOT NULL AND first_name <> ''
);
