// src/services/gemini_flash.ts
import { prompts } from '../config/prompts';
import { AnalysisSettings } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your .env file.');
}


export async function analyzeDrawingFlash(fileData: string, mimeType: string, settings: AnalysisSettings, modelName: string | null): Promise<any> {
  try {

      if(!API_KEY) {
          throw new Error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your .env file.');
      }
      if(!modelName) {
        modelName = 'gemini-2.0-flash-exp'
      }
      const base64Data = fileData.split(',')[1];

      const selectedPrompt = prompts.find(p => p.id === settings.selectedPromptId);
      if (!selectedPrompt) {
          throw new Error('Invalid prompt selection');
      }

      const payload = {
          contents: [{
              parts: [
                  { text: selectedPrompt.prompt },
                  {
                      inline_data: {
                          data: base64Data,
                          mime_type: mimeType
                      }
                  }
              ]
          }]
      };

      const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
          {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload)
          }
      );

      if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Raw Gemini Response:', result);

      if (!result || !result.candidates || result.candidates.length === 0 || !result.candidates[0].content || !result.candidates[0].content.parts || result.candidates[0].content.parts.length === 0 ) {
        throw new Error(`Unexpected API response format. Raw response: ${JSON.stringify(result)}`);
      }
      try {
          const text = result.candidates[0].content.parts[0].text;
          const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
           console.log('Cleaned Response:', cleanedText);
           return JSON.parse(cleanedText);
      } catch (parseError) {
          console.error('Parse Error:', parseError);
          throw new Error(`Failed to parse Gemini API response as JSON. Raw response: ${JSON.stringify(result)}`);
      }

  } catch (error) {
      if (error instanceof Error) {
          console.error('Error in analyzeDrawingFlash:', error); // Log error details for debugging
          throw new Error(`Analysis failed: ${error.message}`);
      }
      console.error('Unexpected error in analyzeDrawingFlash:', error);
      throw new Error('An unexpected error occurred during analysis');
  }
}


export async function askGemini(query: string, modelName: string | null): Promise<string> {
    try {

        if(!modelName) {
          modelName = 'gemini-2-flash-exp'
        }
        const payload = {
            contents: [{
                parts: [{ text: query }]
            }]
        };


        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Raw Gemini Response:', result);
        
        const text = result.candidates[0].content.parts[0].text;
        return text;


    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Query failed: ${error.message}`);
        }
        throw new Error('An unexpected error occurred during the query');
    }
}
