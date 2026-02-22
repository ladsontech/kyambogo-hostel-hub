
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, ArrowRight, Loader2, Wifi, Car, Shield, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { AVAILABLE_AMENITIES } from "@/types/hostel";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface HostelOnboardingProps {
  onComplete: () => void;
  existingHostel?: {
    id?: string;
    name: string;
    location: string;
    description: string;
    images: string[];
    amenities?: string[];
  };
}

const HostelOnboarding = ({ onComplete, existingHostel }: HostelOnboardingProps) => {
  const [hostelData, setHostelData] = useState({
    name: existingHostel?.name || "",
    location: existingHostel?.location || "",
    description: existingHostel?.description || "",
    images: existingHostel?.images || [],
    amenities: existingHostel?.amenities || []
  });
  
  const [step, setStep] = useState(1);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrUpdateHostel = useMutation({
    mutationFn: async (data: typeof hostelData) => {
      if (existingHostel?.id) {
        // Update existing hostel
        const { data: updatedData, error } = await supabase
          .from('hostels')
          .update({
            name: data.name,
            location: data.location,
            description: data.description,
            images: data.images,
            amenities: data.amenities
          } as any)
          .eq('id', existingHostel.id)
          .select()
          .single();

        if (error) throw error;
        return updatedData;
      } else {
        // Create new hostel
        const { data: newData, error } = await supabase
          .from('hostels')
          .insert([{
            name: data.name,
            location: data.location,
            description: data.description,
            images: data.images,
            amenities: data.amenities,
            contact_name: 'Owner',
            contact_phone: 'Unknown',
            contact_email: 'owner@example.com',
            approved: false
          } as any])
          .select()
          .single();

        if (error) throw error;
        return newData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      queryClient.invalidateQueries({ queryKey: ['all-hostels'] });
    }
  });

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
    if (!hostelData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Hostel name is required",
        variant: "destructive"
      });
      return;
    }

    if (!hostelData.location.trim()) {
      toast({
        title: "Validation Error", 
        description: "Location is required",
        variant: "destructive"
      });
      return;
    }

    if (!hostelData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required", 
        variant: "destructive"
      });
      return;
    }

    console.log('Submitting hostel data:', hostelData);
    
    createOrUpdateHostel.mutate(hostelData, {
      onSuccess: (data) => {
        console.log('Hostel saved successfully:', data);
        toast({
          title: existingHostel ? "Hostel Updated" : "Hostel Created",
          description: existingHostel 
            ? "Your hostel information has been updated successfully."
            : "Welcome! Your hostel has been created and is ready for rooms.",
        });
        onComplete();
      },
      onError: (error: any) => {
        console.error('Error saving hostel:', error);
        toast({
          title: "Failed to Save Hostel",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {existingHostel ? "Update Your Hostel" : "Setup Your Hostel"}
          </CardTitle>
          <p className="text-gray-600">
            {existingHostel 
              ? "Update your hostel information" 
              : "Let's get your hostel information setup so you can start adding rooms"
            }
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === s ? 'bg-green-600 text-white' : step > s ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`w-12 h-1 transition-colors ${step > s ? 'bg-green-200' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label>Hostel Name</Label>
                  <Input 
                    placeholder="Green Valley Hostel" 
                    value={hostelData.name}
                    onChange={(e) => setHostelData({...hostelData, name: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    placeholder="Banda, Near Kyambogo University" 
                    value={hostelData.location}
                    onChange={(e) => setHostelData({...hostelData, location: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe your hostel, its amenities, and what makes it special..."
                    rows={4}
                    value={hostelData.description}
                    onChange={(e) => setHostelData({...hostelData, description: e.target.value})}
                    required 
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (!hostelData.name || !hostelData.location || !hostelData.description) {
                        toast({ title: "Validation Error", description: "Please fill all fields", variant: "destructive" });
                        return;
                      }
                      setStep(2);
                    }}
                    className="bg-green-600 hover:bg-green-700 min-w-32"
                  >
                    Next Step <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {AVAILABLE_AMENITIES.map((amenity) => {
                      const IconComponent = getAmenityIcon(amenity.icon);
                      return (
                        <div key={amenity.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:border-green-300 transition-colors">
                          <Checkbox
                            id={amenity.id}
                            checked={hostelData.amenities.includes(amenity.id)}
                            onCheckedChange={(checked) => 
                              handleAmenityChange(amenity.id, checked as boolean)
                            }
                          />
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4 text-green-600" />
                            <Label htmlFor={amenity.id} className="text-sm cursor-pointer">
                              {amenity.name}
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={() => setStep(3)} className="bg-green-600 hover:bg-green-700 min-w-32">
                    Next Step <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <Label>Hostel Images</Label>
                  <p className="text-sm text-gray-500 mb-2">Upload up to 5 high-quality images of your hostel</p>
                  <ImageUpload
                    images={hostelData.images}
                    onImagesChange={(images) => setHostelData({...hostelData, images})}
                    maxImages={5}
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 min-w-32"
                    disabled={createOrUpdateHostel.isPending}
                  >
                    {createOrUpdateHostel.isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</>
                    ) : (
                      <>{existingHostel ? "Update" : "Submit"} <ArrowRight className="h-4 w-4 ml-2" /></>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostelOnboarding;
