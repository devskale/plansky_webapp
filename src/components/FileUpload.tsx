import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, FilePdf } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      // For PDFs, we'll show an icon instead
      else if (file.type === 'application/pdf') {
        setPreview(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });

  const handleProcess = () => {
    if (selectedFile) {
      onFileUpload([selectedFile]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={clsx(
          'p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          {
            'border-blue-500 bg-blue-50': isDragActive && !isDragReject,
            'border-red-500 bg-red-50': isDragReject,
            'border-gray-300 hover:border-blue-400': !isDragActive && !isDragReject
          }
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-gray-600">
          <Upload className={clsx('w-12 h-12 mb-4', {
            'text-blue-500': isDragActive && !isDragReject,
            'text-red-500': isDragReject,
            'text-gray-400': !isDragActive && !isDragReject
          })} />
          
          {isDragReject ? (
            <p className="text-lg font-medium text-red-600">
              Invalid file type or size
            </p>
          ) : isDragActive ? (
            <p className="text-lg font-medium text-blue-600">
              Drop your file here
            </p>
          ) : (
            <>
              <p className="text-lg font-medium">
                Drag & drop your CAD plans here
              </p>
              <p className="text-sm mt-2">or click to select files</p>
            </>
          )}
          
          <p className="text-xs mt-2 text-gray-500">
            Supports PDF and image files (PNG, JPG) up to 10MB
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {selectedFile.type === 'application/pdf' ? (
                <FilePdf className="w-8 h-8 text-red-500" />
              ) : (
                <FileImage className="w-8 h-8 text-blue-500" />
              )}
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleProcess}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Process File
            </button>
          </div>

          {preview && (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}