import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { LogOut, Camera, Tag, Download, Calendar } from "lucide-react";
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

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [bRes, pRes, oRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("customer_photos").select("*").order("created_at", { ascending: false }),
      supabase.from("offers").select("*").eq("is_active", true),
    ]);
    if (bRes.data) setBookings(bRes.data);
    if (pRes.data) setPhotos(pRes.data);
    if (oRes.data) setOffers(oRes.data);
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

  const formatPrice = (p: number) => p.toFixed(2).replace(".", ",") + " €";

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

          <TabsContent value="bookings">
            <div className="space-y-4">
              {bookings.length === 0 && (
                <div className="bg-card rounded-xl p-12 shadow-card text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Du hast noch keine Buchungen.</p>
                  <Button variant="booking" className="mt-4" onClick={() => navigate("/")}>Jetzt buchen</Button>
                </div>
              )}
              {bookings.map(b => (
                <div key={b.id} className="bg-card rounded-xl p-6 shadow-card border border-border">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{b.service}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {b.booking_date ? format(new Date(b.booking_date), "dd. MMMM yyyy", { locale: de }) : ""}{" "}
                        {b.booking_time ? `um ${b.booking_time} Uhr` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-primary">{formatPrice(b.total_price)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        b.status === "confirmed" ? "bg-green-100 text-green-800" :
                        b.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>{b.status === "confirmed" ? "Bestätigt" : b.status === "cancelled" ? "Storniert" : "Ausstehend"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

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
                      <img src={p.file_url} alt={p.file_name} className="w-full h-full object-cover" />
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
                    {o.discount_percent && (
                      <p className="text-2xl font-display font-bold text-primary mt-3">{o.discount_percent}% Rabatt</p>
                    )}
                    {o.code && (
                      <p className="mt-2 px-3 py-1 bg-primary/10 rounded-md inline-block font-mono text-sm text-primary">{o.code}</p>
                    )}
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
