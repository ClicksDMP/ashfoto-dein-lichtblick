import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download } from "lucide-react";
import { SERVICE_ICON_MAP } from "@/lib/serviceIcons";
import type { LucideIcon } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

/* ── helpers ────────────────────────────────────────── */

const LOGO_LABEL = "ashfoto";

const makeLogoSVG = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50">
  <style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;display=swap');</style>
  <text x="100" y="38" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="700" font-size="36" fill="${color}">${LOGO_LABEL}</text>
</svg>`;

const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadSVGString = (svg: string, name: string) =>
  downloadBlob(new Blob([svg], { type: "image/svg+xml" }), name);

const renderLogoPNG = async (
  canvas: HTMLCanvasElement,
  color: string,
  name: string
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const scale = 4;
  canvas.width = 400 * scale;
  canvas.height = 100 * scale;
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, 400, 100);
  await document.fonts.load("bold 72px 'Playfair Display'");
  ctx.font = "bold 72px 'Playfair Display', serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(LOGO_LABEL, 200, 50);
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, name);
  }, "image/png");
};

const makeIconSVG = (IconComponent: LucideIcon, color: string, size = 128) => {
  const markup = renderToStaticMarkup(
    createElement(IconComponent, {
      size,
      color,
      strokeWidth: 1.5,
    })
  );
  // Wrap in proper SVG with xmlns
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${markup.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")}</svg>`;
};

const renderIconPNG = async (
  canvas: HTMLCanvasElement,
  svgString: string,
  name: string,
  size = 512
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  const img = new Image();
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
  ctx.drawImage(img, 0, 0, size, size);
  URL.revokeObjectURL(url);
  canvas.toBlob((b) => {
    if (b) downloadBlob(b, name);
  }, "image/png");
};

/* ── nice labels for slugs ──────────────────────────── */

const SLUG_LABELS: Record<string, string> = {
  "familien-fotoshooting": "Familie",
  "baby-fotoshooting": "Baby",
  "newborn-fotoshooting": "Newborn",
  "babybauch-fotoshooting": "Babybauch",
  "kinder-fotoshooting": "Kinder",
  "freunde-fotoshooting": "Freunde",
  "paar-fotoshooting": "Paar",
  "hochzeitsfotografie": "Hochzeit",
  "akt-erotik-fotoshooting": "Akt & Erotik",
  "maenner-fotoshooting": "Männer",
  "beauty-portrait-fotoshooting": "Beauty & Portrait",
  "mini-shooting": "Mini Shooting",
  "tier-fotoshooting": "Tier",
  "mitarbeiterfotos": "Mitarbeiter",
  "event-fotografie": "Event",
  "messe-fotografie": "Messe",
  "food-produkt-fotografie": "Food & Produkt",
};

/* ── components ─────────────────────────────────────── */

interface DownloadButtonsProps {
  onSVG: () => void;
  onPNG: () => void;
  generating: boolean;
  small?: boolean;
}

const DownloadButtons = ({ onSVG, onPNG, generating, small }: DownloadButtonsProps) => (
  <div className={`flex gap-2 ${small ? "flex-col" : ""}`}>
    <Button size={small ? "sm" : "default"} variant="outline" onClick={onSVG} className="gap-1.5">
      <Download className="w-3.5 h-3.5" /> SVG
    </Button>
    <Button size={small ? "sm" : "default"} variant="outline" onClick={onPNG} disabled={generating} className="gap-1.5">
      <Download className="w-3.5 h-3.5" /> PNG
    </Button>
  </div>
);

const AdminLogo = () => {
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleLogoPNG = async (color: string, label: string) => {
    if (!canvasRef.current) return;
    setGenerating(true);
    try {
      await renderLogoPNG(canvasRef.current, color, `ashfoto-logo-${label}.png`);
    } finally {
      setGenerating(false);
    }
  };

  const handleIconPNG = async (slug: string, color: string, label: string) => {
    if (!canvasRef.current) return;
    const Icon = SERVICE_ICON_MAP[slug];
    if (!Icon) return;
    setGenerating(true);
    try {
      const svg = makeIconSVG(Icon, color, 128);
      await renderIconPNG(canvasRef.current, svg, `ashfoto-icon-${slug}-${label}.png`);
    } finally {
      setGenerating(false);
    }
  };

  const handleIconSVG = (slug: string, color: string, label: string) => {
    const Icon = SERVICE_ICON_MAP[slug];
    if (!Icon) return;
    const svg = makeIconSVG(Icon, color, 128);
    downloadSVGString(svg, `ashfoto-icon-${slug}-${label}.svg`);
  };

  return (
    <div className="space-y-8">
      {/* ── LOGO SECTION ─────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Logo Downloads</CardTitle>
          <CardDescription>Transparent background, centered. Available in black and white.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Black logo */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Black Version</h4>
              <div className="border border-border rounded-xl p-8 bg-white flex items-center justify-center min-h-[120px]">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: 700, color: "#000000" }}>
                  {LOGO_LABEL}
                </span>
              </div>
              <DownloadButtons
                onSVG={() => downloadSVGString(makeLogoSVG("#000000"), "ashfoto-logo-black.svg")}
                onPNG={() => handleLogoPNG("#000000", "black")}
                generating={generating}
              />
            </div>

            {/* White logo */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">White Version</h4>
              <div className="border border-border rounded-xl p-8 bg-neutral-900 flex items-center justify-center min-h-[120px]">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: 700, color: "#ffffff" }}>
                  {LOGO_LABEL}
                </span>
              </div>
              <DownloadButtons
                onSVG={() => downloadSVGString(makeLogoSVG("#ffffff"), "ashfoto-logo-white.svg")}
                onPNG={() => handleLogoPNG("#ffffff", "white")}
                generating={generating}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            SVG = verlustfrei skalierbar (Web & Druck) · PNG = 1600×400px (Social Media & Dokumente)
          </p>
        </CardContent>
      </Card>

      {/* ── SERVICE ICONS SECTION ────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Service Icons</CardTitle>
          <CardDescription>All service icons in black and white. Transparent background, 512×512px PNG.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(SERVICE_ICON_MAP).map(([slug, Icon]) => {
              const label = SLUG_LABELS[slug] || slug;
              return (
                <div key={slug} className="border border-border rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground truncate" title={label}>{label}</p>

                  {/* Preview row */}
                  <div className="flex gap-2 justify-center">
                    <div className="w-14 h-14 rounded-lg bg-white border border-border flex items-center justify-center">
                      <Icon size={28} color="#000000" strokeWidth={1.5} />
                    </div>
                    <div className="w-14 h-14 rounded-lg bg-neutral-900 border border-border flex items-center justify-center">
                      <Icon size={28} color="#ffffff" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Download buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground text-center font-medium">BLACK</p>
                      <DownloadButtons
                        small
                        onSVG={() => handleIconSVG(slug, "#000000", "black")}
                        onPNG={() => handleIconPNG(slug, "#000000", "black")}
                        generating={generating}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground text-center font-medium">WHITE</p>
                      <DownloadButtons
                        small
                        onSVG={() => handleIconSVG(slug, "#ffffff", "white")}
                        onPNG={() => handleIconPNG(slug, "#ffffff", "white")}
                        generating={generating}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default AdminLogo;
