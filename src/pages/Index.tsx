import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchFilters } from "@/components/SearchFilters";
import HostelCard from "@/components/HostelCard";
import ImageCarousel from "@/components/ImageCarousel";
import { useHostels } from "@/hooks/useHostels";
import { Loader2, MapPin, Users, Shield, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) || hostel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoomType = selectedRoomType === 'all' || hostel.roomTypes.some(room => room.type === selectedRoomType);
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
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
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
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        {/* Enhanced Hero Section */}
        <div className="relative text-center mb-8 md:mb-12 py-8 md:py-16">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-blue-500/10 to-blue-600/5 rounded-3xl md:rounded-[3rem]"></div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 w-16 h-16 md:w-24 md:h-24 bg-blue-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-20 h-20 md:w-32 md:h-32 bg-blue-300/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            {/* Main heading with enhanced styling */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4">
                <span className="text-gray-800 block mb-2">Find Your Perfect</span>
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent inline-block">
                  Kyambogo Hostel
                </span>
              </h1>
              
              {/* Decorative underline */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </div>
            </div>

            {/* Enhanced description */}
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
              Discover comfortable, affordable, and convenient student hostels near Kyambogo University. 
              <span className="hidden md:inline"> Your perfect home away from home awaits.</span>
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="flex flex-col items-center p-3 md:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:bg-white/80 transition-all duration-300">
                <MapPin className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mb-2" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Prime Locations</span>
              </div>
              
              <div className="flex flex-col items-center p-3 md:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:bg-white/80 transition-all duration-300">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mb-2" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Secure & Safe</span>
              </div>
              
              <div className="flex flex-col items-center p-3 md:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:bg-white/80 transition-all duration-300">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mb-2" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Community</span>
              </div>
              
              <div className="flex flex-col items-center p-3 md:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:bg-white/80 transition-all duration-300">
                <Star className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mb-2" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Top Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Carousel Section */}
        <div className="mb-6 md:mb-8">
          <ImageCarousel />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <SearchFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedRoomType={selectedRoomType} setSelectedRoomType={setSelectedRoomType} priceRange={priceRange} setPriceRange={setPriceRange} onClearFilters={handleClearFilters} />
        </div>

        {/* Results */}
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
            Available Hostels
            {filteredHostels && <span className="text-sm md:text-base font-normal text-gray-600 ml-2 block sm:inline">
                ({filteredHostels.length} hostels found)
              </span>}
          </h2>
        </div>

        {isLoading ? <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 text-sm">Loading hostels...</span>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filteredHostels?.map(hostel => <HostelCard key={hostel.id} hostel={hostel} />)}
          </div>}

        {filteredHostels?.length === 0 && !isLoading && <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hostels found
            </h3>
            <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
          </div>}

        {/* Featured App Section - Flamia */}
        <div className="mt-12 mb-8 md:mb-12">
          <div className="relative overflow-hidden bg-orange-500 rounded-2xl md:rounded-3xl p-6 md:p-8">
            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                {/* Content Side */}
                <div className="text-center lg:text-left">
                  {/* Logo and Badge */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <Avatar className="h-12 w-12 md:h-16 md:w-16 bg-white shadow-lg">
                      <AvatarImage src="/images/flamia_logo.png" alt="Flamia Logo" className="object-cover" />
                    </Avatar>
                    <div>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        Flamia
                      </h2>
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
                    Your Campus Essential App
                  </h3>
                  
                  {/* Description */}
                  <p className="text-orange-100 text-base md:text-lg mb-6 leading-relaxed">The #1 app for gas refilling, gas full kits, smart phones and laptop services at Kyambogo University. Fast, reliable, and trusted by thousands of students.</p>

                  {/* CTA Button */}
                  <Button asChild className="bg-white text-orange-700 hover:bg-orange-50 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <a href="https://flamia.store" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      Visit Flamia Store
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </Button>
                </div>

                {/* Screenshots Side */}
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Gas Screenshot */}
                    <div className="relative group cursor-pointer" onClick={() => window.open('https://flamia.store', '_blank')}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl z-10"></div>
                      <img src="/images/gas_screenshot.png" alt="Gas Refilling Service" className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-xl shadow-2xl transition-transform duration-300" />
                      <div className="absolute bottom-2 left-2 z-20">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          Gas Services
                        </span>
                      </div>
                    </div>

                    {/* Phones Screenshot */}
                    <div className="relative group cursor-pointer" onClick={() => window.open('https://flamia.store/gadgets', '_blank')}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl z-10"></div>
                      <img src="/images/phones_screenshot.png" alt="Phone and Laptop Services" className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-xl shadow-2xl transition-transform duration-300" />
                      <div className="absolute bottom-2 left-2 z-20">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          Tech Services
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default Index;