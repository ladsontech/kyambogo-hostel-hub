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
import { Building2, Plus, Trash2, Eye, LogOut, Settings, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROOM_TYPE_LABELS } from "@/types/hostel";
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
          amenities: (hostel as any).amenities || []
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{hostel.name}</h1>
              <p className="text-xs text-gray-600">{hostel.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowOnboarding(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Hostel
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="rooms">My Rooms</TabsTrigger>
            <TabsTrigger value="add-room">Add Room</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Your Rooms</h2>
                <p className="text-gray-600 mt-1">
                  Status: <Badge className={hostel.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {hostel.approved ? 'Approved' : 'Pending Approval'}
                  </Badge>
                </p>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostel.rooms?.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {ROOM_TYPE_LABELS[room.type as keyof typeof ROOM_TYPE_LABELS]}
                      </CardTitle>
                      <Badge variant="outline">
                        {room.available_rooms}/{room.total_rooms} Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-green-600">
                        UGX {room.price.toLocaleString()}/{room.price_period}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">{room.description}</p>
                      <div className="flex space-x-2 pt-2">
                        <EditRoomDialog room={room} />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!hostel.rooms || hostel.rooms.length === 0) && (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No rooms added yet</h3>
                <p className="text-gray-500 mb-6">Add your first room to start accepting bookings</p>
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

          <TabsContent value="add-room" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Add New Room</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
                <p className="text-sm text-gray-600">Add a new room type to your hostel</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRoom} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="flex space-x-6"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="flex space-x-4 pt-6">
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
