'use client';

import { Badge } from "@/components/ui/badge";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Brain } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string | React.ReactNode;
  showComingSoon?: boolean;
}

export function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  showComingSoon = false 
}: PageHeaderProps) {
  return (
    <div className="text-center pt-12 pb-6 bg-gradient-to-b from-muted-lighter to-transparent">
      {showComingSoon && (
        <div className="mb-6">
          <Icon className="h-16 w-16 mx-auto text-primary/30" strokeWidth={1.5} />
        </div>
      )}
      <h1 className={TYPOGRAPHY.pageTitle}>{title}</h1>
      {showComingSoon && (
        <div className="mt-2">
          <Badge 
            variant="secondary" 
            className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            Coming Soon
          </Badge>
        </div>
      )}
      <p className={cn(TYPOGRAPHY.pageDescription, "mt-4")}>
        {description}
      </p>
    </div>
  );
}