'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/theme-selector";
import { LAYOUT_SPACING } from "@/constants/spacing";
import { Button } from "@/components/ui/button";
import { User, Search, Command, AlertCircle, LogOut, Sparkles, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { MobileNav } from "@/components/mobile-nav";
import { useSearchContext } from "@/contexts/search-context";
import { BrandName } from "@/components/brand-name";
import { useAuth } from "@/contexts/auth-context";
import { useDemo } from "@/contexts/demo-context";
import { checkIsAdmin } from "@/lib/auth-validation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedNavMenu } from "@/components/animated-nav-menu";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NavBar() {
  const _pathname = usePathname();
  const [isMac, setIsMac] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { openCommandMenu } = useSearchContext();
  const { user, signOut, loading: authLoading } = useAuth();
  const { isDemoMode, exitDemoMode } = useDemo();
  
  // Hover states for tooltips
  const [loginHover, setLoginHover] = useState(false);
  const [loginTimeout, setLoginTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Check if user is admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (user && user.email && !isDemoMode) {
        const adminStatus = await checkIsAdmin(user.email, user.id);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    }
    checkAdminStatus();
  }, [user, isDemoMode]);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-0 z-50 dark:shadow-none">
      <div className={cn("container mx-auto", LAYOUT_SPACING.navPadding)}>
        <div className="flex h-12 items-center justify-between">
          <div className={cn("flex items-center", LAYOUT_SPACING.navItemGap)}>
            <MobileNav />
            
            {/* Demo mode indicator on the left */}
            {!authLoading && isDemoMode && (
              <TooltipProvider delayDuration={0}>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hidden md:flex items-center font-normal border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
                        >
                          <span className="text-sm font-medium text-primary">Demo</span>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="hidden lg:block">
                      <p>Demo Mode Active</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent 
                    align="start" 
                    className="w-80 p-4"
                  >
                    <div className="space-y-4">
                      {/* Header with icon */}
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">Demo Mode Active</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            You&apos;re exploring with sample data. Perfect for testing features safely.
                          </p>
                        </div>
                      </div>
                      
                      {/* Info section */}
                      <div className="rounded-lg bg-muted p-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">What you can do:</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                          <li>• Browse all features and pages</li>
                          <li>• View sample medical data</li>
                          <li>• Test form submissions</li>
                          <li>• Explore without consequences</li>
                        </ul>
                      </div>
                      
                      {/* Exit button */}
                      <Button
                        onClick={exitDemoMode}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="sm"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Exit Demo Mode
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            )}
            
            <Link 
              href="/" 
              className="text-2xl font-semibold hover:text-primary transition-colors -ml-1 mr-6"
              aria-label="WCI@NYP Home"
            >
              <BrandName />
            </Link>
            
            <AnimatedNavMenu />
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
            
            {!authLoading && !isDemoMode && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 font-normal hidden md:flex"
                    >
                      <User className="h-4 w-4" />
                      {user.email?.split('@')[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings/sessions" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Manage Sessions</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/access-requests" className="cursor-pointer">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            <span>Access Requests</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
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
                        <AlertCircle className="h-4 w-4 text-accent-foreground" />
                        <p className="text-sm text-muted-foreground">Sign-in process in development</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
            
            <ThemeSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}