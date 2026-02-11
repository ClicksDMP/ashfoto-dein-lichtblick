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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Validate JWT using getClaims
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;

    // Get full user for email_confirmed_at check
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if email is confirmed
    if (!user.email_confirmed_at) {
      return new Response(JSON.stringify({ error: "Email not confirmed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if welcome code already exists for this user
    const { data: existing } = await supabase
      .from("offers")
      .select("id")
      .eq("target_user_id", user.id)
      .eq("source", "welcome_discount")
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ already_exists: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user registered through booking flow (already got 10% directly)
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (existingBooking) {
      return new Response(JSON.stringify({ already_exists: true, reason: "registered_via_booking" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate 16-char code
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    for (let i = 0; i < 16; i++) {
      code += chars[arr[i] % chars.length];
    }

    // Valid for 1 month
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 1);

    // Get user profile for name
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, email")
      .eq("user_id", user.id)
      .maybeSingle();

    // Create the offer
    await supabase.from("offers").insert({
      title: "Willkommensrabatt 10%",
      description: "Dein persönlicher 10% Rabatt auf dein erstes Fotopaket!",
      discount_percent: 10,
      code,
      valid_until: validUntil.toISOString(),
      target_user_id: user.id,
      is_active: true,
      single_use: true,
      photo_package_only: true,
      source: "welcome_discount",
    });

    // Send welcome email with code
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "465");

    if (smtpHost && smtpUser && smtpPass) {
      const { default: nodemailer } = await import("npm:nodemailer@6.9.16");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const firstName = profile?.first_name || "";
      const formattedCode = `${code.slice(0,4)}-${code.slice(4,8)}-${code.slice(8,12)}-${code.slice(12,16)}`;
      const validDate = validUntil.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

      const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f0ebe4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ebe4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#f5f1ec;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px -8px rgba(46,38,33,0.1);">
  <tr><td style="background-color:#8a7261;padding:40px 40px 30px;text-align:center;">
    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;color:#f5f1ec;font-weight:700;letter-spacing:1px;">ASH FOTO</h1>
    <p style="margin:8px 0 0;font-size:13px;color:#c8b9a8;letter-spacing:3px;text-transform:uppercase;">E-Mail bestätigt!</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Willkommen, ${firstName}! 🎉</h2>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
      Deine E-Mail-Adresse wurde erfolgreich bestätigt. Als Dankeschön schenke ich dir einen <strong>10% Rabatt</strong> auf dein erstes Fotopaket!
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e0d6;border-radius:12px;margin:0 0 24px;">
      <tr><td style="padding:24px;text-align:center;">
        <p style="margin:0 0 8px;font-size:14px;color:#8a7261;font-weight:600;">Dein persönlicher Gutscheincode:</p>
        <p style="margin:0;font-family:'Courier New',monospace;font-size:28px;color:#2e2621;font-weight:700;letter-spacing:4px;">${formattedCode}</p>
        <p style="margin:12px 0 0;font-size:13px;color:#8a7261;">Gültig bis ${validDate}</p>
        <p style="margin:8px 0 0;font-size:12px;color:#a89888;">* Nur einmalig einlösbar auf Fotopakete</p>
      </td></tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="margin:20px auto;"><tr>
      <td style="background-color:#8a7261;border-radius:8px;padding:14px 36px;">
        <a href="https://ashfoto.de" style="color:#f5f1ec;text-decoration:none;font-size:16px;font-weight:600;letter-spacing:0.5px;">Jetzt Shooting buchen</a>
      </td>
    </tr></table>
    <p style="margin:24px 0 0;font-size:16px;color:#5c4f44;">Liebe Grüße,<br><strong style="color:#2e2621;">Ash</strong></p>
  </td></tr>
  <tr><td style="background-color:#e8e0d6;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#8a7261;">© ${new Date().getFullYear()} AshFoto · Alle Rechte vorbehalten</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

      await transporter.sendMail({
        from: `"AshFoto" <${smtpUser}>`,
        to: user.email,
        subject: "Dein 10% Willkommensrabatt wartet! 🎁",
        html,
        text: `Willkommen bei AshFoto! Dein 10% Gutscheincode: ${formattedCode} - Gültig bis ${validDate}`,
      });
    }

    return new Response(JSON.stringify({ success: true, code }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
