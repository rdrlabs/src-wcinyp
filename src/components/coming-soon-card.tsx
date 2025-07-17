'use client';

import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComingSoonSection {
  icon: LucideIcon | null;
  title: string;
  description: string;
  isPlaceholder?: boolean;
}

interface ComingSoonCardProps {
  description: string | React.ReactNode;
  sections: ComingSoonSection[];
  footer?: React.ReactNode;
  previewButton?: React.ReactNode;
}

export function ComingSoonCard({ 
  description,
  sections, 
  footer,
  previewButton
}: ComingSoonCardProps) {
  // Ensure we always have 6 cards for consistent layout
  const normalizedSections = [...sections];
  while (normalizedSections.length < 6) {
    normalizedSections.push({
      icon: null, // Placeholder
      title: '',
      description: ''
    });
  }

  return (
    <div className="container mx-auto py-8">
      <div className="border border-border rounded-lg bg-gradient-to-b from-muted to-background shadow-sm dark:from-card dark:to-card">
        <div className="px-6 py-12">
          <div className="text-center mb-8">
            <Badge 
              variant="secondary" 
              className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 mb-4"
            >
              Coming Soon
            </Badge>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
            {previewButton && (
              <div className="mt-6">
                {previewButton}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {normalizedSections.slice(0, 6).map((section, index) => {
              const Icon = section.icon;
              
              // Render empty placeholder for padding
              if (!section.title) {
                return <div key={index} className="invisible" />;
              }
              
              return (
                <div
                  key={index}
                  className={cn(
                    "p-6 border rounded-lg transition-all duration-200 relative flex flex-col",
                    section.isPlaceholder 
                      ? "bg-muted opacity-60 shadow-sm border-border" 
                      : "bg-gradient-to-b from-background to-muted/50 shadow-sm hover:shadow-md hover:border-border dark:from-card dark:to-card"
                  )}
                >
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={cn(
                      "p-3 rounded-lg mb-4",
                      section.isPlaceholder ? "bg-muted" : "bg-primary/10"
                    )}>
                      {Icon && <Icon className={cn(
                        "h-8 w-8",
                        section.isPlaceholder ? "text-muted-foreground" : "text-primary"
                      )} strokeWidth={1.5} />}
                    </div>
                    <h3 className="font-semibold mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  {section.isPlaceholder && (
                    <div className="mt-4 text-center">
                      <Badge variant="secondary" className="text-xs bg-muted-foreground text-background">
                        Placeholder
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}