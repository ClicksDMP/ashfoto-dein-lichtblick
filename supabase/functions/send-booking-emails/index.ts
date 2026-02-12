import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f0ebe4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ebe4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#f5f1ec;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px -8px rgba(46,38,33,0.1);">
  <tr><td style="background-color:#8a7261;padding:40px 40px 30px;text-align:center;">
    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;color:#f5f1ec;font-weight:700;letter-spacing:1px;">ASH FOTO</h1>
  </td></tr>
  <tr><td style="padding:40px;">
    ${content}
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

const bookingDetailsBlock = (d: { service: string; date: string; time: string; totalPrice: string }) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e0d6;border-radius:12px;margin:0 0 24px;">
  <tr><td style="padding:24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;width:120px;">Shooting:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${d.service}</td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Datum:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${d.date}</td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Uhrzeit:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${d.time || 'Wird noch abgestimmt'}</td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Gesamtpreis:</td><td style="padding:8px 0;font-size:16px;color:#2e2621;font-weight:700;">${d.totalPrice}</td></tr>
    </table>
  </td></tr>
</table>`;

const templates: Record<string, (data: any) => { subject: string; html: string }> = {
  booking_pending: (data) => ({
    subject: "Deine Buchung bei AshFoto – Eingang bestätigt ⏳",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Danke für deine Buchung, ${data.firstName}!</h2>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Deine Buchung ist bei uns eingegangen und wird gerade bearbeitet. <strong>Bitte beachte, dass dein Termin noch nicht bestätigt ist.</strong>
      </p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Wir werden uns in Kürze bei dir melden, um alle Details zu besprechen und den Termin zu bestätigen.
      </p>
      ${bookingDetailsBlock(data)}
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Du kannst den Status deiner Buchung jederzeit in deinem <a href="https://ashfoto.de/portal" style="color:#8a7261;text-decoration:underline;">Kundenportal</a> einsehen.
      </p>
    `),
  }),

  booking_confirmed: (data) => ({
    subject: "Dein Shooting ist bestätigt! ✅ AshFoto",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Dein Termin ist bestätigt, ${data.firstName}! 🎉</h2>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Ich freue mich auf dein Shooting! Hier sind nochmal alle Details:
      </p>
      ${bookingDetailsBlock(data)}
      <p style="margin:0 0 10px;font-size:16px;line-height:1.7;color:#5c4f44;font-weight:600;">So bereitest du dich am besten vor:</p>
      <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;line-height:1.8;color:#5c4f44;">
        <li>Stimme deine Outfits farblich ab (Erdtöne, Pastell)</li>
        <li>Sei ausgeruht und gut hydriert</li>
        <li>Sei pünktlich – damit wir die Shooting-Zeit voll nutzen können</li>
        <li>Entspann dich – die besten Bilder entstehen, wenn du du selbst bist!</li>
      </ul>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Bei Fragen erreichst du mich jederzeit unter <a href="mailto:booking@ashfoto.de" style="color:#8a7261;text-decoration:underline;">booking@ashfoto.de</a>.
      </p>
    `),
  }),

  reminder_3days: (data) => ({
    subject: "Noch 3 Tage bis zu deinem Shooting! 📸 AshFoto",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Dein Shooting ist in 3 Tagen, ${data.firstName}!</h2>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Nur noch ein paar Tage! Hier eine kleine Erinnerung:
      </p>
      ${bookingDetailsBlock(data)}
      <p style="margin:0 0 10px;font-size:16px;line-height:1.7;color:#5c4f44;font-weight:600;">Checkliste für dein Shooting:</p>
      <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;line-height:1.8;color:#5c4f44;">
        <li>✅ Outfits zusammenstellen und abstimmen</li>
        <li>✅ Accessoires bereithalten</li>
        <li>✅ Location vorbereiten (falls bei euch zuhause)</li>
        <li>✅ Genug Schlaf und Wasser am Vortag</li>
      </ul>
    `),
  }),

  reminder_1day: (data) => ({
    subject: "Morgen ist es soweit! 🎉 Dein Shooting bei AshFoto",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Morgen ist dein Shooting, ${data.firstName}!</h2>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Ich freue mich schon sehr auf morgen! Hier nochmal die Details:
      </p>
      ${bookingDetailsBlock(data)}
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Denk daran, entspannt und pünktlich zu sein – den Rest übernehme ich! 😊
      </p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:#5c4f44;">
        Bei kurzfristigen Fragen erreichst du mich unter <a href="tel:+4917670027200" style="color:#8a7261;text-decoration:underline;">+49 176 700 27 200</a>.
      </p>
    `),
  }),

  photos_ready: (data) => ({
    subject: "Deine Fotos sind fertig! 📸✨ AshFoto",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Deine Fotos sind da, ${data.firstName}! 🎉</h2>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Ich habe deine Fotos vom <strong>${data.service}</strong> fertig bearbeitet und sie sind jetzt bereit für dich!
      </p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Du kannst sie in deinem Kundenportal ansehen und herunterladen:
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:30px auto;"><tr>
        <td style="background-color:#8a7261;border-radius:8px;padding:14px 36px;">
          <a href="https://ashfoto.de/portal" style="color:#f5f1ec;text-decoration:none;font-size:16px;font-weight:600;letter-spacing:0.5px;">Fotos ansehen & herunterladen</a>
        </td>
      </tr></table>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Ich würde mich riesig über dein Feedback freuen! Du kannst direkt im Portal eine Bewertung hinterlassen. 💛
      </p>
    `),
  }),

  upgrade_requested: (data) => ({
    subject: "Dein Upgrade wurde angefragt! 📸 AshFoto",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2e2621;">Dein Upgrade, ${data.firstName}! 🎉</h2>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Deine Upgrade-Anfrage für dein <strong>${data.service}</strong> ist eingegangen.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e0d6;border-radius:12px;margin:0 0 24px;">
        <tr><td style="padding:24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;width:140px;">Bisheriges Paket:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${data.currentPackage}</td></tr>
            <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Neues Paket:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${data.newPackage}</td></tr>
            ${data.extraPhotos > 0 ? `<tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Einzelbilder:</td><td style="padding:8px 0;font-size:14px;color:#2e2621;">${data.extraPhotos} zusätzliche Fotos</td></tr>` : ''}
            <tr><td style="padding:8px 0;font-size:14px;color:#8a7261;font-weight:600;">Aufpreis:</td><td style="padding:8px 0;font-size:16px;color:#2e2621;font-weight:700;">${data.upgradePrice}</td></tr>
          </table>
        </td></tr>
      </table>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#5c4f44;">
        Wir melden uns bei dir zur Bestätigung und senden dir eine Rechnung. Die Buchung wird nach Zahlungseingang bestätigt.
      </p>
    `),
  }),
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { type, to, data } = await req.json();

    if (!to || !type || !templates[type]) {
      return new Response(JSON.stringify({ error: "Missing or invalid 'to'/'type'" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      host, port, secure: port === 465,
      auth: { user: smtpUser, pass },
    });

    const { subject, html } = templates[type](data);

    await transporter.sendMail({
      from: `"AshFoto" <${smtpUser}>`,
      to, subject, html,
      text: "Bitte aktiviere HTML, um diese E-Mail zu sehen.",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
