'use client'

import { logger } from '@/lib/logger'

import React, { useEffect, useRef } from 'react'
import { Niivue } from '@niivue/niivue'
import { cn } from '@/lib/utils'

interface NiivueBrainGridProps {
  className?: string
}

// High-quality brain scans
const BRAIN_SCANS = [
  { id: 'mni152', url: 'https://niivue.github.io/niivue-demo-images/mni152.nii.gz' },
  { id: 'chris_t1', url: 'https://niivue.github.io/niivue-demo-images/chris_t1.nii.gz' },
  { id: 'chris_t2', url: 'https://niivue.github.io/niivue-demo-images/chris_t2.nii.gz' },
  { id: 'spm152', url: 'https://niivue.github.io/niivue-demo-images/spm152.nii.gz' },
]

const SLICE_TYPES = ['axial', 'sagittal', 'coronal'] as const

interface QuadrantAnimation {
  position: number
  velocity: number
  sliceType: typeof SLICE_TYPES[number]
  scanIndex: number
  nv: Niivue | null
}

export function NiivueBrainGrid({ className }: NiivueBrainGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const animationRef = useRef<number>(0)
  
  // Animation state stored in ref to avoid React re-renders
  const quadrants = useRef<QuadrantAnimation[]>([
    { position: 0.3, velocity: 0.0008, sliceType: 'axial', scanIndex: 0, nv: null },
    { position: 0.7, velocity: -0.0006, sliceType: 'sagittal', scanIndex: 1, nv: null },
    { position: 0.5, velocity: 0.0007, sliceType: 'coronal', scanIndex: 2, nv: null },
    { position: 0.4, velocity: -0.0009, sliceType: 'axial', scanIndex: 3, nv: null },
  ])
  
  // Initialize NiiVue instances
  useEffect(() => {
    const initializeQuadrants = async () => {
      for (let i = 0; i < 4; i++) {
        const canvas = canvasRefs.current[i]
        if (!canvas) continue
        
        try {
          const nv = new Niivue({
            textHeight: 0,
            crosshairColor: [1, 1, 1, 0.1], // Very subtle crosshair
            crosshairWidth: 0.5,
            backColor: [0, 0, 0, 1],
            show3Dcrosshair: false,
            trustCalMinMax: true,
            dragMode: 0,
          })
          
          await nv.attachToCanvas(canvas)
          quadrants.current[i].nv = nv
          
          // Load initial scan
          const scan = BRAIN_SCANS[quadrants.current[i].scanIndex % BRAIN_SCANS.length]
          await nv.loadVolumes([{
            url: scan.url,
            colormap: 'gray',
            opacity: 1,
          }])
          
          // Set initial slice type
          const sliceType = quadrants.current[i].sliceType
          if (sliceType === 'axial') {
            nv.setSliceType(nv.sliceTypeAxial)
          } else if (sliceType === 'sagittal') {
            nv.setSliceType(nv.sliceTypeSagittal)
          } else {
            nv.setSliceType(nv.sliceTypeCoronal)
          }
          
          nv.drawScene()
        } catch (err) {
          logger.error(`Failed to initialize quadrant ${i}`, err, 'NiivueBrainGridV2')
        }
      }
      
      // Start animation after initialization
      startAnimation()
      
      // Start scan cycling
      startScanCycling()
    }
    
    initializeQuadrants()
    
    // Copy ref value before cleanup to avoid stale closure
    const currentQuadrants = quadrants.current
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      currentQuadrants.forEach(q => {
        if (q.nv) {
          q.nv.volumes = []
        }
      })
    }
  }, [])
  
  const startAnimation = () => {
    const animate = () => {
      quadrants.current.forEach((quad) => {
        if (!quad.nv) return
        
        // Update position with velocity
        quad.position += quad.velocity
        
        // Smooth bounce at boundaries with easing
        if (quad.position > 0.85) {
          quad.position = 0.85
          quad.velocity = -Math.abs(quad.velocity) * 0.95 // Slight damping
        } else if (quad.position < 0.15) {
          quad.position = 0.15
          quad.velocity = Math.abs(quad.velocity) * 0.95
        }
        
        // Add subtle sine wave for organic motion
        const sineOffset = Math.sin(Date.now() * 0.0001) * 0.002
        const actualPosition = quad.position + sineOffset
        
        // Update NiiVue crosshair position
        const pos = new Float32Array([0.5, 0.5, 0.5])
        
        if (quad.sliceType === 'axial') {
          pos[2] = actualPosition
        } else if (quad.sliceType === 'sagittal') {
          pos[0] = actualPosition
        } else {
          pos[1] = actualPosition
        }
        
        quad.nv.scene.crosshairPos = pos
        quad.nv.drawScene()
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }
  
  const startScanCycling = () => {
    // Use prime numbers for staggered, non-synchronous cycling
    const intervals = [7000, 11000, 13000, 17000]
    
    quadrants.current.forEach((quad, idx) => {
      setInterval(async () => {
        if (!quad.nv) return
        
        // Get next scan index (avoid current)
        let nextIndex = (quad.scanIndex + 1 + Math.floor(Math.random() * 2)) % BRAIN_SCANS.length
        while (nextIndex === quad.scanIndex) {
          nextIndex = (nextIndex + 1) % BRAIN_SCANS.length
        }
        
        // Randomize slice type
        const sliceTypes = ['axial', 'sagittal', 'coronal'] as const
        const newSliceType = sliceTypes[Math.floor(Math.random() * sliceTypes.length)]
        
        try {
          // Load new scan
          await quad.nv.loadVolumes([{
            url: BRAIN_SCANS[nextIndex].url,
            colormap: 'gray',
            opacity: 1,
          }])
          
          // Set new slice type
          if (newSliceType === 'axial') {
            quad.nv.setSliceType(quad.nv.sliceTypeAxial)
          } else if (newSliceType === 'sagittal') {
            quad.nv.setSliceType(quad.nv.sliceTypeSagittal)
          } else {
            quad.nv.setSliceType(quad.nv.sliceTypeCoronal)
          }
          
          // Update quadrant state
          quad.scanIndex = nextIndex
          quad.sliceType = newSliceType
          // Randomize velocity slightly
          quad.velocity = quad.velocity > 0 
            ? 0.0005 + Math.random() * 0.0005
            : -(0.0005 + Math.random() * 0.0005)
          
        } catch (err) {
          logger.error('Failed to cycle scan', err, 'NiivueBrainGridV2')
        }
      }, intervals[idx])
    })
  }
  
  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      {/* Pure black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle scan lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(255, 255, 255, 0.05) 1px,
            rgba(255, 255, 255, 0.05) 2px
          )`,
        }}
      />
      
      {/* 2x2 Grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[1400px] max-h-[900px]">
          {[0, 1, 2, 3].map((idx) => {
            const positions = [
              'top-0 left-0',
              'top-0 right-0',
              'bottom-0 left-0',
              'bottom-0 right-0'
            ]
            
            return (
              <div
                key={idx}
                className={`absolute ${positions[idx]} w-[calc(50%-20px)] h-[calc(50%-20px)]`}
              >
                <canvas
                  ref={el => { canvasRefs.current[idx] = el }}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}