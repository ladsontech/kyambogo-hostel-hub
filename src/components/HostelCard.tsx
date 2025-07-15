
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Wifi, Shield, Car, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { generateWhatsAppLink } from "@/utils/mockData";
import { Hostel } from "@/types/hostel";

interface HostelCardProps {
  hostel: Hostel;
}

const HostelCard = ({ hostel }: HostelCardProps) => {
  // Check if hostel has room types before accessing them
  const hasRoomTypes = hostel.roomTypes && hostel.roomTypes.length > 0;
  const lowestPrice = hasRoomTypes 
    ? Math.min(...hostel.roomTypes.map(room => room.price))
    : null;
  const pricePeriod = hasRoomTypes ? hostel.roomTypes[0].pricePeriod : null;

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'common_area':
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const whatsappLink = generateWhatsAppLink(hostel.name);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        {hostel.images && hostel.images.length > 0 ? (
          <img
            src={hostel.images[0]}
            alt={hostel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {hostel.featured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {lowestPrice && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white">
              From {lowestPrice.toLocaleString()} UGX/{pricePeriod}
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{hostel.name}</CardTitle>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{hostel.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 line-clamp-2">{hostel.description}</p>
        
        {hasRoomTypes && (
          <div className="flex flex-wrap gap-2">
            {hostel.roomTypes.slice(0, 2).map((room) => (
              <Badge key={room.id} variant="outline" className="text-xs">
                {room.type.replace('-', ' ')} - {room.price.toLocaleString()} UGX
              </Badge>
            ))}
            {hostel.roomTypes.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{hostel.roomTypes.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {!hasRoomTypes && (
          <Badge variant="outline" className="text-xs text-gray-500">
            Room details coming soon
          </Badge>
        )}
        
        {hostel.amenities && hostel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hostel.amenities.slice(0, 4).map((amenity) => (
              <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                {getAmenityIcon(amenity)}
                <span className="capitalize">{amenity.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Link to={`/hostel/${hostel.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => window.open(whatsappLink, '_blank')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostelCard;
