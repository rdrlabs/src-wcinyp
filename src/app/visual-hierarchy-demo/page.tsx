'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Search, FileText, Users, Settings, ChevronRight } from "lucide-react";

export default function VisualHierarchyDemo() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Visual Hierarchy Improvements Demo</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This page demonstrates the new grey colors (muted-lighter, muted-darker, border-strong) 
          applied to improve visual hierarchy and reduce flatness across the application.
        </p>
      </div>

      {/* Tables Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4 p-3 bg-muted-lighter rounded-md border-l-4 border-primary">
          Tables with Alternating Rows
        </h2>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Enhanced Table Design</CardTitle>
            <CardDescription>
              Tables now feature alternating row colors and improved hover states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">John Doe</TableCell>
                  <TableCell>Radiology</TableCell>
                  <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                  <TableCell><Button size="sm" variant="ghost">View</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Jane Smith</TableCell>
                  <TableCell>Cardiology</TableCell>
                  <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                  <TableCell><Button size="sm" variant="ghost">View</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bob Johnson</TableCell>
                  <TableCell>Neurology</TableCell>
                  <TableCell><Badge variant="outline">Inactive</Badge></TableCell>
                  <TableCell><Button size="sm" variant="ghost">View</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Forms Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4 p-3 bg-muted-lighter rounded-md border-l-4 border-primary">
          Forms with Section Separation
        </h2>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Enhanced Form Layout</CardTitle>
            <CardDescription>
              Form fields now have subtle backgrounds for better grouping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-6 bg-muted-lighter/30 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4 p-3 bg-background rounded-md border-l-4 border-primary">
                  Personal Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" />
                    </FormControl>
                  </FormItem>
                </div>
              </div>

              <div className="p-6 bg-muted-lighter/30 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4 p-3 bg-background rounded-md border-l-4 border-primary">
                  Contact Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter phone" />
                    </FormControl>
                  </FormItem>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Lists and Dropdowns */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4 p-3 bg-muted-lighter rounded-md border-l-4 border-primary">
          Lists with Improved Hover States
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Select Component</CardTitle>
              <CardDescription>Enhanced dropdown with better hover states</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Command Menu</CardTitle>
              <CardDescription>Search with improved visual states</CardDescription>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type to search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Documents</span>
                    </CommandItem>
                    <CommandItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Directory</span>
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cards with Depth */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4 p-3 bg-muted-lighter rounded-md border-l-4 border-primary">
          Cards with Enhanced Depth
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card with subtle gradient</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card uses the default variant with improved hover states and subtle gradients.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Card with stronger borders and depth</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card uses the elevated variant for important content that needs emphasis.
              </p>
            </CardContent>
          </Card>

          <Card variant="ghost">
            <CardHeader>
              <CardTitle>Ghost Card</CardTitle>
              <CardDescription>Minimal card for secondary content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card uses the ghost variant with subtle hover effects.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4 p-3 bg-muted-lighter rounded-md border-l-4 border-primary">
          Navigation with Visual Hierarchy
        </h2>
        <Card variant="elevated">
          <CardContent className="p-0">
            <nav className="flex flex-col">
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-muted-darker text-foreground border-l-2 border-border-strong">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Active Page</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-muted-lighter text-muted-foreground hover:text-foreground">
                <Users className="h-5 w-5" />
                <span>Hover State</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-muted-lighter text-muted-foreground hover:text-foreground">
                <Settings className="h-5 w-5" />
                <span>Normal State</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </a>
            </nav>
          </CardContent>
        </Card>
      </section>

      {/* Data Table with Search */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4 p-3 bg-muted-lighter rounded-md border-l-4 border-primary">
          Data Tables with Filters
        </h2>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted-lighter rounded-lg border border-border mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search data..."
                  className="pl-10 bg-background border-border-strong focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
            <p className="text-center text-muted-foreground py-8">
              Table data with enhanced search and filter section
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}