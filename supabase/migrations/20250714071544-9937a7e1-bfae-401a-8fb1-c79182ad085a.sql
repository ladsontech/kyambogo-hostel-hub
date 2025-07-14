
-- First, drop the foreign key constraint if it exists
ALTER TABLE public.hostels DROP CONSTRAINT IF EXISTS hostels_owner_id_fkey;

-- Remove the owner_id column since we're no longer using it
ALTER TABLE public.hostels DROP COLUMN IF EXISTS owner_id;
