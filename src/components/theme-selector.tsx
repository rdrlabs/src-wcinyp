'use client'

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useAppTheme, type ColorTheme } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"

// Mode switcher options
const modes = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
]

// Color themes in grid layout (2 rows of 3)
const colorThemes = [
  { name: "Blue", value: "blue" as ColorTheme, hex: "#3b82f6" },
  { name: "Red", value: "red" as ColorTheme, hex: "#ef4444" },
  { name: "Orange", value: "orange" as ColorTheme, hex: "#f97316" },
  { name: "Green", value: "green" as ColorTheme, hex: "#22c55e" },
  { name: "Pink", value: "pink" as ColorTheme, hex: "#ec4899" },
  { name: "Purple", value: "purple" as ColorTheme, hex: "#a855f7" },
]

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'toggle'
}

export function ThemeSelector({ variant = 'dropdown' }: ThemeSelectorProps) {
  const { setTheme, theme, colorTheme, setColorTheme, mounted } = useAppTheme()
  const [previousTheme, setPreviousTheme] = React.useState<string>('light')
  
  // Track if system theme is active
  const isSystemTheme = theme === 'system'
  
  // Update previous theme when manually selecting light/dark
  React.useEffect(() => {
    if (theme !== 'system' && mounted) {
      setPreviousTheme(theme)
    }
  }, [theme, mounted])
  
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

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className={cn(
                "relative h-9 w-9 overflow-hidden transition-opacity",
                isSystemTheme && "opacity-50"
              )}
              data-testid="theme-selector-trigger"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-[240px] p-3">
        <div className="space-y-3">
          {/* Animated Mode Switcher with System button */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex rounded-lg bg-muted p-1 flex-1">
            {modes.map((mode) => {
              const Icon = mode.icon
              const isSelected = theme === mode.id
              
              return (
                <motion.button
                  key={mode.id}
                  className={cn(
                    "relative flex items-center justify-center h-8 w-full rounded-md text-xs font-medium transition-colors",
                    isSelected 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setTheme(mode.id)}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  data-testid={`theme-mode-${mode.id}`}
                >
                  {/* Sliding background */}
                  {isSelected && mounted && (
                    <motion.div
                      layoutId="theme-mode-background"
                      className="absolute inset-0 bg-background shadow-md rounded-md ring-2 ring-gray-300 dark:ring-gray-600"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                      }}
                    />
                  )}
                  
                  {/* Icon only - no text */}
                  <Icon className="w-4 h-4 relative z-10" />
                </motion.button>
              )
            })}
            </div>
            
            {/* System button next to mode switcher */}
            <Button
              variant={isSystemTheme ? "default" : "outline"}
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => {
                if (isSystemTheme) {
                  setTheme(previousTheme)
                } else {
                  setTheme('system')
                }
              }}
              data-testid="theme-system-button"
            >
              <Monitor className="h-4 w-4" />
              <span className="sr-only">Apply system theme</span>
            </Button>
          </div>

          {/* Color Grid - 3 columns with smooth transitions */}
          <motion.div 
            className="grid grid-cols-3 gap-1.5 relative"
            layout
            initial={false}
            transition={{
              layout: {
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            }}
          >
            {colorThemes.map((color) => {
              const isSelected = colorTheme === color.value
              
              return (
                <motion.button
                  key={color.value}
                  className={cn(
                    "relative h-9 w-full rounded-md p-0 focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors",
                    isSelected 
                      ? "bg-primary/10" 
                      : "hover:bg-accent"
                  )}
                  onClick={() => setColorTheme(color.value)}
                  whileTap={{ scale: 0.95 }}
                  initial={false}
                  data-testid={`theme-color-${color.value}`}
                >
                  {/* Active selection background */}
                  {isSelected && mounted && (
                    <motion.div
                      layoutId="color-theme-background"
                      className="absolute inset-0 bg-primary/10 rounded-md"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                      }}
                    />
                  )}
                  
                  <div 
                    className={cn(
                      "relative rounded-full mx-auto transition-all",
                      isSelected 
                        ? "w-6 h-6 shadow-lg" 
                        : "w-5 h-5 shadow-sm"
                    )}
                    style={{ backgroundColor: color.hex }} 
                  />
                  <span className="sr-only">{color.name} theme</span>
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  </TooltipProvider>
  )
}