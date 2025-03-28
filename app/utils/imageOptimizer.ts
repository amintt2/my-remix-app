/**
 * Utility for optimizing images with automatic format conversion and quality adjustment
 */

// Configuration options for image optimization
interface OptimizationOptions {
  quality?: number;       // Image quality (0-100)
  maxWidth?: number;      // Maximum width to resize to
  format?: 'webp' | 'jpeg' | 'png'; // Target format
  progressive?: boolean;  // Use progressive loading for JPEGs
}

// Default options for optimization
const DEFAULT_OPTIONS: OptimizationOptions = {
  quality: 80,            // Good balance of quality/size
  maxWidth: 1200,         // Reasonable max width for most web use
  format: 'webp',         // WebP is generally the best format for web
  progressive: true,      // Enable progressive loading
};

/**
 * Optimizes an image in the browser using Canvas
 * 
 * @param imgElement - The image element to optimize
 * @param options - Optimization options
 * @returns Promise with the resulting blob URL
 */
export const optimizeImage = async (
  imgElement: HTMLImageElement,
  options: OptimizationOptions = DEFAULT_OPTIONS
): Promise<string> => {
  const { quality = 80, maxWidth = 1200, format = 'webp', progressive = true } = options;
  
  // Create a canvas element to manipulate the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Unable to get canvas context');
  }
  
  // Calculate dimensions while maintaining aspect ratio
  let width = imgElement.naturalWidth;
  let height = imgElement.naturalHeight;
  
  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = Math.floor(height * ratio);
  }
  
  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;
  
  // Draw the image on the canvas
  ctx.drawImage(imgElement, 0, 0, width, height);
  
  // Convert to the requested format
  const mimeType = format === 'webp' 
    ? 'image/webp' 
    : format === 'jpeg' 
      ? 'image/jpeg' 
      : 'image/png';
  
  // Create a blob from the canvas
  return new Promise((resolve, reject) => {
    // For JPEG format, use progressive if requested (browser implementation may vary)
    if (format === 'jpeg' && progressive) {
      console.log('Using progressive JPEG option');
      // Progressive option is handled by the browser internally
      // Not all browsers support progressive option directly
    }
    
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      mimeType,
      quality / 100
    );
  });
};

/**
 * Optimizes an image from a URL
 * 
 * @param src - The image source URL
 * @param options - Optimization options
 * @returns Promise with the optimized image URL
 */
export const optimizeImageFromUrl = async (
  src: string,
  options: OptimizationOptions = DEFAULT_OPTIONS
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = async () => {
      try {
        const optimizedUrl = await optimizeImage(img, options);
        resolve(optimizedUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    
    // Start loading the image
    img.src = src;
    
    // Make sure we can load cross-origin images
    img.crossOrigin = 'anonymous';
  });
};

/**
 * Creates an image element with optimized loading attributes
 */
export const createOptimizedImageElement = (
  src: string,
  alt: string,
  className: string = '',
  lazy: boolean = true
): HTMLImageElement => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  
  if (className) {
    img.className = className;
  }
  
  // Add loading attribute for better performance
  if (lazy) {
    img.loading = 'lazy';
  }
  
  // Add decoding attribute to improve rendering performance
  img.decoding = 'async';
  
  return img;
};

export default {
  optimizeImage,
  optimizeImageFromUrl,
  createOptimizedImageElement
}; 