/**
 * Client-side image compression utility.
 * Compresses images to a max size (~1MB) and reduces resolution for web display.
 */

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const MAX_DIMENSION = 2048; // max width/height for web gallery
const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.4;

export async function compressImage(file: File): Promise<File> {
  // Skip non-image files
  if (!file.type.startsWith("image/")) return file;

  // If already small enough, return as-is
  if (file.size <= MAX_FILE_SIZE) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      // Try progressively lower quality until under MAX_FILE_SIZE
      let quality = INITIAL_QUALITY;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            if (blob.size <= MAX_FILE_SIZE || quality <= MIN_QUALITY) {
              const compressed = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressed);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          "image/jpeg",
          quality
        );
      };
      tryCompress();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback to original
    };

    img.src = url;
  });
}

export async function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressImage));
}
