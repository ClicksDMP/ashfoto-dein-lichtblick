import { Mail, Phone, Video } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-warm-dark text-warm-white py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-2xl font-bold mb-8">ashfoto</p>

          <div className="space-y-4 mb-8">
            <a
              href="mailto:booking@ashfoto.de"
              className="flex items-center justify-center gap-3 text-warm-sand hover:text-warm-gold transition-colors"
            >
              <Mail className="w-5 h-5" />
              booking@ashfoto.de
            </a>
            <a
              href="tel:+4917670027200"
              className="flex items-center justify-center gap-3 text-warm-sand hover:text-warm-gold transition-colors"
            >
              <Phone className="w-5 h-5" />
              +49 176 70027200
            </a>
            <p className="flex items-center justify-center gap-3 text-warm-sand">
              <Video className="w-5 h-5" />
              Beratung per Video Call oder persönlich möglich
            </p>
          </div>

          <div className="border-t border-warm-brown/30 pt-8">
            <p className="text-warm-sand/60 text-sm">
              © {new Date().getFullYear()} ashfoto. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
