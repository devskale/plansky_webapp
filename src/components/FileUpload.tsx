import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });

  return (
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
  );
}