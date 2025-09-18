"use client";

// Color contrast utility
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0;
    
    const [r, g, b] = rgb.slice(0, 3).map(Number);
    const [rs, gs, bs] = [r, g, b].map((c) => {
      if (c === undefined) return 0;
      const normalized = c / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * (rs || 0) + 0.7152 * (gs || 0) + 0.0722 * (bs || 0);
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if contrast meets WCAG standards
export const meetsContrastRequirement = (
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
  size: "normal" | "large" = "normal"
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === "AAA") {
    return size === "large" ? ratio >= 4.5 : ratio >= 7;
  }
  
  return size === "large" ? ratio >= 3 : ratio >= 4.5;
};

// Keyboard navigation utilities
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: "polite" | "assertive" = "polite") => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Check if element is focusable
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ];
  
  return focusableSelectors.some(selector => element.matches(selector));
};

// Generate unique IDs for accessibility
export const generateAccessibleId = (prefix: string = 'accessible'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate ARIA attributes
export const validateAriaAttributes = (element: HTMLElement): string[] => {
  const errors: string[] = [];
  const ariaAttributes = Array.from(element.attributes).filter(attr => 
    attr.name.startsWith('aria-')
  );
  
  ariaAttributes.forEach(attr => {
    const value = attr.value;
    
    // Check for empty ARIA attributes
    if (!value.trim()) {
      errors.push(`Empty ARIA attribute: ${attr.name}`);
    }
    
    // Check for invalid boolean ARIA attributes
    const booleanAttrs = ['aria-hidden', 'aria-expanded', 'aria-checked', 'aria-selected'];
    if (booleanAttrs.includes(attr.name) && !['true', 'false'].includes(value)) {
      errors.push(`Invalid boolean value for ${attr.name}: ${value}`);
    }
  });
  
  return errors;
};

// Check for proper heading hierarchy
export const validateHeadingHierarchy = (container: HTMLElement = document.body): string[] => {
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const errors: string[] = [];
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (index === 0 && level !== 1) {
      errors.push('First heading should be h1');
    }
    
    if (level > previousLevel + 1) {
      errors.push(`Heading level jumps from h${previousLevel} to h${level}`);
    }
    
    previousLevel = level;
  });
  
  return errors;
};