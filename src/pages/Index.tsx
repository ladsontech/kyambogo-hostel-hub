
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { SearchFilters } from "@/components/SearchFilters";
import { HostelCard } from "@/components/HostelCard";
import { mockHostels } from "@/utils/mockData";
import { Building2, MapPin, Star } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const filteredHostels = useMemo(() => {
    return mockHostels.filter(hostel => {
      // Search term filter
      const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hostel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hostel.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Room type filter
      const matchesRoomType = selectedRoomType === 'all' || 
                             hostel.roomTypes.some(rt => rt.type === selectedRoomType);
      
      // Price range filter
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const prices = hostel.roomTypes.map(rt => rt.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        switch (priceRange) {
          case '0-200000':
            matchesPrice = minPrice < 200000;
            break;
          case '200000-350000':
            matchesPrice = (minPrice >= 200000 && minPrice <= 350000) || 
                          (maxPrice >= 200000 && maxPrice <= 350000);
            break;
          case '350000-500000':
            matchesPrice = (minPrice >= 350000 && minPrice <= 500000) || 
                          (maxPrice >= 350000 && maxPrice <= 500000);
            break;
          case '500000+':
            matchesPrice = maxPrice > 500000;
            break;
        }
      }
      
      return matchesSearch && matchesRoomType && matchesPrice && hostel.approved;
    });
  }, [searchTerm, selectedRoomType, priceRange]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoomType("all");
    setPriceRange("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-yellow-300">Student Hostel</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Discover comfortable, affordable accommodation near Kyambogo University
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                <span>{mockHostels.length}+ Verified Hostels</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Prime Locations</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Trusted Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onClearFilters={clearFilters}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Available Hostels
            </h2>
            <p className="text-gray-600">
              {filteredHostels.length} {filteredHostels.length === 1 ? 'hostel' : 'hostels'} found
            </p>
          </div>
        </div>

        {/* Hostels Grid */}
        {filteredHostels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHostels.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No hostels found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or clear the filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Kyambogo Hostel Connect</span>
              </div>
              <p className="text-gray-400">
                Connecting students with quality accommodation near Kyambogo University.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Browse Hostels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">WhatsApp: +256700000000</p>
              <p className="text-gray-400">Email: info@kyambogohostelconnect.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kyambogo Hostel Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
