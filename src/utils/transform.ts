// transform.ts
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

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Smart defaults based on room categories if available
  let defaultProjectName = 'New Project';
  if (analysis.rooms && analysis.rooms.length > 0) {
    const categories = analysis.rooms.map(room => room.category?.toLowerCase() || '');
    
    if (categories.some(cat => cat.includes('medical') || cat.includes('patient'))) {
      defaultProjectName = 'Medical Center';
    } else if (categories.some(cat => cat.includes('office') || cat.includes('meeting'))) {
      defaultProjectName = 'Office Building';
    } else if (categories.some(cat => cat.includes('living') || cat.includes('bedroom') || cat.includes('kitchen'))) {
      defaultProjectName = 'Apartment Complex';
    } else if (categories.some(cat => cat.includes('classroom') || cat.includes('lecture'))) {
      defaultProjectName = 'Educational Facility';
    }
  }

  // Use analysis data with smart defaults
  return {
    title: analysis.projectName || defaultProjectName,
    architect: analysis.architect || 'Unknown Architect',
    date: analysis.date || today,
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
    description: room.description || 'Unspecified Room',
    category: inferCategory(room.description || '') || room.category || 'Other',
    size: typeof room.size === 'string' ? parseFloat(room.size) || 0 : (room.size || 0),
    floorMaterial: room.floorMaterial || 'Not specified',
    ceilingHeight: typeof room.ceilingHeight === 'string' ? 
      parseFloat(room.ceilingHeight) || 0 : 
      (room.ceilingHeight || 0)
  }));
}

// Helper function to infer category from room description
function inferCategory(description: string): string | null {
  const desc = description.toLowerCase();
  
  if (desc.includes('bedroom') || desc.includes('living') || desc.includes('kitchen')) {
    return 'Living Space';
  }
  if (desc.includes('bath') || desc.includes('wc') || desc.includes('toilet')) {
    return 'Bathroom';
  }
  if (desc.includes('office') || desc.includes('meeting') || desc.includes('conference')) {
    return 'Office';
  }
  if (desc.includes('storage') || desc.includes('closet')) {
    return 'Storage';
  }
  if (desc.includes('exam') || desc.includes('patient') || desc.includes('treatment')) {
    return 'Medical';
  }
  
  return null;
}