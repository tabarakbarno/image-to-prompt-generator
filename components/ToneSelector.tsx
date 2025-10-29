import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronDown } from './icons/IconChevronDown';
import Tooltip from './Tooltip';
import { IconInfo } from './icons/IconInfo';

interface ToneSelectorProps {
  selectedTone: string;
  onChange: (tone: string) => void;
  disabled: boolean;
}

export const TONES = ["Cinematic", "Dramatic", "Happy", "Eerie", "Mystical"];
const TONE_TOOLTIPS: { [key: string]: string } = {
    "Cinematic": "Adds a grand, film-like quality. Good for epic scenes.",
    "Dramatic": "Increases tension and emotional weight with high contrast and intense moods.",
    "Happy": "Infuses the prompt with bright colors, joyful actions, and positive energy.",
    "Eerie": "Creates a sense of unease or creepiness through unsettling details and strange lighting.",
    "Mystical": "Adds a magical, mysterious, or spiritual feeling to the scene."
};

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (node.current && !node.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (tone: string) => {
    onChange(tone);
    setIsOpen(false);
  };

  return (
    <div ref={node} className="relative w-full">
      <label id="tone-label" className="flex items-center gap-1.5 text-sm font-medium text-white/60 mb-2">
        Tone / Emotion
        <Tooltip text="Select the emotional mood or feeling for the generated prompt.">
            <IconInfo className="w-4 h-4 text-gray-500" />
        </Tooltip>
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-black/20 border border-white/10 rounded-2xl shadow-sm pl-4 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="tone-label"
      >
        <span className="block truncate text-gray-200">{selectedTone}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <IconChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-[#0a0a1f]/80 backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            role="listbox"
          >
            {TONES.map((tone) => (
              <li
                key={tone}
                onClick={() => handleSelect(tone)}
                className="group cursor-pointer select-none relative py-2 pl-4 pr-9 text-gray-300 hover:bg-[#F5CB5C]/10 hover:text-[#F5CB5C] mx-1 rounded-lg transition-colors"
                role="option"
                aria-selected={tone === selectedTone}
              >
                <span className={`block truncate ${tone === selectedTone ? 'font-semibold text-[#F5CB5C]' : 'font-normal'}`}>{tone}</span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip text={TONE_TOOLTIPS[tone]} side="right">
                        <IconInfo className="w-4 h-4 text-gray-500" />
                    </Tooltip>
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToneSelector;