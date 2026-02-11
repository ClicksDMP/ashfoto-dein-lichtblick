import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Search } from "lucide-react";
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

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setProfiles(data);
  };

  const filteredProfiles = profiles.filter(p => {
    if (clientSearch && !`${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(clientSearch.toLowerCase())) return false;
    if (clientFilter === "all") return true;
    const hasBookings = bookings.some(b => b.user_id === p.user_id);
    return clientFilter === "with_bookings" ? hasBookings : !hasBookings;
  });

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Name oder E-Mail suchen..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={clientFilter === "all" ? "default" : "outline"} onClick={() => setClientFilter("all")}>Alle</Button>
          <Button size="sm" variant={clientFilter === "with_bookings" ? "default" : "outline"} onClick={() => setClientFilter("with_bookings")}>Mit Buchungen</Button>
          <Button size="sm" variant={clientFilter === "no_bookings" ? "default" : "outline"} onClick={() => setClientFilter("no_bookings")}>Ohne Buchungen</Button>
        </div>
        <p className="text-sm text-muted-foreground">{filteredProfiles.length} Kunden</p>
      </div>
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Registriert am</TableHead>
              <TableHead>Buchungen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.first_name || p.last_name ? `${p.first_name} ${p.last_name}` : <span className="text-muted-foreground italic">Nicht ausgefüllt</span>}
                </TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.phone || "–"}</TableCell>
                <TableCell className="text-sm">
                  {p.street ? `${p.street}, ${p.zip} ${p.city}` : "–"}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(p.created_at), "dd.MM.yyyy", { locale: de })}
                </TableCell>
                <TableCell>{bookings.filter(b => b.user_id === p.user_id).length}</TableCell>
              </TableRow>
            ))}
            {filteredProfiles.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Keine Kunden gefunden</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AdminClients;
