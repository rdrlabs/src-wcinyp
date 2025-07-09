'use client'

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useAppTheme, type ColorTheme } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const themes = [
  { name: "None", value: "neutral" as ColorTheme, color: "bg-gray-500 dark:bg-gray-400" },
  { name: "Blue", value: "blue" as ColorTheme, color: "bg-blue-500" },
  { name: "Red", value: "red" as ColorTheme, color: "bg-red-500" },
  { name: "Orange", value: "orange" as ColorTheme, color: "bg-orange-500" },
  { name: "Green", value: "green" as ColorTheme, color: "bg-green-500" },
  { name: "Yellow", value: "yellow" as ColorTheme, color: "bg-yellow-500" },
  { name: "Pink", value: "pink" as ColorTheme, color: "bg-pink-500" },
  { name: "Purple", value: "purple" as ColorTheme, color: "bg-purple-500" },
]

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'toggle'
}

export function ThemeSelector({ variant = 'dropdown' }: ThemeSelectorProps) {
  const { setTheme, theme, colorTheme, setColorTheme, mounted } = useAppTheme()
  
  // All hooks must be called before any conditional returns
  const [isOpen, setIsOpen] = React.useState(false)
  const [openTimeout, setOpenTimeout] = React.useState<NodeJS.Timeout | null>(null)
  const [closeTimeout, setCloseTimeout] = React.useState<NodeJS.Timeout | null>(null)

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

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
    const timeout = setTimeout(() => {
      setIsOpen(true)
    }, 200)
    setOpenTimeout(timeout)
  }

  const handleMouseLeave = () => {
    if (openTimeout) {
      clearTimeout(openTimeout)
      setOpenTimeout(null)
    }
    const timeout = setTimeout(() => {
      setIsOpen(false)
    }, 100)
    setCloseTimeout(timeout)
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button variant="outline" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-1 w-[200px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="px-2 py-1.5 text-sm font-semibold">Appearance</div>
          <div className="h-px bg-border my-1" />
          
          {/* Light/Dark Mode Selection */}
          <div className="py-1">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                theme === 'light' && "bg-primary/10 text-primary"
              )}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                theme === 'dark' && "bg-primary/10 text-primary"
              )}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                theme === 'system' && "bg-primary/10 text-primary"
              )}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </button>
          </div>

          <div className="h-px bg-border my-1" />
          <div className="px-2 py-1.5 text-sm font-semibold">Color</div>
          
          {/* Color Theme Selection */}
          <div className="py-1">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setColorTheme(t.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                  colorTheme === t.value && (
                    t.value === "neutral" 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-primary/10 text-primary"
                  )
                )}
              >
                <div 
                  className={cn(
                    "h-4 w-4 rounded-full border border-border",
                    t.color,
                    colorTheme === t.value && "border-primary"
                  )}
                />
                <span className={cn(t.value === "neutral" && "italic")}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}