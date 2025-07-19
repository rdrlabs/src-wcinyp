"use client"

import * as React from "react"
import { SheetContent } from "./sheet"

interface KeyboardEnhancedSheetContentProps extends React.ComponentProps<typeof SheetContent> {
  onEscape?: () => void;
  children: React.ReactNode;
}

export function KeyboardEnhancedSheetContent({
  children,
  ...props
}: KeyboardEnhancedSheetContentProps) {
  // Focus trap for better keyboard navigation
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      // Focus the first focusable element when sheet opens
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, []);

  // Tab trap to keep focus within sheet
  React.useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !contentRef.current) return;

      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, []);

  return (
    <SheetContent {...props}>
      <div ref={contentRef}>{children}</div>
    </SheetContent>
  );
}