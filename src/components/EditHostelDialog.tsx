
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
import ImageUpload from "./ImageUpload";
import { MapPicker } from "./MapPicker";


const hostelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  contact_phone: z.string().min(1, "Contact phone is required"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  latitude: z.number().nullable().default(null),
  longitude: z.number().nullable().default(null),
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
      contact_phone: "",
      amenities: [],
      images: [],
      latitude: null,
      longitude: null,
    },
  });

  useEffect(() => {
    if (hostel && open) {
      form.reset({
        name: hostel.name || "",
        location: hostel.location || "",
        description: hostel.description || "",
        contact_phone: hostel.contact_phone || "",
        amenities: hostel.amenities || [],
        images: hostel.images || [],
        latitude: hostel.latitude ?? null,
        longitude: hostel.longitude ?? null,
      });
    }
  }, [hostel, open, form]);

  const onSubmit = async (data: HostelFormData) => {
    try {
      await updateHostel.mutateAsync({
        id: hostel.id,
        name: data.name,
        location: data.location,
        description: data.description,
        contact_phone: data.contact_phone,
        amenities: data.amenities,
        images: data.images,
        latitude: data.latitude,
        longitude: data.longitude,
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

  const handleImagesChange = (newImages: string[]) => {
    form.setValue('images', newImages);
  };

  if (!hostel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-6">
          <DialogTitle className="text-lg sm:text-xl">Edit Hostel: {hostel.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="details" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Details
            </TabsTrigger>
            <TabsTrigger value="rooms" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Rooms ({hostel.rooms?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-sm sm:text-base" />
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
                        <FormLabel className="text-sm sm:text-base">Location</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-sm sm:text-base" />
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
                      <FormLabel className="text-sm sm:text-base">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} className="text-sm sm:text-base" />
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
                      <FormLabel className="text-sm sm:text-base">Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} className="text-sm sm:text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="latitude"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Pin Location on Map</FormLabel>
                      <FormControl>
                        <MapPicker
                          value={form.watch('latitude') && form.watch('longitude')
                            ? { lat: form.watch('latitude') as number, lng: form.watch('longitude') as number }
                            : null}
                          onChange={(loc) => {
                            form.setValue('latitude', loc.lat);
                            form.setValue('longitude', loc.lng);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Hostel Images</FormLabel>
                      <FormControl>
                        <ImageUpload
                          images={field.value}
                          onImagesChange={handleImagesChange}
                          maxImages={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateHostel.isPending}
                    className="w-full sm:w-auto"
                  >
                    {updateHostel.isPending ? "Updating..." : "Update Hostel"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base sm:text-lg font-semibold">Room Management</h3>
            </div>

            <div className="grid gap-3 sm:gap-4">
              {hostel.rooms?.map((room: any) => (
                <Card key={room.id} className="border">
                  <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm sm:text-base capitalize mb-2">
                          {room.type.replace('-', ' ')} Room
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {room.price.toLocaleString()} UGX / {room.price_period}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {room.available_rooms}/{room.total_rooms} available
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <EditRoomDialog room={room} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    {room.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">{room.description}</p>
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
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p className="text-sm sm:text-base">No rooms added yet.</p>
                  <p className="text-xs sm:text-sm">Click "Add Room" to get started.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Hostel Images</h3>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          images={field.value}
                          onImagesChange={handleImagesChange}
                          maxImages={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
              
              {form.watch('images')?.length === 0 && (
                <div className="text-center py-6 sm:py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm sm:text-base">No images uploaded yet.</p>
                  <p className="text-xs sm:text-sm">Use the upload button above to add images.</p>
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
