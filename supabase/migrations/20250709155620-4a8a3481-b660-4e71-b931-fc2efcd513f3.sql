
-- Drop existing restrictive policies for carousel-images bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

-- Create new permissive policies for carousel-images bucket
CREATE POLICY "Allow everyone to upload to carousel-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'carousel-images');

-- Allow everyone to read from carousel-images bucket
CREATE POLICY "Allow everyone to read carousel-images" ON storage.objects
FOR SELECT USING (bucket_id = 'carousel-images');

-- Allow everyone to update carousel-images
CREATE POLICY "Allow everyone to update carousel-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'carousel-images');

-- Allow everyone to delete from carousel-images
CREATE POLICY "Allow everyone to delete carousel-images" ON storage.objects
FOR DELETE USING (bucket_id = 'carousel-images');
