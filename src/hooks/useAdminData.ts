
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAllHostels = () => {
  return useQuery({
    queryKey: ['all-hostels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          owner:owners(*),
          rooms(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};

export const useDeleteHostel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hostelId: string) => {
      const { data, error } = await supabase
        .from('hostels')
        .delete()
        .eq('id', hostelId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      toast({
        title: "Hostel Deleted",
        description: "The hostel has been removed from the system.",
        variant: "destructive"
      });
    }
  });
};
