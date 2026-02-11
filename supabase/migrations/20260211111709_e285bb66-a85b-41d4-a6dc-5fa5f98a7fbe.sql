
-- Create blocked_slots table for admin to manually block dates/times
CREATE TABLE public.blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date date NOT NULL,
  blocked_time text, -- NULL means entire day is blocked
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Admins can manage blocked slots
CREATE POLICY "Admins can manage blocked slots"
ON public.blocked_slots
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read blocked slots (needed for booking flow)
CREATE POLICY "Anyone can view blocked slots"
ON public.blocked_slots
FOR SELECT
USING (true);

-- Allow admins to delete bookings
CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
