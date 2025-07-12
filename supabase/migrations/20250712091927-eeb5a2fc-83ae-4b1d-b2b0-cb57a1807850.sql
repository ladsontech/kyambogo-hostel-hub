
-- Add contact information directly to hostels table
ALTER TABLE public.hostels 
ADD COLUMN contact_name TEXT,
ADD COLUMN contact_phone TEXT,
ADD COLUMN contact_email TEXT;

-- Update existing hostels with owner contact information
UPDATE public.hostels 
SET 
  contact_name = owners.name,
  contact_phone = owners.phone,
  contact_email = owners.email
FROM public.owners 
WHERE hostels.owner_id = owners.id;

-- Make contact fields required for new entries
ALTER TABLE public.hostels 
ALTER COLUMN contact_name SET NOT NULL,
ALTER COLUMN contact_phone SET NOT NULL,
ALTER COLUMN contact_email SET NOT NULL;

-- Drop the foreign key constraint
ALTER TABLE public.hostels DROP CONSTRAINT IF EXISTS hostels_owner_id_fkey;

-- Drop owner_id column as it's no longer needed
ALTER TABLE public.hostels DROP COLUMN owner_id;

-- Update RLS policies for hostels - only admins can manage everything
DROP POLICY IF EXISTS "Anyone can view approved hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can create hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can view their own hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can update their own hostels" ON public.hostels;
DROP POLICY IF EXISTS "Owners can delete their own hostels" ON public.hostels;

-- Create new policies for admin-only access
CREATE POLICY "Anyone can view all hostels" ON public.hostels
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all hostels" ON public.hostels
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Update RLS policies for rooms - only admins can manage
DROP POLICY IF EXISTS "Anyone can view rooms of approved hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can create rooms for their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can view rooms of their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can update rooms of their hostels" ON public.rooms;
DROP POLICY IF EXISTS "Owners can delete rooms of their hostels" ON public.rooms;

-- Create new policies for rooms
CREATE POLICY "Anyone can view all rooms" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all rooms" ON public.rooms
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop the owners table and user_roles table as they're no longer needed
DROP TABLE IF EXISTS public.owners CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
