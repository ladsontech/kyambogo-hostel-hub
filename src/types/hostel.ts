
export interface RoomType {
  id: string;
  type: 'single-self-contained' | 'double-self-contained' | 'single-shared' | 'double-shared';
  price: number;
  pricePeriod: 'month' | 'semester';
  description: string;
  images: string[];
  totalRooms: number;
  availableRooms: number;
}

export interface Hostel {
  id: string;
  name: string;
  location: string;
  description: string;
  images: string[];
  roomTypes: RoomType[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  approved: boolean;
  createdAt: string;
  amenities?: string[];
}

export const ROOM_TYPE_LABELS = {
  'single-self-contained': 'Single Self-Contained',
  'double-self-contained': 'Double Self-Contained',
  'single-shared': 'Single Room (Shared Bathroom)',
  'double-shared': 'Double Room (Shared Bathroom)'
} as const;

export const AVAILABLE_AMENITIES = [
  { id: 'wifi', name: 'Free WiFi', icon: 'Wifi' },
  { id: 'parking', name: 'Parking', icon: 'Car' },
  { id: 'security', name: '24/7 Security', icon: 'Shield' },
  { id: 'common_area', name: 'Common Area', icon: 'Coffee' }
] as const;
