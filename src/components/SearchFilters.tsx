
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { ROOM_TYPE_LABELS } from "@/types/hostel";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRoomType: string;
  setSelectedRoomType: (type: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  onClearFilters: () => void;
}

export const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  selectedRoomType,
  setSelectedRoomType,
  priceRange,
  setPriceRange,
  onClearFilters
}: SearchFiltersProps) => {
  const hasActiveFilters = searchTerm || selectedRoomType !== 'all' || priceRange !== 'all';

  return (
    <Card className="p-6 mb-8 shadow-lg border-0">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Find Your Perfect Hostel</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search hostels or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        
        <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
          <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-green-500">
            <SelectValue placeholder="Room Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Room Types</SelectItem>
            {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-green-500">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-200000">Under 200k UGX</SelectItem>
            <SelectItem value="200000-350000">200k - 350k UGX</SelectItem>
            <SelectItem value="350000-500000">350k - 500k UGX</SelectItem>
            <SelectItem value="500000+">Above 500k UGX</SelectItem>
          </SelectContent>
        </Select>
        
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </Card>
  );
};
