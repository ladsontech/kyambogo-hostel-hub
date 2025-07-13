
-- Allow admins to create hostels directly
CREATE POLICY "Admins can create hostels" 
ON public.hostels 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
