'use client'

import React from 'react'

interface NiivueBrain3DGridProps {
  className?: string
}

export function NiivueBrain3DGrid({ className }: NiivueBrain3DGridProps) {
  return (
    <div className={className}>
      {/* Placeholder for 3D brain visualization */}
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <p className="text-muted-foreground">3D Brain Visualization</p>
      </div>
    </div>
  )
}