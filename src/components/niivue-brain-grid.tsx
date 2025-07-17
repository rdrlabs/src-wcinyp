'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Niivue } from '@niivue/niivue'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface NiivueBrainGridProps {
  className?: string
  enableBlur?: boolean
}

// High-quality brain scans with good contrast
const BRAIN_SCANS = [
  { id: 'mni152', url: 'https://niivue.github.io/niivue-demo-images/mni152.nii.gz', name: 'MNI152' },
  { id: 'chris_t1', url: 'https://niivue.github.io/niivue-demo-images/chris_t1.nii.gz', name: 'CHRIS T1' },
  { id: 'chris_t2', url: 'https://niivue.github.io/niivue-demo-images/chris_t2.nii.gz', name: 'CHRIS T2' },
  { id: 'spm152', url: 'https://niivue.github.io/niivue-demo-images/spm152.nii.gz', name: 'SPM152' },
]

const COLORMAPS = ['gray', 'hot', 'cool', 'winter', 'copper'] // Variety of medical colormaps

// Fixed slice types for all 4 quadrants
const QUADRANT_SLICE_TYPES = ['axial', 'sagittal', 'coronal', 'sagittal'] as const

// Content zones - where the actual brain tissue is visible
const CONTENT_ZONES = {
  axial: { start: 0.25, end: 0.75 },
  sagittal: { start: 0.3, end: 0.7 },
  coronal: { start: 0.2, end: 0.8 },
} as const

// Zoom factors to normalize brain sizes across different scans
const SCAN_ZOOM_FACTORS: Record<string, number> = {
  'mni152': 1.0,
  'chris_t1': 1.05,
  'chris_t2': 1.05,
  'spm152': 0.98,
}

// Performance constants
const RENDER_FPS = 30
const RENDER_INTERVAL = 1000 / RENDER_FPS

// Animation constants
const TRANSITION_DURATION = 1000 // Faster transitions
const SCAN_DURATIONS = [8000, 12000, 15000, 10000] // Different durations per quadrant
const PRELOAD_TIME = 2000

// Pre-allocated arrays to reduce garbage collection
const SHARED_POSITION = new Float32Array([0.5, 0.5, 0.5])

interface AnimationState {
  position: number
  phase: number
  speed: number
  currentScanIndex: number
  nextScanIndex: number | null
  transitionStartTime: number | null
  lastScanChangeTime: number
  sliceType: typeof QUADRANT_SLICE_TYPES[number]
  nv: Niivue | null
  isPreloading: boolean
  needsRedraw: boolean
  contentStart: number
  contentEnd: number
  rangeOffset: number
  // New dynamic properties
  scanMode: 'smooth' | 'burst' | 'pause' | 'hunt'
  pauseUntil: number
  burstSpeed: number
  targetPosition: number | null
  intensity: number // For visual effects
  colormap: string
}

// Calculate position within content bounds
const calculateContentPosition = (
  sineValue: number,
  contentStart: number,
  contentEnd: number,
  rangeOffset: number = 0
): number => {
  const adjustedStart = Math.max(0.1, contentStart + rangeOffset)
  const adjustedEnd = Math.min(0.9, contentEnd + rangeOffset)
  const range = adjustedEnd - adjustedStart
  return adjustedStart + (sineValue * range)
}

// DICOM-style annotations component
interface DicomAnnotationsProps {
  quadrantIndex: number
  sliceType: string
  position: number
  scanName: string
}

const DicomAnnotations: React.FC<DicomAnnotationsProps> = ({ sliceType, position, scanName }) => {
  const positionPercent = Math.round(position * 100)
  
  // Different technical parameters based on slice type for realism
  const technicalParams = {
    axial: { tr: 2000, te: 30, thickness: 5.0, fov: 240 },
    sagittal: { tr: 2100, te: 35, thickness: 4.0, fov: 256 },
    coronal: { tr: 1900, te: 28, thickness: 4.5, fov: 230 },
  }
  
  const params = technicalParams[sliceType as keyof typeof technicalParams] || technicalParams.axial
  
  return (
    <>
      {/* Top-left info */}
      <div className="absolute top-2 left-2 text-gray-300/90 text-[10px] font-mono leading-tight select-none">
        <div>Study: Brain MRI</div>
        <div>{scanName}</div>
        <div>{sliceType.toUpperCase()}</div>
      </div>
      
      {/* Top-right info */}
      <div className="absolute top-2 right-2 text-gray-300/90 text-[10px] font-mono leading-tight text-right select-none">
        <div>Slice: {positionPercent}%</div>
        <div>FOV: {params.fov}mm</div>
        <div>Thickness: {params.thickness}mm</div>
      </div>
      
      {/* Bottom-left technical info */}
      <div className="absolute bottom-2 left-2 text-gray-300/70 text-[9px] font-mono leading-tight select-none">
        <div>TR: {params.tr} TE: {params.te}</div>
        <div>Matrix: 256x256</div>
      </div>
      
      {/* Ruler marks */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Top ruler */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-500/20" />
        {[...Array(10)].map((_, i) => (
          <div 
            key={`top-${i}`}
            className="absolute top-0 w-[1px] h-2 bg-gray-500/30"
            style={{ left: `${(i + 1) * 10}%` }}
          />
        ))}
        
        {/* Left ruler */}
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gray-500/20" />
        {[...Array(10)].map((_, i) => (
          <div 
            key={`left-${i}`}
            className="absolute left-0 h-[1px] w-2 bg-gray-500/30"
            style={{ top: `${(i + 1) * 10}%` }}
          />
        ))}
      </div>
    </>
  )
}

// Simplified unified crosshair grid
const UnifiedCrosshairGrid: React.FC = () => {
  // Static grid that spans entire viewport
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {/* Main crosshair - always centered */}
      <div className="absolute left-1/2 top-0 w-[2px] h-full bg-gray-400/50 -translate-x-1/2" />
      <div className="absolute top-1/2 left-0 h-[2px] w-full bg-gray-400/50 -translate-y-1/2" />
      
      {/* Grid markers every 25% */}
      {[25, 75].map(percent => (
        <React.Fragment key={percent}>
          <div 
            className="absolute top-0 w-[1px] h-full bg-gray-400/10"
            style={{ left: `${percent}%` }}
          />
          <div 
            className="absolute left-0 h-[1px] w-full bg-gray-400/10"
            style={{ top: `${percent}%` }}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export function NiivueBrainGrid({ className, enableBlur = true }: NiivueBrainGridProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([null, null, null, null])
  const animationState = useRef<AnimationState[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [scanNames, setScanNames] = useState<string[]>(['', '', '', ''])
  const [quadrantIntensities, setQuadrantIntensities] = useState<number[]>([1, 1, 1, 1])
  const animationFrameId = useRef<number | null>(null)
  
  // Initialize animation state with proper quadrant types
  useEffect(() => {
    // Ensure each quadrant starts with a different scan
    const shuffledIndices = [...Array(BRAIN_SCANS.length).keys()].sort(() => Math.random() - 0.5)
    const scanModes: Array<'smooth' | 'burst' | 'pause' | 'hunt'> = ['smooth', 'burst', 'pause', 'hunt']
    
    animationState.current = Array.from({ length: 4 }, (_, i) => {
      const sliceType = QUADRANT_SLICE_TYPES[i]
      const contentZone = CONTENT_ZONES[sliceType]
      const rangeOffsets = [-0.05, 0.05, -0.03, 0.03]
      
      return {
        position: 0.5 + (Math.random() - 0.5) * 0.3, // Random starting positions
        phase: (i * Math.PI) / 2,
        speed: 0.15 + (i * 0.03), // Faster base speeds
        currentScanIndex: shuffledIndices[i % shuffledIndices.length],
        nextScanIndex: null,
        transitionStartTime: null,
        lastScanChangeTime: Date.now() - (i * 3000), // More staggered starts
        sliceType,
        nv: null,
        isPreloading: false,
        needsRedraw: true,
        contentStart: contentZone.start,
        contentEnd: contentZone.end,
        rangeOffset: rangeOffsets[i],
        // New properties
        scanMode: scanModes[i % scanModes.length],
        pauseUntil: 0,
        burstSpeed: 0.02 + Math.random() * 0.02,
        targetPosition: null,
        intensity: 1,
        colormap: i === 0 ? 'gray' : COLORMAPS[i % COLORMAPS.length],
      }
    })
  }, [])
  
  // Initialize NiiVue instances
  useEffect(() => {
    const initializeQuadrants = async () => {
      try {
        const promises = canvasRefs.current.map(async (canvas, i) => {
          if (!canvas) return
          
          const nv = new Niivue({
            textHeight: 0,
            crosshairColor: [0.5, 0.5, 0.5, 0.8],
            crosshairWidth: 1,
            backColor: [0, 0, 0, 1],
            show3Dcrosshair: true,
            trustCalMinMax: true,
            isNearestInterpolation: false,
            dragMode: 0,
          })
          
          await nv.attachToCanvas(canvas)
          animationState.current[i].nv = nv
          
          const scan = BRAIN_SCANS[animationState.current[i].currentScanIndex]
          const zoomFactor = SCAN_ZOOM_FACTORS[scan.id] || 1.0
          
          await nv.loadVolumes([{
            url: scan.url,
            colormap: animationState.current[i].colormap,
            opacity: 1,
          }])
          
          nv.setScale(zoomFactor)
          
          const sliceType = animationState.current[i].sliceType
          if (sliceType === 'axial') {
            nv.setSliceType(nv.sliceTypeAxial)
          } else if (sliceType === 'sagittal') {
            nv.setSliceType(nv.sliceTypeSagittal)
          } else {
            nv.setSliceType(nv.sliceTypeCoronal)
          }
          
          // Apply transforms for variety
          if (i === 1) {
            canvas.style.transform = 'scaleX(-1)'
          } else if (i === 3) {
            canvas.style.transform = 'rotate(180deg)'
          }
          
          nv.drawScene()
        })
        
        await Promise.all(promises)
        setIsInitialized(true)
      } catch (err) {
        logger.error('Failed to initialize NiiVue', err, 'NiivueBrainGrid')
        setLoadError('Failed to initialize brain scans')
      }
    }
    
    initializeQuadrants()
    
    return () => {
      animationState.current.forEach(state => {
        if (state.nv?.volumes?.length) {
          state.nv.volumes = []
        }
      })
    }
  }, [])
  
  // Main animation loop
  useEffect(() => {
    if (!isInitialized) return
    
    let lastTime = performance.now()
    let renderAccumulator = 0
    
    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime
      renderAccumulator += deltaTime * 1000
      
      const newScanNames: string[] = []
      const newIntensities: number[] = []
      
      animationState.current.forEach((state, idx) => {
        if (!state.nv?.volumes?.length) return
        
        const now = Date.now()
        const time = now / 1000
        
        // Dynamic scanning based on mode
        let newPosition = state.position
        
        switch (state.scanMode) {
          case 'burst':
            // Rapid scanning with occasional direction changes
            newPosition += state.burstSpeed * (Math.random() > 0.98 ? -1 : 1)
            if (newPosition > 0.9 || newPosition < 0.1) {
              state.burstSpeed *= -1
              newPosition = Math.max(0.1, Math.min(0.9, newPosition))
            }
            break
            
          case 'pause':
            // Pause at interesting positions, then jump
            if (now > state.pauseUntil) {
              if (state.targetPosition === null) {
                // Set new target
                state.targetPosition = Math.random() * 0.6 + 0.2
                state.pauseUntil = now + 2000 + Math.random() * 2000
              } else {
                // Move to target
                const diff = state.targetPosition - newPosition
                newPosition += diff * 0.1
                if (Math.abs(diff) < 0.01) {
                  state.targetPosition = null
                }
              }
            }
            break
            
          case 'hunt':
            // Hunting behavior - quick movements, then slow scan
            const huntPhase = (time * 0.3) % 4
            if (huntPhase < 1) {
              // Quick scan
              newPosition += Math.sin(time * 8) * 0.02
            } else {
              // Slow detailed scan
              newPosition += Math.sin(time * state.speed) * 0.005
            }
            break
            
          default: // 'smooth'
            const sineValue = (Math.sin(time * state.speed + state.phase) + 1) / 2
            newPosition = calculateContentPosition(
              sineValue,
              state.contentStart,
              state.contentEnd,
              state.rangeOffset
            )
        }
        
        // Ensure bounds
        newPosition = Math.max(0.05, Math.min(0.95, newPosition))
        
        state.position = newPosition
        newScanNames[idx] = BRAIN_SCANS[state.currentScanIndex].name
        state.needsRedraw = true
        
        // Calculate intensity based on scan mode and activity
        let intensity = 0.7 // Base intensity
        
        if (state.scanMode === 'burst') {
          // Pulsing effect for burst mode
          intensity = 0.7 + Math.sin(time * 10) * 0.3
        } else if (state.scanMode === 'pause' && state.pauseUntil > now) {
          // Glow during pause
          intensity = 0.9 + Math.sin(time * 3) * 0.1
        } else if (state.transitionStartTime) {
          // Flash during transitions
          const transitionProgress = Math.min((now - state.transitionStartTime) / TRANSITION_DURATION, 1)
          intensity = 1 + Math.sin(transitionProgress * Math.PI) * 0.5
        }
        
        state.intensity = intensity
        newIntensities[idx] = intensity
        
        // Handle scan transitions
        const timeSinceLastChange = now - state.lastScanChangeTime
        const scanDuration = SCAN_DURATIONS[idx % SCAN_DURATIONS.length]
        
        if (!state.isPreloading && timeSinceLastChange > scanDuration - PRELOAD_TIME && !state.transitionStartTime) {
          const currentScans = animationState.current.map(s => s.currentScanIndex)
          
          // Create a weighted selection system - prefer scans that aren't currently displayed
          const scanWeights = BRAIN_SCANS.map((_, scanIndex) => {
            if (scanIndex === state.currentScanIndex) return 0 // Can't select current scan
            const currentCount = currentScans.filter(s => s === scanIndex).length
            return Math.max(0, 2 - currentCount) // Weight: 2 for unused, 1 for used once, 0 for used twice
          })
          
          // Select from weighted options
          const totalWeight = scanWeights.reduce((sum, w) => sum + w, 0)
          if (totalWeight > 0) {
            let random = Math.random() * totalWeight
            let selectedIndex = 0
            
            for (let i = 0; i < scanWeights.length; i++) {
              random -= scanWeights[i]
              if (random <= 0) {
                selectedIndex = i
                break
              }
            }
            
            state.nextScanIndex = selectedIndex
            state.isPreloading = true
            
            const nextScan = BRAIN_SCANS[state.nextScanIndex]
            const zoomFactor = SCAN_ZOOM_FACTORS[nextScan.id] || 1.0
            
            const currentVolume = state.nv.volumes[0]
            state.nv.loadVolumes([
              {
                url: currentVolume.url || '',
                colormap: state.colormap,
                opacity: 1,
              },
              {
                url: nextScan.url,
                colormap: state.colormap,
                opacity: 0,
              }
            ]).then(() => {
              state.nv!.setScale(zoomFactor)
            })
          }
        }
        
        if (!state.transitionStartTime && timeSinceLastChange > scanDuration) {
          state.transitionStartTime = now
          // Change scan mode occasionally
          if (Math.random() > 0.7) {
            const modes: Array<'smooth' | 'burst' | 'pause' | 'hunt'> = ['smooth', 'burst', 'pause', 'hunt']
            state.scanMode = modes[Math.floor(Math.random() * modes.length)]
          }
        }
        
        if (state.transitionStartTime && state.nextScanIndex !== null) {
          const transitionProgress = Math.min((now - state.transitionStartTime) / TRANSITION_DURATION, 1)
          
          if (state.nv.volumes.length > 1) {
            state.nv.volumes[0].opacity = 1 - transitionProgress
            state.nv.volumes[1].opacity = transitionProgress
            state.needsRedraw = true
          }
          
          if (transitionProgress >= 1) {
            if (state.nv.volumes.length > 1) {
              state.nv.volumes = [state.nv.volumes[1]]
              state.nv.volumes[0].opacity = 1
            }
            
            const newScan = BRAIN_SCANS[state.nextScanIndex]
            const zoomFactor = SCAN_ZOOM_FACTORS[newScan.id] || 1.0
            state.nv.setScale(zoomFactor)
            
            state.currentScanIndex = state.nextScanIndex
            state.nextScanIndex = null
            state.transitionStartTime = null
            state.lastScanChangeTime = now
            state.isPreloading = false
          }
        }
      })
      
      if (newScanNames.length === 4) {
        setScanNames(newScanNames)
        setQuadrantIntensities(newIntensities)
      }
      
      if (renderAccumulator >= RENDER_INTERVAL) {
        renderAccumulator = renderAccumulator % RENDER_INTERVAL
        
        animationState.current.forEach(state => {
          if (state.nv && state.needsRedraw) {
            SHARED_POSITION[0] = 0.5
            SHARED_POSITION[1] = 0.5
            SHARED_POSITION[2] = 0.5
            
            if (state.sliceType === 'axial') {
              SHARED_POSITION[2] = state.position
            } else if (state.sliceType === 'sagittal') {
              SHARED_POSITION[0] = state.position
            } else {
              SHARED_POSITION[1] = state.position
            }
            
            state.nv.scene.crosshairPos = SHARED_POSITION
            state.nv.drawScene()
            state.needsRedraw = false
          }
        })
      }
      
      animationFrameId.current = requestAnimationFrame(animate)
    }
    
    animationFrameId.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isInitialized])
  
  const setCanvasRef = (index: number) => (el: HTMLCanvasElement | null) => {
    canvasRefs.current[index] = el
  }
  
  return (
    <div className={cn("absolute inset-0 bg-black", className)}>
      {/* DICOM-style container */}
      <div className="absolute inset-0">
        {/* 2x2 Grid - moved before blur to be under it */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-[1600px] max-h-[1000px]">
            {/* Top Left - Axial */}
            <div 
              className="absolute top-0 left-0 w-[calc(50%-2px)] h-[calc(50%-2px)] border overflow-hidden transition-all duration-300"
              style={{
                borderColor: `rgba(156, 163, 175, ${0.3 * quadrantIntensities[0]})`,
                boxShadow: quadrantIntensities[0] > 1 ? `0 0 ${20 * (quadrantIntensities[0] - 1)}px rgba(156, 163, 175, 0.3)` : 'none'
              }}
            >
              <canvas
                ref={setCanvasRef(0)}
                className="w-full h-full"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  filter: `brightness(${quadrantIntensities[0]})`
                }}
              />
              <DicomAnnotations 
                quadrantIndex={0}
                sliceType={QUADRANT_SLICE_TYPES[0]}
                position={animationState.current[0]?.position || 0.5}
                scanName={scanNames[0]}
              />
            </div>
            
            {/* Top Right - Sagittal (Mirrored) */}
            <div 
              className="absolute top-0 right-0 w-[calc(50%-2px)] h-[calc(50%-2px)] border overflow-hidden transition-all duration-300"
              style={{
                borderColor: `rgba(156, 163, 175, ${0.3 * quadrantIntensities[1]})`,
                boxShadow: quadrantIntensities[1] > 1 ? `0 0 ${20 * (quadrantIntensities[1] - 1)}px rgba(156, 163, 175, 0.3)` : 'none'
              }}
            >
              <canvas
                ref={setCanvasRef(1)}
                className="w-full h-full"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  filter: `brightness(${quadrantIntensities[1]})`
                }}
              />
              <DicomAnnotations 
                quadrantIndex={1}
                sliceType={QUADRANT_SLICE_TYPES[1]}
                position={animationState.current[1]?.position || 0.5}
                scanName={scanNames[1]}
              />
            </div>
            
            {/* Bottom Left - Coronal */}
            <div 
              className="absolute bottom-0 left-0 w-[calc(50%-2px)] h-[calc(50%-2px)] border overflow-hidden transition-all duration-300"
              style={{
                borderColor: `rgba(156, 163, 175, ${0.3 * quadrantIntensities[2]})`,
                boxShadow: quadrantIntensities[2] > 1 ? `0 0 ${20 * (quadrantIntensities[2] - 1)}px rgba(156, 163, 175, 0.3)` : 'none'
              }}
            >
              <canvas
                ref={setCanvasRef(2)}
                className="w-full h-full"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  filter: `brightness(${quadrantIntensities[2]})`
                }}
              />
              <DicomAnnotations 
                quadrantIndex={2}
                sliceType={QUADRANT_SLICE_TYPES[2]}
                position={animationState.current[2]?.position || 0.5}
                scanName={scanNames[2]}
              />
            </div>
            
            {/* Bottom Right - Sagittal (Rotated) */}
            <div 
              className="absolute bottom-0 right-0 w-[calc(50%-2px)] h-[calc(50%-2px)] border overflow-hidden transition-all duration-300"
              style={{
                borderColor: `rgba(156, 163, 175, ${0.3 * quadrantIntensities[3]})`,
                boxShadow: quadrantIntensities[3] > 1 ? `0 0 ${20 * (quadrantIntensities[3] - 1)}px rgba(156, 163, 175, 0.3)` : 'none'
              }}
            >
              <canvas
                ref={setCanvasRef(3)}
                className="w-full h-full"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  filter: `brightness(${quadrantIntensities[3]})`
                }}
              />
              <DicomAnnotations 
                quadrantIndex={3}
                sliceType={QUADRANT_SLICE_TYPES[3]}
                position={animationState.current[3]?.position || 0.5}
                scanName={scanNames[3]}
              />
            </div>
          </div>
        </div>
        
        {/* Unified crosshair grid overlay - under blur effect */}
        <UnifiedCrosshairGrid />
      </div>
      
      {/* Blur overlay */}
      {enableBlur && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: 'blur(8px) saturate(0.7)',
            WebkitBackdropFilter: 'blur(8px) saturate(0.7)',
            background: 'rgba(0, 0, 0, 0.4)',
          }}
        />
      )}
      
      {/* Error display */}
      {loadError && (
        <div className="absolute top-4 left-4 text-gray-400/80 text-sm font-mono">
          {loadError}
        </div>
      )}
      
      {/* Loading state */}
      {!isInitialized && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-gray-400/80 text-sm font-mono animate-pulse">
            Initializing DICOM viewer...
          </div>
        </div>
      )}
    </div>
  )
}