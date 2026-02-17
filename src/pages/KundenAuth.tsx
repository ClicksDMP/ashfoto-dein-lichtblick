import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

const KundenAuth = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", zip: "", city: "", password: "", passwordRepeat: "",
    agreedToTerms: false,
  });
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/portal");
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setLoginError("Bitte bestätige zuerst deine E-Mail-Adresse. Überprüfe dein Postfach.");
      } else {
        setLoginError("E-Mail oder Passwort ist falsch.");
      }
    }
    setLoginLoading(false);
  };

  const update = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const isValid =
    form.firstName && form.lastName && form.email && form.phone &&
    form.street && form.zip && form.city &&
    form.password.length >= 6 && form.password === form.passwordRepeat &&
    form.agreedToTerms;

  const handleSignup = async () => {
    if (!isValid) return;
    setSignupLoading(true);
    setSignupError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + "/kunden",
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          street: form.street,
          zip: form.zip,
          city: form.city,
        },
      },
    });

    setSignupLoading(false);
    if (signUpError) {
      setSignupError(signUpError.message);
      return;
    }
    setSignupSuccess(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-foreground">Laden...</p></div>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Kundenbereich</h1>
          <p className="text-muted-foreground mt-2">Melde dich an oder erstelle ein Konto</p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-card">
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">Anmelden</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Konto erstellen</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && <p className="text-destructive text-sm">{loginError}</p>}
                <div>
                  <Label htmlFor="login-email">E-Mail</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="mt-1 h-12" required />
                </div>
                <div>
                  <Label htmlFor="login-password">Passwort</Label>
                  <Input id="login-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="mt-1 h-12" required />
                </div>
                <Button type="submit" variant="booking" size="lg" className="w-full" disabled={loginLoading}>
                  {loginLoading ? "Wird geladen..." : "Anmelden"}
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup">
              {signupSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">Registrierung erfolgreich!</h3>
                  <p className="text-muted-foreground text-sm">Bitte bestätige deine E-Mail-Adresse über den Link in deinem Postfach.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vorname</Label>
                      <Input value={form.firstName} onChange={e => update("firstName", e.target.value)} className="mt-1 h-12" />
                    </div>
                    <div>
                      <Label>Nachname</Label>
                      <Input value={form.lastName} onChange={e => update("lastName", e.target.value)} className="mt-1 h-12" />
                    </div>
                  </div>
                  <div>
                    <Label>E-Mail</Label>
                    <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} className="mt-1 h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Passwort</Label>
                      <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} className="mt-1 h-12" placeholder="Mind. 6 Zeichen" />
                    </div>
                    <div>
                      <Label>Passwort wiederholen</Label>
                      <Input type="password" value={form.passwordRepeat} onChange={e => update("passwordRepeat", e.target.value)} className="mt-1 h-12" />
                      {form.password && form.passwordRepeat && form.password !== form.passwordRepeat && (
                        <p className="text-destructive text-xs mt-1">Passwörter stimmen nicht überein</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Telefonnummer</Label>
                    <Input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="mt-1 h-12" />
                  </div>
                  <div>
                    <Label>Straße und Hausnummer</Label>
                    <Input value={form.street} onChange={e => update("street", e.target.value)} className="mt-1 h-12" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>PLZ</Label>
                      <Input value={form.zip} onChange={e => update("zip", e.target.value)} className="mt-1 h-12" />
                    </div>
                    <div className="col-span-2">
                      <Label>Ort</Label>
                      <Input value={form.city} onChange={e => update("city", e.target.value)} className="mt-1 h-12" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      checked={form.agreedToTerms}
                      onCheckedChange={(checked) => update("agreedToTerms", checked === true)}
                    />
                    <label className="text-sm text-muted-foreground cursor-pointer">
                      Ich akzeptiere die{" "}
                      <a href="/agb" target="_blank" className="underline hover:text-foreground">AGB</a>,{" "}
                      <a href="/datenschutz" target="_blank" className="underline hover:text-foreground">Datenschutzerklärung</a>{" "}
                      und{" "}
                      <a href="/widerruf" target="_blank" className="underline hover:text-foreground">Widerrufsbelehrung</a>.
                    </label>
                  </div>
                  {signupError && <p className="text-destructive text-sm text-center">{signupError}</p>}
                  <Button variant="booking" size="lg" className="w-full" disabled={!isValid || signupLoading} onClick={handleSignup}>
                    {signupLoading ? "Wird erstellt…" : "Konto erstellen"}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="text-center mt-4">
            <Button variant="link" onClick={() => navigate("/")} type="button">Zurück zur Startseite</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundenAuth;
