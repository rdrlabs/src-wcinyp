'use client'

import { useEffect, useState } from 'react'

export default function SimpleTestPage() {
  const [info, setInfo] = useState<any>({})

  useEffect(() => {
    // Set theme class manually
    const html = document.documentElement
    html.classList.add('theme-blue')
    
    const computedStyle = getComputedStyle(html)
    
    setInfo({
      htmlClasses: html.className,
      dataTheme: html.getAttribute('data-theme'),
      primaryColor: computedStyle.getPropertyValue('--color-primary'),
      backgroundColor: computedStyle.getPropertyValue('--color-background'),
      bodyBgColor: getComputedStyle(document.body).backgroundColor,
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Simple Color Test</h1>
      
      <div className="mb-8 space-y-2">
        <p>HTML Classes: <code>{info.htmlClasses || 'none'}</code></p>
        <p>Data Theme: <code>{info.dataTheme || 'none'}</code></p>
        <p>--color-primary: <code>{info.primaryColor || 'undefined'}</code></p>
        <p>--color-background: <code>{info.backgroundColor || 'undefined'}</code></p>
        <p>Body background: <code>{info.bodyBgColor || 'undefined'}</code></p>
      </div>

      <div className="space-y-4">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Primary Button
        </button>
        
        <div className="w-64 h-32 bg-primary rounded flex items-center justify-center">
          <span className="text-primary-foreground font-bold">bg-primary</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-primary">This should be primary color</p>
          <p className="text-foreground">This should be foreground color</p>
          <p className="text-muted-foreground">This should be muted foreground</p>
        </div>
      </div>
    </div>
  )
}