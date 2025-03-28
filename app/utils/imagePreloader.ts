/**
 * Utility for preloading images asynchronously
 */

// List of essential images to preload
const ESSENTIAL_IMAGES = [
  '/images/bloxd-gameplay.jpg',
  // Add more essential images here
];

/**
 * Preloads a single image asynchronously
 * @param src Image source URL
 * @returns Promise that resolves when the image is loaded or rejects on error
 */
const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    
    img.src = src;
  });
};

/**
 * Preloads a list of images asynchronously
 * @param images Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded
 */
export const preloadImages = async (images: string[] = ESSENTIAL_IMAGES): Promise<void> => {
  try {
    // Load all images concurrently
    const promises = images.map(preloadImage);
    await Promise.all(promises);
    console.log('✅ Images preloaded successfully');
  } catch (error) {
    console.warn('⚠️ Some images failed to preload:', error);
  }
};

/**
 * Initializes image preloading based on the environment
 */
export const initImagePreloader = (): void => {
  // Skip preloading during server-side rendering
  if (typeof window === 'undefined') return;
  
  // Use requestIdleCallback if available for better performance
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      preloadImages();
    });
  } else {
    // Fallback to setTimeout
    setTimeout(() => {
      preloadImages();
    }, 1000); // Start preloading after 1 second
  }
};

export default {
  preloadImage,
  preloadImages,
  initImagePreloader
}; 