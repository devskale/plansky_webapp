// src/components/ExamplePlansList.tsx
import React, { useEffect, useState } from 'react';

interface PlanFile {
  name: string;
  preview: string;
  type: string;
  error?: string;
}

interface ExamplePlansListProps {
  onFileUpload: (files: File[]) => void;
}

export function ExamplePlansList({ onFileUpload }: ExamplePlansListProps) {
  const [files, setFiles] = useState<PlanFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/example-plans')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        setFiles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handlePlanClick = async (fileName: string) => {
    try {
      setSelectedName(fileName);
      // Fixed path: removed '/public' prefix
      const response = await fetch(`/example-plans/${fileName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });
      onFileUpload([file]);
    } catch (err) {
      console.error('Error loading example plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to load example plan');
    } finally {
      setSelectedName(null);
    }
  };

  if (loading) return <div>Loading example plans...</div>;
  if (error) return <div>Error loading example plans: {error}</div>;
  if (files.length === 0) return <div>No example plans found</div>;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {files.map(file => (
          <div 
            key={file.name} 
            className="text-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => handlePlanClick(file.name)}
          >
            {file.preview ? (
              <div className="relative">
                <img 
                  src={file.preview} 
                  alt={file.name}
                  className={`w-16 h-16 mx-auto object-contain bg-white border border-gray-200 rounded 
                    ${selectedName === file.name ? 'opacity-50' : ''}`}
                />
                {selectedName === file.name && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400">
                No preview
              </div>
            )}
            <p className="mt-1 text-xs text-gray-600 truncate">{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}