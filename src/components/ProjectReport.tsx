import React from 'react';
import { Project } from '../types';
import { RoomList } from './room/RoomList';
import { ProjectHeader } from './ProjectHeader';

interface ProjectReportProps {
  project: Project | null;
}

export function ProjectReport({ project }: ProjectReportProps) {
  if (!project) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <ProjectHeader project={project} />
      <RoomList rooms={project.rooms} />
    </div>
  );
}