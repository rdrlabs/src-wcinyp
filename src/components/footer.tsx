'use client';

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { mainNavItems, footerLinks } from "@/config/navigation";
import { TYPOGRAPHY } from "@/constants/typography";
import { GAP } from "@/constants/spacing";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className={cn("container mx-auto px-4 py-12")}>
        <div className={cn("grid grid-cols-1 md:grid-cols-2", GAP[4])}>
          {/* Quick Links */}
          <div>
            <h3 className={cn(TYPOGRAPHY.sectionTitle, "mb-4")}>Quick Links</h3>
            <ul className={cn("space-y-2", TYPOGRAPHY.labelText)}>
              {mainNavItems.map((item) => {
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={cn("text-muted-foreground hover:text-primary transition-colors")}>
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

        <div className={cn("mt-8 pt-8 border-t text-center", TYPOGRAPHY.labelText, "text-muted-foreground")}>
          <p>
            WCI@NYP is a collaboration between{" "}
            <a href="https://weillcornell.org" className="hover:text-primary transition-colors">
              Weill Cornell Medicine
            </a>
            {" and "}
            <a href="https://nyp.org" className="hover:text-primary transition-colors">
              NewYork-Presbyterian Hospital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}