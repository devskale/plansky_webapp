// components/ProjectReport.tsx
import React from 'react';
import { Project } from '../types';
import { RoomList } from './room/RoomList';
import { ProjectHeader } from './ProjectHeader';

interface ProjectReportProps {
  project: Project | null;
}

export function ProjectReport({ project }: ProjectReportProps) {
  const [copied, setCopied] = React.useState(false);

  if (!project) return null;

  const copyToClipboard = async () => {
    // Erstelle formatierte Projektinformationen
    const projectInfo = [
      `Project: ${project.title}`,
      `Architect: ${project.architect}`,
      `Date: ${project.date}`,
      `Total Rooms: ${project.rooms.length}`,
      '',  // Leerzeile für bessere Lesbarkeit
      'Number\tDescription\tSize (m²)\tFloor Material\tHeight (m)'  // Header
    ].join('\n');

    // Formatiere Raumdaten
    const roomsData = project.rooms.map(room => 
      `${room.number}\t${room.description}\t${room.size.toFixed(2)}\t${room.floorMaterial}\t${room.ceilingHeight.toFixed(2)}`
    ).join('\n');

    // Kombiniere alles
    const fullContent = `${projectInfo}\n${roomsData}`;

    try {
      await navigator.clipboard.writeText(fullContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <ProjectHeader 
        project={project} 
        onCopy={copyToClipboard}
        isCopied={copied}
      />
      <RoomList rooms={project.rooms} />
    </div>
  );
}