import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { getCroppedImg } from "@/lib/cropImage";

interface CropDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  aspect: number;
  title: string;
  /** Called with the cropped image blob */
  onCropComplete: (croppedBlob: Blob) => void;
  initialCrop?: { x: number; y: number };
  initialZoom?: number;
}

const CropDialog = ({
  open,
  onClose,
  imageUrl,
  aspect,
  title,
  onCropComplete,
  initialCrop,
  initialZoom,
}: CropDialogProps) => {
  const [crop, setCrop] = useState(initialCrop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom || 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCropComplete(blob);
      onClose();
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[400px] bg-secondary/20 rounded-lg overflow-hidden">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex items-center gap-4 px-2">
          <span className="text-xs text-muted-foreground w-12">Zoom</span>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.05}
            onValueChange={(v) => setZoom(v[0])}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10 text-right">{zoom.toFixed(1)}×</span>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={saving || !croppedAreaPixels}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Zuschnitt speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropDialog;
