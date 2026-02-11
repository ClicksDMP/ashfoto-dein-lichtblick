import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignUpDialog = ({ open, onOpenChange }: SignUpDialogProps) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zip: "",
    city: "",
    password: "",
    passwordRepeat: "",
    agreedToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const isValid =
    form.firstName && form.lastName && form.email && form.phone &&
    form.street && form.zip && form.city &&
    form.password.length >= 6 && form.password === form.passwordRepeat &&
    form.agreedToTerms;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
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

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Create profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        user_id: user.id,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        street: form.street,
        zip: form.zip,
        city: form.city,
      });
    }

    setSuccess(true);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setForm({
        firstName: "", lastName: "", email: "", phone: "",
        street: "", zip: "", city: "", password: "", passwordRepeat: "",
        agreedToTerms: false,
      });
      setError("");
      setSuccess(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Konto erstellen</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Registrierung erfolgreich!
            </h3>
            <p className="text-muted-foreground text-sm">
              Bitte bestätige deine E-Mail-Adresse über den Link in deinem Postfach.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signup-firstName" className="text-foreground">Vorname</Label>
                <Input id="signup-firstName" value={form.firstName} onChange={e => update("firstName", e.target.value)} className="mt-1 h-12" />
              </div>
              <div>
                <Label htmlFor="signup-lastName" className="text-foreground">Nachname</Label>
                <Input id="signup-lastName" value={form.lastName} onChange={e => update("lastName", e.target.value)} className="mt-1 h-12" />
              </div>
            </div>
            <div>
              <Label htmlFor="signup-email" className="text-foreground">E-Mail</Label>
              <Input id="signup-email" type="email" value={form.email} onChange={e => update("email", e.target.value)} className="mt-1 h-12" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signup-password" className="text-foreground">Passwort</Label>
                <Input id="signup-password" type="password" value={form.password} onChange={e => update("password", e.target.value)} className="mt-1 h-12" minLength={6} placeholder="Mind. 6 Zeichen" />
              </div>
              <div>
                <Label htmlFor="signup-passwordRepeat" className="text-foreground">Passwort wiederholen</Label>
                <Input id="signup-passwordRepeat" type="password" value={form.passwordRepeat} onChange={e => update("passwordRepeat", e.target.value)} className="mt-1 h-12" />
                {form.password && form.passwordRepeat && form.password !== form.passwordRepeat && (
                  <p className="text-destructive text-xs mt-1">Passwörter stimmen nicht überein</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="signup-phone" className="text-foreground">Telefonnummer</Label>
              <Input id="signup-phone" type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="mt-1 h-12" />
            </div>
            <div>
              <Label htmlFor="signup-street" className="text-foreground">Straße und Hausnummer</Label>
              <Input id="signup-street" value={form.street} onChange={e => update("street", e.target.value)} className="mt-1 h-12" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="signup-zip" className="text-foreground">PLZ</Label>
                <Input id="signup-zip" value={form.zip} onChange={e => update("zip", e.target.value)} className="mt-1 h-12" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="signup-city" className="text-foreground">Ort</Label>
                <Input id="signup-city" value={form.city} onChange={e => update("city", e.target.value)} className="mt-1 h-12" />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="signup-terms"
                checked={form.agreedToTerms}
                onCheckedChange={(checked) => update("agreedToTerms", checked === true)}
              />
              <label htmlFor="signup-terms" className="text-sm text-muted-foreground cursor-pointer">
                Ich akzeptiere die Datenschutzbedingungen
              </label>
            </div>

            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            <div className="text-center pt-2">
              <Button variant="booking" size="lg" disabled={!isValid || submitting} onClick={handleSubmit}>
                {submitting ? "Wird erstellt…" : "Konto erstellen"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
