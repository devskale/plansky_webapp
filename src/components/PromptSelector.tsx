import React from 'react';
import { Settings } from 'lucide-react';
import { prompts } from '../config/prompts';
import { AnalysisSettings } from '../types';

interface PromptSelectorProps {
  settings: AnalysisSettings;
  onSettingsChange: (settings: AnalysisSettings) => void;
}

export function PromptSelector({ settings, onSettingsChange }: PromptSelectorProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <Settings className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">Select Analysis Type</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {prompts.map((prompt) => (
          <label
            key={prompt.id}
            className={`relative flex flex-col p-3 cursor-pointer rounded-lg border transition-colors ${
              settings.selectedPromptId === prompt.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="prompt"
              value={prompt.id}
              checked={settings.selectedPromptId === prompt.id}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  selectedPromptId: e.target.value,
                })
              }
              className="sr-only"
            />
            <div className="flex items-start justify-between mb-1">
              <div className="text-sm font-medium text-gray-900">
                {prompt.name}
              </div>
              <div className="ml-2 flex-shrink-0">
                <span
                  className={`inline-block h-3 w-3 rounded-full border ${
                    settings.selectedPromptId === prompt.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 bg-white'
                  }`}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 line-clamp-2">
              {prompt.description}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}