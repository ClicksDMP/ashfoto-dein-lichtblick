import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Impressum = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 md:px-12 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Impressum</h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Angaben gemäß § 5 TMG</h2>
            <p>
              Ashraf AlSalaita<br />
              Clicks DMP – Design &amp; Media Production<br />
              Karl-Traub-Straße 15<br />
              68199 Mannheim
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Kontakt</h2>
            <p>
              Telefon: +49 176 700 27 200<br />
              E-Mail: info@ClicksDMP.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Umsatzsteuer</h2>
            <p>
              Alle angegebenen Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer
              von 19%.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Berufsbezeichnung</h2>
            <p>
              Fotograf / Designer (freier Beruf, kein kammerpflichtiger Beruf)
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Redaktionell verantwortlich</h2>
            <p>
              Ashraf AlSalaita<br />
              Karl-Traub-Straße 15<br />
              68199 Mannheim
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Impressum;
