-- Drop existing restrictive policies for hostel-images bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

-- Create new permissive policies for hostel-images bucket
CREATE POLICY "Allow everyone to upload to hostel-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'hostel-images');

-- Allow everyone to update hostel-images
CREATE POLICY "Allow everyone to update hostel-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'hostel-images');

-- Allow everyone to delete from hostel-images
CREATE POLICY "Allow everyone to delete hostel-images" ON storage.objects
FOR DELETE USING (bucket_id = 'hostel-images');