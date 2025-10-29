import React, { useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconUploadCloud } from './icons/IconUploadCloud';
import { IconX } from './icons/IconX';

interface ImageUploadProps {
  onImageSelect: (files: File[], dataUrls: string[]) => void;
  imageDataUrls: string[];
}

const MAX_FILES = 5;

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, imageDataUrls }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (files) {
      const selectedFiles = Array.from(files).slice(0, MAX_FILES);
      const dataUrlPromises = selectedFiles.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(dataUrlPromises).then(urls => {
        onImageSelect(selectedFiles, urls);
      });
    }
  }, [onImageSelect]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };
  
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleClear = () => {
    onImageSelect([], []);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div 
        className={`w-full p-px bg-gradient-to-br from-[#F5CB5C]/50 to-[#00E5C8]/50 rounded-2xl shadow-lg transition-all duration-300 ${isDragging ? 'scale-105' : 'scale-100'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        <div
            className={`group w-full bg-black/20 backdrop-blur-lg border border-dashed border-white/10 rounded-[15px] transition-all duration-300 ease-in-out relative overflow-hidden
                    ${isDragging ? 'border-[#F5CB5C]/80 shadow-[0_0_30px_-5px_theme(colors.yellow.400)]' : 'hover:border-[#F5CB5C]/50'}`}
        >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
        />
        {imageDataUrls.length > 0 ? (
            <div className="p-4 relative">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <AnimatePresence>
                        {imageDataUrls.map((url, index) => (
                            <motion.div
                                key={url}
                                layout
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="aspect-square rounded-lg overflow-hidden relative shadow-md shadow-black/20 border border-white/10"
                            >
                                <img
                                    src={url}
                                    alt={`Upload preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <button 
                    onClick={handleClear} 
                    className="absolute top-2 right-2 z-20 p-1.5 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full text-white transition-colors"
                    aria-label="Clear selection"
                >
                    <IconX className="w-4 h-4" />
                </button>
            </div>
        ) : (
            <div onClick={() => fileInputRef.current?.click()} className="text-center p-8 relative z-10 flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_theme(colors.yellow.400/0.4)]">
                    <IconUploadCloud className="h-8 w-8 text-gray-400 group-hover:text-[#F5CB5C] transition-colors" />
                </div>
                <p className="mt-2 text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    <span className="font-semibold text-[#F5CB5C]">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-white/40">Up to {MAX_FILES} images (PNG, JPG, etc)</p>
            </div>
        )}
        </div>
    </div>
  );
};

export default ImageUpload;