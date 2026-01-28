-- Add message length constraint to prevent payload spam
ALTER TABLE public.contact_submissions
ADD CONSTRAINT contact_message_len CHECK (char_length(message) <= 2000);