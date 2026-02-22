import { useParams } from "react-router-dom";
import { ChevronLeft, MapPin, Phone, Star, Wifi, Car, Shield, Coffee } from "lucide-react";
import { ROOM_TYPE_LABELS, AVAILABLE_AMENITIES } from "@/types/hostel";
import { generateWhatsAppLink } from "@/utils/mockData";
import { useHostel } from "@/hooks/useHostels";
import { Loader2 } from "lucide-react";
import SimpleImageCarousel from "@/components/SimpleImageCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const HostelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: hostel, isLoading, error } = useHostel(id || '');
  const callPhoneNumber = "256789572007";

  const autoplay = Autoplay({ delay: 4000, stopOnInteraction: true }) as any;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1B4FA8]" />
          <span className="text-lg text-gray-600 font-medium">Loading hostel details...</span>
        </div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-[#1B4FA8]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Hostel Not Found</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">The hostel you're looking for doesn't exist or isn't available right now.</p>
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2.5 group">
            <span className="w-9 h-9 bg-[#1B4FA8] text-white rounded-full flex items-center justify-center shadow-md group-hover:bg-[#163d85] transition-colors flex-shrink-0">
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-medium text-[#1B4FA8]">Back to search</span>
          </button>
        </div>
      </div>
    );
  }

  const hostelAmenities = AVAILABLE_AMENITIES.filter(amenity => hostel.amenities?.includes(amenity.id));
  const hasNoRooms = !hostel.roomTypes || hostel.roomTypes.length === 0;
  const allRoomsOccupied = hostel.roomTypes && hostel.roomTypes.length > 0 && hostel.roomTypes.every(room => room.availableRooms === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Sticky Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2.5 group">
            <span className="w-9 h-9 bg-[#1B4FA8] text-white rounded-full flex items-center justify-center shadow group-hover:bg-[#163d85] transition-colors flex-shrink-0">
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-medium text-[#1B4FA8]">Back to search</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 lg:py-10 max-w-6xl">

        {/* Hostel Name + Location */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">{hostel.name}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MapPin className="h-4 w-4 text-[#1B4FA8]" />
              <span>{hostel.location}</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              <span className="text-sm text-gray-500 ml-1">4.8 (124 reviews)</span>
            </div>
          </div>
        </div>

        {/* Image Carousel */}
        {hostel.images && hostel.images.length > 0 && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
            <Carousel className="w-full" plugins={[autoplay]} opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {hostel.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-60 md:h-80 lg:h-96">
                      <img src={image} alt={`${hostel.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        )}

        {/* No rooms fallback */}
        {hasNoRooms && (
          <div className="bg-orange-50 rounded-2xl p-8 text-center mb-8">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-7 w-7 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">All rooms currently occupied</h3>
            <p className="text-gray-500 text-sm mb-5">Please check back later or contact us for availability updates.</p>
            <button
              onClick={() => window.open(generateWhatsAppLink(hostel.name), '_blank')}
              className="px-6 py-2.5 bg-[#1B4FA8] hover:bg-[#163d85] text-white text-sm font-semibold rounded-full transition-colors"
            >
              Contact for Updates
            </button>
          </div>
        )}

        {/* Main Content + Sidebar */}
        {!hasNoRooms && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

            {/* Left column */}
            <div className="xl:col-span-2 space-y-5">

              {/* About */}
              <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">About this hostel</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{hostel.description}</p>
              </section>

              {/* Amenities */}
              {hostelAmenities.length > 0 && (
                <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Amenities & services</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {hostelAmenities.map(amenity => {
                      const IconComponent = amenity.icon === 'Wifi' ? Wifi : amenity.icon === 'Car' ? Car : amenity.icon === 'Shield' ? Shield : Coffee;
                      return (
                        <div key={amenity.id} className="flex items-center gap-2.5 p-3 bg-blue-50 rounded-xl">
                          <IconComponent className="h-4 w-4 text-[#1B4FA8] flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700">{amenity.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Room Availability */}
              <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Room availability</h2>
                {allRoomsOccupied ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-6 w-6 text-orange-500" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">All rooms fully booked</p>
                    <p className="text-gray-500 text-sm mb-4">Contact us to join the waiting list.</p>
                    <button
                      onClick={() => window.open(generateWhatsAppLink(hostel.name), '_blank')}
                      className="px-5 py-2 bg-[#1B4FA8] hover:bg-[#163d85] text-white text-sm font-semibold rounded-full transition-colors"
                    >
                      Join waiting list
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hostel.roomTypes.map(room => (
                      <div key={room.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{ROOM_TYPE_LABELS[room.type]}</h3>
                            <p className="text-xs text-gray-500">per {room.pricePeriod}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#1B4FA8]">{room.price.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">UGX</div>
                          </div>
                        </div>

                        {room.images && room.images.length > 0 && (
                          <div className="mb-3"><SimpleImageCarousel images={room.images} /></div>
                        )}

                        <p className="text-gray-500 text-xs leading-relaxed mb-3">{room.description}</p>

                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${room.availableRooms > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                            {room.availableRooms > 0 ? `${room.availableRooms} available` : 'Fully booked'}
                          </span>
                          <button
                            disabled={room.availableRooms === 0}
                            onClick={() => window.open(generateWhatsAppLink(hostel.name, ROOM_TYPE_LABELS[room.type]), '_blank')}
                            className="px-5 py-2 bg-[#1B4FA8] hover:bg-[#163d85] disabled:opacity-40 text-white text-xs font-semibold rounded-full transition-colors"
                          >
                            Book now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Quick Info */}
              <section className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Quick info</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Room types</span>
                    <span className="text-sm font-semibold text-gray-900">{hostel.roomTypes.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Available rooms</span>
                    <span className="text-sm font-semibold text-[#1B4FA8]">
                      {hostel.roomTypes.reduce((sum, room) => sum + room.availableRooms, 0)}
                    </span>
                  </div>
                  {hostel.roomTypes.length > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500">Price range</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {Math.min(...hostel.roomTypes.map(r => r.price)).toLocaleString()} – {Math.max(...hostel.roomTypes.map(r => r.price)).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">UGX</div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Contact */}
              <section className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Contact owner</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => window.open(generateWhatsAppLink(hostel.name), '_blank')}
                    className="w-full h-11 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp owner
                  </button>
                  <button
                    onClick={() => window.open(`tel:${callPhoneNumber}`, '_blank')}
                    className="w-full h-11 flex items-center justify-center gap-2.5 border border-gray-200 hover:border-[#1B4FA8] hover:bg-blue-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call now
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HostelDetails;