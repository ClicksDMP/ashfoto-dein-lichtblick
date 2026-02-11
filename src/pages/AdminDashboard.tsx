import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { LogOut, Users, Calendar, Tag, Search, RefreshCw, CalendarDays } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import AdminCalendar from "@/components/admin/AdminCalendar";
import AdminClients from "@/components/admin/AdminClients";

type Booking = Tables<"bookings">;
type Offer = Tables<"offers"> & { used_at?: string | null; used_by_booking_id?: string | null; single_use?: boolean; photo_package_only?: boolean; source?: string | null };

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [newOffer, setNewOffer] = useState({ title: "", description: "", discount_percent: "", discount_amount: "", code: "", valid_until: "" });

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) {
      code += chars[array[i] % chars.length];
    }
    setNewOffer(p => ({ ...p, code }));
  };

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
      fetchOffers();
    }
  }, [isAdmin]);

  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (data) setBookings(data);
  };

  const fetchOffers = async () => {
    const { data } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
    if (data) setOffers(data);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchBookings();
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    await supabase.from("bookings").update(updates).eq("id", id);
    fetchBookings();
  };

  const deleteBooking = async (id: string) => {
    await supabase.from("bookings").delete().eq("id", id);
    fetchBookings();
  };

  const createOffer = async () => {
    if (!newOffer.title) return;
    await supabase.from("offers").insert({
      title: newOffer.title,
      description: newOffer.description,
      discount_percent: newOffer.discount_percent ? parseFloat(newOffer.discount_percent) : null,
      discount_amount: newOffer.discount_amount ? parseFloat(newOffer.discount_amount) : null,
      code: newOffer.code || null,
      valid_until: newOffer.valid_until || null,
    });
    setNewOffer({ title: "", description: "", discount_percent: "", discount_amount: "", code: "", valid_until: "" });
    fetchOffers();
  };

  const deleteOffer = async (id: string) => {
    await supabase.from("offers").delete().eq("id", id);
    fetchOffers();
  };

  const filteredBookings = bookings.filter(b =>
    `${b.first_name} ${b.last_name} ${b.email} ${b.service}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (p: number) => p.toFixed(2).replace(".", ",") + " €";

  if (loading) return <div className="dark min-h-screen flex items-center justify-center bg-background"><p className="text-foreground">Loading...</p></div>;

  return (
    <div className="dark min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")}>Go to Website</Button>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="w-4 h-4 mr-2" />Sign Out</Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <Tabs defaultValue="calendar">
          <TabsList className="mb-6">
            <TabsTrigger value="calendar" className="gap-2"><CalendarDays className="w-4 h-4" />Calendar</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2"><Calendar className="w-4 h-4" />Bookings</TabsTrigger>
            <TabsTrigger value="clients" className="gap-2"><Users className="w-4 h-4" />Clients</TabsTrigger>
            <TabsTrigger value="offers" className="gap-2"><Tag className="w-4 h-4" />Offers</TabsTrigger>
          </TabsList>

          {/* CALENDAR TAB */}
          <TabsContent value="calendar">
            <AdminCalendar
              bookings={bookings}
              onUpdateBooking={updateBooking}
              onDeleteBooking={deleteBooking}
              onCancelBooking={(id) => updateBookingStatus(id, "cancelled")}
            />
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <p className="text-sm text-muted-foreground">{filteredBookings.length} bookings</p>
            </div>
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="text-sm">{format(new Date(b.created_at), "MM/dd/yyyy")}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{b.first_name} {b.last_name}</p>
                          <p className="text-xs text-muted-foreground">{b.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{b.service}</TableCell>
                      <TableCell className="text-sm">
                        {b.booking_date ? format(new Date(b.booking_date), "MM/dd/yyyy") : "-"}{" "}
                        {b.booking_time || ""}
                      </TableCell>
                      <TableCell className="font-medium">{formatPrice(b.total_price)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          b.status === "confirmed" ? "bg-green-900/30 text-green-400" :
                          b.status === "cancelled" ? "bg-red-900/30 text-red-400" :
                          "bg-yellow-900/30 text-yellow-400"
                        }`}>{b.status}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => updateBookingStatus(b.id, "confirmed")}>✓</Button>
                          <Button size="sm" variant="ghost" onClick={() => updateBookingStatus(b.id, "cancelled")}>✗</Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                            if (confirm("Permanently delete this booking?")) deleteBooking(b.id);
                          }}>🗑</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBookings.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No bookings found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* CLIENTS TAB */}
          <TabsContent value="clients">
            <AdminClients bookings={bookings} />
          </TabsContent>

          {/* OFFERS TAB */}
          <TabsContent value="offers">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
                <h3 className="font-display text-xl font-bold text-foreground">Create New Offer</h3>
                <div>
                  <Label>Title</Label>
                  <Input value={newOffer.title} onChange={e => setNewOffer(p => ({ ...p, title: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={newOffer.description} onChange={e => setNewOffer(p => ({ ...p, description: e.target.value }))} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Discount %</Label>
                    <Input type="number" value={newOffer.discount_percent} onChange={e => setNewOffer(p => ({ ...p, discount_percent: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <Label>Discount € (Amount)</Label>
                    <Input type="number" value={newOffer.discount_amount} onChange={e => setNewOffer(p => ({ ...p, discount_amount: e.target.value }))} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Code</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={newOffer.code} onChange={e => setNewOffer(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="16-character code" className="font-mono tracking-wider" />
                    <Button type="button" variant="outline" size="icon" onClick={generateCode} title="Generate code">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Input type="date" value={newOffer.valid_until} onChange={e => setNewOffer(p => ({ ...p, valid_until: e.target.value }))} className="mt-1" />
                </div>
                <Button variant="booking" onClick={createOffer}>Create Offer</Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-foreground">Active Offers</h3>
                {offers.filter(o => o.source !== "welcome_discount").map(o => (
                  <div key={o.id} className="bg-card rounded-xl p-4 shadow-soft border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">{o.title}</p>
                        <p className="text-sm text-muted-foreground">{o.description}</p>
                        {o.code && <p className="text-sm font-mono mt-1 text-primary">Code: {o.code}</p>}
                        {o.discount_percent && <p className="text-sm text-primary">{o.discount_percent}% discount</p>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteOffer(o.id)}>✗</Button>
                    </div>
                  </div>
                ))}
                {offers.filter(o => o.source !== "welcome_discount").length === 0 && <p className="text-muted-foreground text-sm">No offers available</p>}
              </div>
            </div>

            {/* Welcome Codes Tracking */}
            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Welcome Codes (10% Discount)</h3>
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Created</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Used On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.filter(o => o.source === "welcome_discount").map(o => {
                      const isExpired = o.valid_until && new Date(o.valid_until) < new Date();
                      const isUsed = !!o.used_at;
                      const customer = bookings.find(b => b.user_id === o.target_user_id);
                      return (
                        <TableRow key={o.id}>
                          <TableCell className="text-sm">{format(new Date(o.created_at), "MM/dd/yyyy")}</TableCell>
                          <TableCell>
                            {customer ? (
                              <div>
                                <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                                <p className="text-xs text-muted-foreground">{customer.email}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">{o.target_user_id?.slice(0, 8)}...</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{o.code}</TableCell>
                          <TableCell className="text-sm">
                            {o.valid_until ? format(new Date(o.valid_until), "MM/dd/yyyy") : "-"}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isUsed ? "bg-green-900/30 text-green-400" :
                              isExpired ? "bg-red-900/30 text-red-400" :
                              "bg-yellow-900/30 text-yellow-400"
                            }`}>
                              {isUsed ? "Used" : isExpired ? "Expired" : "Active"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {o.used_at ? format(new Date(o.used_at), "MM/dd/yyyy") : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {offers.filter(o => o.source === "welcome_discount").length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No welcome codes issued</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
