
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCarouselImages = () => {
  return useQuery({
    queryKey: ['carousel-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    }
  });
};

export const useUploadCarouselImage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, displayOrder }: { file: File; displayOrder: number }) => {
      try {
        console.log('Starting carousel image upload...');
        
        // Upload image to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `carousel/${fileName}`;

        console.log('Uploading to path:', filePath);

        const { error: uploadError } = await supabase.storage
          .from('carousel-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        console.log('File uploaded successfully, getting public URL...');

        // Get public URL
        const { data } = supabase.storage
          .from('carousel-images')
          .getPublicUrl(filePath);

        console.log('Public URL:', data.publicUrl);

        // Save to database
        console.log('Saving to database...');
        const { data: carouselData, error: dbError } = await supabase
          .from('carousel_images')
          .insert({
            image_url: data.publicUrl,
            display_order: displayOrder
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        console.log('Carousel image saved successfully:', carouselData);
        return carouselData;
      } catch (error) {
        console.error('Full upload error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carousel-images'] });
      toast({
        title: "Image Uploaded",
        description: "Carousel image has been successfully uploaded.",
      });
    },
    onError: (error: any) => {
      console.error('Upload mutation error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload carousel image",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteCarouselImage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('carousel_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      return imageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carousel-images'] });
      toast({
        title: "Image Deleted",
        description: "Carousel image has been removed.",
      });
    }
  });
};
