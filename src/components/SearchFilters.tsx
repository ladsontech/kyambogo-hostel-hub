import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { ROOM_TYPE_LABELS } from "@/types/hostel";

export const UNIVERSITIES = [
  { id: 'all', label: 'All Universities' },
  { id: 'kyambogo', label: 'Kyambogo University' },
  { id: 'makerere', label: 'Makerere University' },
  { id: 'kiu', label: 'K.I.U' },
  { id: 'mbarara', label: 'Mbarara University' },
  { id: 'busitema', label: 'Busitema University' },
];

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRoomType: string;
  setSelectedRoomType: (type: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  selectedUniversity: string;
  setSelectedUniversity: (uni: string) => void;
  onClearFilters: () => void;
}

export const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  selectedRoomType,
  setSelectedRoomType,
  priceRange,
  setPriceRange,
  selectedUniversity,
  setSelectedUniversity,
  onClearFilters
}: SearchFiltersProps) => {
  const hasActiveFilters = searchTerm || selectedRoomType !== 'all' || priceRange !== 'all' || selectedUniversity !== 'all';
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card className="p-4 md:p-5 mb-6 shadow-sm border-0 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#1B4FA8]" />
          <h3 className="text-base font-semibold text-gray-800">Find Your Perfect Hostel</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex h-8 text-xs items-center justify-center px-3 border-gray-200"
        >
          {showFilters ? 'Hide' : 'Filters'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search hostels or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-gray-200 focus:border-[#1B4FA8] focus:ring-[#1B4FA8] h-9 text-sm"
          />
        </div>

        
        {/* Hidden on mobile unless toggled */}
        <div className={`${showFilters ? 'grid' : 'hidden'} md:grid grid-cols-1 md:grid-cols-3 gap-3 md:col-span-3`}>
          {/* University */}
          <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
            <SelectTrigger className="border-gray-200 focus:border-[#1B4FA8] focus:ring-[#1B4FA8] h-9 text-sm w-full">
              <SelectValue placeholder="University" />
            </SelectTrigger>
            <SelectContent>
              {UNIVERSITIES.map(uni => (
                <SelectItem key={uni.id} value={uni.id}>{uni.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Room Type */}
          <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
            <SelectTrigger className="border-gray-200 focus:border-[#1B4FA8] focus:ring-[#1B4FA8] h-9 text-sm w-full">
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Room Types</SelectItem>
              {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Price */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="border-gray-200 focus:border-[#1B4FA8] focus:ring-[#1B4FA8] h-9 text-sm w-full">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-200000">Under 200k UGX</SelectItem>
              <SelectItem value="200000-350000">200k – 350k UGX</SelectItem>
              <SelectItem value="350000-500000">350k – 500k UGX</SelectItem>
              <SelectItem value="500000+">Above 500k UGX</SelectItem>
            </SelectContent>
          </Select>
          
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              size="sm"
              className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 h-9 text-sm w-full md:col-start-4 absolute md:relative top-[-44px] md:top-0 right-0 md:w-auto mt-[-44px] md:mt-0"
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
