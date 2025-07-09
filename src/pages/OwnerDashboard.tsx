import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Plus, Edit, Trash2, Eye, LogOut, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { ROOM_TYPE_LABELS } from "@/types/hostel";
import { useToast } from "@/hooks/use-toast";

const OwnerDashboard = () => {
  const [hostels] = useState([
    {
      id: "1",
      name: "Green Valley Hostel",
      location: "Banda, Near Kyambogo University",
      status: "approved",
      rooms: [
        {
          id: "r1",
          type: "single-self-contained",
          price: 350000,
          description: "Spacious single room with private bathroom, study desk, and wardrobe.",
          available: 5,
          total: 8
        },
        {
          id: "r2", 
          type: "double-self-contained",
          price: 450000,
          description: "Comfortable double room with two beds and private bathroom.",
          available: 2,
          total: 4
        }
      ]
    }
  ]);
  
  const [selectedHostel, setSelectedHostel] = useState(hostels[0]);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const { toast } = useToast();

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Room Added",
      description: "Your room has been added successfully and is now available for booking.",
    });
    setShowAddRoom(false);
  };

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
              <p className="text-xs text-gray-600">Manage Your Rooms</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Link to="/owner">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
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
                <h2 className="text-3xl font-bold text-gray-800">Room Management</h2>
                <p className="text-gray-600 mt-1">Manage rooms in {selectedHostel.name}</p>
              </div>
              <Button 
                onClick={() => setShowAddRoom(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Room
              </Button>
            </div>

            {/* Hostel Info Card */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-green-800">{selectedHostel.name}</CardTitle>
                    <p className="text-green-600 mt-1">{selectedHostel.location}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {selectedHostel.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedHostel.rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{ROOM_TYPE_LABELS[room.type]}</CardTitle>
                      <Badge 
                        className={
                          room.available > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {room.available}/{room.total} Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-green-600">
                        {room.price.toLocaleString()} UGX/month
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{room.description}</p>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedHostel.rooms.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No rooms added yet</h3>
                <p className="text-gray-500 mb-6">Add your first room to start accepting bookings</p>
                <Button 
                  onClick={() => setShowAddRoom(true)}
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
                <p className="text-sm text-gray-600">Add a new room type to {selectedHostel.name}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRoom} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Room Type</Label>
                      <Select>
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
                      <Input type="number" placeholder="350000" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Total Rooms</Label>
                      <Input type="number" placeholder="10" min="1" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Currently Available</Label>
                      <Input type="number" placeholder="8" min="0" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Room Description</Label>
                    <Textarea 
                      placeholder="Describe this room type, its features, amenities, and what makes it special..."
                      rows={4}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Room Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload room images</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB each (Max 5 images)</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      Add Room
                    </Button>
                    <Button type="button" variant="outline" className="flex-1">
                      Cancel
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
