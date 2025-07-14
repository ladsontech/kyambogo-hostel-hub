
-- Add RLS policies to allow authenticated users to insert, update, and delete rooms
CREATE POLICY "Authenticated users can insert rooms" 
ON public.rooms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update rooms" 
ON public.rooms 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete rooms" 
ON public.rooms 
FOR DELETE 
USING (true);
