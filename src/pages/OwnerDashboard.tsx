
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
  const [hostels, setHostels] = useState([
    {
      id: "1",
      name: "Green Valley Hostel",
      location: "Banda, Near Kyambogo University",
      status: "approved",
      roomTypes: 2,
      created: "2024-01-15"
    }
  ]);
  const [showAddHostel, setShowAddHostel] = useState(false);
  const { toast } = useToast();

  const handleAddHostel = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Hostel Submitted",
      description: "Your hostel has been submitted for review. You'll be notified once it's approved.",
    });
    setShowAddHostel(false);
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
        <Tabs defaultValue="hostels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="hostels">My Hostels</TabsTrigger>
            <TabsTrigger value="add-hostel">Add Hostel</TabsTrigger>
          </TabsList>

          <TabsContent value="hostels" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">My Hostels</h2>
              <Button 
                onClick={() => setShowAddHostel(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Hostel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((hostel) => (
                <Card key={hostel.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{hostel.name}</CardTitle>
                      <Badge 
                        className={
                          hostel.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {hostel.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{hostel.location}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{hostel.roomTypes} Room Types</span>
                      <span>Added {hostel.created}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hostels.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hostels yet</h3>
                <p className="text-gray-500 mb-6">Add your first hostel to get started</p>
                <Button 
                  onClick={() => setShowAddHostel(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Hostel
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add-hostel" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Add New Hostel</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Hostel Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddHostel} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="hostel-name">Hostel Name</Label>
                      <Input id="hostel-name" placeholder="e.g., Green Valley Hostel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="e.g., Banda, Near Kyambogo University" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your hostel, its amenities, and what makes it special..."
                      rows={4}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hostel Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload hostel images</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Room Types</h3>
                    
                    <div className="space-y-6">
                      <Card className="border-2 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Room Type 1</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <Input type="number" placeholder="350000" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Room Description</Label>
                            <Textarea 
                              placeholder="Describe this room type, its features, and amenities..."
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Room Images</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Upload room images</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Button type="button" variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Room Type
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      Submit Hostel for Review
                    </Button>
                    <Button type="button" variant="outline" className="flex-1">
                      Save as Draft
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
