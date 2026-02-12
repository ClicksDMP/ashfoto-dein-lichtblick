
-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit consultation request" ON public.consultation_requests;

-- Replace with a policy that validates required fields
CREATE POLICY "Anyone can submit consultation request"
ON public.consultation_requests
FOR INSERT
WITH CHECK (
  first_name IS NOT NULL AND first_name <> ''
  AND last_name IS NOT NULL AND last_name <> ''
  AND phone IS NOT NULL AND phone <> ''
);
