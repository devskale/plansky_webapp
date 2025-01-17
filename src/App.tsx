// src/App.tsx
import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FileUpload } from "./components/FileUpload";
import { ProjectReport } from "./components/ProjectReport";
import { ProcessingStatus } from "./components/ProcessingStatus";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { PromptSelector } from "./components/PromptSelector";
import { Project, AnalysisSettings } from "./types";
import { processFile } from "./services/fileProcessor";
import { extractImageFromPDF } from "./utils/file";
import ExamplePlansList from "./components/ExamplePlansList";
import GeminiTest from "./pages/GeminiTest";

export function App() {
  const [project, setProject] = useState<Project | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AnalysisSettings>({
    selectedPromptId: "standard",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleClearPreview = () => {
    if (previewUrl && !previewUrl.startsWith("data:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(event.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);
    setError(null);

    try {
      if (file.type === "application/pdf") {
        const previewData = await extractImageFromPDF(file);
        setPreviewUrl(previewData);
      } else {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate preview"
      );
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, []);

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processFile(selectedFile, settings);
      setProject(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the file"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    // Cleanup URLs when component unmounts or when new file is uploaded
    return () => {
      if (previewUrl && !previewUrl.startsWith("data:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/gemini" element={<GeminiTest />} />
          <Route
            path="/"
            element={
              <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Analysis Settings
                    </h2>
                    <PromptSelector
                      settings={settings}
                      onSettingsChange={setSettings}
                    />
                    <h2 className="text-lg font-semibold mb-4">Upload Plans</h2>
                    <div
                      className={`border-2 border-dashed rounded-md p-6 flex justify-center items-center relative ${
                        isDraggingOver
                          ? "border-blue-500 bg-gray-50"
                          : "border-gray-300"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}>
                      {previewUrl ? (
                        <div className="relative">
                          <button
                            onClick={handleClearPreview}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300">
                            X
                          </button>
                          <img
                            src={previewUrl}
                            alt="Plan preview"
                            className="max-h-96 max-w-full object-contain rounded border border-gray-200"
                          />
                          <button
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isProcessing
                              ? "Processing..."
                              : "Start Plan Analysis"}
                          </button>
                        </div>
                      ) : (
                        <FileUpload onFileUpload={handleFileUpload} />
                      )}
                    </div>

                    <ProcessingStatus
                      isProcessing={isProcessing}
                      error={error}
                    />
                  </div>
                  {project && <ProjectReport project={project} />}

                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Beispiel Pläne
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Wählen Sie einen der folgenden Beispielpläne aus, um die
                      Analyse zu starten.
                    </p>
                    <ExamplePlansList onFileUpload={handleFileUpload} />
                  </div>
                </div>
              </main>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
