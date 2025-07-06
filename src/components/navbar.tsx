'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { mainNavItems } from "@/config/navigation";

export function NavBar() {
  const pathname = usePathname();


  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">
              WCI@NYP
            </Link>
            <div className="hidden md:flex space-x-6">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={cn(
                      "text-sm font-medium transition-colors flex items-center gap-1.5",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}