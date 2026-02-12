import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Widerruf = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 md:px-12 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Widerrufsbelehrung</h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Widerrufsrecht</h2>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
              widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
            </p>
            <p className="mt-2">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>
            <p className="mt-2 font-medium text-foreground">
              Ashraf AlSalaita<br />
              Clicks DMP – Design &amp; Media Production<br />
              Karl-Traub-Straße 15<br />
              68199 Mannheim<br />
              E-Mail: info@ClicksDMP.com<br />
              Telefon: +49 176 700 27 200
            </p>
            <p className="mt-2">
              mittels einer eindeutigen Erklärung (z.&nbsp;B. ein mit der Post versandter Brief oder
              eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können
              dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            </p>
            <p className="mt-2">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
              Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Folgen des Widerrufs</h2>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
              erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen,
              an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese
              Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
              eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Vorzeitiges Erlöschen des Widerrufsrechts</h2>
            <p>
              Das Widerrufsrecht erlischt vorzeitig, wenn der Fotograf die Dienstleistung vollständig
              erbracht hat und mit der Ausführung der Dienstleistung erst begonnen hat, nachdem der
              Kunde dazu seine ausdrückliche Zustimmung gegeben hat und gleichzeitig seine Kenntnis
              davon bestätigt hat, dass er sein Widerrufsrecht bei vollständiger Vertragserfüllung
              verliert (§ 356 Abs. 4 BGB).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Muster-Widerrufsformular</h2>
            <p className="italic">
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und
              senden Sie es zurück.)
            </p>
            <div className="mt-3 bg-muted/30 rounded-lg p-4 border border-border text-sm">
              <p>An:</p>
              <p>Ashraf AlSalaita, Clicks DMP – Design &amp; Media Production</p>
              <p>Karl-Traub-Straße 15, 68199 Mannheim</p>
              <p>E-Mail: info@ClicksDMP.com</p>
              <br />
              <p>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über
                die Erbringung der folgenden Dienstleistung:</p>
              <br />
              <p>Bestellt am (*) / erhalten am (*):</p>
              <p>Name des/der Verbraucher(s):</p>
              <p>Anschrift des/der Verbraucher(s):</p>
              <br />
              <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
              <p>Datum:</p>
              <br />
              <p className="text-xs text-muted-foreground">(*) Unzutreffendes streichen.</p>
            </div>
          </section>

          <section className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">Stand: Februar 2026</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Widerruf;
