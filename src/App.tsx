// App.tsx
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ProjectReport } from './components/ProjectReport';
import { ProcessingStatus } from './components/ProcessingStatus';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PromptSelector } from './components/PromptSelector';
import { Project, AnalysisSettings } from './types';
import { processFile } from './services/fileProcessor';
import { extractImageFromPDF } from './utils/file';

export function App() {
  const [project, setProject] = useState<Project | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AnalysisSettings>({
    selectedPromptId: 'standard'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    
    try {
      if (file.type === 'application/pdf') {
        const previewData = await extractImageFromPDF(file);
        setPreviewUrl(previewData);
      } else {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processFile(selectedFile, settings);
      setProject(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    // Cleanup URLs when component unmounts or when new file is uploaded
    return () => {
      if (previewUrl && !previewUrl.startsWith('data:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
            
            {previewUrl && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">Preview</h3>
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Plan preview" 
                    className="max-h-96 max-w-full object-contain rounded border border-gray-200"
                  />
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Process Plan'}
                  </button>
                </div>
              </div>
            )}
            
            <ProcessingStatus isProcessing={isProcessing} error={error} />
          </div>

          {project && (
            <ProjectReport project={project} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}