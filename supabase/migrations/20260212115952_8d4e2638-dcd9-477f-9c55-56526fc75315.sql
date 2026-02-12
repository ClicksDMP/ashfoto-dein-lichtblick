
-- Add tracking columns to bookings for confirmation, photo delivery, and reminders
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS confirmed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS photos_delivered_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS reminder_3d_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_1d_sent boolean NOT NULL DEFAULT false;

-- Create customer_feedbacks table
CREATE TABLE public.customer_feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT NOT NULL DEFAULT '',
  approved BOOLEAN NOT NULL DEFAULT false,
  client_name TEXT NOT NULL DEFAULT '',
  service_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_feedbacks ENABLE ROW LEVEL SECURITY;

-- Users can create their own feedback
CREATE POLICY "Users can create own feedback"
  ON public.customer_feedbacks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
  ON public.customer_feedbacks FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can view approved feedbacks (for homepage display)
CREATE POLICY "Anyone can view approved feedbacks"
  ON public.customer_feedbacks FOR SELECT
  USING (approved = true);

-- Admins can manage all feedbacks
CREATE POLICY "Admins can manage feedbacks"
  ON public.customer_feedbacks FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
