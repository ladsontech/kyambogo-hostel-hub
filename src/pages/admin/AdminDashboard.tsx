import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Building2, Users, Phone, Eye, Trash2, LogOut, Search, Loader2, Image as ImageIcon, Menu, X, Bed, Plus, Edit, Star, CheckCircle, XCircle, Bot, Mic, ArrowLeft, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAllHostels, useDeleteHostel, useToggleFeature, useApproveHostel } from "@/hooks/useAdminData";
import CarouselManager from "@/components/CarouselManager";
import AdminHostelForm from "@/components/AdminHostelForm";
import EditHostelDialog from "@/components/EditHostelDialog";
import { AddRoomDialog } from "@/components/AddRoomDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface BrokerNode {
  email: string;
  name: string;
  phone: string;
  hostels: any[];
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeHostelIdForRooms, setActiveHostelIdForRooms] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHostelForm, setShowHostelForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<any>(null);
  const { data: hostels, isLoading } = useAllHostels();
  const deleteHostel = useDeleteHostel();
  const toggleFeature = useToggleFeature();
  const approveHostel = useApproveHostel();
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on smaller screens, unfold on large screens initially
  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);

  const allRooms = (hostels || []).flatMap((hostel: any) => 
    (hostel.rooms || []).map((room: any) => ({
      ...room,
      hostelId: hostel.id,
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
    (hostel.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hostel.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRooms = allRooms.filter((room: any) =>
    (room.hostelName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.hostelLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((room: any) => activeHostelIdForRooms ? room.hostelId === activeHostelIdForRooms : true);

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
    (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "hostels", label: "Hostels", icon: Building2 },
    { id: "brokers", label: "Brokers", icon: Users },
    { id: "carousel", label: "Carousel", icon: ImageIcon },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[#1B4FA8]" />
          <span className="ml-2 text-sm sm:text-base text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white shadow-sm transition-all duration-300 ease-in-out border-r border-gray-100 flex flex-col 
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} 
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-50 flex-shrink-0 relative">
          <div className={`overflow-hidden transition-all duration-300 flex items-center justify-center ${isSidebarCollapsed ? 'w-full' : 'w-auto'}`}>
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className={`transition-all duration-300 object-contain ${isSidebarCollapsed ? 'h-8 w-8' : 'h-10 w-auto'}`} 
            />
          </div>
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm text-gray-400 hover:text-[#1B4FA8] hover:border-[#1B4FA8] z-10 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <button 
            className="md:hidden ml-auto p-1 text-gray-500 hover:text-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1.5 px-3">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id || (activeTab === "rooms" && item.id === "hostels");
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                    if (item.id !== "rooms") setActiveHostelIdForRooms(null);
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center py-2.5 rounded-lg transition-all duration-200 group ${
                    isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
                  } ${
                    isActive 
                      ? 'bg-[#1B4FA8]/10 text-[#1B4FA8]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-[#1B4FA8]'
                  }`}
                >
                  <item.icon className={`transition-colors flex-shrink-0 ${
                    isActive ? 'text-[#1B4FA8]' : 'text-gray-400 group-hover:text-[#1B4FA8]'
                  } ${isSidebarCollapsed ? 'h-5 w-5' : 'mr-3 h-[18px] w-[18px]'}`} />
                  
                  <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden font-medium text-sm ${
                    isActive ? 'text-[#1B4FA8]' : 'text-gray-600 group-hover:text-[#1B4FA8]'
                  } ${isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-50">
          <Link to="/admin">
            <Button variant="ghost" className={`w-full text-[13px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start px-3'}`} title={isSidebarCollapsed ? "Sign Out" : undefined}>
              <LogOut className={`flex-shrink-0 ${isSidebarCollapsed ? 'mr-0 h-4 w-4' : 'mr-2 h-[18px] w-[18px]'}`} />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </Button>
          </Link>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 hidden md:flex sticky top-0 z-30 px-6 h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 -ml-2 text-gray-600 hover:text-[#1B4FA8] transition-colors rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-[#0f172a]">
                {activeTab === "rooms" ? 'Rooms Details' : menuItems.find(m => m.id === activeTab)?.label}
              </h1>
            </div>
            
            <div className="flex items-center">
              <Link to="/">
                <Button variant="outline" className="text-sm font-medium text-gray-700 border-gray-200 bg-white hover:bg-gray-50 shadow-sm h-9 rounded-lg px-4">
                  <Eye className="h-4 w-4 mr-2" />
                  View Frontend
                </Button>
              </Link>
            </div>
        </header>
        <header className="bg-white shadow-sm border-b border-gray-200 flex md:hidden sticky top-0 z-30 px-4 h-16 items-center justify-between">
          {/* Mobile Header logic maintained separate for clarity */}
          <div className="flex items-center gap-3">
              <button
                className="p-2 -ml-2 text-gray-600 hover:text-[#1B4FA8] transition-colors rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-bold text-[#0f172a]">
                {activeTab === "rooms" ? 'Rooms' : menuItems.find(m => m.id === activeTab)?.label}
              </h1>
            </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Card className="rounded-xl border-0 shadow-sm bg-white overflow-hidden relative group">
                  <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[13px] font-medium text-gray-500">Total Hostels</p>
                      <div className="text-3xl font-bold text-[#0f172a]">{hostels?.length || 0}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-[#1B4FA8]" strokeWidth={2} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border-0 shadow-sm bg-white overflow-hidden relative group">
                  <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[13px] font-medium text-gray-500">Contact Points</p>
                      <div className="text-3xl font-bold text-[#0f172a]">
                        {[...new Set(hostels?.map((h: any) => h.contact_phone))].length}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Users className="h-6 w-6 text-indigo-600" strokeWidth={2} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border-0 shadow-sm bg-white overflow-hidden relative group">
                  <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[13px] font-medium text-gray-500">Total Rooms</p>
                      <div className="text-3xl font-bold text-[#0f172a]">
                        {allRooms.length}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Bed className="h-6 w-6 text-emerald-600" strokeWidth={2} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {hostels?.some((h: any) => !h.approved) && (
                <Card className="border-0 bg-white shadow-sm overflow-hidden rounded-xl mt-6 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 px-6 gap-4 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                        <div className="relative w-10 h-10 rounded-full bg-[#1B4FA8]/10 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-[#1B4FA8]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-[#0f172a] mb-0.5">Pending Approvals</h4>
                        <p className="text-[13px] text-gray-500">
                          <span className="font-semibold text-gray-800">{hostels.filter((h: any) => !h.approved).length}</span> broker listings are waiting for your review.
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[13px] px-5 h-9 rounded-lg shadow-sm"
                      onClick={() => {
                        const pending = hostels.filter((h: any) => !h.approved);
                        pending.forEach((h: any) => handleApprove(h.id, false));
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve All Items
                    </Button>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="border-0 shadow-sm bg-white rounded-xl">
                  <CardContent className="p-6">
                    <h3 className="text-[15px] font-semibold text-[#0f172a] mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-gray-600 border-gray-100 hover:bg-gray-50 h-11 rounded-lg" onClick={() => setActiveTab("hostels")}>
                        <Building2 className="h-4 w-4 mr-3 text-gray-400" />
                        Manage Hostel Properties
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-gray-600 border-gray-100 hover:bg-gray-50 h-11 rounded-lg" onClick={() => setActiveTab("brokers")}>
                        <Users className="h-4 w-4 mr-3 text-gray-400" />
                        Broker Network Index
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-gray-600 border-gray-100 hover:bg-gray-50 h-11 rounded-lg" onClick={() => setActiveTab("carousel")}>
                        <ImageIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Edit Homepage Graphics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className="min-h-[500px]">
            {activeTab === "hostels" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search hostels..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10 bg-transparent border-0 focus-visible:ring-0 shadow-none text-[13px]"
                    />
                  </div>
                  <Button 
                    onClick={() => setShowHostelForm(!showHostelForm)}
                    className="bg-[#1B4FA8] hover:bg-blue-800 text-white h-10 rounded-lg px-5 shadow-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="font-medium text-[13px]">Add Hostel</span>
                  </Button>
                </div>

                {showHostelForm && (
                  <div className="mb-6">
                    <AdminHostelForm 
                      onSuccess={() => setShowHostelForm(false)}
                      onCancel={() => setShowHostelForm(false)}
                    />
                  </div>
                )}

                <div className="flex flex-col space-y-4">
                  {filteredHostels.map((hostel: any) => (
                    <Card key={hostel.id} className="rounded-xl border-0 bg-white hover:shadow-md shadow-sm transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-[17px] font-semibold text-[#0f172a]">{hostel.name}</h3>
                                {hostel.approved ? (
                                  <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 font-medium border border-emerald-100 text-[11px] px-2 py-0">Active</Badge>
                                ) : (
                                  <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 font-medium border border-amber-100 text-[11px] px-2 py-0">Pending</Badge>
                                )}
                                {hostel.featured && (
                                  <Badge className="bg-blue-50 text-[#1B4FA8] hover:bg-blue-50 font-medium border border-blue-100 text-[11px] px-2 py-0">
                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                    Featured
                                  </Badge>
                                )}
                            </div>
                            <p className="text-gray-500 text-[13px] flex items-center">
                              <Building2 className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                              {hostel.location}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                                <Link to={`/hostel/${hostel.id}`} className="contents">
                                  <Button variant="outline" size="sm" className="font-medium text-gray-600 hover:text-gray-900 rounded-lg h-8 bg-transparent border-gray-200 shadow-none px-3">
                                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                                    View
                                  </Button>
                                </Link>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="font-medium text-[#1B4FA8] hover:bg-blue-50 rounded-lg h-8 bg-blue-50/50 border-blue-100 shadow-none px-3"
                                  onClick={() => {
                                    setActiveHostelIdForRooms(hostel.id);
                                    setActiveTab("rooms");
                                    window.scrollTo(0, 0);
                                  }}
                                >
                                  <Bed className="h-3.5 w-3.5 mr-1.5" />
                                  Rooms
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="font-medium text-gray-600 hover:text-gray-900 rounded-lg h-8 bg-transparent border-gray-200 shadow-none px-3"
                                  onClick={() => setEditingHostel(hostel)}
                                >
                                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                                  Edit
                                </Button>
                                <Button
                                  variant={hostel.approved ? "outline" : "default"}
                                  size="sm"
                                  className={`font-medium rounded-lg h-8 shadow-none px-3 ${!hostel.approved ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-0' : 'text-gray-600 hover:text-gray-900 bg-transparent border-gray-200'}`}
                                  onClick={() => handleApprove(hostel.id, hostel.approved)}
                                  disabled={approveHostel.isPending}
                                >
                                  {hostel.approved ? (
                                    <><XCircle className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> Revoke</>
                                  ) : (
                                    <><CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve</>
                                  )}
                                </Button>
                                <Button 
                                  variant={hostel.featured ? "default" : "outline"}
                                  size="sm"
                                  className={`font-medium rounded-lg h-8 shadow-none px-3 ${hostel.featured ? 'bg-[#c97b1a] hover:bg-[#b06a15] text-white border-0' : 'text-gray-600 hover:text-gray-900 bg-transparent border-gray-200'}`}
                                  onClick={() => handleToggleFeature(hostel.id, hostel.featured)}
                                  disabled={toggleFeature.isPending}
                                >
                                  <Star className="h-3.5 w-3.5 mr-1.5" />
                                  {hostel.featured ? 'Unfeature' : 'Feature'}
                                </Button>
                          </div>
                        </div>

                        <p className="text-gray-500 text-[13.5px] leading-relaxed mb-5 line-clamp-2 lg:pr-32">
                           {hostel.description}
                        </p>

                        <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                            <div className="flex gap-12 sm:gap-20">
                                <div>
                                    <p className="text-[11px] font-medium text-gray-400 mb-1">Contact Details</p>
                                    <div className="flex items-center text-[13px] font-medium text-[#0f172a]">
                                        <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                        {hostel.contact_phone}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium text-gray-400 mb-1">Rooms Catalog</p>
                                    <div className="flex flex-wrap gap-2 text-[13px] font-medium text-[#0f172a]">
                                      {hostel.rooms?.slice(0, 3).map((room: any) => (
                                        <div key={room.id} className="flex items-center text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                                          {room.price.toLocaleString()} UGX
                                        </div>
                                      ))}
                                      {hostel.rooms && hostel.rooms.length > 3 && (
                                        <div className="flex items-center text-gray-400 text-xs font-medium">
                                          +{hostel.rooms.length - 3}
                                        </div>
                                      )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <AddRoomDialog hostelId={hostel.id} hostelName={hostel.name} />
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 ml-1 rounded-md"
                                  onClick={() => handleDelete(hostel.id)}
                                  disabled={deleteHostel.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredHostels.length === 0 && (
                    <div className="text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-50 mt-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="text-[15px] font-medium text-[#0f172a] mb-1">No properties found</h3>
                      <p className="text-[13px] text-gray-500 max-w-sm mx-auto">
                        We couldn't find any hostels matching your criteria. Try adjusting filters or add a new one.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "rooms" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setActiveTab("hostels");
                        setActiveHostelIdForRooms(null);
                      }}
                      className="text-gray-500 hover:text-gray-900 rounded-lg h-10 px-4"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <span className="font-medium text-[13px]">Back to Properties</span>
                    </Button>
                  </div>
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search rooms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10 bg-transparent border-0 focus-visible:ring-0 shadow-none text-[13px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredRooms.map((room: any) => (
                    <Card key={room.id} className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-all duration-200">
                      <CardContent className="p-0">
                        <div className="p-5 border-b border-gray-50 flex justify-between items-start">
                          <div>
                            <h3 className="text-[15px] font-semibold text-[#0f172a] capitalize mb-1.5">
                              {room.type.replace('-', ' ')} Room
                            </h3>
                            <div className="inline-flex py-1 px-2.5 bg-blue-50/50 border border-blue-100 rounded-md">
                              <span className="text-[13px] font-semibold text-[#1B4FA8]">
                                {room.price.toLocaleString()} UGX <span className="text-[#1B4FA8]/60 font-medium ml-1">/ {room.price_period}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13.5px] font-medium text-[#0f172a] truncate">{room.hostelName}</p>
                                <p className="text-[11.5px] text-gray-500 truncate">{room.hostelLocation}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 pt-1">
                              <div className="flex-1 bg-gray-50 rounded-lg p-2.5 border border-gray-100 flex items-center justify-between">
                                  <span className="text-[11px] font-medium text-gray-500">Total</span>
                                  <span className="text-[13px] font-semibold text-[#0f172a]">{room.total_rooms}</span>
                              </div>
                              <div className="flex-1 bg-emerald-50/50 rounded-lg p-2.5 border border-emerald-100 flex items-center justify-between">
                                  <span className="text-[11px] font-medium text-emerald-600/80">Available</span>
                                  <span className="text-[13px] font-semibold text-emerald-600">{room.available_rooms}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredRooms.length === 0 && (
                    <div className="col-span-full text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-50 mt-4">
                      <Bed className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-[15px] font-medium text-[#0f172a] mb-1">No rooms found</h3>
                      <p className="text-[13px] text-gray-500">Rooms connected to this property will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "brokers" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search brokers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10 bg-transparent border-0 focus-visible:ring-0 shadow-none text-[13px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {brokers.map((broker, index) => {
                    const totalRooms = broker.hostels.reduce((acc, h) => acc + (h.rooms?.length || 0), 0);
                    const isAllApproved = broker.hostels.every(h => h.approved);
                    
                    return (
                      <Card key={index} className="rounded-xl shadow-sm border-0 bg-white group hover:shadow-md transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                <span className="text-[15px] font-semibold text-indigo-600">
                                  {broker.name ? broker.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-[15px] font-semibold text-[#0f172a] leading-tight mb-0.5">
                                  {broker.name || 'Unnamed Broker'}
                                </h3>
                                {isAllApproved ? (
                                  <span className="text-[11.5px] font-medium text-emerald-600 flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-1" /> Verified Partner
                                  </span>
                                ) : (
                                  <span className="text-[11.5px] font-medium text-amber-600 flex items-center">
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Pending Approval
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-[13px] text-gray-600">
                              <Phone className="h-3.5 w-3.5 mr-2.5 text-gray-400" />
                              {broker.phone || 'No phone provided'}
                            </div>
                            <div className="flex items-center text-[13px] text-gray-600">
                              <Building2 className="h-3.5 w-3.5 mr-2.5 text-gray-400" />
                              <span className="font-medium text-[#0f172a] mr-1">{broker.hostels.length}</span> Active Listings
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-50">
                            {!isAllApproved && (
                              <Button 
                                className="flex-1 bg-[#1B4FA8] hover:bg-blue-800 text-white font-medium text-[13px] h-9 rounded-lg"
                                onClick={() => {
                                  broker.hostels.forEach(h => {
                                    if (!h.approved) handleApprove(h.id, false);
                                  });
                                }}
                              >
                                Approve Items
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              className={`font-medium text-[13px] bg-white h-9 rounded-lg ${isAllApproved ? 'w-full' : 'flex-1'} text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200`}
                              onClick={() => {
                                if(confirm('Are you sure? This will delete ' + broker.hostels.length + ' hostels and all their rooms.')) {
                                  broker.hostels.forEach(h => handleDelete(h.id));
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {brokers.length === 0 && (
                    <div className="col-span-full text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-50 mt-4">
                      <Users className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-[15px] font-medium text-[#0f172a] mb-1">No brokers found</h3>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "carousel" && (
              <div className="space-y-5 animate-in fade-in duration-300 max-w-5xl">
                <div className="bg-white rounded-xl border-0 shadow-sm overflow-hidden p-2">
                  <CarouselManager />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <EditHostelDialog
        open={!!editingHostel}
        onOpenChange={(open) => !open && setEditingHostel(null)}
        hostel={editingHostel}
      />
    </div>
  );
};

export default AdminDashboard;
