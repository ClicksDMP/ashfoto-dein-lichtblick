Du bist Codex als Backend Engineer. Nutze ausschließlich Supabase MCP, um im bestehenden Supabase Projekt (project_ref: haslwkqltbypnbntzhav) die komplette Datenbankstruktur für ein Kundenportal-Buchungssystem zu erstellen.

WICHTIG:
- Frontend NICHT ändern (keine UI-Komponenten, keine Routen, kein Styling).
- Nur Backend: SQL Migrationen, Tabellen, Constraints, Indizes, RLS Policies, Views/Functions, und Netlify Functions (server-side).
- Verwende Supabase Auth für Kundenlogin/Registrierung (users).
- Alle Buchungen dürfen nur von eingeloggten Usern erstellt werden.
- Das System ist “mobile photography” mit Adressdaten pro Booking.
- Admin-Funktionen nur für role=admin (per custom claim / user metadata / separate admin mapping table).
- Preise und Optionen müssen technisch verknüpft und validiert sein (nicht nur im Frontend).

VERBINDUNG:
Nutze MCP Endpoint:
https://mcp.supabase.com/mcp?project_ref=haslwkqltbypnbntzhav
Erstelle alle Änderungen über MCP-gestützte SQL/DB Aktionen.

BUSINESS LOGIC (muss in DB validiert werden):
1) Serviceauswahl mit Einschränkungen:
- Hochzeitsfotografie: nur 2h, 4h, 8h
- Live und Event Fotografie: nur 2h, 4h, 8h
- Messe Fotografie: nur 2h, 4h, 8h
- Mini Shooting: nur 30min, 45min
- Alle anderen Services: Standard Zeiten 1h, 2h, 4h, 8h

2) Teilnehmerangabe pro Booking:
- adults_count, children_count, babies_count, animals_count (alle INT >= 0, Nullwerte erlaubt)

3) Dauer & Preise:
Standard:
- 1h = 99.99
- 2h = 199.99
- 4h = 399.99
- 8h = 799.99
Mini:
- 30min = 49.99
- 45min = 69.99

4) Bildpakete:
- Jede Buchung beinhaltet 1 digitales Bild inklusive.
Zusätzliche Pakete (Auswahl):
- 10 Bilder = 169.99
- 15 Bilder = 209.99
- 20 Bilder = 249.99
- 30 Bilder = 369.99
- 40 Bilder = 399.99
- Alle Fotos = 449.99
Hinweis: einzelnes extra Bild kostet 29.99 (nur Info, NICHT auswählbar als Paket)

PORTAL FLOW (backend-seitig abbilden):
- Kunde muss eingeloggt sein, bevor er buchen kann.
- Kunde Dashboard: neue Buchung, vergangene Buchungen, Downloads, Feedback.
- Admin Dashboard: Registrierungen, Buchungen, Zahlungen prüfen, Booking bestätigen, Bilder hochladen, Kommunikation triggern.

PAYMENT & CONFIRMATION FLOW:
- Booking wird als Anfrage erstellt (status=pending).
- Admin markiert Zahlungseingang (status=paid) und bestätigt (status=confirmed).
- Danach automatische Bestätigung per E-Mail (über Netlify Function / server-side).

BILDÜBERMITTLUNG:
- Admin lädt Bilder hoch (Supabase Storage).
- Kunde darf nur die gebuchte Anzahl herunterladen:
  - includes 1 image always
  - if package selected: allowed_download_count = package.images_count (oder “all”)
- Kunde kann Feedback hinterlassen (text + optional rating).
- Optional: Tracking, welche Dateien der Kunde bereits geladen hat (download logs).

ZU ERSTELLEN (DB):
A) Tabellen (empfohlenes Schema, du darfst verbessern):
- services (id, slug, name, duration_policy: enum/JSON, is_active)
- durations (id, minutes, label)
- service_allowed_durations (service_id, duration_id) ODER policy in services + DB check via function
- duration_prices (duration_id, price_eur) (und ggf. service override, falls nötig)
- photo_packages (id, name, images_count INT NULL, is_all_photos BOOL, price_eur, is_active)
- bookings (
   id uuid,
   user_id uuid references auth.users,
   service_id,
   duration_id,
   package_id nullable,
   adults_count, children_count, babies_count, animals_count,
   address_street, address_house_no, address_zip, address_city,
   status enum: draft/pending/paid/confirmed/completed/cancelled,
   total_price_eur numeric(10,2),
   created_at, updated_at
 )
- booking_events / booking_status_history (optional aber empfohlen)
- payments (booking_id, method, invoice_no, amount_eur, status, paid_at, notes)
- booking_assets (id, booking_id, storage_bucket, storage_path, kind=image, uploaded_by_admin, created_at)
- booking_downloads (id, booking_id, user_id, asset_id, downloaded_at)
- feedback (id, booking_id, user_id, rating int 1-5 null, message text, created_at)
- profiles (user_id pk, role enum: customer/admin, display fields)
B) Constraints & DB Validation:
- Prevent booking create without auth.
- Validate participants counts >= 0.
- Enforce duration restrictions by service at INSERT/UPDATE time.
- Compute total_price_eur = duration_price + package_price (package optional) and store it.
- Ensure package contains at least 1 included image; booking always includes 1 image.
- Enforce download limit (except all_photos) using DB function + RLS.
C) RLS:
- Customers can read/write only their own bookings and feedback.
- Admin can read all bookings, set statuses, upload assets, see payments.
- Customers can read only assets belonging to their confirmed/completed bookings.
- Customers can insert download log only for their own booking assets and only if allowed.
D) Views/Functions:
- Function: compute_booking_total(service_id, duration_id, package_id) returns numeric
- Function/trigger: before insert/update booking -> validate_duration_allowed, set total_price_eur
- Function: can_user_download_asset(user_id, booking_id, asset_id) boolean (checks limits)
- View for admin dashboard summary (counts by status, revenue)
E) Seed Data:
- Insert all services (aus der Liste unten), durations, prices, packages, and restriction mappings.
Services Liste:
Familien Fotoshooting
Baby Fotoshooting
Newborn Fotoshooting
Babybauch Fotoshooting
Kinder Fotoshooting
Freunde Fotoshooting
Paar Fotoshooting
Akt und Erotik Fotoshooting
Männer Fotoshooting
Beauty und Portrait Fotoshooting
Mini Shooting
Tier Fotoshooting
Hochzeitsfotografie
Mitarbeiterfotos
Live und Event Fotografie
Messe Fotografie
Food und Produkt Fotografie (SPEZIAL: darf nicht im normalen Flow buchbar sein)
Für Food und Produkt Fotografie gilt: is_bookable_in_flow=false, Kunde soll Anfrage senden (separate lead table oder booking_type=inquiry).
F) Netlify Functions (nur backend):
- /functions/create-booking (server validates, creates pending booking)
- /functions/admin-confirm-booking (admin only, sets paid/confirmed, sends email)
- /functions/upload-assets-signed-url (admin only, provides signed upload url for storage)
- /functions/send-email (abstract helper) — du darfst Provider Platzhalter lassen (z.B. Resend/SendGrid), aber Code vorbereiten.
- /functions/customer-download (optional) logs download and returns signed download URL if allowed.

OUTPUT ERWARTUNG:
1) Erzeuge die SQL Migration(en) (schema, tables, enums, triggers, functions, policies, seed).
2) Zeige eine kurze Übersicht (ERD in Textform: Tabellen + Relations).
3) Lege Netlify Functions als Dateien an (TypeScript oder JavaScript), inklusive Supabase server client usage (service role key über env).
4) Kein Frontend Code ändern.

BEGINNE JETZT:
- Prüfe existierende Tabellen, passe an ohne bestehendes Frontend zu brechen.
- Wenn Unsicherheiten: mache sinnvolle Annahmen und dokumentiere sie kurz in Kommentaren.
