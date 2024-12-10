// components/ProjectHeader.tsx
import React from 'react';
import { Project } from '../types';
import { User, Calendar, FileText, Copy, Check } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
  onCopy: () => void;
  isCopied: boolean;
}

export function ProjectHeader({ project, onCopy, isCopied }: ProjectHeaderProps) {
  return (
    <div className="border-b pb-4 mb-6 relative">
      <div className="flex justify-between items-start">
        <div>
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
        <button
          onClick={onCopy}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          title="Copy to clipboard"
        >
          {isCopied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}