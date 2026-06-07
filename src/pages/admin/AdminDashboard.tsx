import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Building2, Users, Phone, Eye, Trash2, LogOut, Search, Loader2, Image as ImageIcon, Menu, X, Bed, Plus, Edit, Star, CheckCircle, XCircle, Bot, Mic, ArrowLeft, LayoutDashboard, ChevronLeft, ChevronRight, TrendingUp, Clock, FileText, Upload, PieChart, MoreVertical, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAllHostels, useDeleteHostel, useToggleFeature, useApproveHostel } from "@/hooks/useAdminData";
import CarouselManager from "@/components/CarouselManager";
import AdminHostelForm from "@/components/AdminHostelForm";
import EditHostelDialog from "@/components/EditHostelDialog";
import { AddRoomDialog } from "@/components/AddRoomDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchFilters } from "@/components/SearchFilters";
import AdminLocationsManager from "@/components/AdminLocationsManager";

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
  const [brokerTab, setBrokerTab] = useState("all");
  const [hostelView, setHostelView] = useState<"list" | "add">("list");
  const [editingHostel, setEditingHostel] = useState<any>(null);
  const { data: hostels, isLoading } = useAllHostels();
  const deleteHostel = useDeleteHostel();
  const toggleFeature = useToggleFeature();
  const approveHostel = useApproveHostel();
  const isMobile = useIsMobile();
  
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState("all");

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRoomType("all");
    setPriceRange("all");
    setSelectedUniversity("all");
  };

  // No longer auto-collapsing on mobile by default as per user request
  useEffect(() => {
    // We keep the state as is (expanded by default)
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

  const filteredHostels = (hostels || []).filter((hostel: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (hostel.name || '').toLowerCase().includes(searchLower) || 
      (hostel.location || '').toLowerCase().includes(searchLower) ||
      (hostel.description || '').toLowerCase().includes(searchLower);
    
    const rooms = hostel.rooms || [];
    const matchesRoomType = selectedRoomType === 'all' || rooms.some((room: any) => room.type === selectedRoomType);
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      if (priceRange === '0-200000') {
        matchesPrice = rooms.some((room: any) => room.price <= 200000);
      } else if (priceRange === '200000-350000') {
        matchesPrice = rooms.some((room: any) => room.price >= 200000 && room.price <= 350000);
      } else if (priceRange === '350000-500000') {
        matchesPrice = rooms.some((room: any) => room.price >= 350000 && room.price <= 500000);
      } else if (priceRange === '500000+') {
        matchesPrice = rooms.some((room: any) => room.price >= 500000);
      }
    }
    
    // University filter: all existing hostels are for Kyambogo
    const matchesUniversity = selectedUniversity === 'all' || 
      (hostel.university || 'kyambogo') === selectedUniversity;
      
    return matchesSearch && matchesRoomType && matchesPrice && matchesUniversity;
  });

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
  const brokers = Array.from(brokersMap.values()).filter(b => {
    const matchesSearch = (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (brokerTab === "pending") return matchesSearch && b.hostels.some(h => !h.approved);
    if (brokerTab === "verified") return matchesSearch && b.hostels.every(h => h.approved);
    if (brokerTab === "rejected") return false; // Placeholder
    return matchesSearch;
  });

  const allBrokersCount = Array.from(brokersMap.values()).length;
  const pendingBrokersCount = Array.from(brokersMap.values()).filter(b => b.hostels.some(h => !h.approved)).length;
  const verifiedBrokersCount = Array.from(brokersMap.values()).filter(b => b.hostels.every(h => h.approved)).length;
  const rejectedBrokersCount = 0;

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "hostels", label: "Hostels", icon: Building2 },
    { id: "brokers", label: "Brokers", icon: Users },
    { id: "locations", label: "Locations", icon: MapPin },
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
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#F1F5F9] shadow-sm transition-all duration-300 ease-in-out border-r border-[#E2E8F0] flex flex-col ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"} ${isSidebarCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0] flex-shrink-0 relative">
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
              <h2 className="text-xl font-bold text-[#0f172a] capitalize">
                {activeTab === 'hostels' && hostelView === 'add' ? 'Add Hostel' : activeTab.replace('-', ' ')}
              </h2>
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
          <div className="flex items-center gap-3">
              <button
                className="p-2 -ml-2 text-gray-600 hover:text-[#1B4FA8] transition-colors rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-bold text-[#0f172a] capitalize">
                {activeTab === 'hostels' && hostelView === 'add' ? 'Add Hostel' : activeTab.replace('-', ' ')}
              </h2>
            </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="pt-2">
                <p className="text-gray-500 text-sm">Welcome back, Admin. Here's what's happening.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="rounded-xl border border-gray-100 shadow-sm bg-white overflow-hidden p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[#1B4FA8] flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center text-emerald-500 text-xs font-medium">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-[#0f172a]">{hostels?.length || 0}</div>
                    <p className="text-xs font-medium text-gray-500">Total Hostels</p>
                  </div>
                </Card>

                <Card className="rounded-xl border border-gray-100 shadow-sm bg-white overflow-hidden p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center text-emerald-500 text-xs font-medium">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-[#0f172a]">{[...new Set(hostels?.map((h: any) => h.contact_phone))].length}</div>
                    <p className="text-xs font-medium text-gray-500">Active Brokers</p>
                  </div>
                </Card>

                <Card className="rounded-xl border border-gray-100 shadow-sm bg-white overflow-hidden p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-[#0f172a]">6</div>
                    <p className="text-xs font-medium text-gray-500">Carousel Images</p>
                  </div>
                </Card>

                <Card className="rounded-xl border border-gray-100 shadow-sm bg-white overflow-hidden p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[#0f172a] flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center text-emerald-500 text-xs font-medium">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +18%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-[#0f172a]">8.4K</div>
                    <p className="text-xs font-medium text-gray-500">Monthly Views</p>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <Card className="border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden h-full">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#0f172a] mb-6">Recent Activity</h3>
                      <div className="space-y-6">
                        {[
                          { title: "New broker verification request", sub: "by John Mukasa · 2 hours ago", color: "bg-orange-400" },
                          { title: "Hostel listing updated", sub: "by Sarah Nalubega · 4 hours ago", color: "bg-orange-400" },
                          { title: "New hostel added", sub: "by Admin · 1 day ago", color: "bg-orange-400" },
                          { title: "Broker verified", sub: "by Peter Ochieng · 2 days ago", color: "bg-orange-400" },
                          { title: "Carousel image uploaded", sub: "by Admin · 3 days ago", color: "bg-orange-400" }
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4 relative">
                            {i < 4 && <div className="absolute left-[5px] top-4 bottom-[-24px] w-[1px] bg-gray-100"></div>}
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color} mt-1.5 flex-shrink-0 z-10`}></div>
                            <div className="space-y-0.5 border-b border-gray-50 pb-5 w-full">
                              <p className="text-sm font-semibold text-[#0f172a]">{item.title}</p>
                              <p className="text-xs text-gray-500">{item.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card className="border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden h-full">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#0f172a] mb-6">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setActiveTab("hostels")}
                          className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-3 border border-transparent hover:border-gray-200"
                        >
                          <Building2 className="h-6 w-6 text-orange-400" />
                          <span className="text-sm font-semibold text-[#0f172a]">Add Hostel</span>
                        </button>
                        <button 
                          onClick={() => setActiveTab("brokers")}
                          className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-3 border border-transparent hover:border-gray-200"
                        >
                          <Users className="h-6 w-6 text-orange-400" />
                          <span className="text-sm font-semibold text-[#0f172a]">View Brokers</span>
                        </button>
                        <button 
                          onClick={() => setActiveTab("carousel")}
                          className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-3 border border-transparent hover:border-gray-200"
                        >
                          <ImageIcon className="h-6 w-6 text-orange-400" />
                          <span className="text-sm font-semibold text-[#0f172a]">Upload Image</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-3 border border-transparent hover:border-gray-200">
                          <TrendingUp className="h-6 w-6 text-orange-400" />
                          <span className="text-sm font-semibold text-[#0f172a]">View Reports</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          <div className="min-h-[500px]">
            {activeTab === "hostels" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {hostelView === "list" ? (
                  <>
                    <div className="pt-2">
                      <p className="text-gray-500 text-sm">Manage and update hostel property listings within the system.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                       <div className="flex-1">
                          <SearchFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedRoomType={selectedRoomType}
                            setSelectedRoomType={setSelectedRoomType}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            selectedUniversity={selectedUniversity}
                            setSelectedUniversity={setSelectedUniversity}
                            onClearFilters={handleClearFilters}
                          />
                       </div>
                       <Button 
                        onClick={() => setHostelView("add")}
                        className="bg-[#1B4FA8] hover:bg-blue-800 text-white h-12 rounded-xl px-8 shadow-lg shadow-blue-900/10 font-bold self-start mt-2 sm:mt-0"
                       >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Hostel
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredHostels.map((hostel: any) => (
                        <Card key={hostel.id} className="rounded-xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all flex flex-col">
                          <CardContent className="p-0 flex flex-col h-full">
                            <div className="p-5 flex-1 flex flex-col">
                              <div className="mb-4 flex justify-between items-start gap-4">
                                <div>
                                  <h3 className="text-xl font-bold text-[#0f172a] mb-1 group-hover:text-[#1B4FA8] transition-colors">{hostel.name}</h3>
                                  <p className="text-gray-500 text-sm font-medium flex items-center">
                                    <MapPin className="w-4 h-4 mr-1.5 text-[#1B4FA8] opacity-70" />
                                    {hostel.location}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  {hostel.approved ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-[10px] px-2 py-1 rounded-lg">Active</Badge>
                                  ) : (
                                    <Badge className="bg-amber-50 text-amber-600 border border-amber-100 font-bold text-[10px] px-2 py-1 rounded-lg">Pending</Badge>
                                  )}
                                  <button
                                    onClick={() => handleToggleFeature(hostel.id, hostel.featured)}
                                    disabled={toggleFeature.isPending}
                                    className={`inline-flex items-center justify-center font-bold text-[10px] px-2 py-1 rounded-lg border transition-colors ${
                                      hostel.featured 
                                        ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' 
                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                    }`}
                                  >
                                    <Star className={`h-3 w-3 mr-1 ${hostel.featured ? 'fill-current text-orange-500' : 'text-gray-400'}`} />
                                    {hostel.featured ? 'Featured' : 'Feature'}
                                  </button>
                                </div>
                              </div>

                              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                {hostel.description}
                              </p>

                              <div className="grid grid-cols-3 gap-2 mb-6 mt-auto">
                                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-500 capitalize mb-1">Total Rooms</p>
                                    <div className="flex items-center text-xs font-bold text-[#0f172a]">
                                        <Bed className="h-3 w-3 mr-1.5 text-[#1B4FA8]" />
                                        {hostel.rooms?.length || 0}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-500 capitalize mb-1">Broker</p>
                                    <div className="flex items-center text-xs font-bold text-[#0f172a] truncate">
                                        <Phone className="h-3.5 w-3.5 mr-2 text-[#1B4FA8]" />
                                        {hostel.contact_phone}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 col-span-1">
                                    <p className="text-[10px] font-bold text-gray-500 capitalize mb-1">Price Range</p>
                                    <div className="flex items-center text-xs font-bold text-[#1B4FA8]">
                                        {hostel.rooms?.length > 0 ? (
                                          <>
                                            {Math.min(...hostel.rooms.map((r: any) => r.price)).toLocaleString()} - {Math.max(...hostel.rooms.map((r: any) => r.price)).toLocaleString()}
                                          </>
                                        ) : (
                                          'No rooms'
                                        )}
                                    </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-gray-50">
                                <Link to={`/hostel/${hostel.id}`}>
                                  <Button variant="outline" size="sm" className="font-bold text-gray-600 rounded-xl h-9 border-gray-200 bg-white hover:bg-blue-50 hover:text-[#1B4FA8] hover:border-blue-200 transition-all duration-300 px-3">
                                    <Eye className="h-4 w-4 mr-1.5" />
                                    View
                                  </Button>
                                </Link>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="font-bold text-[#1B4FA8] rounded-xl h-9 bg-blue-50 border-blue-100 hover:bg-blue-100 hover:shadow-sm transition-all duration-300 px-3"
                                  onClick={() => {
                                    setActiveHostelIdForRooms(hostel.id);
                                    setActiveTab("rooms");
                                  }}
                                >
                                  <Bed className="h-4 w-4 mr-1.5" />
                                  Rooms
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="font-bold text-gray-600 rounded-xl h-9 border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300 px-3"
                                  onClick={() => setEditingHostel(hostel)}
                                >
                                  <Edit className="h-4 w-4 mr-1.5" />
                                  Edit
                                </Button>
                                <Button
                                  variant={hostel.approved ? "outline" : "default"}
                                  size="sm"
                                  className={`font-bold rounded-xl h-9 px-3 transition-all duration-300 ${!hostel.approved ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-0' : 'text-gray-600 hover:text-gray-900 bg-white border-gray-200'}`}
                                  onClick={() => handleApprove(hostel.id, hostel.approved)}
                                  disabled={approveHostel.isPending}
                                >
                                  {hostel.approved ? 'Revoke' : 'Approve'}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0 ml-auto rounded-xl"
                                  onClick={() => handleDelete(hostel.id)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="animate-in slide-in-from-right duration-500">
                    <div className="max-w-4xl mx-auto mb-8 px-8">
                      <div className="flex items-center gap-6">
                         <Button 
                          variant="ghost" 
                          onClick={() => setHostelView("list")}
                          className="h-12 w-12 p-0 rounded-full bg-[#1B4FA8] hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 flex-shrink-0"
                         >
                          <ChevronLeft className="h-7 w-7" />
                         </Button>
                         <div>
                           <h2 className="text-2xl font-bold text-[#0f172a]">Add New Hostel</h2>
                           <p className="text-gray-500 text-sm">Create a new property listing in the system</p>
                         </div>
                      </div>
                    </div>
                    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden p-8 max-w-4xl mx-auto">
                      <AdminHostelForm 
                        onSuccess={() => setHostelView("list")}
                        onCancel={() => setHostelView("list")}
                      />
                    </Card>
                  </div>
                )}

                {hostelView === "list" && filteredHostels.length === 0 && (
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
            )}

            {activeTab === "rooms" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="pt-2">
                  <p className="text-gray-500 text-sm">Review and manage individual room units and availability.</p>
                </div>
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setActiveTab("hostels");
                        setActiveHostelIdForRooms(null);
                      }}
                      className="h-10 w-10 p-0 rounded-full bg-[#1B4FA8] hover:bg-blue-800 text-white shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="font-bold text-sm text-[#0f172a]">Back to Properties</span>
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
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="pt-2">
                  <p className="text-gray-500 text-sm">Manage and verify broker partners</p>
                </div>

                <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search brokers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-11 bg-transparent border-0 focus-visible:ring-0 shadow-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex border-b border-gray-100 mb-6 font-medium">
                  {[
                    { label: "All", count: allBrokersCount, id: "all" },
                    { label: "Pending", count: pendingBrokersCount, id: "pending" },
                    { label: "Verified", count: verifiedBrokersCount, id: "verified" },
                    { label: "Rejected", count: rejectedBrokersCount, id: "rejected" }
                  ].map((tab) => (
                    <button 
                      key={tab.id} 
                      onClick={() => setBrokerTab(tab.id)}
                      className={`px-4 py-2.5 text-sm transition-all relative ${brokerTab === tab.id ? "text-orange-600 font-bold" : "text-gray-500"}`}
                    >
                      {tab.label} ({tab.count})
                      {brokerTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500"></div>}
                    </button>
                  ))}
                </div>

                {pendingBrokersCount > 0 && brokerTab !== "verified" && (
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-500 stroke-[2.5]" />
                    <span className="text-sm font-semibold text-gray-800">{pendingBrokersCount} brokers awaiting verification</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brokers.map((broker, index) => {
                    const totalRooms = broker.hostels.reduce((acc, h) => acc + (h.rooms?.length || 0), 0);
                    const isAllApproved = broker.hostels.every(h => h.approved);
                    
                    return (
                      <Card key={index} className={`rounded-xl shadow-sm border ${!isAllApproved ? 'border-orange-200' : 'border-gray-100'} bg-white group hover:shadow-md transition-all`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                <span className="text-sm font-bold text-[#0f172a]">
                                  {broker.name ? broker.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-[#0f172a] leading-tight mb-1">
                                  {broker.name || 'Unnamed Broker'}
                                </h3>
                                {isAllApproved ? (
                                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-semibold text-[11px] px-2 py-0 h-5">
                                      <CheckCircle className="h-3 w-3 mr-1 fill-white" /> Verified Partner
                                  </Badge>
                                ) : (
                                  <Badge className="bg-orange-50 text-orange-500 border-orange-100 font-semibold text-[11px] px-2 py-0 h-5">
                                      <Clock className="h-3 w-3 mr-1" /> Pending Verification
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-4 w-4 mr-3 text-gray-400 stroke-[1.5]" />
                              {broker.phone || 'No phone provided'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Building2 className="h-4 w-4 mr-3 text-gray-400 stroke-[1.5]" />
                              {broker.hostels.length} Active {broker.hostels.length === 1 ? 'Listing' : 'Listings'}
                            </div>
                            {!isAllApproved && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-3 text-gray-400 stroke-[1.5]" />
                                    Requested 2 hours ago
                                </div>
                            )}
                          </div>

                          <div className="flex gap-3 pt-6 border-t border-gray-50">
                            {!isAllApproved ? (
                              <>
                                <Button 
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm h-10 rounded-xl"
                                  onClick={() => {
                                    broker.hostels.forEach(h => {
                                      if (!h.approved) handleApprove(h.id, false);
                                    });
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" /> Verify
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 font-bold text-sm h-10 rounded-xl"
                                >
                                  <XCircle className="h-4 w-4 mr-2" /> Reject
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline" 
                                className="w-full font-bold text-sm bg-white h-10 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                                onClick={() => {
                                  if(confirm('Are you sure? This will delete ' + broker.hostels.length + ' hostels and all their rooms.')) {
                                    broker.hostels.forEach(h => handleDelete(h.id));
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Remove
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "locations" && (
              <div className="max-w-7xl">
                <AdminLocationsManager />
              </div>
            )}

            {activeTab === "carousel" && (
              <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
                <div className="pt-2">
                  <p className="text-gray-500 text-sm">Manage homepage carousel images</p>
                </div>
                <CarouselManager />
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
