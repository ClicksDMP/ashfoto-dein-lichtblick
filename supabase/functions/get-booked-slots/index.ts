import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");

    // Fetch booked slots
    let bookingQuery = supabase
      .from("bookings")
      .select("booking_date, booking_time, duration")
      .neq("status", "cancelled");

    if (dateParam) {
      bookingQuery = bookingQuery.eq("booking_date", dateParam);
    } else {
      const today = new Date().toISOString().split("T")[0];
      bookingQuery = bookingQuery.gte("booking_date", today);
    }

    const { data: bookingsData, error: bookingsError } = await bookingQuery;
    if (bookingsError) throw bookingsError;

    // Fetch blocked slots
    let blockedQuery = supabase.from("blocked_slots").select("blocked_date, blocked_time");
    if (dateParam) {
      blockedQuery = blockedQuery.eq("blocked_date", dateParam);
    } else {
      const today = new Date().toISOString().split("T")[0];
      blockedQuery = blockedQuery.gte("blocked_date", today);
    }

    const { data: blockedData, error: blockedError } = await blockedQuery;
    if (blockedError) throw blockedError;

    const slots = (bookingsData || []).map((b: any) => ({
      date: b.booking_date,
      time: b.booking_time,
      duration: b.duration,
      type: "booking",
    }));

    const blocked = (blockedData || []).map((b: any) => ({
      date: b.blocked_date,
      time: b.blocked_time, // null = whole day blocked
      type: "blocked",
    }));

    return new Response(JSON.stringify({ slots, blocked }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
