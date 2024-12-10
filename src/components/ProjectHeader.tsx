import React from 'react';
import { Project } from '../types';
import { User, Calendar, FileText } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="border-b pb-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
      <div className="mt-4 space-y-2 text-gray-600">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>{project.architect}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{project.date}</span>
        </div>
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          <span>{project.rooms.length} rooms total</span>
        </div>
      </div>
    </div>
  );
}