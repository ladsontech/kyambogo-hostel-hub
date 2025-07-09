
-- Create a storage bucket for hostel images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hostel-images', 'hostel-images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'hostel-images' AND 
  auth.role() = 'authenticated'
);

-- Create policy to allow public read access to images
CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'hostel-images');

-- Create policy to allow users to update their own images
CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'hostel-images' AND 
  auth.role() = 'authenticated'
);

-- Create policy to allow users to delete their own images
CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'hostel-images' AND 
  auth.role() = 'authenticated'
);
