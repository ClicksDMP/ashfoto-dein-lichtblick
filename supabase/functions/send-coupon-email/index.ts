import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

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
    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await anonClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { to, firstName, code, discountPercent, description, validUntil } = await req.json();

    if (!to || !code || !discountPercent) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "465");

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error("SMTP credentials not configured");
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const formattedCode = `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`;
    const validDate = validUntil
      ? new Date(validUntil).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })
      : "30 Tage";

    const greeting = firstName ? `Hallo ${firstName}!` : "Hallo!";
    const messageText = description || `${discountPercent}% Rabatt auf deine Shooting-Zeit`;

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
    <p style="margin:8px 0 0;font-size:13px;color:#c8b9a8;letter-spacing:3px;text-transform:uppercase;">Exklusiver Gutschein</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">${greeting} 🎁</h2>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
      ${messageText}
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e0d6;border-radius:12px;margin:0 0 24px;">
      <tr><td style="padding:24px;text-align:center;">
        <p style="margin:0 0 8px;font-size:14px;color:#8a7261;font-weight:600;">Dein persönlicher Gutscheincode:</p>
        <p style="margin:0;font-family:'Courier New',monospace;font-size:28px;color:#2e2621;font-weight:700;letter-spacing:4px;">${formattedCode}</p>
        <p style="margin:12px 0 0;font-size:16px;color:#2e2621;font-weight:700;">${discountPercent}% Rabatt auf deine Shooting-Zeit</p>
        <p style="margin:8px 0 0;font-size:13px;color:#8a7261;">Gültig bis ${validDate}</p>
        <p style="margin:8px 0 0;font-size:12px;color:#a89888;">* Einmalig einlösbar</p>
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
      to,
      subject: `Dein ${discountPercent}% Gutschein von AshFoto 🎁`,
      html,
      text: `${greeting} ${messageText} - Dein Gutscheincode: ${formattedCode} - Gültig bis ${validDate}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Send coupon email error:", error);
    return new Response(
      JSON.stringify({ error: "E-Mail konnte nicht gesendet werden." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
