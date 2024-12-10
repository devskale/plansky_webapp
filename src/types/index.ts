export interface Room {
  id: string;
  number: string;
  description: string;
  category: string;
  size: number;
  floorMaterial: string;
  ceilingHeight: number;
}

export interface Project {
  title: string;
  architect: string;
  date: string;
  rooms: Room[];
}

export interface PromptConfig {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface AnalysisSettings {
  selectedPromptId: string;
}