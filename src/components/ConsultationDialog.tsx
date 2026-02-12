import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, Video, Phone, Calendar, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConsultationDialog = ({ open, onOpenChange }: ConsultationDialogProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    preferred_date: "",
    preferred_time: "",
    contact_method: "chat" as "chat" | "video_call",
    notes: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.first_name.trim().length > 0 &&
    form.last_name.trim().length > 0 &&
    form.phone.trim().length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    const { error } = await supabase.from("consultation_requests").insert({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      preferred_date: form.preferred_date || null,
      preferred_time: form.preferred_time || null,
      contact_method: form.contact_method,
      notes: form.notes.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
      return;
    }

    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setSubmitted(false);
      setForm({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        preferred_date: "",
        preferred_time: "",
        contact_method: "chat",
        notes: "",
      });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              Danke für deine Anfrage!
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Ich melde mich schnellstmöglich bei dir per WhatsApp. Freue mich auf unser Gespräch! 💬
            </p>
            <Button variant="cta" onClick={handleClose} className="mt-4">
              Alles klar!
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Kostenlose Beratung anfragen
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground pt-1">
                Machen wir es einfach – hinterlasse deine Daten und ich melde mich bei dir per{" "}
                <span className="font-medium text-foreground">WhatsApp</span>. Schnell, unkompliziert und persönlich. 💬
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="consult-fn">Vorname *</Label>
                  <Input
                    id="consult-fn"
                    value={form.first_name}
                    onChange={(e) => update("first_name", e.target.value)}
                    placeholder="Max"
                    required
                    maxLength={100}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="consult-ln">Nachname *</Label>
                  <Input
                    id="consult-ln"
                    value={form.last_name}
                    onChange={(e) => update("last_name", e.target.value)}
                    placeholder="Mustermann"
                    required
                    maxLength={100}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="consult-phone" className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  WhatsApp-Nummer *
                </Label>
                <Input
                  id="consult-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+49 170 1234567"
                  required
                  maxLength={30}
                  className="mt-1"
                />
              </div>

              {/* Email (optional) */}
              <div>
                <Label htmlFor="consult-email">E-Mail (optional)</Label>
                <Input
                  id="consult-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="max@beispiel.de"
                  maxLength={255}
                  className="mt-1"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="consult-date" className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Wunschtermin
                  </Label>
                  <Input
                    id="consult-date"
                    type="date"
                    value={form.preferred_date}
                    onChange={(e) => update("preferred_date", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="consult-time">Uhrzeit</Label>
                  <Input
                    id="consult-time"
                    type="time"
                    value={form.preferred_time}
                    onChange={(e) => update("preferred_time", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Contact method */}
              <div>
                <Label className="mb-3 block">Wie soll ich dich kontaktieren?</Label>
                <RadioGroup
                  value={form.contact_method}
                  onValueChange={(v) => update("contact_method", v)}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="method-chat"
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                      form.contact_method === "chat"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="chat" id="method-chat" />
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm text-foreground">WhatsApp Chat</p>
                        <p className="text-xs text-muted-foreground">Schreibe mir einfach</p>
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="method-video"
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                      form.contact_method === "video_call"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="video_call" id="method-video" />
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm text-foreground">Video-Call</p>
                        <p className="text-xs text-muted-foreground">Persönlich per Video</p>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="consult-notes">Was möchtest du besprechen? (optional)</Label>
                <Textarea
                  id="consult-notes"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="z. B. welches Shooting dich interessiert, besondere Wünsche, Fragen..."
                  maxLength={1000}
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="cta"
                size="xl"
                className="w-full"
                disabled={!isValid || submitting}
              >
                {submitting ? (
                  "Wird gesendet..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Beratung anfragen
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Ich melde mich innerhalb von 24 Stunden bei dir per WhatsApp.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDialog;
