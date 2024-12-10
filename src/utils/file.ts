// utils/file.ts

// Korrekte ESM Import Pfade
const PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/build/pdf.mjs';
const WORKER_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/build/pdf.worker.mjs';

let pdfjsLib: any = null;
let initializationPromise: Promise<any> | null = null;

async function initPdfJs() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        // Import das richtige ESM Modul
        const module = await import(/* @vite-ignore */ PDFJS_CDN);
        pdfjsLib = module;
        // Worker-Pfad setzen
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
        return pdfjsLib;
      } catch (error) {
        console.error('Failed to initialize PDF.js:', error);
        initializationPromise = null;
        throw error;
      }
    })();
  }
  return initializationPromise;
}

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
    const pdfjs = await initPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      useWorkerFetch: true,
      isEvalSupported: true,
      useSystemFonts: true,
    }).promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create canvas context');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const imageData = canvas.toDataURL('image/png');
    canvas.remove();
    await pdf.destroy();

    return imageData;
  } catch (error) {
    console.error('PDF preview generation error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate PDF preview');
  }
}