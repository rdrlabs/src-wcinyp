'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Bug } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { mainNavItems } from "@/config/navigation";
import { ThemeSelector } from "@/components/theme-selector";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu
          </SheetDescription>
        </SheetHeader>
        <nav className="mt-6 flex flex-col space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <User className="h-4 w-4" />
              Login
            </Link>
          </Button>
          
          <div className="border-t pt-4">
            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-2 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-muted-darker text-foreground border-l-2 border-border-strong"
                        : "hover:bg-muted-lighter text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
          
          <div className="border-t pt-4">
            <div className="px-2">
              <p className="text-sm font-medium mb-2">Theme</p>
              <ThemeSelector />
            </div>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t pt-4">
              <SheetClose asChild>
                <Link
                  href="/diagnostics"
                  className={cn(
                    "flex items-center gap-3 px-2 py-3 rounded-lg transition-colors",
                    pathname === '/diagnostics'
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Bug className={cn(
                    "h-5 w-5",
                    pathname === '/diagnostics' && "animate-pulse"
                  )} />
                  <span>Debug Tools</span>
                  {pathname === '/diagnostics' && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto px-1.5 py-0 text-[10px] font-medium bg-primary/20 text-primary animate-pulse"
                    >
                      Active
                    </Badge>
                  )}
                </Link>
              </SheetClose>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}