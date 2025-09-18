import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Format a percentage
 */
export function formatPercentage(num: number, decimals = 1): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) {
return text;
}
  return `${text.slice(0, length)}...`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep function for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value == null) {
return true;
}
  if (typeof value === "string") {
return value.trim() === "";
}
  if (Array.isArray(value)) {
return value.length === 0;
}
  if (typeof value === "object") {
return Object.keys(value).length === 0;
}
  return false;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
return "just now";
}
  if (diffInSeconds < 3600) {
return `${Math.floor(diffInSeconds / 60)}m ago`;
}
  if (diffInSeconds < 86400) {
return `${Math.floor(diffInSeconds / 3600)}h ago`;
}
  if (diffInSeconds < 2592000) {
return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
  if (diffInSeconds < 31536000) {
return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}