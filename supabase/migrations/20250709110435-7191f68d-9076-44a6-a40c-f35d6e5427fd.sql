
-- Create carousel_images table
CREATE TABLE public.carousel_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.carousel_images ENABLE ROW LEVEL Security;

-- Allow everyone to view carousel images (public content)
CREATE POLICY "Anyone can view carousel images" 
  ON public.carousel_images 
  FOR SELECT 
  USING (true);

-- Only authenticated users can manage carousel images (admin functionality)
CREATE POLICY "Authenticated users can manage carousel images" 
  ON public.carousel_images 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create storage bucket for carousel images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('carousel-images', 'carousel-images', true);

-- Create policy for carousel images bucket (public read, authenticated upload)
CREATE POLICY "Anyone can view carousel images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'carousel-images');

CREATE POLICY "Authenticated users can upload carousel images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'carousel-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update carousel images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'carousel-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete carousel images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'carousel-images' AND auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.carousel_images 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
