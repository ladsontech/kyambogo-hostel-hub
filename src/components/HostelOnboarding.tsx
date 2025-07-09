
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateOrUpdateHostel } from "@/hooks/useOwnerData";
import ImageUpload from "@/components/ImageUpload";

interface HostelOnboardingProps {
  onComplete: () => void;
  existingHostel?: {
    name: string;
    location: string;
    description: string;
    images: string[];
  };
}

const HostelOnboarding = ({ onComplete, existingHostel }: HostelOnboardingProps) => {
  const [hostelData, setHostelData] = useState({
    name: existingHostel?.name || "",
    location: existingHostel?.location || "",
    description: existingHostel?.description || "",
    images: existingHostel?.images || []
  });
  
  const { toast } = useToast();
  const createOrUpdateHostel = useCreateOrUpdateHostel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createOrUpdateHostel.mutate(hostelData, {
      onSuccess: () => {
        toast({
          title: existingHostel ? "Hostel Updated" : "Hostel Created",
          description: existingHostel 
            ? "Your hostel information has been updated successfully."
            : "Welcome! Your hostel has been created and is ready for rooms.",
        });
        onComplete();
      },
      onError: (error: any) => {
        toast({
          title: "Failed to Save Hostel",
          description: error.message,
          variant: "destructive"
        });
      }
    });
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

            <div className="space-y-2">
              <Label>Hostel Images</Label>
              <ImageUpload
                images={hostelData.images}
                onImagesChange={(images) => setHostelData({...hostelData, images})}
                maxImages={5}
              />
            </div>

            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 min-w-32"
                disabled={createOrUpdateHostel.isPending}
              >
                {createOrUpdateHostel.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    {existingHostel ? "Update" : "Continue"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostelOnboarding;
