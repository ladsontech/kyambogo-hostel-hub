
-- Remove the approval column from hostels table
ALTER TABLE public.hostels DROP COLUMN approved;

-- Drop existing policies that reference approval
DROP POLICY IF EXISTS "Anyone can view approved hostels" ON public.hostels;
DROP POLICY IF EXISTS "Anyone can view rooms of approved hostels" ON public.rooms;

-- Create new policies without approval checks
CREATE POLICY "Anyone can view all hostels" ON public.hostels
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view all rooms" ON public.rooms
  FOR SELECT USING (true);
