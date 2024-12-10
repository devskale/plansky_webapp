import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ProjectReport } from './components/ProjectReport';
import { ProcessingStatus } from './components/ProcessingStatus';
import { Header } from './components/Header';
import { PromptSelector } from './components/PromptSelector';
import { Project, AnalysisSettings } from './types';
import { processFile } from './services/fileProcessor';

export function App() {
  const [project, setProject] = useState<Project | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AnalysisSettings>({
    selectedPromptId: 'standard'
  });

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processFile(files[0], settings);
      setProject(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Analysis Settings</h2>
            <PromptSelector settings={settings} onSettingsChange={setSettings} />
            <h2 className="text-lg font-semibold mb-4">Upload Plans</h2>
            <FileUpload onFileUpload={handleFileUpload} />
            <ProcessingStatus isProcessing={isProcessing} error={error} />
          </div>

          {project && (
            <ProjectReport project={project} />
          )}
        </div>
      </main>
    </div>
  );
}