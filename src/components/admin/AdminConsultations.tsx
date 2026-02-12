import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MessageCircle, Video, Phone, Trash2, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ConsultationRequest {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  contact_method: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const AdminConsultations = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("consultation_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("consultation_requests").update({ status }).eq("id", id);
    toast.success(status === "contacted" ? "Als kontaktiert markiert" : "Status aktualisiert");
    fetchRequests();
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Diese Anfrage wirklich löschen?")) return;
    await supabase.from("consultation_requests").delete().eq("id", id);
    toast.success("Anfrage gelöscht");
    fetchRequests();
  };

  const openWhatsApp = (phone: string, firstName: string) => {
    const cleanPhone = phone.replace(/\s+/g, "").replace(/^0/, "+49");
    const message = encodeURIComponent(`Hallo ${firstName}, danke für deine Anfrage bei ashfoto! Ich freue mich auf unser Gespräch. 📸`);
    window.open(`https://wa.me/${cleanPhone.replace("+", "")}?text=${message}`, "_blank");
  };

  const filtered = requests.filter((r) =>
    `${r.first_name} ${r.last_name} ${r.phone} ${r.email || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const newCount = requests.filter((r) => r.status === "new").length;

  const statusBadge = (status: string) => {
    switch (status) {
      case "new": return <Badge className="bg-blue-100 text-blue-800 text-xs">Neu</Badge>;
      case "contacted": return <Badge className="bg-amber-100 text-amber-800 text-xs">Kontaktiert</Badge>;
      case "done": return <Badge className="bg-green-100 text-green-800 text-xs">Erledigt</Badge>;
      default: return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-secondary/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Beratungsanfragen</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {newCount > 0 ? `${newCount} neue Anfrage${newCount > 1 ? "n" : ""}` : "Keine neuen Anfragen"}
          </p>
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Noch keine Beratungsanfragen eingegangen.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Wunschtermin</TableHead>
                <TableHead>Kontaktart</TableHead>
                <TableHead>Notizen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className={r.status === "new" ? "bg-blue-50/50" : ""}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {format(new Date(r.created_at), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{r.first_name} {r.last_name}</p>
                      {r.email && <p className="text-xs text-muted-foreground">{r.email}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => openWhatsApp(r.phone, r.first_name)}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {r.phone}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {r.preferred_date ? (
                      <span>
                        {format(new Date(r.preferred_date), "dd.MM.yyyy")}
                        {r.preferred_time && ` · ${r.preferred_time}`}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">–</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.contact_method === "video_call" ? (
                      <span className="flex items-center gap-1 text-xs">
                        <Video className="w-3.5 h-3.5 text-primary" /> Video-Call
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs">
                        <MessageCircle className="w-3.5 h-3.5 text-primary" /> Chat
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {r.notes ? (
                      <p className="text-xs text-muted-foreground truncate" title={r.notes}>{r.notes}</p>
                    ) : (
                      <span className="text-xs text-muted-foreground">–</span>
                    )}
                  </TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-green-600"
                        onClick={() => openWhatsApp(r.phone, r.first_name)}
                        title="WhatsApp öffnen"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      {r.status === "new" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => updateStatus(r.id, "contacted")}
                          title="Als kontaktiert markieren"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {r.status !== "done" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => updateStatus(r.id, "done")}
                          title="Als erledigt markieren"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive"
                        onClick={() => deleteRequest(r.id)}
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminConsultations;
