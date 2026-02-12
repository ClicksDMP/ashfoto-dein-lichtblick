import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const now = new Date();
    const in1Day = new Date(now);
    in1Day.setDate(in1Day.getDate() + 1);
    const in3Days = new Date(now);
    in3Days.setDate(in3Days.getDate() + 3);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    const formatDateDE = (dateStr: string) => {
      const [y, m, d] = dateStr.split("-");
      return `${d}.${m}.${y}`;
    };

    // Get confirmed bookings that need reminders
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .not("booking_date", "is", null);

    if (!bookings || bookings.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0;

    for (const booking of bookings) {
      const bookingDate = booking.booking_date;
      if (!bookingDate) continue;

      const emailData = {
        firstName: booking.first_name,
        service: booking.service,
        date: formatDateDE(bookingDate),
        time: booking.booking_time || "Wird noch abgestimmt",
        totalPrice: booking.total_price.toFixed(2).replace(".", ",") + " €",
      };

      // 3-day reminder
      if (bookingDate === formatDate(in3Days) && !booking.reminder_3d_sent) {
        try {
          const res = await fetch(`${supabaseUrl}/functions/v1/send-booking-emails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({
              type: "reminder_3days",
              to: booking.email,
              data: emailData,
            }),
          });
          if (res.ok) {
            await supabase.from("bookings").update({ reminder_3d_sent: true }).eq("id", booking.id);
            sent++;
          }
        } catch (e) {
          console.error(`3-day reminder failed for ${booking.id}:`, e);
        }
      }

      // 1-day reminder
      if (bookingDate === formatDate(in1Day) && !booking.reminder_1d_sent) {
        try {
          const res = await fetch(`${supabaseUrl}/functions/v1/send-booking-emails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({
              type: "reminder_1day",
              to: booking.email,
              data: emailData,
            }),
          });
          if (res.ok) {
            await supabase.from("bookings").update({ reminder_1d_sent: true }).eq("id", booking.id);
            sent++;
          }
        } catch (e) {
          console.error(`1-day reminder failed for ${booking.id}:`, e);
        }
      }
    }

    return new Response(JSON.stringify({ sent }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reminder error:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
