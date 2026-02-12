
-- Add length constraints to consultation_requests fields
ALTER TABLE public.consultation_requests
  ADD CONSTRAINT first_name_length CHECK (length(first_name) <= 100),
  ADD CONSTRAINT last_name_length CHECK (length(last_name) <= 100),
  ADD CONSTRAINT phone_length CHECK (length(phone) <= 30),
  ADD CONSTRAINT email_length CHECK (email IS NULL OR length(email) <= 255),
  ADD CONSTRAINT notes_length CHECK (notes IS NULL OR length(notes) <= 2000),
  ADD CONSTRAINT preferred_date_length CHECK (preferred_date IS NULL OR length(preferred_date) <= 50),
  ADD CONSTRAINT preferred_time_length CHECK (preferred_time IS NULL OR length(preferred_time) <= 50),
  ADD CONSTRAINT contact_method_length CHECK (length(contact_method) <= 50);
