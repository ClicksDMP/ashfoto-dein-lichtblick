
-- Add tracking columns to offers table for welcome discount codes
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS used_at timestamp with time zone DEFAULT NULL;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS used_by_booking_id uuid DEFAULT NULL REFERENCES public.bookings(id);
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS single_use boolean NOT NULL DEFAULT false;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS photo_package_only boolean NOT NULL DEFAULT false;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS source text DEFAULT NULL;
