// src/components/ExamplePlansList.tsx
import React, { useState } from "react";

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
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const files: PlanFile[] = [
    {
      name: "example1.png",
      preview: "https://i.imgur.com/8TDNVdt.png",
      type: "image/png",
    },
    {
      name: "example2.png",
      preview: "https://i.imgur.com/z1d2BRV.png", //this url does not need to be proxied
      type: "image/png",
    },
    {
      name: "example3.png",
      preview: "https://i.imgur.com/te1PhJj.png",
      type: "image/png",
    },
    {
      name: "example4.png",
      preview: "https://i.imgur.com/SjYshkL.png",
      type: "image/png",
    },
  ];

  const handlePlanClick = async (file: PlanFile) => {
    try {
      setSelectedName(file.name);
      const response = await fetch(file.preview);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const fileToUpload = new File([blob], file.name, { type: file.type });
      onFileUpload([fileToUpload]);
    } catch (err) {
      console.error("Error loading example plan:", err);
    } finally {
      setSelectedName(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.name}
            className="text-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => handlePlanClick(file)}>
            {file.preview ? (
              <div className="relative">
                <img
                  src={file.preview}
                  alt={file.name}
                  className={`w-16 h-16 mx-auto object-contain bg-white border border-gray-200 rounded 
                    ${selectedName === file.name ? "opacity-50" : ""}`}
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

export default ExamplePlansList;
