
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateHostel, useCreateRoom, useUpdateRoom, useDeleteRoom } from "@/hooks/useAdminData";
import { Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import SimpleImageCarousel from "./SimpleImageCarousel";
import { EditRoomDialog } from "./EditRoomDialog";

const hostelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_phone: z.string().min(1, "Contact phone is required"),
  contact_email: z.string().email("Invalid email address"),
  amenities: z.array(z.string()).default([]),
});

type HostelFormData = z.infer<typeof hostelSchema>;

interface EditHostelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostel: any;
}

const EditHostelDialog = ({ open, onOpenChange, hostel }: EditHostelDialogProps) => {
  const updateHostel = useUpdateHostel();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();

  const form = useForm<HostelFormData>({
    resolver: zodResolver(hostelSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      amenities: [],
    },
  });

  // Reset form values when hostel data changes or dialog opens
  useEffect(() => {
    if (hostel && open) {
      form.reset({
        name: hostel.name || "",
        location: hostel.location || "",
        description: hostel.description || "",
        contact_name: hostel.contact_name || "",
        contact_phone: hostel.contact_phone || "",
        contact_email: hostel.contact_email || "",
        amenities: hostel.amenities || [],
      });
    }
  }, [hostel, open, form]);

  const onSubmit = async (data: HostelFormData) => {
    try {
      await updateHostel.mutateAsync({
        id: hostel.id as string,
        name: data.name,
        location: data.location,
        description: data.description,
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        amenities: data.amenities,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating hostel:", error);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteRoom.mutate(roomId);
    }
  };

  if (!hostel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hostel: {hostel.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Hostel Details</TabsTrigger>
            <TabsTrigger value="rooms">Rooms ({hostel.rooms?.length || 0})</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateHostel.isPending}>
                    {updateHostel.isPending ? "Updating..." : "Update Hostel"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Room Management</h3>
            </div>

            <div className="grid gap-4">
              {hostel.rooms?.map((room: any) => (
                <Card key={room.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base capitalize">
                          {room.type.replace('-', ' ')} Room
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            {room.price.toLocaleString()} UGX / {room.price_period}
                          </Badge>
                          <Badge variant="outline">
                            {room.available_rooms}/{room.total_rooms} available
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <EditRoomDialog room={room} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {room.description && (
                      <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                    )}
                    {room.images && room.images.length > 0 && (
                      <div className="mt-3">
                        <SimpleImageCarousel images={room.images} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {(!hostel.rooms || hostel.rooms.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No rooms added yet.</p>
                  <p className="text-sm">Click "Add Room" to get started.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hostel Images</h3>
              {hostel.images && hostel.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hostel.images.map((image: string, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Hostel image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No images uploaded yet.</p>
                  <p className="text-sm">Images can be managed through the main hostel form.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditHostelDialog;
