# Tailwind Downgrade and shadcn/ui Setup

**Summary**: Successfully downgraded from Tailwind v4 to v3.4 for stability and configured shadcn/ui integration.

**Key Points**:
- ✅ Removed Tailwind v4.1.4 and @tailwindcss/vite plugin
- ✅ Installed Tailwind v3.4.17 with PostCSS setup
- ✅ Created postcss.config.js for standard v3.4 processing
- ✅ Updated app.css from v4 syntax to v3.4 directives
- ✅ shadcn/ui now properly detects Tailwind v3.4

**Configuration Changes**:
```javascript
// postcss.config.js - Standard v3.4 setup
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// tailwind.config.js - v3.4 configuration
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**CSS Migration**:
- From: `@import "tailwindcss"` (v4 syntax)
- To: `@tailwind base/components/utilities` (v3.4 syntax)

**Why It Matters**: Tailwind v3.4 is production-stable with full browser support. The v4 alpha could have caused the same compatibility issues we experienced with Docusaurus.