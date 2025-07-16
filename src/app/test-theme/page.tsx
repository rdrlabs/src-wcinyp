'use client'

import { useAppTheme } from '@/contexts/app-context'
import { Button } from '@/components/ui/button'

export default function TestThemePage() {
  const { colorTheme, setColorTheme, mounted } = useAppTheme()
  
  const themes: Array<{ value: 'blue' | 'red' | 'orange' | 'green' | 'pink' | 'purple', label: string }> = [
    { value: 'blue', label: 'Blue' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'green', label: 'Green' },
    { value: 'pink', label: 'Pink' },
    { value: 'purple', label: 'Purple' },
  ]
  
  if (!mounted) {
    return <div className="container mx-auto p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold">Theme Test Page</h1>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Current Theme: {colorTheme}</h2>
        
        <div className="flex gap-2 flex-wrap">
          {themes.map(theme => (
            <Button
              key={theme.value}
              onClick={() => setColorTheme(theme.value)}
              variant={colorTheme === theme.value ? 'default' : 'outline'}
            >
              {theme.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Primary Color Elements</h3>
          
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          
          <div className="p-4 bg-primary text-primary-foreground rounded">
            Primary background with foreground text
          </div>
          
          <div className="p-4 border-2 border-primary rounded">
            Primary border
          </div>
          
          <p className="text-primary">Primary colored text</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">CSS Variable Values</h3>
          
          <div className="space-y-2 text-sm font-mono">
            <div>
              --color-primary: 
              <span 
                className="inline-block w-6 h-6 rounded ml-2 align-middle border"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            </div>
            <div>
              --color-background: 
              <span 
                className="inline-block w-6 h-6 rounded ml-2 align-middle border"
                style={{ backgroundColor: 'var(--color-background)' }}
              />
            </div>
            <div>
              --color-foreground: 
              <span 
                className="inline-block w-6 h-6 rounded ml-2 align-middle border"
                style={{ backgroundColor: 'var(--color-foreground)' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-muted rounded">
        <p className="text-sm">
          Theme persistence: The selected theme is saved to localStorage and will persist across page reloads.
        </p>
      </div>
    </div>
  )
}