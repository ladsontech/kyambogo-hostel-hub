
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCarouselImages } from '@/hooks/useCarouselImages';
import { Loader2 } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";

const ImageCarousel = () => {
  const { data: images, isLoading } = useCarouselImages();
  const [api, setApi] = useState<any>();

  // Auto-play functionality
  const autoplay = Autoplay({
    delay: 4000,
    stopOnInteraction: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 md:h-56 bg-gray-100 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 md:h-56 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
        <p className="text-gray-600 text-sm">No carousel images available</p>
      </div>
    );
  }

  return (
    <div className="w-full mb-8">
      <Carousel
        setApi={setApi}
        className="w-full"
        plugins={[autoplay]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className="relative">
                <img
                  src={image.image_url}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-lg shadow-sm"
                />
                <div className="absolute inset-0 bg-black/10 rounded-lg" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 h-8 w-8" />
        <CarouselNext className="right-2 h-8 w-8" />
      </Carousel>
      
      {/* Dots indicator */}
      <div className="flex justify-center mt-3 space-x-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
