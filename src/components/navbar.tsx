'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/theme-selector";
import { mainNavItems } from "@/config/navigation";
import { TYPOGRAPHY } from "@/constants/typography";
import { LAYOUT_SPACING } from "@/constants/spacing";

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className={cn("container mx-auto", LAYOUT_SPACING.navPadding)}>
        <div className="flex h-16 items-center justify-between">
          <div className={cn("flex items-center", LAYOUT_SPACING.navItemGap)}>
            <Link href="/" className="text-lg font-semibold hover:text-primary transition-colors">
              WCI@NYP
            </Link>
            <div className={cn("hidden md:flex", LAYOUT_SPACING.navItemGap)}>
              {mainNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={cn(
                      "transition-colors",
                      isActive 
                        ? cn(TYPOGRAPHY.navLinkActive, "text-primary")
                        : cn(TYPOGRAPHY.navLink, "text-muted-foreground hover:text-foreground")
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <ThemeSelector />
        </div>
      </div>
    </nav>
  );
}