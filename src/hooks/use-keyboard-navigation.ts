import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  handler: (event: KeyboardEvent) => void;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  preventDefault?: boolean;
}

interface UseKeyboardNavigationOptions {
  shortcuts?: KeyboardShortcut[];
  enableArrowNavigation?: boolean;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
  disabled?: boolean;
}

/**
 * Hook for managing keyboard navigation and shortcuts.
 * Supports custom shortcuts, arrow key navigation, and common key handlers.
 * 
 * @param options - Configuration options for keyboard navigation
 * @param options.shortcuts - Array of custom keyboard shortcuts
 * @param options.enableArrowNavigation - Enable arrow key navigation handlers
 * @param options.onArrowUp - Handler for up arrow key
 * @param options.onArrowDown - Handler for down arrow key
 * @param options.onArrowLeft - Handler for left arrow key
 * @param options.onArrowRight - Handler for right arrow key
 * @param options.onHome - Handler for Home key
 * @param options.onEnd - Handler for End key
 * @param options.onEscape - Handler for Escape key
 * @param options.onEnter - Handler for Enter key
 * @param options.disabled - Disable all keyboard handlers
 * @returns Object with handleKeyDown function
 * 
 * @example
 * ```tsx
 * const { handleKeyDown } = useKeyboardNavigation({
 *   shortcuts: [
 *     {
 *       key: 's',
 *       ctrlKey: true,
 *       handler: () => saveDocument(),
 *       preventDefault: true
 *     }
 *   ],
 *   enableArrowNavigation: true,
 *   onArrowUp: () => selectPreviousItem(),
 *   onArrowDown: () => selectNextItem(),
 *   onEscape: () => closeModal()
 * });
 * ```
 */
export function useKeyboardNavigation({
  shortcuts = [],
  enableArrowNavigation = false,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onHome,
  onEnd,
  onEscape,
  onEnter,
  disabled = false,
}: UseKeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      // Check custom shortcuts first
      for (const shortcut of shortcuts) {
        const ctrlKeyMatch = shortcut.ctrlKey ? event.ctrlKey : true;
        const metaKeyMatch = shortcut.metaKey ? event.metaKey : true;
        const altKeyMatch = shortcut.altKey ? event.altKey : true;
        const shiftKeyMatch = shortcut.shiftKey ? event.shiftKey : true;

        if (
          event.key === shortcut.key &&
          ctrlKeyMatch &&
          metaKeyMatch &&
          altKeyMatch &&
          shiftKeyMatch
        ) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler(event);
          return;
        }
      }

      // Handle arrow navigation
      if (enableArrowNavigation) {
        switch (event.key) {
          case 'ArrowUp':
            if (onArrowUp) {
              event.preventDefault();
              onArrowUp();
            }
            break;
          case 'ArrowDown':
            if (onArrowDown) {
              event.preventDefault();
              onArrowDown();
            }
            break;
          case 'ArrowLeft':
            if (onArrowLeft) {
              event.preventDefault();
              onArrowLeft();
            }
            break;
          case 'ArrowRight':
            if (onArrowRight) {
              event.preventDefault();
              onArrowRight();
            }
            break;
          case 'Home':
            if (onHome) {
              event.preventDefault();
              onHome();
            }
            break;
          case 'End':
            if (onEnd) {
              event.preventDefault();
              onEnd();
            }
            break;
        }
      }

      // Handle common keys
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
      }

      if (event.key === 'Enter' && onEnter) {
        event.preventDefault();
        onEnter();
      }
    },
    [
      disabled,
      shortcuts,
      enableArrowNavigation,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      onHome,
      onEnd,
      onEscape,
      onEnter,
    ]
  );

  useEffect(() => {
    if (disabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, disabled]);

  return {
    handleKeyDown,
  };
}

/**
 * Helper hook for keyboard navigation within lists or grids.
 * Handles focus management and item selection with keyboard.
 * 
 * @template T - The type of the container HTML element
 * @param options - Configuration options
 * @param options.containerRef - React ref to the container element
 * @param options.itemSelector - CSS selector for focusable items (default: '[tabindex="0"]')
 * @param options.onItemSelect - Callback when an item is selected with Enter/Space
 * @param options.circular - Enable circular navigation (wrap around at ends)
 * @returns Object with navigation utilities
 * @returns focusItem - Function to focus item at specific index
 * @returns getCurrentIndex - Function to get currently focused item index
 * 
 * @example
 * ```tsx
 * const listRef = useRef<HTMLUListElement>(null);
 * const { focusItem, getCurrentIndex } = useListKeyboardNavigation({
 *   containerRef: listRef,
 *   itemSelector: 'li[role="option"]',
 *   onItemSelect: (element) => {
 *     const value = element.getAttribute('data-value');
 *     handleSelect(value);
 *   },
 *   circular: true
 * });
 * 
 * return (
 *   <ul ref={listRef} role="listbox">
 *     {items.map((item, index) => (
 *       <li
 *         key={item.id}
 *         role="option"
 *         tabIndex={index === 0 ? 0 : -1}
 *         data-value={item.value}
 *       >
 *         {item.label}
 *       </li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export function useListKeyboardNavigation<T extends HTMLElement>({
  containerRef,
  itemSelector = '[tabindex="0"]',
  onItemSelect,
  circular = false,
}: {
  containerRef: React.RefObject<T>;
  itemSelector?: string;
  onItemSelect?: (element: HTMLElement) => void;
  circular?: boolean;
}) {
  const focusItem = useCallback(
    (index: number) => {
      if (!containerRef.current) return;

      const items = containerRef.current.querySelectorAll<HTMLElement>(itemSelector);
      if (items.length === 0) return;

      // Handle circular navigation
      let targetIndex = index;
      if (circular) {
        targetIndex = ((index % items.length) + items.length) % items.length;
      } else {
        targetIndex = Math.max(0, Math.min(index, items.length - 1));
      }

      items[targetIndex]?.focus();
    },
    [containerRef, itemSelector, circular]
  );

  const getCurrentIndex = useCallback(() => {
    if (!containerRef.current) return -1;

    const items = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(itemSelector)
    );
    const activeElement = document.activeElement as HTMLElement;

    return items.indexOf(activeElement);
  }, [containerRef, itemSelector]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      const currentIndex = getCurrentIndex();
      if (currentIndex === -1) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusItem(currentIndex + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusItem(currentIndex - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusItem(0);
          break;
        case 'End':
          event.preventDefault();
          const items = containerRef.current.querySelectorAll(itemSelector);
          focusItem(items.length - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          const activeElement = document.activeElement as HTMLElement;
          if (onItemSelect && activeElement) {
            onItemSelect(activeElement);
          }
          break;
      }
    },
    [containerRef, getCurrentIndex, focusItem, itemSelector, onItemSelect]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, handleKeyDown]);

  return {
    focusItem,
    getCurrentIndex,
  };
}