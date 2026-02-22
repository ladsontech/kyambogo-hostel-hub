
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOwnerProfile } from "@/hooks/useOwnerData";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const BrokerAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithGoogle, user, loading } = useAuth();
  const createOwnerProfile = useCreateOwnerProfile();

  useEffect(() => {
    if (user && !loading) {
      navigate("/owner/dashboard");
    }
  }, [user, loading, navigate]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4FA8] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2.5 mb-6 group">
          <span className="w-9 h-9 bg-[#1B4FA8] text-white rounded-full flex items-center justify-center shadow-md group-hover:bg-[#163d85] transition-colors">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-medium text-[#1B4FA8] group-hover:text-[#163d85] transition-colors">Back to home</span>
        </button>

        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Blue top strip */}
          <div className="h-2 bg-[#1B4FA8]" />
          <CardHeader className="text-center pt-8 pb-4">
            <img
              src="/images/logo.png"
              alt="Kyambogo Hostel Connect Logo"
              className="h-14 w-auto object-contain mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold text-gray-800">Hostel Owner Portal</CardTitle>
            <p className="text-gray-500 text-sm mt-1">Manage your hostel listings with ease</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="space-y-5">
              <p className="text-center text-sm text-gray-600 leading-relaxed">
                Sign in with your Google account to access your broker dashboard.
              </p>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-full h-12 px-6 font-semibold text-gray-700 bg-white hover:border-[#1B4FA8] hover:bg-blue-50 transition-all disabled:opacity-60"
              >
                <GoogleIcon />
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </button>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrokerAuth;
