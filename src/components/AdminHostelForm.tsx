
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Plus, Loader2, Wifi, Car, Shield, Coffee } from "lucide-react";
import { useCreateHostel } from "@/hooks/useAdminData";
import ImageUpload from "@/components/ImageUpload";
import { AVAILABLE_AMENITIES } from "@/types/hostel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UNIVERSITIES } from "./SearchFilters";
import { MapPicker } from "@/components/MapPicker";


interface AdminHostelFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AdminHostelForm = ({ onSuccess, onCancel }: AdminHostelFormProps) => {
  const [hostelData, setHostelData] = useState({
    name: "",
    location: "",
    description: "",
    contact_phone: "",
    university: "kyambogo",
    images: [] as string[],
    amenities: [] as string[],
    latitude: null as number | null,
    longitude: null as number | null,
  });

  
  const createHostel = useCreateHostel();

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setHostelData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenityId]
        : prev.amenities.filter(id => id !== amenityId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!hostelData.name.trim() || !hostelData.location.trim() || !hostelData.description.trim() ||
        !hostelData.contact_phone.trim()) {
      return;
    }

    createHostel.mutate(hostelData, {
      onSuccess: () => {
        setHostelData({
          name: "",
          location: "",
          description: "",
          contact_phone: "",
          university: "kyambogo",
          images: [],
          amenities: [],
          latitude: null,
          longitude: null,
        });

        onSuccess?.();
      }
    });
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wifi': return Wifi;
      case 'Car': return Car;
      case 'Shield': return Shield;
      case 'Coffee': return Coffee;
      default: return Wifi;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Add New Hostel
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Hostel Name *</Label>
              <Input 
                placeholder="Green Valley Hostel" 
                value={hostelData.name}
                onChange={(e) => setHostelData({...hostelData, name: e.target.value})}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <Input 
                placeholder="Banda, Near Kyambogo University" 
                value={hostelData.location}
                onChange={(e) => setHostelData({...hostelData, location: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea 
              placeholder="Describe the hostel, its amenities, and what makes it special..."
              rows={4}
              value={hostelData.description}
              onChange={(e) => setHostelData({...hostelData, description: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Contact Phone *</Label>
              <Input 
                placeholder="+256 700 000 000" 
                value={hostelData.contact_phone}
                onChange={(e) => setHostelData({...hostelData, contact_phone: e.target.value})}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>University *</Label>
              <Select 
                value={hostelData.university || "kyambogo"} 
                onValueChange={(value) => setHostelData({...hostelData, university: value})}
              >
                <SelectTrigger className="w-full border-gray-200">
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                  {UNIVERSITIES.filter(u => u.id !== 'all').map(uni => (
                    <SelectItem key={uni.id} value={uni.id}>{uni.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-4">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const IconComponent = getAmenityIcon(amenity.icon);
                return (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.id}
                      checked={hostelData.amenities.includes(amenity.id)}
                      onCheckedChange={(checked) => 
                        handleAmenityChange(amenity.id, checked as boolean)
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4 text-green-600" />
                      <Label htmlFor={amenity.id} className="text-sm">
                        {amenity.name}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pin Location on Map</Label>
            <MapPicker
              value={hostelData.latitude && hostelData.longitude ? { lat: hostelData.latitude, lng: hostelData.longitude } : null}
              onChange={(loc) => setHostelData({ ...hostelData, latitude: loc.lat, longitude: loc.lng })}
            />
          </div>

          <div className="space-y-2">
            <Label>Hostel Images</Label>
            <ImageUpload
              images={hostelData.images}
              onImagesChange={(images) => setHostelData({...hostelData, images})}
              maxImages={10}
            />
          </div>


          <div className="flex justify-end gap-4 pt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 min-w-32"
              disabled={createHostel.isPending}
            >
              {createHostel.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Hostel
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminHostelForm;
