// Custom image loader for Azure Static Web Apps
// This loader handles image optimization for static exports

import { ImageLoaderProps } from 'next/image';

interface CustomImageLoaderProps extends ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function customImageLoader({ src, width, quality }: CustomImageLoaderProps): string {
  // For Azure Static Web Apps, we serve images as-is since they're static
  // In a production environment, you might want to use Azure CDN or other image optimization services
  
  // If the src is already a full URL, return it as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // For local images, construct the path relative to the public directory
  // Azure Static Web Apps will serve these from the root
  const basePath = process.env.NODE_ENV === 'production' ? '' : '';
  
  // Remove leading slash if present to avoid double slashes
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  
  return `${basePath}/${cleanSrc}`;
}

// Export additional utility functions if needed
export function getOptimizedImageUrl(src: string, width?: number, quality?: number): string {
  return customImageLoader({ src, width: width || 800, quality: quality || 75 });
}

// Helper function to check if image optimization is available
export function isImageOptimizationAvailable(): boolean {
  return process.env.NODE_ENV !== 'production';
}