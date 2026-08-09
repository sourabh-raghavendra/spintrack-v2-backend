import QRCode from "qrcode";
import sharp from "sharp";

export async function generateQrJpeg(data: string): Promise<Buffer> {
  const pngBuffer = await QRCode.toBuffer(data, { type: "png", margin: 1, width: 512 });
  return sharp(pngBuffer).jpeg({ quality: 90 }).toBuffer();
}
