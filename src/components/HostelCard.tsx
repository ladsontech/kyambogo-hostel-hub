
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
  const lowestPrice = hasRoomTypes ? Math.min(...hostel.roomTypes.map(room => room.price)) : null;
  const pricePeriod = hasRoomTypes ? hostel.roomTypes[0].pricePeriod : null;

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'security':
        return <Shield className="h-3 w-3" />;
      case 'parking':
        return <Car className="h-3 w-3" />;
      case 'common_area':
        return <Users className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const whatsappLink = generateWhatsAppLink(hostel.name);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col bg-white/80 backdrop-blur-sm border-gray-200/50">
      <div className="aspect-[4/3] relative overflow-hidden">
        {hostel.images && hostel.images.length > 0 ? (
          <img 
            src={hostel.images[0]} 
            alt={hostel.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {hostel.featured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1">
              <Star className="h-2.5 w-2.5 mr-1" />
              Featured
            </Badge>
          )}
          {lowestPrice && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1">
              From {lowestPrice.toLocaleString()} UGX/{pricePeriod}
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-semibold line-clamp-1">{hostel.name}</CardTitle>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{hostel.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 px-3 pb-3 flex-1 flex flex-col">
        <p className="text-gray-700 line-clamp-2 text-xs leading-relaxed flex-1">{hostel.description}</p>
        
        {hasRoomTypes && (
          <div className="flex flex-wrap gap-1">
            {hostel.roomTypes.slice(0, 2).map(room => (
              <Badge key={room.id} variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                {room.type.replace('-', ' ')} - {room.price.toLocaleString()} UGX
              </Badge>
            ))}
            {hostel.roomTypes.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600">
                +{hostel.roomTypes.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {!hasRoomTypes && (
          <Badge variant="outline" className="text-xs text-gray-500 px-2 py-0.5 bg-gray-50">
            Room details coming soon
          </Badge>
        )}
        
        {hostel.amenities && hostel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hostel.amenities.slice(0, 4).map(amenity => (
              <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                {getAmenityIcon(amenity)}
                <span className="capitalize">{amenity.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 pt-2 mt-auto">
          <Link to={`/hostel/${hostel.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs h-8 hover:bg-gray-50">
              View Details
            </Button>
          </Link>
          <Button 
            onClick={() => window.open(whatsappLink, '_blank')} 
            size="sm"
            className="flex-1 bg-blue-700 hover:bg-blue-600 text-xs h-8"
          >
            <Phone className="h-3 w-3 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostelCard;
