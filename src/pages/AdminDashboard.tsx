import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Shield, Building2, Users, Phone, Eye, Trash2, LogOut, Search, Loader2, Image as ImageIcon, Menu, X, Bed, Plus, Edit, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAllHostels, useDeleteHostel, useToggleFeature } from "@/hooks/useAdminData";
import CarouselManager from "@/components/CarouselManager";
import AdminHostelForm from "@/components/AdminHostelForm";
import EditHostelDialog from "@/components/EditHostelDialog";
import { AddRoomDialog } from "@/components/AddRoomDialog";
import { EditRoomDialog } from "@/components/EditRoomDialog";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHostelForm, setShowHostelForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<any>(null);
  const { data: hostels, isLoading } = useAllHostels();
  const deleteHostel = useDeleteHostel();
  const toggleFeature = useToggleFeature();
  const isMobile = useIsMobile();

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

  const handleToggleFeature = (hostelId: string, currentFeatured: boolean) => {
    toggleFeature.mutate({ id: hostelId, featured: !currentFeatured });
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-sm sm:text-base text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 h-12 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-3 w-3 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-xl font-bold text-gray-800 truncate">Admin Dashboard</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Kyambogo Hostel Connect</p>
            </div>
          </div>
          
          <button
            className="sm:hidden p-2 text-gray-600 hover:text-blue-600 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
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
            <div className="container mx-auto px-3 py-3 space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Hostels</CardTitle>
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{hostels?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                All registered hostels
              </p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Contact Points</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">
                {[...new Set(hostels?.map((h: any) => h.contact_phone))].length}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique contacts
              </p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-6 sm:col-span-1 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Rooms</CardTitle>
              <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
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
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="hostels" className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
              Hostels
            </TabsTrigger>
            <TabsTrigger value="rooms" className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
              <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className={isMobile ? "sr-only" : ""}>Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="carousel" className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className={isMobile ? "sr-only" : ""}>Carousel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hostels" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-lg sm:text-3xl font-bold text-gray-800">All Hostels</h2>
                  <Button 
                    onClick={() => setShowHostelForm(!showHostelForm)}
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm w-fit"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Add Hostel
                  </Button>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    placeholder="Search hostels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 sm:pl-10 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {showHostelForm && (
              <div className="mb-6 sm:mb-8">
                <AdminHostelForm 
                  onSuccess={() => setShowHostelForm(false)}
                  onCancel={() => setShowHostelForm(false)}
                />
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              {filteredHostels.map((hostel: any) => (
                <Card key={hostel.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-sm sm:text-xl font-semibold text-gray-800 truncate">{hostel.name}</h3>
                            <div className="flex gap-2">
                              <Badge className="bg-green-100 text-green-800 w-fit text-xs">Active</Badge>
                              {hostel.featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 w-fit text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2 sm:mb-3 text-xs sm:text-base">{hostel.location}</p>
                          <p className="text-gray-700 mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-base">{hostel.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 sm:hidden">
                          {hostel.rooms?.slice(0, 2).map((room: any) => (
                            <Badge key={room.id} variant="outline" className="text-xs">
                              {room.price.toLocaleString()} UGX
                            </Badge>
                          ))}
                          {hostel.rooms && hostel.rooms.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{hostel.rooms.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800 text-xs sm:text-base">Contact Details</h4>
                          <div className="text-xs sm:text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">{hostel.contact_phone}</span>
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800 text-xs sm:text-base">Hostel Info</h4>
                          <div className="text-xs sm:text-sm text-gray-600">
                            <p>{hostel.rooms?.length || 0} Room Types</p>
                            <p>Added {new Date(hostel.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-wrap gap-2 mb-4">
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
                      
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        <Link to={`/hostel/${hostel.id}`} className="contents">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => setEditingHostel(hostel)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant={hostel.featured ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${hostel.featured ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                          onClick={() => handleToggleFeature(hostel.id, hostel.featured)}
                          disabled={toggleFeature.isPending}
                        >
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {hostel.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <AddRoomDialog 
                          hostelId={hostel.id} 
                          hostelName={hostel.name}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => window.open(`tel:${hostel.contact_phone}`, '_blank')}
                        >
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs text-red-600 hover:text-red-700 hover:border-red-300 col-span-2 sm:col-span-1"
                          onClick={() => handleDelete(hostel.id)}
                          disabled={deleteHostel.isPending}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHostels.length === 0 && (
              <div className="text-center py-8 sm:py-16">
                <Building2 className="h-8 w-8 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-base sm:text-xl font-semibold text-gray-600 mb-2">No hostels found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search criteria or add a new hostel</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg sm:text-3xl font-bold text-gray-800">All Rooms</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {filteredRooms.map((room: any) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-sm sm:text-xl font-semibold text-gray-800 capitalize">
                              {room.type.replace('-', ' ')} Room
                            </h3>
                            <Badge className="bg-blue-100 text-blue-800 w-fit text-xs">
                              {room.price.toLocaleString()} UGX / {room.price_period}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          <EditRoomDialog room={room} />
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => window.open(`tel:${room.contactPhone}`, '_blank')}
                          >
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800 text-xs sm:text-base">Hostel Details</h4>
                          <div className="text-xs sm:text-sm text-gray-600">
                            <p className="font-medium">{room.hostelName}</p>
                            <p>{room.hostelLocation}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800 text-xs sm:text-base">Room Info</h4>
                          <div className="text-xs sm:text-sm text-gray-600">
                            <p>Total: {room.total_rooms} rooms</p>
                            <p>Available: {room.available_rooms} rooms</p>
                          </div>
                        </div>
                      </div>

                      {room.description && (
                        <div>
                          <p className="text-xs sm:text-sm text-gray-700">{room.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-8 sm:py-16">
                <Bed className="h-8 w-8 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-base sm:text-xl font-semibold text-gray-600 mb-2">No rooms found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="carousel" className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-3xl font-bold text-gray-800">Carousel Management</h2>
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
