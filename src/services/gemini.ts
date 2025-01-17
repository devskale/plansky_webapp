import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompts } from "../config/prompts";
import { AnalysisSettings } from "../types";

const API_KEY = import.meta.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error(
    "Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your .env file."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function listAvailableModels(): Promise<string[]> {
  try {
    const modelList = await genAI.listModels();
    return modelList.models.map((model) => model.name);
  } catch (error) {
    console.error("Error fetching models:", error);
    throw new Error("Failed to fetch available models.");
  }
}

// gemini.ts
export async function analyzeDrawing(
  fileData: string,
  mimeType: string,
  settings: AnalysisSettings
): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    //    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    //    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }, { apiVersion: 'v1beta' });
    const base64Data = fileData.split(",")[1];

    const selectedPrompt = prompts.find(
      (p) => p.id === settings.selectedPromptId
    );
    if (!selectedPrompt) {
      throw new Error("Invalid prompt selection");
    }

    const result = await model.generateContent([
      selectedPrompt.prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType, // Pass through the original MIME type
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    console.log("Raw Gemini Response:", text);

    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      console.log("Cleaned Response:", cleanedText);

      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Parse Error:", parseError);
      throw new Error(
        `Failed to parse Gemini API response as JSON. Raw response: ${text}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during analysis");
  }
}
