
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
          rooms(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      contact_name: string;
      contact_phone: string;
      contact_email: string;
      images?: string[];
      amenities?: string[];
    }) => {
      const { data, error } = await supabase
        .from('hostels')
        .insert([hostelData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
      toast({
        title: "Hostel Created",
        description: "The hostel has been added successfully.",
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
      contact_name: string;
      contact_phone: string;
      contact_email: string;
      images?: string[];
      amenities?: string[];
    }) => {
      const { data, error } = await supabase
        .from('hostels')
        .update(hostelData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
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
      type: string;
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
      type: string;
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
      toast({
        title: "Room Deleted",
        description: "The room has been removed.",
        variant: "destructive"
      });
    }
  });
};
