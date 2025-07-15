import { useEffect, useCallback } from 'react';

interface UseTableKeyboardNavigationProps {
  totalRows: number;
  onRowSelect?: (index: number) => void;
  onRowActivate?: (index: number) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  enabled?: boolean;
}

export function useTableKeyboardNavigation({
  totalRows,
  onRowSelect,
  onRowActivate,
  onSelectAll,
  onClearSelection,
  enabled = true,
}: UseTableKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || totalRows === 0) return;

      // Get currently focused row
      const focusedElement = document.activeElement;
      const currentRow = focusedElement?.closest('tr[data-state]');
      const allRows = Array.from(document.querySelectorAll('tr[data-state]'));
      const currentIndex = currentRow ? allRows.indexOf(currentRow as HTMLTableRowElement) : -1;

      switch (event.key) {
        case 'j':
        case 'ArrowDown':
          event.preventDefault();
          if (currentIndex < totalRows - 1) {
            const nextRow = allRows[currentIndex + 1] as HTMLTableRowElement;
            nextRow?.focus();
            nextRow?.scrollIntoView({ block: 'nearest' });
          }
          break;

        case 'k':
        case 'ArrowUp':
          event.preventDefault();
          if (currentIndex > 0) {
            const prevRow = allRows[currentIndex - 1] as HTMLTableRowElement;
            prevRow?.focus();
            prevRow?.scrollIntoView({ block: 'nearest' });
          }
          break;

        case ' ':
          event.preventDefault();
          if (currentIndex >= 0 && onRowSelect) {
            onRowSelect(currentIndex);
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (currentIndex >= 0 && onRowActivate) {
            onRowActivate(currentIndex);
          }
          break;

        case 'a':
          if ((event.metaKey || event.ctrlKey) && onSelectAll) {
            event.preventDefault();
            onSelectAll();
          }
          break;

        case 'Escape':
          if (onClearSelection) {
            event.preventDefault();
            onClearSelection();
          }
          break;
      }
    },
    [totalRows, onRowSelect, onRowActivate, onSelectAll, onClearSelection, enabled]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);

  return {
    handleKeyDown,
  };
}