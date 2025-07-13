import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Shield, Building2, Users, Phone, Eye, Trash2, LogOut, Search, Loader2, Image as ImageIcon, Menu, X, Bed, Plus, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useAllHostels, useDeleteHostel } from "@/hooks/useAdminData";
import CarouselManager from "@/components/CarouselManager";
import AdminHostelForm from "@/components/AdminHostelForm";
import EditHostelDialog from "@/components/EditHostelDialog";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHostelForm, setShowHostelForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<any>(null);
  const { data: hostels, isLoading } = useAllHostels();
  const deleteHostel = useDeleteHostel();

  const allRooms = (hostels || []).flatMap((hostel: any) => 
    (hostel.rooms || []).map((room: any) => ({
      ...room,
      hostelName: hostel.name,
      hostelLocation: hostel.location,
      contactPhone: hostel.contact_phone
    }))
  );

  const handleDelete = (hostelId: string) => {
    if (confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
      deleteHostel.mutate(hostelId);
    }
  };

  const filteredHostels = (hostels || []).filter((hostel: any) =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRooms = allRooms.filter((room: any) =>
    room.hostelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.hostelLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Kyambogo Hostel Connect</p>
            </div>
          </div>
          
          <button
            className="sm:hidden p-2 text-gray-600 hover:text-blue-600 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="hidden sm:flex items-center space-x-4 flex-shrink-0">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t bg-white">
            <div className="container mx-auto px-2 sm:px-4 py-4 space-y-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mb-4 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Hostels</CardTitle>
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-2xl font-bold">{hostels?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                All registered hostels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Contact Points</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-2xl font-bold">
                {[...new Set(hostels?.map((h: any) => h.contact_phone))].length}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique contacts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Rooms</CardTitle>
              <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-2xl font-bold">
                {allRooms.length}
              </div>
              <p className="text-xs text-muted-foreground">
                All available rooms
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="hostels" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-full sm:max-w-lg text-xs sm:text-sm">
            <TabsTrigger value="hostels" className="px-1 sm:px-4">Hostels</TabsTrigger>
            <TabsTrigger value="rooms" className="px-1 sm:px-4">
              <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="carousel" className="px-1 sm:px-4">
              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Carousel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hostels" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800">All Hostels</h2>
                <Button 
                  onClick={() => setShowHostelForm(!showHostelForm)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hostel
                </Button>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hostels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {showHostelForm && (
              <div className="mb-8">
                <AdminHostelForm 
                  onSuccess={() => setShowHostelForm(false)}
                  onCancel={() => setShowHostelForm(false)}
                />
              </div>
            )}

            <div className="space-y-4">
              {filteredHostels.map((hostel: any) => (
                <Card key={hostel.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-xl font-semibold text-gray-800 truncate">{hostel.name}</h3>
                          <Badge className="bg-green-100 text-green-800 w-fit">Active</Badge>
                        </div>
                        <p className="text-gray-600 mb-3 text-sm sm:text-base">{hostel.location}</p>
                        <p className="text-gray-700 mb-4 line-clamp-2 text-sm sm:text-base">{hostel.description}</p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-800 text-sm sm:text-base">Contact Details</h4>
                            <div className="text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{hostel.contact_phone}</span>
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-800 text-sm sm:text-base">Hostel Info</h4>
                            <div className="text-sm text-gray-600">
                              <p>{hostel.rooms?.length || 0} Room Types</p>
                              <p>Added {new Date(hostel.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {hostel.rooms?.slice(0, 3).map((room: any) => (
                            <Badge key={room.id} variant="outline" className="text-xs">
                              {room.price.toLocaleString()} UGX
                            </Badge>
                          ))}
                          {hostel.rooms && hostel.rooms.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{hostel.rooms.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-row lg:flex-col gap-2 lg:ml-4 flex-shrink-0">
                        <Link to={`/hostel/${hostel.id}`} className="flex-1 lg:flex-none">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 lg:flex-none"
                          onClick={() => setEditingHostel(hostel)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 lg:flex-none"
                          onClick={() => window.open(`tel:${hostel.contact_phone}`, '_blank')}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:border-red-300"
                          onClick={() => handleDelete(hostel.id)}
                          disabled={deleteHostel.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHostels.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <Building2 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No hostels found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or add a new hostel</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800">All Rooms</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredRooms.map((room: any) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-xl font-semibold text-gray-800 capitalize">
                            {room.type.replace('-', ' ')} Room
                          </h3>
                          <Badge className="bg-blue-100 text-blue-800 w-fit">
                            {room.price.toLocaleString()} UGX / {room.price_period}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-800 text-sm sm:text-base">Hostel Details</h4>
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">{room.hostelName}</p>
                              <p>{room.hostelLocation}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-800 text-sm sm:text-base">Room Info</h4>
                            <div className="text-sm text-gray-600">
                              <p>Total: {room.total_rooms} rooms</p>
                              <p>Available: {room.available_rooms} rooms</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800 text-sm sm:text-base">Contact</h4>
                          <div className="text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 flex-shrink-0" />
                              <span>{room.contactPhone}</span>
                            </p>
                          </div>
                        </div>

                        {room.description && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-700">{room.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-row lg:flex-col gap-2 lg:ml-4 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 lg:flex-none"
                          onClick={() => window.open(`tel:${room.contactPhone}`, '_blank')}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <Bed className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No rooms found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="carousel" className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800">Carousel Management</h2>
            <CarouselManager />
          </TabsContent>
        </Tabs>
      </main>

      <EditHostelDialog
        open={!!editingHostel}
        onOpenChange={(open) => !open && setEditingHostel(null)}
        hostel={editingHostel}
      />
    </div>
  );
};

export default AdminDashboard;
