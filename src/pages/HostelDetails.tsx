
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Star, Wifi, Car, Shield, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROOM_TYPE_LABELS } from "@/types/hostel";
import { generateWhatsAppLink } from "@/utils/mockData";
import { useHostel } from "@/hooks/useHostels";
import { Loader2 } from "lucide-react";

const HostelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: hostel, isLoading, error } = useHostel(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading hostel details...</span>
        </div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Hostel Not Found</h2>
            <p className="text-gray-600 mb-4">The hostel you're looking for doesn't exist or is not available.</p>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Car, name: "Parking" },
    { icon: Shield, name: "24/7 Security" },
    { icon: Coffee, name: "Common Area" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hostel Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{hostel.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{hostel.location}</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-gray-600">4.8 (124 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {hostel.images.map((image, index) => (
              <div key={index} className={`rounded-lg overflow-hidden ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <img
                  src={image}
                  alt={`${hostel.name} view ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Hostel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{hostel.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <amenity.icon className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Types */}
            <Card>
              <CardHeader>
                <CardTitle>Available Room Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hostel.roomTypes.map((room) => (
                    <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {ROOM_TYPE_LABELS[room.type]}
                        </h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {room.price.toLocaleString()} UGX
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{room.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={
                            room.availableRooms > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {room.availableRooms > 0 
                            ? `${room.availableRooms} Available` 
                            : 'Fully Booked'
                          }
                        </Badge>
                        <Button 
                          size="sm"
                          disabled={room.availableRooms === 0}
                          onClick={() => window.open(generateWhatsAppLink(hostel.name, ROOM_TYPE_LABELS[room.type]), '_blank')}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-gray-800">{hostel.ownerName}</p>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{hostel.ownerContact}</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(generateWhatsAppLink(hostel.name), '_blank')}
                >
                  Contact via WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`tel:${hostel.ownerContact}`, '_blank')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Room Types:</span>
                  <span className="font-medium">{hostel.roomTypes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Rooms:</span>
                  <span className="font-medium">
                    {hostel.roomTypes.reduce((sum, room) => sum + room.availableRooms, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range:</span>
                  <span className="font-medium">
                    {Math.min(...hostel.roomTypes.map(r => r.price)).toLocaleString()} - {Math.max(...hostel.roomTypes.map(r => r.price)).toLocaleString()} UGX
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostelDetails;
