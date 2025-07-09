
import { Hostel } from "@/types/hostel";

export const mockHostels: Hostel[] = [
  {
    id: "1",
    name: "Green Valley Hostel",
    location: "Banda, Near Kyambogo University",
    description: "A modern hostel with excellent amenities, just 5 minutes walk from the university main gate.",
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"
    ],
    roomTypes: [
      {
        id: "1-1",
        type: "single-self-contained",
        price: 1400000,
        pricePeriod: "semester",
        description: "Spacious single room with private bathroom, study desk, and wardrobe.",
        images: ["https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"],
        totalRooms: 10,
        availableRooms: 7
      },
      {
        id: "1-2",
        type: "double-self-contained",
        price: 1800000,
        pricePeriod: "semester",
        description: "Comfortable double room with two beds, private bathroom, and shared study area.",
        images: ["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"],
        totalRooms: 6,
        availableRooms: 4
      }
    ],
    ownerId: "owner1",
    ownerName: "John Mugisha",
    ownerContact: "+256701234567",
    approved: true,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Sunrise Student Lodge",
    location: "Kyaliwajjala, 10 minutes to campus",
    description: "Affordable accommodation with 24/7 security and reliable water supply.",
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"
    ],
    roomTypes: [
      {
        id: "2-1",
        type: "single-shared",
        price: 720000,
        pricePeriod: "semester",
        description: "Single room with shared bathroom facilities on each floor.",
        images: ["https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"],
        totalRooms: 15,
        availableRooms: 12
      },
      {
        id: "2-2",
        type: "double-shared",
        price: 1120000,
        pricePeriod: "semester",
        description: "Double room with shared bathroom, perfect for friends.",
        images: ["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"],
        totalRooms: 8,
        availableRooms: 5
      }
    ],
    ownerId: "owner2",
    ownerName: "Sarah Namukasa",
    ownerContact: "+256702345678",
    approved: true,
    createdAt: "2024-01-20"
  },
  {
    id: "3",
    name: "University Heights",
    location: "Banda Hill, Walking distance to campus",
    description: "Premium hostel with modern facilities, gym, and study rooms.",
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"
    ],
    roomTypes: [
      {
        id: "3-1",
        type: "single-self-contained",
        price: 1600000,
        pricePeriod: "semester",
        description: "Luxury single room with AC, private bathroom, and balcony view.",
        images: ["https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"],
        totalRooms: 12,
        availableRooms: 8
      },
      {
        id: "3-2",
        type: "double-self-contained",
        price: 2200000,
        pricePeriod: "semester",
        description: "Premium double room with AC, private bathroom, and study corner.",
        images: ["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"],
        totalRooms: 8,
        availableRooms: 3
      }
    ],
    ownerId: "owner3",
    ownerName: "David Ssebunya",
    ownerContact: "+256703456789",
    approved: true,
    createdAt: "2024-02-01"
  }
];

export const generateWhatsAppLink = (hostelName: string, roomType?: string) => {
  const adminNumber = "+256700000000"; // Replace with actual admin number
  const message = roomType 
    ? `Hello! I'm interested in the ${roomType} at ${hostelName}. Can you help me get in touch with the owner?`
    : `Hello! I'm interested in ${hostelName}. Can you help me get in touch with the owner?`;
  
  return `https://wa.me/${adminNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
};
