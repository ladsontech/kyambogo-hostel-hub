
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Plus, Trash2, Eye, LogOut, Settings, Loader2, Wifi, Car, Shield, Coffee } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROOM_TYPE_LABELS, AVAILABLE_AMENITIES } from "@/types/hostel";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useOwnerHostel, useCreateRoom, useDeleteRoom } from "@/hooks/useOwnerData";
import { Database } from "@/integrations/supabase/types";
import ImageUpload from "@/components/ImageUpload";
import HostelOnboarding from "@/components/HostelOnboarding";
import { EditRoomDialog } from "@/components/EditRoomDialog";

type RoomType = Database['public']['Enums']['room_type'];

const OwnerDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    type: "" as RoomType,
    price: "",
    pricePeriod: "semester" as "month" | "semester",
    description: "",
    totalRooms: "",
    availableRooms: "",
    images: [] as string[]
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { data: hostel, isLoading: hostelLoading } = useOwnerHostel();
  const createRoom = useCreateRoom();
  const deleteRoom = useDeleteRoom();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/owner");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      navigate("/owner");
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hostel?.id) {
      toast({
        title: "No Hostel Found",
        description: "Please complete hostel setup first.",
        variant: "destructive"
      });
      return;
    }
    
    createRoom.mutate({
      hostel_id: hostel.id,
      type: newRoomData.type,
      price: parseInt(newRoomData.price),
      price_period: newRoomData.pricePeriod,
      description: newRoomData.description,
      total_rooms: parseInt(newRoomData.totalRooms),
      available_rooms: parseInt(newRoomData.availableRooms),
      images: newRoomData.images
    }, {
      onSuccess: () => {
        toast({
          title: "Room Added",
          description: "Your room has been added successfully.",
        });
        setNewRoomData({
          type: "" as RoomType,
          price: "",
          pricePeriod: "semester",
          description: "",
          totalRooms: "",
          availableRooms: "",
          images: []
        });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to Add Room",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    deleteRoom.mutate(roomId);
  };

  const getAmenityIcon = (amenityId: string) => {
    const amenity = AVAILABLE_AMENITIES.find(a => a.id === amenityId);
    if (!amenity) return Wifi;
    
    switch (amenity.icon) {
      case 'Wifi': return Wifi;
      case 'Car': return Car;
      case 'Shield': return Shield;
      case 'Coffee': return Coffee;
      default: return Wifi;
    }
  };

  const getAmenityName = (amenityId: string) => {
    const amenity = AVAILABLE_AMENITIES.find(a => a.id === amenityId);
    return amenity?.name || amenityId;
  };

  if (loading || hostelLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Show onboarding if no hostel exists
  if (!hostel) {
    return (
      <HostelOnboarding 
        onComplete={() => setShowOnboarding(false)}
      />
    );
  }

  // Show onboarding if user wants to edit hostel
  if (showOnboarding) {
    return (
      <HostelOnboarding 
        onComplete={() => setShowOnboarding(false)}
        existingHostel={{
          name: hostel.name,
          location: hostel.location,
          description: hostel.description || "",
          images: hostel.images || [],
          amenities: hostel.amenities || []
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-xl font-bold text-gray-800 truncate">{hostel.name}</h1>
              <p className="text-xs text-gray-600 truncate hidden sm:block">{hostel.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowOnboarding(true)}
              className="hidden sm:flex"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Hostel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowOnboarding(true)}
              className="sm:hidden p-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden sm:flex">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="sm:hidden p-2">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="rooms" className="text-xs sm:text-sm">My Rooms</TabsTrigger>
            <TabsTrigger value="add-room" className="text-xs sm:text-sm">Add Room</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Hostel Overview</h2>
                <p className="text-gray-600 mt-1">
                  Status: <Badge className={hostel.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {hostel.approved ? 'Approved' : 'Pending Approval'}
                  </Badge>
                </p>
              </div>
            </div>

            {/* Hostel Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Basic Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-sm sm:text-base">{hostel.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Location</Label>
                    <p className="text-sm sm:text-base">{hostel.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-sm sm:text-base text-gray-700 line-clamp-3">{hostel.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  {hostel.amenities && hostel.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {hostel.amenities.map((amenityId) => {
                        const IconComponent = getAmenityIcon(amenityId);
                        return (
                          <div key={amenityId} className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{getAmenityName(amenityId)}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No amenities added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600">
                        {hostel.rooms?.length || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Room Types</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {hostel.rooms?.reduce((sum, room) => sum + room.total_rooms, 0) || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Total Rooms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                        {hostel.rooms?.reduce((sum, room) => sum + room.available_rooms, 0) || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                        {hostel.amenities?.length || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Amenities</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Your Rooms</h2>
                <p className="text-gray-600 mt-1">
                  Status: <Badge className={hostel.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {hostel.approved ? 'Approved' : 'Pending Approval'}
                  </Badge>
                </p>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {hostel.rooms?.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg leading-tight">
                        {ROOM_TYPE_LABELS[room.type as keyof typeof ROOM_TYPE_LABELS]}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {room.available_rooms}/{room.total_rooms} Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        UGX {room.price.toLocaleString()}/{room.price_period}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">{room.description}</p>
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <EditRoomDialog room={room} />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                        >
                          <Trash2 className="h-4 w-4 mr-1 sm:mr-0 sm:only:mr-0" />
                          <span className="sm:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!hostel.rooms || hostel.rooms.length === 0) && (
              <div className="text-center py-12 sm:py-16">
                <Building2 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No rooms added yet</h3>
                <p className="text-gray-500 mb-6 px-4">Add your first room to start accepting bookings</p>
                <Button 
                  onClick={() => {
                    const addRoomTab = document.querySelector('[value="add-room"]') as HTMLElement;
                    if (addRoomTab) addRoomTab.click();
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Room
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add-room" className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Add New Room</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Room Information</CardTitle>
                <p className="text-sm text-gray-600">Add a new room type to your hostel</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRoom} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Room Type</Label>
                      <Select 
                        value={newRoomData.type} 
                        onValueChange={(value: RoomType) => setNewRoomData({...newRoomData, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price (UGX)</Label>
                      <Input 
                        type="number" 
                        placeholder="350000" 
                        value={newRoomData.price}
                        onChange={(e) => setNewRoomData({...newRoomData, price: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pricing Period</Label>
                    <RadioGroup 
                      value={newRoomData.pricePeriod} 
                      onValueChange={(value: "month" | "semester") => setNewRoomData({...newRoomData, pricePeriod: value})}
                      className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="semester" id="semester" />
                        <Label htmlFor="semester">Per Semester</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="month" id="month" />
                        <Label htmlFor="month">Per Month</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Total Rooms</Label>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        min="1" 
                        value={newRoomData.totalRooms}
                        onChange={(e) => setNewRoomData({...newRoomData, totalRooms: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currently Available</Label>
                      <Input 
                        type="number" 
                        placeholder="8" 
                        min="0" 
                        value={newRoomData.availableRooms}
                        onChange={(e) => setNewRoomData({...newRoomData, availableRooms: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Room Description</Label>
                    <Textarea 
                      placeholder="Describe this room type, its features, amenities, and what makes it special..."
                      rows={4}
                      value={newRoomData.description}
                      onChange={(e) => setNewRoomData({...newRoomData, description: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Room Images</Label>
                    <ImageUpload
                      images={newRoomData.images}
                      onImagesChange={(images) => setNewRoomData({...newRoomData, images})}
                      maxImages={3}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={createRoom.isPending}
                    >
                      {createRoom.isPending ? "Adding Room..." : "Add Room"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setNewRoomData({
                          type: "" as RoomType,
                          price: "",
                          pricePeriod: "semester",
                          description: "",
                          totalRooms: "",
                          availableRooms: "",
                          images: []
                        });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OwnerDashboard;
