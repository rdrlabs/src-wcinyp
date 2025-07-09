'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DiagnosticButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true)
    }

    // Keyboard shortcut: Ctrl+Shift+D
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        window.location.href = '/diagnostics'
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!isVisible) return null

  return (
    <Link href="/diagnostics" className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className={cn(
          "rounded-full shadow-lg transition-all duration-300",
          "bg-primary hover:bg-primary/90",
          isHovered && "scale-110 shadow-xl"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stethoscope className={cn(
          "h-5 w-5 transition-transform duration-300",
          isHovered && "rotate-12"
        )} />
        <span className="sr-only">System Diagnostics</span>
      </Button>
    </Link>
  )
}