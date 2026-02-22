import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAllHostels = () => {
  return useQuery({
    queryKey: ['all-hostels'],
    queryFn: async () => {
      console.log('Fetching all hostels for admin...');

      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          rooms(*)
        `)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all hostels:', error);
        throw error;
      }

      console.log('All hostels data:', data);
      return data;
    }
  });
};

export const useCreateHostel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hostelData: {
      name: string;
      location: string;
      description: string;
      contact_phone: string;
      contact_name?: string;
      contact_email?: string;
      images?: string[];
      amenities?: string[];
      featured?: boolean;
    }) => {
      console.log('Creating hostel with data:', hostelData);

      const insertData = {
        ...hostelData,
        approved: true, // Admin-created hostels are automatically approved
        contact_name: hostelData.contact_name || 'Admin',
        contact_email: hostelData.contact_email || 'admin@system.local',
        featured: hostelData.featured || false
      };

      console.log('Insert data:', insertData);

      const { data, error } = await supabase
        .from('hostels')
        .insert([insertData as any])
        .select()
        .single();

      if (error) {
        console.error('Error creating hostel:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        throw error;
      }

      console.log('Created hostel:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate both queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: "Hostel Created",
        description: "The hostel has been added successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to create hostel:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create hostel. Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateHostel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...hostelData }: {
      id: string;
      name: string;
      location: string;
      description: string;
      contact_phone: string;
      contact_name?: string;
      contact_email?: string;
      images?: string[];
      amenities?: string[];
      featured?: boolean;
    }) => {
      const updateData = {
        ...hostelData,
        contact_name: hostelData.contact_name || 'Admin',
        contact_email: hostelData.contact_email || 'admin@system.local',
        featured: hostelData.featured || false
      };

      const { data, error } = await supabase
        .from('hostels')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: "Hostel Updated",
        description: "The hostel has been updated successfully.",
      });
    }
  });
};

export const useToggleFeature = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { data, error } = await supabase
        .from('hostels')
        .update({ featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: data.featured ? "Hostel Featured" : "Feature Removed",
        description: data.featured
          ? "This hostel will now appear at the top of the homepage."
          : "This hostel will no longer be featured.",
      });
    }
  });
};

export const useApproveHostel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { data, error } = await supabase
        .from('hostels')
        .update({ approved })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: data.approved ? "Hostel Approved" : "Approval Revoked",
        description: data.approved
          ? "This hostel is now visible to everyone."
          : "This hostel is now pending approval.",
      });
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
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: "Hostel Deleted",
        description: "The hostel has been removed from the system.",
        variant: "destructive"
      });
    }
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (roomData: {
      hostel_id: string;
      type: 'single-self-contained' | 'double-self-contained' | 'single-shared' | 'double-shared';
      price: number;
      price_period: string;
      description?: string;
      images?: string[];
      total_rooms: number;
      available_rooms: number;
    }) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: "Room Added",
        description: "The room has been added successfully.",
      });
    }
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...roomData }: {
      id: string;
      type: 'single-self-contained' | 'double-self-contained' | 'single-shared' | 'double-shared';
      price: number;
      price_period: string;
      description?: string;
      images?: string[];
      total_rooms: number;
      available_rooms: number;
    }) => {
      const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: "Room Updated",
        description: "The room has been updated successfully.",
      });
    }
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const { data, error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: "Room Deleted",
        description: "The room has been removed.",
        variant: "destructive"
      });
    }
  });
};
