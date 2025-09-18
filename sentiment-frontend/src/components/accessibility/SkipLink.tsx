"use client";

import React, { useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

type SkipLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const SkipLink = ({ href, children, className }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "bg-primary text-primary-foreground px-4 py-2 rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      {children}
    </a>
  );
};

// Screen reader only text component
type ScreenReaderOnlyProps = {
  children: React.ReactNode;
  as?: React.ElementType;
};

export const ScreenReaderOnly = ({ children, as: Component = "span" }: ScreenReaderOnlyProps) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
};

// Accessible heading component with proper hierarchy
type AccessibleHeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export const AccessibleHeading = ({ level, children, className, id }: AccessibleHeadingProps) => {
  const Component = `h${level}` as React.ElementType;
  
  return (
    <Component
      id={id}
      className={cn(
        "scroll-m-20 tracking-tight",
        {
          "text-4xl font-extrabold lg:text-5xl": level === 1,
          "text-3xl font-semibold": level === 2,
          "text-2xl font-semibold": level === 3,
          "text-xl font-semibold": level === 4,
          "text-lg font-semibold": level === 5,
          "text-base font-semibold": level === 6,
        },
        className
      )}
    >
      {children}
    </Component>
  );
};

// Focus trap component for modals and dialogs
type FocusTrapProps = {
  children: React.ReactNode;
  enabled?: boolean;
};

export const FocusTrap = ({ children, enabled = true }: FocusTrapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
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

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};