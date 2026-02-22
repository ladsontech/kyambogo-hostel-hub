import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Shield, Building2, Users, Phone, Eye, Trash2, LogOut, Search, Loader2, Image as ImageIcon, Menu, X, Bed, Plus, Edit, Star, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAllHostels, useDeleteHostel, useToggleFeature, useApproveHostel } from "@/hooks/useAdminData";
import CarouselManager from "@/components/CarouselManager";
import AdminHostelForm from "@/components/AdminHostelForm";
import { AddRoomDialog } from "@/components/AddRoomDialog";
import { EditRoomDialog } from "@/components/EditRoomDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface BrokerNode {
  email: string;
  name: string;
  phone: string;
  hostels: any[];
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHostelForm, setShowHostelForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<any>(null);
  const { data: hostels, isLoading } = useAllHostels();
  const deleteHostel = useDeleteHostel();
  const toggleFeature = useToggleFeature();
  const approveHostel = useApproveHostel();
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

  const handleApprove = (hostelId: string, currentApproved: boolean) => {
    approveHostel.mutate({ id: hostelId, approved: !currentApproved });
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

  const brokersMap = new Map<string, BrokerNode>();
  (hostels || []).forEach((h: any) => {
    const key = h.contact_email || h.contact_phone || h.contact_name || 'unknown';
    if (!brokersMap.has(key)) {
      brokersMap.set(key, {
        email: h.contact_email || '',
        name: h.contact_name || '',
        phone: h.contact_phone || '',
        hostels: []
      });
    }
    brokersMap.get(key)!.hostels.push(h);
  });
  const brokers = Array.from(brokersMap.values()).filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[#1B4FA8]" />
          <span className="ml-2 text-sm sm:text-base text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="mx-auto px-4 md:px-8 lg:px-12 h-14 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-10 sm:h-10 bg-[#1B4FA8] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <Shield className="h-3 w-3 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-xl font-bold text-gray-800 truncate">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Kyambogo Hostel Connect</p>
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

      <main className="mx-auto px-0 md:px-8 lg:px-12 py-3 sm:py-8 max-w-7xl">
        {/* Heco Pulse Notification */}
        {hostels?.some((h: any) => !h.approved) && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50 backdrop-blur-sm shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between p-4 px-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                  <div className="relative w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Tamu Pulse</h4>
                  <p className="text-xs text-blue-700 font-medium">
                    {hostels.filter((h: any) => !h.approved).length} broker listings are waiting for your approval.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-4 rounded-full h-8"
                  onClick={() => {
                    const pending = hostels.filter((h: any) => !h.approved);
                    pending.forEach((h: any) => handleApprove(h.id, false));
                  }}
                >
                  APPROVE ALL
                </Button>
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full border border-blue-100">
                  <Mic className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Voice ready</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-6 mb-4 sm:mb-8 bg-white sm:bg-transparent shadow-sm sm:shadow-none divide-y sm:divide-y-0">
          <Card className="p-4 sm:p-5 rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-0 sm:border border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Hostels</CardTitle>
              <Building2 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{hostels?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                All registered hostels
              </p>
            </CardContent>
          </Card>

          <Card className="p-4 sm:p-5 rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-0 sm:border border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Contact Points</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
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

          <Card className="p-4 sm:p-5 rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-0 sm:border border-gray-100 sm:col-span-1 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Rooms</CardTitle>
              <Bed className="h-4 w-4 text-gray-400" />
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

        <Tabs defaultValue="hostels" className="space-y-4 sm:space-y-6 px-3 sm:px-0">
          <TabsList className="grid w-full grid-cols-4 h-auto bg-gray-100/80 p-1">
            <TabsTrigger value="hostels" className="px-1 sm:px-4 py-2 flex items-center gap-2 data-[state=active]:text-[#1B4FA8]">
              <Building2 className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium">Hostels</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="px-1 sm:px-4 py-2 flex items-center gap-2 data-[state=active]:text-[#1B4FA8]">
              <Bed className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium">Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="brokers" className="px-1 sm:px-4 py-2 flex items-center gap-2 data-[state=active]:text-[#1B4FA8]">
              <Users className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium">Brokers</span>
            </TabsTrigger>
            <TabsTrigger value="carousel" className="px-1 sm:px-4 py-2 flex items-center gap-2 data-[state=active]:text-[#1B4FA8]">
              <ImageIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium">Carousel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hostels" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">All Hostels</h2>
                  <Button 
                    onClick={() => setShowHostelForm(!showHostelForm)}
                    className="bg-[#1B4FA8] hover:bg-blue-800 text-xs sm:text-sm w-fit"
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
                <Card key={hostel.id} className="rounded-none sm:rounded-xl shadow-sm border-0 sm:border border-gray-100 hover:shadow-md transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-sm sm:text-xl font-semibold text-gray-800 truncate">{hostel.name}</h3>
                            <div className="flex gap-2">
                              {hostel.approved ? (
                                <Badge className="bg-green-100 text-green-800 w-fit text-xs">Active</Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 w-fit text-xs">Pending</Badge>
                              )}
                              {hostel.featured && (
                                <Badge className="bg-blue-100 text-blue-800 w-fit text-xs">
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
                          variant={hostel.approved ? "outline" : "default"}
                          size="sm"
                          className={`text-xs ${!hostel.approved ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                          onClick={() => handleApprove(hostel.id, hostel.approved)}
                          disabled={approveHostel.isPending}
                        >
                          {hostel.approved ? (
                            <><XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Revoke</>
                          ) : (
                            <><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Approve</>
                          )}
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
                <Card key={room.id} className="rounded-none sm:rounded-xl shadow-sm border-0 sm:border border-gray-100 hover:shadow-md transition-all">
                  <CardContent className="p-4 sm:p-6">
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


          </TabsContent>

          <TabsContent value="brokers" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Broker Management</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search brokers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm focus:ring-[#1B4FA8]"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {brokers.map((broker, index) => {
                const totalRooms = broker.hostels.reduce((acc, h) => acc + (h.rooms?.length || 0), 0);
                const isAllApproved = broker.hostels.every(h => h.approved);
                
                return (
                  <Card key={index} className="rounded-none sm:rounded-xl shadow-sm border-0 sm:border border-gray-100 hover:shadow-md transition-all">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-sm sm:text-xl font-semibold text-gray-800 truncate">
                              {broker.name || 'Unnamed Broker'}
                            </h3>
                            {isAllApproved ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending Reviews</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                            <p className="flex items-center gap-2">
                              <span className="font-medium text-gray-500 w-12">Email:</span>
                              <span className="truncate">{broker.email || '—'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-medium text-gray-500 w-12">Phone:</span>
                              <span>{broker.phone || '—'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-medium text-gray-500 w-12">Hostels:</span>
                              <span>{broker.hostels.length} linked</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-medium text-gray-500 w-12">Rooms:</span>
                              <span>{totalRooms} active types</span>
                            </p>
                          </div>
                          
                          <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                            <strong>Hostels List:</strong> {broker.hostels.map(h => h.name).join(', ')}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                          {!isAllApproved && (
                            <Button 
                              size="sm"
                              className="w-full bg-[#1B4FA8] hover:bg-blue-800 text-xs"
                              onClick={() => {
                                broker.hostels.forEach(h => {
                                  if (!h.approved) handleApprove(h.id, false);
                                });
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve All
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              if(confirm('Are you sure? This will delete ' + broker.hostels.length + ' hostels and all their rooms.')) {
                                broker.hostels.forEach(h => handleDelete(h.id));
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Burn & Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {brokers.length === 0 && (
              <div className="text-center py-8 sm:py-16">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600">No brokers found</h3>
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
