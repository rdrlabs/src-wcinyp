'use client'

import { useDemo } from '@/contexts/demo-context'
import { Button } from '@/components/ui/button'
import { X, Info } from 'lucide-react'

export function DemoModeBanner() {
  const { isDemoMode, exitDemoMode } = useDemo()

  if (!isDemoMode) return null

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <span className="font-medium text-yellow-900 dark:text-yellow-100">
              Demo Mode Active
            </span>
            <span className="text-yellow-700 dark:text-yellow-300">
              You&apos;re viewing sample data. No changes will be saved.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={exitDemoMode}
            className="h-7 px-2 text-yellow-700 hover:text-yellow-900 hover:bg-yellow-500/20 dark:text-yellow-300 dark:hover:text-yellow-100"
          >
            <X className="h-3 w-3 mr-1" />
            Exit Demo
          </Button>
        </div>
      </div>
    </div>
  )
}