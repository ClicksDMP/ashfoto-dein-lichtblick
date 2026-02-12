import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AGB = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 md:px-12 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Ashraf AlSalaita,
              Clicks DMP – Design &amp; Media Production, Karl-Traub-Straße 15, 68199 Mannheim (nachfolgend
              „Fotograf") und dem Auftraggeber (nachfolgend „Kunde") über Fotoshootings und damit verbundene
              Dienstleistungen, die über die Website ashfoto.de gebucht werden.
            </p>
            <p className="mt-2">
              Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Fotograf stimmt
              ihrer Geltung ausdrücklich schriftlich zu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 2 Vertragsgegenstand</h2>
            <p>
              Gegenstand des Vertrags ist die Durchführung eines Fotoshootings sowie – je nach gewähltem
              Bildpaket – die digitale Bereitstellung der bearbeiteten Bilder. Art, Umfang, Termin, Ort
              und Preis ergeben sich aus der Buchungsbestätigung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 3 Vertragsschluss</h2>
            <p>
              Die Darstellung der Leistungen auf der Website stellt kein verbindliches Angebot dar. Durch
              das Absenden der Buchung gibt der Kunde ein verbindliches Angebot ab. Der Vertrag kommt
              zustande, wenn der Fotograf die Buchung telefonisch oder per E-Mail bestätigt. Die Buchung
              erhält zunächst den Status „ausstehend" und wird nach persönlicher Kontaktaufnahme durch den
              Fotografen bestätigt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 4 Preise und Zahlung</h2>
            <p>
              Alle angegebenen Preise sind Endpreise und verstehen sich inklusive der gesetzlichen
              Mehrwertsteuer von 19%.
            </p>
            <p className="mt-2">
              Die Zahlung erfolgt spätestens am Tag des Shootings, sofern keine abweichende Vereinbarung
              getroffen wurde. Akzeptierte Zahlungsmittel werden bei Buchungsbestätigung mitgeteilt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 5 Terminvereinbarung und Stornierung</h2>
            <p>
              Gebuchte Termine können bis zu <strong>48 Stunden</strong> vor dem vereinbarten Termin
              kostenfrei storniert oder verschoben werden. Bei späterer Stornierung oder Nichterscheinen
              wird der volle Betrag für die gebuchte Shooting-Dauer berechnet.
            </p>
            <p className="mt-2">
              Der Fotograf behält sich vor, Termine bei höherer Gewalt (z.&nbsp;B. Krankheit, extreme
              Wetterbedingungen bei Outdoor-Shootings) kostenfrei zu verschieben.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 6 Leistungserbringung und Lieferung</h2>
            <p>
              Die bearbeiteten Bilder werden dem Kunden innerhalb von 14 Werktagen nach dem Shooting
              digital über das Kundenportal zur Verfügung gestellt. Der Kunde wird per E-Mail benachrichtigt,
              sobald die Bilder zum Download bereitstehen. Der Fotograf ist bemüht, diesen Zeitrahmen
              einzuhalten, kann jedoch keine Garantie dafür übernehmen.
            </p>
            <p className="mt-2">
              Nicht genutzte Shooting-Zeit kann innerhalb von 6 Monaten für ein weiteres Shooting
              verwendet werden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 7 Urheberrecht und Nutzungsrechte</h2>
            <p>
              Das Urheberrecht an allen Fotografien verbleibt beim Fotografen gemäß dem Urheberrechtsgesetz
              (UrhG). Der Kunde erhält mit vollständiger Bezahlung ein einfaches, nicht übertragbares
              Nutzungsrecht für den privaten Gebrauch.
            </p>
            <p className="mt-2">
              Eine gewerbliche Nutzung bedarf der vorherigen schriftlichen Zustimmung des Fotografen und
              kann zusätzliche Kosten verursachen.
            </p>
            <p className="mt-2">
              Der Fotograf behält sich das Recht vor, die Bilder (sofern nicht ausdrücklich untersagt)
              zu Referenzzwecken (Portfolio, Website, Social Media) zu verwenden.
            </p>
          </section>

          <section id="model-release">
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 8 Model-Release-Vereinbarung und Rabatt</h2>
            <p>
              Der Kunde hat die Möglichkeit, dem Fotografen im Rahmen der Buchung eine erweiterte
              Nutzungserlaubnis für die im Shooting entstandenen Fotos zu erteilen
              („Model-Release-Vereinbarung").
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">8.1 Umfang der Nutzungsrechte</h3>
            <p>
              Mit der Model-Release-Vereinbarung räumt der Kunde dem Fotografen das unwiderrufliche,
              zeitlich und örtlich unbeschränkte Recht ein, die Fotos für folgende Zwecke zu nutzen:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Portfolio und Website des Fotografen (ashfoto.de)</li>
              <li>Social-Media-Kanäle (Instagram, Facebook, TikTok, Pinterest u.&nbsp;a.)</li>
              <li>Bezahlte Werbeanzeigen (Online und Print)</li>
              <li>Druck- und Online-Marketingmaterialien</li>
              <li>Messe- und Ausstellungszwecke</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">8.2 Gegenleistung</h3>
            <p>
              Als Gegenleistung für die Model-Release-Vereinbarung erhält der Kunde einen Rabatt in Höhe
              von bis zu 99,99 € auf die gebuchte Shooting-Dauer (maximal der Preis der ersten Stunde
              bzw. der gewählten Shooting-Dauer, falls diese unter 99,99 € liegt).
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">8.3 Freiwilligkeit</h3>
            <p>
              Die Model-Release-Vereinbarung ist freiwillig und keine Voraussetzung für die Buchung.
              Sie kann während des Buchungsvorgangs aktiviert oder deaktiviert werden.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">8.4 Unwiderruflichkeit und Rückzahlung</h3>
            <p>
              Die erteilte Nutzungserlaubnis ist unwiderruflich, da sie als Gegenleistung für einen
              gewährten Preisnachlass vereinbart wird. Widerruft der Kunde die Nutzungserlaubnis
              nachträglich, ist der Fotograf berechtigt, den gewährten Rabatt (bis zu 99,99 €)
              nachzuberechnen.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">8.5 Namensnennung</h3>
            <p>
              Die Nutzung der Fotos erfolgt grundsätzlich ohne Namensnennung des Kunden, sofern nicht
              ausdrücklich anders vereinbart.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 9 Mitwirkungspflichten des Kunden</h2>
            <p>
              Der Kunde verpflichtet sich, pünktlich zum vereinbarten Termin zu erscheinen und den
              Shooting-Ort in einem geeigneten Zustand bereitzustellen, sofern das Shooting beim Kunden
              stattfindet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 10 Haftung</h2>
            <p>
              Der Fotograf haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten
              beruhen. Die Haftung für leichte Fahrlässigkeit ist, soweit gesetzlich zulässig, auf den
              vorhersehbaren, vertragstypischen Schaden begrenzt. Dies gilt nicht für Schäden aus der
              Verletzung des Lebens, des Körpers oder der Gesundheit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 11 Gutscheine und Rabattaktionen</h2>
            <p>
              Gutscheincodes sind personengebunden und nicht übertragbar. Pro Buchung kann nur ein
              Gutscheincode eingelöst werden. Eine Barauszahlung ist ausgeschlossen. Gutscheine
              verfallen nach dem auf dem Gutschein angegebenen Ablaufdatum.
            </p>
            <p className="mt-2">
              Der Willkommensrabatt (10% auf die Shooting-Zeit) wird nach erfolgreicher E-Mail-Bestätigung
              als persönlicher Gutscheincode per E-Mail versendet und ist für zukünftige Buchungen einlösbar.
              Der Willkommensrabatt wird nicht angewendet, wenn bereits ein Sonderangebot oder eine andere
              Rabattaktion auf die aktuelle Buchung Anwendung findet.
            </p>
            <p className="mt-2">
              Gutscheinrabatte gelten ausschließlich auf die Shooting-Zeit und nicht auf Bildpakete
              oder sonstige Zusatzleistungen, sofern nicht ausdrücklich anders angegeben.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 12 Kundenbewertungen</h2>
            <p>
              Kunden können nach Erhalt ihrer Fotos über das Kundenportal eine Bewertung hinterlassen.
              Der Fotograf behält sich das Recht vor, Bewertungen vor der Veröffentlichung auf der Website
              zu prüfen und freizugeben. Der Vorname, Nachname und die Art des gebuchten Shootings werden
              zusammen mit der Bewertung veröffentlicht. Durch das Absenden einer Bewertung erklärt sich
              der Kunde mit der Veröffentlichung einverstanden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 13 Terminerinnerungen</h2>
            <p>
              Der Kunde erhält automatisierte Terminerinnerungen per E-Mail (3 Tage und 1 Tag vor dem
              Shooting). Diese dienen ausschließlich der Information und ersetzen nicht die Pflicht
              des Kunden, den vereinbarten Termin eigenständig wahrzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 14 Datenschutz</h2>
            <p>
              Die Verarbeitung personenbezogener Daten erfolgt gemäß der{" "}
              <Link to="/datenschutz" className="underline hover:text-foreground transition-colors">
                Datenschutzerklärung
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">§ 15 Schlussbestimmungen</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen dieser AGB
              unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>

          <section className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">Stand: Februar 2026</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AGB;
