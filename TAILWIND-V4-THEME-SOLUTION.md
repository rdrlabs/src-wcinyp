# Tailwind CSS v4 Runtime Theme Switching with OKLCH Colors

## The Problem

When migrating to Tailwind CSS v4, implementing runtime theme switching with CSS variables and OKLCH colors presents several challenges:

1. **CSS Variable Resolution**: Tailwind v4's `@theme` directive resolves CSS variables at build time by default
2. **Theme System Conflicts**: Multiple theme systems (dark mode vs color themes) can conflict when managing HTML element classes
3. **OKLCH Color Support**: While Tailwind v4 uses OKLCH internally, runtime switching requires specific patterns

## The Clean Solution

After extensive research and testing, here's the most effective approach for implementing runtime theme switching in Tailwind v4:

### 1. Use `@theme inline` Directive

The key is using the `inline` modifier with the `@theme` directive. This enables runtime CSS variable resolution:

```css
@import "tailwindcss";

/* Enable data-attribute-based dark mode */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* Static design tokens */
@theme {
  --radius: 0.5rem;
}

/* Runtime-resolved color variables */
@theme inline {
  --color-background: var(--theme-background);
  --color-foreground: var(--theme-foreground);
  --color-primary: var(--theme-primary);
  --color-primary-foreground: var(--theme-primary-foreground);
  --color-muted: var(--theme-muted);
  --color-muted-foreground: var(--theme-muted-foreground);
  --color-accent: var(--theme-accent);
  --color-accent-foreground: var(--theme-accent-foreground);
  --color-destructive: var(--theme-destructive);
  --color-destructive-foreground: var(--theme-destructive-foreground);
  --color-border: var(--theme-border);
  --color-input: var(--theme-input);
  --color-ring: var(--theme-ring);
  --color-card: var(--theme-card);
  --color-card-foreground: var(--theme-card-foreground);
}
```

### 2. Define Theme Variables in CSS

Define your actual color values as CSS variables that can be switched at runtime:

```css
@layer base {
  :root {
    /* Default/Light theme colors */
    --theme-background: oklch(100% 0 0);
    --theme-foreground: oklch(20% 0 0);
    --theme-primary: oklch(66.7% 0.203 241.7);
    --theme-primary-foreground: oklch(98% 0 0);
    --theme-muted: oklch(96% 0 0);
    --theme-muted-foreground: oklch(45% 0 0);
    --theme-accent: oklch(96% 0 0);
    --theme-accent-foreground: oklch(20% 0 0);
    --theme-destructive: oklch(60% 0.25 27);
    --theme-destructive-foreground: oklch(98% 0 0);
    --theme-border: oklch(90% 0 0);
    --theme-input: oklch(90% 0 0);
    --theme-ring: oklch(66.7% 0.203 241.7);
    --theme-card: oklch(100% 0 0);
    --theme-card-foreground: oklch(20% 0 0);
  }

  /* Dark mode overrides */
  [data-theme="dark"] {
    --theme-background: oklch(15% 0 0);
    --theme-foreground: oklch(98% 0 0);
    --theme-primary: oklch(69.8% 0.195 238.4);
    --theme-primary-foreground: oklch(15% 0 0);
    --theme-muted: oklch(25% 0 0);
    --theme-muted-foreground: oklch(65% 0 0);
    --theme-accent: oklch(25% 0 0);
    --theme-accent-foreground: oklch(98% 0 0);
    --theme-destructive: oklch(50% 0.25 27);
    --theme-destructive-foreground: oklch(98% 0 0);
    --theme-border: oklch(25% 0 0);
    --theme-input: oklch(25% 0 0);
    --theme-ring: oklch(69.8% 0.195 238.4);
    --theme-card: oklch(18% 0 0);
    --theme-card-foreground: oklch(98% 0 0);
  }

  /* Color theme variations */
  .theme-blue {
    --theme-primary: oklch(66.7% 0.203 241.7);
    --theme-ring: oklch(66.7% 0.203 241.7);
  }

  .theme-red {
    --theme-primary: oklch(69.5% 0.203 25.5);
    --theme-ring: oklch(69.5% 0.203 25.5);
  }

  .theme-green {
    --theme-primary: oklch(60.8% 0.149 149.5);
    --theme-ring: oklch(60.8% 0.149 149.5);
  }

  .theme-orange {
    --theme-primary: oklch(70.1% 0.179 44.2);
    --theme-ring: oklch(70.1% 0.179 44.2);
  }

  /* Dark mode color theme combinations */
  [data-theme="dark"].theme-blue {
    --theme-primary: oklch(69.8% 0.195 238.4);
    --theme-primary-foreground: oklch(15% 0 0);
    --theme-ring: oklch(69.8% 0.195 238.4);
  }

  [data-theme="dark"].theme-red {
    --theme-primary: oklch(59.2% 0.203 25.5);
    --theme-primary-foreground: oklch(98% 0 0);
    --theme-ring: oklch(59.2% 0.203 25.5);
  }

  /* Continue for other theme combinations... */
}
```

### 3. Configure Theme Providers

Set up your theme providers to use separate attributes for dark mode and color themes:

```tsx
// providers.tsx
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={['light', 'dark']}
    >
      <AppProvider>
        {children}
      </AppProvider>
    </ThemeProvider>
  )
}
```

### 4. Implement Theme Management

Create a context for managing color themes separately from dark/light mode:

```tsx
// contexts/app-context.tsx
export function AppProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('blue')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('color-theme') || 'blue'
    setColorThemeState(savedTheme as ColorTheme)
    
    // Apply theme class
    const root = document.documentElement
    root.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls)
      }
    })
    root.classList.add(`theme-${savedTheme}`)
    
    setMounted(true)
  }, [])

  const setColorTheme = useCallback((theme: ColorTheme) => {
    const root = document.documentElement
    
    // Remove old theme class
    root.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls)
      }
    })
    
    // Add new theme class
    root.classList.add(`theme-${theme}`)
    
    // Save preference
    localStorage.setItem('color-theme', theme)
    setColorThemeState(theme)
  }, [])

  // ... rest of context implementation
}
```

### 5. Prevent FOUC (Flash of Unstyled Content)

Add an inline script to your layout to apply themes before React hydrates:

```tsx
// app/layout.tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        try {
          // Apply dark/light mode
          const theme = localStorage.theme || 'system';
          if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
          } else if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
          }
          
          // Apply color theme
          const colorTheme = localStorage.getItem('color-theme') || 'blue';
          document.documentElement.classList.add('theme-' + colorTheme);
        } catch {}
      `,
    }}
  />
</head>
```

## Key Benefits of This Approach

1. **Clean Separation**: Dark mode and color themes are managed independently
2. **Runtime Flexibility**: Colors can be changed without rebuilding CSS
3. **OKLCH Support**: Uses perceptually uniform color space for better color consistency
4. **No JavaScript Required**: Theme switching works with CSS alone after initial setup
5. **Type Safety**: Can be fully typed in TypeScript
6. **Framework Agnostic**: While shown with Next.js, the CSS approach works with any framework

## Alternative Approaches

### Direct Variable Override (Simpler but Less Flexible)

If you don't need the indirection, you can define themes directly:

```css
@theme {
  --color-primary: oklch(66.7% 0.203 241.7);
}

@layer base {
  .theme-red {
    --color-primary: oklch(69.5% 0.203 25.5);
  }
  
  .theme-green {
    --color-primary: oklch(60.8% 0.149 149.5);
  }
}
```

### Data Attribute Themes (Without Intermediate Variables)

```css
@theme {
  --color-primary: #3b82f6;
}

@layer base {
  [data-theme='ocean'] {
    --color-primary: #aab9ff;
  }
  
  [data-theme='forest'] {
    --color-primary: #56d0a0;
  }
}
```

## Common Pitfalls to Avoid

1. **Don't use `@theme` without `inline` for runtime variables** - They will be resolved at build time
2. **Don't mix class-based and attribute-based dark mode** - Choose one approach
3. **Don't forget to handle SSR** - Use mounting state to prevent hydration mismatches
4. **Don't use CSS variables in media queries** - They need to be in `@theme` blocks

## Conclusion

The `@theme inline` directive is the key to enabling runtime theme switching in Tailwind v4. By combining it with CSS variables and OKLCH colors, you can create a robust, performant theme system that provides excellent user experience and developer ergonomics.

This approach leverages Tailwind v4's CSS-first configuration while maintaining the flexibility needed for dynamic themes. The use of OKLCH colors ensures perceptually uniform color transitions and better accessibility.