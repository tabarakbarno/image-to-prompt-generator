import React from 'react';
import { IconWand2 } from './icons/IconWand2';
import { IconSettings } from './icons/IconSettings';
import { IconHistory } from './icons/IconHistory';
import { IconUser } from './icons/IconUser';

interface HeaderProps {
  onHistoryToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryToggle }) => {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 transition-colors duration-500">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <IconWand2 className="w-8 h-8 text-[#F5CB5C]" />
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F5CB5C] to-[#E8E8E8] font-heading">
              PromptSmith AI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onHistoryToggle}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-yellow-500"
              aria-label="Toggle History"
            >
              <IconHistory className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-yellow-500" aria-label="Settings">
              <IconSettings className="w-5 h-5" />
            </button>
             <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-yellow-500" aria-label="Profile">
              <IconUser className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Simple User Icon for the header
const IconUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);


export default Header;