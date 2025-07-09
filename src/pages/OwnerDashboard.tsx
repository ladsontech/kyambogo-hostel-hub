
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Plus, Edit, Trash2, Eye, LogOut, Upload, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROOM_TYPE_LABELS } from "@/types/hostel";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useOwnerHostels, useCreateHostel, useCreateRoom } from "@/hooks/useOwnerData";
import { Database } from "@/integrations/supabase/types";

type RoomType = Database['public']['Enums']['room_type'];

const OwnerDashboard = () => {
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newHostelData, setNewHostelData] = useState({
    name: "",
    location: "",
    description: ""
  });
  const [newRoomData, setNewRoomData] = useState({
    type: "" as RoomType,
    price: "",
    description: "",
    totalRooms: "",
    availableRooms: ""
  });
  const [selectedHostelId, setSelectedHostelId] = useState<string>("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { data: hostels, isLoading: hostelsLoading } = useOwnerHostels();
  const createHostel = useCreateHostel();
  const createRoom = useCreateRoom();

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

  const handleCreateHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createHostel.mutate(newHostelData, {
      onSuccess: () => {
        toast({
          title: "Hostel Created",
          description: "Your hostel has been submitted for approval.",
        });
        setNewHostelData({ name: "", location: "", description: "" });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to Create Hostel",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHostelId) {
      toast({
        title: "No Hostel Selected",
        description: "Please select a hostel first.",
        variant: "destructive"
      });
      return;
    }
    
    createRoom.mutate({
      hostel_id: selectedHostelId,
      type: newRoomData.type,
      price: parseInt(newRoomData.price),
      description: newRoomData.description,
      total_rooms: parseInt(newRoomData.totalRooms),
      available_rooms: parseInt(newRoomData.availableRooms)
    }, {
      onSuccess: () => {
        toast({
          title: "Room Added",
          description: "Your room has been added successfully.",
        });
        setNewRoomData({
          type: "" as RoomType,
          price: "",
          description: "",
          totalRooms: "",
          availableRooms: ""
        });
        setShowAddRoom(false);
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

  if (loading || hostelsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
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
              <h1 className="text-xl font-bold text-gray-800">Owner Dashboard</h1>
              <p className="text-xs text-gray-600">Manage Your Hostels</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
        <Tabs defaultValue="hostels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="hostels">My Hostels</TabsTrigger>
            <TabsTrigger value="add-hostel">Add Hostel</TabsTrigger>
            <TabsTrigger value="add-room">Add Room</TabsTrigger>
          </TabsList>

          <TabsContent value="hostels" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Your Hostels</h2>
                <p className="text-gray-600 mt-1">Manage your hostel listings</p>
              </div>
            </div>

            {/* Hostels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels?.map((hostel) => (
                <Card key={hostel.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{hostel.name}</CardTitle>
                      <Badge 
                        className={
                          hostel.approved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {hostel.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-600 text-sm">{hostel.location}</p>
                      <p className="text-gray-600 text-sm line-clamp-2">{hostel.description}</p>
                      <div className="text-sm text-gray-500">
                        {hostel.rooms?.length || 0} room types
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedHostelId(hostel.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Select
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!hostels || hostels.length === 0) && (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hostels added yet</h3>
                <p className="text-gray-500 mb-6">Create your first hostel to start accepting bookings</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add-hostel" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Add New Hostel</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Hostel Information</CardTitle>
                <p className="text-sm text-gray-600">Create a new hostel listing</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateHostel} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Hostel Name</Label>
                    <Input 
                      placeholder="Green Valley Hostel" 
                      value={newHostelData.name}
                      onChange={(e) => setNewHostelData({...newHostelData, name: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      placeholder="Banda, Near Kyambogo University" 
                      value={newHostelData.location}
                      onChange={(e) => setNewHostelData({...newHostelData, location: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Describe your hostel, its amenities, and what makes it special..."
                      rows={4}
                      value={newHostelData.description}
                      onChange={(e) => setNewHostelData({...newHostelData, description: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={createHostel.isPending}
                    >
                      {createHostel.isPending ? "Creating..." : "Create Hostel"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-room" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Add New Room</h2>
            
            {selectedHostelId ? (
              <Card>
                <CardHeader>
                  <CardTitle>Room Information</CardTitle>
                  <p className="text-sm text-gray-600">
                    Adding room to: {hostels?.find(h => h.id === selectedHostelId)?.name}
                  </p>
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
                        <Label>Price (UGX per month)</Label>
                        <Input 
                          type="number" 
                          placeholder="350000" 
                          value={newRoomData.price}
                          onChange={(e) => setNewRoomData({...newRoomData, price: e.target.value})}
                          required 
                        />
                      </div>
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
                            description: "",
                            totalRooms: "",
                            availableRooms: ""
                          });
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Hostel Selected</h3>
                  <p className="text-gray-500 mb-6">Please select a hostel from the "My Hostels" tab first</p>
                  <Button 
                    onClick={() => document.querySelector('[value="hostels"]')?.click()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Go to My Hostels
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OwnerDashboard;
