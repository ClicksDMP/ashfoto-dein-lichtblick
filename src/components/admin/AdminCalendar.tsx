import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO, addHours } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;

interface AdminCalendarProps {
  bookings: Booking[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onCancelBooking: (id: string) => void;
}

const DURATION_HOURS: Record<string, number> = {
  "30min": 0.5,
  "45min": 0.75,
  "1h": 1,
  "2h": 2,
  "4h": 4,
  "8h": 8,
};

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

const AdminCalendar = ({ bookings, onUpdateBooking, onCancelBooking }: AdminCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const activeBookings = bookings.filter(b => b.status !== "cancelled");

  // Dates that have bookings
  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    activeBookings.forEach(b => {
      if (b.booking_date) dates.add(b.booking_date);
    });
    return dates;
  }, [activeBookings]);

  // Bookings for selected date
  const dayBookings = useMemo(() => {
    return activeBookings
      .filter(b => b.booking_date && isSameDay(parseISO(b.booking_date), selectedDate))
      .sort((a, b) => (a.booking_time || "").localeCompare(b.booking_time || ""));
  }, [activeBookings, selectedDate]);

  // Check which time slots are occupied on the selected date
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
        if (slotMin >= startMinutes && slotMin < endMinutes) {
          occupied.add(slot);
        }
      });
    });
    return occupied;
  }, [dayBookings]);

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
    if (status === "cancelled") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-8">
      {/* Calendar */}
      <div className="bg-card rounded-xl p-4 shadow-card self-start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => d && setSelectedDate(d)}
          locale={de}
          modifiers={{
            booked: (date) => bookedDates.has(format(date, "yyyy-MM-dd")),
          }}
          modifiersClassNames={{
            booked: "bg-primary/20 font-bold text-primary",
          }}
        />
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground px-2">
          <span className="w-3 h-3 rounded-full bg-primary/20 inline-block" />
          <span>Tage mit Terminen</span>
        </div>
      </div>

      {/* Day view */}
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-4">
          {format(selectedDate, "EEEE, dd. MMMM yyyy", { locale: de })}
        </h3>

        {dayBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">Keine Termine an diesem Tag.</p>
        ) : (
          <div className="space-y-3">
            {dayBookings.map(b => (
              <div key={b.id} className="bg-card rounded-xl p-4 shadow-soft border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {b.booking_time || "–"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({b.duration})
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(b.status)}`}>
                        {b.status}
                      </span>
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
                    }}>
                      Bearbeiten
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onUpdateBooking(b.id, { status: "confirmed" })}>✓</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onCancelBooking(b.id)}>✗</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Time slot overview */}
        <div className="mt-8">
          <h4 className="font-semibold text-foreground mb-3 text-sm">Zeitfenster Übersicht</h4>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {TIME_SLOTS.map(slot => (
              <div
                key={slot}
                className={`text-center text-xs py-2 rounded-lg font-mono ${
                  occupiedSlots.has(slot)
                    ? "bg-destructive/10 text-destructive line-through"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBooking} onOpenChange={(open) => !open && setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Termin bearbeiten</DialogTitle>
          </DialogHeader>
          {editingBooking && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {editingBooking.first_name} {editingBooking.last_name} – {editingBooking.service}
              </p>
              <div>
                <Label>Datum</Label>
                <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Uhrzeit</Label>
                <Select value={editTime} onValueChange={setEditTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Zeit wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(t => (
                      <SelectItem key={t} value={t}>{t} Uhr</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingBooking(null)}>Abbrechen</Button>
                <Button variant="booking" onClick={handleEditSave}>Speichern</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCalendar;
