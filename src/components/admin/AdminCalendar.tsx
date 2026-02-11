import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;

interface BlockedSlot {
  id: string;
  blocked_date: string;
  blocked_time: string | null;
  reason: string | null;
}

interface AdminCalendarProps {
  bookings: Booking[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onDeleteBooking: (id: string) => void;
  onCancelBooking: (id: string) => void;
}

const DURATION_HOURS: Record<string, number> = {
  "30min": 0.5, "45min": 0.75, "1h": 1, "2h": 2, "4h": 4, "8h": 8,
};

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

const AdminCalendar = ({ bookings, onUpdateBooking, onDeleteBooking, onCancelBooking }: AdminCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    fetchBlockedSlots();
  }, []);

  const fetchBlockedSlots = async () => {
    const { data } = await supabase.from("blocked_slots").select("*").order("blocked_date", { ascending: true });
    if (data) setBlockedSlots(data as BlockedSlot[]);
  };

  const activeBookings = bookings.filter(b => b.status !== "cancelled");

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    activeBookings.forEach(b => { if (b.booking_date) dates.add(b.booking_date); });
    return dates;
  }, [activeBookings]);

  const blockedDates = useMemo(() => {
    const dates = new Set<string>();
    blockedSlots.filter(s => !s.blocked_time).forEach(s => dates.add(s.blocked_date));
    return dates;
  }, [blockedSlots]);

  const dayBookings = useMemo(() => {
    return activeBookings
      .filter(b => b.booking_date && isSameDay(parseISO(b.booking_date), selectedDate))
      .sort((a, b) => (a.booking_time || "").localeCompare(b.booking_time || ""));
  }, [activeBookings, selectedDate]);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const isDayBlocked = blockedDates.has(selectedDateStr);

  const dayBlockedTimes = useMemo(() => {
    return blockedSlots.filter(s => s.blocked_date === selectedDateStr && s.blocked_time);
  }, [blockedSlots, selectedDateStr]);

  const blockedTimeSet = useMemo(() => new Set(dayBlockedTimes.map(s => s.blocked_time!)), [dayBlockedTimes]);

  const occupiedSlots = useMemo(() => {
    const occupied = new Set<string>();
    dayBookings.forEach(b => {
      if (!b.booking_time) return;
      const hours = DURATION_HOURS[b.duration] || 1;
      const [h, m] = b.booking_time.split(":").map(Number);
      const startMinutes = h * 60 + m;
      const endMinutes = startMinutes + hours * 60;
      TIME_SLOTS.forEach(slot => {
        const [sh, sm] = slot.split(":").map(Number);
        const slotMin = sh * 60 + sm;
        if (slotMin >= startMinutes && slotMin < endMinutes) occupied.add(slot);
      });
    });
    return occupied;
  }, [dayBookings]);

  const handleBlockDay = async () => {
    await supabase.from("blocked_slots").insert({
      blocked_date: selectedDateStr,
      blocked_time: null,
      reason: blockReason || "Full day blocked",
    });
    setBlockReason("");
    fetchBlockedSlots();
  };

  const handleUnblockDay = async () => {
    await supabase.from("blocked_slots").delete().eq("blocked_date", selectedDateStr).is("blocked_time", null);
    fetchBlockedSlots();
  };

  const handleToggleSlot = async (slot: string) => {
    if (blockedTimeSet.has(slot)) {
      const blocked = dayBlockedTimes.find(s => s.blocked_time === slot);
      if (blocked) {
        await supabase.from("blocked_slots").delete().eq("id", blocked.id);
      }
    } else {
      await supabase.from("blocked_slots").insert({
        blocked_date: selectedDateStr,
        blocked_time: slot,
        reason: "Time slot blocked",
      });
    }
    fetchBlockedSlots();
  };

  const handleEditSave = () => {
    if (editingBooking) {
      onUpdateBooking(editingBooking.id, {
        booking_date: editDate || editingBooking.booking_date,
        booking_time: editTime || editingBooking.booking_time,
      });
      setEditingBooking(null);
    }
  };

  const statusColor = (status: string) => {
    if (status === "confirmed") return "bg-green-100 text-green-800";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-800";
  };

  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-8">
      {/* Calendar */}
      <div className="bg-card rounded-xl p-4 shadow-card self-start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => d && setSelectedDate(d)}
          locale={enUS}
          modifiers={{
            booked: (date) => bookedDates.has(format(date, "yyyy-MM-dd")),
            blocked: (date) => blockedDates.has(format(date, "yyyy-MM-dd")),
          }}
          modifiersClassNames={{
            booked: "!bg-primary/15 !font-bold !text-foreground",
            blocked: "!bg-red-100 !font-bold !text-red-700 line-through",
          }}
        />
        <div className="mt-3 space-y-1 text-xs text-muted-foreground px-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary/20 inline-block" />
            <span>Days with appointments</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive/20 inline-block" />
            <span>Blocked days</span>
          </div>
        </div>
      </div>

      {/* Day view */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-display text-xl font-bold text-foreground">
            {format(selectedDate, "EEEE, MMMM dd, yyyy", { locale: enUS })}
          </h3>
          <div className="flex gap-2">
            {isDayBlocked ? (
              <Button size="sm" variant="outline" onClick={handleUnblockDay}>
                <Unlock className="w-4 h-4 mr-1" /> Unblock Day
              </Button>
            ) : (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Reason (optional)"
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  className="w-40 h-8 text-sm"
                />
                <Button size="sm" variant="destructive" onClick={handleBlockDay}>
                  <Lock className="w-4 h-4 mr-1" /> Block Full Day
                </Button>
              </div>
            )}
          </div>
        </div>

        {isDayBlocked && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <p className="text-destructive font-medium text-sm">This day is fully blocked.</p>
          </div>
        )}

        {dayBookings.length === 0 && !isDayBlocked ? (
          <p className="text-muted-foreground text-sm">No appointments on this day.</p>
        ) : (
          <div className="space-y-3">
            {dayBookings.map(b => (
              <div key={b.id} className="bg-card rounded-xl p-4 shadow-soft border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-foreground">{b.booking_time || "–"}</span>
                      <span className="text-xs text-muted-foreground">({b.duration})</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                    </div>
                    <p className="font-medium text-foreground">{b.first_name} {b.last_name}</p>
                    <p className="text-sm text-muted-foreground">{b.service}</p>
                    <p className="text-xs text-muted-foreground">{b.email} · {b.phone}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditingBooking(b);
                      setEditDate(b.booking_date || "");
                      setEditTime(b.booking_time || "");
                    }}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => onUpdateBooking(b.id, { status: "confirmed" })}>✓</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onCancelBooking(b.id)}>✗</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                      if (confirm("Permanently delete this booking?")) onDeleteBooking(b.id);
                    }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Time slot overview */}
        <div className="mt-8">
          <h4 className="font-semibold text-foreground mb-1 text-sm">Time Slots Overview</h4>
          <p className="text-xs text-muted-foreground mb-3">Click a time slot to block or unblock it.</p>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {TIME_SLOTS.map(slot => {
              const isOccupied = occupiedSlots.has(slot);
              const isBlocked = blockedTimeSet.has(slot) || isDayBlocked;
              return (
                <button
                  key={slot}
                  onClick={() => !isOccupied && !isDayBlocked && handleToggleSlot(slot)}
                  disabled={isOccupied || isDayBlocked}
                  className={`text-center text-xs py-2 rounded-lg font-mono transition-colors ${
                    isOccupied
                      ? "bg-primary/10 text-primary font-bold cursor-not-allowed"
                      : isBlocked
                        ? "bg-red-100 text-red-700 line-through cursor-pointer hover:bg-red-200"
                        : "bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block border border-green-200" /> Available</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/10 inline-block border border-primary/20" /> Booked</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block border border-red-200" /> Blocked</div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBooking} onOpenChange={(open) => !open && setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          {editingBooking && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {editingBooking.first_name} {editingBooking.last_name} – {editingBooking.service}
              </p>
              <div>
                <Label>Date</Label>
                <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Time</Label>
                <Select value={editTime} onValueChange={setEditTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingBooking(null)}>Cancel</Button>
                <Button variant="booking" onClick={handleEditSave}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCalendar;
