
-- Add contact fields to hostels table for admin-managed hostels
ALTER TABLE public.hostels 
ADD COLUMN contact_name TEXT,
ADD COLUMN contact_phone TEXT,
ADD COLUMN contact_email TEXT;
