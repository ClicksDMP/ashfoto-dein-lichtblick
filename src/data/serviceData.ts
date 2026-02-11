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

export interface ExperienceStep {
  title: string;
  text: string;
}

export interface ServiceData {
  slug: string;
  serviceName: string; // must match SERVICES array in BookingFlow
  title: string;
  subtitle: string;
  heroImage: string;
  heroTagline: string;
  description: string;
  emotionalIntro: string;
  highlights: string[];
  experienceSteps: ExperienceStep[];
  whyChooseUs: string[];
  faqs: ServiceFAQ[];
  tips: ServiceTip[];
  closingHeadline: string;
  closingText: string;
  metaTitle: string;
  metaDescription: string;
}

export const SERVICES_DATA: ServiceData[] = [
  // ─── FAMILIEN ────────────────────────────────────────────────────
  {
    slug: "familien-fotoshooting",
    serviceName: "Familien Fotoshooting",
    title: "Familien-Fotoshooting",
    subtitle: "Weil diese Jahre nicht zurückkommen",
    heroImage: imgFamily,
    heroTagline: "Echte Momente. Echte Verbindung. Für immer.",
    description:
      "Euer Lachen, eure Umarmungen, das Chaos am Frühstückstisch – genau das macht eure Familie aus. Ich komme zu euch und halte fest, was in zehn Jahren unbezahlbar sein wird: die kleinen, ehrlichen Momente, die das Leben schreibt. Kein Studio, kein Stress – nur ihr, so wie ihr seid.",
    emotionalIntro:
      "Kinder werden groß. Schneller, als wir es wahrhaben wollen. Die Art, wie dein Sohn gerade lacht, wie deine Tochter den Kopf schieflegt – das sind Kapitel, die sich nie wiederholen. Ein Familien-Fotoshooting ist kein Termin. Es ist ein Geschenk an euer zukünftiges Ich. Bilder, die euch eines Tages sagen werden: Schau, wie schön das war. Schau, wie sehr wir uns geliebt haben.",
    highlights: [
      "Direkt bei euch zuhause oder an eurem Lieblingsort",
      "Professionelles Equipment & natürliches Licht",
      "Entspannte Atmosphäre für authentische Bilder",
      "Alle Generationen willkommen – von Baby bis Großeltern",
      "Cinematic Bildbearbeitung in Premium-Qualität",
      "Digitale Lieferung in Galerie-Qualität",
    ],
    experienceSteps: [
      { title: "Persönliches Vorgespräch", text: "Wir sprechen über eure Wünsche, den perfekten Zeitpunkt und die ideale Location. Ich berate euch zu Outfits, Farben und Stimmung – damit alles zusammenpasst." },
      { title: "Styling & Vorbereitung", text: "Ihr bekommt von mir konkrete Empfehlungen für Kleidung und Accessoires. Aufeinander abgestimmte Erdtöne, Pastellfarben oder mutige Akzente – je nachdem, was zu euch passt." },
      { title: "Das Shooting selbst", text: "Kein steifes Posieren. Ich leite euch sanft an, gebe euch kleine Aufgaben und fange dabei die echten Momente ein: ein gestohlener Kuss, ein spontanes Kichern, eine stille Umarmung." },
      { title: "Cinematic Nachbearbeitung", text: "Jedes Bild wird einzeln bearbeitet – Farben, Licht, Kontraste. Kein Filter, kein künstlicher Look. Nur das beste Licht auf eure Geschichte." },
      { title: "Digitale Premium-Lieferung", text: "Eure Bilder erhaltet ihr in voller Auflösung als digitale Dateien – bereit für Druck, Social Media und das Familienalbum." },
    ],
    whyChooseUs: [
      "Cinematic Bildsprache, die Geschichten erzählt",
      "Natürlicher Bearbeitungsstil – kein Überfiltern, kein AI-Look",
      "Mobil bei euch vor Ort – kein Studio nötig",
      "Persönliche Betreuung von der Beratung bis zur Lieferung",
      "Modernste Ausrüstung mit professionellem Licht",
      "Erfahrung mit Kindern jeden Alters",
    ],
    faqs: [
      { question: "Wie lange dauert ein Familien-Fotoshooting?", answer: "Je nach Paket zwischen 1 und 4 Stunden. Für Familien mit kleinen Kindern empfehle ich mindestens 2 Stunden – so bleibt genug Zeit für Pausen, spontane Momente und verschiedene Setups." },
      { question: "Was sollen wir anziehen?", answer: "Ich berate euch im Vorgespräch persönlich dazu. Als Faustregel: aufeinander abgestimmte Farben in Erd- oder Pastelltönen wirken auf Fotos besonders harmonisch. Vermeidet große Logos und sehr bunte Muster." },
      { question: "Was, wenn mein Kind keine Lust hat?", answer: "Das passiert – und ist völlig okay. Ich arbeite spielerisch und geduldig. Die besten Bilder entstehen oft genau dann, wenn Kinder einfach sie selbst sein dürfen. Kein Zwang, kein Druck." },
      { question: "Können auch Haustiere dabei sein?", answer: "Natürlich! Eure Vierbeiner gehören zur Familie und sind herzlich willkommen. Mensch-Tier-Bilder gehören oft zu den emotionalsten Aufnahmen." },
      { question: "Wann bekommen wir die Bilder?", answer: "Innerhalb von 7–14 Werktagen erhaltet ihr eure fertig bearbeiteten Bilder als digitale Dateien in voller Auflösung zum Download." },
      { question: "Können wir den Ort frei wählen?", answer: "Ja! Ob euer Wohnzimmer, der Garten, ein Park oder ein besonderer Ort mit Bedeutung – ich komme zu euch. Im Vorgespräch helfe ich euch bei der Wahl der perfekten Location." },
      { question: "Kann ich später weitere Bilder nachbestellen?", answer: "Eure ausgewählten Bilder sind final bearbeitet und digital geliefert. Ein Upgrade auf ein größeres Paket ist beim nächsten Shooting jederzeit möglich." },
    ],
    tips: [
      { title: "Outfits aufeinander abstimmen", text: "Wählt Farben, die harmonieren – Erdtöne, Creme und gedeckte Akzente wirken auf Fotos besonders edel. Nicht identisch, aber zusammengehörig." },
      { title: "Die goldene Stunde nutzen", text: "Das weiche, warme Licht am späten Nachmittag – etwa 1–2 Stunden vor Sonnenuntergang – zaubert die schönsten Stimmungen. Ich berate euch zum idealen Zeitpunkt." },
      { title: "Einfach ihr selbst sein", text: "Die schönsten Familienfotos entstehen, wenn niemand performt. Spielt, kuschelt, lacht – ich fange genau das ein, was echt ist." },
    ],
    closingHeadline: "Diese Jahre kommen nicht zurück.",
    closingText: "Aber die Erinnerungen können bleiben. Lasst uns gemeinsam festhalten, was eure Familie heute ausmacht – bevor sich das nächste Kapitel öffnet.",
    metaTitle: "Familien-Fotoshooting | ashfoto – Mobiler Fotograf",
    metaDescription: "Professionelles Familien-Fotoshooting bei euch zuhause. Cinematic Bildsprache, natürliche Momente & Premium-Qualität. Jetzt Termin buchen!",
  },

  // ─── BABY ────────────────────────────────────────────────────────
  {
    slug: "baby-fotoshooting",
    serviceName: "Baby Fotoshooting",
    title: "Baby-Fotoshooting",
    subtitle: "Weil Babys nicht warten",
    heroImage: imgBaby,
    heroTagline: "Kleine Hände. Große Liebe. Für immer festgehalten.",
    description:
      "Das erste Lächeln. Die winzigen Zehen. Der Blick, der die ganze Welt bedeutet. Babys verändern sich so schnell – jede Woche bringt ein neues Wunder. Ich komme zu euch nach Hause und fange diese flüchtigen Momente in liebevollen, natürlichen Bildern ein.",
    emotionalIntro:
      "In ein paar Jahren wirst du dein Kind ansehen und dich fragen: War es wirklich einmal so klein? Warst du wirklich so müde und gleichzeitig so glücklich? Ein Baby-Fotoshooting hält genau das fest, was ihr gerade lebt – diese einzigartige Mischung aus Zärtlichkeit, Erschöpfung und bedingungsloser Liebe. Es sind nicht nur Fotos. Es ist das erste Kapitel einer Geschichte, die euch für immer verbindet.",
    highlights: [
      "Shooting in gewohnter Umgebung – wo euer Baby sich wohlfühlt",
      "Geduld und Einfühlungsvermögen mit den Kleinsten",
      "Cake-Smash, Meilensteine & kreative Setups möglich",
      "Sichere, sanfte Posen mit Erfahrung",
      "Natürliche Nachbearbeitung – kein künstlicher Look",
      "Eltern- und Geschwisterbilder inklusive",
    ],
    experienceSteps: [
      { title: "Vorgespräch & Planung", text: "Wir besprechen den idealen Zeitpunkt, Outfits und ob ihr besondere Meilensteine festhalten wollt – erstes Sitzen, Cake-Smash oder einfach Kuschelmomente." },
      { title: "Ankommen & Wohlfühlen", text: "Am Shooting-Tag nehme ich mir Zeit, dass euer Baby mich kennenlernt. Kein Stress, kein Zeitdruck. Wir arbeiten im Tempo eures Kindes." },
      { title: "Sanfte Anleitung", text: "Ich leite euch und euer Baby behutsam durch verschiedene Szenen – von Porträts bis hin zu Familienbildern. Pausen zum Füttern und Kuscheln sind eingeplant." },
      { title: "Premium-Bearbeitung", text: "Jedes Bild wird mit einem warmen, natürlichen Stil bearbeitet – weiche Hauttöne, sanftes Licht, keine Überbearbeitung." },
      { title: "Digitale Galerie", text: "Eure ausgewählten Bilder erhaltet ihr als hochauflösende Dateien – bereit für den Druck, Social Media oder euer persönliches Fotoalbum." },
    ],
    whyChooseUs: [
      "Erfahrung mit Babys jeden Alters und Temperaments",
      "Natürlicher Bearbeitungsstil – so schön wie im echten Leben",
      "Mobil bei euch vor Ort – keine stressige Anfahrt",
      "Unbegrenzter Zeitpuffer für Füttern und Pausen",
      "Cinematic Bildsprache für zeitlose Erinnerungen",
      "Persönliche Beratung von Anfang bis Ende",
    ],
    faqs: [
      { question: "Ab welchem Alter kann ein Baby-Shooting stattfinden?", answer: "Ab ca. 3 Monaten. Für Neugeborene in den ersten 5–14 Lebenstagen empfehle ich ein spezielles Newborn-Shooting." },
      { question: "Was ist, wenn mein Baby weint oder schläft?", answer: "Beides gehört dazu – und beides kann wunderschön sein. Ich plane großzügig Zeit ein. Schlafende Babys sind traumhafte Motive, und bei Unruhe machen wir einfach eine Pause." },
      { question: "Können Eltern und Geschwister mit aufs Bild?", answer: "Unbedingt! Die innigsten Bilder entstehen oft mit Mama, Papa oder den großen Geschwistern. Das gehört für mich zu jedem Baby-Shooting dazu." },
      { question: "Was sollen wir dem Baby anziehen?", answer: "Schlichte, helle Kleidung in Naturtönen wirkt zeitlos und elegant. Aber auch der Lieblingsstrampler kann perfekt sein. Ich berate euch gerne vorab." },
      { question: "Wann bekommen wir die Bilder?", answer: "Innerhalb von 7–14 Werktagen erhaltet ihr eure fertig bearbeiteten Bilder als digitale Dateien zum Download." },
      { question: "Was ist ein Cake-Smash-Shooting?", answer: "Zum ersten Geburtstag darf euer Kind eine kleine Torte nach Herzenslust zermatschen – das ergibt fantastische, fröhliche Bilder! Ich bringe alles Nötige mit." },
    ],
    tips: [
      { title: "Vor dem Shooting füttern", text: "Ein sattes, zufriedenes Baby ist das beste Model. Plant die letzte Mahlzeit kurz vor dem Termin ein." },
      { title: "Warme Räume vorbereiten", text: "Besonders bei Bildern mit weniger Kleidung fühlen sich Babys in warmen Räumen (ca. 24°C) deutlich wohler." },
      { title: "Lieblingsspielzeug bereithalten", text: "Vertraute Gegenstände, Schnuller oder ein Kuscheltier helfen eurem Baby, sich wohlzufühlen und sorgen für natürliche Interaktionen." },
    ],
    closingHeadline: "Sie bleiben nicht lange so klein.",
    closingText: "Aber die Erinnerungen an diese kostbaren Monate können für immer bleiben. Lasst uns festhalten, was euch gerade das Herz zum Schmelzen bringt.",
    metaTitle: "Baby-Fotoshooting | ashfoto – Mobiler Babyfotograf",
    metaDescription: "Natürliche Babyfotos bei euch zuhause. Cake-Smash, Meilensteine & liebevolle Porträts. Erfahrener mobiler Babyfotograf – jetzt buchen!",
  },

  // ─── NEWBORN ─────────────────────────────────────────────────────
  {
    slug: "newborn-fotoshooting",
    serviceName: "Newborn Fotoshooting",
    title: "Newborn-Fotoshooting",
    subtitle: "Die allerersten Tage – unwiederbringlich & wunderschön",
    heroImage: imgNewborn,
    heroTagline: "5 Tage alt. Unendlich geliebt. Für immer festgehalten.",
    description:
      "In den ersten 5–14 Lebenstagen sind Neugeborene noch ganz nah an der Welt, aus der sie kommen – verschlafen, zart, unendlich friedlich. Diese wenigen Tage sind ein Fenster, das sich nie wieder öffnet. Ich komme zu euch nach Hause und bringe alles mit, was wir für zauberhafte Bilder brauchen.",
    emotionalIntro:
      "Es gibt Tage, die vergisst man nie. Der Tag, an dem euer Baby zur Welt kam, ist einer davon. Aber die Erinnerung an die winzigen Finger, die sich um euren Daumen schließen, an den Geruch des kleinen Kopfes, an die Stille um 3 Uhr morgens – das verblasst. Ein Newborn-Shooting bewahrt genau das auf: Die Zärtlichkeit, die Unschuld, die reine Schönheit des Anfangs. Es ist mehr als Fotografie. Es ist Liebe, die sichtbar wird.",
    highlights: [
      "Ideal in den ersten 5–14 Lebenstagen",
      "Alle Requisiten, Wraps und Props inklusive",
      "Sanfte, sichere Posen – Sicherheit hat höchste Priorität",
      "Familien- und Geschwisterbilder möglich",
      "Warme, geduldige und einfühlsame Arbeitsweise",
      "Natürliche Nachbearbeitung in Premium-Qualität",
    ],
    experienceSteps: [
      { title: "Buchung in der Schwangerschaft", text: "Bucht am besten im 7.–8. Monat, damit ich mich auf euren ungefähren Geburtstermin einstellen kann. Nach der Geburt stimmen wir flexibel den genauen Tag ab." },
      { title: "Setup bei euch zuhause", text: "Ich bringe alles mit – professionelles Licht, Wraps, Körbchen, Decken. Euer Schlafzimmer oder Wohnzimmer wird zum Studio." },
      { title: "Das Baby bestimmt das Tempo", text: "Neugeborene brauchen Pausen. Wir füttern, wickeln, kuscheln – und wenn euer Baby bereit ist, machen wir weiter. Kein Zeitdruck." },
      { title: "Sanfte Nachbearbeitung", text: "Jedes Bild wird mit Liebe bearbeitet – warme Töne, weiches Licht, zeitlose Ästhetik. So natürlich wie euer Baby selbst." },
      { title: "Digitale Premium-Galerie", text: "Eure Bilder kommen als hochauflösende Dateien – für Abzüge, Fotoalben und Erinnerungen, die ein Leben lang halten." },
    ],
    whyChooseUs: [
      "Sicherheit an erster Stelle – jede Pose ist sanft und sicher",
      "Alle Props und Requisiten sind inklusive",
      "Natürlicher Look ohne Überbearbeitung",
      "Erfahrung mit hunderten Neugeborenen",
      "Mobil bei euch zuhause – kein Stress mit Transport",
      "Flexible Terminplanung rund um den Geburtstermin",
    ],
    faqs: [
      { question: "Wann sollte ich das Newborn-Shooting buchen?", answer: "Am besten während der Schwangerschaft, idealerweise im 7.–8. Monat. So kann ich mich auf euren Geburtstermin einstellen und flexibel reagieren." },
      { question: "Wie lange dauert ein Newborn-Shooting?", answer: "Plant 2–3 Stunden ein. Euer Baby bestimmt das Tempo – ich nehme mir so viel Zeit, wie nötig ist, inklusive aller Pausen." },
      { question: "Ist das Shooting sicher für mein Neugeborenes?", answer: "Absolut. Sicherheit hat bei mir höchste Priorität. Alle Posen sind sanft und werden mit größter Sorgfalt durchgeführt. Ich habe Erfahrung mit hunderten Neugeborenen." },
      { question: "Was muss ich vorbereiten?", answer: "Fast nichts – ich bringe alles mit. Stellt nur sicher, dass euer Baby satt und zufrieden ist. Eine Raumtemperatur von 24–26°C ist ideal." },
      { question: "Können Geschwisterkinder mit aufs Bild?", answer: "Unbedingt! Geschwisterbilder mit dem neuen Baby gehören zu den emotionalsten Aufnahmen eines Newborn-Shootings." },
      { question: "Was, wenn mein Baby am Shooting-Tag unruhig ist?", answer: "Das ist völlig normal und kein Problem. Ich plane genügend Puffer ein. Neugeborene haben ihren eigenen Rhythmus – und ich arbeite geduldig mit ihm." },
    ],
    tips: [
      { title: "Baby gut füttern", text: "Ein sattes Baby schläft tiefer und lässt sich leichter in verschiedene Posen betten. Füttert euer Baby kurz vor meiner Ankunft." },
      { title: "Raum vorheizen", text: "Eine Raumtemperatur von 24–26°C ist ideal, besonders wenn euer Baby teilweise unbekleidet fotografiert wird." },
      { title: "Ruhe bewahren", text: "Neugeborene spüren eure Energie. Je entspannter ihr seid, desto ruhiger wird auch euer Baby. Wir haben alle Zeit der Welt." },
    ],
    closingHeadline: "Dieser Anfang passiert nur einmal.",
    closingText: "In wenigen Wochen wird euer Baby anders aussehen, sich anders bewegen, anders klingen. Lasst uns diese unwiederbringlichen ersten Tage in Bildern bewahren, die euch ein Leben lang begleiten.",
    metaTitle: "Newborn-Fotoshooting | ashfoto – Neugeborenen-Fotograf",
    metaDescription: "Zauberhafte Neugeborenen-Fotos in den ersten Lebenstagen. Sicher, sanft & mobil bei euch zuhause. Premium-Qualität. Jetzt buchen!",
  },

  // ─── BABYBAUCH ───────────────────────────────────────────────────
  {
    slug: "babybauch-fotoshooting",
    serviceName: "Babybauch Fotoshooting",
    title: "Babybauch-Fotoshooting",
    subtitle: "Die schönste Vorfreude verdient ein Bild",
    heroImage: imgBabybauch,
    heroTagline: "Zwei Herzen. Ein Bauch voller Wunder.",
    description:
      "Neun Monate voller Staunen, Vorfreude und Verwandlung. Euer Körper erzählt gerade die vielleicht schönste Geschichte eures Lebens. Ich halte diesen magischen Moment fest – intim, kunstvoll und voller Emotion. Direkt bei euch, in eurer vertrauten Umgebung.",
    emotionalIntro:
      "Es gibt eine Zeit zwischen dem Warten und dem Ankommen, die sich anfühlt wie ein Atemholen vor dem größten Abenteuer. Die Schwangerschaft ist mehr als eine Phase – sie ist eine Verwandlung. Dein Körper tut gerade etwas Außergewöhnliches, und diese Bilder werden dich eines Tages daran erinnern: Du warst stark. Du warst schön. Und du hast ein neues Leben in dir getragen.",
    highlights: [
      "Ideal zwischen der 28. und 36. Schwangerschaftswoche",
      "Babybauch + Newborn Kombi-Paket verfügbar – spart bares Geld",
      "Indoor und Outdoor möglich – je nach Jahreszeit und Wunsch",
      "Partner und Geschwisterkinder herzlich willkommen",
      "Natürlicher Look ohne Überbearbeitung",
      "Cinematic Lichtstimmung für emotionale Bilder",
    ],
    experienceSteps: [
      { title: "Beratung & Styling-Guide", text: "Wir besprechen eure Vorstellungen, den besten Zeitpunkt und Outfits. Ich sende euch einen persönlichen Styling-Guide mit Empfehlungen für fließende Stoffe, Farben und Accessoires." },
      { title: "Location-Beratung", text: "Ob euer Schlafzimmer, ein Feld bei Sonnenuntergang oder ein urbaner Hintergrund – gemeinsam finden wir den Ort, der eure Geschichte am besten erzählt." },
      { title: "Sanftes, geführtes Shooting", text: "Ihr braucht keine Modelerfahrung. Ich leite euch durch jede Pose, jeden Blick, jeden Moment – natürlich und ohne Druck." },
      { title: "Cinematic Bearbeitung", text: "Warme Töne, weiches Licht, zeitlose Ästhetik. Eure Bilder bekommen den finalen Schliff, der sie von Schnappschüssen unterscheidet." },
      { title: "Digitale Premium-Lieferung", text: "Hochauflösende Dateien, bereit für Druck, Social Media und euer ganz persönliches Erinnerungsalbum." },
    ],
    whyChooseUs: [
      "Erfahrung mit hunderten werdenden Mamas",
      "Cinematic Bildsprache für zeitlose Schwangerschaftsfotos",
      "Natürliche Bearbeitung – kein AI-Look, keine Überretusche",
      "Mobil bei euch vor Ort – kein unbequemes Studioerlebnis",
      "Kombi-Paket mit Newborn für die komplette Geschichte",
      "Persönliche Beratung von Anfang bis Ende",
    ],
    faqs: [
      { question: "Wann ist der beste Zeitpunkt für ein Babybauch-Shooting?", answer: "Zwischen der 28. und 36. Schwangerschaftswoche ist ideal – der Bauch ist schön rund, und die meisten Mamas fühlen sich noch wohl und beweglich." },
      { question: "Was ist das Babybauch + Newborn Kombi-Paket?", answer: "Ihr bucht beide Shootings zusammen und spart dabei. Das Newborn-Shooting findet nach der Geburt statt – die perfekte Fortsetzung eurer Geschichte." },
      { question: "Was soll ich anziehen?", answer: "Fließende Stoffe in Cremetönen, Weiß oder Erdtönen wirken besonders elegant. Aber auch Jeans und Oberteil kann fantastisch aussehen – Hauptsache, ihr fühlt euch wohl. Ich berate euch ausführlich." },
      { question: "Kann mein Partner dabei sein?", answer: "Unbedingt! Paarbilder mit Babybauch gehören zu den emotionalsten Aufnahmen. Und wenn ihr schon Kinder habt, sind Geschwisterbilder wunderschön." },
      { question: "Was, wenn es regnet (bei Outdoor-Shooting)?", answer: "Wir haben einen Plan B. Ich schlage immer alternative Indoor-Optionen vor, und wir können flexibel umplanen." },
    ],
    tips: [
      { title: "Haut pflegen", text: "Eincremen am Tag des Shootings sorgt für strahlende, geschmeidige Haut – besonders am Bauch, der im Fokus steht." },
      { title: "Verschiedene Outfits mitbringen", text: "Bringt 2–3 verschiedene Looks mit – von elegant bis entspannt. So bekommen wir mehr Abwechslung in eure Galerie." },
      { title: "Partner einbeziehen", text: "Die zärtlichsten Babybauch-Bilder entstehen zu zweit. Lasst euren Partner die Hände auf den Bauch legen – diese Bilder werdet ihr lieben." },
    ],
    closingHeadline: "Diesen Moment gibt es nur einmal.",
    closingText: "Bevor euer Baby da ist, tragt ihr die schönste Vorfreude in euch. Lasst uns dieses Kapitel festhalten – bevor das nächste beginnt.",
    metaTitle: "Babybauch-Fotoshooting | ashfoto – Schwangerschaftsfotos",
    metaDescription: "Emotionale Babybauch-Fotos bei euch zuhause. Cinematic Stil, natürlich & intim. Kombi mit Newborn möglich. Jetzt buchen!",
  },

  // ─── KINDER ──────────────────────────────────────────────────────
  {
    slug: "kinder-fotoshooting",
    serviceName: "Kinder Fotoshooting",
    title: "Kinder-Fotoshooting",
    subtitle: "Kindheit in Bildern, die man fühlen kann",
    heroImage: imgKinder,
    heroTagline: "Wild, frei, wunderbar. Genau so, wie sie sind.",
    description:
      "Kinder sind die ehrlichsten Wesen auf dieser Welt. Ihr Staunen, ihr Lachen, ihre ungefilterte Lebensfreude – ich fange genau das ein. Keine gestellten Posen, kein erzwungenes Lächeln. Nur echte Kindheit, festgehalten in Bildern, die euch noch in 20 Jahren berühren werden.",
    emotionalIntro:
      "Erinnerst du dich an den Geruch des Sommers, als du Kind warst? An das Gefühl, barfuß über die Wiese zu laufen? Deine Kinder erleben gerade genau solche Momente – jeden Tag. Momente, die so flüchtig sind, dass sie uns durch die Finger gleiten. Ein Kinder-Fotoshooting fängt ein, was das Herz zu schnell vergisst: Die Zahnlücke, die Sommersprossen, den Blick voller Abenteuerlust. Es sind Bilder für die Ewigkeit.",
    highlights: [
      "Spielerischer Ansatz – Kinder führen, ich folge",
      "Echte Emotionen statt gestellter Posen",
      "Indoor und Outdoor an euren Lieblingsorten",
      "Geschwister und Freunde willkommen",
      "Geduld und Erfahrung im Umgang mit Kindern",
      "Cinematic Nachbearbeitung in Premium-Qualität",
    ],
    experienceSteps: [
      { title: "Kennenlernen & Planung", text: "Im Vorgespräch erfahre ich mehr über eure Kinder – ihre Vorlieben, Lieblingsorte und was sie zum Lachen bringt. So kann ich das Shooting perfekt auf sie abstimmen." },
      { title: "Aufwärmphase", text: "Ich nehme mir Zeit, Vertrauen aufzubauen. Wir spielen, reden, quatschen – und irgendwann vergessen die Kinder, dass eine Kamera dabei ist." },
      { title: "Spielerisches Shooting", text: "Seifenblasen, Rennen, Klettern, Toben – ich fange die echten Momente ein, während eure Kinder einfach Spaß haben. Keine steife Atmosphäre." },
      { title: "Premium-Bearbeitung", text: "Lebendige Farben, natürliches Licht, cinematic Stimmung – jedes Bild wird individuell bearbeitet, um die Magie des Moments zu bewahren." },
      { title: "Digitale Lieferung", text: "Hochauflösende Dateien zum Download – bereit für Wandbilder, Fotoalben und das stolze Teilen mit der Familie." },
    ],
    whyChooseUs: [
      "Spielerischer Ansatz, der Kindern Spaß macht",
      "Erfahrung mit schüchternen und wilden Kindern gleichermaßen",
      "Natürliche, lebendige Bildsprache",
      "Mobil an eurem Lieblingsort",
      "Kein Zeitdruck – wir arbeiten im Tempo der Kinder",
      "Cinematic Qualität für zeitlose Erinnerungen",
    ],
    faqs: [
      { question: "Mein Kind ist sehr schüchtern – geht das trotzdem?", answer: "Absolut! Ich habe viel Erfahrung mit schüchternen Kindern. Ich nehme mir Zeit zum Aufwärmen, arbeite spielerisch und ohne Druck. Die besten Bilder entstehen, wenn Kinder sich wohlfühlen." },
      { question: "Ab welchem Alter bieten Sie Kinder-Shootings an?", answer: "Ab ca. 2 Jahren. Für jüngere Kinder empfehle ich ein Baby-Shooting, das speziell auf die Bedürfnisse der Kleinsten zugeschnitten ist." },
      { question: "Können Geschwister zusammen fotografiert werden?", answer: "Natürlich – Geschwisterbilder sind wunderschön und gehören zu den beliebtesten Aufnahmen. Die Dynamik zwischen Geschwistern ergibt oft die emotionalsten Bilder." },
      { question: "Was, wenn mein Kind keine Lust mehr hat?", answer: "Kein Problem. Wir machen eine Pause, spielen, essen ein Eis – und machen weiter, wenn die Energie zurück ist. Oder wir stoppen, wenn genug gute Bilder da sind." },
      { question: "Können wir Spielzeug oder Requisiten mitbringen?", answer: "Unbedingt! Lieblingskuscheltier, Seifenblasen, Kreide, Verkleidungen – alles, was zu eurem Kind passt, kann eingebaut werden." },
    ],
    tips: [
      { title: "Ausgeschlafen & gut gelaunt", text: "Plant das Shooting zu einer Tageszeit, wenn euer Kind fit und fröhlich ist – nach dem Mittagsschlaf oder am Vormittag funktioniert oft am besten." },
      { title: "Lieblingssachen einpacken", text: "Kuscheltiere, Seifenblasen, Kreide oder das Lieblingsbuch – vertraute Gegenstände helfen, natürliche und persönliche Bilder zu bekommen." },
      { title: "Kein Zwang, kein Druck", text: "Lasst die Kinder einfach sein. Die authentischsten Fotos entstehen, wenn niemand performt. Ich fange genau das ein." },
    ],
    closingHeadline: "Kindheit ist kurz. Bilder sind für immer.",
    closingText: "Jede Phase geht vorbei – die Zahnlücke, die wilden Locken, das ansteckende Lachen. Lasst uns festhalten, was jetzt gerade wunderbar ist.",
    metaTitle: "Kinder-Fotoshooting | ashfoto – Natürliche Kinderfotos",
    metaDescription: "Lebendige Kinderfotos direkt bei euch. Spielerisch, natürlich & voller Emotionen. Cinematic Qualität. Jetzt Termin buchen!",
  },

  // ─── FREUNDE ─────────────────────────────────────────────────────
  {
    slug: "freunde-fotoshooting",
    serviceName: "Freunde Fotoshooting",
    title: "Freunde-Fotoshooting",
    subtitle: "Gemeinsame Momente, die bleiben",
    heroImage: imgFreunde,
    heroTagline: "Eure Story. Euer Lachen. Für immer.",
    description:
      "Manche Menschen gehören einfach zusammen. Ob beste Freundinnen, die alte Clique, der JGA oder ein besonderer Geburtstag – ein Freunde-Shooting feiert eure Verbindung. Echtes Lachen, ehrliche Umarmungen, gemeinsame Insider – ich fange ein, was euch ausmacht.",
    emotionalIntro:
      "Freundschaft ist kein Status – es ist eine Entscheidung, die man jeden Tag aufs Neue trifft. Die Menschen, die um 2 Uhr nachts ans Telefon gehen. Die, die ohne Worte verstehen. Ein Freunde-Fotoshooting ist mehr als ein paar Gruppenfotos. Es ist ein Statement: Ihr gehört zusammen. Und diese Bilder werden euch daran erinnern – in 10, 20, 30 Jahren.",
    highlights: [
      "Perfekt für JGA, Geburtstage & gemeinsame Erlebnisse",
      "Gruppenfotos und Einzelportraits möglich",
      "Entspannte, lustige Atmosphäre",
      "Indoor und Outdoor an euren Lieblingsorten",
      "Digitale Dateien in Premium-Qualität zum Teilen",
      "Kreative Setups und spontane Momente",
    ],
    experienceSteps: [
      { title: "Konzept & Location", text: "Wir besprechen, was euch verbindet und wo ihr euch am wohlsten fühlt – Park, Café, WG-Küche oder Stadtflair. Ich bringe Ideen für kreative Setups mit." },
      { title: "Lockere Stimmung", text: "Keine Steifheit, keine erzwungenen Posen. Musik an, Snacks bereit, gute Laune – ich sorge dafür, dass sich alle wohlfühlen." },
      { title: "Echte Momente einfangen", text: "Zwischen den geplanten Gruppenbildern entstehen die besten Fotos: beim Lachen, beim Quatsch machen, beim einfach zusammen sein." },
      { title: "Cinematic Bearbeitung", text: "Lebendige Farben, cinematic Stimmung – eure Bilder sehen aus wie aus einem Film, in dem ihr die Hauptrollen spielt." },
      { title: "Einfaches Teilen", text: "Alle Bilder als digitale Dateien – einfach herunterladen und in der Gruppe teilen." },
    ],
    whyChooseUs: [
      "Lockere Atmosphäre statt Studiozwang",
      "Erfahrung mit Gruppen jeder Größe",
      "Cinematic Bildsprache für besondere Gruppenbilder",
      "Mobil an eurem Lieblingsort",
      "Kreative Ideen für einzigartige Setups",
      "Perfekt als Erlebnis-Geschenk",
    ],
    faqs: [
      { question: "Wie viele Personen können teilnehmen?", answer: "Es gibt keine feste Obergrenze! Ab 4+ Personen empfehle ich eine längere Shooting-Dauer, damit genug Zeit für Einzel-, Duo- und Gruppenbilder bleibt." },
      { question: "Können wir Requisiten mitbringen?", answer: "Unbedingt! Schilder, Verkleidungen, Konfetti, Champagner – alles, was zu euch passt und die Stimmung aufheizt." },
      { question: "Eignet sich das als Geschenk?", answer: "Perfekt! Ein Freunde-Shooting ist ein einzigartiges Erlebnis-Geschenk, das verbindet und Erinnerungen schafft." },
      { question: "Was sollen wir anziehen?", answer: "Stimmt euch farblich ab – ein gemeinsames Motto oder ähnliche Farbtöne wirken auf Gruppenfotos besonders gut. Ich berate euch gerne." },
      { question: "Können wir den Ort frei wählen?", answer: "Absolut! Euer Lieblingscafé, der Park, die WG, der Strand – ich komme zu euch, egal wo." },
    ],
    tips: [
      { title: "Farblich abstimmen", text: "Ein gemeinsames Farbmotto oder ähnliche Töne sorgen für harmonische Gruppenbilder – ohne dass alle gleich aussehen müssen." },
      { title: "Location mit Bedeutung", text: "Wählt einen Ort, der euch verbindet – euer Stammlokal, der alte Schulhof, ein besonderer Platz. Das gibt den Bildern eine persönliche Note." },
      { title: "Musik und gute Laune", text: "Erstellt eine gemeinsame Playlist, bringt Snacks mit – je besser die Stimmung, desto besser die Fotos." },
    ],
    closingHeadline: "Manche Menschen sind ein Zuhause.",
    closingText: "Haltet fest, was euch verbindet. Denn in ein paar Jahren werdet ihr diese Bilder ansehen und sagen: Das waren wir. Das sind wir immer noch.",
    metaTitle: "Freunde-Fotoshooting | ashfoto – Gruppenfotos mit Freunden",
    metaDescription: "Freunde-Fotoshooting – gemeinsame Erinnerungen professionell festgehalten. JGA, Geburtstage & mehr. Cinematic Qualität. Jetzt buchen!",
  },

  // ─── PAAR ────────────────────────────────────────────────────────
  {
    slug: "paar-fotoshooting",
    serviceName: "Paar Fotoshooting",
    title: "Paar-Fotoshooting",
    subtitle: "Eure Liebe verdient mehr als ein Handyfoto",
    heroImage: imgPaar,
    heroTagline: "Zwei Menschen. Eine Geschichte. Für die Ewigkeit.",
    description:
      "Die Art, wie ihr euch anseht. Die Berührungen, die keiner sieht. Das Lachen, das nur euch gehört. Ich fange ein, was zwischen euch passiert – ungestellt, ehrlich und voller Emotion. Ob frisch verliebt, zum Jahrestag oder als Pre-Wedding – eure Liebe verdient Bilder, die euch gerecht werden.",
    emotionalIntro:
      "Liebe ist nicht immer laut. Manchmal ist sie ein Blick über den Frühstückstisch. Eine Hand, die sich nach der anderen streckt. Ein Lächeln, das nur der andere versteht. Genau diese Momente erzählen eure Geschichte besser als jede Hochzeitseinladung. Ein Paar-Fotoshooting ist keine Pflichtübung – es ist eine Liebeserklärung in Bildern. Und ihr werdet in Jahren dankbar sein, dass ihr sie habt.",
    highlights: [
      "Pre-Wedding & Verlobungs-Shootings",
      "Natürliche, ungestellte Momentaufnahmen",
      "Indoor und Outdoor an eurem Lieblingsort",
      "Romantische Stimmung durch professionelles Licht",
      "Cinematic Bildsprache für zeitlose Bilder",
      "Sanfte Anleitung – auch für Kameraschüchterne",
    ],
    experienceSteps: [
      { title: "Persönliches Vorgespräch", text: "Wir sprechen über eure Geschichte, eure Wünsche und die perfekte Location. Ich lerne euch kennen, damit die Bilder wirklich zu euch passen." },
      { title: "Styling-Beratung", text: "Ihr bekommt Tipps zu Outfits, Farben und Accessoires. Aufeinander abgestimmt, aber nicht identisch – natürlich und harmonisch." },
      { title: "Sanfte Anleitung am Set", text: "Kein steifes Posieren. Ich gebe euch kleine Aufgaben: Flüstert euch etwas ins Ohr. Lauft aufeinander zu. Tanzt langsam. Die echten Momente passieren von allein." },
      { title: "Cinematic Nachbearbeitung", text: "Warme Töne, weiches Licht, filmische Stimmung – eure Bilder sehen aus wie Szenen aus eurem ganz persönlichen Film." },
      { title: "Digitale Premium-Galerie", text: "Hochauflösende Dateien, bereit für Wandbilder, Social Media und ein gemeinsames Album." },
    ],
    whyChooseUs: [
      "Cinematic Bildsprache, die Geschichten erzählt",
      "Erfahrung darin, auch Kameraschüchterne zu entspannen",
      "Natürlicher Bearbeitungsstil – authentisch und warm",
      "Mobil an eurem Lieblingsort",
      "Persönliche Betreuung und sanfte Anleitung",
      "Perfekt als Geschenk oder Pre-Wedding",
    ],
    faqs: [
      { question: "Wir sind kamerascheu – ist das schlimm?", answer: "Überhaupt nicht! Das sind die meisten meiner Paare. Ich leite euch sanft an und sorge dafür, dass ihr euch wohlfühlt. Nach den ersten 10 Minuten vergesst ihr, dass ich da bin." },
      { question: "Können wir verschiedene Locations nutzen?", answer: "Ja! Bei längeren Shootings können wir gerne 2–3 Locations einplanen – zum Beispiel vom Park zur Altstadt oder von der Wohnung ins Café." },
      { question: "Eignet sich das Shooting als Geschenk?", answer: "Perfekt! Ein Paar-Shooting ist ein persönliches und unvergessliches Geschenk für Verliebte, Verlobte oder Jubilare." },
      { question: "Was sollen wir anziehen?", answer: "Kleidet euch in ähnlichen Farbtönen, aber nicht identisch. Ich sende euch im Vorgespräch einen persönlichen Styling-Guide." },
      { question: "Können wir den Termin flexibel legen?", answer: "Ja, ich empfehle die goldene Stunde – 1–2 Stunden vor Sonnenuntergang – für das schönste Licht. Aber wir finden den perfekten Zeitpunkt für euch." },
    ],
    tips: [
      { title: "Natürlich interagieren", text: "Flüstert, lacht, kuschelt – die besten Paarfotos entstehen, wenn ihr einfach ihr selbst seid. Vergesst die Kamera." },
      { title: "Golden Hour nutzen", text: "Das weiche, warme Licht kurz vor Sonnenuntergang zaubert die romantischste Atmosphäre. Ich plane das Timing optimal." },
      { title: "Outfits harmonisieren", text: "Ähnliche Farbtöne, unterschiedliche Texturen – so wirkt ihr zusammengehörig, ohne verkleidet auszusehen." },
    ],
    closingHeadline: "Eure Liebe verdient mehr als einen Screenshot.",
    closingText: "Lasst uns die Momente festhalten, die nur euch gehören. In Bildern, die sich anfühlen wie eure Geschichte – weil sie es sind.",
    metaTitle: "Paar-Fotoshooting | ashfoto – Romantische Paarfotos",
    metaDescription: "Emotionale Paarfotos an eurem Lieblingsort. Pre-Wedding, Verlobung & Jahrestag. Cinematic Qualität. Jetzt Shooting buchen!",
  },

  // ─── HOCHZEIT ────────────────────────────────────────────────────
  {
    slug: "hochzeitsfotografie",
    serviceName: "Hochzeitsfotografie",
    title: "Hochzeitsfotografie",
    subtitle: "Euer wichtigster Tag – cinematic festgehalten",
    heroImage: imgHochzeit,
    heroTagline: "Ein Ja. Tausend Emotionen. Für die Ewigkeit.",
    description:
      "Euer Hochzeitstag ist ein Film, der nur einmal spielt. Jede Träne, jedes Lachen, jeder geflüsterte Schwur – ich bin da, um nichts zu verpassen. Diskret, professionell und mit einem Auge für die Momente, die niemand sonst sieht. Eure Hochzeitsfotos werden mehr sein als Bilder. Sie werden Erinnerungen.",
    emotionalIntro:
      "Es gibt einen Moment kurz vor der Trauung, in dem die Welt stillsteht. Das Herz rast, die Hände zittern, und dann – dann seht ihr euch. Alles andere verschwindet. Genau diesen Moment zu bewahren, ist mein Antrieb. Nicht das perfekt arrangierte Gruppenbild, sondern das echte, ungefilterte Gefühl. Die Träne eures Vaters. Das Lachen eurer besten Freundin. Den Blick, den nur ihr beide kennt. Das ist es, was Hochzeitsfotografie für mich bedeutet.",
    highlights: [
      "Getting Ready, Trauung, Feier & Party",
      "Pre-Wedding Shooting auf Wunsch zubuchbar",
      "Alle Bilder als digitale Dateien in voller Auflösung",
      "Zweiter Fotograf auf Wunsch buchbar",
      "Dokumentarischer Stil mit cinematic Touch",
      "Diskrete, professionelle Arbeitsweise",
    ],
    experienceSteps: [
      { title: "Ausführliches Vorgespräch", text: "Wir lernen uns kennen, besprechen euren Tagesablauf, eure Wünsche und die Must-Have-Momente. Ich möchte eure Geschichte verstehen, bevor ich sie erzähle." },
      { title: "Location-Scouting", text: "Auf Wunsch schaue ich mir eure Location vorab an, um die besten Spots für Porträts und Gruppenbilder zu finden – mit idealem Licht." },
      { title: "Euer Hochzeitstag", text: "Ich begleite euch so lange, wie ihr mich braucht – vom Getting Ready bis zum Tanz. Diskret, professionell und immer mit einem Auge für die besonderen Momente." },
      { title: "Cinematic Bearbeitung", text: "Jedes Bild wird einzeln bearbeitet – warme Farben, filmische Stimmung, zeitlose Ästhetik. Kein Trendfilter, der in 5 Jahren altmodisch aussieht." },
      { title: "Premium-Lieferung", text: "Innerhalb von 3–4 Wochen erhaltet ihr eure komplette Hochzeitsgalerie als hochauflösende Dateien." },
    ],
    whyChooseUs: [
      "Dokumentarischer Stil mit cinematic Ästhetik",
      "Diskrete Arbeitsweise – ich fange Momente ein, ohne zu stören",
      "Natürliche Bearbeitung, die in 30 Jahren noch zeitlos wirkt",
      "Flexible Pakete von standesamtlich bis Ganztag",
      "Persönliche Betreuung von der Planung bis zur Lieferung",
      "Erfahrung mit Hochzeiten jeder Größe und Kultur",
    ],
    faqs: [
      { question: "Wie viele Stunden sollten wir buchen?", answer: "Für eine standesamtliche Trauung reichen 2 Stunden. Für eine kirchliche Trauung mit Feier empfehle ich 4–8 Stunden, um wirklich jeden besonderen Moment festzuhalten." },
      { question: "Wann bekommen wir die Hochzeitsfotos?", answer: "Innerhalb von 3–4 Wochen nach der Hochzeit erhaltet ihr alle bearbeiteten Bilder als hochauflösende Dateien zum Download." },
      { question: "Können wir einen zweiten Fotografen buchen?", answer: "Ja! Bei größeren Hochzeiten empfehle ich einen zweiten Fotografen, der z.B. die Gästeperspektive oder das Getting Ready des Partners abdeckt." },
      { question: "Wie unauffällig arbeiten Sie?", answer: "Sehr diskret. Ich bewege mich im Hintergrund, nutze leise Ausrüstung und fange Momente ein, ohne sie zu unterbrechen. Die meisten Gäste vergessen, dass ein Fotograf da ist." },
      { question: "Machen Sie auch gestellte Gruppenfotos?", answer: "Natürlich, wenn ihr das wünscht. Wir erstellen vorab eine Liste und planen dafür einen festen Zeitslot ein – effizient und stressfrei." },
      { question: "Was, wenn es regnet?", answer: "Regen kann fantastische Bilder ergeben! Aber natürlich habe ich immer einen Plan B. Wir besprechen vorab Alternativen." },
    ],
    tips: [
      { title: "Zeitplan teilen", text: "Sendet mir euren detaillierten Tagesablauf, damit ich die wichtigsten Momente optimal antizipieren und planen kann." },
      { title: "First Look einplanen", text: "Ein First Look vor der Trauung gibt euch einen intimen, privaten Moment zu zweit – und oft die emotionalsten Fotos des Tages." },
      { title: "Gästeliste für Gruppenfotos", text: "Erstellt vorab eine kurze Liste der gewünschten Gruppenkonstellationen – Familie, Trauzeugen, Freunde – damit nichts vergessen wird." },
    ],
    closingHeadline: "Euer Tag. Eure Geschichte. Für immer.",
    closingText: "An eurem Hochzeitstag werdet ihr vieles fühlen – und vieles davon vergessen. Aber die Bilder werden euch erinnern. An jeden Blick, jede Umarmung, jeden Moment, der euch zu dem gemacht hat, was ihr seid: ein Paar, das sich traut.",
    metaTitle: "Hochzeitsfotograf | ashfoto – Cinematic Hochzeitsfotos",
    metaDescription: "Professionelle Hochzeitsfotografie – cinematic, emotional & zeitlos. Von Getting Ready bis Party. Jetzt anfragen!",
  },

  // ─── AKT & EROTIK ───────────────────────────────────────────────
  {
    slug: "akt-erotik-fotoshooting",
    serviceName: "Akt und Erotik Fotoshooting",
    title: "Akt & Erotik Fotoshooting",
    subtitle: "Dein Körper erzählt eine Geschichte. Lass sie sichtbar werden.",
    heroImage: imgAkt,
    heroTagline: "Ästhetik. Sinnlichkeit. Selbstbewusstsein.",
    description:
      "Ein Akt- oder Erotik-Shooting ist eine Reise zu dir selbst. Es geht nicht darum, perfekt zu sein – es geht darum, sich so zu zeigen, wie man sich fühlt: stark, verletzlich, schön. In einer Atmosphäre voller Respekt und Diskretion entstehen Bilder, die Kunst und Emotion vereinen.",
    emotionalIntro:
      "Deinen Körper anzunehmen ist eine der mutigsten Entscheidungen, die du treffen kannst. Ein Akt-Fotoshooting ist keine Zurschaustellung – es ist eine Feier. Eine Feier deiner Stärke, deiner Verletzlichkeit, deiner Schönheit, die nichts mit Maßen zu tun hat. Es sind Bilder, die dir sagen: Schau dich an. Du bist genug. Du bist mehr als genug. Du bist wunderschön.",
    highlights: [
      "Diskrete und respektvolle Arbeitsweise",
      "Boudoir, Dessous & künstlerischer Akt",
      "Professionelle Lichtführung für ästhetische Ergebnisse",
      "Ausführliches Beratungsgespräch vorab",
      "Maximale Privatsphäre – alle Bilder nur für euch",
      "Natürliche Nachbearbeitung ohne künstliche Retusche",
    ],
    experienceSteps: [
      { title: "Vertrauliches Vorgespräch", text: "Wir sprechen offen über eure Vorstellungen, Grenzen und Wünsche. Dieses Gespräch ist die Basis für ein Shooting, bei dem ihr euch sicher und wohl fühlt." },
      { title: "Styling & Vorbereitung", text: "Ich berate euch zu Outfits, Accessoires und Lichtstimmung. Ob Dessous, Tücher, Schmuck oder gar nichts – ihr bestimmt den Grad der Enthüllung." },
      { title: "Atmosphäre & Vertrauen", text: "Am Set herrscht eine ruhige, respektvolle Atmosphäre. Ich leite euch behutsam an und sorge dafür, dass ihr euch jederzeit wohl und sicher fühlt." },
      { title: "Kunstvolle Bearbeitung", text: "Jedes Bild wird mit größter Sorgfalt bearbeitet – Licht, Schatten, Kontrast. Ästhetik trifft Emotion. Kein übertriebenes Glätten, keine künstliche Perfektion." },
      { title: "Private Lieferung", text: "Eure Bilder werden ausschließlich an euch geliefert – in einem geschützten, passwortgesicherten Download." },
    ],
    whyChooseUs: [
      "Absolute Diskretion und Vertraulichkeit",
      "Respektvoller, professioneller Umgang",
      "Ästhetische Lichtführung für kunstvolle Ergebnisse",
      "Ihr bestimmt die Grenzen – immer",
      "Natürliche Bearbeitung ohne künstliche Retusche",
      "Erfahrung und Einfühlungsvermögen",
    ],
    faqs: [
      { question: "Ist das Shooting absolut diskret?", answer: "Ja, ohne Ausnahme. Alle Bilder sind ausschließlich für euch. Nichts wird ohne eure ausdrückliche, schriftliche Genehmigung veröffentlicht oder gezeigt." },
      { question: "Kann ich eine Begleitperson mitbringen?", answer: "Natürlich! Wenn euch das mehr Sicherheit gibt, bringt gerne eine Vertrauensperson mit. Eure Komfortzone ist mir wichtig." },
      { question: "Muss ich komplett unbekleidet sein?", answer: "Absolut nicht. Ihr bestimmt, wie weit ihr gehen möchtet. Von Dessous über teilverdeckt bis künstlerischer Akt – alles nach eurem Wunsch." },
      { question: "Für wen eignet sich ein Akt-Shooting?", answer: "Für jeden Menschen, unabhängig von Alter, Geschlecht oder Körperform. Es geht um Selbstliebe und Ästhetik – nicht um Standards." },
      { question: "Wie läuft die Bearbeitung ab?", answer: "Natürlich und respektvoll. Ich optimiere Licht und Farben, aber ich verändere euren Körper nicht. Ihr sollt aussehen wie ihr – nur im schönsten Licht." },
    ],
    tips: [
      { title: "Vorab offen kommunizieren", text: "Teilt mir eure Vorstellungen und Grenzen mit – ein ehrliches Vorgespräch ist die Basis für ein entspanntes, vertrauensvolles Shooting." },
      { title: "Verschiedene Outfits vorbereiten", text: "Bringt verschiedene Dessous, Tücher oder Accessoires mit. Mehr Auswahl bedeutet mehr Abwechslung in eurer Galerie." },
      { title: "Euch Zeit zum Ankommen nehmen", text: "Plant einen Moment der Ruhe vor dem Shooting ein. Ein tiefer Atemzug, ein guter Song – und dann legt ihr los." },
    ],
    closingHeadline: "Dein Körper. Deine Geschichte. Dein Moment.",
    closingText: "Es braucht Mut, sich so zu zeigen. Und genau dieser Mut macht diese Bilder so kraftvoll. Lass uns zusammen etwas schaffen, das dir zeigt, wie schön du bist.",
    metaTitle: "Akt & Erotik Fotoshooting | ashfoto – Ästhetische Aktfotos",
    metaDescription: "Ästhetisches Akt- & Erotik-Fotoshooting in diskreter Atmosphäre. Boudoir, Dessous & mehr. Professionell & respektvoll. Jetzt buchen!",
  },

  // ─── MÄNNER ──────────────────────────────────────────────────────
  {
    slug: "maenner-fotoshooting",
    serviceName: "Männer Fotoshooting",
    title: "Männer-Fotoshooting",
    subtitle: "Dein bestes Ich. Ohne Filter.",
    heroImage: imgMaenner,
    heroTagline: "Charakter. Haltung. Authentizität.",
    description:
      "Ob für dein Business-Profil, dein Dating-Leben oder einfach als persönliches Statement – ein Männer-Shooting bringt deine Persönlichkeit auf den Punkt. Keine Überinszenierung, kein künstliches Posieren. Markante Bilder mit Charakter, die zeigen, wer du bist.",
    emotionalIntro:
      "Männer vor der Kamera – das klingt für viele erstmal ungewohnt. Aber die Wahrheit ist: Jeder Mann hat eine Geschichte, die es wert ist, erzählt zu werden. Ob der selbstbewusste Unternehmer, der ruhige Denker oder der kreative Freigeist – professionelle Bilder geben dir die visuelle Stimme, die zu dir passt. Es geht nicht um Eitelkeit. Es geht um Wirkung.",
    highlights: [
      "Business-Porträts und Lifestyle-Fotografie",
      "Markante Lichtführung für ausdrucksstarke Bilder",
      "Ideal für LinkedIn, Xing, Dating & Social Media",
      "Verschiedene Looks in einem Shooting",
      "Natürliche Nachbearbeitung – kein künstlicher Look",
      "Cinematic Qualität für professionelle Wirkung",
    ],
    experienceSteps: [
      { title: "Kurzes Vorgespräch", text: "Wir klären, wofür du die Bilder brauchst – Business, Social Media, persönliches Branding? Danach stimme ich Licht, Stil und Stimmung auf dein Ziel ab." },
      { title: "Outfit-Beratung", text: "Ich gebe dir konkrete Tipps: Welche Farben wirken, welche Schnitte schmeicheln, wie viele Looks du mitbringen solltest." },
      { title: "Entspanntes Shooting", text: "Kein steifes Stehen vor der Kamera. Ich leite dich durch verschiedene Posen und Ausdrücke – natürlich und ohne Druck." },
      { title: "Professionelle Bearbeitung", text: "Markante Kontraste, natürliche Hauttöne, professionelles Finish – du siehst aus wie du, nur im besten Licht." },
      { title: "Digitale Premium-Dateien", text: "Hochauflösende Bilder, optimiert für Web und Print – bereit für jede Plattform." },
    ],
    whyChooseUs: [
      "Markante Bildsprache für Männer mit Anspruch",
      "Erfahrung darin, auch Anfänger vor der Kamera zu entspannen",
      "Natürliche Bearbeitung – keine Überretusche",
      "Verschiedene Looks in einem Shooting",
      "Professionelle Wirkung für Business & Personal Branding",
      "Mobil bei dir vor Ort oder an einer Location deiner Wahl",
    ],
    faqs: [
      { question: "Was soll ich anziehen?", answer: "Bring 2–3 Outfits mit: Hemd oder Anzug für Business, T-Shirt oder Jacket für Casual. So bekommst du verschiedene Looks für verschiedene Einsatzbereiche." },
      { question: "Eignen sich die Bilder für LinkedIn/Xing?", answer: "Perfekt! Professionelle Porträts für Business-Netzwerke sind einer der häufigsten Gründe für ein Männer-Shooting." },
      { question: "Wird stark retuschiert?", answer: "Nein. Ich setze auf natürliche Bearbeitung – du sollst aussehen wie du, nur professionell in Szene gesetzt. Kein Glätten, kein Verbiegen." },
      { question: "Ich war noch nie beim Fotoshooting – ist das ein Problem?", answer: "Überhaupt nicht. Die meisten meiner Kunden sind Anfänger vor der Kamera. Ich leite dich Schritt für Schritt an." },
      { question: "Wie lange dauert ein Männer-Shooting?", answer: "Je nach Paket 1–3 Stunden. Für verschiedene Looks und Locations empfehle ich mindestens 2 Stunden." },
    ],
    tips: [
      { title: "Vorher zum Friseur", text: "Geh 1–2 Tage vor dem Shooting zum Friseur. Frisch geschnittene Haare und ein gepflegter Bart machen einen großen Unterschied." },
      { title: "Ausgeschlafen kommen", text: "Guter Schlaf zeigt sich sofort: wache Augen, frische Haut, entspannter Ausdruck. Das wird auf den Bildern sichtbar." },
      { title: "Verschiedene Looks vorbereiten", text: "Mindestens 2–3 Outfits mitbringen – von formal bis casual. Jeder Look erzählt eine andere Geschichte." },
    ],
    closingHeadline: "Dein Image beginnt mit einem Bild.",
    closingText: "In einer visuellen Welt ist dein Foto oft der erste Eindruck. Lass es einer sein, der dir gerecht wird – authentisch, stark und professionell.",
    metaTitle: "Männer-Fotoshooting | ashfoto – Professionelle Männerporträts",
    metaDescription: "Professionelles Männer-Fotoshooting für Business, Social Media & Personal Branding. Markante Porträts mit Charakter. Jetzt buchen!",
  },

  // ─── BEAUTY & PORTRAIT ──────────────────────────────────────────
  {
    slug: "beauty-portrait-fotoshooting",
    serviceName: "Beauty und Portrait Fotoshooting",
    title: "Beauty & Portrait Fotoshooting",
    subtitle: "Dein Moment im Rampenlicht",
    heroImage: imgBeauty,
    heroTagline: "Schönheit ist kein Standard. Sie ist deine Geschichte.",
    description:
      "Jeder Mensch hat eine Seite, die im richtigen Licht strahlt. Ein Beauty-Fotoshooting ist deine Einladung, dich so zu sehen, wie du wirklich bist: ausdrucksstark, einzigartig, wunderschön. Professionelles Licht, cinematic Inszenierung und eine Atmosphäre, in der du dich fallen lassen kannst.",
    emotionalIntro:
      "Wann hast du das letzte Mal ein Foto von dir gesehen und gedacht: Ja, das bin ich? Nicht das hastige Selfie, nicht der zufällige Schnappschuss – sondern ein Bild, das dich zeigt, wie du wirklich bist? Ein Beauty-Fotoshooting gibt dir genau das. Einen Moment, in dem alles stimmt: das Licht, der Ausdruck, die Stimmung. Es ist kein Luxus. Es ist eine Liebeserklärung an dich selbst.",
    highlights: [
      "High-End Porträt- und Beauty-Fotografie",
      "Professionelle Lichtsetups für Glamour und Eleganz",
      "Make-up Beratung und Styling-Tipps",
      "Verschiedene Looks in einem Shooting",
      "Natürliche Retusche – kein künstlicher AI-Look",
      "Cinematic Bildsprache für ausdrucksstarke Porträts",
    ],
    experienceSteps: [
      { title: "Inspiration & Beratung", text: "Wir besprechen eure Vision: Glamourös, natürlich, edgy oder klassisch? Ich empfehle Looks, Farben und bei Bedarf eine professionelle Visagistin." },
      { title: "Styling-Vorbereitung", text: "Kommt vorbereitet oder lasst euch vorbereiten. Ich gebe euch einen detaillierten Guide zu Make-up, Haaren und Accessoires." },
      { title: "Das Shooting", text: "Professionelles Licht, verschiedene Setups, wechselnde Looks – ich leite euch durch jede Pose und fange eure beste Seite ein. Entspannt und mit Spaß." },
      { title: "Cinematic Bearbeitung", text: "Jedes Porträt wird einzeln bearbeitet – Farben, Kontraste, Hauttöne. Natürlich schön, nicht künstlich perfekt." },
      { title: "Digitale Premium-Galerie", text: "Eure ausgewählten Bilder in voller Auflösung – bereit für Social Media, Bewerbungen oder als besonderes Geschenk." },
    ],
    whyChooseUs: [
      "Professionelle Lichtführung für High-End-Ergebnisse",
      "Natürliche Bearbeitung – Schönheit, nicht Perfektion",
      "Verschiedene Looks und Setups in einem Shooting",
      "Erfahrung darin, Persönlichkeit sichtbar zu machen",
      "Cinematic Qualität für Porträts mit Wirkung",
      "Mobil bei euch vor Ort – jeder Raum wird zum Studio",
    ],
    faqs: [
      { question: "Soll ich mich vorher schminken?", answer: "Kommt dezent geschminkt oder ungeschminkt – je nach geplantem Look. Für aufwendige Make-up-Looks kann ich eine erfahrene Visagistin empfehlen." },
      { question: "Bekomme ich auch Ganzkörperfotos?", answer: "Natürlich! Wir machen sowohl Close-up Porträts als auch Halbkörper- und Ganzkörperaufnahmen – je nach Wunsch und gebuchtem Paket." },
      { question: "Kann ich das als Geschenk buchen?", answer: "Absolut! Ein Beauty-Shooting ist ein unvergessliches Erlebnis-Geschenk – für sich selbst oder für jemand Besonderen." },
      { question: "Wie viele Outfits kann ich mitbringen?", answer: "Je nach Dauer empfehle ich 2–4 verschiedene Looks. Von elegant bis lässig – Abwechslung macht die Galerie spannender." },
      { question: "Brauche ich Modelerfahrung?", answer: "Überhaupt nicht. Ich leite euch durch jede Pose und jeden Ausdruck. Ihr müsst nur auftauchen – den Rest mache ich." },
    ],
    tips: [
      { title: "Make-up für Fotos", text: "Mattierendes Make-up funktioniert am besten. Vermeidet starken Glitzer oder Shimmer, der auf Fotos zu stark reflektiert." },
      { title: "Accessoires einpacken", text: "Schmuck, Hüte, Schals, Sonnenbrillen – kleine Details können aus einem guten Bild ein großartiges machen." },
      { title: "Inspiration vorab teilen", text: "Schickt mir Pinterest-Boards oder Beispielbilder, die euch gefallen. So arbeite ich gezielt auf euren Wunsch-Look hin." },
    ],
    closingHeadline: "Du verdienst ein Bild, das dir gerecht wird.",
    closingText: "Kein Filter, kein Zufall – ein professionelles Porträt, das deine Persönlichkeit einfängt. Lass uns gemeinsam herausfinden, wie dein bestes Bild aussieht.",
    metaTitle: "Beauty & Portrait Fotoshooting | ashfoto – Professionelle Porträts",
    metaDescription: "Beauty- & Portrait-Fotoshooting mit cinematic Licht. Glamour-Shots & natürliche Porträts. Premium-Qualität. Jetzt buchen!",
  },

  // ─── MINI ────────────────────────────────────────────────────────
  {
    slug: "mini-shooting",
    serviceName: "Mini Shooting",
    title: "Mini-Shooting",
    subtitle: "Professionelle Bilder, kompakt und auf den Punkt",
    heroImage: imgMini,
    heroTagline: "30 Minuten. Professionelle Qualität. Kein Kompromiss.",
    description:
      "Nicht jedes Shooting muss einen ganzen Tag dauern. Das Mini-Shooting ist für alle, die schnell und unkompliziert professionelle Bilder brauchen – ohne dabei auf Qualität zu verzichten. In 30 oder 45 Minuten entstehen Bilder, die in derselben Premium-Qualität geliefert werden wie jedes andere Shooting.",
    emotionalIntro:
      "Manchmal braucht es keinen langen Prozess, um etwas Bedeutungsvolles zu schaffen. 30 Minuten können reichen, um ein Bild zu machen, das dich jahrelang begleitet. Dein neues Profilbild, ein Geschenk für jemand Besonderen, oder einfach der Moment, in dem du sagst: So sehe ich gerade aus. Und das ist gut so. Das Mini-Shooting ist der kompakte Beweis, dass professionelle Fotografie kein Luxus sein muss.",
    highlights: [
      "30 oder 45 Minuten – perfekt für einen vollen Terminkalender",
      "Ideal für Profilbilder, Social Media und Bewerbungen",
      "Mindestens 10 professionell bearbeitete Fotos",
      "Dieselbe Premium-Qualität wie bei allen anderen Shootings",
      "Perfekt als Einstieg in professionelle Fotografie",
      "Kompakt im Preis, groß in der Wirkung",
    ],
    experienceSteps: [
      { title: "Kurze Abstimmung", text: "Wir klären per Nachricht, was du brauchst – Porträt, Ganzkörper, Business oder Lifestyle. Ich plane das Setup entsprechend." },
      { title: "Effizientes Setup", text: "Ich komme vorbereitet mit dem passenden Licht und Equipment. Kein langes Aufbauen – wir starten direkt." },
      { title: "Fokussiertes Shooting", text: "In 30 oder 45 Minuten arbeiten wir konzentriert und zielgerichtet. Jede Minute zählt, jedes Bild sitzt." },
      { title: "Premium-Bearbeitung", text: "Auch beim Mini-Shooting bekommt ihr dieselbe cinematic Bearbeitungsqualität wie bei jedem anderen Paket." },
      { title: "Schnelle Lieferung", text: "Eure Bilder erhaltet ihr als hochauflösende Dateien – bereit für jeden Einsatz." },
    ],
    whyChooseUs: [
      "Premium-Qualität im kompakten Format",
      "Professionelle Bearbeitung – keine Abstriche",
      "Perfekt als Einstieg oder für schnelle Updates",
      "Mobil bei euch vor Ort",
      "Cinematic Bildsprache auch im Kurzformat",
      "Ideal als Geschenk",
    ],
    faqs: [
      { question: "Was ist der Unterschied zu einem normalen Shooting?", answer: "Das Mini-Shooting ist kürzer und fokussierter. Es eignet sich perfekt für Porträts, Profilbilder oder einfache Setups. Für aufwendigere Shootings mit mehreren Locations oder Outfit-Wechseln empfehle ich ein längeres Paket." },
      { question: "Wie viele Bilder bekomme ich?", answer: "Mindestens 10 professionell bearbeitete Bilder – je nach gewähltem Paket auch mehr." },
      { question: "Für wen eignet sich das Mini-Shooting?", answer: "Für alle, die professionelle Bilder möchten, ohne einen ganzen Tag zu investieren. Einzelpersonen, Paare, kleine Gruppen – oder als Geschenk." },
      { question: "Ist die Qualität wirklich dieselbe?", answer: "Ja! Ihr bekommt dieselbe Kamera, dasselbe Licht, dieselbe Bearbeitungsqualität. Der einzige Unterschied ist die Dauer." },
      { question: "Kann ich auch ein Mini-Shooting für mein Kind buchen?", answer: "Natürlich! Mini-Shootings eignen sich auch wunderbar für Kinderporträts oder kleine Geschwister-Sessions." },
    ],
    tips: [
      { title: "Fertig gestylt kommen", text: "Bei einem kurzen Shooting zählt jede Minute. Kommt fertig gestylt, mit geplantem Outfit und bereit zum Loslegen." },
      { title: "Klare Erwartungen setzen", text: "Sagt mir vorher, wofür ihr die Bilder braucht – Porträt, Ganzkörper, welcher Hintergrund. So nutzen wir die Zeit optimal." },
      { title: "Weniger Looks, mehr Fokus", text: "Konzentriert euch auf 1–2 Outfits statt viele Wechsel. Qualität und Ausdruck sind wichtiger als Quantität." },
    ],
    closingHeadline: "30 Minuten können alles verändern.",
    closingText: "Dein neues Profilbild, ein Geschenk, ein Moment für dich – manchmal braucht es nicht mehr als eine halbe Stunde, um Bilder zu bekommen, die dich jahrelang begleiten.",
    metaTitle: "Mini-Fotoshooting | ashfoto – Schnell & Premium",
    metaDescription: "Mini-Shooting in 30 oder 45 Minuten – professionelle Qualität im Kompaktformat. Ideal für Profilbilder & Social Media. Jetzt buchen!",
  },

  // ─── TIER ────────────────────────────────────────────────────────
  {
    slug: "tier-fotoshooting",
    serviceName: "Tier Fotoshooting",
    title: "Tier-Fotoshooting",
    subtitle: "Dein treuster Begleiter verdient die besten Bilder",
    heroImage: imgTier,
    heroTagline: "Vier Pfoten. Ein Blick. Unendliche Liebe.",
    description:
      "Ob Hund, Katze, Pferd oder ein ganz besonderes Tier – eure Fellnase ist Familie. Und Familie verdient professionelle Bilder. Ich komme zu euch und fange die Persönlichkeit eures Tieres ein: den treuen Blick, die wilde Energie, die stille Zuneigung. Geduldig, liebevoll und mit dem richtigen Gespür.",
    emotionalIntro:
      "Sie können nicht sprechen, aber sie sagen alles mit einem Blick. Euer Haustier ist mehr als ein Tier – es ist ein Familienmitglied, ein Seelenverwandter, ein stiller Begleiter durch gute und schlechte Tage. Und eines Tages werdet ihr froh sein, dass ihr diese Bilder habt. Bilder, die zeigen, wie euer Hund die Ohren spitzt, wie eure Katze im Sonnenlicht döst, wie euer Pferd durch die Wiese galoppiert. Das sind keine Tierfotos. Das sind Liebeserklärungen.",
    highlights: [
      "Hunde, Katzen, Pferde und alle anderen Tiere",
      "Shooting in gewohnter Umgebung oder draußen",
      "Mensch-Tier-Porträts möglich",
      "Geduld und Erfahrung mit Tieren aller Temperamente",
      "Action-Shots und ruhige, intime Porträts",
      "Cinematic Bearbeitung für ausdrucksstarke Tierbilder",
    ],
    experienceSteps: [
      { title: "Kennenlernen des Tieres", text: "Im Vorgespräch erfahre ich alles über euer Tier – Charakter, Vorlieben, Leckerli-Favoriten. So kann ich mich optimal vorbereiten." },
      { title: "Vertrauensaufbau", text: "Am Set nehme ich mir Zeit, dass euer Tier mich kennenlernt. Kein Stress, kein Druck – wir arbeiten im Tempo eures Lieblings." },
      { title: "Das Shooting", text: "Von ruhigen Porträts bis hin zu Action-Shots – ich fange die volle Bandbreite eures Tieres ein. Leckerlis und Spielzeug helfen dabei." },
      { title: "Liebevolle Bearbeitung", text: "Jedes Bild wird mit Sorgfalt bearbeitet – natürliche Farben, cinematic Stimmung, der Charakter eures Tieres im Fokus." },
      { title: "Digitale Galerie", text: "Hochauflösende Dateien zum Download – perfekt für Wandbilder, Social Media oder ein persönliches Erinnerungsalbum." },
    ],
    whyChooseUs: [
      "Geduld und Liebe zu Tieren jeder Art",
      "Erfahrung mit allen Temperamenten – von ruhig bis wild",
      "Cinematic Bildsprache auch für Tierporträts",
      "Mobil in der Umgebung eures Tieres",
      "Action-Shots mit professioneller Ausrüstung",
      "Mensch-Tier-Bilder als emotionales Highlight",
    ],
    faqs: [
      { question: "Mein Hund ist sehr aufgedreht – geht das?", answer: "Absolut! Energiegeladene Tiere ergeben oft die lebendigsten und ausdrucksstärksten Bilder. Ich habe Erfahrung mit allen Temperamenten." },
      { question: "Können mehrere Tiere fotografiert werden?", answer: "Natürlich! Ob Rudel, Doppelporträt oder gemischte Tiergruppe – alle sind willkommen." },
      { question: "Kann ich auch mit aufs Bild?", answer: "Unbedingt! Mensch-Tier-Porträts gehören zu den emotionalsten Bildern – die Bindung zwischen euch zeigt sich auf jedem Foto." },
      { question: "Was, wenn mein Tier nicht stillhält?", answer: "Das ist völlig normal und kein Problem. Ich arbeite mit schnellen Verschlusszeiten und fange Bewegung professionell ein. Stillsitzen ist keine Voraussetzung." },
      { question: "Wo findet das Shooting statt?", answer: "Am besten dort, wo sich euer Tier wohlfühlt – euer Garten, der Lieblingspark, ein Feld, der Stall. Ich komme zu euch." },
    ],
    tips: [
      { title: "Leckerlis mitnehmen", text: "Die Lieblingsleckerlis eures Tieres sind das beste Werkzeug für Aufmerksamkeit und natürliche Reaktionen." },
      { title: "Vorher toben lassen", text: "Ein kurzer Spaziergang oder eine Spielrunde vor dem Shooting hilft, überschüssige Energie abzubauen – besonders bei Hunden." },
      { title: "Lieblingsplatz nutzen", text: "Fotografiert euer Tier dort, wo es sich am wohlsten fühlt. Vertraute Umgebung = entspanntes Tier = die besten Bilder." },
    ],
    closingHeadline: "Sie sind nicht für immer da. Aber die Bilder können es sein.",
    closingText: "Euer Tier schenkt euch bedingungslose Liebe. Schenkt ihm Bilder, die diese Liebe festhalten – für immer.",
    metaTitle: "Tier-Fotoshooting | ashfoto – Professionelle Tierfotos",
    metaDescription: "Professionelle Tierfotos bei euch zuhause oder draußen. Hunde, Katzen, Pferde & mehr. Geduldig, liebevoll & cinematic. Jetzt buchen!",
  },

  // ─── MITARBEITERFOTOS ────────────────────────────────────────────
  {
    slug: "mitarbeiterfotos",
    serviceName: "Mitarbeiterfotos",
    title: "Mitarbeiterfotos",
    subtitle: "Professionelle Gesichter für ein professionelles Unternehmen",
    heroImage: imgMitarbeiter,
    heroTagline: "Ihr Team. Ihre Marke. Authentisch & professionell.",
    description:
      "Der erste Eindruck entscheidet – und der beginnt oft mit einem Bild. Professionelle Mitarbeiterfotos stärken Ihr Employer Branding, schaffen Vertrauen bei Kunden und Bewerbern und geben Ihrem Unternehmen ein Gesicht. Ich komme direkt in Ihr Büro und fotografiere Ihr Team vor Ort – einheitlich, effizient und auf höchstem Niveau.",
    emotionalIntro:
      "Menschen kaufen von Menschen. Bewerber entscheiden sich für Gesichter, nicht für Logos. Professionelle Mitarbeiterfotos sind keine Ausgabe – sie sind eine Investition in die Außenwirkung Ihres Unternehmens. Sie zeigen: Hier arbeiten echte Menschen, die stolz auf das sind, was sie tun. Authentische Porträts statt austauschbare Stock-Bilder – das macht den Unterschied zwischen einem Unternehmen und einer Marke.",
    highlights: [
      "On-Location direkt in Ihrem Unternehmen",
      "Einheitlicher Look für das gesamte Team",
      "Ideal für Website, LinkedIn und Marketingmaterial",
      "Effizienter Ablauf – wenig Zeitaufwand pro Mitarbeiter",
      "Nachzügler im gleichen Stil nachshootbar",
      "Professionelle Lichtsetups für konsistente Ergebnisse",
    ],
    experienceSteps: [
      { title: "Briefing & Planung", text: "Wir besprechen Ihren gewünschten Stil, Hintergrund, Dresscode und die Anzahl der Mitarbeiter. Ich plane den Ablauf effizient, um den Arbeitsalltag minimal zu stören." },
      { title: "Setup vor Ort", text: "Ich bringe portables Hintergrundsystem und professionelle Beleuchtung mit. Ein ruhiger Raum von ca. 3x4m reicht als temporäres Studio." },
      { title: "Effizientes Shooting", text: "Ca. 10–15 Minuten pro Person. Jeder Mitarbeiter bekommt eine kurze Anleitung für natürlichen Ausdruck und professionelle Haltung." },
      { title: "Einheitliche Bearbeitung", text: "Alle Bilder werden im selben Stil bearbeitet – einheitliche Farben, konsistenter Look, professionelles Finish." },
      { title: "Strukturierte Lieferung", text: "Sie erhalten die Bilder strukturiert nach Namen, optimiert für Web und Print – bereit für den sofortigen Einsatz." },
    ],
    whyChooseUs: [
      "Effiziente Abläufe mit minimalem Zeitaufwand",
      "Konsistenter Look über das gesamte Team hinweg",
      "Professionelle Lichtführung auch in kleinen Räumen",
      "Nachzügler im identischen Stil nachshootbar",
      "Natürliche Bearbeitung für authentische Porträts",
      "Erfahrung mit Teams jeder Größe",
    ],
    faqs: [
      { question: "Wie lange dauert es pro Mitarbeiter?", answer: "Ca. 10–15 Minuten pro Person inklusive kurzer Anleitung. Bei einem Team von 20 Personen sind wir in ca. 4 Stunden fertig." },
      { question: "Können Sie einen einheitlichen Hintergrund mitbringen?", answer: "Ja! Ich bringe portable Hintergrundsysteme und professionelle Beleuchtung mit – egal ob weißer, grauer oder individueller Hintergrund." },
      { question: "Was passiert, wenn Mitarbeiter am Tag nicht können?", answer: "Kein Problem. Ich shoote Nachzügler zu einem späteren Termin im identischen Stil – nahtlos ins Team integriert." },
      { question: "Welchen Dresscode empfehlen Sie?", answer: "Das hängt von Ihrer Branche ab. Ich berate Sie gerne – von Business-formal bis Smart-casual finden wir den passenden Look." },
      { question: "Können wir auch Team- und Gruppenfotos machen?", answer: "Natürlich! Neben Einzelporträts biete ich auch Team-Gruppenbilder und Abteilungsfotos an." },
    ],
    tips: [
      { title: "Dresscode vorab kommunizieren", text: "Informieren Sie Ihr Team rechtzeitig über den gewünschten Kleidungsstil – einheitliche Ergebnisse beginnen mit einheitlicher Vorbereitung." },
      { title: "Ruhigen Raum bereitstellen", text: "Ein Raum mit ca. 3x4m Platz, idealerweise mit Tageslicht, reicht als temporäres Studio. Ich bringe den Rest mit." },
      { title: "Terminliste erstellen", text: "Vergeben Sie feste 15-Minuten-Slots pro Mitarbeiter. So weiß jeder, wann er dran ist, und der Arbeitsablauf wird minimal gestört." },
    ],
    closingHeadline: "Ihr Team ist Ihre stärkste Marke.",
    closingText: "Zeigen Sie der Welt die Gesichter hinter Ihrem Unternehmen – authentisch, professionell und voller Charakter. Denn Menschen vertrauen Menschen, nicht Logos.",
    metaTitle: "Mitarbeiterfotos | ashfoto – Business-Porträts on Location",
    metaDescription: "Professionelle Mitarbeiterfotos direkt in Ihrem Unternehmen. Einheitlich, effizient & professionell. Jetzt anfragen!",
  },

  // ─── EVENT ───────────────────────────────────────────────────────
  {
    slug: "event-fotografie",
    serviceName: "Live und Event Fotografie",
    title: "Live & Event Fotografie",
    subtitle: "Jeder Moment zählt – keiner wiederholt sich",
    heroImage: imgEvent,
    heroTagline: "Stimmung. Emotion. Unvergesslich festgehalten.",
    description:
      "Ein Event passiert nur einmal. Die Energie, die Begegnungen, die Überraschungsmomente – ich bin da, um sie festzuhalten. Diskret, professionell und mit einem Auge für die Szenen, die niemand anderes sieht. Von Firmenevents über Konzerte bis hin zu privaten Feiern – authentische Reportagen, die die Stimmung perfekt einfangen.",
    emotionalIntro:
      "Events sind flüchtig. Die Rede, die alle berührt. Der Moment, als die Überraschung enthüllt wird. Das spontane Lachen am Stehtisch. In Echtzeit vergehen diese Momente in Sekunden. Aber in guten Fotos leben sie weiter. Event-Fotografie ist die Kunst, Atmosphäre einzufangen – nicht nur Gesichter, sondern die Energie eines ganzen Abends.",
    highlights: [
      "Diskrete, dokumentarische Arbeitsweise",
      "Firmenevents, Partys, Konzerte & mehr",
      "Professionelle Ausrüstung auch bei schwierigem Licht",
      "Alle Fotos als digitale Dateien in Galerie-Qualität",
      "Schnelle Lieferung – Highlight-Bilder auf Wunsch am nächsten Tag",
      "Live-Content für Social Media auf Anfrage",
    ],
    experienceSteps: [
      { title: "Ausführliches Briefing", text: "Wir besprechen den Ablauf, Must-Have-Momente, VIPs und die gewünschte Bildsprache. Je besser ich vorbereitet bin, desto besser die Ergebnisse." },
      { title: "Diskrete Anwesenheit", text: "Ich bewege mich unauffällig durch die Veranstaltung, fange Stimmungen ein und halte die wichtigsten Momente fest – ohne Gäste zu stören." },
      { title: "Professionelle Technik", text: "Auch bei schwierigem Eventlicht – Bühnenbeleuchtung, dunkle Räume, Gegenlicht – liefere ich konstant hochwertige Ergebnisse." },
      { title: "Schnelle Bearbeitung", text: "Auf Wunsch liefere ich ausgewählte Highlight-Bilder bereits am nächsten Tag für Social Media und Presse." },
      { title: "Komplette Galerie", text: "Die vollständige, bearbeitete Galerie erhaltet ihr innerhalb von 7 Tagen als digitale Dateien." },
    ],
    whyChooseUs: [
      "Diskret und unsichtbar – die besten Bilder entstehen unbemerkt",
      "Professionell auch unter schwierigen Lichtbedingungen",
      "Schnelle Lieferung für zeitnahe Social-Media-Posts",
      "Dokumentarischer Stil mit cinematic Touch",
      "Erfahrung mit Events jeder Größe und Art",
      "Flexible Buchungsoptionen – stundenweise oder ganztags",
    ],
    faqs: [
      { question: "Wie unauffällig arbeiten Sie?", answer: "Sehr diskret. Ich bewege mich im Hintergrund, nutze leise Ausrüstung und fange Momente ein, ohne sie zu unterbrechen. Die meisten Gäste bemerken mich kaum." },
      { question: "Wie schnell bekommen wir die Bilder?", answer: "Highlight-Bilder auf Wunsch am nächsten Tag. Die komplette, bearbeitete Galerie innerhalb von 7 Tagen." },
      { question: "Können wir bestimmte Momente vorab festlegen?", answer: "Natürlich! Erstellt eine Liste der Must-Have-Momente – Reden, Ehrungen, Showacts, VIP-Begrüßung – und ich plane entsprechend." },
      { question: "Arbeiten Sie auch bei schlechtem Licht?", answer: "Ja. Ich bringe professionelle Ausrüstung mit, die auch bei schwierigem Event-Licht, Bühnenbeleuchtung oder in dunklen Räumen exzellente Ergebnisse liefert." },
      { question: "Können Sie auch Live-Content für Social Media liefern?", answer: "Ja! Auf Anfrage liefere ich ausgewählte Bilder noch während des Events für sofortige Social-Media-Posts." },
    ],
    tips: [
      { title: "Detaillierten Ablaufplan teilen", text: "Je besser ich den Ablauf kenne, desto besser kann ich die wichtigsten Momente antizipieren und mich optimal positionieren." },
      { title: "Ansprechpartner benennen", text: "Bestimmt eine Person vor Ort, die mir bei Fragen helfen und den Zugang zu allen Bereichen ermöglichen kann." },
      { title: "Location vorab mitteilen", text: "Informiert mich über die Lichtverhältnisse, Raumgröße und besondere Gegebenheiten – so komme ich perfekt vorbereitet." },
    ],
    closingHeadline: "Events sind flüchtig. Bilder bleiben.",
    closingText: "Die Energie, die Begegnungen, die Stimmung eures Events – lasst sie nicht mit dem letzten Applaus verschwinden. Haltet fest, was diesen Abend besonders gemacht hat.",
    metaTitle: "Event-Fotografie | ashfoto – Professionelle Eventfotos",
    metaDescription: "Professionelle Event-Fotografie für Firmenevents, Konzerte & Partys. Diskret, cinematic & authentisch. Jetzt anfragen!",
  },

  // ─── MESSE ───────────────────────────────────────────────────────
  {
    slug: "messe-fotografie",
    serviceName: "Messe Fotografie",
    title: "Messe-Fotografie",
    subtitle: "Ihr Messeauftritt – professionell dokumentiert, sofort nutzbar",
    heroImage: imgMesse,
    heroTagline: "Ihre Marke. Ihr Auftritt. Professionell festgehalten.",
    description:
      "Ein Messeauftritt ist eine Investition. Professionelle Bilder maximieren den Return. Ich dokumentiere Ihren Stand, Ihre Produkte, Ihre Interaktionen mit Besuchern und die Energie des Events – ideal für Social Media, Presse, interne Kommunikation und Ihr Marketing-Archiv.",
    emotionalIntro:
      "Messen sind mehr als Standbauten und Broschüren. Sie sind Begegnungen, Handshakes, Begeisterung für Ihr Produkt. Die Energie auf einer Messe lässt sich nicht in einer PowerPoint einfangen – aber in professionellen Bildern. Bilder, die Ihren Messeauftritt lebendig halten, lange nachdem die Halle geschlossen hat. Bilder, die zeigen: Hier passiert etwas.",
    highlights: [
      "Standfotos, Produktdetails & Besucherinteraktion",
      "Live-Content für Social Media während der Messe",
      "Porträts des Standpersonals",
      "Professionell auch bei herausfordernder Messebeleuchtung",
      "Same-Day-Delivery für Social Media auf Anfrage",
      "Mehrtages-Pakete für größere Messen verfügbar",
    ],
    experienceSteps: [
      { title: "Briefing & CI-Abstimmung", text: "Wir besprechen Ihre Ziele, gewünschte Motive und Corporate-Design-Richtlinien. Die Bildsprache passt sich Ihrer Marke an." },
      { title: "Vorher-Fotos", text: "Die besten Standfotos entstehen vor Messebeginn, wenn alles perfekt aufgebaut ist – ohne Besuchertrubel." },
      { title: "Live-Dokumentation", text: "Während der Messe fange ich Besucherinteraktionen, Produktdemos, Vorträge und die Atmosphäre am Stand ein." },
      { title: "Schnelle Bearbeitung", text: "Auf Wunsch liefere ich ausgewählte Bilder noch am selben Tag für Ihre Social-Media-Kanäle." },
      { title: "Komplette Lieferung", text: "Nach der Messe erhalten Sie die vollständige, bearbeitete Galerie – strukturiert und bereit für Ihr Marketing." },
    ],
    whyChooseUs: [
      "Erfahrung mit Messeumgebungen und deren Lichtbedingungen",
      "Same-Day-Content für zeitnahe Social-Media-Posts",
      "Bildsprache, die sich Ihrem Corporate Design anpasst",
      "Effizient und professionell – auch über mehrere Tage",
      "Diskrete Arbeitsweise ohne Störung der Messeabläufe",
      "Strukturierte Lieferung für sofortigen Einsatz",
    ],
    faqs: [
      { question: "Können Sie für mehrere Messetage gebucht werden?", answer: "Natürlich! Ich biete Mehrtages-Pakete an. Kontaktieren Sie mich für ein individuelles Angebot, das zu Ihrem Messeplan passt." },
      { question: "Liefern Sie Bilder am selben Tag?", answer: "Ja – auf Anfrage liefere ich ausgewählte Highlight-Bilder noch am selben Tag für Ihre Social-Media-Kanäle." },
      { question: "Können Sie auch Produktfotos am Stand machen?", answer: "Ja! Neben der Reportage kann ich auch gezielte Produktfotos und Detailaufnahmen anfertigen – ideal als Ergänzung." },
      { question: "Wie passen Sie sich an unser Corporate Design an?", answer: "Im Briefing besprechen wir Ihre CI-Richtlinien, Farbwelt und gewünschte Bildsprache. Ich passe meinen Bearbeitungsstil entsprechend an." },
      { question: "Was brauchen Sie von uns vor Ort?", answer: "Einen kurzen Ablaufplan und einen Ansprechpartner am Stand. Den Rest bringe ich mit." },
    ],
    tips: [
      { title: "Stand vor dem Ansturm fotografieren", text: "Die besten Standfotos entstehen vor Messebeginn – alles ist aufgebaut, die Beleuchtung stimmt, keine Menschenmassen." },
      { title: "CI-Briefing vorab senden", text: "Teilen Sie mir Ihre Corporate-Design-Richtlinien mit, damit die Bildsprache nahtlos zu Ihrem Markenauftritt passt." },
      { title: "Social-Media-Highlights planen", text: "Definieren Sie vorab, welche Momente und Motive für Ihre Online-Kanäle besonders wichtig sind." },
    ],
    closingHeadline: "Ihr Messeauftritt verdient mehr als ein Handyfoto.",
    closingText: "Investieren Sie in Bilder, die Ihren Messeauftritt professionell dokumentieren und Ihr Marketing langfristig stärken. Die Messe endet – Ihre Bilder arbeiten weiter.",
    metaTitle: "Messe-Fotografie | ashfoto – Professionelle Messefotos",
    metaDescription: "Professionelle Messe-Fotografie – Standfotos, Produkte & Live-Content. Same-Day für Social Media. Jetzt anfragen!",
  },

  // ─── FOOD & PRODUKT ──────────────────────────────────────────────
  {
    slug: "food-produkt-fotografie",
    serviceName: "Food und Produkt Fotografie",
    title: "Food & Produkt Fotografie",
    subtitle: "Bilder, die Appetit machen und verkaufen",
    heroImage: imgFood,
    heroTagline: "Ihr Produkt. Perfekt inszeniert. Bereit zu überzeugen.",
    description:
      "In einer visuellen Welt entscheidet das Bild, ob jemand zugreift oder weiterscrollt. Professionelle Food- und Produktfotos sind kein Luxus – sie sind der Unterschied zwischen 'sieht gut aus' und 'das muss ich haben'. Ich inszeniere eure Produkte so, dass sie nicht nur gesehen, sondern begehrt werden.",
    emotionalIntro:
      "Ein Bild kann den Unterschied zwischen einem Kauf und einem Weiterscrollen ausmachen. In einer Welt voller visueller Reize brauchen eure Produkte mehr als ein Handyfoto mit Tageslicht. Sie brauchen eine Geschichte, eine Inszenierung, die den Betrachter zum Greifen nah heranholt. Professionelle Produktfotografie ist die stillste und wirkungsvollste Werbung, die es gibt.",
    highlights: [
      "Food-Fotografie für Restaurants, Cafés und Catering",
      "Produktfotos für Online-Shops, Kataloge und Werbung",
      "Professionelles Styling und Komposition inklusive",
      "Freisteller und Lifestyle-Aufnahmen",
      "Optimiert für Print, Web und Social Media",
      "Individuelle Inszenierung passend zu eurer Marke",
    ],
    experienceSteps: [
      { title: "Briefing & Mood-Board", text: "Wir besprechen euren Stil, eure Marke und die gewünschte Bildsprache. Ein Mood-Board hilft, die gemeinsame Vision zu definieren." },
      { title: "Planung & Vorbereitung", text: "Ich plane das Setup, die Hintergründe, das Licht und die Komposition. Bei Food-Shootings stimme ich den Zeitplan auf die Frische der Gerichte ab." },
      { title: "Professionelle Inszenierung", text: "Jedes Produkt wird sorgfältig in Szene gesetzt – von der Perspektive über die Beleuchtung bis hin zu Details wie Dampf, Textur und Reflexion." },
      { title: "Gezielte Nachbearbeitung", text: "Farbkorrektur, Freisteller, Retouching – jedes Bild wird für den jeweiligen Einsatzzweck optimiert." },
      { title: "Flexible Lieferung", text: "Ihr erhaltet eure Bilder in den gewünschten Formaten – Web-optimiert, Print-ready oder als Freisteller mit transparentem Hintergrund." },
    ],
    whyChooseUs: [
      "Professionelle Inszenierung, die Produkte zum Leben erweckt",
      "Erfahrung mit Food, Kosmetik, Mode und Consumer Products",
      "Mobil bei euch vor Ort oder an einer Location eurer Wahl",
      "Bildsprache, die sich eurer Marke anpasst",
      "Flexible Formate für Web, Print und Social Media",
      "Individuelle Angebote für jedes Projektvolumen",
    ],
    faqs: [
      { question: "Bringen Sie Food-Styling-Equipment mit?", answer: "Ja! Ich bringe grundlegendes Styling-Equipment mit. Für besonders aufwendige Food-Setups empfehle ich einen professionellen Food-Stylisten – den vermittle ich gerne." },
      { question: "Wie viele Produkte pro Shooting?", answer: "Das hängt von der Komplexität ab. Als Richtwert: ca. 5–10 Produkte pro Stunde bei einfachen Setups. Bei aufwendigen Inszenierungen entsprechend weniger." },
      { question: "Wie läuft die Buchung ab?", answer: "Food- und Produktfotografie wird individuell kalkuliert. Kontaktiert mich mit euren Vorstellungen und ich erstelle ein maßgeschneidertes Angebot." },
      { question: "Können Sie auch Freisteller erstellen?", answer: "Ja! Ich liefere Bilder mit freigestelltem Hintergrund, perfekt für Online-Shops, Kataloge und Werbematerial." },
      { question: "Passen Sie den Stil an unsere Marke an?", answer: "Absolut. Im Briefing definieren wir gemeinsam die Bildsprache, die zu eurer Markenidentität passt – von clean und minimalistisch bis rustikal und lebendig." },
    ],
    tips: [
      { title: "Produkte perfekt vorbereiten", text: "Stellt sicher, dass alle Produkte sauber, unbeschädigt und in ausreichender Menge vorhanden sind. Bei Food: alles frisch und zum optimalen Zeitpunkt bereit." },
      { title: "Mood-Board erstellen", text: "Sammelt Beispielbilder und Referenzen, die euch gefallen. So treffen wir von Anfang an den richtigen Ton und vermeiden Umwege." },
      { title: "Hintergründe bedenken", text: "Überlegt, ob ihr cleane Freisteller, Lifestyle-Settings oder kontextuelle Inszenierungen möchtet – das beeinflusst die gesamte Planung." },
    ],
    closingHeadline: "Gute Produkte verdienen großartige Bilder.",
    closingText: "In einer Welt, die scrollt, muss euer Produkt in einer Sekunde überzeugen. Lasst uns Bilder schaffen, die nicht nur zeigen, was ihr macht – sondern warum es sich lohnt.",
    metaTitle: "Food & Produkt Fotografie | ashfoto – Professionelle Produktfotos",
    metaDescription: "Professionelle Food- & Produktfotografie. Appetitliche Bilder, die verkaufen. Für Restaurants, Online-Shops & Marketing. Jetzt anfragen!",
  },
];

export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return SERVICES_DATA.find(s => s.slug === slug);
};
