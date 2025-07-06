'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Settings, HelpCircle, Lightbulb } from "lucide-react";

export default function KnowledgePage() {
  const comingSoonFeatures = [
    {
      icon: BookOpen,
      title: "Getting Started Guide",
      description: "Learn the basics of using the imaging center portal"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Comprehensive guides for all features and workflows"
    },
    {
      icon: Users,
      title: "Provider Resources",
      description: "Information for referring providers and staff"
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Admin guides and configuration documentation"
    },
    {
      icon: HelpCircle,
      title: "FAQ & Troubleshooting",
      description: "Common questions and solutions"
    },
    {
      icon: Lightbulb,
      title: "Best Practices",
      description: "Tips and recommendations for optimal usage"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Knowledge Base</h1>
        <p className="text-xl text-muted-foreground mb-2">
          Coming Soon
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our comprehensive documentation and guides are being prepared. 
          Check back soon for detailed information about using the imaging center portal.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {comingSoonFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-muted/20 rounded-full -mr-16 -mt-16" />
              <CardHeader>
                <Icon className="h-8 w-8 mb-2 text-muted-foreground" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground">
          Need immediate assistance? Contact the IT Help Desk at{" "}
          <a href="mailto:imaging@med.cornell.edu" className="text-primary hover:underline">
            imaging@med.cornell.edu
          </a>
        </p>
      </div>
    </div>
  );
}