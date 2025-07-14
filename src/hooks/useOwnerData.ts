
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

      // Since we no longer have an owners table, we check if the user has any hostels
      // This serves as their "profile" - if they have hostels, they're an owner
      const { data, error } = await supabase
        .from('hostels')
        .select('contact_name, contact_email, contact_phone')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      // Return the contact info from their first hostel, or null if they have no hostels
      return data ? {
        name: data.contact_name || '',
        email: data.contact_email || '',
        phone: data.contact_phone || ''
      } : null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
};

export const useCreateOwnerProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: {
      name: string;
      email: string;
      phone: string;
    }) => {
      // Since we don't have an owners table anymore, we just return the profile data
      // The actual hostel creation will handle storing this contact information
      return profileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-profile'] });
      toast({
        title: "Profile Ready",
        description: "You can now create your hostel listing.",
      });
    }
  });
};

export const useOwnerHostel = () => {
  return useQuery({
    queryKey: ['owner-hostel'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Find hostels where the contact_email matches the user's email
      // This is how we identify which hostel belongs to the current user
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
        .eq('contact_email', user.email)
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
      contact_name?: string;
      contact_phone?: string;
      contact_email?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if user already has a hostel (by email)
      const { data: existingHostel, error: checkError } = await supabase
        .from('hostels')
        .select('id')
        .eq('contact_email', user.email)
        .maybeSingle();

      if (checkError) throw checkError;

      const hostelPayload = {
        name: hostelData.name,
        location: hostelData.location,
        description: hostelData.description,
        images: hostelData.images || [],
        amenities: hostelData.amenities || [],
        contact_name: hostelData.contact_name || '',
        contact_phone: hostelData.contact_phone || '',
        contact_email: hostelData.contact_email || user.email,
        approved: true // Auto-approve for now
      };

      if (existingHostel) {
        // Update existing hostel
        const { data, error } = await supabase
          .from('hostels')
          .update(hostelPayload as any)
          .eq('id', existingHostel.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new hostel
        const { data, error } = await supabase
          .from('hostels')
          .insert([hostelPayload as any])
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
