'use client';

import { Book, FileText, Users, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function KnowledgePage() {
  const sections = [
    {
      title: "Documentation",
      description: "Browse the full WCINYP documentation",
      icon: Book,
      href: "/knowledge/docs",
      available: true
    },
    {
      title: "Getting Started",
      description: "Quick start guides and system requirements",
      icon: Book,
      href: "/knowledge/getting-started",
      available: false
    },
    {
      title: "Features",
      description: "Learn about all the features in WCINYP",
      icon: FileText,
      href: "/knowledge/features",
      available: false
    },
    {
      title: "User Guides",
      description: "Step-by-step guides for common tasks",
      icon: Users,
      href: "/knowledge/guides",
      available: false
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      icon: Wrench,
      href: "/knowledge/api",
      available: false
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Find documentation, guides, and resources for using WCINYP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card 
              key={section.href} 
              className={section.available ? "hover:shadow-lg transition-shadow cursor-pointer" : "opacity-60"}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {section.available ? (
                  <Link 
                    href={section.href}
                    className="text-primary hover:underline"
                  >
                    Browse {section.title} →
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Coming soon</span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          The knowledge base is being actively developed. Check back soon for comprehensive documentation.
        </p>
      </div>
    </div>
  );
}