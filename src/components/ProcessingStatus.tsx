import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  error?: string | null;
}

export function ProcessingStatus({ isProcessing, error }: ProcessingStatusProps) {
  if (!isProcessing && !error) return null;

  return (
    <div className="mt-4">
      {isProcessing && (
        <div className="flex items-center text-blue-600">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span>Processing your drawing...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Processing Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}