import { fileToBase64 } from '../utils/file';
import { transformAnalysisToProject } from '../utils/transform';
import { analyzeDrawing } from './gemini';
import { Project, AnalysisSettings } from '../types';


export async function processFile(file: File, settings: AnalysisSettings): Promise<Project> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF or image file (PNG, JPG).`);
    }

    if (file.size === 0) {
      throw new Error('The file is empty');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size exceeds 10MB limit');
    }

    let fileData: string;
    try {
      fileData = await fileToBase64(file);
    } catch (error) {
      console.error('File processing error:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to process file: ${error.message}`
          : 'Failed to process file. Please ensure the file is not corrupted.'
      );
    }

    if (!fileData || fileData === 'data:,') {
      throw new Error('Failed to extract data from file');
    }

    try {
      const analysisResult = await analyzeDrawing(fileData, file.type, settings);
      if (!analysisResult) {
        throw new Error('Analysis returned no results');
      }
      
      if (!analysisResult.rooms || !Array.isArray(analysisResult.rooms)) {
        throw new Error('Invalid analysis result format: missing or invalid rooms data');
      }
      
      return transformAnalysisToProject(analysisResult);
    } catch (error) {
      console.error('Analysis error:', error);
      if (error instanceof Error && error.message.includes('PERMISSION_DENIED')) {
        throw new Error('API key error: Please check your Gemini API key configuration');
      }
      throw new Error(
        error instanceof Error 
          ? `Analysis failed: ${error.message}`
          : 'Failed to analyze the drawing. Please try again.'
      );
    }
  } catch (error) {
    console.error('Error processing file:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}