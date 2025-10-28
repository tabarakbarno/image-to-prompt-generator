
import React from 'react';
import { IconSparkles } from './icons/IconSparkles';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center gap-3">
        <IconSparkles className="w-10 h-10 text-indigo-400" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          AI Prompt Generator
        </h1>
      </div>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
        Upload an image and let Gemini craft the perfect, detailed prompt for your favorite AI image generator.
      </p>
    </header>
  );
};

export default Header;
