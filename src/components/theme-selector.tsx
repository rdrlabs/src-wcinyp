'use client'

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useAppTheme, type ColorTheme } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const themes = [
  { name: "Blue", value: "blue" as ColorTheme },
  { name: "Red", value: "red" as ColorTheme },
  { name: "Orange", value: "orange" as ColorTheme },
  { name: "Green", value: "green" as ColorTheme },
  { name: "Yellow", value: "yellow" as ColorTheme },
  { name: "Default", value: "default" as ColorTheme },
]

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'toggle'
}

export function ThemeSelector({ variant = 'dropdown' }: ThemeSelectorProps) {
  const { setTheme, theme, colorTheme, setColorTheme, mounted } = useAppTheme()

  if (!mounted) {
    return null
  }

  // Simple toggle variant - just switches between light and dark
  if (variant === 'toggle') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="relative h-10 w-10 px-0"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Dropdown variant - full theme and color selection
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 w-10 px-0">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Light/Dark Mode Selection */}
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 h-4 w-4" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color</DropdownMenuLabel>
        
        {/* Color Theme Selection */}
        <DropdownMenuRadioGroup value={colorTheme} onValueChange={(value) => setColorTheme(value as ColorTheme)}>
          {themes.map((t) => (
            <DropdownMenuRadioItem key={t.value} value={t.value}>
              <div className="flex items-center gap-2 w-full">
                <div 
                  className={cn(
                    "h-4 w-4 rounded-full border",
                    t.value === "default" && "border-2"
                  )}
                  data-theme={t.value}
                />
                {t.name}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}