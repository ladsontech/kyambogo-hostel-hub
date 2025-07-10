import { Button } from "@/components/ui/button";
import { Home, Users, Menu, X, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { generateWhatsAppLink } from "@/utils/mockData";
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNeedHelp = () => {
    const whatsappLink = generateWhatsAppLink("Kyambogo Hostel Connect", "general inquiries and support");
    window.open(whatsappLink, '_blank');
  };
  return <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
          <img src="/images/logo.png" alt="Kyambogo Hostel Connect Logo" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block">
            
            
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Home className="h-4 w-4" />
            <span>Browse Hostels</span>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300" onClick={handleNeedHelp}>
            <Users className="h-4 w-4 mr-2" />
            Need Help?
          </Button>
          <Link to="/owner">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Building2 className="h-4 w-4 mr-2" />
              Owner Portal
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              <Home className="h-4 w-4" />
              <span>Browse Hostels</span>
            </Link>
            <Button variant="outline" size="sm" className="w-full justify-start hover:bg-blue-50 hover:border-blue-300" onClick={() => {
          handleNeedHelp();
          setIsMenuOpen(false);
        }}>
              <Users className="h-4 w-4 mr-2" />
              Need Help?
            </Button>
            <Link to="/owner" onClick={() => setIsMenuOpen(false)}>
              <Button variant="default" size="sm" className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <Building2 className="h-4 w-4 mr-2" />
                Owner Portal
              </Button>
            </Link>
          </nav>
        </div>}
    </header>;
};