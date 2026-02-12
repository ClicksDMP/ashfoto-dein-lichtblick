import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Pricing definitions (server-side source of truth)
const STANDARD_DURATIONS: Record<string, number> = {
  "1h": 99.99, "2h": 199.99, "4h": 399.99, "8h": 799.99,
};
const MINI_DURATIONS: Record<string, number> = {
  "30min": 49.99, "45min": 69.99,
};
const PHOTO_PACKAGES: Record<string, number> = {
  "10": 169.99, "15": 209.99, "20": 249.99, "30": 369.99, "40": 399.99, "all": 449.99,
};

const VALID_SERVICES = [
  "Familien Fotoshooting", "Baby Fotoshooting", "Newborn Fotoshooting",
  "Babybauch Fotoshooting", "Kinder Fotoshooting", "Freunde Fotoshooting",
  "Paar Fotoshooting", "Akt und Erotik Fotoshooting", "Männer Fotoshooting",
  "Beauty und Portrait Fotoshooting", "Mini Shooting", "Tier Fotoshooting",
  "Hochzeitsfotografie", "Mitarbeiterfotos", "Live und Event Fotografie",
  "Messe Fotografie",
];

const RESTRICTED_DURATION_SERVICES = ["Live und Event Fotografie", "Messe Fotografie", "Hochzeitsfotografie"];
const ALL_FOTOS_REQUIRED = ["Live und Event Fotografie", "Messe Fotografie"];
const BABYBAUCH_KOMBI_PRICE = 49.99;

// Deal definitions (server-side source of truth)
const VALID_DEALS: Record<string, { service: string; duration: string; photoPackage: string; fixedPrice: number; validUntil: string }> = {
  "valentinstag-200": { service: "Paar Fotoshooting", duration: "1h", photoPackage: "10", fixedPrice: 199.99, validUntil: "2026-03-14" },
  "valentinstag-250": { service: "Paar Fotoshooting", duration: "1h", photoPackage: "15", fixedPrice: 249.99, validUntil: "2026-03-14" },
};

function sanitize(str: string, maxLen = 500): string {
  return String(str || "").trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

function generateCouponCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => chars[b % chars.length]).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Extract and sanitize inputs
    const service = sanitize(body.service, 100);
    const duration = sanitize(body.duration, 10);
    const photoPackage = sanitize(body.photo_package, 10);
    const babybaumKombi = !!body.babybauch_kombi;
    const bookingDate = body.booking_date ? sanitize(body.booking_date, 10) : null;
    const bookingTime = body.booking_time ? sanitize(body.booking_time, 5) : null;
    const firstName = sanitize(body.first_name, 100);
    const lastName = sanitize(body.last_name, 100);
    const email = sanitize(body.email, 255);
    const phone = sanitize(body.phone, 30);
    const street = sanitize(body.street, 200);
    const zip = sanitize(body.zip, 10);
    const city = sanitize(body.city, 100);
    const notes = sanitize(body.notes, 2000);
    const participants = body.participants || {};
    const couponId = body.coupon_id || null;
    const userId = body.user_id || null;
    const welcomeDiscount = !!body.welcome_discount;
    const modelRelease = !!body.model_release;
    const dealId = body.deal_id ? sanitize(body.deal_id, 50) : null;
    const dealModelReleaseCoupon = !!body.deal_model_release_coupon;

    // Validate required fields
    if (!firstName || !email || !service || !duration) {
      return new Response(JSON.stringify({ error: "Pflichtfelder fehlen (Name, E-Mail, Service, Dauer)." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Ungültige E-Mail-Adresse." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate service
    if (!VALID_SERVICES.includes(service)) {
      return new Response(JSON.stringify({ error: "Ungültiger Service." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let totalPrice: number;
    let durationPrice: number;
    let packagePrice: number;

    // ── Deal mode ──────────────────────────────────────────────
    if (dealId) {
      const deal = VALID_DEALS[dealId];
      if (!deal) {
        return new Response(JSON.stringify({ error: "Ungültiger Deal." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Check deal expiry
      if (new Date(deal.validUntil) < new Date()) {
        return new Response(JSON.stringify({ error: "Dieser Deal ist abgelaufen." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Validate service/duration/package match the deal
      if (service !== deal.service || duration !== deal.duration || photoPackage !== deal.photoPackage) {
        return new Response(JSON.stringify({ error: "Deal-Daten stimmen nicht überein." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      totalPrice = deal.fixedPrice;
      durationPrice = STANDARD_DURATIONS[deal.duration] || 0;
      packagePrice = PHOTO_PACKAGES[deal.photoPackage] || 0;

    } else {
      // ── Regular mode ────────────────────────────────────────
      const isMini = service === "Mini Shooting";
      const isRestricted = RESTRICTED_DURATION_SERVICES.includes(service);
      const durations = isMini ? MINI_DURATIONS : STANDARD_DURATIONS;
      durationPrice = durations[duration];
      if (durationPrice === undefined) {
        return new Response(JSON.stringify({ error: "Ungültige Dauer." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (isRestricted && !["2h", "4h", "8h"].includes(duration)) {
        return new Response(JSON.stringify({ error: "Ungültige Dauer für diesen Service." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate photo package
      packagePrice = 0;
      if (photoPackage === "none" || photoPackage === "") {
        packagePrice = 0;
      } else {
        const requiresAllFotos = ALL_FOTOS_REQUIRED.includes(service);
        if (requiresAllFotos && photoPackage !== "all") {
          return new Response(JSON.stringify({ error: "Dieser Service erfordert das 'Alle Fotos' Paket." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const pp = PHOTO_PACKAGES[photoPackage];
        if (pp === undefined) {
          return new Response(JSON.stringify({ error: "Ungültiges Fotopaket." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        packagePrice = pp;
      }

      totalPrice = durationPrice + packagePrice;
      const isBabybauch = service === "Babybauch Fotoshooting";
      if (isBabybauch && babybaumKombi) {
        totalPrice += BABYBAUCH_KOMBI_PRICE;
      }

      // Apply model release discount (up to 99.99 off duration price) - only for regular bookings
      if (modelRelease) {
        const modelDiscount = Math.min(99.99, durationPrice);
        totalPrice -= modelDiscount;
      }

      // Apply welcome 10% discount on photo package for new registrations
      if (welcomeDiscount && photoPackage !== "none" && photoPackage !== "" && !couponId) {
        totalPrice -= packagePrice * 0.1;
      }
    }

    // Validate date format if provided
    if (bookingDate && !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
      return new Response(JSON.stringify({ error: "Ungültiges Datumsformat." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate time format if provided
    if (bookingTime && !/^\d{2}:\d{2}$/.test(bookingTime)) {
      return new Response(JSON.stringify({ error: "Ungültiges Zeitformat." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate participants
    const validParticipants = {
      adults: Math.max(0, Math.min(20, parseInt(participants.adults) || 0)),
      children: Math.max(0, Math.min(20, parseInt(participants.children) || 0)),
      babies: Math.max(0, Math.min(20, parseInt(participants.babies) || 0)),
      animals: Math.max(0, Math.min(20, parseInt(participants.animals) || 0)),
    };

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Apply coupon if provided (works for both deal and regular)
    if (couponId) {
      let couponQuery = supabase
        .from("offers")
        .select("id, discount_percent, discount_amount, is_active, single_use, used_at, valid_until, photo_package_only, target_user_id")
        .eq("id", couponId)
        .eq("is_active", true);

      // Only allow targeted coupons for the intended user
      if (userId) {
        couponQuery = couponQuery.or(`target_user_id.is.null,target_user_id.eq.${userId}`);
      } else {
        couponQuery = couponQuery.is("target_user_id", null);
      }

      const { data: coupon } = await couponQuery.maybeSingle();

      if (coupon) {
        if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
          // expired, ignore
        } else if (coupon.single_use && coupon.used_at) {
          // already used, ignore
        } else {
          if (dealId) {
            // For deals, apply coupon to total price directly
            if (coupon.discount_percent) {
              totalPrice = totalPrice * (1 - coupon.discount_percent / 100);
            }
            if (coupon.discount_amount) {
              totalPrice = Math.max(0, totalPrice - coupon.discount_amount);
            }
          } else {
            // Regular mode coupon logic
            if (coupon.photo_package_only && photoPackage !== "none" && photoPackage !== "") {
              if (coupon.discount_percent) {
                totalPrice -= packagePrice * (coupon.discount_percent / 100);
              }
              if (coupon.discount_amount) {
                totalPrice = Math.max(0, totalPrice - coupon.discount_amount);
              }
            } else if (!coupon.photo_package_only) {
              if (coupon.discount_percent) {
                totalPrice = totalPrice * (1 - coupon.discount_percent / 100);
              }
              if (coupon.discount_amount) {
                totalPrice = Math.max(0, totalPrice - coupon.discount_amount);
              }
            }
          }
        }
      }
    }

    // Ensure price is not negative
    totalPrice = Math.max(0, Math.round(totalPrice * 100) / 100);

    // Insert booking
    const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert({
      user_id: userId,
      service,
      participants: validParticipants,
      duration,
      duration_price: dealId ? durationPrice : durationPrice,
      photo_package: photoPackage || "none",
      package_price: dealId ? packagePrice : packagePrice,
      babybauch_kombi: babybaumKombi,
      booking_date: bookingDate,
      booking_time: bookingTime,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      street,
      zip,
      city,
      notes,
      total_price: totalPrice,
      model_release: modelRelease,
    }).select("id").single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return new Response(JSON.stringify({ error: "Buchung konnte nicht gespeichert werden." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark coupon as used if applicable
    if (couponId && bookingData) {
      await supabase.rpc("mark_coupon_used", {
        _offer_id: couponId,
        _booking_id: bookingData.id,
      });
    }

    // Generate model release coupon for deal bookings
    let generatedCouponCode: string | null = null;
    if (dealId && dealModelReleaseCoupon && bookingData) {
      const code = generateCouponCode();
      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + 6);

      await supabase.from("offers").insert({
        title: "Model-Release Gutschein (Deal)",
        description: `Gutschein aus Deal-Buchung: 99,99 € auf Shooting-Zeit. Gültig 6 Monate.`,
        discount_amount: 99.99,
        code,
        valid_until: validUntil.toISOString(),
        single_use: true,
        is_active: true,
        photo_package_only: false,
        target_user_id: userId,
        source: "deal_model_release",
      });
      generatedCouponCode = code;
    }

    return new Response(JSON.stringify({
      success: true,
      id: bookingData.id,
      total_price: totalPrice,
      coupon_code: generatedCouponCode,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
