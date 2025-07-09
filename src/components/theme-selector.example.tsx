/**
 * Example usage of ThemeSelector component variants
 */

import { ThemeSelector } from './theme-selector'

export function ThemeSelectorExamples() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Dropdown Variant (Default)</h3>
        <p className="text-muted-foreground mb-4">
          Full theme selector with light/dark/system modes and color themes
        </p>
        <ThemeSelector />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Toggle Variant</h3>
        <p className="text-muted-foreground mb-4">
          Simple toggle between light and dark modes only
        </p>
        <ThemeSelector variant="toggle" />
      </div>
    </div>
  )
}