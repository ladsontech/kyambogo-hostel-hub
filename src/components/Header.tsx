import { AnimatedSearchBar } from "./AnimatedSearchBar";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { MessageCircleQuestion, Menu, X } from "lucide-react";

// Account points to the rules page first, not directly to /owner
const navLinks = [
  { label: "Hostels", to: "/hostels" },
  { label: "Services", to: "/services" },
  { label: "Account", to: "/broker/rules" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) => {
    // Account nav should also highlight on /owner and /owner/dashboard
    if (to === "/broker/rules") {
      return (
        location.pathname === "/broker/rules" ||
        location.pathname === "/owner" ||
        location.pathname.startsWith("/owner/")
      );
    }
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center">

        {/* Logo — far left */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="/images/logo.png"
            alt="Kyambogo Hostel Connect Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Search bar — tight next to logo */}
        <div className="hidden lg:flex flex-shrink-0 ml-3">
          <AnimatedSearchBar />
        </div>

        {/* Nav links — with comfortable space from search bar */}
        <nav className="hidden lg:flex items-center gap-1 ml-8">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#1B4FA8] text-white shadow-sm"
                    : "text-gray-600 hover:bg-blue-50 hover:text-[#1B4FA8]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Help — far right */}
        <Link
          to="/help"
          className={`hidden lg:flex items-center gap-1.5 text-sm font-medium transition-colors flex-shrink-0 ml-auto px-3 py-1.5 rounded-full ${
            location.pathname === "/help"
              ? "text-[#1B4FA8] bg-blue-50"
              : "text-gray-600 hover:text-[#1B4FA8] hover:bg-blue-50"
          }`}
        >
          <MessageCircleQuestion className="h-4 w-4" />
          Help
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden ml-auto p-2 text-gray-600 hover:text-[#1B4FA8]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            <div className="flex justify-center pb-3 pt-1">
              <AnimatedSearchBar />
            </div>
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${
                    active
                      ? "bg-[#1B4FA8] text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-[#1B4FA8]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/help"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${
                location.pathname === "/help"
                  ? "bg-[#1B4FA8] text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-[#1B4FA8]"
              }`}
            >
              <MessageCircleQuestion className="h-4 w-4" />
              Help
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};