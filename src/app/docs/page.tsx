'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DocsHomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">WCINYP Wiki</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Welcome to the Weill Cornell Imaging at NewYork-Presbyterian work wiki
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn the basics of WCINYP</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/getting-started/introduction" className="text-primary hover:underline">
                  Introduction to WCINYP
                </Link>
              </li>
              <li>
                <Link href="/docs/getting-started/quickstart" className="text-primary hover:underline">
                  Quick Start Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/getting-started/requirements" className="text-primary hover:underline">
                  System Requirements
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Explore WCINYP features</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/features/documents" className="text-primary hover:underline">
                  Document Management
                </Link>
              </li>
              <li>
                <Link href="/docs/features/forms" className="text-primary hover:underline">
                  Form Builder
                </Link>
              </li>
              <li>
                <Link href="/docs/features/providers" className="text-primary hover:underline">
                  Provider Directory
                </Link>
              </li>
              <li>
                <Link href="/docs/features/contacts" className="text-primary hover:underline">
                  Contact Directory
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}