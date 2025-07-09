'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useAppContext, useAppTheme, type ColorTheme } from '@/contexts/app-context'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { 
  Activity, 
  Monitor, 
  Palette, 
  Package, 
  Database, 
  Zap,
  Copy,
  RefreshCw,
  Trash2,
  Download,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  Bell,
  Loader2,
  RotateCw,
  Bug,
  Keyboard,
  Map,
  Info,
  FileText,
  Phone
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Tooltip component for help text
function HelpTooltip({ content }: { content: string }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [position, setPosition] = useState({ top: true, left: true })
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const spaceRight = window.innerWidth - rect.right
    
    setPosition({
      top: spaceBelow < 100 && spaceAbove > spaceBelow,
      left: spaceRight < 300
    })
    setShowTooltip(true)
  }

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const spaceRight = window.innerWidth - rect.right
    
    setPosition({
      top: spaceBelow < 100 && spaceAbove > spaceBelow,
      left: spaceRight < 300
    })
    setShowTooltip(true)
  }
  
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={handleFocus}
        onBlur={() => setShowTooltip(false)}
        aria-label="Help"
      >
        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
      </button>
      {showTooltip && (
        <div 
          className={cn(
            "absolute z-50 w-64 p-2 text-xs bg-popover text-popover-foreground rounded-md shadow-md border",
            position.top ? "top-6" : "bottom-6",
            position.left ? "right-0" : "left-0"
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default function DiagnosticsPage() {
  const { colorTheme, setColorTheme, mounted } = useAppTheme()
  const { theme, setTheme, systemTheme } = useTheme()
  const appContext = useAppContext()
  const { setIsLoading } = appContext
  
  // System info
  const [systemInfo, setSystemInfo] = useState({
    userAgent: '',
    platform: '',
    viewport: { width: 0, height: 0 },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown'
  })

  // Loading demo state
  const [demoLoading, setDemoLoading] = useState(false)

  // Selected section state
  const [selectedSection, setSelectedSection] = useState<string>('all')
  
  // Component preview state
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [selectedUsage, setSelectedUsage] = useState<{ component: string; page: string } | null>(null)

  // Theme colors
  const themes: { value: ColorTheme; name: string; color: string }[] = [
    { value: 'blue', name: 'Blue', color: 'oklch(69.8% 0.195 238.4)' },
    { value: 'red', name: 'Red', color: 'oklch(69.5% 0.203 25.5)' },
    { value: 'orange', name: 'Orange', color: 'oklch(70.1% 0.179 44.2)' },
    { value: 'green', name: 'Green', color: 'oklch(60.8% 0.149 149.5)' },
    { value: 'yellow', name: 'Yellow', color: 'oklch(82.5% 0.155 92.1)' },
    { value: 'default', name: 'Default', color: 'oklch(25% 0 0)' }
  ]

  // Component usage map
  const componentUsage = [
    {
      component: 'Card',
      usage: ['Home (feature cards)', 'Diagnostics', 'Theme Showcase', 'All error pages'],
      description: 'Container component with header and content sections',
      variants: 'default, primary, primaryGradient'
    },
    {
      component: 'Button',
      usage: ['All pages', 'Navigation', 'Forms', 'Actions'],
      description: 'Interactive button with multiple variants',
      variants: 'default, secondary, outline, ghost, link, destructive'
    },
    {
      component: 'Table',
      usage: ['Documents page', 'Directory page', 'Diagnostics'],
      description: 'Data display in rows and columns',
      variants: 'With sorting, selection states'
    },
    {
      component: 'Badge',
      usage: ['Directory (specialties)', 'Diagnostics (status)', 'Document tags'],
      description: 'Small labeled indicators',
      variants: 'default, secondary, outline, destructive'
    },
    {
      component: 'Input',
      usage: ['Documents (search)', 'Forms', 'Theme Showcase'],
      description: 'Text input fields with validation',
      variants: 'default, primary (with colored border)'
    },
    {
      component: 'Switch',
      usage: ['Documents (view toggle)', 'Theme Showcase', 'Settings'],
      description: 'Toggle between two states',
      variants: 'Uses primary color when checked'
    },
    {
      component: 'Tabs',
      usage: ['Theme Showcase', 'Diagnostics', 'Form sections'],
      description: 'Tabbed interface for content organization',
      variants: 'default, subtle'
    },
    {
      component: 'Toast',
      usage: ['Global (any action feedback)', 'Form submissions', 'Errors'],
      description: 'Temporary notification messages',
      variants: 'success, error, info, warning'
    }
  ]

  // Component implementation examples
  const implementationExamples: Record<string, Record<string, { code: string; preview: React.ReactNode; description: string }>> = {
    Card: {
      'Home (feature cards)': {
        description: 'Feature cards displayed on the home page with hover effects',
        code: `<Card className="hover:shadow-md transition-shadow cursor-pointer">
  <CardHeader>
    <CardTitle>{feature.title}</CardTitle>
    <CardDescription>{feature.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <Link href={feature.href} className="text-primary hover:underline">
      Learn more →
    </Link>
  </CardContent>
</Card>`,
        preview: (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Manage medical forms and documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/documents" className="text-primary hover:underline">
                Learn more →
              </Link>
            </CardContent>
          </Card>
        )
      },
      'Diagnostics': {
        description: 'Collapsible cards used throughout the diagnostics page',
        code: `<Card>
  <CollapsibleTrigger asChild>
    <CardHeader className="cursor-pointer">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          System Information
        </div>
        <ChevronDown className="h-4 w-4" />
      </CardTitle>
      <CardDescription>Environment and browser details</CardDescription>
    </CardHeader>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <CardContent>
      {/* Content */}
    </CardContent>
  </CollapsibleContent>
</Card>`,
        preview: (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>Environment and browser details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Card content goes here...</p>
            </CardContent>
          </Card>
        )
      }
    },
    Button: {
      'All pages': {
        description: 'Primary action buttons used throughout the application',
        code: `<Button onClick={handleAction}>
  Primary Action
</Button>

<Button variant="outline" size="sm">
  <Copy className="h-4 w-4 mr-2" />
  Copy
</Button>`,
        preview: (
          <div className="flex gap-2">
            <Button>Primary Action</Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        )
      },
      'Forms': {
        description: 'Form submission and action buttons',
        code: `<div className="flex gap-2 justify-end">
  <Button type="button" variant="outline" onClick={handleCancel}>
    Cancel
  </Button>
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Submitting...
      </>
    ) : (
      'Submit Form'
    )}
  </Button>
</div>`,
        preview: (
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Submit Form</Button>
          </div>
        )
      }
    },
    Table: {
      'Documents page': {
        description: 'Document listing table with sortable headers',
        code: `<Table>
  <TableCaption>Available medical forms and documents</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[300px]">Document Name</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Last Updated</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Patient Registration Form
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">Registration</Badge>
      </TableCell>
      <TableCell>2024-03-15</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">View</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`,
        preview: (
          <Table>
            <TableCaption>Available medical forms and documents</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Patient Registration Form</TableCell>
                <TableCell>
                  <Badge variant="secondary">Registration</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      }
    },
    Badge: {
      'Directory (specialties)': {
        description: 'Contact type badges with icons',
        code: `<Badge variant="secondary" className="flex items-center gap-1">
  <Phone className="h-3 w-3" />
  {contact.type}
</Badge>`,
        preview: (
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Provider
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              Vendor
            </Badge>
          </div>
        )
      },
      'Diagnostics (status)': {
        description: 'Status indicator badges',
        code: `<Badge variant={systemInfo.environment === 'development' ? 'default' : 'secondary'}>
  {systemInfo.environment}
</Badge>

<Badge variant={mounted ? 'default' : 'secondary'}>
  {mounted ? 'Yes' : 'No'}
</Badge>`,
        preview: (
          <div className="flex gap-2">
            <Badge variant="default">development</Badge>
            <Badge variant="secondary">production</Badge>
          </div>
        )
      }
    },
    Input: {
      'Documents (search)': {
        description: 'Search input with icon',
        code: `<div className="relative">
  <Input
    type="search"
    placeholder="Search documents..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
  />
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
</div>`,
        preview: (
          <div className="relative max-w-sm">
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-10"
            />
            <Activity className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        )
      }
    },
    Switch: {
      'Documents (view toggle)': {
        description: 'Toggle between documents and form filler views',
        code: `<div className="flex items-center gap-3">
  <span className={cn(
    "text-sm font-medium transition-colors",
    !showFormFiller ? "text-foreground" : "text-muted-foreground"
  )}>
    Documents
  </span>
  <Switch
    checked={showFormFiller}
    onCheckedChange={setShowFormFiller}
  />
  <span className={cn(
    "text-sm font-medium transition-colors",
    showFormFiller ? "text-foreground" : "text-muted-foreground"
  )}>
    Form Filler
  </span>
</div>`,
        preview: (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Documents</span>
            <Switch defaultChecked />
            <span className="text-sm font-medium text-muted-foreground">Form Filler</span>
          </div>
        )
      }
    },
    Tabs: {
      'Theme Showcase': {
        description: 'Tab navigation for content sections',
        code: `<Tabs defaultValue="tab1" className="w-full">
  <TabsList>
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Details</TabsTrigger>
    <TabsTrigger value="tab3">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1" className="mt-4">
    <p>Overview content</p>
  </TabsContent>
</Tabs>`,
        preview: (
          <Tabs defaultValue="tab1" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tab1">Overview</TabsTrigger>
              <TabsTrigger value="tab2">Details</TabsTrigger>
              <TabsTrigger value="tab3">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p className="text-sm text-muted-foreground">Overview content</p>
            </TabsContent>
          </Tabs>
        )
      }
    },
    Toast: {
      'Global (any action feedback)': {
        description: 'Success notification after an action',
        code: `// Import toast from sonner
import { toast } from 'sonner'

// Show success notification
toast.success('Document saved successfully')

// Show error notification
toast.error('Failed to save document')

// Show info notification
toast.info('Processing your request...')`,
        preview: (
          <div className="space-y-2">
            <Button onClick={() => toast.success('Document saved successfully')}>
              Show Success Toast
            </Button>
            <p className="text-xs text-muted-foreground">Click to see a toast notification</p>
          </div>
        )
      }
    }
  }

  // Function to generate exportable component code
  const generateExportableCode = (component: string, usage: string) => {
    const example = implementationExamples[component]?.[usage]
    if (!example) return ''

    const componentImports: Record<string, string> = {
      Card: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"`,
      Button: `import { Button } from "@/components/ui/button"`,
      Table: `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"`,
      Badge: `import { Badge } from "@/components/ui/badge"`,
      Input: `import { Input } from "@/components/ui/input"`,
      Switch: `import { Switch } from "@/components/ui/switch"`,
      Tabs: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`,
      Toast: `import { toast } from "sonner"`
    }

    return `// Standalone ${component} Component - ${usage}
// This component includes all necessary imports and theme configuration
// You can copy this entire code and use it in external tools for design iteration

'use client'

import * as React from "react"
${componentImports[component]}
import { cn } from "@/lib/utils"
${component === 'Card' && usage === 'Home (feature cards)' ? 'import Link from "next/link"' : ''}
${component === 'Button' || component === 'Badge' ? 'import { Copy, Loader2, Phone, Activity, Package } from "lucide-react"' : ''}
${component === 'Card' && usage === 'Diagnostics' ? 'import { Monitor, ChevronDown } from "lucide-react"' : ''}
${component === 'Table' ? 'import { FileText } from "lucide-react"' : ''}
${component === 'Input' ? 'import { Search } from "lucide-react"' : ''}

// Theme Configuration
// These CSS variables control the component colors
// They are defined in your global CSS and change based on the selected theme
const themeConfig = {
  cssVariables: {
    // Primary colors (changes based on theme: blue, red, orange, green, yellow, neutral)
    '--color-primary': 'oklch(69.8% 0.195 238.4)', // Example: blue theme
    '--color-primary-foreground': 'oklch(98% 0 0)',
    
    // Background and foreground
    '--color-background': 'oklch(100% 0 0)',
    '--color-foreground': 'oklch(10% 0 0)',
    
    // Muted colors
    '--color-muted': 'oklch(96% 0 0)',
    '--color-muted-foreground': 'oklch(45% 0 0)',
    
    // Other theme colors
    '--color-card': 'oklch(100% 0 0)',
    '--color-card-foreground': 'oklch(10% 0 0)',
    '--color-border': 'oklch(90% 0 0)',
  }
}

// Component Implementation
export default function ${component}Example() {
  ${component === 'Input' ? 'const [searchTerm, setSearchTerm] = React.useState("")' : ''}
  ${component === 'Switch' ? 'const [showFormFiller, setShowFormFiller] = React.useState(false)' : ''}
  ${component === 'Button' && usage === 'Forms' ? 'const [isSubmitting, setIsSubmitting] = React.useState(false)' : ''}
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">${component} - ${usage}</h2>
      <p className="text-muted-foreground mb-6">${example.description}</p>
      
      {/* Component Example */}
      ${example.code}
    </div>
  )
}

// Utility function for className merging (simplified version)
function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}

// Usage Notes:
// 1. This component uses the current theme's primary color
// 2. The primary color changes based on your selected theme (blue, red, orange, etc.)
// 3. Dark mode is handled automatically through CSS variables
// 4. To customize colors, update the CSS variables in your global styles
// 5. The component is fully self-contained and can be used in isolation
`
  }

  // Keyboard shortcuts
  const shortcuts = [
    { keys: 'Ctrl+Shift+D', action: 'Open Diagnostics Page' },
    { keys: 'Cmd/Ctrl+K', action: 'Open Command Palette' },
    { keys: 'ESC', action: 'Close loading overlay or modals' },
    { keys: 'F5 / Ctrl+R', action: 'Reload page' }
  ]

  // CSS Variables
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({})
  const [localStorage, setLocalStorage] = useState<Record<string, string>>({})
  const [bodyClasses, setBodyClasses] = useState('')
  const [htmlClasses, setHtmlClasses] = useState('')

  // Memoize CSS variable names
  const cssVarNames = useMemo(() => [
    '--color-primary',
    '--color-primary-foreground',
    '--color-background',
    '--color-foreground',
    '--color-card',
    '--color-card-foreground',
    '--color-muted',
    '--color-muted-foreground',
    '--color-accent',
    '--color-accent-foreground',
    '--color-destructive',
    '--color-destructive-foreground',
    '--color-border',
    '--color-input',
    '--color-ring'
  ], [])

  // Update CSS variables only when theme changes
  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement)
    const vars: Record<string, string> = {}
    
    cssVarNames.forEach(name => {
      vars[name] = computedStyle.getPropertyValue(name).trim()
    })
    setCssVariables(vars)
    
    // Update classes
    setBodyClasses(document.body.className)
    setHtmlClasses(document.documentElement.className)
  }, [colorTheme, theme, cssVarNames])

  // Initialize system info and localStorage once on mount
  useEffect(() => {
    // System info
    setSystemInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    })

    // Get localStorage
    const storage: Record<string, string> = {}
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key) {
        storage[key] = window.localStorage.getItem(key) || ''
      }
    }
    setLocalStorage(storage)

    // Update on resize
    const handleResize = () => {
      setSystemInfo(prev => ({
        ...prev,
        viewport: { width: window.innerWidth, height: window.innerHeight }
      }))
    }

    // ESC key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDemoLoading(false)
        setIsLoading(false)
        toast.info('Closed loading overlay')
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [setIsLoading])

  // Actions
  const clearLocalStorage = useCallback(() => {
    if (confirm('This will clear all saved data including theme preferences. Continue?')) {
      window.localStorage.clear()
      toast.success('LocalStorage cleared - reloading page...')
      setTimeout(() => window.location.reload(), 1000)
    }
  }, [])

  const resetTheme = useCallback(() => {
    setColorTheme('blue')
    setTheme('light')
    toast.success('Theme reset to defaults')
  }, [setColorTheme, setTheme])

  const copyDiagnostics = useCallback(() => {
    const diagnostics = {
      system: systemInfo,
      theme: {
        colorTheme,
        darkMode: theme,
        systemTheme,
        bodyClasses,
        htmlClasses
      },
      cssVariables,
      localStorage,
      context: {
        mounted: appContext.mounted,
        isLoading: appContext.isLoading,
        notifications: appContext.notifications.length,
        preferences: appContext.preferences
      }
    }
    
    navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2))
    toast.success('Diagnostics copied to clipboard')
  }, [systemInfo, colorTheme, theme, systemTheme, bodyClasses, htmlClasses, cssVariables, localStorage, appContext])

  const exportDiagnostics = useCallback(() => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      system: systemInfo,
      theme: {
        colorTheme,
        darkMode: theme,
        systemTheme,
        bodyClasses,
        htmlClasses
      },
      cssVariables,
      localStorage,
      context: {
        mounted: appContext.mounted,
        isLoading: appContext.isLoading,
        notifications: appContext.notifications.length,
        preferences: appContext.preferences
      }
    }
    
    const blob = new Blob([JSON.stringify(diagnostics, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diagnostics-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Diagnostics exported')
  }, [systemInfo, colorTheme, theme, systemTheme, bodyClasses, htmlClasses, cssVariables, localStorage, appContext])

  const testNotifications = useCallback(() => {
    toast.success('Success notification - something went well!')
    setTimeout(() => toast.error('Error notification - something went wrong!'), 500)
    setTimeout(() => toast.info('Info notification - here\'s some information'), 1000)
    setTimeout(() => toast.warning('Warning notification - be careful!'), 1500)
  }, [])

  const demoLoadingState = useCallback(() => {
    setDemoLoading(true)
    toast.info('Loading overlay will close in 3 seconds (or press ESC)')
    setTimeout(() => {
      setDemoLoading(false)
      toast.success('Loading demo completed')
    }, 3000)
  }, [])

  const toggleDebugMode = useCallback(() => {
    document.body.classList.toggle('debug-mode')
    const hasDebug = document.body.classList.contains('debug-mode')
    toast.info(`Debug mode ${hasDebug ? 'enabled' : 'disabled'} - check body classes`)
  }, [])

  if (!mounted) {
    return <div className="container mx-auto p-8">Loading diagnostics...</div>
  }

  // Demo loading overlay
  if (demoLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Demo loading state...</p>
          <p className="text-xs text-muted-foreground">Press ESC to close</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            System Diagnostics
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time application health and configuration dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyDiagnostics}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={exportDiagnostics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Navigation - Sticky */}
      <div className="sticky top-[88px] z-30 -mx-8 mb-6">
        <div className="px-8 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
          <nav aria-label="Section navigation" className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedSection === 'all' ? 'default' : 'outline'}
            className="cursor-pointer" 
            onClick={() => setSelectedSection('all')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('all')}
            aria-label="View all sections"
          >
            <Info className="h-3 w-3 mr-1" />
            View All
          </Badge>
        <Badge 
          variant={selectedSection === 'system' ? 'default' : 'outline'}
          className="cursor-pointer" 
          onClick={() => setSelectedSection('system')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('system')}
          aria-label="View System Information section"
        >
          <Monitor className="h-3 w-3 mr-1" />
          System
        </Badge>
        <Badge 
          variant={selectedSection === 'theme' ? 'default' : 'outline'}
          className="cursor-pointer" 
          onClick={() => setSelectedSection('theme')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('theme')}
          aria-label="View Theme Diagnostics section"
        >
          <Palette className="h-3 w-3 mr-1" />
          Theme
        </Badge>
        <Badge 
          variant={selectedSection === 'components' ? 'default' : 'outline'}
          className="cursor-pointer" 
          onClick={() => setSelectedSection('components')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('components')}
          aria-label="View Component Health Check section"
        >
          <Package className="h-3 w-3 mr-1" />
          Components
        </Badge>
        <Badge 
          variant={selectedSection === 'showcase' ? 'default' : 'outline'}
          className="cursor-pointer" 
          onClick={() => setSelectedSection('showcase')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('showcase')}
          aria-label="View Theme Showcase section"
        >
          <Palette className="h-3 w-3 mr-1" />
          Showcase
        </Badge>
        <Badge 
          variant={selectedSection === 'usage' ? 'default' : 'outline'}
          className="cursor-pointer" 
          onClick={() => setSelectedSection('usage')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('usage')}
          aria-label="View Component Usage Map section"
        >
          <Map className="h-3 w-3 mr-1" />
          Usage Map
        </Badge>
        <Badge 
          variant={selectedSection === 'state' ? 'default' : 'outline'}
          className="cursor-pointer" 
          onClick={() => setSelectedSection('state')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('state')}
          aria-label="View State Management section"
        >
          <Database className="h-3 w-3 mr-1" />
          State
        </Badge>
        <Badge 
          variant={selectedSection === 'actions' ? 'default' : 'outline'}
          className="cursor-pointer" 
          onClick={() => setSelectedSection('actions')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('actions')}
          aria-label="View Quick Actions section"
        >
          <Zap className="h-3 w-3 mr-1" />
          Actions
        </Badge>
        <Badge 
          variant={selectedSection === 'shortcuts' ? 'default' : 'outline'}
          className="cursor-pointer" 
          onClick={() => setSelectedSection('shortcuts')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('shortcuts')}
          aria-label="View Keyboard Shortcuts section"
        >
          <Keyboard className="h-3 w-3 mr-1" />
          Shortcuts
        </Badge>
          </nav>
        </div>
      </div>

      {/* 1. System Information */}
      {(selectedSection === 'all' || selectedSection === 'system') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">1.</span>
              <Monitor className="h-5 w-5" />
              System Information
              <HelpTooltip content="Shows browser environment, viewport size, and platform details. Useful for debugging responsive issues." />
            </CardTitle>
            <CardDescription>Environment and browser details</CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Environment</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={systemInfo.environment === 'development' ? 'default' : 'secondary'}>
                      {systemInfo.environment}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Platform</Label>
                  <p className="font-mono text-sm mt-1">{systemInfo.platform}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Viewport</Label>
                  <p className="font-mono text-sm mt-1">
                    {systemInfo.viewport.width} × {systemInfo.viewport.height}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Next.js</Label>
                  <p className="font-mono text-sm mt-1">v15.3.5</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">User Agent</Label>
                <p className="font-mono text-xs mt-1 text-muted-foreground break-all">
                  {systemInfo.userAgent}
                </p>
              </div>
            </CardContent>
        </Card>
      )}

      {/* 2. Theme Diagnostics */}
      {(selectedSection === 'all' || selectedSection === 'theme') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">2.</span>
              <Palette className="h-5 w-5" />
              Theme Diagnostics
              <HelpTooltip content="Manage color themes and inspect CSS variables. Click any color swatch to instantly switch themes." />
            </CardTitle>
            <CardDescription>Color themes and CSS variables</CardDescription>
          </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Theme Status */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Color Theme</Label>
                      <p className="font-semibold text-lg capitalize text-primary">{colorTheme}</p>
                      <p className="text-xs text-muted-foreground mt-1">Expected class: theme-{colorTheme}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Mode</Label>
                      <p className="font-semibold text-lg capitalize">{theme}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Mounted</Label>
                      <Badge variant={mounted ? "default" : "secondary"}>
                        {mounted ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={resetTheme} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
                
                {/* Visual Theme Test */}
                <div className="p-4 border rounded-lg">
                  <Label className="text-xs text-muted-foreground mb-2 block">Theme Color Test</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary rounded-lg shadow-lg" />
                    <div>
                      <p className="text-primary font-semibold">Primary Color</p>
                      <p className="text-xs text-muted-foreground">This should match the {colorTheme} theme</p>
                    </div>
                    <Button size="sm">Primary Button</Button>
                  </div>
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Label className="text-sm font-semibold">All Theme Colors</Label>
                  <HelpTooltip content="Click any color to switch to that theme. The selected theme will have a checkmark." />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setColorTheme(t.value)}
                      className={cn(
                        "relative p-4 rounded-lg border-2 transition-all overflow-hidden",
                        colorTheme === t.value 
                          ? "border-primary shadow-lg scale-105" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {colorTheme === t.value && (
                        <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary z-10" />
                      )}
                      <div 
                        className="w-full h-12 rounded-md mb-2 shadow-inner"
                        style={{ backgroundColor: t.color }}
                      />
                      <p className="text-sm font-medium">{t.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* CSS Variables */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Label className="text-sm font-semibold">Active CSS Variables</Label>
                  <HelpTooltip content="These CSS variables control the colors throughout the app. They change based on theme and dark/light mode." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {Object.entries(cssVariables).map(([name, value]) => (
                    <div key={name} className="flex items-center gap-2 p-2 bg-muted rounded text-xs font-mono">
                      <div 
                        className="w-6 h-6 rounded border shadow-inner flex-shrink-0"
                        style={{ backgroundColor: value.includes('oklch') ? value : undefined }}
                      />
                      <span className="text-muted-foreground">{name}:</span>
                      <span className="truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Body Classes</Label>
                  <p className="font-mono text-xs mt-1 p-2 bg-muted rounded break-all">
                    {bodyClasses || '(none)'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">HTML Classes</Label>
                  <p className="font-mono text-xs mt-1 p-2 bg-muted rounded break-all">
                    {htmlClasses || '(none)'}
                  </p>
                </div>
              </div>
            </CardContent>
        </Card>
      )}

      {/* 3. Component Health Check */}
      {(selectedSection === 'all' || selectedSection === 'components') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">3.</span>
              <Package className="h-5 w-5" />
              Component Health Check
              <HelpTooltip content="Interactive component showcase. Test how components look with the current theme." />
            </CardTitle>
            <CardDescription>Interactive component testing</CardDescription>
          </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Button Variants</Label>
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* Form Elements */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Form Elements</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Input with focus ring</Label>
                    <Input placeholder="Focus me to see primary ring" />
                  </div>
                  <div className="space-y-2">
                    <Label>Switch component</Label>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm text-muted-foreground">Toggle me</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Status Indicators</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Success</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span>Warning</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Error</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Tab Component</Label>
                <Tabs defaultValue="tab1" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1" className="mt-4">
                    <p className="text-sm text-muted-foreground">Active tab uses primary color</p>
                  </TabsContent>
                  <TabsContent value="tab2" className="mt-4">
                    <p className="text-sm text-muted-foreground">Tab content 2</p>
                  </TabsContent>
                  <TabsContent value="tab3" className="mt-4">
                    <p className="text-sm text-muted-foreground">Tab content 3</p>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
        </Card>
      )}

      {/* 4. Theme Showcase */}
      {(selectedSection === 'all' || selectedSection === 'showcase') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">4.</span>
              <Palette className="h-5 w-5" />
              Theme Showcase
              <HelpTooltip content="Comprehensive showcase of all components with current theme colors applied. See how your chosen theme affects every component." />
            </CardTitle>
            <CardDescription>See how all components look with the current theme</CardDescription>
          </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Theme Display */}
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-lg">
                  Current theme: <span className="font-semibold text-primary">{colorTheme}</span> 
                  {' '}in <span className="font-semibold">{theme}</span> mode
                </p>
              </div>

              {/* Buttons Section */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Buttons</Label>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-4 flex-wrap">
                      <Button>Primary Button</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link Button</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Small</Button>
                      <Button>Default</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Input Section */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Form Inputs</Label>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Default Input (focus to see primary ring)</Label>
                        <Input placeholder="Type something..." />
                      </div>
                      <div className="space-y-2">
                        <Label variant="primary">Primary Input</Label>
                        <Input variant="primary" placeholder="Primary bordered input..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Select (focus and select to see primary colors)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs Section */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Tabs</Label>
                <Card>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="tab1">
                      <TabsList>
                        <TabsTrigger value="tab1">Default Style</TabsTrigger>
                        <TabsTrigger value="tab2">Tab Two</TabsTrigger>
                        <TabsTrigger value="tab3">Tab Three</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          The active tab uses primary background and foreground colors.
                        </p>
                      </TabsContent>
                      <TabsContent value="tab2" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          Hover over tabs to see the primary color hover state.
                        </p>
                      </TabsContent>
                      <TabsContent value="tab3" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          Focus states also use the primary color ring.
                        </p>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6">
                      <Tabs defaultValue="tab1" className="w-full">
                        <TabsList variant="subtle" className="grid w-full grid-cols-3">
                          <TabsTrigger variant="subtle" value="tab1">Subtle Style</TabsTrigger>
                          <TabsTrigger variant="subtle" value="tab2">Tab Two</TabsTrigger>
                          <TabsTrigger variant="subtle" value="tab3">Tab Three</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card Variants */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Card Variants</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Default Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Standard card styling</p>
                    </CardContent>
                  </Card>
                  
                  <Card variant="primary">
                    <CardHeader>
                      <CardTitle>Primary Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Primary border variant</p>
                    </CardContent>
                  </Card>
                  
                  <Card variant="primaryGradient">
                    <CardHeader>
                      <CardTitle>Primary Gradient</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Subtle gradient background</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Table Section */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Table</Label>
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead data-sortable="true">Name</TableHead>
                          <TableHead data-sortable="true" data-state="active">Status</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Default Row</TableCell>
                          <TableCell>Active</TableCell>
                          <TableCell>100</TableCell>
                        </TableRow>
                        <TableRow data-state="selected">
                          <TableCell>Selected Row</TableCell>
                          <TableCell>Selected</TableCell>
                          <TableCell>200</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Another Row</TableCell>
                          <TableCell>Inactive</TableCell>
                          <TableCell>150</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Other Components */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Other Components</Label>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge>Default Badge</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="theme-switch" defaultChecked />
                      <Label htmlFor="theme-switch">Switch uses primary when checked</Label>
                    </div>
                    
                    <div className="text-sm space-y-2">
                      <p>Links also use primary color: <a href="#" className="text-primary hover:underline">This is a link</a></p>
                      <p>Active navigation items would appear in <span className="text-primary font-semibold">primary color</span></p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
        </Card>
      )}

      {/* 5. Component Usage Map */}
      {(selectedSection === 'all' || selectedSection === 'usage') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">5.</span>
              <Map className="h-5 w-5" />
              Component Usage Map
              <HelpTooltip content="Shows where each UI component is used throughout the application." />
            </CardTitle>
            <CardDescription>Where components are used in the app</CardDescription>
          </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Used In</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Variants</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {componentUsage.map((item) => (
                      <TableRow key={item.component}>
                        <TableCell>
                          <button
                            onClick={() => setSelectedComponent(item.component)}
                            className="font-mono font-semibold text-primary hover:underline cursor-pointer"
                          >
                            {item.component}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.usage.map((page, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={() => setSelectedUsage({ component: item.component, page })}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setSelectedUsage({ component: item.component, page })}
                              >
                                {page}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.variants}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
        </Card>
      )}

      {/* 6. State Management */}
      {(selectedSection === 'all' || selectedSection === 'state') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">6.</span>
              <Database className="h-5 w-5" />
              State Management
              <HelpTooltip content="View and manage application state and localStorage. Be careful when clearing data!" />
            </CardTitle>
            <CardDescription>Application state and storage</CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              {/* Context State */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">App Context</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Mounted</Label>
                    <Badge variant={appContext.mounted ? 'default' : 'secondary'}>
                      {appContext.mounted ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Loading</Label>
                    <Badge variant={appContext.isLoading ? 'destructive' : 'default'}>
                      {appContext.isLoading ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Notifications</Label>
                    <p className="font-mono text-sm mt-1">{appContext.notifications.length}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Preferences</Label>
                    <p className="font-mono text-sm mt-1">{Object.keys(appContext.preferences).length}</p>
                  </div>
                </div>
              </div>

              {/* LocalStorage */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold">LocalStorage Contents</Label>
                    <HelpTooltip content="Shows all data stored in browser localStorage. This persists between sessions." />
                  </div>
                  <Button onClick={clearLocalStorage} variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {Object.entries(localStorage).length > 0 ? (
                    Object.entries(localStorage).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2 p-2 bg-muted rounded text-xs font-mono">
                        <span className="text-muted-foreground font-semibold">{key}:</span>
                        <span className="break-all">{value.substring(0, 100)}{value.length > 100 && '...'}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No items in localStorage</p>
                  )}
                </div>
              </div>
            </CardContent>
        </Card>
      )}

      {/* 7. Quick Actions */}
      {(selectedSection === 'all' || selectedSection === 'actions') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">7.</span>
              <Zap className="h-5 w-5" />
              Quick Actions
              <HelpTooltip content="Test various application features. Each action is explained below." />
            </CardTitle>
            <CardDescription>Test various application features</CardDescription>
          </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Test Notifications</p>
                      <p className="text-xs text-muted-foreground">Shows 4 notification types in sequence (top-right corner)</p>
                    </div>
                  </div>
                  <Button onClick={testNotifications} variant="outline" className="w-full">
                    Try It
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Demo Loading State</p>
                      <p className="text-xs text-muted-foreground">Shows loading overlay for 3 seconds (press ESC to close)</p>
                    </div>
                  </div>
                  <Button onClick={demoLoadingState} variant="outline" className="w-full">
                    Try It
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Reload Page</p>
                      <p className="text-xs text-muted-foreground">Refreshes the browser (same as F5)</p>
                    </div>
                  </div>
                  <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                    Reload
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Toggle Debug Mode</p>
                      <p className="text-xs text-muted-foreground">Adds &apos;debug-mode&apos; class to body for CSS testing</p>
                    </div>
                  </div>
                  <Button onClick={toggleDebugMode} variant="outline" className="w-full">
                    Toggle
                  </Button>
                </div>
              </div>
            </CardContent>
        </Card>
      )}

      {/* 8. Keyboard Shortcuts */}
      {(selectedSection === 'all' || selectedSection === 'shortcuts') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">8.</span>
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
              <HelpTooltip content="Available keyboard shortcuts throughout the application." />
            </CardTitle>
            <CardDescription>Quick keyboard commands</CardDescription>
          </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.keys} className="flex items-center justify-between p-2 bg-muted rounded">
                    <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">
                      {shortcut.keys}
                    </kbd>
                    <span className="text-sm text-muted-foreground">{shortcut.action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
        </Card>
      )}

      {/* Footer Help */}
      <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <span>
          {selectedSection === 'all' 
            ? 'Viewing all sections. Click any badge above to view a specific section.'
            : `Viewing ${selectedSection} section only. Click "View All" to see everything.`}
        </span>
      </div>

      {/* Component Preview Dialog */}
      <Dialog open={!!selectedComponent} onOpenChange={(open) => !open && setSelectedComponent(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {selectedComponent} Component
            </DialogTitle>
            <DialogDescription>
              Live preview and information about the {selectedComponent} component
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {selectedComponent === 'Card' && (
              <>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Container component with header and content sections. Supports multiple variants for different visual styles.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Variants</Label>
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Default Card</CardTitle>
                        <CardDescription>Standard card styling</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>This is the default card variant.</p>
                      </CardContent>
                    </Card>
                    <Card variant="primary">
                      <CardHeader>
                        <CardTitle>Primary Card</CardTitle>
                        <CardDescription>With primary color border</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>This card has a primary color border.</p>
                      </CardContent>
                    </Card>
                    <Card variant="primaryGradient">
                      <CardHeader>
                        <CardTitle>Primary Gradient Card</CardTitle>
                        <CardDescription>With subtle gradient background</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>This card has a subtle gradient background.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {selectedComponent === 'Button' && (
              <>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Interactive button with multiple variants and sizes. Primary buttons use the theme color.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Variants</Label>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Sizes</Label>
                      <div className="flex gap-2 items-center">
                        <Button size="sm">Small</Button>
                        <Button>Default</Button>
                        <Button size="lg">Large</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedComponent === 'Table' && (
              <>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Data display in rows and columns with sorting and selection states.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Example</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead data-sortable="true">Name</TableHead>
                        <TableHead data-sortable="true" data-state="active">Status</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Default Row</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>100</TableCell>
                      </TableRow>
                      <TableRow data-state="selected">
                        <TableCell>Selected Row</TableCell>
                        <TableCell>Selected</TableCell>
                        <TableCell>200</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {selectedComponent === 'Badge' && (
              <>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Small labeled indicators for status, tags, or categories.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Variants</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>
              </>
            )}

            {selectedComponent === 'Input' && (
              <>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Text input fields with focus states that use the primary theme color.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Variants</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Input</Label>
                      <Input placeholder="Focus to see primary ring..." />
                    </div>
                    <div className="space-y-2">
                      <Label variant="primary">Primary Input</Label>
                      <Input variant="primary" placeholder="Primary bordered input..." />
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedComponent === 'Switch' && (
              <>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between two states. Uses primary color when checked.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Example</Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="switch-1" />
                      <Label htmlFor="switch-1">Default switch</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="switch-2" defaultChecked />
                      <Label htmlFor="switch-2">Checked switch (primary color)</Label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedComponent === 'Tabs' && (
              <>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Tabbed interface for content organization. Active tabs use primary colors.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Variants</Label>
                  <div className="space-y-4">
                    <Tabs defaultValue="tab1">
                      <TabsList>
                        <TabsTrigger value="tab1">Default Style</TabsTrigger>
                        <TabsTrigger value="tab2">Tab Two</TabsTrigger>
                        <TabsTrigger value="tab3">Tab Three</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="mt-4">
                        <p className="text-sm text-muted-foreground">Default tab styling</p>
                      </TabsContent>
                    </Tabs>
                    <Tabs defaultValue="tab1">
                      <TabsList variant="subtle">
                        <TabsTrigger variant="subtle" value="tab1">Subtle Style</TabsTrigger>
                        <TabsTrigger variant="subtle" value="tab2">Tab Two</TabsTrigger>
                        <TabsTrigger variant="subtle" value="tab3">Tab Three</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </>
            )}

            {selectedComponent === 'Toast' && (
              <>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporary notification messages that appear in the top-right corner.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Types</Label>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.success('Success message example')}
                      className="w-full justify-start"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      Success Toast
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toast.error('Error message example')}
                      className="w-full justify-start"
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      Error Toast
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info('Information message example')}
                      className="w-full justify-start"
                    >
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      Info Toast
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toast.warning('Warning message example')}
                      className="w-full justify-start"
                    >
                      <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                      Warning Toast
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Implementation Preview Dialog */}
      <Dialog open={!!selectedUsage} onOpenChange={(open) => !open && setSelectedUsage(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {selectedUsage?.component} Implementation - {selectedUsage?.page}
            </DialogTitle>
            <DialogDescription>
              Actual implementation from {selectedUsage?.page}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUsage && implementationExamples[selectedUsage.component]?.[selectedUsage.page] && (
            <div className="space-y-6 mt-4">
              {/* Description */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Context</Label>
                <p className="text-sm text-muted-foreground">
                  {implementationExamples[selectedUsage.component][selectedUsage.page].description}
                </p>
              </div>

              {/* Live Preview */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Live Preview</Label>
                <div className="p-4 border rounded-lg bg-card">
                  {implementationExamples[selectedUsage.component][selectedUsage.page].preview}
                </div>
              </div>

              {/* Implementation Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">Implementation Code</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(implementationExamples[selectedUsage.component][selectedUsage.page].code)
                      toast.success('Code copied to clipboard')
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Code
                  </Button>
                </div>
                <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
                  <code className="text-xs">{implementationExamples[selectedUsage.component][selectedUsage.page].code}</code>
                </pre>
              </div>

              {/* Exportable Component */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-sm font-semibold">Standalone Component</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete component with all imports and theming for external tools
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const code = generateExportableCode(selectedUsage.component, selectedUsage.page)
                      navigator.clipboard.writeText(code)
                      toast.success('Standalone component copied to clipboard')
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy as Standalone
                  </Button>
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Click to view standalone component code
                  </summary>
                  <pre className="mt-2 p-4 rounded-lg bg-muted overflow-x-auto">
                    <code className="text-xs">{generateExportableCode(selectedUsage.component, selectedUsage.page)}</code>
                  </pre>
                </details>
              </div>

              {/* Usage Tips */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> The standalone component is self-contained with all necessary imports and theme configuration. 
                  Theme colors are applied through CSS variables and will match your current selection.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}