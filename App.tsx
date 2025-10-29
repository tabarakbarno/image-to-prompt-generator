import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePrompts } from './services/geminiService';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import OutputDisplay from './components/PromptDisplay';
import { IconSparkles } from './components/icons/IconSparkles';
import { IconWand } from './components/icons/IconWand';
import PromptHistory from './components/PromptHistory';
import Controls from './components/Controls';
import { PROMPT_STYLES } from './components/PromptStyleSelector';

// Define the structure for a generated prompt result
export interface PromptResult {
  id: string;
  prompt: string;
  imagePreviewUrl: string;
  style: string;
  tone: string;
  language: string;
}

// Define the structure for a history item (a batch of generations)
export interface HistoryItem {
  id: string;
  timestamp: string;
  results: PromptResult[];
}

const App: React.FC = () => {
  // State management for all app features
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageDataUrls, setImageDataUrls] = useState<string[]>([]);
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('auto');
  const [promptStyle, setPromptStyle] = useState<string>(PROMPT_STYLES[0]);
  const [promptTone, setPromptTone] = useState<string>('Cinematic');
  const [language, setLanguage] = useState<string>('English');
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<PromptResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [promptHistory, setPromptHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem('promptHistory');
      if (item) {
        setPromptHistory(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load prompt history from localStorage', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    } catch (error) {
      console.error('Failed to save prompt history to localStorage', error);
    }
  }, [promptHistory]);

  // Adds a new batch of generated prompts to the history
  const addBatchToHistory = (results: PromptResult[]) => {
    const newHistoryItem: HistoryItem = {
      id: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
      results: results,
    };
    setPromptHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
  };

  // Handles selection of multiple image files
  const handleImageSelect = (files: File[], dataUrls: string[]) => {
    setImageFiles(files);
    setImageDataUrls(dataUrls);
    setGeneratedResults([]);
    setError('');
  };

  // Core function to handle prompt generation for a batch of images
  const handleGeneratePrompt = useCallback(async (styleOverride?: string) => {
    if (imageFiles.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedResults([]);

    const currentStyle = styleOverride || promptStyle;

    try {
      const prompts = await generatePrompts(imageFiles, {
        aspectRatio,
        promptStyle: currentStyle,
        promptTone,
        language,
        negativePrompt,
        isEnhanced,
      });

      // Map the generated prompts to the result structure with image previews
      const results: PromptResult[] = prompts.map((prompt, index) => ({
        id: `${new Date().getTime()}-${index}`,
        prompt,
        imagePreviewUrl: imageDataUrls[index],
        style: currentStyle,
        tone: promptTone,
        language,
      }));
      
      setGeneratedResults(results);
      addBatchToHistory(results);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFiles, imageDataUrls, aspectRatio, promptStyle, promptTone, language, negativePrompt, isEnhanced]);

  // "Surprise Me!" function to generate with a random style
  const handleSurpriseMe = useCallback(() => {
    const randomStyle = PROMPT_STYLES[Math.floor(Math.random() * PROMPT_STYLES.length)];
    setPromptStyle(randomStyle);
    handleGeneratePrompt(randomStyle);
  }, [handleGeneratePrompt]);
  
  // Reuse a past generation's settings
  const handleReuseHistoryItem = (item: HistoryItem) => {
    // For simplicity, we just log it. A full implementation would reset controls.
    console.log("Reusing item:", item);
    // In a real app, you would set the state for style, tone, etc., from the item.
  };

  return (
    <div className="min-h-screen text-[#E8E8E8] font-sans selection:bg-[#F5CB5C]/20">
      <Header 
        onHistoryToggle={() => setShowHistory(prev => !prev)}
      />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className={`grid grid-cols-1 ${showHistory ? 'lg:grid-cols-12' : ''} gap-8 lg:gap-12 items-start`}>
          
          {/* Main content area */}
          <motion.div
            layout
            transition={{ duration: 0.3 }}
            className={`flex flex-col gap-8 ${showHistory ? 'lg:col-span-8' : 'lg:col-span-12'}`}
          >
            <ImageUpload onImageSelect={handleImageSelect} imageDataUrls={imageDataUrls} />

            <Controls
              promptStyle={promptStyle}
              setPromptStyle={setPromptStyle}
              promptTone={promptTone}
              setPromptTone={setPromptTone}
              language={language}
              setLanguage={setLanguage}
              isEnhanced={isEnhanced}
              setIsEnhanced={setIsEnhanced}
              negativePrompt={negativePrompt}
              setNegativePrompt={setNegativePrompt}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              isLoading={isLoading}
            />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => handleGeneratePrompt()}
                disabled={imageFiles.length === 0 || isLoading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#F5CB5C] to-[#00E5C8] hover:from-[#f7d37a] hover:to-[#1fffe2] disabled:from-yellow-500/30 disabled:to-cyan-600/30 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-yellow-500/50 shadow-lg shadow-[#F5CB5C]/20 hover:shadow-xl hover:shadow-[#F5CB5C]/30"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <IconSparkles />
                    Generate Prompt{imageFiles.length > 1 ? 's' : ''}
                  </>
                )}
              </button>
              <button
                onClick={handleSurpriseMe}
                disabled={imageFiles.length === 0 || isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 disabled:bg-white/5 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cyan-500/50 shadow-lg shadow-black/20"
              >
                <IconWand />
                Surprise Me!
              </button>
            </div>
            
            <OutputDisplay results={generatedResults} isLoading={isLoading} error={error} expectedCount={imageFiles.length} />
          </motion.div>
          
          {/* History Sidebar */}
          <AnimatePresence>
          {showHistory && (
            <motion.div
              layout="position"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6"
            >
              <PromptHistory history={promptHistory} onReuse={handleReuseHistoryItem} />
            </motion.div>
          )}
          </AnimatePresence>

        </div>
      </main>
      <footer className="w-full text-center py-4 text-sm bg-gradient-to-r from-[#0a0a0a] via-[#111111] to-[#0a0a0a] border-t border-gray-800/50">
        <p className="text-gray-400 hover:text-[#00E5C8] transition-all duration-300">
          Created by <span className="font-semibold text-white">Tabarak Barno</span>
        </p>
      </footer>
    </div>
  );
};

export default App;