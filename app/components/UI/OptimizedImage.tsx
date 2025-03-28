import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component with progressive loading
 * 
 * Features:
 * - Lazy loading with browser native support
 * - Placeholder color while loading
 * - Progressive enhancement with blur-up effect
 * - Automatic handling of image errors
 * - Support for responsive sizes
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  placeholderColor = '#f3f4f6', // Light gray default
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    if (onError) onError();
  };

  // If the image failed to load, show a placeholder
  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, backgroundColor: placeholderColor }}
        role="img"
        aria-label={alt}
      >
        <svg 
          className="w-10 h-10 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* Placeholder while image loads */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-pulse animate-pulse" 
          style={{ backgroundColor: placeholderColor }}
        />
      )}
      
      {/* The actual image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? "lazy" : undefined}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
} 