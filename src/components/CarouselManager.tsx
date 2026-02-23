
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useCarouselImages, useUploadCarouselImage, useDeleteCarouselImage } from '@/hooks/useCarouselImages';

const CarouselManager = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayOrder, setDisplayOrder] = useState(1);
  
  const { data: images, isLoading } = useCarouselImages();
  const uploadImage = useUploadCarouselImage();
  const deleteImage = useDeleteCarouselImage();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    uploadImage.mutate({ file, displayOrder });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteImage.mutate(imageId);
    }
  };

  return (
    <Card className="border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a]">Carousel Images Management</h3>
        </div>

        <div className="space-y-4">
          <Label htmlFor="displayOrder" className="text-sm font-semibold text-gray-700">Display Order</Label>
          <div className="flex gap-4">
            <Input
              id="displayOrder"
              type="number"
              min="1"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
              className="h-12 border-gray-200 rounded-xl max-w-[800px] flex-1"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadImage.isPending}
              className="h-12 bg-[#1B4FA8] hover:bg-blue-800 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-900/20"
            >
              <Upload className="h-5 w-5 mr-3" />
              Upload Image
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div>
          <h4 className="text-base font-bold text-[#0f172a] mb-5">Current Carousel Images</h4>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-[#1B4FA8]" />
            </div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="relative group overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <img
                    src={image.image_url}
                    alt={`Carousel image ${image.display_order}`}
                    className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-xl h-10 w-10 p-0"
                      onClick={() => handleDelete(image.id)}
                      disabled={deleteImage.isPending}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/20">
                    Order: {image.display_order}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 font-medium">No carousel images uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};


export default CarouselManager;
