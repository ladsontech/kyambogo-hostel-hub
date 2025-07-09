
-- Update RLS policies for carousel_images to be more permissive
-- Remove the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can manage carousel images" ON public.carousel_images;

-- Create more specific policies
CREATE POLICY "Anyone can view carousel images" 
  ON public.carousel_images 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert carousel images" 
  ON public.carousel_images 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update carousel images" 
  ON public.carousel_images 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete carousel images" 
  ON public.carousel_images 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);
