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
      `Projekt: ${project.title}`,
      `Architekt: ${project.architect}`,
      `Datum: ${project.date}`,
      `Anzahl Räume: ${project.rooms.length}`,
      '',  // Leerzeile für bessere Lesbarkeit
      'Nr\tBeschreibung\tGröße (m²)\tMaterial\tRaumhöhe (m)'  // Header
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
      console.error('Fehler beim Kopieren:', err);
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