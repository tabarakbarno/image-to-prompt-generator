import React from 'react';

export const IconPalette: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.424-.163-.82-.437-1.125-.29-.317-.437-.69-.437-1.125a1.67 1.67 0 0 1 1.667-1.667h1.167c.925 0 1.667-.742 1.667-1.667 0-.424-.163-.82-.437-1.125-.29-.317-.437-.69-.437-1.125a1.67 1.67 0 0 1 1.667-1.667h1.167c.925 0 1.667-.742 1.667-1.667A10 10 0 0 0 12 2z"/>
  </svg>
);