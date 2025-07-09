
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type RoomType = Database['public']['Enums']['room_type'];

export const useOwnerProfile = () => {
  return useQuery({
    queryKey: ['owner-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('owners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      if (error) throw error;

      return data;
    }
  });
};

export const useOwnerHostels = () => {
  return useQuery({
    queryKey: ['owner-hostels'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          rooms(*)
        `)
        .eq('owner_id', (
          await supabase
            .from('owners')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id);

      if (error) throw error;

      return data;
    }
  });
};

export const useCreateOwnerProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: { name: string; email: string; phone: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('owners')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-profile'] });
      toast({
        title: "Profile Created",
        description: "Your owner profile has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
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
      description?: string;
      images?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: owner } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!owner) throw new Error('Owner profile not found');

      const { data, error } = await supabase
        .from('hostels')
        .insert({
          owner_id: owner.id,
          ...hostelData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-hostels'] });
      toast({
        title: "Hostel Created",
        description: "Your hostel has been submitted for approval.",
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
      type: RoomType;
      price: number;
      description?: string;
      images?: string[];
      total_rooms: number;
      available_rooms: number;
    }) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert(roomData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-hostels'] });
      toast({
        title: "Room Added",
        description: "Room has been added successfully.",
      });
    }
  });
};
