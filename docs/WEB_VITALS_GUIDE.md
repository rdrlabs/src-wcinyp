# Web Vitals Guide

## Overview

Web Vitals are a set of metrics that measure real-world user experience for loading performance, interactivity, and visual stability of web pages. This guide explains each metric, how to measure it, and how to improve it.

## Table of Contents

- [Core Web Vitals](#core-web-vitals)
  - [Largest Contentful Paint (LCP)](#largest-contentful-paint-lcp)
  - [Interaction to Next Paint (INP)](#interaction-to-next-paint-inp)
  - [Cumulative Layout Shift (CLS)](#cumulative-layout-shift-cls)
- [Other Web Vitals](#other-web-vitals)
  - [First Contentful Paint (FCP)](#first-contentful-paint-fcp)
  - [Time to Interactive (TTI)](#time-to-interactive-tti)
  - [Total Blocking Time (TBT)](#total-blocking-time-tbt)
  - [Time to First Byte (TTFB)](#time-to-first-byte-ttfb)
- [Measurement Tools](#measurement-tools)
- [Optimization Strategies](#optimization-strategies)

## Core Web Vitals

These are the subset of Web Vitals that apply to all web pages and are critical for user experience.

### Largest Contentful Paint (LCP)

**What it measures**: Loading performance - the time it takes for the largest content element visible in the viewport to render.

**Good threshold**: < 2.5 seconds

**What counts as LCP elements**:
- `<img>` elements
- `<image>` elements inside SVG
- `<video>` elements (poster image)
- Elements with background images
- Block-level elements containing text

**How to measure**:
```javascript
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.startTime);
}).observe({ entryTypes: ['largest-contentful-paint'] });
```

**Common issues**:
- Slow server response times
- Render-blocking JavaScript and CSS
- Slow resource load times
- Client-side rendering

**How to improve**:
1. **Optimize server response time**
   ```javascript
   // Use CDN for static assets
   // Enable compression
   // Optimize database queries
   ```

2. **Preload critical resources**
   ```html
   <link rel="preload" as="image" href="hero-image.webp">
   <link rel="preload" as="font" href="main-font.woff2" crossorigin>
   ```

3. **Optimize images**
   ```html
   <!-- Use responsive images -->
   <img srcset="hero-320w.jpg 320w,
                hero-640w.jpg 640w,
                hero-1280w.jpg 1280w"
        sizes="(max-width: 320px) 280px,
               (max-width: 640px) 640px,
               1280px"
        src="hero-1280w.jpg" alt="Hero image">
   ```

4. **Use lazy loading for below-fold images**
   ```html
   <img loading="lazy" src="below-fold-image.jpg" alt="...">
   ```

### Interaction to Next Paint (INP)

**What it measures**: Responsiveness - the time from when a user interacts with the page to when the next frame is painted.

**Good threshold**: < 200 milliseconds

**What interactions count**:
- Mouse clicks
- Keyboard presses
- Taps on touchscreen

**How to measure**:
```javascript
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.interactionId) {
      console.log('INP candidate:', entry.duration);
    }
  }
}).observe({ entryTypes: ['event'] });
```

**Common issues**:
- Long JavaScript tasks
- Large DOM size
- Excessive DOM manipulation
- Synchronous network requests

**How to improve**:
1. **Break up long tasks**
   ```javascript
   // Bad: Long synchronous task
   function processLargeArray(items) {
     items.forEach(item => expensiveOperation(item));
   }
   
   // Good: Break into chunks
   async function processLargeArray(items) {
     for (let i = 0; i < items.length; i += 100) {
       const chunk = items.slice(i, i + 100);
       chunk.forEach(item => expensiveOperation(item));
       await new Promise(resolve => setTimeout(resolve, 0));
     }
   }
   ```

2. **Debounce input handlers**
   ```javascript
   function debounce(func, wait) {
     let timeout;
     return function executedFunction(...args) {
       const later = () => {
         clearTimeout(timeout);
         func(...args);
       };
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
     };
   }
   
   const debouncedSearch = debounce(handleSearch, 300);
   ```

3. **Use CSS transforms instead of layout properties**
   ```css
   /* Bad: Triggers layout */
   .element { left: 100px; }
   
   /* Good: Only triggers composite */
   .element { transform: translateX(100px); }
   ```

### Cumulative Layout Shift (CLS)

**What it measures**: Visual stability - the sum of all unexpected layout shifts that occur during the lifespan of the page.

**Good threshold**: < 0.1

**How layout shift is calculated**:
```
Layout Shift Score = Impact Fraction × Distance Fraction
```

**How to measure**:
```javascript
let clsScore = 0;
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsScore += entry.value;
      console.log('Current CLS:', clsScore);
    }
  }
}).observe({ entryTypes: ['layout-shift'] });
```

**Common causes**:
- Images without dimensions
- Ads, embeds, iframes without dimensions
- Dynamically injected content
- Web fonts causing FOUT/FOIT

**How to improve**:
1. **Always include size attributes**
   ```html
   <!-- Specify dimensions -->
   <img src="photo.jpg" width="640" height="480" alt="...">
   
   <!-- Or use aspect-ratio -->
   <style>
     img { aspect-ratio: 16/9; width: 100%; }
   </style>
   ```

2. **Reserve space for dynamic content**
   ```css
   .ad-container {
     min-height: 250px; /* Reserve space */
   }
   
   .skeleton {
     background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
     background-size: 200% 100%;
     animation: loading 1.5s infinite;
   }
   ```

3. **Use font-display for web fonts**
   ```css
   @font-face {
     font-family: 'Custom Font';
     src: url('font.woff2') format('woff2');
     font-display: optional; /* or swap */
   }
   ```

## Other Web Vitals

### First Contentful Paint (FCP)

**What it measures**: The time from navigation start to when the browser renders the first bit of content.

**Good threshold**: < 1.8 seconds

**How to measure**:
```javascript
new PerformanceObserver((list) => {
  const [entry] = list.getEntries();
  console.log('FCP:', entry.startTime);
}).observe({ entryTypes: ['paint'] });
```

**How to improve**:
- Eliminate render-blocking resources
- Minify CSS
- Remove unused CSS
- Preconnect to required origins

### Time to Interactive (TTI)

**What it measures**: The time from navigation start until the page is reliably interactive.

**Good threshold**: < 3.8 seconds

**Definition**: The first 5-second window after FCP where:
- The main thread is quiet (no tasks > 50ms)
- The page has registered event handlers

**How to measure**:
```javascript
// Using web-vitals library
import { getTTI } from 'web-vitals';
getTTI(console.log);
```

**How to improve**:
- Code split JavaScript bundles
- Remove unused JavaScript
- Implement progressive enhancement

### Total Blocking Time (TBT)

**What it measures**: The sum of time periods between FCP and TTI where the main thread was blocked for long enough to prevent input responsiveness.

**Good threshold**: < 200 milliseconds

**Calculation**: Sum of blocking portions of all tasks > 50ms

**How to measure**:
```javascript
let tbt = 0;
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      tbt += entry.duration - 50;
    }
  }
});
observer.observe({ entryTypes: ['longtask'] });
```

### Time to First Byte (TTFB)

**What it measures**: The time from navigation start until the browser receives the first byte of the response.

**Good threshold**: < 800 milliseconds

**Components**:
- DNS lookup time
- Connection and TLS negotiation
- Request/response time

**How to measure**:
```javascript
const navigation = performance.getEntriesByType('navigation')[0];
console.log('TTFB:', navigation.responseStart - navigation.requestStart);
```

**How to improve**:
- Use a CDN
- Optimize server processing
- Enable compression
- Use HTTP/2 or HTTP/3

## Measurement Tools

### In Development

1. **Chrome DevTools**
   - Lighthouse panel
   - Performance panel
   - Network panel

2. **Web Vitals Extension**
   ```bash
   # Install from Chrome Web Store
   ```

3. **Playwright Tests**
   ```javascript
   const metrics = await page.evaluate(() => ({
     FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
     LCP: performance.getEntriesByType('largest-contentful-paint').pop()?.startTime,
   }));
   ```

### In Production

1. **Web Vitals Library**
   ```javascript
   import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
   
   function sendToAnalytics(metric) {
     // Send to your analytics endpoint
     navigator.sendBeacon('/analytics', JSON.stringify(metric));
   }
   
   onCLS(sendToAnalytics);
   onFCP(sendToAnalytics);
   onLCP(sendToAnalytics);
   onTTFB(sendToAnalytics);
   onINP(sendToAnalytics);
   ```

2. **Performance Observer API**
   ```javascript
   const observer = new PerformanceObserver((list) => {
     for (const entry of list.getEntries()) {
       // Send metrics to analytics
     }
   });
   
   observer.observe({ 
     entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] 
   });
   ```

## Optimization Strategies

### 1. Resource Optimization

**Images**:
- Use modern formats (WebP, AVIF)
- Implement responsive images
- Lazy load below-fold images
- Use image CDN with optimization

**JavaScript**:
- Code splitting
- Tree shaking
- Minification
- Defer non-critical scripts

**CSS**:
- Critical CSS inlining
- Remove unused CSS
- Minification
- Avoid @import

### 2. Network Optimization

**HTTP/2 and HTTP/3**:
- Multiplexing
- Server push
- Header compression

**Caching**:
```javascript
// Service Worker caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**Preloading**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://api.example.com">
<link rel="preload" as="script" href="critical.js">
```

### 3. Rendering Optimization

**Critical Rendering Path**:
1. Minimize critical resources
2. Minimize critical bytes
3. Minimize critical path length

**Progressive Enhancement**:
```javascript
// Base functionality works without JS
// Enhance with JS when available
if ('IntersectionObserver' in window) {
  // Add lazy loading
}
```

### 4. Framework-Specific (Next.js)

**Image Optimization**:
```jsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For LCP images
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>
```

**Font Optimization**:
```jsx
// next.config.js
module.exports = {
  optimizeFonts: true,
};
```

**Script Optimization**:
```jsx
import Script from 'next/script';

<Script
  src="https://example.com/script.js"
  strategy="lazyOnload" // or 'beforeInteractive', 'afterInteractive'
/>
```

## Performance Budget Guidelines

### Setting Budgets

```json
{
  "timings": {
    "FCP": 1800,
    "LCP": 2500,
    "TTI": 3800,
    "TBT": 200,
    "CLS": 0.1,
    "INP": 200,
    "TTFB": 800
  },
  "resources": {
    "total": 500,        // KB
    "javascript": 200,   // KB
    "css": 50,          // KB
    "images": 200,      // KB
    "fonts": 50         // KB
  }
}
```

### Monitoring Budgets

```javascript
// Check budgets in CI
const metrics = await captureMetrics();
const budgets = await loadBudgets();

Object.entries(budgets.timings).forEach(([metric, budget]) => {
  if (metrics[metric] > budget) {
    throw new Error(`${metric} exceeds budget: ${metrics[metric]} > ${budget}`);
  }
});
```

## Further Reading

- [web.dev/vitals](https://web.dev/vitals/)
- [Chrome Web Vitals Documentation](https://developers.google.com/web/tools/chrome-user-experience-report)
- [MDN Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)