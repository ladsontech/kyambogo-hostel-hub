
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Edit } from "lucide-react";
import { ROOM_TYPE_LABELS } from "@/types/hostel";
import { useUpdateRoom } from "@/hooks/useOwnerData";
import { Database } from "@/integrations/supabase/types";
import ImageUpload from "@/components/ImageUpload";

type RoomType = Database['public']['Enums']['room_type'];

interface Room {
  id: string;
  type: RoomType;
  price: number;
  price_period: string;
  description: string | null;
  images: string[] | null;
  total_rooms: number;
  available_rooms: number;
}

interface EditRoomDialogProps {
  room: Room;
}

export const EditRoomDialog = ({ room }: EditRoomDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: room.type,
    price: room.price.toString(),
    pricePeriod: room.price_period as "month" | "semester",
    description: room.description || "",
    totalRooms: room.total_rooms.toString(),
    availableRooms: room.available_rooms.toString(),
    images: room.images || []
  });
  
  const updateRoom = useUpdateRoom();

  useEffect(() => {
    setFormData({
      type: room.type,
      price: room.price.toString(),
      pricePeriod: room.price_period as "month" | "semester",
      description: room.description || "",
      totalRooms: room.total_rooms.toString(),
      availableRooms: room.available_rooms.toString(),
      images: room.images || []
    });
  }, [room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateRoom.mutate({
      roomId: room.id,
      roomData: {
        type: formData.type,
        price: parseInt(formData.price),
        price_period: formData.pricePeriod,
        description: formData.description,
        total_rooms: parseInt(formData.totalRooms),
        available_rooms: parseInt(formData.availableRooms),
        images: formData.images
      }
    }, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: RoomType) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
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
              <Label>Price (UGX)</Label>
              <Input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pricing Period</Label>
            <RadioGroup 
              value={formData.pricePeriod} 
              onValueChange={(value: "month" | "semester") => setFormData({...formData, pricePeriod: value})}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="semester" id="edit-semester" />
                <Label htmlFor="edit-semester">Per Semester</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="edit-month" />
                <Label htmlFor="edit-month">Per Month</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Total Rooms</Label>
              <Input 
                type="number" 
                min="1" 
                value={formData.totalRooms}
                onChange={(e) => setFormData({...formData, totalRooms: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Currently Available</Label>
              <Input 
                type="number" 
                min="0" 
                value={formData.availableRooms}
                onChange={(e) => setFormData({...formData, availableRooms: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Room Description</Label>
            <Textarea 
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
              onImagesChange={(images) => setFormData({...formData, images})}
              maxImages={3}
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={updateRoom.isPending}
            >
              {updateRoom.isPending ? "Updating Room..." : "Update Room"}
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
