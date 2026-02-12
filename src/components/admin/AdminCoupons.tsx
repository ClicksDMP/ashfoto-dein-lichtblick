import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Trash2, RefreshCw, Plus, Send, Loader2, Tag, Search } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Offer = Tables<"offers">;

interface OfferWithProfile extends Offer {
  profile_first_name?: string;
  profile_last_name?: string;
  profile_email?: string;
  profile_phone?: string;
}

const AdminCoupons = () => {
  const [offers, setOffers] = useState<OfferWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    title: "",
    description: "",
    discount_percent: "",
    email: "",
    valid_until: "",
    code: "",
  });

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) code += chars[array[i] % chars.length];
    setNewCoupon(p => ({ ...p, code }));
  };

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const { data: offersData } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!offersData) { setLoading(false); return; }

    // Fetch profiles for targeted offers
    const userIds = offersData.filter(o => o.target_user_id).map(o => o.target_user_id!);
    let profilesMap: Record<string, { first_name: string; last_name: string; email: string; phone: string | null }> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, email, phone")
        .in("user_id", userIds);
      if (profiles) {
        profiles.forEach(p => { profilesMap[p.user_id] = p; });
      }
    }

    const enriched: OfferWithProfile[] = offersData.map(o => ({
      ...o,
      profile_first_name: o.target_user_id ? profilesMap[o.target_user_id]?.first_name : undefined,
      profile_last_name: o.target_user_id ? profilesMap[o.target_user_id]?.last_name : undefined,
      profile_email: o.target_user_id ? profilesMap[o.target_user_id]?.email : undefined,
      profile_phone: o.target_user_id ? profilesMap[o.target_user_id]?.phone : undefined,
    }));

    setOffers(enriched);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const deleteCoupon = async (id: string) => {
    if (!confirm("Diesen Gutschein endgültig löschen?")) return;
    await supabase.from("offers").delete().eq("id", id);
    toast.success("Gutschein gelöscht!");
    fetchOffers();
  };

  const createAndSendCoupon = async () => {
    if (!newCoupon.title || !newCoupon.discount_percent || !newCoupon.email || !newCoupon.code) {
      toast.error("Bitte fülle alle Pflichtfelder aus (Titel, Rabatt %, E-Mail, Code)");
      return;
    }

    setCreating(true);

    // Find target user by email
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id, first_name")
      .eq("email", newCoupon.email)
      .maybeSingle();

    const validUntil = newCoupon.valid_until
      ? new Date(newCoupon.valid_until).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase.from("offers").insert({
      title: newCoupon.title,
      description: newCoupon.description || `${newCoupon.discount_percent}% Rabatt auf deine Shooting-Zeit`,
      discount_percent: parseFloat(newCoupon.discount_percent),
      code: newCoupon.code,
      valid_until: validUntil,
      target_user_id: profile?.user_id || null,
      is_active: true,
      single_use: true,
      photo_package_only: false,
      source: "admin_coupon",
    });

    if (error) {
      toast.error("Fehler beim Erstellen: " + error.message);
      setCreating(false);
      return;
    }

    // Send email via edge function
    setSending(true);
    try {
      const { error: emailError } = await supabase.functions.invoke("send-coupon-email", {
        body: {
          to: newCoupon.email,
          firstName: profile?.first_name || "",
          code: newCoupon.code,
          discountPercent: newCoupon.discount_percent,
          description: newCoupon.description || `${newCoupon.discount_percent}% Rabatt auf deine Shooting-Zeit`,
          validUntil: validUntil,
        },
      });
      if (emailError) throw emailError;
      toast.success("Gutschein erstellt & E-Mail gesendet!");
    } catch (e) {
      console.error("Email send failed:", e);
      toast.success("Gutschein erstellt! (E-Mail konnte nicht gesendet werden)");
    }

    setNewCoupon({ title: "", description: "", discount_percent: "", email: "", valid_until: "", code: "" });
    setCreating(false);
    setSending(false);
    fetchOffers();
  };

  const welcomeOffers = offers.filter(o => o.source === "welcome_discount");
  const adminOffers = offers.filter(o => o.source !== "welcome_discount");

  const filteredWelcome = welcomeOffers.filter(o =>
    `${o.profile_first_name} ${o.profile_last_name} ${o.profile_email} ${o.code}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAdmin = adminOffers.filter(o =>
    `${o.title} ${o.profile_first_name} ${o.profile_last_name} ${o.profile_email} ${o.code}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Create new coupon */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-primary" /> Neuen Gutschein erstellen & senden
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Titel *</Label>
            <Input value={newCoupon.title} onChange={e => setNewCoupon(p => ({ ...p, title: e.target.value }))} placeholder="z.B. Sommer-Aktion" className="mt-1" />
          </div>
          <div>
            <Label>E-Mail des Kunden *</Label>
            <Input type="email" value={newCoupon.email} onChange={e => setNewCoupon(p => ({ ...p, email: e.target.value }))} placeholder="kunde@example.com" className="mt-1" />
          </div>
          <div>
            <Label>Rabatt % (auf Shooting-Zeit) *</Label>
            <Input type="number" min="1" max="100" value={newCoupon.discount_percent} onChange={e => setNewCoupon(p => ({ ...p, discount_percent: e.target.value }))} placeholder="10" className="mt-1" />
          </div>
          <div>
            <Label>Gültig bis</Label>
            <Input type="date" value={newCoupon.valid_until} onChange={e => setNewCoupon(p => ({ ...p, valid_until: e.target.value }))} className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>Nachricht (optional)</Label>
            <Textarea value={newCoupon.description} onChange={e => setNewCoupon(p => ({ ...p, description: e.target.value }))} placeholder="Persönliche Nachricht für den Kunden..." className="mt-1" rows={2} />
          </div>
          <div>
            <Label>Code *</Label>
            <div className="flex gap-2 mt-1">
              <Input value={newCoupon.code} onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="XXXX-XXXX-XXXX-XXXX" className="font-mono tracking-wider" />
              <Button variant="outline" size="icon" onClick={generateCode} title="Code generieren"><RefreshCw className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="flex items-end">
            <Button onClick={createAndSendCoupon} disabled={creating || sending} className="gap-2">
              {creating || sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Erstellen & per E-Mail senden
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Gutscheine durchsuchen..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      {/* Admin/Custom Coupons */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" /> Gutscheine & Angebote ({filteredAdmin.length})
        </h3>
        <div className="bg-card rounded-xl shadow-card overflow-x-auto border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Erstellt</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Rabatt</TableHead>
                <TableHead>Gültig bis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmin.map(o => {
                const isExpired = o.valid_until && new Date(o.valid_until) < new Date();
                const isUsed = !!o.used_at;
                return (
                  <TableRow key={o.id}>
                    <TableCell className="text-sm whitespace-nowrap">{format(new Date(o.created_at), "dd.MM.yyyy")}</TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{o.title}</p>
                      {o.description && <p className="text-xs text-muted-foreground">{o.description}</p>}
                    </TableCell>
                    <TableCell>
                      {o.profile_first_name ? (
                        <div>
                          <p className="font-medium text-sm">{o.profile_first_name} {o.profile_last_name}</p>
                          <p className="text-xs text-muted-foreground">{o.profile_email}</p>
                        </div>
                      ) : o.target_user_id ? (
                        <span className="text-xs text-muted-foreground">{o.target_user_id.slice(0, 8)}...</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Allgemein</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{o.code || "–"}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {o.discount_percent ? `${o.discount_percent}%` : ""}
                      {o.discount_amount ? `${Number(o.discount_amount).toFixed(2).replace(".", ",")} €` : ""}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{o.valid_until ? format(new Date(o.valid_until), "dd.MM.yyyy") : "–"}</TableCell>
                    <TableCell>
                      <Badge variant={isUsed ? "default" : isExpired ? "destructive" : "secondary"} className="text-xs">
                        {isUsed ? "Eingelöst" : isExpired ? "Abgelaufen" : o.is_active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteCoupon(o.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredAdmin.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Keine Gutscheine vorhanden</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Welcome Coupons */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          🎁 Willkommens-Gutscheine ({filteredWelcome.length})
        </h3>
        <div className="bg-card rounded-xl shadow-card overflow-x-auto border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Erstellt</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Gültig bis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWelcome.map(o => {
                const isExpired = o.valid_until && new Date(o.valid_until) < new Date();
                const isUsed = !!o.used_at;
                return (
                  <TableRow key={o.id}>
                    <TableCell className="text-sm whitespace-nowrap">{format(new Date(o.created_at), "dd.MM.yyyy")}</TableCell>
                    <TableCell className="font-medium text-sm">
                      {o.profile_first_name ? `${o.profile_first_name} ${o.profile_last_name}` : "–"}
                    </TableCell>
                    <TableCell className="text-sm">{o.profile_email || "–"}</TableCell>
                    <TableCell className="text-sm">{o.profile_phone || "–"}</TableCell>
                    <TableCell className="font-mono text-sm">{o.code}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{o.valid_until ? format(new Date(o.valid_until), "dd.MM.yyyy") : "–"}</TableCell>
                    <TableCell>
                      <Badge variant={isUsed ? "default" : isExpired ? "destructive" : "secondary"} className="text-xs">
                        {isUsed ? "Eingelöst" : isExpired ? "Abgelaufen" : "Aktiv"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteCoupon(o.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredWelcome.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Keine Willkommens-Gutscheine vorhanden</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
