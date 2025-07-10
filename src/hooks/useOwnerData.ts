
import { useState } from 'react';
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
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
};

export const useCreateOwnerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: {
      name: string;
      email: string;
      phone: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if profile already exists
      const { data: existing } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        throw new Error('Owner profile already exists');
      }

      const { data, error } = await supabase
        .from('owners')
        .insert({
          user_id: user.id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-profile'] });
    }
  });
};

export const useOwnerHostel = () => {
  return useQuery({
    queryKey: ['owner-hostel'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First get the owner profile with better error handling
      const { data: owner, error: ownerError } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ownerError) throw ownerError;
      if (!owner) return null;

      // Then get the hostel for this owner with optimized query
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          rooms (
            id,
            type,
            price,
            price_period,
            description,
            images,
            total_rooms,
            available_rooms,
            created_at
          )
        `)
        .eq('owner_id', owner.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    enabled: true
  });
};

export const useCreateOrUpdateHostel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hostelData: {
      name: string;
      location: string;
      description: string;
      images?: string[];
      amenities?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get owner profile with better error handling
      const { data: owner, error: ownerError } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ownerError) throw ownerError;
      if (!owner) throw new Error('Owner profile not found');

      // Check if hostel already exists for this owner
      const { data: existingHostel, error: checkError } = await supabase
        .from('hostels')
        .select('id')
        .eq('owner_id', owner.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingHostel) {
        // Update existing hostel
        const { data, error } = await supabase
          .from('hostels')
          .update({
            name: hostelData.name,
            location: hostelData.location,
            description: hostelData.description,
            images: hostelData.images || [],
            amenities: hostelData.amenities || []
          })
          .eq('id', existingHostel.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new hostel
        const { data, error } = await supabase
          .from('hostels')
          .insert({
            owner_id: owner.id,
            name: hostelData.name,
            location: hostelData.location,
            description: hostelData.description,
            images: hostelData.images || [],
            amenities: hostelData.amenities || []
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-hostel'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
    },
    onError: (error: any) => {
      console.error('Error saving hostel:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save hostel",
        variant: "destructive"
      });
    }
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomData: {
      hostel_id: string;
      type: RoomType;
      price: number;
      price_period: 'month' | 'semester';
      description?: string;
      images?: string[];
      total_rooms: number;
      available_rooms: number;
    }) => {
      // Validate data before sending
      if (roomData.available_rooms > roomData.total_rooms) {
        throw new Error('Available rooms cannot exceed total rooms');
      }

      const { data, error } = await supabase
        .from('rooms')
        .insert(roomData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-hostel'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
    }
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ roomId, roomData }: {
      roomId: string;
      roomData: {
        type?: RoomType;
        price?: number;
        price_period?: 'month' | 'semester';
        description?: string;
        images?: string[];
        total_rooms?: number;
        available_rooms?: number;
      };
    }) => {
      // Validate if both room counts are provided
      if (roomData.available_rooms !== undefined && roomData.total_rooms !== undefined) {
        if (roomData.available_rooms > roomData.total_rooms) {
          throw new Error('Available rooms cannot exceed total rooms');
        }
      }

      const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', roomId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-hostel'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: "Room Updated",
        description: "The room has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update room",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-hostel'] });
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: "Room Deleted",
        description: "The room has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete room",
        variant: "destructive"
      });
    }
  });
};
