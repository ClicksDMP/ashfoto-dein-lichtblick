
-- Table to track photo package upgrades for bookings
CREATE TABLE public.booking_upgrades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  previous_package TEXT NOT NULL,
  previous_package_price NUMERIC NOT NULL DEFAULT 0,
  new_package TEXT NOT NULL,
  new_package_price NUMERIC NOT NULL DEFAULT 0,
  upgrade_price NUMERIC NOT NULL DEFAULT 0,
  extra_single_photos INTEGER NOT NULL DEFAULT 0,
  extra_single_photos_price NUMERIC NOT NULL DEFAULT 0,
  total_upgrade_price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.booking_upgrades ENABLE ROW LEVEL SECURITY;

-- Users can view own upgrades
CREATE POLICY "Users can view own upgrades"
  ON public.booking_upgrades FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create own upgrades
CREATE POLICY "Users can create own upgrades"
  ON public.booking_upgrades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all upgrades
CREATE POLICY "Admins can manage upgrades"
  ON public.booking_upgrades FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
