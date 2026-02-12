import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Check, X, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Feedback {
  id: string;
  client_name: string;
  service_name: string;
  rating: number;
  feedback_text: string;
  approved: boolean;
  created_at: string;
}

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeedbacks(); }, []);

  const fetchFeedbacks = async () => {
    const { data } = await supabase
      .from("customer_feedbacks")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setFeedbacks(data);
    setLoading(false);
  };

  const toggleApproval = async (id: string, currentlyApproved: boolean) => {
    await supabase.from("customer_feedbacks").update({ approved: !currentlyApproved }).eq("id", id);
    toast.success(currentlyApproved ? "Feedback ausgeblendet" : "Feedback genehmigt & veröffentlicht!");
    fetchFeedbacks();
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Feedback dauerhaft löschen?")) return;
    await supabase.from("customer_feedbacks").delete().eq("id", id);
    fetchFeedbacks();
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Feedback Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Approve feedbacks to display them on the homepage</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            {feedbacks.length} Total
          </Badge>
          <Badge variant="default" className="text-sm px-3 py-1.5">
            <Check className="w-3.5 h-3.5 mr-1.5" />
            {feedbacks.filter(f => f.approved).length} Published
          </Badge>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl shadow-card">
          <MessageSquare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">Noch keine Feedbacks vorhanden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map(f => (
            <div key={f.id} className="bg-card rounded-xl p-5 shadow-card border border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-foreground">{f.client_name}</p>
                    <Badge variant={f.approved ? "default" : "outline"} className="text-xs">
                      {f.approved ? "Published" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{f.service_name} · {format(new Date(f.created_at), "dd.MM.yyyy")}</p>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= f.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 italic">"{f.feedback_text}"</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant={f.approved ? "outline" : "default"} onClick={() => toggleApproval(f.id, f.approved)}>
                    {f.approved ? <X className="w-4 h-4 mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                    {f.approved ? "Hide" : "Approve"}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteFeedback(f.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacks;
