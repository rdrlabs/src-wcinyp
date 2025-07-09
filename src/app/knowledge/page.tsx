'use client';

import { Brain, FileText, Users, Settings, HelpCircle, Lightbulb, Eye } from "lucide-react";
import { ComingSoonCard } from "@/components/coming-soon-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function KnowledgePage() {
  const sections = [
    {
      icon: Brain,
      title: "Getting Started Guide",
      description: "Learn the basics and become resourceful",
      isPlaceholder: false
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Comprehensive guides and access to information",
      isPlaceholder: false
    },
    {
      icon: Users,
      title: "Contact Resources",
      description: "Resources on all our contacts and communication best practices",
      isPlaceholder: false
    },
    {
      icon: HelpCircle,
      title: "FAQ & Troubleshooting",
      description: "Common questions and solutions",
      isPlaceholder: false
    },
    {
      icon: Lightbulb,
      title: "Best Practices",
      description: "Tips and recommendations, email templates and verbiage scripts",
      isPlaceholder: false
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Admin guides and configuration documentation",
      isPlaceholder: false
    }
  ];


  const previewButton = (
    <Link href="/knowledge-preview">
      <Button variant="outline" size="lg" className="gap-2 text-base px-6 py-3">
        <Eye className="h-5 w-5" />
        Preview Knowledge Base
      </Button>
    </Link>
  );

  return (
    <ComingSoonCard
      description="Comprehensive documentation and guides for using the imaging center portal"
      sections={sections}
      previewButton={previewButton}
    />
  );
}