
import React, { useRef } from 'react';
import { IconUpload } from './icons/IconUpload';

interface ImageUploadProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  imageDataUrl: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, imageDataUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(file, e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-400 mb-2">
        Upload Image
      </label>
      <div
        onClick={handleClick}
        className="group cursor-pointer aspect-video w-full bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center transition-all duration-300 ease-in-out hover:border-indigo-500 hover:bg-gray-800/50"
      >
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt="Upload preview"
            className="w-full h-full object-contain rounded-lg p-1"
          />
        ) : (
          <div className="text-center p-8">
            <IconUpload className="mx-auto h-12 w-12 text-gray-500 group-hover:text-indigo-400 transition-colors" />
            <p className="mt-2 text-sm text-gray-400 group-hover:text-gray-300">
              <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
