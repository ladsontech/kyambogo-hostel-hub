
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Hostel } from '@/types/hostel';

export const useHostels = () => {
  return useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          owner:owners(*),
          rooms(*)
        `)
        .eq('approved', true);

      if (error) throw error;

      return data.map((hostel): Hostel => ({
        id: hostel.id,
        name: hostel.name,
        location: hostel.location,
        description: hostel.description || '',
        images: hostel.images || [],
        roomTypes: hostel.rooms.map(room => ({
          id: room.id,
          type: room.type as any,
          price: room.price,
          pricePeriod: room.price_period as 'month' | 'semester',
          description: room.description || '',
          images: room.images || [],
          totalRooms: room.total_rooms,
          availableRooms: room.available_rooms
        })),
        ownerId: hostel.owner_id,
        ownerName: hostel.owner?.name || '',
        ownerContact: hostel.owner?.phone || '',
        approved: hostel.approved,
        createdAt: new Date(hostel.created_at).toISOString().split('T')[0]
      }));
    }
  });
};

export const useHostel = (id: string) => {
  return useQuery({
    queryKey: ['hostel', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          owner:owners(*),
          rooms(*)
        `)
        .eq('id', id)
        .eq('approved', true)
        .single();

      if (error) throw error;

      const hostel: Hostel = {
        id: data.id,
        name: data.name,
        location: data.location,
        description: data.description || '',
        images: data.images || [],
        roomTypes: data.rooms.map(room => ({
          id: room.id,
          type: room.type as any,
          price: room.price,
          pricePeriod: room.price_period as 'month' | 'semester',
          description: room.description || '',
          images: room.images || [],
          totalRooms: room.total_rooms,
          availableRooms: room.available_rooms
        })),
        ownerId: data.owner_id,
        ownerName: data.owner?.name || '',
        ownerContact: data.owner?.phone || '',
        approved: data.approved,
        createdAt: new Date(data.created_at).toISOString().split('T')[0]
      };

      return hostel;
    },
    enabled: !!id
  });
};
