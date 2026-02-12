import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Datenschutz = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 md:px-12 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Datenschutzerklärung</h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-semibold text-foreground mb-2">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
              passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
              persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Verantwortliche Stelle</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="mt-2">
              Ashraf AlSalaita<br />
              Clicks DMP – Design &amp; Media Production<br />
              Karl-Traub-Straße 15<br />
              68199 Mannheim<br /><br />
              Telefon: +49 176 700 27 200<br />
              E-Mail: info@ClicksDMP.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Datenerfassung auf dieser Website</h2>

            <h3 className="text-lg font-semibold text-foreground mb-2">Cookies</h3>
            <p>
              Diese Website verwendet sogenannte „Cookies". Cookies sind kleine Datenpakete und richten auf Ihrem
              Endgerät keinen Schaden an. Sie werden entweder vorübergehend (Session-Cookies) oder dauerhaft
              (permanente Cookies) auf Ihrem Endgerät gespeichert.
            </p>
            <p className="mt-2">
              Technisch notwendige Cookies werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in Server-Log-Dateien:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Browsertyp und Browserversion</li>
              <li>Verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Kontaktformular und Buchung</h3>
            <p>
              Im Rahmen der Buchung erheben wir folgende Daten:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Vorname und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Anschrift (Straße, PLZ, Ort)</li>
              <li>Gewünschter Shooting-Typ, Termin, Dauer und Bildpaket</li>
              <li>Anzahl der Teilnehmer</li>
              <li>Zusätzliche Hinweise (optional)</li>
            </ul>
            <p className="mt-2">
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Registrierung auf dieser Website</h2>
            <p>
              Sie können sich registrieren, um das Kundenportal zu nutzen (Buchungsübersicht, Fotogalerie,
              Gutscheine, Bewertungen). Bei der Registrierung werden erhoben:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Vorname und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Anschrift (Straße, PLZ, Ort)</li>
              <li>Passwort (verschlüsselt gespeichert)</li>
            </ul>
            <p className="mt-2">
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Kundenportal und Fotobereitstellung</h2>
            <p>
              Nach Durchführung eines Shootings werden die bearbeiteten Fotos über das Kundenportal digital
              bereitgestellt. Die Fotos werden verschlüsselt in einem Cloud-Speicher abgelegt und sind nur
              für den jeweiligen Kunden über sein persönliches Konto zugänglich.
            </p>
            <p className="mt-2">
              Die Speicherung und Bereitstellung der Fotos erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
              (Vertragserfüllung).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Kundenbewertungen</h2>
            <p>
              Kunden können nach Erhalt ihrer Fotos eine Bewertung über das Kundenportal abgeben. Dabei werden
              folgende Daten erhoben und ggf. auf der Website veröffentlicht:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Vorname und Nachname</li>
              <li>Art des gebuchten Shootings</li>
              <li>Bewertungstext und Sternebewertung (1–5)</li>
            </ul>
            <p className="mt-2">
              Die Veröffentlichung erfolgt nur nach Prüfung und Freigabe durch den Fotografen. Mit dem Absenden
              einer Bewertung erklärt sich der Kunde mit der Veröffentlichung einverstanden (Art. 6 Abs. 1 lit. a DSGVO).
              Der Kunde kann seine Einwilligung jederzeit widerrufen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. E-Mail-Versand und Terminerinnerungen</h2>
            <p>
              Wir versenden folgende automatisierte E-Mails:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Buchungseingangsbestätigung (Status: ausstehend)</li>
              <li>Buchungsbestätigung (nach persönlicher Terminbestätigung)</li>
              <li>Terminerinnerung 3 Tage vor dem Shooting</li>
              <li>Terminerinnerung 1 Tag vor dem Shooting</li>
              <li>Benachrichtigung bei Fotobereitstellung</li>
              <li>Willkommensnachricht mit Gutscheincode bei Registrierung</li>
              <li>E-Mail-Verifizierung</li>
            </ul>
            <p className="mt-2">
              Der Versand erfolgt über einen externen Dienstleister. Die Datenverarbeitung erfolgt auf
              Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Hosting und Auftragsverarbeitung</h2>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet. Die personenbezogenen Daten
              werden auf den Servern des Hosters gespeichert. Der Einsatz erfolgt auf Grundlage von
              Art. 6 Abs. 1 lit. f DSGVO. Wir haben einen AVV mit unserem Hoster geschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Speicherdauer</h2>
            <p>
              Ihre personenbezogenen Daten werden gelöscht, sobald der Zweck der Speicherung entfällt.
              Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch Gesetze vorgesehen ist
              (z.&nbsp;B. handels- und steuerrechtliche Aufbewahrungsfristen von bis zu 10 Jahren).
              Fotos im Kundenportal werden nach Ablauf von 12 Monaten nach Bereitstellung archiviert.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Auskunft über Ihre gespeicherten Daten zu erhalten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit zu verlangen (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO)</li>
              <li>Sich bei einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO)</li>
            </ul>
            <p className="mt-2">
              Die zuständige Aufsichtsbehörde ist der Landesbeauftragte für den Datenschutz und die
              Informationsfreiheit Baden-Württemberg.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Model-Release-Vereinbarung</h2>
            <p>
              Kunden haben die Möglichkeit, dem Fotografen im Rahmen der Buchung eine erweiterte
              Nutzungserlaubnis für die Shooting-Fotos zu erteilen (Model-Release). Dabei wird
              die Einwilligung zur Nutzung für Portfolio, Website, Social Media und Werbezwecke
              erteilt. Als Gegenleistung erhält der Kunde einen Rabatt auf die Shooting-Dauer.
            </p>
            <p className="mt-2">
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung
              im Rahmen der Rabattvereinbarung). Der Status der Model-Release-Vereinbarung wird in der
              Buchung gespeichert.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. SSL-/TLS-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Widerruf Ihrer Einwilligung</h2>
            <p>
              Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit
              der bis zum Widerruf erfolgten Datenverarbeitung bleibt unberührt.
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

export default Datenschutz;
