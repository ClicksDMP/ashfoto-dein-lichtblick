import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PHOTO_PACKAGES: Record<string, number> = {
  "10": 169.99, "15": 209.99, "20": 249.99, "30": 369.99, "40": 399.99, "all": 449.99,
};
const SINGLE_PHOTO_PRICE = 29.99;

const PACKAGE_ORDER = ["none", "10", "15", "20", "30", "40", "all"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const bookingId = body.booking_id;
    const newPackage = body.new_package || null;
    const extraSinglePhotos = Math.max(0, Math.min(50, parseInt(body.extra_single_photos) || 0));

    if (!bookingId) {
      return new Response(JSON.stringify({ error: "Booking ID fehlt." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get auth user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Nicht authentifiziert." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify user from token
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Nicht authentifiziert." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch booking
    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single();

    if (bErr || !booking) {
      return new Response(JSON.stringify({ error: "Buchung nicht gefunden." }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (booking.status === "cancelled") {
      return new Response(JSON.stringify({ error: "Stornierte Buchungen können nicht aufgewertet werden." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentPackage = booking.photo_package || "none";
    let upgradePackagePrice = 0;
    let newPackagePrice = 0;
    let previousPackagePrice = 0;

    // Calculate current package price (what they already paid for the package)
    if (currentPackage !== "none" && PHOTO_PACKAGES[currentPackage]) {
      previousPackagePrice = PHOTO_PACKAGES[currentPackage];
    }

    // Validate package upgrade (must be higher tier)
    if (newPackage && newPackage !== currentPackage) {
      const currentIdx = PACKAGE_ORDER.indexOf(currentPackage);
      const newIdx = PACKAGE_ORDER.indexOf(newPackage);
      if (newIdx <= currentIdx) {
        return new Response(JSON.stringify({ error: "Du kannst nur auf ein höheres Paket upgraden." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      newPackagePrice = PHOTO_PACKAGES[newPackage] || 0;
      upgradePackagePrice = Math.max(0, newPackagePrice - previousPackagePrice);
    }

    const extraPhotosPrice = extraSinglePhotos * SINGLE_PHOTO_PRICE;
    const totalUpgradePrice = Math.round((upgradePackagePrice + extraPhotosPrice) * 100) / 100;

    if (totalUpgradePrice <= 0) {
      return new Response(JSON.stringify({ error: "Kein Upgrade ausgewählt." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert upgrade record
    const { data: upgrade, error: uErr } = await supabase.from("booking_upgrades").insert({
      booking_id: bookingId,
      user_id: user.id,
      previous_package: currentPackage,
      previous_package_price: previousPackagePrice,
      new_package: newPackage || currentPackage,
      new_package_price: newPackage ? newPackagePrice : previousPackagePrice,
      upgrade_price: upgradePackagePrice,
      extra_single_photos: extraSinglePhotos,
      extra_single_photos_price: extraPhotosPrice,
      total_upgrade_price: totalUpgradePrice,
      status: "pending",
    }).select("id").single();

    if (uErr) {
      console.error("Upgrade insert error:", uErr);
      return new Response(JSON.stringify({ error: "Upgrade konnte nicht gespeichert werden." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send upgrade notification email to client
    try {
      const { emailWrapper, bookingDetailsBlock } = await getEmailHelpers();
      // We'll use the send-booking-emails function for this
      await supabase.functions.invoke("send-booking-emails", {
        body: {
          type: "upgrade_requested",
          to: booking.email,
          data: {
            firstName: booking.first_name,
            service: booking.service,
            currentPackage: getPackageLabel(currentPackage),
            newPackage: newPackage ? getPackageLabel(newPackage) : getPackageLabel(currentPackage),
            extraPhotos: extraSinglePhotos,
            upgradePrice: totalUpgradePrice.toFixed(2).replace(".", ",") + " €",
          },
        },
      });
    } catch (e) {
      console.error("Upgrade email failed:", e);
    }

    return new Response(JSON.stringify({
      success: true,
      id: upgrade.id,
      total_upgrade_price: totalUpgradePrice,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Create upgrade error:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getPackageLabel(value: string): string {
  const labels: Record<string, string> = {
    "none": "Ohne Paket",
    "10": "10 Bilder",
    "15": "15 Bilder",
    "20": "20 Bilder",
    "30": "30 Bilder",
    "40": "40 Bilder",
    "all": "Alle Fotos",
  };
  return labels[value] || value;
}

async function getEmailHelpers() {
  return { emailWrapper: null, bookingDetailsBlock: null };
}
