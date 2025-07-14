
-- First, ensure the hostels table has all necessary contact fields
ALTER TABLE public.hostels 
ALTER COLUMN contact_name SET NOT NULL,
ALTER COLUMN contact_phone SET NOT NULL,
ALTER COLUMN contact_email SET NOT NULL;

-- Update any hostels that might have null contact information
UPDATE public.hostels 
SET 
  contact_name = COALESCE(contact_name, 'Unknown'),
  contact_phone = COALESCE(contact_phone, 'Unknown'),
  contact_email = COALESCE(contact_email, 'unknown@example.com')
WHERE contact_name IS NULL OR contact_phone IS NULL OR contact_email IS NULL;

-- Drop the foreign key constraint if it exists
ALTER TABLE public.hostels DROP CONSTRAINT IF EXISTS hostels_owner_id_fkey;

-- Remove the owner_id column completely
ALTER TABLE public.hostels DROP COLUMN IF EXISTS owner_id;

-- Update RLS policies to remove owner-based restrictions
DROP POLICY IF EXISTS "Owners can create hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can view their own hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can update their own hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can delete their own hostels" ON public.hostels;

-- Create simplified policies for hostels
DROP POLICY IF EXISTS "Allow all operations on hostels" ON public.hostels;
CREATE POLICY "Anyone can view hostels" ON public.hostels
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage hostels" ON public.hostels
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Update RLS policies for rooms to remove owner-based restrictions
DROP POLICY IF EXISTS "Owners can create rooms for their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can view rooms of their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can update rooms of their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can delete rooms of their hostels" ON public.rooms;

-- Create simplified policies for rooms
CREATE POLICY "Anyone can view rooms" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage rooms" ON public.rooms
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Finally, drop the owners table completely
DROP TABLE IF EXISTS public.owners CASCADE;
