'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/theme-selector";
import { mainNavItems } from "@/config/navigation";
import { TYPOGRAPHY } from "@/constants/typography";
import { LAYOUT_SPACING } from "@/constants/spacing";
import { Button } from "@/components/ui/button";
import { User, Search, Command, Bug, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { MobileNav } from "@/components/mobile-nav";
import { useSearchContext } from "@/contexts/search-context";
import { BrandName } from "@/components/brand-name";

export function NavBar() {
  const pathname = usePathname();
  const [isMac, setIsMac] = useState(false);
  const { openCommandMenu } = useSearchContext();
  
  // Hover states for tooltips
  const [loginHover, setLoginHover] = useState(false);
  const [bugHover, setBugHover] = useState(false);
  const [loginTimeout, setLoginTimeout] = useState<NodeJS.Timeout | null>(null);
  const [bugTimeout, setBugTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <nav className="border-b border-border-strong bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-0 z-50 bg-gradient-to-b from-background to-muted-lighter">
      <div className={cn("container mx-auto", LAYOUT_SPACING.navPadding)}>
        <div className="flex h-12 items-center justify-between">
          <div className={cn("flex items-center", LAYOUT_SPACING.navItemGap)}>
            <MobileNav />
            
            <Link href="/" className="text-2xl font-semibold hover:text-primary transition-colors -ml-1">
              <BrandName />
            </Link>
            
            <div className={cn("hidden md:flex", LAYOUT_SPACING.navItemGap)}>
              {mainNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      isActive 
                        ? cn(TYPOGRAPHY.navLinkActive, "text-primary")
                        : cn(TYPOGRAPHY.navLink, "text-muted-foreground hover:text-foreground")
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={openCommandMenu}
              className="relative hidden sm:block hover:opacity-80 transition-opacity"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] md:w-[250px] pl-9 pr-10 cursor-pointer hover:border-primary/50 transition-colors"
                readOnly
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium opacity-100">
                {isMac ? (
                  <span className="flex items-center gap-0.5">
                    <Command className="h-2.5 w-2.5" />K
                  </span>
                ) : (
                  'Ctrl+K'
                )}
              </kbd>
            </button>
            
            <div 
              className="relative hidden md:block"
              onMouseEnter={() => {
                if (loginTimeout) clearTimeout(loginTimeout);
                setLoginHover(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setLoginHover(false), 100);
                setLoginTimeout(timeout);
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-normal"
                asChild
              >
                <Link href="/login">
                  <User className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              
              {loginHover && (
                <div 
                  className="absolute right-0 top-full mt-1 whitespace-nowrap rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-lg z-50"
                  onMouseEnter={() => {
                    if (loginTimeout) clearTimeout(loginTimeout);
                    setLoginHover(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => setLoginHover(false), 100);
                    setLoginTimeout(timeout);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">Sign-in process in development</p>
                  </div>
                </div>
              )}
            </div>
            
            <ThemeSelector />
            
            {process.env.NODE_ENV === 'development' && (
              <div 
                className="relative"
                onMouseEnter={() => {
                  if (bugTimeout) clearTimeout(bugTimeout);
                  setBugHover(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setBugHover(false), 100);
                  setBugTimeout(timeout);
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    pathname === '/diagnostics' && "animate-pulse"
                  )}
                  asChild
                >
                  <Link href="/diagnostics">
                    <Bug className={cn(
                      "h-4 w-4",
                      pathname === '/diagnostics' 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )} />
                  </Link>
                </Button>
                
                {bugHover && (
                  <div 
                    className="absolute right-0 top-full mt-1 whitespace-nowrap rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-lg z-50"
                    onMouseEnter={() => {
                      if (bugTimeout) clearTimeout(bugTimeout);
                      setBugHover(true);
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => setBugHover(false), 100);
                      setBugTimeout(timeout);
                    }}
                  >
                    <p className="text-sm text-muted-foreground">Activate debug tools</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}