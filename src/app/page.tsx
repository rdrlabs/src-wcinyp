import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TYPOGRAPHY } from "@/constants/typography";
import { LAYOUT_SPACING } from "@/constants/spacing";
import { cn } from "@/lib/utils";
import { 
  Brain, FileText, Bell, Users, Lightbulb,
  Box, CalendarSync, Magnet, MessageCircleQuestion, Wind, Volume2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const features: Array<{
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
  }> = [
    {
      title: "Knowledge Base",
      description: "Technical documentation, user guides, and best practices for staff reference and training materials",
      href: "/knowledge",
      icon: Brain,
    },
    {
      title: "Document Hub",
      description: "Centralized repository for patient forms, medical documents, and administrative paperwork with version control",
      href: "/documents",
      icon: FileText,
    },
    {
      title: "Updates",
      description: "Latest news, operational updates, departmental communications, and important announcements from leadership",
      href: "/updates",
      icon: Bell,
    },
    {
      title: "Directory",
      description: "Complete contact database for internal staff, external partners, facilities, vendors, and referring providers",
      href: "/directory",
      icon: Users,
    },
  ];

  const ideaSections = [
    {
      icon: Box,
      title: "MRI 3D Visualization Suite",
      description: "Interactive 3D models to scale with adjustable patient height, table sliding animations, and common positioning references, for different scanner models",
      isPlaceholder: false
    },
    {
      icon: CalendarSync,
      title: "Centralized SPC Schedule",
      description: "View the full Schedulefly schedule natively! Future potential: vCard sync to your phone calendar",
      isPlaceholder: false
    },
    {
      icon: Magnet,
      title: "Playing with Magnets",
      description: "Virtual MRI room where you can test what happens when you 'accidentally' bring in that neodymium magnet you ordered on TikTok Shop",
      isPlaceholder: true
    },
    {
      icon: MessageCircleQuestion,
      title: "Hm, let me run this one by...",
      description: <span>Rather than ask the same questions, redirect your queries to <em>Cornellius</em>, an AI chatbot that forces you to find the answer in the knowledge base</span>,
      isPlaceholder: true
    },
    {
      icon: Wind,
      title: "Scan Breathhold Simulator",
      description: "Oh so you think it's easy? BREATHE IN. BREATHE OUT. Don't breathe again.",
      isPlaceholder: true
    },
    {
      icon: Volume2,
      title: "MRI Sound Remix",
      description: "Turn those gradient noises into sick beats, make a new playlist for the lobby!",
      isPlaceholder: true
    }
  ];

  return (
    <>
      <div className={LAYOUT_SPACING.pageContainer}>
        <div className="mb-8">
          <h1 className="text-4xl font-semibold">WCINYP Dashboard</h1>
          <p className={cn("text-xl text-muted-foreground", "mt-2")}>
            Weill Cornell Imaging at NewYork-Presbyterian
          </p>
        </div>
        
        <div className={cn("grid md:grid-cols-2", LAYOUT_SPACING.cardGap)}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href} className="no-underline">
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:bg-accent/5 border-border-strong">
                  <CardHeader className={LAYOUT_SPACING.cardPadding}>
                    <div className="flex items-start gap-4">
                      <Icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" strokeWidth={1.5} />
                      <div className="flex-1">
                        <CardTitle className={TYPOGRAPHY.cardTitle}>{feature.title}</CardTitle>
                        <CardDescription className={cn(TYPOGRAPHY.cardDescription, "leading-relaxed mt-2")}>
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Ideas Section */}
      <div className="bg-muted-lighter border-t border-border-strong mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Lightbulb className="h-10 w-10 text-primary" strokeWidth={1.5} />
            <h2 className="text-3xl font-semibold">Ideas</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Experimental features and innovative tools <em>where imaging meets imagination</em>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideaSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card 
                key={index} 
                className={cn(
                  "relative transition-all duration-200 hover:shadow-lg",
                  section.isPlaceholder ? "opacity-75 bg-muted-lighter/50" : "hover:bg-accent/5"
                )}
              >
                <CardHeader className="text-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "p-3 rounded-lg mb-4",
                      section.isPlaceholder ? "bg-muted" : "bg-primary/10"
                    )}>
                      <Icon className={cn(
                        "h-8 w-8",
                        section.isPlaceholder ? "text-muted-foreground" : "text-primary"
                      )} strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-lg mb-2">{section.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                    {section.isPlaceholder && (
                      <div className="mt-4">
                        <Badge variant="secondary" className="text-xs bg-muted-foreground text-background">
                          Placeholder
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}