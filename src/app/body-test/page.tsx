'use client'

import { useEffect, useState } from 'react'

export default function BodyTestPage() {
  const [info, setInfo] = useState<any>({})

  useEffect(() => {
    const updateInfo = () => {
      const html = document.documentElement
      const body = document.body
      const computedStyle = getComputedStyle(body)
      
      setInfo({
        htmlClasses: html.className,
        bodyClasses: body.className,
        dataTheme: html.getAttribute('data-theme'),
        primaryColor: computedStyle.getPropertyValue('--color-primary'),
        backgroundColor: computedStyle.getPropertyValue('--color-background'),
        bodyBgColor: computedStyle.backgroundColor,
      })
    }

    updateInfo()
    
    // Also update after a short delay to catch any async changes
    setTimeout(updateInfo, 100)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Body Class Test</h1>
      
      <div className="mb-8 space-y-2 font-mono text-sm">
        <p>HTML Classes: <code className="bg-muted px-2 py-1 rounded">{info.htmlClasses || 'none'}</code></p>
        <p>Body Classes: <code className="bg-muted px-2 py-1 rounded">{info.bodyClasses || 'none'}</code></p>
        <p>Data Theme: <code className="bg-muted px-2 py-1 rounded">{info.dataTheme || 'none'}</code></p>
        <p>--color-primary: <code className="bg-muted px-2 py-1 rounded">{info.primaryColor || 'undefined'}</code></p>
        <p>--color-background: <code className="bg-muted px-2 py-1 rounded">{info.backgroundColor || 'undefined'}</code></p>
        <p>Body background: <code className="bg-muted px-2 py-1 rounded">{info.bodyBgColor || 'undefined'}</code></p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
            Primary Button
          </button>
          
          <button 
            onClick={() => {
              // Force apply theme class
              document.body.classList.add('theme-red')
              setTimeout(() => window.location.reload(), 100)
            }}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/80"
          >
            Force Red Theme
          </button>
        </div>
        
        <div className="w-full max-w-md">
          <div className="h-32 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">bg-primary</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-primary font-semibold">This text should be primary color</p>
          <p className="text-foreground">This is foreground color</p>
          <p className="text-muted-foreground">This is muted foreground</p>
        </div>
      </div>
    </div>
  )
}