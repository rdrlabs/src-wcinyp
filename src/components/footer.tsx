'use client';

import Link from "next/link";
import { ExternalLink, MapPin, Mail } from "lucide-react";
import { mainNavItems, footerLinks } from "@/config/navigation";
import { TYPOGRAPHY } from "@/constants/typography";
import { GAP } from "@/constants/spacing";
import { cn } from "@/lib/utils";
import { BrandName } from "@/components/brand-name";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-muted-lighter to-muted border-t border-border-strong shadow-inner">
      <div className={cn("container mx-auto px-4 py-12")}>
        <div className={cn("grid grid-cols-1 md:grid-cols-2", GAP[4])}>
          {/* Quick Links */}
          <div>
            <h3 className={cn(TYPOGRAPHY.sectionTitle, "mb-4")}>Navigation</h3>
            <ul className={cn("space-y-2", TYPOGRAPHY.labelText)}>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={cn("flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors")}>
                      <Icon className="h-4 w-4" />
                      {item.label === 'Documents' ? 'Documents & Forms' : item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={cn(TYPOGRAPHY.sectionTitle, "mb-4")}>Resources</h3>
            <ul className={cn("space-y-2", TYPOGRAPHY.labelText)}>
              {footerLinks.resources
                .filter(link => link.label !== 'Privacy Policy' && link.label !== 'Patient Portal')
                .map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={cn("flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors")}
                    >
                      {link.label}
                      {link.external && <ExternalLink className="h-4 w-4" />}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className={cn("mt-8 pt-8 border-t border-border-strong text-center", TYPOGRAPHY.labelText, "text-muted-foreground")}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="hover:text-primary/80 transition-colors cursor-help">
                <BrandName /> is a project currently in development by @Ray for use as a centralized tool for SPCs and other admin staff
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Ray</p>
                  <p className="text-xs text-muted-foreground">Senior Patient Coordinator</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>
                      <Link href="/locations/61st" className="hover:underline text-primary">61st</Link>
                      <span className="text-muted-foreground"> & </span>
                      <Link href="/locations/spiral" className="hover:underline text-primary">Spiral</Link>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <a href="mailto:rco4001@med.cornell.edu" className="hover:underline text-primary">
                      rco4001@med.cornell.edu
                    </a>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </footer>
  );
}