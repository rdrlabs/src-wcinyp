'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Settings, HelpCircle, Lightbulb } from "lucide-react";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/lib/utils";

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
    <div className="container mx-auto py-8">
      <Card className="border rounded-lg bg-muted/10">
        <CardHeader className="text-center pb-12">
          <h1 className={TYPOGRAPHY.pageTitle}>Knowledge Base</h1>
          <p className={cn(TYPOGRAPHY.pageDescription, "mt-2")}>
            Comprehensive documentation and guides for using the imaging center portal
          </p>
        </CardHeader>
        
        <CardContent>
          <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-center mb-8")}>Coming Soon</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {comingSoonFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 border rounded-lg bg-background hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                </div>
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
        </CardContent>
      </Card>
    </div>
  );
}