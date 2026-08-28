import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const UPLOADS_DIR = path.resolve(__dirname, "../../public/uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface OptimizedImageResult {
  filename: string;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  format: string;
}

/**
 * Optimizes an uploaded image buffer:
 * - Constrains dimensions to a maximum of 800px width/height.
 * - Converts to optimized WebP format (85% quality).
 * - Saves to disk / MinIO storage with unique cryptographic hash.
 */
export async function optimizeAndStoreImage(
  fileBuffer: Buffer,
  originalFilename: string
): Promise<OptimizedImageResult> {
  const fileHash = crypto.randomBytes(12).toString("hex");
  const baseName = path.parse(originalFilename).name.replace(/[^a-zA-Z0-9_-]/g, "");
  const outputFilename = `${baseName || "device"}-${fileHash}.webp`;
  const targetFilePath = path.join(UPLOADS_DIR, outputFilename);

  // Process with Sharp (max 800px size constraint)
  const image = sharp(fileBuffer);
  const metadata = await image.metadata();

  const processedBuffer = await image
    .resize({
      width: 800,
      height: 800,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  await fs.promises.writeFile(targetFilePath, processedBuffer);

  const processedMetadata = await sharp(processedBuffer).metadata();
  const backendBaseUrl = process.env.BACKEND_URL || "http://localhost:5000";

  return {
    filename: outputFilename,
    url: `${backendBaseUrl}/uploads/${outputFilename}`,
    width: processedMetadata.width || 800,
    height: processedMetadata.height || 800,
    sizeBytes: processedBuffer.length,
    format: "webp",
  };
}
