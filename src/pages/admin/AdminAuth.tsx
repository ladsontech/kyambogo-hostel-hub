
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ShieldCheck, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded admin check — replace with real Supabase admin auth as needed
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard!",
      });
      navigate("/admin/dashboard");
    }, 1000);
  };

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
          <div className="h-2 bg-[#1B4FA8]" />
          <CardHeader className="text-center pt-8 pb-4">
            <img
              src="/images/logo.png"
              alt="Kyambogo Hostel Connect Logo"
              className="h-14 w-auto object-contain mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Portal</CardTitle>
            <p className="text-gray-500 text-sm mt-1">Restricted access for administrators only</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@kyambogohostelconnect.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#1B4FA8] hover:bg-[#163d85] text-white rounded-full font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Admin Login"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3 items-start">
              <ShieldCheck className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Security Notice:</strong> This area is restricted to authorized administrators only. Unauthorized access attempts are logged.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
