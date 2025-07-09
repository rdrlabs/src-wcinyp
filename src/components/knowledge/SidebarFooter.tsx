'use client';

export function SidebarFooter() {
  return (
    <div className="border-t border-border pt-4 mt-4">
      <div className="px-3 text-sm text-muted-foreground">
        <div className="mb-2">
          <strong className="text-foreground">WCINYP Docs</strong>
        </div>
        <div className="space-y-2 text-sm">
          <div>Version 1.0.0</div>
          <div>© 2025 Weill Cornell Medicine</div>
        </div>
      </div>
    </div>
  );
}