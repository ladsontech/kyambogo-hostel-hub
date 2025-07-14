
-- First, update hostels table with owner information from owners table
UPDATE public.hostels 
SET 
  contact_name = owners.name,
  contact_phone = owners.phone,
  contact_email = owners.email
FROM public.owners 
WHERE hostels.owner_id = owners.id AND (
  hostels.contact_name IS NULL OR 
  hostels.contact_phone IS NULL OR 
  hostels.contact_email IS NULL
);

-- Make sure contact fields are properly set as NOT NULL after migration
ALTER TABLE public.hostels 
ALTER COLUMN contact_name SET NOT NULL,
ALTER COLUMN contact_phone SET NOT NULL,
ALTER COLUMN contact_email SET NOT NULL;

-- Now completely remove the owner_id column and its constraints
ALTER TABLE public.hostels DROP CONSTRAINT IF EXISTS hostels_owner_id_fkey;
ALTER TABLE public.hostels DROP COLUMN IF EXISTS owner_id;

-- Update RLS policies for hostels to remove owner-based restrictions
DROP POLICY IF EXISTS "Owners can create hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can view their own hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can update their own hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can delete their own hostels" ON public.hostels;

-- Create simpler policies for admin-managed hostels
CREATE POLICY "Allow all operations on hostels" ON public.hostels
  FOR ALL USING (true) WITH CHECK (true);

-- Update RLS policies for rooms to remove owner-based restrictions
DROP POLICY IF EXISTS "Owners can create rooms for their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can view rooms of their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can update rooms of their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can delete rooms of their hostels" ON public.rooms;

-- Create simpler policies for rooms
CREATE POLICY "Anyone can view all rooms" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations on rooms" ON public.rooms
  FOR ALL USING (true) WITH CHECK (true);

-- Finally, drop the owners table completely
DROP TABLE IF EXISTS public.owners CASCADE;
