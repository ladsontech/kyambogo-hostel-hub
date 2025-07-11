import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Star, Wifi, Car, Shield, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROOM_TYPE_LABELS, AVAILABLE_AMENITIES } from "@/types/hostel";
import { generateWhatsAppLink } from "@/utils/mockData";
import { useHostel } from "@/hooks/useHostels";
import { Loader2 } from "lucide-react";
import SimpleImageCarousel from "@/components/SimpleImageCarousel";
const HostelDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    data: hostel,
    isLoading,
    error
  } = useHostel(id || '');
  const callPhoneNumber = "256789572007";
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="text-lg text-gray-600 font-medium">Loading hostel details...</span>
        </div>
      </div>;
  }
  if (error || !hostel) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hostel Not Found</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">The hostel you're looking for doesn't exist or is not available at the moment.</p>
            <Link to="/">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </div>;
  }

  // Get available amenities based on hostel's amenities array
  const hostelAmenities = AVAILABLE_AMENITIES.filter(amenity => hostel.amenities?.includes(amenity.id));
  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="hover:bg-green-50 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Search</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 lg:py-12">
        {/* Hero Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:mb-8">
            <div className="flex-1 mb-6 lg:mb-0 lg:pr-8">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {hostel.name}
              </h1>
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-3 text-green-600" />
                <span className="text-lg">{hostel.location}</span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="flex mr-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <span className="text-gray-600 font-medium">4.8 (124 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-4 rounded-2xl overflow-hidden shadow-2xl">
            {hostel.images.map((image, index) => <div key={index} className={`
                  relative overflow-hidden group cursor-pointer
                  ${index === 0 ? 'md:col-span-2 md:row-span-2 h-64 md:h-full' : 'h-32 md:h-48'}
                `}>
                <img src={image} alt={`${hostel.name} view ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>)}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  About This Hostel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{hostel.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {hostelAmenities.length > 0 && <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-gray-900">Amenities & Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {hostelAmenities.map(amenity => {
                  const IconComponent = amenity.icon === 'Wifi' ? Wifi : amenity.icon === 'Car' ? Car : amenity.icon === 'Shield' ? Shield : Coffee;
                  return <div key={amenity.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <IconComponent className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                        </div>;
                })}
                  </div>
                </CardContent>
              </Card>}

            {/* Room Types */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-900">Available Rooms</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-4">
                  {hostel.roomTypes.map(room => <div key={room.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                          {ROOM_TYPE_LABELS[room.type]}
                        </h3>
                        <div className="text-right">
                          <div className="text-2xl lg:text-3xl font-bold text-green-600">
                            {room.price.toLocaleString()} UGX
                          </div>
                          <div className="text-sm text-gray-500">per {room.pricePeriod}</div>
                        </div>
                      </div>
                      
                      {/* Room Images */}
                      {room.images && room.images.length > 0 && <div className="mb-4">
                          <SimpleImageCarousel images={room.images} />
                        </div>}
                      
                      <p className="text-gray-600 mb-3 leading-relaxed">{room.description}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <Badge className={`
                            text-sm px-3 py-1 font-medium
                            ${room.availableRooms > 0 ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800'}
                          `}>
                          {room.availableRooms > 0 ? `${room.availableRooms} Available` : 'Fully Booked'}
                        </Badge>
                        <Button size="lg" disabled={room.availableRooms === 0} onClick={() => window.open(generateWhatsAppLink(hostel.name, ROOM_TYPE_LABELS[room.type]), '_blank')} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6">
                          Book Now
                        </Button>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-green-600" />
                  Contact Owner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium" onClick={() => window.open(generateWhatsAppLink(hostel.name), '_blank')}>
                    Contact via WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50" onClick={() => window.open(`tel:${callPhoneNumber}`, '_blank')}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Room Types:</span>
                  <span className="font-bold text-gray-900">{hostel.roomTypes.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Available Rooms:</span>
                  <span className="font-bold text-green-600">
                    {hostel.roomTypes.reduce((sum, room) => sum + room.availableRooms, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Price Range:</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {Math.min(...hostel.roomTypes.map(r => r.price)).toLocaleString()} - {Math.max(...hostel.roomTypes.map(r => r.price)).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">UGX</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>;
};
export default HostelDetails;