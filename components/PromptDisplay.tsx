
import React, { useState, useEffect } from 'react';
import { IconCopy } from './icons/IconCopy';
import { IconCheck } from './icons/IconCheck';

interface PromptDisplayProps {
  prompt: string;
  isLoading: boolean;
  error: string;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, isLoading, error }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (prompt) {
      setIsCopied(false);
    }
  }, [prompt]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-400 font-medium">{error}</p>;
    }
    if (prompt) {
      return <p className="text-gray-200 whitespace-pre-wrap">{prompt}</p>;
    }
    return (
      <p className="text-gray-500 italic">
        Your generated AI image prompt will appear here.
      </p>
    );
  };
  
  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-6 min-h-[200px] relative transition-all duration-300">
      {prompt && !error && !isLoading && (
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-400 hover:text-white"
          aria-label="Copy prompt"
        >
          {isCopied ? <IconCheck className="w-5 h-5 text-green-400" /> : <IconCopy className="w-5 h-5" />}
        </button>
      )}
      {renderContent()}
    </div>
  );
};

export default PromptDisplay;
