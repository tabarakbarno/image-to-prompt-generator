import React from 'react';

// This is the Lucide "Sparkles" icon, which fits the "Surprise Me" button well.
export const IconWand: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.93 2.07a1 1 0 0 0-1.86 0L6.53 6.53a1 1 0 0 1-.8.8L1.27 8.87a1 1 0 0 0 0 1.86l4.46 1.54a1 1 0 0 1 .8.8l1.54 4.46a1 1 0 0 0 1.86 0l1.54-4.46a1 1 0 0 1 .8-.8l4.46-1.54a1 1 0 0 0 0-1.86l-4.46-1.54a1 1 0 0 1-.8-.8z"/>
    <path d="M18 6 17 2l-1 4-4 1 4 1 1 4 1-4 4-1z"/>
  </svg>
);