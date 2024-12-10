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
    
    const selectedPrompt = prompts.find(p => p.id === settings.selectedPromptId);
    if (!selectedPrompt) {
      throw new Error('Invalid prompt selected');
    }

    // Remove data URL prefix for base64 processing
    const base64Image = imageData.split(',')[1];
    if (!base64Image) {
      throw new Error('Invalid image data format');
    }

    // Add PDF-specific context to the prompt if needed
    const enhancedPrompt = imageData.startsWith('data:application/pdf') 
      ? `This is a PDF document containing architectural drawings. ${selectedPrompt.prompt}`
      : selectedPrompt.prompt;
    
    try {
      const result = await model.generateContent([
        enhancedPrompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: imageData.startsWith('data:application/pdf') ? 'application/pdf' : 'image/png'
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      // Try to clean the response if it contains markdown code blocks
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const parsedResult = JSON.parse(cleanedText);
        
        // Basic validation of the parsed result
        if (!parsedResult || typeof parsedResult !== 'object') {
          throw new Error('Invalid response format from API');
        }
        
        return parsedResult;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Failed to parse Gemini API response as JSON. The API response was not in the expected format.');
      }
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      if (apiError instanceof Error && apiError.message.includes('PERMISSION_DENIED')) {
        throw new Error('Invalid API key or insufficient permissions');
      }
      throw new Error(
        apiError instanceof Error
          ? `Gemini API error: ${apiError.message}`
          : 'Failed to communicate with Gemini API'
      );
    }
  } catch (error) {
    console.error('Analysis Error:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred during analysis');
  }
}