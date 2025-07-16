
import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchFilters } from "@/components/SearchFilters";
import HostelCard from "@/components/HostelCard";
import ImageCarousel from "@/components/ImageCarousel";
import { useHostels } from "@/hooks/useHostels";
import { Loader2 } from "lucide-react";

const Index = () => {
  console.log("Index component rendering");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const {
    data: hostels,
    isLoading,
    error
  } = useHostels();

  console.log("Hostels data:", hostels);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

  const filteredHostels = hostels?.filter(hostel => {
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
    console.error("Error loading hostels:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
              Error Loading Hostels
            </h2>
            <p className="text-gray-600">Please try refreshing the page.</p>
            <p className="text-sm text-gray-500 mt-2">
              Error details: {error.message || 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-3">
            Find Your Perfect
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text block sm:inline text-blue-800">
              {" "}Kyambogo Hostel
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto">
            Discover comfortable, affordable, and convenient student hostels near Kyambogo University.
          </p>
        </div>

        {/* Image Carousel Section */}
        <div className="mb-6 md:mb-8">
          <ImageCarousel />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <SearchFilters 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            selectedRoomType={selectedRoomType} 
            setSelectedRoomType={setSelectedRoomType} 
            priceRange={priceRange} 
            setPriceRange={setPriceRange} 
            onClearFilters={handleClearFilters} 
          />
        </div>

        {/* Results */}
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
            Available Hostels
            {filteredHostels && (
              <span className="text-sm md:text-base font-normal text-gray-600 ml-2 block sm:inline">
                ({filteredHostels.length} hostels found)
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600 text-sm">Loading hostels...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filteredHostels?.map(hostel => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        )}

        {filteredHostels?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hostels found
            </h3>
            <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
