'use client'

import { useEffect, useState } from 'react'
import { useAppTheme } from '@/contexts/app-context'
import { Button } from '@/components/ui/button'

export default function TestNeutralThemePage() {
  const { colorTheme, setColorTheme, theme, setTheme } = useAppTheme()
  const [computedStyles, setComputedStyles] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get computed styles after a small delay to ensure styles are applied
    const timer = setTimeout(() => {
      const root = document.documentElement
      const body = document.body
      const computed = getComputedStyle(root)
      const bodyComputed = getComputedStyle(body)
      
      setComputedStyles({
        primaryColor: computed.getPropertyValue('--color-primary').trim(),
        primaryForeground: computed.getPropertyValue('--color-primary-foreground').trim(),
        backgroundColor: bodyComputed.backgroundColor,
        color: bodyComputed.color,
        dataTheme: root.getAttribute('data-theme') || 'none',
        bodyClasses: body.className,
        htmlClasses: root.className,
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [theme, colorTheme])

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold">Neutral Theme Test</h1>
      
      <div className="grid gap-6">
        {/* Current State */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Current State</h2>
          <div className="grid gap-2">
            <p>Color Theme: <code className="bg-muted px-2 py-1 rounded">{colorTheme}</code></p>
            <p>Display Mode: <code className="bg-muted px-2 py-1 rounded">{theme}</code></p>
            <p>Data Theme: <code className="bg-muted px-2 py-1 rounded">{computedStyles.dataTheme}</code></p>
            <p>Body Classes: <code className="bg-muted px-2 py-1 rounded text-xs">{computedStyles.bodyClasses}</code></p>
          </div>
        </div>

        {/* Computed Styles */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Computed Styles</h2>
          <div className="grid gap-2">
            <p>Primary Color: <code className="bg-muted px-2 py-1 rounded">{computedStyles.primaryColor}</code></p>
            <p>Primary Foreground: <code className="bg-muted px-2 py-1 rounded">{computedStyles.primaryForeground}</code></p>
            <p>Background Color: <code className="bg-muted px-2 py-1 rounded">{computedStyles.backgroundColor}</code></p>
            <p>Text Color: <code className="bg-muted px-2 py-1 rounded">{computedStyles.color}</code></p>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Theme Controls</h2>
          
          <div>
            <h3 className="font-medium mb-2">Color Theme</h3>
            <div className="flex gap-2 flex-wrap">
              {['blue', 'red', 'orange', 'green', 'yellow', 'pink', 'purple', 'neutral'].map((t) => (
                <Button
                  key={t}
                  variant={colorTheme === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setColorTheme(t as any)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Display Mode</h3>
            <div className="flex gap-2">
              {['light', 'dark', 'system'].map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Test */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Visual Test</h2>
          <div className="grid gap-4">
            <div className="p-4 bg-primary text-primary-foreground rounded">
              <p className="font-medium">Primary Color Box</p>
              <p className="text-sm opacity-80">This should be pure black in light mode and pure white in dark mode when neutral theme is selected.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-primary rounded">
                <p className="font-medium">Border Test</p>
                <p className="text-sm text-muted-foreground">Primary colored border</p>
              </div>
              
              <div className="p-4 ring-2 ring-primary rounded">
                <p className="font-medium">Ring Test</p>
                <p className="text-sm text-muted-foreground">Primary colored ring</p>
              </div>
            </div>

            <Button className="w-full">
              Primary Button - Should match theme
            </Button>
          </div>
        </div>

        {/* Expected Values */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Expected Values for Neutral Theme</h2>
          <div className="grid gap-2 text-sm">
            <p><strong>Light Mode:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Primary: oklch(0% 0 0) - Pure Black</li>
              <li>Primary Foreground: oklch(100% 0 0) - Pure White</li>
            </ul>
            <p className="mt-2"><strong>Dark Mode:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Primary: oklch(100% 0 0) - Pure White</li>
              <li>Primary Foreground: oklch(0% 0 0) - Pure Black</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}