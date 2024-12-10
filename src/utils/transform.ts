import { Project, Room } from '../types';

interface AnalysisResult {
  projectName?: string;
  architect?: string;
  date?: string;
  rooms?: Array<{
    number?: string;
    description?: string;
    category?: string;
    size?: string | number;
    floorMaterial?: string;
    ceilingHeight?: string | number;
  }>;
}

export function transformAnalysisToProject(analysis: AnalysisResult): Project {
  if (!analysis) {
    throw new Error('Invalid analysis result');
  }

  // Provide default values for the project
  const defaultProject: Project = {
    title: 'Augenklinik',
    architect: 'Unknown Architect',
    date: new Date().toISOString().split('T')[0],
    rooms: []
  };

  // Merge analysis data with defaults
  return {
    title: analysis.projectName || defaultProject.title,
    architect: analysis.architect || defaultProject.architect,
    date: analysis.date || defaultProject.date,
    rooms: transformRooms(analysis.rooms || [])
  };
}

function transformRooms(rooms: AnalysisResult['rooms']): Room[] {
  if (!Array.isArray(rooms)) {
    return [];
  }

  return rooms.map((room, index) => ({
    id: String(index + 1),
    number: room.number || String(index + 1),
    description: room.description || 'Unspecified',
    category: room.category || 'Uncategorized',
    size: typeof room.size === 'string' ? parseFloat(room.size) || 0 : (room.size || 0),
    floorMaterial: room.floorMaterial || 'Not specified',
    ceilingHeight: typeof room.ceilingHeight === 'string' ? 
      parseFloat(room.ceilingHeight) || 0 : 
      (room.ceilingHeight || 0)
  }));
}