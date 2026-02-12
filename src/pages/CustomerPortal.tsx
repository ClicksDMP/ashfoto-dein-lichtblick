import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { LogOut, Camera, Tag, Download, Calendar, Star, MessageSquare, Info, CheckCircle, ArrowUpCircle, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { getTipsForService, getStatusInfo } from "@/lib/shootingTips";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;
type Photo = Tables<"customer_photos">;
type Offer = Tables<"offers">;

const PHOTO_PACKAGES = [
  { label: "10 Bilder", value: "10", price: 169.99 },
  { label: "15 Bilder", value: "15", price: 209.99 },
  { label: "20 Bilder", value: "20", price: 249.99 },
  { label: "30 Bilder", value: "30", price: 369.99 },
  { label: "40 Bilder", value: "40", price: 399.99 },
  { label: "Alle Fotos", value: "all", price: 449.99 },
];
const PACKAGE_ORDER = ["none", "10", "15", "20", "30", "40", "all"];
const SINGLE_PHOTO_PRICE = 29.99;

function getPackageLabel(value: string): string {
  if (value === "none") return "Ohne Paket";
  return PHOTO_PACKAGES.find(p => p.value === value)?.label || value;
}
function getPackagePrice(value: string): number {
  return PHOTO_PACKAGES.find(p => p.value === value)?.price || 0;
}

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

  // Upgrade state
  const [upgradeBookingId, setUpgradeBookingId] = useState<string | null>(null);
  const [upgradePackage, setUpgradePackage] = useState<string | null>(null);
  const [extraPhotos, setExtraPhotos] = useState(0);
  const [submittingUpgrade, setSubmittingUpgrade] = useState(false);
  const [bookingUpgrades, setBookingUpgrades] = useState<Record<string, any[]>>({});

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

    // Fetch upgrades for user's bookings
    const { data: upgrades } = await supabase
      .from("booking_upgrades")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (upgrades) {
      const map: Record<string, any[]> = {};
      upgrades.forEach(u => {
        if (!map[u.booking_id]) map[u.booking_id] = [];
        map[u.booking_id].push(u);
      });
      setBookingUpgrades(map);
    }
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

  // Upgrade logic
  const getUpgradeOptions = (booking: Booking) => {
    const currentPkg = booking.photo_package || "none";
    const currentIdx = PACKAGE_ORDER.indexOf(currentPkg);
    return PHOTO_PACKAGES.filter(p => PACKAGE_ORDER.indexOf(p.value) > currentIdx);
  };

  const calculateUpgradePrice = (booking: Booking) => {
    let pkgUpgrade = 0;
    if (upgradePackage) {
      const currentPrice = getPackagePrice(booking.photo_package || "none");
      const newPrice = getPackagePrice(upgradePackage);
      pkgUpgrade = Math.max(0, newPrice - currentPrice);
    }
    const extraPrice = extraPhotos * SINGLE_PHOTO_PRICE;
    return Math.round((pkgUpgrade + extraPrice) * 100) / 100;
  };

  const submitUpgrade = async (booking: Booking) => {
    if (!user) return;
    setSubmittingUpgrade(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-upgrade", {
        body: {
          booking_id: booking.id,
          new_package: upgradePackage || null,
          extra_single_photos: extraPhotos,
        },
      });
      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || "Upgrade fehlgeschlagen.");
      }
      toast.success("Upgrade-Anfrage erfolgreich gesendet! 🎉");
      setUpgradeBookingId(null);
      setUpgradePackage(null);
      setExtraPhotos(0);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Ein Fehler ist aufgetreten.");
    } finally {
      setSubmittingUpgrade(false);
    }
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
                const upgrades = bookingUpgrades[b.id] || [];
                const isUpgrading = upgradeBookingId === b.id;
                const upgradeOptions = getUpgradeOptions(b);
                const canUpgrade = b.status !== "cancelled" && (upgradeOptions.length > 0 || true); // always allow single photos

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

                        {/* Existing Upgrades */}
                        {upgrades.length > 0 && (
                          <div className="p-6 border-t border-border">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <ArrowUpCircle className="w-4 h-4 text-primary" /> Upgrades
                            </h4>
                            <div className="space-y-3">
                              {upgrades.map((u: any) => (
                                <div key={u.id} className="bg-secondary/10 rounded-lg p-4 border border-border/50">
                                  <div className="flex justify-between items-start">
                                    <div className="text-sm space-y-1">
                                      {u.previous_package !== u.new_package && (
                                        <p className="text-foreground">
                                          Paket: <span className="text-muted-foreground">{getPackageLabel(u.previous_package)}</span> → <span className="font-medium text-primary">{getPackageLabel(u.new_package)}</span>
                                          <span className="text-muted-foreground ml-2">({formatPrice(u.upgrade_price)})</span>
                                        </p>
                                      )}
                                      {u.extra_single_photos > 0 && (
                                        <p className="text-foreground">
                                          +{u.extra_single_photos} Einzelbilder <span className="text-muted-foreground">({formatPrice(u.extra_single_photos_price)})</span>
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="font-display font-bold text-primary">{formatPrice(u.total_upgrade_price)}</p>
                                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                        u.status === "confirmed" ? "bg-green-100 text-green-800" :
                                        u.status === "cancelled" ? "bg-red-100 text-red-700" :
                                        "bg-amber-100 text-amber-800"
                                      }`}>
                                        {u.status === "confirmed" ? "Bestätigt" : u.status === "cancelled" ? "Storniert" : "Ausstehend"}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Angefragt am {format(new Date(u.created_at), "dd.MM.yyyy", { locale: de })}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Upgrade Section */}
                        {canUpgrade && b.status !== "cancelled" && (
                          <div className="p-6 border-t border-border">
                            {!isUpgrading ? (
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  setUpgradeBookingId(b.id);
                                  setUpgradePackage(null);
                                  setExtraPhotos(0);
                                }}
                              >
                                <ArrowUpCircle className="w-4 h-4 mr-2" /> Bildpaket upgraden oder Einzelbilder hinzufügen
                              </Button>
                            ) : (
                              <div className="space-y-5">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <ArrowUpCircle className="w-4 h-4 text-primary" /> Upgrade anfragen
                                </h4>

                                {/* Package Upgrade */}
                                {upgradeOptions.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-foreground mb-2">Bildpaket upgraden</p>
                                    <p className="text-xs text-muted-foreground mb-3">
                                      Aktuelles Paket: <strong>{getPackageLabel(b.photo_package || "none")}</strong>
                                      {b.photo_package !== "none" && ` (${formatPrice(getPackagePrice(b.photo_package))})`}
                                      {" · "}Du zahlst nur die Differenz zum neuen Paket.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {upgradeOptions.map(pkg => {
                                        const diff = Math.max(0, pkg.price - getPackagePrice(b.photo_package || "none"));
                                        const isSelected = upgradePackage === pkg.value;
                                        return (
                                          <button
                                            key={pkg.value}
                                            onClick={() => setUpgradePackage(isSelected ? null : pkg.value)}
                                            className={`p-3 rounded-lg border-2 text-center transition-all text-sm ${
                                              isSelected
                                                ? "border-primary bg-primary/10"
                                                : "border-border bg-card hover:border-primary/40"
                                            }`}
                                          >
                                            <p className="font-bold text-foreground">{pkg.label}</p>
                                            <p className="text-xs text-muted-foreground line-through">{formatPrice(pkg.price)}</p>
                                            <p className="text-primary font-semibold">+{formatPrice(diff)}</p>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Extra Single Photos */}
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-2">Einzelbilder hinzufügen</p>
                                  <p className="text-xs text-muted-foreground mb-3">
                                    Jedes zusätzliche Bild kostet {formatPrice(SINGLE_PHOTO_PRICE)}.
                                  </p>
                                  <div className="flex items-center gap-4 bg-secondary/10 rounded-lg p-3">
                                    <button
                                      onClick={() => setExtraPhotos(Math.max(0, extraPhotos - 1))}
                                      className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                      <Minus className="w-4 h-4 text-foreground" />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-foreground text-lg">{extraPhotos}</span>
                                    <button
                                      onClick={() => setExtraPhotos(extraPhotos + 1)}
                                      className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                      <Plus className="w-4 h-4 text-foreground" />
                                    </button>
                                    {extraPhotos > 0 && (
                                      <span className="text-sm text-muted-foreground ml-2">
                                        = {formatPrice(extraPhotos * SINGLE_PHOTO_PRICE)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Summary & Submit */}
                                {(upgradePackage || extraPhotos > 0) && (
                                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                                    <p className="text-sm font-semibold text-foreground mb-2">Upgrade-Zusammenfassung</p>
                                    {upgradePackage && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                          {getPackageLabel(b.photo_package || "none")} → {getPackageLabel(upgradePackage)}
                                        </span>
                                        <span className="text-foreground font-medium">
                                          +{formatPrice(Math.max(0, getPackagePrice(upgradePackage) - getPackagePrice(b.photo_package || "none")))}
                                        </span>
                                      </div>
                                    )}
                                    {extraPhotos > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">+{extraPhotos} Einzelbilder</span>
                                        <span className="text-foreground font-medium">+{formatPrice(extraPhotos * SINGLE_PHOTO_PRICE)}</span>
                                      </div>
                                    )}
                                    <div className="border-t border-border mt-2 pt-2 flex justify-between">
                                      <span className="font-display font-bold text-foreground">Aufpreis gesamt</span>
                                      <span className="font-display font-bold text-primary">{formatPrice(calculateUpgradePrice(b))}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Alle Preise inkl. 19% MwSt.</p>
                                  </div>
                                )}

                                <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    💡 Das Upgrade ist eine <strong>Anfrage</strong>. Du zahlst jetzt nichts. Wir melden uns bei dir und senden eine Rechnung. Das Upgrade wird nach Zahlungseingang bestätigt.
                                  </p>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    variant="booking"
                                    disabled={submittingUpgrade || (!upgradePackage && extraPhotos <= 0)}
                                    onClick={() => submitUpgrade(b)}
                                  >
                                    {submittingUpgrade ? "Wird gesendet..." : "Upgrade anfragen (kostenlos)"}
                                  </Button>
                                  <Button variant="outline" onClick={() => { setUpgradeBookingId(null); setUpgradePackage(null); setExtraPhotos(0); }}>
                                    Abbrechen
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

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
