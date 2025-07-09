
import { Button } from "@/components/ui/button";
import { Home, Building2, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Kyambogo Hostel Connect</h1>
            <p className="text-xs text-gray-600">Find Your Perfect Stay</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
            <Home className="h-4 w-4" />
            <span>Browse Hostels</span>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="hidden sm:flex hover:bg-green-50 hover:border-green-300"
          >
            <Users className="h-4 w-4 mr-2" />
            Need Help?
          </Button>
        </div>
      </div>
    </header>
  );
};
