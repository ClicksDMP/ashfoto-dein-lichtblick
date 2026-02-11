import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "ashfoto_cookie_consent";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (state: ConsentState) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(state));
    setVisible(false);
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true });
  const acceptNecessary = () => saveConsent({ necessary: true, analytics: false });
  const saveSelection = () => saveConsent(consent);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card shadow-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">
              Cookie-Einstellungen
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Wir verwenden Cookies, um die Funktionalität unserer Website sicherzustellen.
              Weitere Informationen finden Sie in unserer{" "}
              <Link to="/datenschutz" className="underline hover:text-foreground transition-colors">
                Datenschutzerklärung
              </Link>.
            </p>

            {showDetails && (
              <div className="space-y-3 mb-4 text-sm">
                <label className="flex items-center gap-3 cursor-not-allowed">
                  <input type="checkbox" checked disabled className="rounded accent-primary" />
                  <div>
                    <span className="font-medium text-card-foreground">Notwendige Cookies</span>
                    <p className="text-muted-foreground text-xs">
                      Erforderlich für die Grundfunktionen der Website (z.&nbsp;B. Anmeldung, Sitzung).
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) => setConsent((s) => ({ ...s, analytics: e.target.checked }))}
                    className="rounded accent-primary"
                  />
                  <div>
                    <span className="font-medium text-card-foreground">Analyse-Cookies</span>
                    <p className="text-muted-foreground text-xs">
                      Helfen uns zu verstehen, wie Besucher die Website nutzen.
                    </p>
                  </div>
                </label>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={acceptAll} size="sm">
                Alle akzeptieren
              </Button>
              <Button onClick={acceptNecessary} variant="outline" size="sm">
                Nur notwendige
              </Button>
              {showDetails ? (
                <Button onClick={saveSelection} variant="ghost" size="sm">
                  Auswahl speichern
                </Button>
              ) : (
                <Button onClick={() => setShowDetails(true)} variant="ghost" size="sm">
                  Einstellungen
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
