# Theme Debug Instructions

## Issue Description
The color theme system may not be applying CSS variables correctly, causing the primary color and other theme colors to not display properly.

## Debug Steps

### 1. Visit the Debug Page
Navigate to http://localhost:3001/debug-theme (or appropriate port)

### 2. Check the Following on the Debug Page:

#### LocalStorage Values
- `color-theme`: Should show the current theme (e.g., "blue", "red", etc.)
- `theme`: Should show the light/dark mode setting

#### HTML Element Classes
- Should include the theme class (e.g., `theme-blue`, `theme-red`)
- Should include `dark` class if in dark mode
- Watch for duplicate theme classes

#### Computed CSS Variables
- `--color-primary`: Should have a valid color value
- If showing "undefined" or empty, the CSS variables are not being applied

#### Hydration Log
- Watch for class changes during page load
- Multiple changes might indicate hydration issues

### 3. Browser Console Checks

Open the browser console and run:

```javascript
// Check current classes
console.log('HTML classes:', document.documentElement.className);

// Check computed styles
const styles = getComputedStyle(document.documentElement);
console.log('--color-primary:', styles.getPropertyValue('--color-primary'));

// Check localStorage
console.log('color-theme:', localStorage.getItem('color-theme'));

// Test theme switching
localStorage.setItem('color-theme', 'red');
location.reload();
```

### 4. Test Theme Switching
Visit http://localhost:3001/test-theme to test dynamic theme switching

## Fixed Issues

### 1. Duplicate Theme Classes
The AppContext was adding theme classes without removing existing ones, causing potential conflicts. This has been fixed to:
- Remove any existing theme classes first
- Then apply the correct theme class

### 2. Hydration Mismatch
The theme is applied in two places:
- In the `<head>` script of layout.tsx (before React hydration)
- In the AppContext useEffect (after React hydration)

Both now handle theme classes consistently.

## Potential Remaining Issues

### 1. CSS Not Loading
If CSS variables show as undefined:
- Check that globals.css is being imported correctly
- Verify the CSS theme classes are defined (`.theme-blue`, etc.)
- Check for CSS compilation errors

### 2. Tailwind v4 Configuration
Ensure Tailwind v4 is processing the CSS variables correctly:
- The `@theme inline` directive should allow runtime CSS variable resolution
- Check that PostCSS is configured properly

### 3. Browser Compatibility
The theme uses `oklch()` color format. Ensure your browser supports it:
- Chrome 111+
- Firefox 113+
- Safari 16.4+

## Quick Fix Test

If themes aren't working, try this in the console:

```javascript
// Force apply theme classes and check
document.documentElement.className = 'theme-red';
const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
console.log('Primary color after forcing theme-red:', primary);
```

If this shows a value, the CSS is loaded correctly and the issue is with the JavaScript theme application.
If this shows empty/undefined, the CSS itself is not being loaded or processed correctly.