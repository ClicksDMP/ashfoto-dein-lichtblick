
-- Fix the booking INSERT policy: change from RESTRICTIVE to PERMISSIVE
DROP POLICY "Anyone can create bookings" ON public.bookings;

CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  (email IS NOT NULL) AND (email <> ''::text) AND
  (first_name IS NOT NULL) AND (first_name <> ''::text)
);

-- Also allow anonymous/public users to read booked dates/times for slot availability
CREATE POLICY "Anyone can view booking slots"
ON public.bookings
FOR SELECT
USING (true);
