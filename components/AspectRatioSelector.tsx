import React from 'react';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onChange: (ratio: string) => void;
  disabled: boolean;
}

const RATIO_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '16:9', label: '16:9' },
  { value: '1:1', label: '1:1' },
  { value: '9:16', label: '9:16' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onChange, disabled }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-2">
        Aspect Ratio
      </label>
      <div className="flex flex-wrap gap-2">
        {RATIO_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            disabled={disabled}
            className={`
              px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ease-in-out 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-yellow-500
              border
              ${selectedRatio === value
                ? 'bg-[#F5CB5C]/10 text-[#F5CB5C] border-[#F5CB5C]/30'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;