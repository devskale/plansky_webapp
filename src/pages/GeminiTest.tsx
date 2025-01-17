// src/pages/GeminiTest.tsx
import React, { useState } from 'react';
import { analyzeDrawingFlash, askGemini } from '../services/gemini_flash'; // Import askGemini
import { AnalysisSettings } from '../types';
import { FileUpload } from '../components/FileUpload'; // Corrected import path

const initialSettings: AnalysisSettings = {
    selectedPromptId: "standard"
};

const GeminiTest: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string | null>("gemini-2.0-flash-exp");
    const [modelsTextbox, setModelsTextbox] = useState<string>("");
    const [query, setQuery] = useState<string>(""); // new state for the query
    const [queryResult, setQueryResult] = useState<string>(""); // new state for the query result


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleListModels = async () => {
        try {
            const models = await listAvailableModels();
            setAvailableModels(models);
            setModelsTextbox(models.join(',\n'));
        } catch (err) {
            if (err instanceof Error) {
                setError(`Failed to list models: ${err.message}`);
            } else {
                setError('An unexpected error occurred while listing models.');
            }
        }
    };


    const handleAnalyze = async () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }

        setLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                if(e.target && e.target.result){
                    const fileData = e.target.result.toString();
                    const result = await analyzeDrawingFlash(fileData, file.type, initialSettings, selectedModel);
                    setAnalysisResult(result);
                } else {
                    setError('Failed to read file data.');
                }
            }
            reader.onerror = () => {
                setError('Failed to read file.');
                setLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            if (err instanceof Error) {
                setError(`Analysis failed: ${err.message}`);
            } else {
                setError('An unexpected error occurred during analysis.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

     const handleAskGemini = async () => {
        if (!query) {
            setError('Please enter a query.');
            return;
        }
    
        setLoading(true);
        setError(null);
        setQueryResult("");
    
        try {
            const result = await askGemini(query, selectedModel);
            setQueryResult(result);
        } catch (err) {
             if (err instanceof Error) {
                 setError(`Query failed: ${err.message}`);
             } else {
                 setError('An unexpected error occurred during the query.');
             }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Gemini Test</h1>

            <button onClick={handleListModels}>List Models</button>

            {modelsTextbox && (
                <div>
                    <label htmlFor="models-textbox">Available Models:</label>
                    <textarea id="models-textbox" value={modelsTextbox} readOnly rows={5} cols={50} style={{whiteSpace: 'pre-wrap'}} />
                </div>
            )}


            {availableModels.length > 0 && (
                <div>
                    <label htmlFor="model-select">Select Model:</label>
                    <select id="model-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} >
                        {availableModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
            )}
            
             <div>
                <label htmlFor="query-input">Enter Query:</label>
                 <input
                  type="text"
                   id="query-input"
                   value={query}
                   onChange={handleQueryChange}
                 />
                  <button onClick={handleAskGemini} disabled={loading}>
                   {loading ? 'Asking...' : 'Ask Gemini'}
                  </button>
                {queryResult && (
                    <div>
                       <label htmlFor="query-result">Response:</label>
                       <textarea id="query-result" value={queryResult} readOnly rows={5} cols={50} style={{whiteSpace: 'pre-wrap'}}/>
                    </div>
                )}
              </div>

            <FileUpload onFileUpload={()=>{}}/>

            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
            <button onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {analysisResult && (
                <div>
                    <h2>Analysis Result:</h2>
                    <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default GeminiTest;
