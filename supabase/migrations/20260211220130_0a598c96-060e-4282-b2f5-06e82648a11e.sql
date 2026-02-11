-- Add unique constraint to prevent multiple welcome codes per user
CREATE UNIQUE INDEX idx_offers_welcome_per_user ON public.offers (target_user_id) WHERE source = 'welcome_discount';
