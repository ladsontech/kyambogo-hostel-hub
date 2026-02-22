import { Header } from "@/components/Header";
import { ExternalLink, Flame, Wifi, ShieldCheck, Droplets, BedDouble } from "lucide-react";

const hostelServices = [
  {
    title: "Security",
    description: "24/7 security personnel, CCTV surveillance, and controlled access to keep you safe at all times.",
    image: "/images/services/security.jpg",
    accent: "#1B4FA8",
  },
  {
    title: "Clean water supply",
    description: "Reliable 24-hour piped clean water in bathrooms and kitchens across all hostel facilities.",
    image: "/images/services/water.jpg",
    accent: "#0891b2",
  },
  {
    title: "High-speed Wi-Fi",
    description: "Fast, reliable internet coverage throughout the hostel — ideal for study, research, and keeping in touch.",
    image: "/images/services/wifi.jpg",
    accent: "#7c3aed",
  },
  {
    title: "Furnished rooms",
    description: "Move-in ready rooms with beds, study desks, wardrobes, and proper lighting — designed for student life.",
    image: "/images/services/room.jpeg",
    accent: "#059669",
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero with image */}
      <section className="relative h-[240px] md:h-[300px] overflow-hidden bg-[#1B4FA8]">
        <img
          src="/images/service.jpg"
          alt="Student services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/55" />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md">What our hostels offer</h1>
          <p className="text-white/90 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Discover the full range of services available across our listed hostels.
          </p>
        </div>
      </section>

      {/* Flamia Gas Services — top */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-4">
        <div className="bg-white rounded-2xl p-7 md:p-9 flex flex-col md:flex-row items-center gap-7 shadow-sm border border-gray-100">
          {/* Logo block */}
          <div className="flex-shrink-0 w-18 h-18 w-[72px] h-[72px] bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm p-2 overflow-hidden">
            <img src="/images/flamia_logo.png" alt="Flamia Gas" className="w-full h-full object-contain" />
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <span className="text-2xl font-extrabold text-gray-900">Flamia</span>
              <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider">
                Gas partner
              </span>
            </div>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
              Flamia delivers affordable LPG cooking gas cylinders directly to your hostel — no need to leave your room. Fast, safe, and trusted across Kampala.
            </p>
          </div>

          {/* CTA */}
          <a
            href="https://flamia.ug"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-md text-sm whitespace-nowrap"
          >
            Visit Flamia
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* 4 Core hostel services */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8 pb-16">
        <h2 className="text-lg font-semibold text-gray-700 mb-6 font-medium">Core hostel services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hostelServices.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-1.5">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-normal">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
