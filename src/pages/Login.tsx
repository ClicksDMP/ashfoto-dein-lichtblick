import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) {
      // Small delay to let isAdmin resolve
      setRedirecting(true);
      const timer = setTimeout(() => {
        navigate(isAdmin ? "/admin" : "/portal");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setError("Bitte bestätige zuerst deine E-Mail-Adresse. Überprüfe dein Postfach.");
      } else {
        setError("E-Mail oder Passwort ist falsch.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Anmelden</h1>
          <p className="text-muted-foreground mt-2">Melde dich in deinem Konto an</p>
        </div>
        <form onSubmit={handleLogin} className="bg-card rounded-xl p-8 shadow-card space-y-4">
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div>
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 h-12" required />
          </div>
          <div>
            <Label htmlFor="password">Passwort</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 h-12" required />
          </div>
          <Button type="submit" variant="booking" size="lg" className="w-full" disabled={loading}>
            {loading ? "Wird geladen..." : "Anmelden"}
          </Button>
          <div className="text-center">
            <Button variant="link" onClick={() => navigate("/")} type="button">Zurück zur Startseite</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
