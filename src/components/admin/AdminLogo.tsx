import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;display=swap');
  </style>
  <text x="0" y="38" font-family="'Playfair Display', serif" font-weight="700" font-size="36" fill="#1a1a1a">ashfoto</text>
</svg>`;

const AdminLogo = () => {
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadSVG = () => {
    const blob = new Blob([LOGO_SVG], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ashfoto-logo.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    setGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // High-res PNG
      const scale = 4;
      canvas.width = 400 * scale;
      canvas.height = 100 * scale;
      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, 400, 100);

      // Load font first
      await document.fonts.load("bold 72px 'Playfair Display'");

      ctx.font = "bold 72px 'Playfair Display', serif";
      ctx.fillStyle = "#1a1a1a";
      ctx.textBaseline = "middle";
      ctx.fillText("ashfoto", 10, 55);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ashfoto-logo.png";
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo Vorschau</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview */}
          <div className="border border-border rounded-lg p-8 bg-white flex items-center justify-center">
            <span
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: 700, color: "#1a1a1a" }}
            >
              ashfoto
            </span>
          </div>

          {/* Download buttons */}
          <div className="flex gap-4">
            <Button onClick={downloadSVG} className="gap-2">
              <Download className="w-4 h-4" />
              SVG herunterladen
            </Button>
            <Button onClick={downloadPNG} disabled={generating} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              {generating ? "Wird erstellt..." : "PNG herunterladen"}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            SVG ist ideal für Web & Druck (verlustfrei skalierbar). PNG ist für Social Media & Dokumente geeignet (1600×400px).
          </p>
        </CardContent>
      </Card>

      {/* Hidden canvas for PNG generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default AdminLogo;
