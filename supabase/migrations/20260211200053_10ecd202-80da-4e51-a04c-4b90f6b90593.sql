
-- Create a SECURITY DEFINER function to mark a coupon as used
-- This allows the booking flow to mark coupons without needing direct UPDATE access
CREATE OR REPLACE FUNCTION public.mark_coupon_used(
  _offer_id uuid,
  _booking_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _offer RECORD;
BEGIN
  -- Fetch the offer
  SELECT id, is_active, single_use, used_at
  INTO _offer
  FROM public.offers
  WHERE id = _offer_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if already used
  IF _offer.single_use AND _offer.used_at IS NOT NULL THEN
    RETURN false;
  END IF;

  -- Check if active
  IF NOT _offer.is_active THEN
    RETURN false;
  END IF;

  -- Mark as used
  UPDATE public.offers
  SET used_at = now(),
      used_by_booking_id = _booking_id,
      is_active = CASE WHEN single_use THEN false ELSE is_active END
  WHERE id = _offer_id;

  RETURN true;
END;
$$;
