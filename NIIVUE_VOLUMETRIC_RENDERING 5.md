# NiiVue Volumetric Rendering Implementation Guide

## Executive Summary
We are working to achieve a volumetric "fill" effect for brain rendering in NiiVue, where the brain appears semi-transparent with internal structure visible (like looking through glass), rather than just a flat transparent surface. Currently, only 2 of 4 brain quadrants show this effect on the login page.

## Problem Statement
- **Current Issue**: The login page shows 4 rotating 3D brains, but not all display the desired volumetric transparency
- **User Feedback**: "only 2/4 brains are animating in a fill way", "the two brains on the left side rotate and stuff but they have no other animation"
- **Desired Effect**: A glass-like brain with depth, where you can see through to internal structures
- **Not Wanted**: Flat opacity, brains disappearing, pink/purple colors

## Current Implementation Analysis

### File: `/src/components/niivue-brain-3d-grid.tsx`
This is the main component rendering 4 brain quadrants with:
- Local brain file: `/public/brain-scans/mni152.nii.gz` (4.3MB)
- 4 different rotation patterns (Y-axis, X-axis, Z-axis, combined XY)
- Opacity settings per quadrant (0.85-0.93)
- Holographic cyan visual effects
- 30 FPS render cap

### Key Code Section (TODO: Resume Here)
```typescript
// TODO: VOLUMETRIC RENDERING - This is where opacity is set but doesn't create fill effect
if (i === 0) {
  nv.setOpacity(0, 0.88)  // Top-left
} else if (i === 1) {
  nv.setOpacity(0, 0.9)   // Top-right
} else if (i === 2) {
  nv.setOpacity(0, 0.85)  // Bottom-left
} else if (i === 3) {
  nv.setOpacity(0, 0.93)  // Bottom-right
}
```

## NiiVue API Understanding

### Core Methods Discovered

1. **`setOpacity(volumeIndex, value)`**
   - Sets transparency for a volume (0-1 range)
   - 0 = fully transparent (invisible)
   - 1 = fully opaque
   - **Issue**: Only creates uniform transparency, not volumetric depth

2. **`setSliceType(type)`**
   - `nv.sliceTypeRender` - 3D volume rendering mode (what we use)
   - `nv.sliceTypeAxial` - 2D axial slice
   - `nv.sliceTypeSagittal` - 2D sagittal slice
   - `nv.sliceTypeCoronal` - 2D coronal slice
   - `nv.sliceTypeMultiplanar` - Multiple 2D views

3. **`opts.meshXRay`**
   - Value 0-1, controls X-ray effect depth
   - Currently set to 0.5 in our implementation
   - **Potential**: May help create depth effect

4. **`setRenderAzimuthElevation(azimuth, elevation)`**
   - Controls 3D rotation angles
   - Working correctly for rotation animation

5. **`updateGLVolume()`**
   - Updates WebGL rendering after changes
   - Must be called after modifying volume properties

### Initialization Options
```typescript
const nv = new Niivue({
  textHeight: 0.05,
  crosshairColor: [0.2, 0.8, 1, 0.5],
  crosshairWidth: 1,
  backColor: [0, 0, 0, 1],
  show3Dcrosshair: true,
  trustCalMinMax: true,
  isNearestInterpolation: false,
  dragMode: 0,
  meshXRay: 0.5,              // TODO: Test different values
  isColorbar: false,
  multiplanarForceRender: false,
})
```

### Volume Loading
```typescript
await nv.loadVolumes([{
  url: BRAIN_URL,
  colormap: 'gray',           // TODO: Test other colormaps
  opacity: 1,                 // Initial opacity
}])
```

## What We've Tried

1. **Simple Opacity Settings** ✗
   - Set different opacity values (0.85-0.93)
   - Result: Uniform transparency, not volumetric

2. **Clip Planes** ✗
   - Attempted to use setClipPlane() for cut-through effects
   - User didn't want brains to disappear
   - Disabled with `clipPlaneEnabled: false`

3. **Different Colormaps** ⚠️
   - Started with 'gray'
   - Need to test: 'hot', 'cool', 'winter', 'copper', 'jet', 'plasma', 'viridis'

## Test Page Implementation

### File: `/src/app/test-niivue-volumetric/page.tsx`
Created a dedicated test page with interactive controls:
- **Access**: Via footer link "Test NiiVue Settings" (after login)
- **Controls**:
  - Opacity slider (0-1)
  - Mesh X-Ray slider (0-1)
  - Render mode selector
  - Colormap selector
  - Rotation controls (azimuth/elevation)
  - Copy settings button

### Test Page Key Features
```typescript
// Real-time opacity update
const updateOpacity = (value: number) => {
  setOpacity(value)
  if (nvRef.current && isLoaded) {
    nvRef.current.setOpacity(0, value)
    nvRef.current.drawScene()
  }
}

// Mesh X-Ray adjustment
const updateMeshXRay = (value: number) => {
  setMeshXRay(value)
  if (nvRef.current && isLoaded) {
    nvRef.current.opts.meshXRay = value
    nvRef.current.drawScene()
  }
}
```

## Common Pitfalls & Solutions

### 1. **Module Not Found Errors**
- **Issue**: Missing UI components (e.g., Slider)
- **Solution**: Install missing dependencies or use native HTML inputs
- **Example**: `npm install @radix-ui/react-slider`

### 2. **CORS/Fetch Errors**
- **Issue**: Cannot load brain scans from external URLs
- **Solution**: Download files locally to `/public/brain-scans/`
- **Fixed**: Changed from `https://niivue.github.io/...` to `/brain-scans/mni152.nii.gz`

### 3. **TypeScript Errors**
- **Issue**: Type mismatches with NiiVue methods
- **Solution**: Check actual API vs assumed API
- **Example**: setModulationImage() doesn't exist as expected

### 4. **Only Some Quadrants Working**
- **Issue**: Inconsistent rendering across quadrants
- **Current Status**: Top-left missing opacity setting initially
- **Partial Fix**: Added opacity to all quadrants, but effect still not volumetric

### 5. **Direct Page Access Blocked**
- **Issue**: Auth guards prevent direct navigation to test page
- **Solution**: Added link in footer component instead of login page

## Potential Solutions Not Yet Tried

### 1. **Maximum Intensity Projection (MIP)**
- NiiVue may have MIP mode for better depth visualization
- Look for: `setRenderMode()` or similar methods

### 2. **Shader Configuration**
- Custom shaders for volumetric rendering
- Look for: shader options in NiiVue initialization

### 3. **Transfer Functions**
- Gradient-based opacity for depth effect
- Map data values to opacity curves

### 4. **Ray Casting Parameters**
- Adjust ray casting for better volumetric appearance
- Look for: ray step size, sampling rate options

### 5. **Blend Modes**
- Different WebGL blending for transparency
- Additive vs traditional alpha blending

## TODO: Next Steps to Achieve Volumetric Effect

1. **TODO: Test Page Experiments**
   ```typescript
   // In test page, try these combinations:
   // 1. Opacity: 0.5-0.8 with meshXRay: 0.8-1.0
   // 2. Different colormaps (some have alpha channels)
   // 3. Rapid opacity changes during rotation
   ```

2. **TODO: Research NiiVue Advanced Options**
   - Search for "volume rendering", "MIP", "ray casting" in NiiVue docs
   - Check if there's a `setVolumeRendering()` method
   - Look for gradient-based opacity options

3. **TODO: Investigate Working Quadrants**
   - Why do some quadrants show the effect?
   - Compare initialization between working/non-working
   - Check if rotation angle affects rendering

4. **TODO: Alternative Approaches**
   - Try loading `.mz3` mesh files instead of `.nii.gz` volumes
   - Test surface rendering vs volume rendering
   - Implement custom WebGL shaders if needed

5. **TODO: Apply Working Settings**
   ```typescript
   // Once test page finds working settings:
   // 1. Copy the settings object
   // 2. Update niivue-brain-3d-grid.tsx initialization
   // 3. Apply to all 4 quadrants uniformly
   ```

## Code Locations for Quick Reference

- **Main Component**: `/src/components/niivue-brain-3d-grid.tsx`
- **Test Page**: `/src/app/test-niivue-volumetric/page.tsx`
- **Brain Data**: `/public/brain-scans/mni152.nii.gz`
- **Login Page**: `/src/app/login/page.tsx` (imports NiivueBrain3DGrid)
- **Footer Link**: `/src/components/footer.tsx` (line 152)

## Success Criteria
- All 4 brain quadrants show volumetric transparency
- Internal brain structures visible through semi-transparent surface
- Smooth rotation without flickering
- No clip planes or disappearing effects
- Consistent appearance across all quadrants

## Last Working State
- Test page created and accessible via footer
- All quadrants have opacity settings
- Rotation working correctly
- Holographic visual effects applied
- 30 FPS performance maintained

---

*Last Updated: [Current Session]  
Component Version: niivue-brain-3d-grid.tsx with opacity fix  
Test Page Status: Created and functional*