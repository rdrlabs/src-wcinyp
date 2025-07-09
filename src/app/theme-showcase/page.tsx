'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppTheme } from "@/contexts/app-context"

export default function ThemeShowcasePage() {
  const { colorTheme } = useAppTheme()
  
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Theme Showcase</h1>
        <p className="text-lg text-muted-foreground">
          Current theme: <span className="text-primary font-semibold">{colorTheme}</span>
        </p>
      </div>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Primary color is prominently featured in default buttons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Form Inputs</CardTitle>
          <CardDescription>Focus states and primary variants use the theme color</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Input (focus to see primary ring)</Label>
            <Input placeholder="Type something..." />
          </div>
          <div className="space-y-2">
            <Label variant="primary">Primary Input</Label>
            <Input variant="primary" placeholder="Primary bordered input..." />
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

      {/* Tabs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Active tabs use primary colors</CardDescription>
        </CardHeader>
        <CardContent>
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

      {/* Card Variants */}
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

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
          <CardDescription>Selected rows and sortable headers use primary colors</CardDescription>
        </CardHeader>
        <CardContent>
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

      {/* Other Components */}
      <Card>
        <CardHeader>
          <CardTitle>Other Components</CardTitle>
          <CardDescription>Various components featuring primary colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
  )
}