
-- Add amenities column to hostels table
ALTER TABLE public.hostels 
ADD COLUMN amenities text[] DEFAULT '{}';
