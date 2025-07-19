"use client"

import * as React from "react"
import { DialogContent } from "./dialog"

type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogContent>

interface KeyboardEnhancedDialogContentProps extends DialogContentProps {
  onEscape?: () => void;
  children: React.ReactNode;
}

export const KeyboardEnhancedDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  KeyboardEnhancedDialogContentProps
>(({ children, ...props }, ref) => {
  // Focus trap for better keyboard navigation
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      // Focus the first focusable element when dialog opens
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, []);

  // Tab trap to keep focus within dialog
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
    <DialogContent ref={ref} {...props}>
      <div ref={contentRef}>{children}</div>
    </DialogContent>
  );
});

KeyboardEnhancedDialogContent.displayName = "KeyboardEnhancedDialogContent";