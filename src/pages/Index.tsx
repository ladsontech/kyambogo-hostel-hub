
import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchFilters } from "@/components/SearchFilters";
import { HostelCard } from "@/components/HostelCard";
import { useHostels } from "@/hooks/useHostels";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const { data: hostels, isLoading, error } = useHostels();

  const filteredHostels = hostels?.filter((hostel) => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoomType = selectedRoomType === 'all' || 
                           hostel.roomTypes.some(room => room.type === selectedRoomType);
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      if (priceRange === '0-200000') {
        matchesPrice = hostel.roomTypes.some(room => room.price <= 200000);
      } else if (priceRange === '200000-350000') {
        matchesPrice = hostel.roomTypes.some(room => room.price >= 200000 && room.price <= 350000);
      } else if (priceRange === '350000-500000') {
        matchesPrice = hostel.roomTypes.some(room => room.price >= 350000 && room.price <= 500000);
      } else if (priceRange === '500000+') {
        matchesPrice = hostel.roomTypes.some(room => room.price >= 500000);
      }
    }

    return matchesSearch && matchesRoomType && matchesPrice;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRoomType("all");
    setPriceRange("all");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Hostels</h2>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/public/images/logo.png" 
              alt="Kyambogo Hostel Connect" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Find Your Perfect
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Student Hostel
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover comfortable, affordable, and convenient accommodation near Kyambogo University
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onClearFilters={handleClearFilters}
        />

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Available Hostels
            {filteredHostels && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({filteredHostels.length} found)
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading hostels...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHostels?.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        )}

        {filteredHostels?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hostels found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
