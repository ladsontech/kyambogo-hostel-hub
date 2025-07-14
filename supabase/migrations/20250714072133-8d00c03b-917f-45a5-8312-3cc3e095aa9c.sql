
-- First, drop any existing foreign key constraint
ALTER TABLE public.hostels DROP CONSTRAINT IF EXISTS hostels_owner_id_fkey;

-- Remove the NOT NULL constraint first
ALTER TABLE public.hostels ALTER COLUMN owner_id DROP NOT NULL;

-- Now drop the owner_id column completely
ALTER TABLE public.hostels DROP COLUMN owner_id;
