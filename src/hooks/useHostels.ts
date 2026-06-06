
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Hostel } from '@/types/hostel';

export const useHostels = () => {
  return useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      console.log('Fetching hostels from database...');
      
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          id, name, location, description, images, amenities,
          featured, approved, created_at, updated_at,
          rooms(*)
        `)
        .eq('approved', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hostels:', error);
        throw error;
      }

      console.log('Raw hostels data:', data);

      if (!data) {
        console.log('No hostels data returned');
        return [];
      }

      const mappedHostels = data.map((hostel: any): Hostel => ({
        id: hostel.id,
        name: hostel.name,
        location: hostel.location,
        description: hostel.description || '',
        images: hostel.images || [],
        roomTypes: hostel.rooms?.map((room: any) => ({
          id: room.id,
          type: room.type as any,
          price: room.price,
          pricePeriod: room.price_period as 'month' | 'semester',
          description: room.description || '',
          images: room.images || [],
          totalRooms: room.total_rooms,
          availableRooms: room.available_rooms
        })) || [],
        contactName: hostel.contact_name || '',
        contactPhone: hostel.contact_phone || '',
        contactEmail: hostel.contact_email || '',
        approved: true, // All hostels are now approved by default
        createdAt: new Date(hostel.created_at).toISOString().split('T')[0],
        amenities: hostel.amenities || [],
        featured: hostel.featured || false
      }));

      console.log('Mapped hostels:', mappedHostels);
      return mappedHostels;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHostel = (id: string) => {
  return useQuery({
    queryKey: ['hostel', id],
    queryFn: async () => {
      console.log('Fetching single hostel:', id);
      
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          rooms(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching hostel:', error);
        throw error;
      }

      if (!data) {
        console.log('No hostel found with id:', id);
        return null;
      }

      const hostel: Hostel = {
        id: data.id,
        name: data.name,
        location: data.location,
        description: data.description || '',
        images: data.images || [],
        roomTypes: data.rooms?.map((room: any) => ({
          id: room.id,
          type: room.type as any,
          price: room.price,
          pricePeriod: room.price_period as 'month' | 'semester',
          description: room.description || '',
          images: room.images || [],
          totalRooms: room.total_rooms,
          availableRooms: room.available_rooms
        })) || [],
        contactName: (data as any).contact_name || '',
        contactPhone: (data as any).contact_phone || '',
        contactEmail: (data as any).contact_email || '',
        approved: true, // All hostels are now approved by default
        createdAt: new Date(data.created_at).toISOString().split('T')[0],
        amenities: data.amenities || [],
        featured: data.featured || false
      };

      console.log('Mapped single hostel:', hostel);
      return hostel;
    },
    enabled: !!id,
    retry: 2,
  });
};
