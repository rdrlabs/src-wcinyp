# Landing Page Quick Wins & Fixes

## 🚨 Critical Fixes (Blocking CI/CD)

### 1. Update Page Tests
```tsx
// src/app/page.test.tsx
// Line 15: Update title test
expect(screen.getByText('WCINYP')).toBeInTheDocument()

// Line 20: Update subtitle test  
expect(screen.getByText('Medical Imaging Platform')).toBeInTheDocument()

// Lines 46-49: Update feature descriptions
expect(screen.getByText('Technical documentation, user guides, and best practices')).toBeInTheDocument()
expect(screen.getByText('Centralized repository for all medical documents')).toBeInTheDocument()
expect(screen.getByText('Latest news and important announcements')).toBeInTheDocument()
expect(screen.getByText('Complete contact database for all stakeholders')).toBeInTheDocument()

// Line 71-73: Fix grid test
const featureSection = container.querySelector('[class*="grid-cols"]')
expect(featureSection).toBeInTheDocument()
```

## ⚡ Performance Quick Wins

### 1. Disable Heavy Animations on Mobile
```css
/* Add to landing.css */
@media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
  /* Keep critical animations, disable decorative ones */
  .animate-gradient { 
    animation: gradient 30s ease infinite; /* Slower */
  }
  
  /* Disable blur on very low-end devices */
  @supports not (backdrop-filter: blur(1px)) {
    .glass { background-color: rgba(255, 255, 255, 0.1); }
  }
}
```

### 2. Add Loading Priority
```tsx
// In page.tsx hero section
<motion.h1 
  className="text-6xl md:text-8xl font-bold mb-6"
  style={{ fontDisplay: 'swap' }} // Prevent FOIT
>
```

## ♿ Accessibility Quick Wins

### 1. Add Skip Navigation (layout.tsx)
```tsx
<body>
  <a 
    href="#main-content" 
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded"
  >
    Skip to main content
  </a>
  {/* rest of layout */}
  <main id="main-content">
```

### 2. Improve Contrast
```css
/* globals.css - Update these values */
--color-border: rgba(255, 255, 255, 0.1);      /* From 0.06 */
--color-text-secondary: oklch(75% 0 0);         /* From 70% */
--color-muted-foreground: oklch(65% 0 0);      /* From 60% */
```

### 3. Add Animation Toggle
```tsx
// Add to navbar or footer
const [reducedMotion, setReducedMotion] = useState(false);

<button
  onClick={() => setReducedMotion(!reducedMotion)}
  className="text-sm text-muted-foreground hover:text-foreground"
  aria-label="Toggle animations"
>
  {reducedMotion ? '▶️ Enable' : '⏸️ Disable'} Animations
</button>

// Wrap app with MotionConfig
<MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
```

## 🎨 Visual Quick Wins

### 1. Add Hover Feedback to Scroll Indicator
```tsx
// page.tsx - Update ChevronDown button
<motion.button
  onClick={() => scrollToSection('knowledge')}
  className="absolute bottom-8 left-1/2 -translate-x-1/2"
  whileHover={{ scale: 1.2 }}
  whileTap={{ scale: 0.9 }}
>
  <ChevronDown className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" />
</motion.button>
```

### 2. Add Loading State
```tsx
// Create a simple loading state for the hero
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  setIsLoaded(true);
}, []);

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: isLoaded ? 1 : 0 }}
  transition={{ duration: 0.5 }}
>
```

### 3. Fix Feature Card Links
```tsx
// Make entire card clickable with better hover state
<Link href={feature.href} className="group block h-full">
  <GlassCard className="h-full transition-all group-hover:border-primary/20">
```

## 📱 Mobile UX Quick Wins

### 1. Larger Touch Targets
```tsx
// GlowButton - increase mobile padding
const sizeClasses = {
  sm: "px-4 py-2 md:px-4 md:py-2 text-sm",
  md: "px-6 py-4 md:px-6 md:py-3 text-base",  // Larger on mobile
  lg: "px-8 py-5 md:px-8 md:py-4 text-lg"
};
```

### 2. Improve Mobile Typography
```tsx
// Hero section - better mobile scaling
<h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6">
  {heroContent.title}
</h1>

<p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4">
  {heroContent.subtitle}
</p>
```

## 🐛 Bug Fixes

### 1. Fix Unused Variable Warning
```tsx
// page.tsx line 17
const [_activeSection, setActiveSection] = useState(0);
// Consider removing if truly not needed:
// const [, setActiveSection] = useState(0);
```

### 2. Add Error Boundary
```tsx
// app/error.tsx should wrap the landing page
// Consider adding specific error handling for animation failures
```

### 3. Fix Progress Bar Width
```tsx
// The scrollProgress returns a MotionValue, not a percentage
<motion.div 
  className="h-full bg-primary"
  style={{ width: useTransform(scrollProgress, [0, 100], ['0%', '100%']) }}
/>
```

## 📋 Implementation Priority

1. **Today**: Fix tests (blocks deployment)
2. **Tomorrow**: Add skip nav & improve contrast
3. **This Week**: Mobile optimizations & loading states
4. **Next Week**: Animation controls & performance

## 🎯 Measuring Success

After implementing quick wins, monitor:
- Lighthouse scores (aim for 90+ performance)
- Test coverage (100% passing)
- Accessibility audit (0 violations)
- User feedback on animations
- Mobile engagement metrics