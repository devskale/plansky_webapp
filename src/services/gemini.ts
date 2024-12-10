import { GoogleGenerativeAI } from '@google/generative-ai';
import { prompts } from '../config/prompts';
import { AnalysisSettings } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeDrawing(imageData: string, settings: AnalysisSettings): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-002' });
    const base64Image = imageData.split(',')[1];
    
    // Get the selected prompt configuration
    const selectedPrompt = prompts.find(p => p.id === settings.selectedPromptId);
    if (!selectedPrompt) {
      throw new Error('Invalid prompt selection');
    }

    const result = await model.generateContent([
      selectedPrompt.prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/png'
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini Response:', text);
    
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Cleaned Response:', cleanedText);
      
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      throw new Error(`Failed to parse Gemini API response as JSON. Raw response: ${text}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during analysis');
  }
}