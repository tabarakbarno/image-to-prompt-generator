import React from 'react';
import PromptStyleSelector from './PromptStyleSelector';
import ToneSelector from './ToneSelector';
import LanguageSelector from './LanguageSelector';
import AspectRatioSelector from './AspectRatioSelector';
import { IconBolt } from './icons/IconBolt';

interface ControlsProps {
  promptStyle: string;
  setPromptStyle: (style: string) => void;
  promptTone: string;
  setPromptTone: (tone: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isEnhanced: boolean;
  setIsEnhanced: (enhanced: boolean) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  isLoading: boolean;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const {
    promptStyle, setPromptStyle,
    promptTone, setPromptTone,
    language, setLanguage,
    isEnhanced, setIsEnhanced,
    negativePrompt, setNegativePrompt,
    aspectRatio, setAspectRatio,
    isLoading
  } = props;

  return (
    <div className="flex flex-col gap-6">
      {/* Top row of controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PromptStyleSelector
          selectedStyle={promptStyle}
          onChange={setPromptStyle}
          disabled={isLoading}
        />
        <ToneSelector
          selectedTone={promptTone}
          onChange={setPromptTone}
          disabled={isLoading}
        />
        <LanguageSelector
          selectedLanguage={language}
          onChange={setLanguage}
          disabled={isLoading}
        />
      </div>

      {/* Textarea inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="negative-prompt" className="block text-sm font-medium text-white/60 mb-2">
            Negative Prompt (what to avoid)
          </label>
          <textarea
            id="negative-prompt"
            rows={2}
            className="w-full bg-black/20 border border-white/10 rounded-2xl p-3 text-gray-200 focus:ring-2 focus:ring-yellow-500 transition duration-150 ease-in-out placeholder-gray-500"
            placeholder="e.g., blurry, ugly, text, watermark..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col">
            <label className="block text-sm font-medium text-white/60 mb-2">
                Enhancement
            </label>
            <button
                onClick={() => setIsEnhanced(!isEnhanced)}
                disabled={isLoading}
                className={`relative w-full h-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-yellow-500
                ${isEnhanced ? 'bg-[#F5CB5C]/10 text-[#F5CB5C] border border-[#F5CB5C]/50 shadow-lg shadow-[#F5CB5C]/10' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10' }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <IconBolt className={`w-5 h-5 transition-colors ${isEnhanced ? 'text-[#F5CB5C]' : 'text-gray-400'}`} />
                Enhance Prompt Details
            </button>
        </div>
      </div>
      
      {/* Aspect Ratio Selector */}
      <AspectRatioSelector
        selectedRatio={aspectRatio}
        onChange={setAspectRatio}
        disabled={isLoading}
      />
    </div>
  );
};

export default Controls;