import { PromptConfig } from '../types';

export const prompts: PromptConfig[] = [
  {
    id: 'standard',
    name: 'Standard Analysis',
    description: 'Basic room analysis with measurements',
    prompt: `Analyze this architectural drawing and extract the following information:
1. Project name and details (if visible)
2. List of rooms with their:
   - Room number
   - Description/purpose
   - Size in square meters
   - Floor material (if specified)
   - Ceiling height (if specified)
3. Categorize rooms by their function (e.g., Medical, Storage, Staff areas)

Format the response as a structured JSON object with the following structure:
{
  "projectName": "string",
  "architect": "string",
  "date": "string",
  "rooms": [
    {
      "number": "string",
      "description": "string",
      "category": "string",
      "size": number,
      "floorMaterial": "string",
      "ceilingHeight": number
    }
  ]
}`
  },
  {
    id: 'detailed',
    name: 'Detailed Analysis',
    description: 'Comprehensive analysis including materials and connections',
    prompt: `Perform a detailed analysis of this architectural drawing and extract:
1. Project Information:
   - Project name and type
   - Architect details
   - Date and revision number
2. Room Analysis:
   - Room number and name
   - Purpose and category
   - Precise measurements (m²)
   - Floor materials and specifications
   - Ceiling height and type
   - Wall materials
3. Connections and Layout:
   - Door locations and types
   - Window positions
   - Adjacent rooms
4. Special Features:
   - Built-in furniture
   - Technical installations
   - Special requirements

Format as JSON:
{
  "projectName": "string",
  "architect": "string",
  "date": "string",
  "rooms": [
    {
      "number": "string",
      "description": "string",
      "category": "string",
      "size": number,
      "floorMaterial": "string",
      "ceilingHeight": number,
      "wallMaterial": "string",
      "doors": [{"type": "string", "connectsTo": "string"}],
      "windows": number,
      "specialFeatures": ["string"]
    }
  ]
}`
  },
  {
    id: 'simple',
    name: 'Simple List',
    description: 'Basic room list with sizes',
    prompt: `Create a simple room list from this architectural drawing:
1. Extract:
   - Project name
   - Room numbers
   - Room descriptions
   - Room sizes

Format as JSON:
{
  "projectName": "string",
  "architect": "string",
  "date": "string",
  "rooms": [
    {
      "number": "string",
      "description": "string",
      "category": "string",
      "size": number,
      "floorMaterial": "string",
      "ceilingHeight": number
    }
  ]
}`
  }
];