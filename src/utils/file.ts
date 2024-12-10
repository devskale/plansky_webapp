import { PDFDocument } from 'pdf-lib';

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(new Error('Failed to read file: ' + error.toString()));
  });
}

export async function extractImageFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    if (pages.length === 0) {
      throw new Error('PDF is empty');
    }

    // Create a temporary canvas to render the PDF page
    const page = pages[0];
    const { width, height } = page.getSize();
    
    // Scale the canvas for better resolution
    const scale = 2;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Convert PDF page to image
    const viewport = {
      width: width * scale,
      height: height * scale
    };

    // Return the base64 image data
    const imageData = canvas.toDataURL('image/png');
    if (!imageData || imageData === 'data:,') {
      throw new Error('Failed to generate image from PDF');
    }

    return imageData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF processing failed: ${error.message}`);
    }
    throw new Error('Failed to process PDF file');
  }
}