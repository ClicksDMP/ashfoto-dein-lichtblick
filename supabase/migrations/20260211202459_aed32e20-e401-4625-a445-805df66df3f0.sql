
-- Drop the overly permissive INSERT policy that allows unauthenticated inserts
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Replace with a policy that only allows authenticated users to insert their own bookings
-- (Edge function uses service role key and bypasses RLS, so this is a safety net)
CREATE POLICY "Authenticated users can create own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND email IS NOT NULL
  AND email <> ''
  AND first_name IS NOT NULL
  AND first_name <> ''
);
