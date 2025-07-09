
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, BedDouble, Wifi, Car, Shield, Zap } from "lucide-react";
import { mockHostels, generateWhatsAppLink } from "@/utils/mockData";
import { ROOM_TYPE_LABELS } from "@/types/hostel";

const HostelDetails = () => {
  const { id } = useParams();
  const hostel = mockHostels.find(h => h.id === id);

  if (!hostel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Hostel not found</h1>
          <Link to="/">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hostels
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Car, label: "Parking" },
    { icon: Shield, label: "24/7 Security" },
    { icon: Zap, label: "Reliable Power" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hostels
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{hostel.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg">{hostel.location}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <img
              src={hostel.images[0]}
              alt={hostel.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-4">
            {hostel.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${hostel.name} view ${index + 2}`}
                className="w-full h-44 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">About This Hostel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-lg">{hostel.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                      <amenity.icon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Available Room Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hostel.roomTypes.map((roomType) => (
                    <div key={roomType.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-6">
                        <img
                          src={roomType.images[0]}
                          alt={ROOM_TYPE_LABELS[roomType.type]}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {ROOM_TYPE_LABELS[roomType.type]}
                            </h3>
                            <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                              {roomType.price.toLocaleString()} UGX/month
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{roomType.description}</p>
                          <Button 
                            className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                            onClick={() => window.open(generateWhatsAppLink(hostel.name, ROOM_TYPE_LABELS[roomType.type]), '_blank')}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Inquire About This Room
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Ready to Book?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Contact our admin team to get connected with the hostel owner and secure your room.
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  onClick={() => window.open(generateWhatsAppLink(hostel.name), '_blank')}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Admin via WhatsApp
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    We'll connect you with the owner within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Room Types:</span>
                  <span className="font-medium">{hostel.roomTypes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Starting From:</span>
                  <span className="font-medium text-green-600">
                    {Math.min(...hostel.roomTypes.map(rt => rt.price)).toLocaleString()} UGX
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
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
