'use client';

export function SidebarFooter() {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <div className="px-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="mb-2">
          <strong className="text-gray-700 dark:text-gray-300">WCINYP Docs</strong>
        </div>
        <div className="space-y-1 text-xs">
          <div>Version 1.0.0</div>
          <div>© 2025 Weill Cornell Medicine</div>
        </div>
      </div>
    </div>
  );
}