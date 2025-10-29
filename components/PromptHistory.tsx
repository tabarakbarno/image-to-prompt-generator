import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconCopy } from './icons/IconCopy';
import { IconCheck } from './icons/IconCheck';
import { IconHistory } from './icons/IconHistory';
import { IconRepeat } from './icons/IconRepeat';
import { IconChevronDown } from './icons/IconChevronDown';
import { HistoryItem } from '../App';


interface HistoryBatchItemProps {
  item: HistoryItem;
  onReuse: (item: HistoryItem) => void;
  index: number;
}

const HistoryBatchItem: React.FC<HistoryBatchItemProps> = ({ item, onReuse, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-black/30 rounded-2xl border border-transparent hover:border-white/10 transition-colors"
    >
        <div 
            className="group flex items-center justify-between p-3 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-300">
                    {item.results.length} Prompt{item.results.length > 1 ? 's' : ''} Generated
                </span>
                <span className="text-xs text-gray-500">{item.timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => { e.stopPropagation(); onReuse(item); }}
                    className="p-1.5 bg-white/10 rounded-md text-gray-300 hover:bg-white/20 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Reuse settings"
                >
                    <IconRepeat className="w-4 h-4" />
                </button>
                <IconChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
        <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <div className="border-t border-white/10 p-3 space-y-2">
                    {item.results.map(result => (
                         <div key={result.id} className="group relative flex items-center justify-between text-sm text-gray-400 p-2 rounded-lg hover:bg-white/5">
                            <img src={result.imagePreviewUrl} alt="preview" className="w-8 h-8 rounded-md object-cover mr-3 border border-white/10" />
                            <p className="flex-1 truncate pr-10">{result.prompt}</p>
                            <button
                                onClick={() => handleCopy(result.prompt, result.id)}
                                className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 bg-white/10 rounded-md text-gray-300 hover:bg-white/20 hover:text-white opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
                                aria-label="Copy prompt"
                            >
                                {copiedId === result.id ? <IconCheck className="w-4 h-4 text-green-500" /> : <IconCopy className="w-4 h-4" />}
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    </motion.div>
  )
}


const PromptHistory: React.FC<{ history: HistoryItem[]; onReuse: (item: HistoryItem) => void; }> = ({ history, onReuse }) => {
  return (
    <div className="w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-4 px-2">
        <IconHistory className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-300 font-heading">Prompt History</h3>
      </div>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        <AnimatePresence>
          {history.length > 0 ? (
            history.map((item, index) => (
              <HistoryBatchItem key={item.id} item={item} index={index} onReuse={onReuse} />
            ))
          ) : (
             <div className="text-center py-8">
                <p className="text-sm text-gray-500">No history yet.</p>
                <p className="text-xs text-gray-400">Generated prompts will appear here.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PromptHistory;