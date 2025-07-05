'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Code, ArrowRight, BookOpen } from "lucide-react";

export default function KnowledgePage() {
  
  // Group docs by category (based on your current MDX structure)
  const gettingStarted = [
    { title: "Introduction to WCINYP", href: "/docs/getting-started/introduction", description: "Learn about WCINYP" },
    { title: "Quick Start Guide", href: "/docs/getting-started/quickstart", description: "Get up and running quickly" },
    { title: "System Requirements", href: "/docs/getting-started/requirements", description: "What you need to get started" },
  ];

  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using WCINYP",
      icon: FileText,
      articles: gettingStarted,
      featured: true
    },
    {
      title: "Document Management",
      description: "How to work with documents and forms",
      icon: FileText,
      articles: [
        { title: "Browse Documents", href: "/documents", description: "Access all documents" },
        { title: "Form Templates", href: "/documents?tab=forms", description: "View available forms" },
        { title: "Form Builder", href: "/documents?tab=builder", description: "Create custom forms" },
      ]
    },
    {
      title: "Provider & Contact Management",
      description: "Managing provider and contact information",
      icon: FileText,
      articles: [
        { title: "Provider Directory", href: "/providers", description: "View all providers" },
        { title: "Contact Directory", href: "/directory", description: "Complete contact list" },
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground mt-2">
          Documentation, guides, and resources for WCINYP
        </p>
      </div>

      {/* Full Documentation Banner */}
      <div className="mb-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Full Documentation Available</h2>
              <p className="text-sm text-muted-foreground">
                Browse our comprehensive docs with search and navigation
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/docs" className="flex items-center gap-2">
              View Full Documentation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Featured Documentation Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Documentation</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {gettingStarted.map((doc, idx) => (
            <Link key={idx} href={doc.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {doc.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links to Features */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {categories.slice(1).map((category, idx) => (
            <Card key={idx} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.articles.map((article, articleIdx) => (
                    <li key={articleIdx}>
                      <Link 
                        href={article.href}
                        className="block p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="font-medium text-sm">{article.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {article.description}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Help Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <Button size="sm" variant="outline" asChild>
              <Link href="/directory">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Coming soon: Video guides
            </p>
            <Button size="sm" variant="outline" disabled>Watch Videos</Button>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Code className="h-4 w-4" />
              API Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Developer guides coming soon
            </p>
            <Button size="sm" variant="outline" disabled>View API Docs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}