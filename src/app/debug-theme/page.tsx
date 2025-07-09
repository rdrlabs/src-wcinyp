'use client'

import { useEffect, useState } from 'react'
import { useAppTheme } from '@/contexts/app-context'

export default function DebugThemePage() {
  const { colorTheme, mounted } = useAppTheme()
  const [computedColors, setComputedColors] = useState<Record<string, string>>({})
  const [htmlClasses, setHtmlClasses] = useState('')
  const [localStorage, setLocalStorage] = useState<Record<string, string | null>>({})
  const [hydrationLog, setHydrationLog] = useState<string[]>([])

  useEffect(() => {
    const root = document.documentElement
    const styles = getComputedStyle(root)
    
    const colors = {
      '--color-primary': styles.getPropertyValue('--color-primary'),
      '--color-primary-foreground': styles.getPropertyValue('--color-primary-foreground'),
      '--color-background': styles.getPropertyValue('--color-background'),
      '--color-foreground': styles.getPropertyValue('--color-foreground'),
      '--color-border': styles.getPropertyValue('--color-border'),
    }
    
    setComputedColors(colors)
    setHtmlClasses(root.className)
    
    // Check localStorage
    setLocalStorage({
      'color-theme': window.localStorage.getItem('color-theme'),
      'theme': window.localStorage.getItem('theme'),
    })
    
    // Log hydration info
    setHydrationLog(prev => [...prev, `Updated at ${new Date().toLocaleTimeString()}: colorTheme=${colorTheme}, classes=${root.className}`])
  }, [colorTheme])
  
  // Monitor class changes
  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setHydrationLog(prev => [...prev, `Class changed from "${mutation.oldValue}" to "${(mutation.target as HTMLElement).className}"`])
          setHtmlClasses((mutation.target as HTMLElement).className)
        }
      })
    })
    
    observer.observe(root, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-4xl font-bold">Theme Debug</h1>
      
      <div className="space-y-2">
        <p>Current color theme (from context): <strong>{colorTheme}</strong></p>
        <p>Mounted state: <strong>{mounted ? 'true' : 'false'}</strong></p>
        <p>HTML element classes: <code className="bg-muted px-2 py-1 rounded">{htmlClasses || 'none'}</code></p>
      </div>
      
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="text-2xl font-semibold mb-4">LocalStorage Values</h2>
        {Object.entries(localStorage).map(([key, value]) => (
          <div key={key}>
            <code className="font-mono text-sm">{key}:</code> <strong>{value || 'null'}</strong>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="text-2xl font-semibold mb-4">Computed CSS Variables</h2>
        {Object.entries(computedColors).map(([key, value]) => (
          <div key={key} className="flex gap-4 items-center">
            <code className="font-mono text-sm bg-muted px-2 py-1 rounded min-w-[300px]">{key}</code>
            <span className="text-sm">{value || 'undefined'}</span>
            {value && (
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: value }}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="text-2xl font-semibold mb-4">Hydration Log</h2>
        <div className="max-h-40 overflow-y-auto">
          {hydrationLog.map((log, i) => (
            <div key={i} className="text-sm font-mono">{log}</div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Color Tests</h2>
        
        <div className="flex gap-4 items-center">
          <div className="w-32 h-32 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">bg-primary</span>
          </div>
          <div className="w-32 h-32 border-4 border-primary rounded-lg flex items-center justify-center">
            <span className="text-primary font-semibold">border-primary</span>
          </div>
          <div className="w-32 h-32 bg-background border rounded-lg flex items-center justify-center">
            <span className="text-foreground">bg-background</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-primary">This text should be in primary color</p>
          <p style={{ color: 'var(--color-primary)' }}>This text uses CSS variable directly</p>
          <p style={{ color: 'oklch(66.7% 0.203 241.7)' }}>This text uses oklch directly (blue)</p>
        </div>
      </div>
    </div>
  )
}