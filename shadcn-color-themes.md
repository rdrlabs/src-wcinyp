# Shadcn UI Color Themes - Primary Color Values

This document contains the primary color values for shadcn's colored themes in HSL format, based on Tailwind CSS color palette.

## Blue Theme
```css
/* Light Mode (using blue-600) */
--primary: 221.2 83.2% 53.3%;
--primary-foreground: 210 40% 98%;

/* Dark Mode (using blue-500) */
--primary: 217.2 91.2% 59.8%;
--primary-foreground: 222.2 47.4% 11.2%;
```

## Red Theme
```css
/* Light Mode (using red-500) */
--primary: 0 84.2% 60.2%;
--primary-foreground: 0 0% 98%;

/* Dark Mode (using red-600) */
--primary: 0 72.2% 50.6%;
--primary-foreground: 0 85.7% 97.3%;
```

## Rose Theme
```css
/* Light Mode (using rose-600) */
--primary: 346.8 77.2% 49.8%;
--primary-foreground: 355.7 100% 97.3%;

/* Dark Mode (using rose-500) */
--primary: 349.7 89.2% 60.2%;
--primary-foreground: 355.7 100% 97.3%;
```

## Orange Theme
```css
/* Light Mode (using orange-500) */
--primary: 24.6 95% 53.1%;
--primary-foreground: 60 9.1% 97.8%;

/* Dark Mode (using orange-600) */
--primary: 20.5 90.2% 48.2%;
--primary-foreground: 60 9.1% 97.8%;
```

## Green Theme
```css
/* Light Mode (using green-500) */
--primary: 142.1 70.6% 45.3%;
--primary-foreground: 144.9 80.4% 10%;

/* Dark Mode (using green-600) */
--primary: 142.1 76.2% 36.3%;
--primary-foreground: 143.8 61.2% 20.2%;
```

## Yellow Theme
```css
/* Light Mode (using yellow-500) */
--primary: 45.4 93.4% 47.5%;
--primary-foreground: 26 83.3% 14.1%;

/* Dark Mode (using yellow-600) */
--primary: 40.6 96.1% 40.4%;
--primary-foreground: 26 83.3% 14.1%;
```

## Violet Theme
```css
/* Light Mode (using violet-600) */
--primary: 262.1 83.3% 57.8%;
--primary-foreground: 210 20% 98%;

/* Dark Mode (using violet-500) */
--primary: 258.3 89.5% 66.3%;
--primary-foreground: 210 20% 98%;
```

## Implementation Example

To use these colors in your shadcn project, add them to your `globals.css` file:

```css
@layer base {
  :root {
    /* Blue Theme - Light Mode */
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    
    /* Other color variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    /* Blue Theme - Dark Mode */
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    /* Other dark mode variables */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}
```

## Tailwind Color Reference Table

Here are the exact HSL values from Tailwind CSS for the 500 and 600 shades:

| Color  | 500 Shade                | 600 Shade                |
|--------|--------------------------|--------------------------|
| Blue   | 217.2 91.2% 59.8%       | 221.2 83.2% 53.3%       |
| Red    | 0 84.2% 60.2%           | 0 72.2% 50.6%           |
| Rose   | 349.7 89.2% 60.2%       | 346.8 77.2% 49.8%       |
| Orange | 24.6 95% 53.1%          | 20.5 90.2% 48.2%        |
| Green  | 142.1 70.6% 45.3%       | 142.1 76.2% 36.3%       |
| Yellow | 45.4 93.4% 47.5%        | 40.6 96.1% 40.4%        |
| Violet | 258.3 89.5% 66.3%       | 262.1 83.3% 57.8%       |

## Notes

1. These HSL values are based on Tailwind CSS color palette
2. The primary colors typically use the 500-600 shade levels
3. Shadcn's latest version uses OKLCH color format, but HSL is still supported
4. You can use tools like `npx shadcn-custom-theme` to generate complete theme configurations
5. For light mode, shadcn often uses the darker shade (600) for better contrast
6. For dark mode, shadcn often uses the lighter shade (500) for better visibility

## Converting to OKLCH (for Tailwind v4)

If you need OKLCH values for Tailwind v4 compatibility, you can use online converters or the following approximate values:

- Blue: `oklch(0.546 0.245 262.881)`
- Red: `oklch(0.577 0.245 27.325)`
- Orange: `oklch(0.702 0.191 41.026)`
- Green: `oklch(0.647 0.19 142.495)`
- Yellow: `oklch(0.804 0.171 86.047)`
- Violet: `oklch(0.631 0.266 293.756)`