
-- Add a featured field to the hostels table to control homepage ordering
ALTER TABLE public.hostels 
ADD COLUMN featured boolean NOT NULL DEFAULT false;

-- Add an index for better performance when querying featured hostels
CREATE INDEX idx_hostels_featured ON public.hostels(featured, created_at);
