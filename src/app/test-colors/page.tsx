'use client'

import { useEffect, useState } from 'react'

export default function TestColorsPage() {
  const [mounted, setMounted] = useState(false)
  const [cssValues, setCssValues] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
    
    // Force apply theme class
    const html = document.documentElement
    const currentTheme = localStorage.getItem('color-theme') || 'blue'
    
    // Remove any existing theme classes
    Array.from(html.classList).forEach(cls => {
      if (cls.startsWith('theme-')) {
        html.classList.remove(cls)
      }
    })
    
    // Add the theme class
    html.classList.add(`theme-${currentTheme}`)
    
    // Get computed styles
    const computed = getComputedStyle(html)
    const values = {
      '--color-primary': computed.getPropertyValue('--color-primary').trim(),
      '--color-background': computed.getPropertyValue('--color-background').trim(),
      'htmlClasses': html.className,
      'dataTheme': html.getAttribute('data-theme') || 'none',
    }
    
    setCssValues(values)
  }, [])

  const testColors = [
    { name: 'Blue', value: 'oklch(66.7% 0.203 241.7)', hex: '#3b82f6' },
    { name: 'Red', value: 'oklch(69.5% 0.203 25.5)', hex: '#ef4444' },
    { name: 'Green', value: 'oklch(60.8% 0.149 149.5)', hex: '#22c55e' },
  ]

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold">Color Test Page</h1>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Runtime Values</h2>
        <div className="border rounded-lg p-4 space-y-2">
          <p>Mounted: <strong>{mounted ? 'Yes' : 'No'}</strong></p>
          <p>HTML Classes: <code className="bg-muted px-2 py-1 rounded">{cssValues.htmlClasses || 'none'}</code></p>
          <p>Data-theme: <code className="bg-muted px-2 py-1 rounded">{cssValues.dataTheme}</code></p>
          <p>--color-primary: <code className="bg-muted px-2 py-1 rounded">{cssValues['--color-primary'] || 'undefined'}</code></p>
          <p>--color-background: <code className="bg-muted px-2 py-1 rounded">{cssValues['--color-background'] || 'undefined'}</code></p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Direct Color Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testColors.map(color => (
            <div key={color.name} className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">{color.name}</h3>
              <div 
                className="w-full h-20 rounded flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: color.value }}
              >
                {color.value}
              </div>
              <div 
                className="w-full h-20 rounded flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: color.hex }}
              >
                {color.hex}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tailwind Classes</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="w-32 h-32 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">bg-primary</span>
          </div>
          <div className="w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold">bg-blue-500</span>
          </div>
          <div className="w-32 h-32 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
            <span className="text-white font-semibold">CSS var</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Theme Switch Test</h2>
        <div className="flex gap-2">
          {['blue', 'red', 'orange', 'green', 'yellow', 'neutral'].map(theme => (
            <button
              key={theme}
              onClick={() => {
                localStorage.setItem('color-theme', theme)
                window.location.reload()
              }}
              className="px-4 py-2 border rounded hover:bg-muted"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}