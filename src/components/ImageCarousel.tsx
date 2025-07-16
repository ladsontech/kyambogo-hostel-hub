
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
  const [current, setCurrent] = useState(0);

  // Auto-play functionality
  const autoplay = Autoplay({
    delay: 4000,
    stopOnInteraction: true,
  });

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 md:h-56 bg-gray-100 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 md:h-56 bg-gradient-to-r from-blue-100 to-blue-100 rounded-lg">
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
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((image, index) => (
            <CarouselItem key={image.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
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
        <CarouselPrevious className="left-2 h-8 w-8 bg-white/90 hover:bg-white border border-gray-200" />
        <CarouselNext className="right-2 h-8 w-8 bg-white/90 hover:bg-white border border-gray-200" />
      </Carousel>
      
      {/* Dots indicator */}
      <div className="flex justify-center mt-3 space-x-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              Math.floor(current * (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1) / images.length) === 
              Math.floor(index * (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1) / images.length)
                ? 'bg-blue-500' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
