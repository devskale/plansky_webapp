import fs from "fs";
import path from "path";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

export default async function handler(req, res) {
  try {
    const plansDir = path.join(process.cwd(), "public/example-plans");
    const files = fs
      .readdirSync(plansDir)
      .filter((file) => /\.(jpg|jpeg|png|pdf)$/i.test(file));

    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(plansDir, file);
        const fileType = path.extname(file).toLowerCase();

        try {
          let imageBuffer;

          if (fileType === ".pdf") {
            const pdfBytes = fs.readFileSync(filePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const firstPage = pdfDoc.getPages()[0];
            const pngBytes = await firstPage.exportAsPNG({ scale: 0.2 });
            imageBuffer = Buffer.from(pngBytes);
          } else {
            imageBuffer = fs.readFileSync(filePath);
          }

          const preview = await sharp(imageBuffer)
            .resize(64, 64, {
              fit: "contain",
              background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .toBuffer();

          return {
            name: file,
            preview: `data:image/png;base64,${preview.toString("base64")}`,
            type: fileType,
          };
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
          return {
            name: file,
            type: fileType,
            preview: "",
            error: "Preview failed",
          };
        }
      })
    );

    res.status(200).json(fileDetails);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to read example plans" });
  }
}
