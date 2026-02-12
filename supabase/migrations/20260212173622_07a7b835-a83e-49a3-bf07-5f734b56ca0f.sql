
DROP POLICY IF EXISTS "Users can view their targeted offers" ON public.offers;

CREATE POLICY "Users can view available offers"
ON public.offers FOR SELECT
USING (target_user_id IS NULL OR auth.uid() = target_user_id);
