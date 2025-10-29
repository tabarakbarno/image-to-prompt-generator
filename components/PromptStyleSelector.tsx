import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronDown } from './icons/IconChevronDown';
import Tooltip from './Tooltip';
import { IconInfo } from './icons/IconInfo';

interface PromptStyleSelectorProps {
  selectedStyle: string;
  onChange: (style: string) => void;
  disabled: boolean;
}

export const PROMPT_STYLES = ["Cinematic", "Photorealistic", "Anime", "Fantasy Art", "Minimalist", "Portrait", "Product Photography"];

const STYLE_TOOLTIPS: { [key: string]: string } = {
    "Cinematic": "Creates dramatic, movie-like scenes with deep shadows and rich colors. Think film stills.",
    "Photorealistic": "Aims for hyper-realism, capturing fine details, textures, and natural lighting as if taken by a high-end camera.",
    "Anime": "Emulates Japanese animation style, often featuring vibrant colors, expressive characters, and dynamic action lines.",
    "Fantasy Art": "Generates epic, imaginative scenes with magical elements, mythical creatures, and fantastical landscapes.",
    "Minimalist": "Focuses on simplicity, using limited color palettes, clean lines, and negative space to create a strong visual impact.",
    "Portrait": "Optimized for creating detailed and expressive character or subject portraits, focusing on facial features and lighting.",
    "Product Photography": "Generates clean, professional-looking images of products, often with studio lighting and controlled backgrounds."
};

const PromptStyleSelector: React.FC<PromptStyleSelectorProps> = ({ selectedStyle, onChange, disabled }) => {
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

  const handleSelect = (style: string) => {
    onChange(style);
    setIsOpen(false);
  };

  return (
    <div ref={node} className="relative w-full">
      <label id="style-label" className="flex items-center gap-1.5 text-sm font-medium text-white/60 mb-2">
        Style
        <Tooltip text="Select the overall artistic style for the generated prompt.">
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
        aria-labelledby="style-label"
      >
        <span className="block truncate text-gray-200">{selectedStyle}</span>
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
            {PROMPT_STYLES.map((style) => (
              <li
                key={style}
                onClick={() => handleSelect(style)}
                className="group cursor-pointer select-none relative py-2 pl-4 pr-9 text-gray-300 hover:bg-[#F5CB5C]/10 hover:text-[#F5CB5C] mx-1 rounded-lg transition-colors"
                role="option"
                aria-selected={style === selectedStyle}
              >
                <span className={`block truncate ${style === selectedStyle ? 'font-semibold text-[#F5CB5C]' : 'font-normal'}`}>{style}</span>
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip text={STYLE_TOOLTIPS[style]} side="right">
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

export default PromptStyleSelector;