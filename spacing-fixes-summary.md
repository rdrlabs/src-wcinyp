## Summary of Non-Grid Spacing Fixes

### Files Updated (17 files):

1. **src/app/directory/components/ReferringProviderTable.tsx**
   - gap-1.5 → gap-2 (2 occurrences)
   - space-y-1 → space-y-2 (2 occurrences)

2. **src/components/ui/provider-table.tsx**
   - gap-1 → gap-2 (2 occurrences)

3. **src/app/directory/page.tsx**
   - space-y-1 → space-y-2
   - gap-1.5 → gap-2 (3 occurrences)

4. **src/app/updates/page.tsx**
   - gap-3 → gap-4

5. **src/app/documents/page.tsx**
   - space-x-3 → space-x-4
   - gap-1.5 → gap-2
   - gap-1 → gap-2 (11 occurrences)

6. **src/components/features/forms/FormBuilderUI.tsx**
   - gap-1 → gap-2
   - gap-3 → gap-4

7. **src/components/FormBuilder.tsx**
   - gap-3 → gap-4

8. **src/components/features/forms/FormsList.tsx**
   - gap-1 → gap-2 (2 occurrences)

9. **src/components/ErrorBoundary.tsx**
   - gap-3 → gap-4

10. **src/components/ui/card.tsx**
    - space-y-1.5 → space-y-2

11. **src/components/ui/dialog.tsx**
    - space-y-1.5 → space-y-2

12. **src/components/knowledge/SidebarFooter.tsx**
    - space-y-1 → space-y-2

13. **src/components/ui/select.tsx**
    - p-1 → p-2

14. **src/components/ui/dropdown-menu.tsx**
    - p-1 → p-2 (2 occurrences)

15. **src/components/ui/command.tsx**
    - p-1 → p-2

16. **src/components/ui/tabs.tsx**
    - p-1 → p-2

17. **src/app/updates/loading.tsx**
    - gap-3 → gap-4

### Additional fixes:
- Updated card.test.tsx to match the new spacing (space-y-1.5 → space-y-2)
- Added back getThemeColor and getStatusColor functions to lib/theme.ts to fix broken imports

### Spacing conversions applied:
- gap-1.5 (6px) → gap-2 (8px)
- gap-1 (4px) → gap-2 (8px)
- gap-3 (12px) → gap-4 (16px)
- space-y-1 → space-y-2
- space-x-3 → space-x-4
- p-1 → p-2

All changes align with the 8pt grid system (multiples of 8px/4px).