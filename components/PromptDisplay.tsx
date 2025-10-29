import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PromptResult } from '../App';
import PromptCard from './PromptCard';
import { exportToJSON, exportToTXT } from '../utils/export';
import { IconDownload } from './icons/IconDownload';

interface OutputDisplayProps {
  results: PromptResult[];
  isLoading: boolean;
  error: string;
  expectedCount: number;
}

const LoadingSkeleton: React.FC = () => (
  <div className="relative w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 min-h-[250px] overflow-hidden">
    <div className="space-y-4 p-2">
      <div className="flex gap-4 items-center">
        <div className="shimmer h-16 w-16 bg-white/5 rounded-lg"></div>
        <div className="flex-1 space-y-2">
            <div className="shimmer h-4 bg-white/5 rounded w-1/4"></div>
            <div className="shimmer h-4 bg-white/5 rounded w-3/4"></div>
        </div>
      </div>
      <div className="shimmer h-4 bg-white/5 rounded w-full"></div>
      <div className="shimmer h-4 bg-white/5 rounded w-5/6"></div>
    </div>
  </div>
);

const OutputDisplay: React.FC<OutputDisplayProps> = ({ results, isLoading, error, expectedCount }) => {

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: expectedCount || 1 }).map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      );
    }
    if (error) {
      return <p className="text-red-400 font-medium text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/30">{error}</p>;
    }
    if (results.length > 0) {
      return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            }}
            initial="hidden"
            animate="show"
        >
            {results.map((result) => (
                <PromptCard key={result.id} result={result} />
            ))}
        </motion.div>
      );
    }
    return (
      <div className="w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 min-h-[250px] flex items-center justify-center">
        <p className="text-white/40 italic text-center">
            Your generated AI image prompts will appear here.
        </p>
      </div>
    );
  };
  
  return (
    <div className="w-full relative">
      <AnimatePresence>
        {results.length > 0 && !error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-end gap-2 mb-4"
          >
            <button
              onClick={() => exportToTXT(results)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm font-semibold text-gray-300 hover:text-white"
              aria-label="Export as TXT"
            >
              <IconDownload className="w-4 h-4" />
              TXT
            </button>
             <button
              onClick={() => exportToJSON(results)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm font-semibold text-gray-300 hover:text-white"
              aria-label="Export as JSON"
            >
              <IconDownload className="w-4 h-4" />
              JSON
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {renderContent()}
    </div>
  );
};

export default OutputDisplay;