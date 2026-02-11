import imgFamily from "@/assets/shooting-family.jpg";
import imgBaby from "@/assets/shooting-baby.jpg";
import imgNewborn from "@/assets/shooting-newborn.jpg";
import imgBabybauch from "@/assets/shooting-babybauch.jpg";
import imgKinder from "@/assets/shooting-kinder.jpg";
import imgFreunde from "@/assets/shooting-freunde.jpg";
import imgPaar from "@/assets/shooting-paar.jpg";
import imgAkt from "@/assets/shooting-akt.jpg";
import imgMaenner from "@/assets/shooting-maenner.jpg";
import imgBeauty from "@/assets/shooting-beauty.jpg";
import imgMini from "@/assets/shooting-mini.jpg";
import imgTier from "@/assets/shooting-tier.jpg";
import imgHochzeit from "@/assets/shooting-hochzeit.jpg";
import imgMitarbeiter from "@/assets/shooting-mitarbeiter.jpg";
import imgEvent from "@/assets/shooting-event.jpg";
import imgMesse from "@/assets/shooting-messe.jpg";
import imgFood from "@/assets/shooting-food.jpg";

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceTip {
  title: string;
  text: string;
}

export interface ServiceData {
  slug: string;
  serviceName: string; // must match SERVICES array in BookingFlow
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  highlights: string[];
  faqs: ServiceFAQ[];
  tips: ServiceTip[];
  metaTitle: string;
  metaDescription: string;
}

export const SERVICES_DATA: ServiceData[] = [
  {
    slug: "familien-fotoshooting",
    serviceName: "Familien Fotoshooting",
    title: "Familien-Fotoshooting",
    subtitle: "Erinnerungen für die Ewigkeit",
    heroImage: imgFamily,
    description:
      "Ob mit Kindern, Großeltern oder der ganzen Verwandtschaft – ich komme zu euch und halte die schönsten Momente eurer Familie fest. In gewohnter Umgebung entstehen die natürlichsten und emotionalsten Bilder. Kein Stress mit Anfahrt und Studio – einfach entspannt bei euch zuhause oder an eurem Lieblingsort.",
    highlights: [
      "Mobile Shootings direkt bei euch vor Ort",
      "Professionelles Equipment und natürliches Licht",
      "Entspannte Atmosphäre für natürliche Bilder",
      "Alle Altersgruppen willkommen",
      "Digitale Nachbearbeitung inklusive",
    ],
    faqs: [
      { question: "Wie lange dauert ein Familien-Fotoshooting?", answer: "Je nach gebuchter Variante zwischen 1 und 8 Stunden. Für Familien mit kleinen Kindern empfehle ich mindestens 2 Stunden, damit genug Zeit für Pausen und spontane Momente bleibt." },
      { question: "Können auch Haustiere dabei sein?", answer: "Natürlich! Eure Vierbeiner gehören zur Familie und sind herzlich willkommen beim Shooting." },
      { question: "Was sollen wir anziehen?", answer: "Tragt Kleidung, in der ihr euch wohl fühlt. Aufeinander abgestimmte Farben (nicht zwingend gleich) wirken auf Fotos harmonisch. Vermeidet große Logos oder sehr bunte Muster." },
      { question: "Wann bekommen wir die Bilder?", answer: "Die fertig bearbeiteten Bilder erhaltet ihr innerhalb von 7–14 Werktagen als digitale Dateien zum Download." },
    ],
    tips: [
      { title: "Outfits abstimmen", text: "Wählt Farben, die zueinander passen – Erdtöne, Pastellfarben oder gedeckte Farben wirken besonders harmonisch auf Fotos." },
      { title: "Zeitpunkt wählen", text: "Das goldene Licht am späten Nachmittag sorgt für besonders warme und stimmungsvolle Bilder." },
      { title: "Natürlich bleiben", text: "Die schönsten Familienfotos entstehen, wenn alle entspannt sind. Plant genug Zeit ein und lasst die Kinder einfach spielen." },
    ],
    metaTitle: "Familien-Fotoshooting | ashfoto – Mobiler Fotograf",
    metaDescription: "Professionelles Familien-Fotoshooting direkt bei euch zuhause. Natürliche Bilder in entspannter Atmosphäre. Jetzt Termin buchen!",
  },
  {
    slug: "baby-fotoshooting",
    serviceName: "Baby Fotoshooting",
    title: "Baby-Fotoshooting",
    subtitle: "Wertvolle Erinnerungen an die ersten Monate",
    heroImage: imgBaby,
    description:
      "Babys werden so schnell groß – haltet diese wertvolle Zeit für immer fest! Ob Cake-Smash, erste Schritte oder einfach kuschelige Momente – ich fange die Persönlichkeit eures kleinen Schatzes in natürlichen, liebevollen Bildern ein. Direkt bei euch zuhause, wo sich euer Baby am wohlsten fühlt.",
    highlights: [
      "Shooting in gewohnter Umgebung für entspannte Babys",
      "Geduld und Erfahrung mit den Kleinsten",
      "Cake-Smash und kreative Setups möglich",
      "Sichere und sanfte Posen",
      "Natürliche Nachbearbeitung ohne künstlichen Look",
    ],
    faqs: [
      { question: "Ab welchem Alter kann ein Baby-Shooting stattfinden?", answer: "Ab ca. 3 Monaten. Für Neugeborene (0–14 Tage) biete ich spezielle Newborn-Shootings an." },
      { question: "Was ist, wenn das Baby weint oder schläft?", answer: "Kein Problem! Ich plane genug Zeit für Pausen, Stillen und Kuscheln ein. Auch schlafende Babys sind wunderschöne Motive." },
      { question: "Können die Eltern mit aufs Bild?", answer: "Natürlich! Einige der schönsten Bilder entstehen mit Mama, Papa oder Geschwistern zusammen." },
    ],
    tips: [
      { title: "Füttern vor dem Shooting", text: "Ein sattes, zufriedenes Baby ist ein glückliches Model! Füttert euer Baby kurz vor dem Termin." },
      { title: "Warme Umgebung", text: "Babys fühlen sich in warmen Räumen wohler – besonders bei Fotos mit weniger Kleidung." },
      { title: "Lieblingsspielzeug bereithalten", text: "Vertraute Gegenstände helfen, das Baby bei Laune zu halten." },
    ],
    metaTitle: "Baby-Fotoshooting | ashfoto – Mobiler Babyfotograf",
    metaDescription: "Natürliche Babyfotos bei euch zuhause. Cake-Smash, Meilensteine & mehr. Erfahrener Babyfotograf – jetzt buchen!",
  },
  {
    slug: "newborn-fotoshooting",
    serviceName: "Newborn Fotoshooting",
    title: "Newborn-Fotoshooting",
    subtitle: "Die allerersten Tage für immer festhalten",
    heroImage: imgNewborn,
    description:
      "In den ersten 5–14 Lebenstagen sind Neugeborene besonders verschlafen und lassen sich wunderbar in sanften Posen fotografieren. Ich komme zu euch nach Hause und bringe alles mit, was wir für zauberhafte Neugeborenen-Fotos brauchen – Wraps, Körbchen und professionelles Licht.",
    highlights: [
      "Ideal in den ersten 5–14 Lebenstagen",
      "Alle Requisiten und Props inklusive",
      "Sanfte, sichere Posen mit Erfahrung",
      "Familien- und Geschwisterfotos möglich",
      "Warme, geduldige Arbeitsweise",
    ],
    faqs: [
      { question: "Wann sollte ich das Newborn-Shooting buchen?", answer: "Am besten bereits in der Schwangerschaft! So kann ich flexibel auf den tatsächlichen Geburtstermin reagieren." },
      { question: "Wie lange dauert ein Newborn-Shooting?", answer: "Plant ca. 2–3 Stunden ein. Neugeborene bestimmen das Tempo – ich nehme mir so viel Zeit, wie euer Baby braucht." },
      { question: "Ist das Shooting sicher für mein Neugeborenes?", answer: "Absolut! Sicherheit hat oberste Priorität. Alle Posen sind sanft und werden mit größter Sorgfalt durchgeführt." },
    ],
    tips: [
      { title: "Baby gut füttern", text: "Ein sattes Baby schläft tiefer und lässt sich leichter in verschiedene Posen legen." },
      { title: "Raum vorheizen", text: "Eine Raumtemperatur von 24–26°C ist ideal für Neugeborene ohne Kleidung." },
      { title: "Zeitpuffer einplanen", text: "Neugeborene brauchen Pausen – kein Stress, wir haben alle Zeit der Welt." },
    ],
    metaTitle: "Newborn-Fotoshooting | ashfoto – Neugeborenen-Fotograf",
    metaDescription: "Zauberhafte Neugeborenen-Fotos in den ersten Lebenstagen. Sicher, sanft & mobil bei euch zuhause. Jetzt buchen!",
  },
  {
    slug: "babybauch-fotoshooting",
    serviceName: "Babybauch Fotoshooting",
    title: "Babybauch-Fotoshooting",
    subtitle: "Die Vorfreude in Bildern festhalten",
    heroImage: imgBabybauch,
    description:
      "Die Schwangerschaft ist eine magische Zeit voller Vorfreude. Haltet diesen besonderen Moment mit einem professionellen Babybauch-Shooting fest – ob solo, als Paar oder mit der ganzen Familie. Ich komme zu euch und schaffe intime, natürliche Bilder.",
    highlights: [
      "Ideal zwischen der 28. und 36. SSW",
      "Babybauch + Newborn Kombi-Paket verfügbar",
      "Indoor und Outdoor möglich",
      "Partner und Geschwisterkinder willkommen",
      "Natürlicher Look ohne Überbearbeitung",
    ],
    faqs: [
      { question: "Wann ist der beste Zeitpunkt für ein Babybauch-Shooting?", answer: "Zwischen der 28. und 36. Schwangerschaftswoche ist ideal – der Bauch ist schön rund, aber die werdende Mama fühlt sich noch wohl." },
      { question: "Was ist das Babybauch + Newborn Kombi-Paket?", answer: "Ihr bucht Babybauch und Newborn zusammen und spart dabei! Das Newborn-Shooting findet dann nach der Geburt statt." },
      { question: "Muss ich spezielle Kleidung mitbringen?", answer: "Ich empfehle fließende Stoffe, die den Bauch schön betonen. Aber auch Jeans und T-Shirt können toll aussehen – Hauptsache, ihr fühlt euch wohl." },
    ],
    tips: [
      { title: "Körperpflege", text: "Eincremen am Tag des Shootings sorgt für strahlende Haut auf den Fotos." },
      { title: "Bequeme Kleidung", text: "Bringt verschiedene Outfits mit – von elegant bis lässig, dann haben wir mehr Abwechslung." },
      { title: "Partner einbeziehen", text: "Paarfotos mit Babybauch gehören zu den emotionalsten Bildern – nehmt euren Partner mit!" },
    ],
    metaTitle: "Babybauch-Fotoshooting | ashfoto – Schwangerschaftsfotos",
    metaDescription: "Wunderschöne Babybauch-Fotos bei euch zuhause. Natürlich & emotional. Kombi mit Newborn möglich. Jetzt buchen!",
  },
  {
    slug: "kinder-fotoshooting",
    serviceName: "Kinder Fotoshooting",
    title: "Kinder-Fotoshooting",
    subtitle: "Lebendige Erinnerungen an die Kindheit",
    heroImage: imgKinder,
    description:
      "Kinder sind die ehrlichsten Models – ihre Freude, ihr Staunen, ihre wilde Energie. Ich fange genau diese echten Momente ein, ohne gestellte Posen. Ob Geburtstag, Einschulung oder einfach so – ein Kinder-Shooting bei euch zuhause oder im Freien wird zu einem Abenteuer!",
    highlights: [
      "Spielerischer Ansatz für natürliche Bilder",
      "Keine gestellten Posen – echte Emotionen",
      "Indoor und Outdoor möglich",
      "Geschwister und Freunde willkommen",
      "Geduld und Erfahrung im Umgang mit Kindern",
    ],
    faqs: [
      { question: "Mein Kind ist schüchtern – geht das trotzdem?", answer: "Absolut! Ich nehme mir Zeit zum Aufwärmen und arbeite spielerisch. Die besten Bilder entstehen, wenn Kinder sich wohlfühlen." },
      { question: "Ab welchem Alter bieten Sie Kinder-Shootings an?", answer: "Ab ca. 2 Jahren. Für jüngere Kinder empfehle ich ein Baby- oder Newborn-Shooting." },
      { question: "Können Geschwister zusammen fotografiert werden?", answer: "Natürlich! Geschwisterfotos sind wunderschön und ein beliebtes Extra beim Kinder-Shooting." },
    ],
    tips: [
      { title: "Ausgeschlafene Kinder", text: "Plant das Shooting zu einer Zeit, wenn euer Kind ausgeruht und gut gelaunt ist." },
      { title: "Lieblingssachen mitbringen", text: "Lieblingskuscheltier, Seifenblasen oder Kreide – alles, was Spaß macht, kann eingebaut werden." },
      { title: "Kein Zwang", text: "Lasst die Kinder spielen und Spaß haben – die authentischsten Fotos entstehen von allein." },
    ],
    metaTitle: "Kinder-Fotoshooting | ashfoto – Natürliche Kinderfotos",
    metaDescription: "Lebendige Kinderfotos direkt bei euch zuhause. Spielerisch, natürlich & voller Emotionen. Jetzt Termin buchen!",
  },
  {
    slug: "freunde-fotoshooting",
    serviceName: "Freunde Fotoshooting",
    title: "Freunde-Fotoshooting",
    subtitle: "Gemeinsame Momente, die bleiben",
    heroImage: imgFreunde,
    description:
      "Ob beste Freundinnen, die alte Clique oder der JGA – ein Freunde-Shooting ist der perfekte Anlass, um eure Verbindung in Bildern festzuhalten. Spaß, Lachen und echte Emotionen stehen im Mittelpunkt. Ich komme zu euch – egal ob Park, Café oder WG.",
    highlights: [
      "Perfekt für JGA, Geburtstage und gemeinsame Erlebnisse",
      "Gruppenfotos und Einzelportraits möglich",
      "Entspannte, lustige Atmosphäre",
      "Indoor und Outdoor Locations",
      "Digitale Dateien zum Teilen",
    ],
    faqs: [
      { question: "Wie viele Personen können teilnehmen?", answer: "Es gibt keine feste Obergrenze! Ab 4+ Personen empfehle ich eine längere Shooting-Dauer für genug Einzel- und Gruppenbilder." },
      { question: "Können wir Requisiten mitbringen?", answer: "Unbedingt! Schilder, Verkleidungen, Konfetti – alles, was zu euch passt und Spaß macht." },
      { question: "Eignet sich das Shooting als Geschenk?", answer: "Perfekt! Ein Freunde-Shooting ist ein einzigartiges Erlebnis-Geschenk." },
    ],
    tips: [
      { title: "Gemeinsames Motto", text: "Stimmt euch bei den Outfits ab oder wählt ein Farbmotto für harmonische Gruppenbilder." },
      { title: "Location mit Bedeutung", text: "Wählt einen Ort, der euch verbindet – euer Stamm-Café, den alten Schulhof oder einen Lieblingspark." },
      { title: "Musik einpacken", text: "Gute Musik sorgt für lockere Stimmung und echtes Lachen auf den Fotos." },
    ],
    metaTitle: "Freunde-Fotoshooting | ashfoto – Gruppenfotos mit Freunden",
    metaDescription: "Freunde-Fotoshooting – gemeinsame Erinnerungen professionell festgehalten. JGA, Geburtstage & mehr. Jetzt buchen!",
  },
  {
    slug: "paar-fotoshooting",
    serviceName: "Paar Fotoshooting",
    title: "Paar-Fotoshooting",
    subtitle: "Eure Liebe in Bildern",
    heroImage: imgPaar,
    description:
      "Ob frisch verliebt, zum Jahrestag oder als Pre-Wedding – ein Paar-Shooting fängt die Magie zwischen euch beiden ein. Natürlich, emotional und ohne gestellte Posen. Ich komme zu euch an euren Lieblingsort und schaffe intime Bilder, die eure Geschichte erzählen.",
    highlights: [
      "Pre-Wedding Shootings verfügbar",
      "Natürliche, ungestellte Momentaufnahmen",
      "Indoor und Outdoor Locations",
      "Romantische Stimmung durch professionelles Licht",
      "Verlobungs- und Jahrestag-Shootings",
    ],
    faqs: [
      { question: "Wir sind kamerascheu – ist das schlimm?", answer: "Überhaupt nicht! Ich leite euch sanft an und sorge dafür, dass ihr euch vor der Kamera wohlfühlt. Nach 10 Minuten vergesst ihr, dass ich da bin." },
      { question: "Können wir verschiedene Locations nutzen?", answer: "Ja! Bei längeren Shootings können wir gerne 2-3 Locations einplanen." },
      { question: "Ist ein Paar-Shooting auch als Geschenk möglich?", answer: "Absolut! Gutscheine für Paar-Shootings sind ein beliebtes und persönliches Geschenk." },
    ],
    tips: [
      { title: "Natürlich interagieren", text: "Flüstert, lacht, kuschelt – die besten Paarfotos entstehen durch echte Interaktion." },
      { title: "Golden Hour nutzen", text: "Das weiche Licht kurz vor Sonnenuntergang zaubert eine romantische Atmosphäre." },
      { title: "Outfits aufeinander abstimmen", text: "Kleidet euch in ähnlichen Farbtönen, aber nicht identisch – das wirkt natürlich und harmonisch." },
    ],
    metaTitle: "Paar-Fotoshooting | ashfoto – Romantische Paarfotos",
    metaDescription: "Natürliche Paarfotos an eurem Lieblingsort. Pre-Wedding, Verlobung & Jahrestag. Jetzt Shooting buchen!",
  },
  {
    slug: "hochzeitsfotografie",
    serviceName: "Hochzeitsfotografie",
    title: "Hochzeitsfotografie",
    subtitle: "Euer wichtigster Tag – für immer festgehalten",
    heroImage: imgHochzeit,
    description:
      "Überlasst die Fotos eures wichtigsten Tages nicht dem Zufall. Als euer Hochzeitsfotograf bin ich von der Vorbereitung bis zum ersten Tanz für euch da und halte jeden unvergesslichen Moment fest – authentisch, emotional und professionell.",
    highlights: [
      "Getting Ready, Trauung, Feier & Party",
      "Pre-Wedding Shooting auf Wunsch zubuchbar",
      "Alle Bilder als digitale Dateien inklusive",
      "Zweiter Fotograf auf Wunsch buchbar",
      "Hochzeitsreportage im dokumentarischen Stil",
    ],
    faqs: [
      { question: "Wie viele Stunden sollten wir buchen?", answer: "Für eine standesamtliche Trauung reichen 2 Stunden. Für eine kirchliche Trauung mit Feier empfehle ich 4–8 Stunden." },
      { question: "Wann bekommen wir die Hochzeitsfotos?", answer: "Innerhalb von 3–4 Wochen nach der Hochzeit erhaltet ihr alle bearbeiteten Bilder als Download." },
      { question: "Bieten Sie auch Videografie an?", answer: "Aktuell konzentriere ich mich auf Fotografie, kann aber gerne einen Videografen-Kollegen empfehlen." },
    ],
    tips: [
      { title: "Zeitplan teilen", text: "Teilt mir euren Tagesablauf mit, damit ich die wichtigsten Momente optimal planen kann." },
      { title: "First Look einplanen", text: "Ein First Look vor der Trauung gibt euch einen intimen, privaten Moment – und tolle Fotos." },
      { title: "Gästeliste für Gruppenfotos", text: "Erstellt vorab eine Liste der gewünschten Gruppenfotos, damit wir nichts vergessen." },
    ],
    metaTitle: "Hochzeitsfotograf | ashfoto – Professionelle Hochzeitsfotos",
    metaDescription: "Professionelle Hochzeitsfotografie – authentisch & emotional. Getting Ready bis Party. Jetzt anfragen!",
  },
  {
    slug: "akt-erotik-fotoshooting",
    serviceName: "Akt und Erotik Fotoshooting",
    title: "Akt & Erotik Fotoshooting",
    subtitle: "Ästhetik, Sinnlichkeit & Selbstbewusstsein",
    heroImage: imgAkt,
    description:
      "Ein Akt- oder Erotik-Shooting ist eine kraftvolle Erfahrung – es geht um Selbstliebe, Ästhetik und das Feiern des eigenen Körpers. In einer diskreten, respektvollen Atmosphäre entstehen kunstvolle Bilder, die eure Schönheit und Stärke zeigen.",
    highlights: [
      "Diskrete und respektvolle Arbeitsweise",
      "Boudoir, Dessous & künstlerischer Akt",
      "Professionelle Lichtführung für ästhetische Ergebnisse",
      "Beratungsgespräch vorab möglich",
      "Alle Bilder nur an euch – maximale Privatsphäre",
    ],
    faqs: [
      { question: "Ist das Shooting diskret?", answer: "Absolut! Alle Bilder sind ausschließlich für euch bestimmt. Nichts wird ohne eure ausdrückliche Genehmigung veröffentlicht." },
      { question: "Kann ich eine Begleitperson mitbringen?", answer: "Natürlich! Wenn euch das mehr Sicherheit gibt, bringt gerne eine Vertrauensperson mit." },
      { question: "Muss ich komplett unbekleidet sein?", answer: "Nein! Ihr bestimmt, wie weit ihr gehen möchtet. Von Dessous über teilverdeckt bis künstlerischer Akt – alles nach eurem Wunsch." },
    ],
    tips: [
      { title: "Vorab besprechen", text: "Teilt mir eure Vorstellungen und Grenzen mit – ein kurzes Vorgespräch gibt Sicherheit und sorgt für bessere Ergebnisse." },
      { title: "Verschiedene Outfits", text: "Bringt verschiedene Dessous, Tücher oder Accessoires mit für mehr Abwechslung in den Bildern." },
      { title: "Entspannung ist alles", text: "Je wohler ihr euch fühlt, desto schöner werden die Bilder. Nehmt euch Zeit zum Ankommen." },
    ],
    metaTitle: "Akt & Erotik Fotoshooting | ashfoto – Ästhetische Aktfotos",
    metaDescription: "Ästhetisches Akt- & Erotik-Fotoshooting in diskreter Atmosphäre. Boudoir, Dessous & mehr. Jetzt buchen!",
  },
  {
    slug: "maenner-fotoshooting",
    serviceName: "Männer Fotoshooting",
    title: "Männer-Fotoshooting",
    subtitle: "Starke Bilder für starke Persönlichkeiten",
    heroImage: imgMaenner,
    description:
      "Ob für Business, Dating-Profil oder einfach als persönliches Statement – ein professionelles Männer-Shooting bringt eure beste Seite zum Vorschein. Markante Porträits mit Charakter, modern inszeniert und natürlich nachbearbeitet.",
    highlights: [
      "Business-Porträts und Lifestyle-Fotos",
      "Markante Lichtführung für starke Bilder",
      "Ideal für Social Media und Bewerbungen",
      "Verschiedene Looks in einem Shooting",
      "Natürliche Nachbearbeitung",
    ],
    faqs: [
      { question: "Was soll ich anziehen?", answer: "Bringt 2–3 Outfits mit: z.B. Hemd/Anzug für Business, T-Shirt/Jacket für Casual. So bekommt ihr verschiedene Looks." },
      { question: "Eignet sich das Shooting für LinkedIn/Xing?", answer: "Perfekt! Professionelle Porträts für Business-Netzwerke sind einer der häufigsten Anlässe." },
      { question: "Wird stark retuschiert?", answer: "Nein – ich setze auf natürliche Nachbearbeitung. Ihr sollt aussehen wie ihr, nur im besten Licht." },
    ],
    tips: [
      { title: "Bart und Haare stylen", text: "Geht am Tag vorher zum Friseur – frisch gestylte Haare und ein gepflegter Bart machen einen großen Unterschied." },
      { title: "Ausgeschlafen kommen", text: "Ausreichend Schlaf sorgt für wache Augen und frische Haut auf den Fotos." },
      { title: "Verschiedene Looks vorbereiten", text: "Bringt mindestens 2 verschiedene Outfits mit für Abwechslung in den Bildern." },
    ],
    metaTitle: "Männer-Fotoshooting | ashfoto – Professionelle Männerporträts",
    metaDescription: "Professionelles Männer-Fotoshooting für Business, Social Media & mehr. Markante Porträts mit Charakter. Jetzt buchen!",
  },
  {
    slug: "beauty-portrait-fotoshooting",
    serviceName: "Beauty und Portrait Fotoshooting",
    title: "Beauty & Portrait Fotoshooting",
    subtitle: "Kurz mal im Rampenlicht stehen",
    heroImage: imgBeauty,
    description:
      "Genieße ein professionelles Beauty-Fotoshooting und entdecke dich neu. Ob als Portraitfotografie oder als Ganzkörperinszenierung – ich bringe professionelles Licht und Equipment mit und verwandele jeden Ort in dein persönliches Fotostudio.",
    highlights: [
      "High-End Porträt- und Beauty-Fotografie",
      "Professionelle Lichtsetups für Glamour-Shots",
      "Make-up Beratung und Tipps",
      "Verschiedene Looks in einem Shooting",
      "Natürliche Retusche – kein künstlicher Look",
    ],
    faqs: [
      { question: "Soll ich mich vorher schminken?", answer: "Am besten kommt ihr dezent geschminkt. Für aufwendige Make-up-Looks kann ich eine Visagistin empfehlen." },
      { question: "Bekomme ich auch Ganzkörperfotos?", answer: "Natürlich! Wir machen sowohl Close-up Portraits als auch Ganzkörperaufnahmen – je nach Wunsch." },
      { question: "Kann ich das als Geschenk buchen?", answer: "Ja! Ein Beauty-Shooting ist ein tolles Geschenk. Gutscheine sind verfügbar." },
    ],
    tips: [
      { title: "Make-up am Tag des Shootings", text: "Mattierendes Make-up funktioniert am besten für Fotos. Vermeidet starken Glitzer oder Shimmer." },
      { title: "Accessoires mitbringen", text: "Schmuck, Hüte, Schals oder Sonnenbrillen können spannende Akzente setzen." },
      { title: "Inspiration sammeln", text: "Schickt mir vorab Pinterest-Boards oder Beispielbilder, die euch gefallen – so kann ich gezielt darauf hinarbeiten." },
    ],
    metaTitle: "Beauty & Portrait Fotoshooting | ashfoto – Professionelle Porträts",
    metaDescription: "Beauty- und Portrait-Fotoshooting mit professionellem Licht. Glamour-Shots & natürliche Porträts. Jetzt buchen!",
  },
  {
    slug: "mini-shooting",
    serviceName: "Mini Shooting",
    title: "Mini-Shooting",
    subtitle: "Schnell, unkompliziert und professionell",
    heroImage: imgMini,
    description:
      "Nicht immer braucht es ein langes Shooting. Das Mini-Shooting ist perfekt für ein schnelles Update eurer Profilbilder, ein Geschenk oder einfach, um professionelle Fotos auszuprobieren – kurz und knackig in 30 oder 45 Minuten.",
    highlights: [
      "Ideal als Einstieg in professionelle Fotografie",
      "Perfekt für Profilbilder und Social Media",
      "Kurz und knackig: 30 oder 45 Minuten",
      "Mindestens 10 Fotos im Paket",
      "Günstige Alternative zum großen Shooting",
    ],
    faqs: [
      { question: "Was ist der Unterschied zu einem normalen Shooting?", answer: "Das Mini-Shooting ist kürzer (30–45 Min.) und perfekt für einfache Porträts oder Profilbilder. Für aufwendigere Setups empfehle ich ein Standard-Shooting." },
      { question: "Wie viele Bilder bekomme ich?", answer: "Je nach gewähltem Paket ab 10 Bildern aufwärts." },
      { question: "Für wen eignet sich das Mini-Shooting?", answer: "Für alle, die schnell und unkompliziert professionelle Fotos möchten – Einzelpersonen, Paare oder kleine Gruppen." },
    ],
    tips: [
      { title: "Outfit vorbereiten", text: "Bei einem kurzen Shooting zählt jede Minute – kommt fertig gestylt und mit geplantem Outfit." },
      { title: "Klar kommunizieren", text: "Sagt mir vorher, was ihr braucht (Porträt, Ganzkörper, Hintergrund) – dann nutzen wir die Zeit optimal." },
      { title: "Weniger ist mehr", text: "Konzentriert euch auf 1–2 Looks statt viele Outfitwechsel – Qualität vor Quantität." },
    ],
    metaTitle: "Mini-Fotoshooting | ashfoto – Schnell & Professionell",
    metaDescription: "Mini-Shooting in 30 oder 45 Minuten – perfekt für Profilbilder & Social Media. Günstig & professionell. Jetzt buchen!",
  },
  {
    slug: "tier-fotoshooting",
    serviceName: "Tier Fotoshooting",
    title: "Tier-Fotoshooting",
    subtitle: "Professionelle Fotos von eurem Liebling",
    heroImage: imgTier,
    description:
      "Eure Fellnase, euer Pferd oder euer exotischer Freund – Tiere sind einzigartige Persönlichkeiten und verdienen professionelle Fotos! Ich komme zu euch und fotografiere euer Tier in seiner gewohnten Umgebung – geduldig, liebevoll und mit dem richtigen Gespür für den perfekten Moment.",
    highlights: [
      "Hunde, Katzen, Pferde und alle anderen Tiere",
      "Shooting in gewohnter Umgebung oder draußen",
      "Tierhalter-Porträts mit Haustier möglich",
      "Geduld und Erfahrung mit Tieren",
      "Action-Shots und ruhige Porträts",
    ],
    faqs: [
      { question: "Mein Hund ist sehr aufgedreht – geht das?", answer: "Kein Problem! Ich habe Erfahrung mit allen Temperamenten. Action-Shots von tobenden Hunden können sogar die besten Bilder ergeben." },
      { question: "Können mehrere Tiere fotografiert werden?", answer: "Natürlich! Ob Rudel oder gemischte Tiergruppe – alle sind willkommen." },
      { question: "Kann ich auch mit aufs Bild?", answer: "Auf jeden Fall! Mensch-Tier-Porträts gehören zu den schönsten Bildern." },
    ],
    tips: [
      { title: "Leckerlis bereithalten", text: "Leckerlis sind das beste Werkzeug für Aufmerksamkeit und Motivation beim Shooting." },
      { title: "Vor dem Shooting toben lassen", text: "Ein kurzer Spaziergang oder Spielrunde vorher hilft, überschüssige Energie abzubauen." },
      { title: "Lieblingsplatz nutzen", text: "Fotografiert euer Tier an seinem Lieblingsplatz – dort fühlt es sich am wohlsten." },
    ],
    metaTitle: "Tier-Fotoshooting | ashfoto – Professionelle Tierfotos",
    metaDescription: "Professionelle Tierfotos bei euch zuhause oder draußen. Hunde, Katzen, Pferde & mehr. Geduldig & liebevoll. Jetzt buchen!",
  },
  {
    slug: "mitarbeiterfotos",
    serviceName: "Mitarbeiterfotos",
    title: "Mitarbeiterfotos",
    subtitle: "Professionelle Gesichter für Ihr Unternehmen",
    heroImage: imgMitarbeiter,
    description:
      "Professionelle Mitarbeiterfotos stärken das Image Ihres Unternehmens und schaffen Vertrauen bei Kunden und Bewerbern. Ich komme direkt in Ihr Büro und fotografiere Ihr Team vor Ort – einheitlich, professionell und effizient. Employer Branding beginnt mit authentischen Gesichtern.",
    highlights: [
      "On-Location in Ihrem Unternehmen",
      "Einheitlicher Look für das gesamte Team",
      "Ideal für Website, LinkedIn und Marketingmaterial",
      "Effiziente Abläufe – wenig Zeitaufwand pro Mitarbeiter",
      "Nachträglich im gleichen Stil nachshootbar",
    ],
    faqs: [
      { question: "Wie lange dauert es pro Mitarbeiter?", answer: "Ca. 10–15 Minuten pro Person. Bei einem Team von 20 Personen sind wir in ca. 4 Stunden fertig." },
      { question: "Können Sie einen einheitlichen Hintergrund mitbringen?", answer: "Ja! Ich bringe portable Hintergrundsysteme und professionelle Beleuchtung mit." },
      { question: "Was passiert, wenn Mitarbeiter am Tag nicht können?", answer: "Kein Problem – ich kann einzelne Nachzügler zu einem späteren Termin im gleichen Stil nachshooten." },
    ],
    tips: [
      { title: "Dresscode kommunizieren", text: "Informieren Sie Ihr Team vorab über den gewünschten Dresscode für einheitliche Ergebnisse." },
      { title: "Ruhigen Raum bereitstellen", text: "Ein ruhiger Raum mit genug Platz (ca. 3x4m) reicht als improviertes Studio." },
      { title: "Zeitslots vergeben", text: "Erstellen Sie eine Terminliste, damit jeder Mitarbeiter weiß, wann er/sie dran ist." },
    ],
    metaTitle: "Mitarbeiterfotos | ashfoto – Business-Porträts on Location",
    metaDescription: "Professionelle Mitarbeiterfotos direkt in Ihrem Unternehmen. Einheitlich, effizient & professionell. Jetzt anfragen!",
  },
  {
    slug: "event-fotografie",
    serviceName: "Live und Event Fotografie",
    title: "Live & Event Fotografie",
    subtitle: "Jeder Moment zählt",
    heroImage: imgEvent,
    description:
      "Von Firmenevents über Konzerte bis hin zu Geburtstagsfeiern – ich dokumentiere eure Veranstaltung professionell und diskret. Jeder wichtige Moment wird festgehalten, ohne die Gäste zu stören. Authentische Event-Reportagen, die die Stimmung perfekt einfangen.",
    highlights: [
      "Diskrete, dokumentarische Arbeitsweise",
      "Firmenevents, Partys, Konzerte & mehr",
      "Professionelle Ausrüstung auch bei schwierigem Licht",
      "Alle Fotos als digitale Dateien",
      "Schnelle Lieferung nach dem Event",
    ],
    faqs: [
      { question: "Wie unauffällig arbeiten Sie?", answer: "Sehr diskret – ich bewege mich im Hintergrund und fange Momente ein, ohne die Gäste zu stören." },
      { question: "Wie schnell bekommen wir die Bilder?", answer: "Auf Wunsch erhaltet ihr ausgewählte Highlight-Bilder bereits am nächsten Tag, die komplette Galerie innerhalb von 7 Tagen." },
      { question: "Können wir bestimmte Momente vorab festlegen?", answer: "Natürlich! Teilt mir die Must-Have-Momente mit (Reden, Torte, Showacts etc.) und ich plane entsprechend." },
    ],
    tips: [
      { title: "Ablaufplan teilen", text: "Je besser ich den Ablauf kenne, desto besser kann ich die wichtigsten Momente antizipieren." },
      { title: "Ansprechpartner vor Ort", text: "Benennt eine Person, die mich bei Fragen unterstützt und mir den Zugang zu allen Bereichen ermöglicht." },
      { title: "Lichtverhältnisse bedenken", text: "Informiert mich vorab über die Location – Indoor, Outdoor, Bühnenbeleuchtung etc." },
    ],
    metaTitle: "Event-Fotografie | ashfoto – Professionelle Eventfotos",
    metaDescription: "Professionelle Event-Fotografie für Firmenevents, Konzerte & Partys. Diskret & authentisch. Jetzt anfragen!",
  },
  {
    slug: "messe-fotografie",
    serviceName: "Messe Fotografie",
    title: "Messe-Fotografie",
    subtitle: "Ihr Messeauftritt professionell dokumentiert",
    heroImage: imgMesse,
    description:
      "Ein professioneller Messeauftritt verdient professionelle Fotos. Ich dokumentiere euren Stand, eure Produkte und die Interaktion mit Besuchern – ideal für Social Media, Pressemitteilungen und die interne Kommunikation.",
    highlights: [
      "Standfotos, Produktdetails & Besucherinteraktion",
      "Live-Content für Social Media während der Messe",
      "Porträts des Standpersonals",
      "Professionell auch bei Messebeleuchtung",
      "Schnelle Lieferung für Social Media",
    ],
    faqs: [
      { question: "Können Sie auch für mehrere Messetage gebucht werden?", answer: "Natürlich! Ich biete auch Mehrtages-Pakete an. Kontaktiert mich für ein individuelles Angebot." },
      { question: "Liefern Sie Bilder auch am selben Tag?", answer: "Ja – auf Wunsch erhaltet ihr ausgewählte Bilder noch am selben Tag für Social Media Posts." },
      { question: "Können Sie auch Produktfotos am Stand machen?", answer: "Ja! Neben der Reportage kann ich auch gezielte Produktfotos und Detailaufnahmen anfertigen." },
    ],
    tips: [
      { title: "Stand vor dem Ansturm fotografieren", text: "Die besten Standfotos entstehen vor Messebeginn, wenn alles perfekt aufgebaut ist." },
      { title: "Briefing zum Corporate Design", text: "Teilt mir eure CI-Richtlinien mit, damit die Bildsprache zu eurem Unternehmen passt." },
      { title: "Social-Media-Highlights planen", text: "Definiert vorab, welche Momente unbedingt für Social Media festgehalten werden sollen." },
    ],
    metaTitle: "Messe-Fotografie | ashfoto – Professionelle Messefotos",
    metaDescription: "Professionelle Messe-Fotografie – Standfotos, Produkte & Live-Content. Ideal für Social Media. Jetzt anfragen!",
  },
  {
    slug: "food-produkt-fotografie",
    serviceName: "Food und Produkt Fotografie",
    title: "Food & Produkt Fotografie",
    subtitle: "Eure Produkte perfekt in Szene gesetzt",
    heroImage: imgFood,
    description:
      "Appetitliche Food-Fotos und hochwertige Produktbilder sind essenziell für euer Marketing. Ich inszeniere eure Produkte professionell – ob für Speisekarten, Online-Shops oder Social Media. Jedes Bild wird sorgfältig komponiert und nachbearbeitet.",
    highlights: [
      "Food-Fotografie für Restaurants und Catering",
      "Produktfotos für Online-Shops und Kataloge",
      "Styling und Komposition inklusive",
      "Freisteller und Lifestyle-Aufnahmen",
      "Optimiert für Print und Web",
    ],
    faqs: [
      { question: "Bringen Sie Food-Styling-Equipment mit?", answer: "Ja! Ich bringe grundlegendes Styling-Equipment mit. Für aufwendigere Setups empfehle ich einen professionellen Food-Stylisten." },
      { question: "Wie viele Produkte können pro Shooting fotografiert werden?", answer: "Das hängt von der Komplexität ab. Als Richtwert: ca. 5–10 Produkte pro Stunde bei einfachen Setups." },
      { question: "Wie läuft die Buchung ab?", answer: "Food- und Produkt-Fotografie wird individuell kalkuliert. Kontaktiert mich für ein maßgeschneidertes Angebot." },
    ],
    tips: [
      { title: "Produkte vorbereiten", text: "Stellt sicher, dass alle Produkte sauber, unbeschädigt und in ausreichender Menge vorhanden sind." },
      { title: "Mood-Board erstellen", text: "Sammelt Beispielbilder, die euch gefallen – so treffen wir von Anfang an den richtigen Stil." },
      { title: "Hintergründe bedenken", text: "Überlegt, ob ihr neutrale oder lifestyle-orientierte Hintergründe möchtet." },
    ],
    metaTitle: "Food & Produkt Fotografie | ashfoto – Professionelle Produktfotos",
    metaDescription: "Professionelle Food- & Produktfotografie für Restaurant, Online-Shop & Marketing. Individuelle Angebote. Jetzt anfragen!",
  },
];

export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return SERVICES_DATA.find(s => s.slug === slug);
};
