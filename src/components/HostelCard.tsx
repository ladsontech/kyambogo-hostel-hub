
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, BedDouble } from "lucide-react";
import { Hostel, ROOM_TYPE_LABELS } from "@/types/hostel";
import { generateWhatsAppLink } from "@/utils/mockData";
import { Link } from "react-router-dom";

interface HostelCardProps {
  hostel: Hostel;
}

export const HostelCard = ({ hostel }: HostelCardProps) => {
  const minPrice = Math.min(...hostel.roomTypes.map(rt => rt.price));
  const maxPrice = Math.max(...hostel.roomTypes.map(rt => rt.price));
  
  // Check if all rooms have the same pricing period
  const allSamePeriod = hostel.roomTypes.every(rt => rt.pricePeriod === hostel.roomTypes[0].pricePeriod);
  const periodLabel = allSamePeriod ? hostel.roomTypes[0].pricePeriod : 'mixed';

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={hostel.images[0]}
          alt={hostel.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            {hostel.roomTypes.length} Room Types
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
          {hostel.name}
        </CardTitle>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {hostel.location}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-gray-600 line-clamp-2">{hostel.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {hostel.roomTypes.map((roomType) => (
            <Badge key={roomType.id} variant="outline" className="text-xs">
              {ROOM_TYPE_LABELS[roomType.type]}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600 font-semibold">
            <span>
              {minPrice === maxPrice 
                ? `UGX ${minPrice.toLocaleString()}${periodLabel !== 'mixed' ? `/${periodLabel}` : ''}`
                : `UGX ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}${periodLabel !== 'mixed' ? `/${periodLabel}` : ''}`
              }
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 space-x-2">
        <Link to={`/hostel/${hostel.id}`} className="flex-1">
          <Button variant="outline" className="w-full hover:bg-green-50 hover:border-green-300">
            View Details
          </Button>
        </Link>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => window.open(generateWhatsAppLink(hostel.name), '_blank')}
        >
          Reach Out
        </Button>
      </CardFooter>
    </Card>
  );
};
