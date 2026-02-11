import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Search, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Booking = Tables<"bookings">;

interface AdminClientsProps {
  bookings: Booking[];
}

const AdminClients = ({ bookings }: AdminClientsProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [clientFilter, setClientFilter] = useState<"all" | "with_bookings" | "no_bookings">("all");
  const [clientSearch, setClientSearch] = useState("");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", email: "", phone: "", street: "", zip: "", city: "" });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setProfiles(data);
  };

  const handleEdit = (p: Profile) => {
    setEditingProfile(p);
    setEditForm({
      first_name: p.first_name || "",
      last_name: p.last_name || "",
      email: p.email || "",
      phone: p.phone || "",
      street: p.street || "",
      zip: p.zip || "",
      city: p.city || "",
    });
  };

  const handleSave = async () => {
    if (!editingProfile) return;
    await supabase.from("profiles").update(editForm).eq("id", editingProfile.id);
    setEditingProfile(null);
    fetchProfiles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this client profile?")) return;
    await supabase.from("profiles").delete().eq("id", id);
    fetchProfiles();
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
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.first_name || p.last_name ? `${p.first_name} ${p.last_name}` : <span className="text-muted-foreground italic">Not filled in</span>}
                </TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.phone || "–"}</TableCell>
                <TableCell className="text-sm">
                  {p.street ? `${p.street}, ${p.zip} ${p.city}` : "–"}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(p.created_at), "MM/dd/yyyy")}
                </TableCell>
                <TableCell>{bookings.filter(b => b.user_id === p.user_id).length}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(p)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredProfiles.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No clients found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input value={editForm.first_name} onChange={e => setEditForm(p => ({ ...p, first_name: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={editForm.last_name} onChange={e => setEditForm(p => ({ ...p, last_name: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Street</Label>
              <Input value={editForm.street} onChange={e => setEditForm(p => ({ ...p, street: e.target.value }))} className="mt-1" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>ZIP</Label>
                <Input value={editForm.zip} onChange={e => setEditForm(p => ({ ...p, zip: e.target.value }))} className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>City</Label>
                <Input value={editForm.city} onChange={e => setEditForm(p => ({ ...p, city: e.target.value }))} className="mt-1" />
              </div>
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
