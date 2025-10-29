import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptResult } from '../App';
import { generateImageFromPrompt, regeneratePrompt } from '../services/geminiService';
import { IconCopy } from './icons/IconCopy';
import { IconCheck } from './icons/IconCheck';
import { IconRepeat } from './icons/IconRepeat';
import { IconLanguages } from './icons/IconLanguages';
import { IconPalette } from './icons/IconPalette';
import { IconSmile } from './icons/IconSmile';
import { IconWand2 } from './icons/IconWand2';
import { IconBolt } from './icons/IconBolt';


interface PromptCardProps {
  result: PromptResult;
}

const PromptCard: React.FC<PromptCardProps> = ({ result }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(result.prompt);
  
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const newPrompt = await regeneratePrompt(currentPrompt, result.style, result.tone);
      setCurrentPrompt(newPrompt);
    } catch (error) {
      // Handle error, maybe show a toast
      console.error("Failed to regenerate prompt", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setImageGenerationError(null);
    setGeneratedImageUrl(null);
    try {
      const base64Data = await generateImageFromPrompt(currentPrompt);
      setGeneratedImageUrl(`data:image/png;base64,${base64Data}`);
    } catch (error) {
      setImageGenerationError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsGeneratingImage(false);
    }
  };


  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className="relative w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#F5CB5C]/50 hover:shadow-2xl hover:shadow-[#F5CB5C]/10"
    >
      <div className="flex items-start gap-4">
        <img src={result.imagePreviewUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
        <div className="flex-1">
            <h3 className="font-bold text-gray-100 font-heading">Generated Prompt</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-400">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#F5CB5C]/10 rounded-full border border-[#F5CB5C]/20 text-[#F5CB5C]"><IconPalette className="w-3 h-3" /> {result.style}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-300"><IconSmile className="w-3 h-3" /> {result.tone}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20 text-green-300"><IconLanguages className="w-3 h-3" /> {result.language}</span>
            </div>
        </div>
      </div>
      
      <div className="text-gray-300 whitespace-pre-wrap font-light leading-relaxed text-sm min-h-[6em] relative">
        <AnimatePresence mode="wait">
            <motion.p
                key={currentPrompt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {currentPrompt}
            </motion.p>
        </AnimatePresence>
         {isRegenerating && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <IconBolt className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pt-4 border-t border-white/10">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm font-semibold text-gray-300 hover:text-white"
          aria-label="Copy prompt"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isCopied ? 'check' : 'copy'}
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              {isCopied ? <IconCheck className="w-4 h-4 text-green-500" /> : <IconCopy className="w-4 h-4" />}
            </motion.div>
          </AnimatePresence>
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm font-semibold text-gray-300 hover:text-white disabled:opacity-50"
          aria-label="Regenerate prompt"
        >
          {isRegenerating ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <IconRepeat className="w-4 h-4" />}
          Regenerate
        </button>
        <button
          onClick={handleGenerateImage}
          disabled={isGeneratingImage}
          className="lg:col-span-1 col-span-2 flex items-center justify-center gap-2 w-full px-3 py-2 bg-[#F5CB5C]/10 hover:bg-[#F5CB5C]/20 border border-[#F5CB5C]/30 rounded-lg transition-colors text-sm font-semibold text-[#F5CB5C] hover:text-yellow-300 disabled:opacity-50"
          aria-label="Generate Image"
        >
          {isGeneratingImage ? <div className="w-4 h-4 border-2 border-yellow-400/50 border-t-yellow-400 rounded-full animate-spin"></div> : <IconWand2 className="w-4 h-4" />}
          Generate Image
        </button>
      </div>

      <AnimatePresence>
        {isGeneratingImage && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full aspect-square bg-black/20 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-center p-4"
             >
                <div className="w-8 h-8 border-4 border-yellow-400/50 border-t-yellow-400 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-semibold text-yellow-400">Generating your image...</p>
                <p className="text-xs text-white/50">This may take a moment.</p>
             </motion.div>
        )}
        {imageGenerationError && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-center"
             >
                <p className="text-sm font-semibold text-red-400">Image Generation Failed</p>
                <p className="text-xs text-red-400/70">{imageGenerationError}</p>
             </motion.div>
        )}
        {generatedImageUrl && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full aspect-square rounded-lg overflow-hidden border border-white/10"
            >
                <img src={generatedImageUrl} alt="AI generated image" className="w-full h-full object-cover" />
            </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default PromptCard;