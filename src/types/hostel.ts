
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
  ownerId: string;
  ownerName: string;
  ownerContact: string;
  approved: boolean;
  createdAt: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export const ROOM_TYPE_LABELS = {
  'single-self-contained': 'Single Self-Contained',
  'double-self-contained': 'Double Self-Contained',
  'single-shared': 'Single Room (Shared Bathroom)',
  'double-shared': 'Double Room (Shared Bathroom)'
} as const;
