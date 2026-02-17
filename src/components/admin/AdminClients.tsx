import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, Pencil, Trash2, Upload, Send, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Booking = Tables<"bookings">;

interface AdminClientsProps {
  bookings: Booking[];
  onRefreshBookings: () => void;
}

const AdminClients = ({ bookings, onRefreshBookings }: AdminClientsProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [clientFilter, setClientFilter] = useState<"all" | "with_bookings" | "no_bookings">("all");
  const [clientSearch, setClientSearch] = useState("");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", email: "", phone: "", street: "", zip: "", city: "" });
  const [photoUploadBooking, setPhotoUploadBooking] = useState<Booking | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  useEffect(() => { fetchProfiles(); }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setProfiles(data);
  };

  const handleEdit = (p: Profile) => {
    setEditingProfile(p);
    setEditForm({
      first_name: p.first_name || "", last_name: p.last_name || "", email: p.email || "",
      phone: p.phone || "", street: p.street || "", zip: p.zip || "", city: p.city || "",
    });
  };

  const handleSave = async () => {
    if (!editingProfile) return;
    await supabase.from("profiles").update(editForm).eq("id", editingProfile.id);
    setEditingProfile(null);
    fetchProfiles();
  };

  const handleDelete = async (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return;
    if (!confirm("Diesen Kunden vollständig löschen? Alle Buchungen, Fotos und Daten werden unwiderruflich entfernt.")) return;
    
    try {
      const { data, error } = await supabase.functions.invoke("delete-user", {
        body: { user_id: profile.user_id },
      });
      if (error) throw error;
      toast.success("Kunde vollständig gelöscht!");
      fetchProfiles();
      onRefreshBookings();
    } catch (err) {
      console.error("Delete user error:", err);
      toast.error("Kunde konnte nicht gelöscht werden.");
    }
  };

  const handlePhotoUpload = async (booking: Booking, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${booking.user_id}/${booking.id}/${Date.now()}-${i}-${file.name}`;
      
      // Upload original (no compression for client delivery)
      const { error: uploadError } = await supabase.storage
        .from("customer-photos")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      // Save photo record
      await supabase.from("customer_photos").insert({
        user_id: booking.user_id,
        booking_id: booking.id,
        file_url: fileName,
        file_name: file.name,
      });
      successCount++;
    }

    // Mark booking as photos delivered
    await supabase.from("bookings").update({ photos_delivered_at: new Date().toISOString() }).eq("id", booking.id);

    // Send email notification to client
    try {
      await supabase.functions.invoke("send-booking-emails", {
        body: {
          type: "photos_ready",
          to: booking.email,
          data: {
            firstName: booking.first_name,
            service: booking.service,
          },
        },
      });
    } catch (err) {
      console.error("Failed to send photo notification email:", err);
    }

    toast.success(`${successCount} Fotos an ${booking.first_name} gesendet!`);
    setUploading(false);
    setPhotoUploadBooking(null);
    onRefreshBookings();
    e.target.value = "";
  };

  const filteredProfiles = profiles.filter(p => {
    if (clientSearch && !`${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(clientSearch.toLowerCase())) return false;
    if (clientFilter === "all") return true;
    const hasBookings = bookings.some(b => b.user_id === p.user_id);
    return clientFilter === "with_bookings" ? hasBookings : !hasBookings;
  });

  return (
    <>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name or email..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={clientFilter === "all" ? "default" : "outline"} onClick={() => setClientFilter("all")}>All</Button>
          <Button size="sm" variant={clientFilter === "with_bookings" ? "default" : "outline"} onClick={() => setClientFilter("with_bookings")}>With Bookings</Button>
          <Button size="sm" variant={clientFilter === "no_bookings" ? "default" : "outline"} onClick={() => setClientFilter("no_bookings")}>No Bookings</Button>
        </div>
        <p className="text-sm text-muted-foreground">{filteredProfiles.length} clients</p>
      </div>

      <div className="space-y-3">
        {filteredProfiles.map(p => {
          const clientBookings = bookings.filter(b => b.user_id === p.user_id);
          const isExpanded = expandedClient === p.id;

          return (
            <div key={p.id} className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => setExpandedClient(isExpanded ? null : p.id)}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    {p.first_name || p.last_name ? `${p.first_name} ${p.last_name}` : <span className="text-muted-foreground italic">Not filled in</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                </div>
                <Badge variant={clientBookings.length > 0 ? "default" : "outline"} className="text-xs">
                  {clientBookings.length} Bookings
                </Badge>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEdit(p); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isExpanded && clientBookings.length > 0 && (
                <div className="border-t border-border px-4 py-3 space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Bookings & Photo Delivery</h4>
                  {clientBookings.map(b => (
                    <div key={b.id} className="flex items-center justify-between gap-3 bg-secondary/10 rounded-lg p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{b.service}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.booking_date ? format(new Date(b.booking_date), "dd.MM.yyyy") : "No date"} · {b.status}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(b as any).photos_delivered_at ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                            <Image className="w-3 h-3 mr-1" /> Fotos gesendet
                          </Badge>
                        ) : b.status === "confirmed" ? (
                          <div>
                            <Label htmlFor={`photo-upload-${b.id}`} className="cursor-pointer">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium">
                                <Send className="w-3 h-3" /> Fotos senden
                              </div>
                            </Label>
                            <Input
                              id={`photo-upload-${b.id}`}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handlePhotoUpload(b, e)}
                              disabled={uploading}
                              className="hidden"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Erst nach Bestätigung</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No clients found</div>
        )}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Client</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input value={editForm.first_name} onChange={e => setEditForm(p => ({ ...p, first_name: e.target.value }))} className="mt-1" /></div>
              <div><Label>Last Name</Label><Input value={editForm.last_name} onChange={e => setEditForm(p => ({ ...p, last_name: e.target.value }))} className="mt-1" /></div>
            </div>
            <div><Label>Email</Label><Input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} className="mt-1" /></div>
            <div><Label>Phone</Label><Input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" /></div>
            <div><Label>Street</Label><Input value={editForm.street} onChange={e => setEditForm(p => ({ ...p, street: e.target.value }))} className="mt-1" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>ZIP</Label><Input value={editForm.zip} onChange={e => setEditForm(p => ({ ...p, zip: e.target.value }))} className="mt-1" /></div>
              <div className="col-span-2"><Label>City</Label><Input value={editForm.city} onChange={e => setEditForm(p => ({ ...p, city: e.target.value }))} className="mt-1" /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingProfile(null)}>Cancel</Button>
              <Button variant="booking" onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminClients;
