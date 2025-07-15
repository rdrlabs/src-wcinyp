'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Niivue } from '@niivue/niivue'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'

interface NiivueBrain3DGridProps {
  className?: string
  enableBlur?: boolean
}

// Use local brain scan file to avoid CORS/fetch issues
const BRAIN_URL = '/brain-scans/mni152.nii.gz'

// Performance constants
const RENDER_FPS = 30
const RENDER_INTERVAL = 1000 / RENDER_FPS

// 3D View labels
const VIEW_LABELS = ['Axial Rotation', 'Sagittal Rotation', 'Coronal Rotation', 'Multi-Axis']

// Animated scan line component
const ScanLineEffect: React.FC<{ quadrantIndex: number }> = ({ quadrantIndex }) => {
  const [scanPosition, setScanPosition] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100)
    }, 50 + quadrantIndex * 10)
    
    return () => clearInterval(interval)
  }, [quadrantIndex])
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal scan line */}
      <div 
        className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 transition-all duration-500"
        style={{
          top: `${scanPosition}%`,
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
        }}
      />
      {/* Vertical scan line */}
      <div 
        className="absolute top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40 transition-all duration-700"
        style={{
          left: `${(scanPosition + 25) % 100}%`,
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)',
        }}
      />
    </div>
  )
}

// DICOM-style annotations component for 3D views
interface DicomAnnotations3DProps {
  viewLabel: string
  azimuth: number
  elevation: number
  quadrantIndex: number
}

const DicomAnnotations3D: React.FC<DicomAnnotations3DProps> = ({ 
  viewLabel, 
  azimuth, 
  elevation, 
  quadrantIndex 
}) => {
  return (
    <>
      {/* Top-left info */}
      <div className="absolute top-2 left-2 text-cyan-300/90 text-[10px] font-mono leading-tight select-none">
        <div>3D Brain MRI</div>
        <div>MNI152 Template</div>
        <div className="text-cyan-400/60">{viewLabel}</div>
      </div>
      
      {/* Top-right rotation info */}
      <div className="absolute top-2 right-2 text-cyan-300/90 text-[10px] font-mono leading-tight text-right select-none">
        <div>Az: {azimuth}°</div>
        <div>El: {elevation}°</div>
        <div className="text-cyan-400/50">Volume Render</div>
      </div>
      
      {/* Bottom-left technical info */}
      <div className="absolute bottom-2 left-2 text-cyan-300/70 text-[9px] font-mono leading-tight select-none">
        <div>1mm Isotropic</div>
        <div>Q{quadrantIndex + 1}</div>
      </div>
      
      {/* Corner markers for medical look */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-cyan-500/40" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-cyan-500/40" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-cyan-500/40" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-cyan-500/40" />
    </>
  )
}

interface QuadrantState {
  nv: Niivue | null
  rotation: { x: number; y: number; z: number }
  rotationSpeed: { x: number; y: number; z: number }
  clipPlanePosition: number
  clipPlaneSpeed: number
  clipPlaneEnabled: boolean
}

export function NiivueBrain3DGrid({ className, enableBlur = true }: NiivueBrain3DGridProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([null, null, null, null])
  const quadrants = useRef<QuadrantState[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [rotationAngles, setRotationAngles] = useState<{ azimuth: number; elevation: number }[]>([
    { azimuth: 0, elevation: 0 },
    { azimuth: 0, elevation: 0 },
    { azimuth: 0, elevation: 15 },
    { azimuth: 0, elevation: 0 }
  ])
  const animationFrameId = useRef<number | null>(null)
  
  // Initialize quadrant states with different rotation patterns
  useEffect(() => {
    quadrants.current = [
      // Top-left: Y-axis rotation (left-right)
      {
        nv: null,
        rotation: { x: 0, y: 0, z: 0 },
        rotationSpeed: { x: 0, y: 0.005, z: 0 },
        clipPlanePosition: 0,
        clipPlaneSpeed: 0,
        clipPlaneEnabled: false
      },
      // Top-right: X-axis rotation (up-down)
      {
        nv: null,
        rotation: { x: 0, y: 0, z: 0 },
        rotationSpeed: { x: 0.004, y: 0, z: 0 },
        clipPlanePosition: 0,
        clipPlaneSpeed: 0,
        clipPlaneEnabled: false
      },
      // Bottom-left: Z-axis rotation (front-back)
      {
        nv: null,
        rotation: { x: 0, y: 0, z: 0 },
        rotationSpeed: { x: 0, y: 0, z: 0.006 },
        clipPlanePosition: 0,
        clipPlaneSpeed: 0,
        clipPlaneEnabled: false
      },
      // Bottom-right: Combined XY rotation (tumble)
      {
        nv: null,
        rotation: { x: 0, y: 0, z: 0 },
        rotationSpeed: { x: 0.003, y: 0.004, z: 0 },
        clipPlanePosition: 0,
        clipPlaneSpeed: 0,
        clipPlaneEnabled: false
      }
    ]
  }, [])
  
  // Initialize NiiVue instances
  useEffect(() => {
    let isMounted = true
    
    const initializeQuadrants = async () => {
      try {
        logger.debug('Starting NiiVue 3D initialization', undefined, 'NiivueBrain3D')
        
        if (!isMounted) return
        
        const promises = canvasRefs.current.map(async (canvas, i) => {
          if (!canvas) {
            logger.warn(`Canvas ${i} is null`, undefined, 'NiivueBrain3D')
            return
          }
          
          const nv = new Niivue({
            textHeight: 0,
            crosshairColor: [0.2, 0.8, 1, 0.5], // Cyan holographic crosshair
            crosshairWidth: 1,
            backColor: [0, 0, 0, 1],
            show3Dcrosshair: true,
            trustCalMinMax: true,
            isNearestInterpolation: false,
            dragMode: 0,
            meshXRay: 0.5, // X-ray effect for depth
            isColorbar: false,
            multiplanarForceRender: false,
          })
          
          await nv.attachToCanvas(canvas)
          quadrants.current[i].nv = nv
          
          // Load the brain volume from local file
          await nv.loadVolumes([{
            url: BRAIN_URL,
            colormap: 'gray',
            opacity: 1,
          }])
          
          // Set to 3D rendering mode
          nv.setSliceType(nv.sliceTypeRender)
          
          // Set initial render settings for medical aesthetic
          nv.setRenderAzimuthElevation(0, 0)
          nv.opts.meshThicknessOn2D = 0
          nv.setClipPlane([0, 0, 0, 0])
          
          // Configure 3D rendering quality
          nv.opts.isRadiologicalConvention = true
          nv.setInterpolation(true) // Smooth interpolation
          
          // Adjust 3D rendering properties for better visualization
          if (i === 0) {
            // Top-left: Semi-transparent for volumetric effect
            nv.setOpacity(0, 0.88)
          } else if (i === 1) {
            // Top-right: Slightly different opacity
            nv.setOpacity(0, 0.9)
          } else if (i === 2) {
            // Bottom-left: More transparent for deeper view
            nv.setOpacity(0, 0.85)
          } else if (i === 3) {
            // Bottom-right: Less transparent
            nv.setOpacity(0, 0.93)
          }
          
          // Initial render
          nv.drawScene()
        })
        
        await Promise.all(promises)
        setIsInitialized(true)
      } catch (err) {
        logger.error('Failed to initialize 3D brains', err, 'NiivueBrain3D')
        setLoadError('Failed to initialize 3D visualization')
      }
    }
    
    initializeQuadrants()
    
    return () => {
      isMounted = false
      quadrants.current.forEach(state => {
        if (state.nv?.volumes?.length) {
          state.nv.volumes = []
        }
      })
    }
  }, [])
  
  // Animation loop
  useEffect(() => {
    if (!isInitialized) return
    
    let lastTime = performance.now()
    let renderAccumulator = 0
    
    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime
      renderAccumulator += deltaTime * 1000
      
      // Update rotations and clip planes
      quadrants.current.forEach((state, _idx) => {
        if (!state.nv) return
        
        // Update rotation values
        state.rotation.x += state.rotationSpeed.x
        state.rotation.y += state.rotationSpeed.y
        state.rotation.z += state.rotationSpeed.z
        
        // Keep rotations in bounds
        state.rotation.x = state.rotation.x % (Math.PI * 2)
        state.rotation.y = state.rotation.y % (Math.PI * 2)
        state.rotation.z = state.rotation.z % (Math.PI * 2)
        
        // Clip planes disabled to keep brains fully visible
      })
      
      // Render at controlled framerate
      if (renderAccumulator >= RENDER_INTERVAL) {
        renderAccumulator = renderAccumulator % RENDER_INTERVAL
        
        const newAngles: { azimuth: number; elevation: number }[] = []
        
        quadrants.current.forEach((state, _idx) => {
          if (state.nv) {
            // Convert rotation to azimuth/elevation for NiiVue
            let azimuth = 0
            let elevation = 0
            
            if (_idx === 0) {
              // Top-left: Pure Y-axis rotation
              azimuth = state.rotation.y * 180 / Math.PI
              elevation = 0
            } else if (_idx === 1) {
              // Top-right: Pure X-axis rotation (tilt)
              azimuth = 0
              elevation = state.rotation.x * 180 / Math.PI
            } else if (_idx === 2) {
              // Bottom-left: Z-axis effect through azimuth
              azimuth = state.rotation.z * 180 / Math.PI
              elevation = 15 // Slight tilt for better view
            } else if (_idx === 3) {
              // Bottom-right: Combined rotation
              azimuth = state.rotation.y * 180 / Math.PI
              elevation = state.rotation.x * 180 / Math.PI
            }
            
            newAngles.push({ azimuth: Math.round(azimuth), elevation: Math.round(elevation) })
            state.nv.setRenderAzimuthElevation(azimuth, elevation)
            
            // No clip planes - keep brains fully visible
            
            state.nv.drawScene()
          }
        })
        
        setRotationAngles(newAngles)
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
      {/* 2x2 Grid Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-[1600px] max-h-[1000px]">
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-[calc(50%-2px)] h-[calc(50%-2px)] border border-cyan-900/50 overflow-hidden group">
            <canvas
              ref={setCanvasRef(0)}
              className="w-full h-full"
              style={{ 
                width: '100%', 
                height: '100%',
                filter: 'contrast(1.1) brightness(1.05)',
              }}
            />
            {/* Holographic glow effect */}
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 mix-blend-screen" />
            </div>
            {/* Scan line effect */}
            <ScanLineEffect quadrantIndex={0} />
            <DicomAnnotations3D
              viewLabel={VIEW_LABELS[0]}
              azimuth={rotationAngles[0]?.azimuth || 0}
              elevation={rotationAngles[0]?.elevation || 0}
              quadrantIndex={0}
            />
          </div>
          
          {/* Top Right */}
          <div className="absolute top-0 right-0 w-[calc(50%-2px)] h-[calc(50%-2px)] border border-cyan-900/50 overflow-hidden group">
            <canvas
              ref={setCanvasRef(1)}
              className="w-full h-full"
              style={{ 
                width: '100%', 
                height: '100%',
                filter: 'contrast(1.1) brightness(1.05)',
              }}
            />
            {/* Holographic glow effect */}
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <div className="absolute inset-0 bg-gradient-to-l from-cyan-500/10 to-blue-500/10 mix-blend-screen" />
            </div>
            {/* Scan line effect */}
            <ScanLineEffect quadrantIndex={1} />
            <DicomAnnotations3D
              viewLabel={VIEW_LABELS[1]}
              azimuth={rotationAngles[1]?.azimuth || 0}
              elevation={rotationAngles[1]?.elevation || 0}
              quadrantIndex={1}
            />
          </div>
          
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 w-[calc(50%-2px)] h-[calc(50%-2px)] border border-cyan-900/50 overflow-hidden group">
            <canvas
              ref={setCanvasRef(2)}
              className="w-full h-full"
              style={{ 
                width: '100%', 
                height: '100%',
                filter: 'contrast(1.15) brightness(1.1)',
              }}
            />
            {/* Holographic glow effect */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 mix-blend-screen" />
            </div>
            {/* Scan line effect */}
            <ScanLineEffect quadrantIndex={2} />
            <DicomAnnotations3D
              viewLabel={VIEW_LABELS[2]}
              azimuth={rotationAngles[2]?.azimuth || 0}
              elevation={rotationAngles[2]?.elevation || 0}
              quadrantIndex={2}
            />
          </div>
          
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-[calc(50%-2px)] h-[calc(50%-2px)] border border-cyan-900/50 overflow-hidden group">
            <canvas
              ref={setCanvasRef(3)}
              className="w-full h-full"
              style={{ 
                width: '100%', 
                height: '100%',
                filter: 'contrast(1.1) brightness(1.05)',
              }}
            />
            {/* Holographic glow effect */}
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/10 to-blue-500/10 mix-blend-screen" />
            </div>
            {/* Scan line effect */}
            <ScanLineEffect quadrantIndex={3} />
            <DicomAnnotations3D
              viewLabel={VIEW_LABELS[3]}
              azimuth={rotationAngles[3]?.azimuth || 0}
              elevation={rotationAngles[3]?.elevation || 0}
              quadrantIndex={3}
            />
          </div>
        </div>
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400/80 text-sm font-mono text-center">
          <div>{loadError}</div>
          <div className="text-xs mt-2">Trying alternative visualization...</div>
        </div>
      )}
      
      {/* Loading state */}
      {!isInitialized && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-gray-400/80 text-sm font-mono animate-pulse">
            Initializing 3D visualization...
          </div>
        </div>
      )}
    </div>
  )
}