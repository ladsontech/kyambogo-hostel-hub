
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { ROOM_TYPE_LABELS } from "@/types/hostel";
import { useCreateRoom } from "@/hooks/useAdminData";
import { Database } from "@/integrations/supabase/types";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";

type RoomType = Database['public']['Enums']['room_type'];

interface AddRoomDialogProps {
  hostelId: string;
  hostelName: string;
}

export const AddRoomDialog = ({ hostelId, hostelName }: AddRoomDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: 'single-self-contained' as RoomType,
    price: '',
    pricePeriod: 'semester' as "month" | "semester",
    description: '',
    totalRooms: '1',
    availableRooms: '1',
    images: [] as string[]
  });
  
  const createRoom = useCreateRoom();

  const resetForm = () => {
    setFormData({
      type: 'single-self-contained' as RoomType,
      price: '',
      pricePeriod: 'semester' as "month" | "semester",
      description: '',
      totalRooms: '1',
      availableRooms: '1',
      images: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Hostel ID:', hostelId);
    
    // Validate form data
    if (!formData.price || !formData.description || !formData.totalRooms || !formData.availableRooms) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const priceNum = parseInt(formData.price);
    const totalRoomsNum = parseInt(formData.totalRooms);
    const availableRoomsNum = parseInt(formData.availableRooms);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(totalRoomsNum) || totalRoomsNum <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid number of total rooms.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(availableRoomsNum) || availableRoomsNum < 0 || availableRoomsNum > totalRoomsNum) {
      toast({
        title: "Validation Error",
        description: "Available rooms must be between 0 and total rooms.",
        variant: "destructive"
      });
      return;
    }

    const roomData = {
      hostel_id: hostelId,
      type: formData.type,
      price: priceNum,
      price_period: formData.pricePeriod,
      description: formData.description,
      total_rooms: totalRoomsNum,
      available_rooms: availableRoomsNum,
      images: formData.images
    };

    console.log('Submitting room data:', roomData);
    
    createRoom.mutate(roomData, {
      onSuccess: (data) => {
        console.log('Room created successfully:', data);
        setOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Room has been added successfully.",
        });
      },
      onError: (error) => {
        console.error('Error creating room:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create room. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Plus className="h-4 w-4 mr-1" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Room to {hostelName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="room-type">Room Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: RoomType) => setFormData({...formData, type: value})}
              >
                <SelectTrigger id="room-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-price">Price (UGX) *</Label>
              <Input 
                id="room-price"
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required 
                min="1"
                placeholder="Enter price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pricing Period *</Label>
            <RadioGroup 
              value={formData.pricePeriod} 
              onValueChange={(value: "month" | "semester") => setFormData({...formData, pricePeriod: value})}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="semester" id="add-semester" />
                <Label htmlFor="add-semester">Per Semester</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="add-month" />
                <Label htmlFor="add-month">Per Month</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="total-rooms">Total Rooms *</Label>
              <Input 
                id="total-rooms"
                type="number" 
                min="1" 
                value={formData.totalRooms}
                onChange={(e) => setFormData({...formData, totalRooms: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available-rooms">Currently Available *</Label>
              <Input 
                id="available-rooms"
                type="number" 
                min="0" 
                max={formData.totalRooms}
                value={formData.availableRooms}
                onChange={(e) => setFormData({...formData, availableRooms: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-description">Room Description *</Label>
            <Textarea 
              id="room-description"
              placeholder="Describe this room type, its features, amenities, and what makes it special..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Room Images</Label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => {
                console.log('Images updated:', images);
                setFormData({...formData, images});
              }}
              maxImages={3}
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={createRoom.isPending}
            >
              {createRoom.isPending ? "Adding Room..." : "Add Room"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
