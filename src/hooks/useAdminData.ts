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
    }) => {
      console.log('Creating hostel with data:', hostelData);
      
      // First, ensure we have a system owner for admin-managed hostels
      let systemOwnerId = 'admin-system-owner';
      
      // Check if system owner exists
      const { data: existingOwner } = await supabase
        .from('owners')
        .select('id')
        .eq('id', systemOwnerId)
        .maybeSingle();

      if (!existingOwner) {
        // Create system owner if it doesn't exist
        const { data: newOwner, error: ownerError } = await supabase
          .from('owners')
          .insert([{
            id: systemOwnerId,
            name: 'System Admin',
            email: 'admin@system.local',
            phone: '0000000000',
            user_id: null
          }])
          .select()
          .single();

        if (ownerError) {
          console.log('Owner creation failed, using UUID for owner_id');
          // If we can't create the owner (due to RLS), use a UUID directly
          systemOwnerId = '00000000-0000-0000-0000-000000000000';
        }
      }

      const insertData = {
        ...hostelData,
        owner_id: systemOwnerId,
        approved: true, // Admin-created hostels are automatically approved
        contact_name: hostelData.contact_name || 'Admin',
        contact_email: hostelData.contact_email || 'admin@system.local'
      };

      const { data, error } = await supabase
        .from('hostels')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating hostel:', error);
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
        description: "Failed to create hostel. Please try again.",
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
    }) => {
      const updateData = {
        ...hostelData,
        contact_name: hostelData.contact_name || 'Admin',
        contact_email: hostelData.contact_email || 'admin@system.local'
      };

      const { data, error } = await supabase
        .from('hostels')
        .update(updateData)
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
