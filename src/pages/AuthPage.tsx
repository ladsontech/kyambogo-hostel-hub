import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(-1);
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Auth error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: mode === "signin" ? "Signed in" : "Check your email",
        description: mode === "signin" ? "Welcome back!" : "Confirm your email to finish signup.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-md">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-1">
            {mode === "signin" ? "Sign in" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Required to post on UniMarket.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email}
                     onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password}
                     onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Sign up"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center">
            {mode === "signin" ? (
              <button className="text-blue-600 hover:underline" onClick={() => setMode("signup")}>
                Don't have an account? Sign up
              </button>
            ) : (
              <button className="text-blue-600 hover:underline" onClick={() => setMode("signin")}>
                Already have an account? Sign in
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AuthPage;
