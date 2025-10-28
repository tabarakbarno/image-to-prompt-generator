
import React, { useState, useCallback } from 'react';
import { generatePromptFromImage } from './services/geminiService';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import PromptDisplay from './components/PromptDisplay';
import { IconSparkles } from './components/icons/IconSparkles';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [userText, setUserText] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageSelect = (file: File, dataUrl: string) => {
    setImageFile(file);
    setImageDataUrl(dataUrl);
    setGeneratedPrompt('');
    setError('');
  };
  
  const handleGeneratePrompt = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');

    try {
      const prompt = await generatePromptFromImage(imageFile, userText);
      setGeneratedPrompt(prompt);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, userText]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Header />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="flex flex-col gap-8">
            <ImageUpload onImageSelect={handleImageSelect} imageDataUrl={imageDataUrl} />
            <div>
              <label htmlFor="user-notes" className="block text-sm font-medium text-gray-400 mb-2">
                Optional Notes (e.g., focus on the background, change the style)
              </label>
              <textarea
                id="user-notes"
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500"
                placeholder="Type any additional instructions here..."
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="lg:sticky lg:top-12 flex flex-col gap-6">
            <button
              onClick={handleGeneratePrompt}
              disabled={!imageFile || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-indigo-500/30"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <IconSparkles />
                  Generate Prompt
                </>
              )}
            </button>
            <PromptDisplay prompt={generatedPrompt} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
