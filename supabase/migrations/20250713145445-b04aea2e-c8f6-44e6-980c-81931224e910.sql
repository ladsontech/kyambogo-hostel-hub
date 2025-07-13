
-- Drop all existing policies on hostels table
DROP POLICY IF EXISTS "Admins can create hostels" ON public.hostels;
DROP POLICY IF EXISTS "Admins can view all hostels" ON public.hostels;
DROP POLICY IF EXISTS "Admins can update all hostels" ON public.hostels;
DROP POLICY IF EXISTS "Admins can delete all hostels" ON public.hostels;
DROP POLICY IF EXISTS "Anyone can view approved hostels" ON public.hostels;

-- Create a single permissive policy that allows all operations
CREATE POLICY "Allow all operations on hostels" 
ON public.hostels 
FOR ALL 
USING (true) 
WITH CHECK (true);
