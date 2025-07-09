import { Button } from "@/components/ui/button";
import { Home, Users, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
          <img src="/images/logo.png" alt="Kyambogo Hostel Connect Logo" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Kyambogo Hostel Connect</h1>
            <p className="text-xs text-gray-600 hidden md:block">Find Your Perfect Stay</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-sm font-bold text-gray-800">KYAMBOGO</h1>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
            <Home className="h-4 w-4" />
            <span>Browse Hostels</span>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-600 hover:text-green-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        
        {/* Desktop Help Button */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
            <Users className="h-4 w-4 mr-2" />
            Need Help?
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              <Home className="h-4 w-4" />
              <span>Browse Hostels</span>
            </Link>
            <Button variant="outline" size="sm" className="w-full justify-start hover:bg-green-50 hover:border-green-300">
              <Users className="h-4 w-4 mr-2" />
              Need Help?
            </Button>
          </nav>
        </div>}
    </header>;
};