import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const buildWelcomeEmail = (firstName: string) => `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f0ebe4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ebe4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#f5f1ec;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px -8px rgba(46,38,33,0.1);">
  <tr><td style="background-color:#8a7261;padding:40px 40px 30px;text-align:center;">
    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;color:#f5f1ec;font-weight:700;letter-spacing:1px;">ASH FOTO</h1>
    <p style="margin:8px 0 0;font-size:13px;color:#c8b9a8;letter-spacing:3px;text-transform:uppercase;">Fotografie mit Herz</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Willkommen, ${firstName}!</h2>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
      Vielen Dank für deine Registrierung bei AshFoto. Ich freue mich, dass du da bist!
    </p>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
      Ab sofort kannst du deine Buchungen verwalten, deine Fotos herunterladen und exklusive Angebote erhalten.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:30px auto;"><tr>
      <td style="background-color:#8a7261;border-radius:8px;padding:14px 36px;">
        <a href="https://ashfoto.de" style="color:#f5f1ec;text-decoration:none;font-size:16px;font-weight:600;letter-spacing:0.5px;">Jetzt Shooting buchen</a>
      </td>
    </tr></table>
    <p style="margin:0;font-size:16px;line-height:1.7;color:#5c4f44;">
      Bei Fragen erreichst du mich jederzeit unter <a href="mailto:booking@ashfoto.de" style="color:#8a7261;text-decoration:underline;">booking@ashfoto.de</a>.
    </p>
    <p style="margin:24px 0 0;font-size:16px;color:#5c4f44;">Liebe Grüße,<br><strong style="color:#2e2621;">Ash</strong></p>
  </td></tr>
  <tr><td style="background-color:#e8e0d6;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#8a7261;">© ${new Date().getFullYear()} AshFoto · Alle Rechte vorbehalten</p>
    <p style="margin:6px 0 0;font-size:12px;color:#a89888;">Diese E-Mail wurde automatisch versendet.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

const buildBookingConfirmationEmail = (data: {
  firstName: string;
  service: string;
  date: string;
  time: string;
  totalPrice: string;
}) => `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f0ebe4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ebe4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#f5f1ec;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px -8px rgba(46,38,33,0.1);">
  <tr><td style="background-color:#8a7261;padding:40px 40px 30px;text-align:center;">
    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;color:#f5f1ec;font-weight:700;letter-spacing:1px;">ASH FOTO</h1>
    <p style="margin:8px 0 0;font-size:13px;color:#c8b9a8;letter-spacing:3px;text-transform:uppercase;">Buchungsbestätigung</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Danke für deine Buchung, ${data.firstName}!</h2>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#5c4f44;">
      Dein Shooting wurde erfolgreich gebucht. Hier sind die Details:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e0d6;border-radius:12px;margin:0 0 24px;">
      <tr><td style="padding:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;width:120px;">Shooting:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${data.service}</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Datum:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${data.date}</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Uhrzeit:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${data.time || 'Wird noch abgestimmt'}</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Gesamtpreis:</td><td style="padding:8px 0;font-size:16px;color:#2e2621;font-weight:700;">${data.totalPrice}</td></tr>
        </table>
      </td></tr>
    </table>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
      Ich werde mich in Kürze bei dir melden, um alle Details zu besprechen.
    </p>
    <p style="margin:0;font-size:16px;color:#5c4f44;">Liebe Grüße,<br><strong style="color:#2e2621;">Ash</strong></p>
  </td></tr>
  <tr><td style="background-color:#e8e0d6;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#8a7261;">© ${new Date().getFullYear()} AshFoto · Alle Rechte vorbehalten</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const anonClient = createClient(supabaseUrl, anonKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await anonClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, to, data } = await req.json();

    if (!to || !type) {
      return new Response(JSON.stringify({ error: "Missing 'to' or 'type'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Users can only send emails to their own email address
    if (to !== user.email) {
      return new Response(JSON.stringify({ error: "Can only send emails to your own address" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const host = Deno.env.get("SMTP_HOST");
    const port = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const smtpUser = Deno.env.get("SMTP_USER");
    const pass = Deno.env.get("SMTP_PASS");

    if (!host || !smtpUser || !pass) {
      throw new Error("SMTP credentials not configured");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: smtpUser, pass },
    });

    let subject: string;
    let html: string;

    switch (type) {
      case "welcome":
        subject = "Willkommen bei AshFoto! 📸";
        html = buildWelcomeEmail(data?.firstName || "");
        break;
      case "booking_confirmation":
        subject = "Deine Buchung bei AshFoto ✓";
        html = buildBookingConfirmationEmail(data);
        break;
      default:
        return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    await transporter.sendMail({
      from: `"AshFoto" <${smtpUser}>`,
      to,
      subject,
      html,
      text: "Bitte aktiviere HTML, um diese E-Mail zu sehen.",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
