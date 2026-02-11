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

    let query = supabase
      .from("bookings")
      .select("booking_date, booking_time, duration")
      .neq("status", "cancelled");

    if (dateParam) {
      query = query.eq("booking_date", dateParam);
    } else {
      // Return slots for the next 90 days by default
      const today = new Date().toISOString().split("T")[0];
      query = query.gte("booking_date", today);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Only return date/time/duration - no PII
    const slots = (data || []).map((b: any) => ({
      date: b.booking_date,
      time: b.booking_time,
      duration: b.duration,
    }));

    return new Response(JSON.stringify(slots), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
