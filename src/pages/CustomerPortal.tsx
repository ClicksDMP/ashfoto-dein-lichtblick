import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { LogOut, Camera, Tag, Download, Calendar, Star, MessageSquare, Info, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getTipsForService, getStatusInfo } from "@/lib/shootingTips";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;
type Photo = Tables<"customer_photos">;
type Offer = Tables<"offers">;

const CustomerPortal = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [feedbackBooking, setFeedbackBooking] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [existingFeedbacks, setExistingFeedbacks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const [bRes, pRes, oRes, fRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("customer_photos").select("*").order("created_at", { ascending: false }),
      supabase.from("offers").select("*").eq("is_active", true),
      supabase.from("customer_feedbacks").select("booking_id").eq("user_id", user!.id),
    ]);
    if (bRes.data) setBookings(bRes.data);
    if (pRes.data) setPhotos(pRes.data);
    if (oRes.data) setOffers(oRes.data);
    if (fRes.data) setExistingFeedbacks(new Set(fRes.data.map(f => f.booking_id).filter(Boolean) as string[]));
  };

  const downloadPhoto = async (photo: Photo) => {
    const { data } = await supabase.storage.from("customer-photos").download(photo.file_url);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = photo.file_name || "photo.jpg";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadAllPhotos = async (bookingId: string) => {
    const bookingPhotos = photos.filter(p => p.booking_id === bookingId);
    for (const photo of bookingPhotos) {
      await downloadPhoto(photo);
    }
    toast.success(`${bookingPhotos.length} Fotos heruntergeladen!`);
  };

  const submitFeedback = async (bookingId: string) => {
    if (!user || !feedbackText.trim()) return;
    setSubmittingFeedback(true);
    const booking = bookings.find(b => b.id === bookingId);
    
    const { error } = await supabase.from("customer_feedbacks").insert({
      booking_id: bookingId,
      user_id: user.id,
      rating: feedbackRating,
      feedback_text: feedbackText.trim(),
      client_name: booking ? `${booking.first_name} ${booking.last_name}` : "Kunde",
      service_name: booking?.service || "",
    });

    if (error) {
      toast.error("Feedback konnte nicht gespeichert werden.");
    } else {
      toast.success("Vielen Dank für dein Feedback! 💛");
      setFeedbackBooking(null);
      setFeedbackText("");
      setFeedbackRating(5);
      setExistingFeedbacks(prev => new Set([...prev, bookingId]));
    }
    setSubmittingFeedback(false);
  };

  const formatPrice = (p: number) => p.toFixed(2).replace(".", ",") + " €";

  const getPhotoUrl = (photo: Photo) => {
    const { data } = supabase.storage.from("customer-photos").getPublicUrl(photo.file_url);
    return data?.publicUrl || "";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p>Laden...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Mein Bereich</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")}>Zur Website</Button>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="w-4 h-4 mr-2" />Abmelden</Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" className="gap-2"><Calendar className="w-4 h-4" />Meine Buchungen</TabsTrigger>
            <TabsTrigger value="photos" className="gap-2"><Camera className="w-4 h-4" />Meine Fotos</TabsTrigger>
            <TabsTrigger value="offers" className="gap-2"><Tag className="w-4 h-4" />Angebote</TabsTrigger>
          </TabsList>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {bookings.length === 0 && (
                <div className="bg-card rounded-xl p-12 shadow-card text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Du hast noch keine Buchungen.</p>
                  <Button variant="booking" className="mt-4" onClick={() => navigate("/")}>Jetzt buchen</Button>
                </div>
              )}
              {bookings.map(b => {
                const statusInfo = getStatusInfo(b.status);
                const tips = getTipsForService(b.service);
                const isExpanded = expandedBooking === b.id;
                const bookingPhotos = photos.filter(p => p.booking_id === b.id);
                const hasFeedback = existingFeedbacks.has(b.id);

                return (
                  <div key={b.id} className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
                    {/* Booking Header */}
                    <div
                      className="p-6 cursor-pointer hover:bg-secondary/10 transition-colors"
                      onClick={() => setExpandedBooking(isExpanded ? null : b.id)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground">{b.service}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {b.booking_date ? format(new Date(b.booking_date), "dd. MMMM yyyy", { locale: de }) : "Termin noch offen"}{" "}
                            {b.booking_time ? `um ${b.booking_time} Uhr` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-primary">{formatPrice(b.total_price)}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {statusInfo.description}
                      </p>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-border">
                        {/* Booking Details */}
                        <div className="p-6 bg-secondary/5">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" /> Buchungsdetails
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-muted-foreground">Dauer:</span> <span className="text-foreground font-medium ml-1">{b.duration}</span></div>
                            <div><span className="text-muted-foreground">Bildpaket:</span> <span className="text-foreground font-medium ml-1">{b.photo_package === "none" ? "Ohne" : b.photo_package === "all" ? "Alle Fotos" : `${b.photo_package} Bilder`}</span></div>
                            {b.notes && <div className="col-span-2"><span className="text-muted-foreground">Hinweise:</span> <span className="text-foreground ml-1">{b.notes}</span></div>}
                          </div>
                        </div>

                        {/* Photos for this booking */}
                        {bookingPhotos.length > 0 && (
                          <div className="p-6 border-t border-border">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-foreground flex items-center gap-2">
                                <Camera className="w-4 h-4 text-primary" /> Deine Fotos ({bookingPhotos.length})
                              </h4>
                              <Button variant="outline" size="sm" onClick={() => downloadAllPhotos(b.id)}>
                                <Download className="w-4 h-4 mr-2" /> Alle herunterladen
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {bookingPhotos.map(p => (
                                <div key={p.id} className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border">
                                  <img
                                    src={getPhotoUrl(p)}
                                    alt={p.file_name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => downloadPhoto(p)}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Feedback Section */}
                        {bookingPhotos.length > 0 && !hasFeedback && (
                          <div className="p-6 border-t border-border">
                            {feedbackBooking === b.id ? (
                              <div className="space-y-4">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-primary" /> Dein Feedback
                                </h4>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} onClick={() => setFeedbackRating(s)} className="p-1">
                                      <Star className={`w-6 h-6 transition-colors ${s <= feedbackRating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                                    </button>
                                  ))}
                                </div>
                                <Textarea
                                  placeholder="Wie war dein Erlebnis? Erzähl uns davon..."
                                  value={feedbackText}
                                  onChange={e => setFeedbackText(e.target.value)}
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <Button variant="booking" onClick={() => submitFeedback(b.id)} disabled={submittingFeedback || !feedbackText.trim()}>
                                    {submittingFeedback ? "Wird gesendet..." : "Feedback senden"}
                                  </Button>
                                  <Button variant="outline" onClick={() => setFeedbackBooking(null)}>Abbrechen</Button>
                                </div>
                              </div>
                            ) : (
                              <Button variant="outline" onClick={() => setFeedbackBooking(b.id)} className="w-full">
                                <MessageSquare className="w-4 h-4 mr-2" /> Feedback hinterlassen
                              </Button>
                            )}
                          </div>
                        )}

                        {hasFeedback && (
                          <div className="p-6 border-t border-border">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" /> Vielen Dank für dein Feedback! 💛
                            </p>
                          </div>
                        )}

                        {/* Tips Section */}
                        {b.status !== "cancelled" && (
                          <div className="p-6 border-t border-border bg-primary/5">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Info className="w-4 h-4 text-primary" /> Tipps zur Vorbereitung
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {tips.map((tip, i) => (
                                <div key={i} className="flex gap-3 bg-card rounded-lg p-3 border border-border/50">
                                  <span className="text-xl flex-shrink-0">{tip.icon}</span>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{tip.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{tip.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* PHOTOS TAB */}
          <TabsContent value="photos">
            {photos.length === 0 ? (
              <div className="bg-card rounded-xl p-12 shadow-card text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Noch keine Fotos verfügbar.</p>
                <p className="text-sm text-muted-foreground mt-1">Deine Fotos werden hier erscheinen, sobald sie bereit sind.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map(p => (
                  <div key={p.id} className="bg-card rounded-xl overflow-hidden shadow-card group">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={getPhotoUrl(p)} alt={p.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-sm text-foreground truncate">{p.file_name}</span>
                      <Button size="sm" variant="ghost" onClick={() => downloadPhoto(p)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* OFFERS TAB */}
          <TabsContent value="offers">
            {offers.length === 0 ? (
              <div className="bg-card rounded-xl p-12 shadow-card text-center">
                <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Keine aktuellen Angebote.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {offers.map(o => (
                  <div key={o.id} className="bg-card rounded-xl p-6 shadow-card border border-accent/30">
                    <h3 className="font-display text-lg font-bold text-foreground">{o.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{o.description}</p>
                    {o.discount_percent && <p className="text-2xl font-display font-bold text-primary mt-3">{o.discount_percent}% Rabatt</p>}
                    {o.code && <p className="mt-2 px-3 py-1 bg-primary/10 rounded-md inline-block font-mono text-sm text-primary">{o.code}</p>}
                    {o.valid_until && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Gültig bis {format(new Date(o.valid_until), "dd.MM.yyyy", { locale: de })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerPortal;
