'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, User, MessageSquare, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { mainNavItems, quickLinks } from "@/config/navigation";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);


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
                      "text-sm font-medium transition-all flex items-center gap-1.5 relative group",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:drop-shadow-[0_0_8px_hsl(var(--primary))]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    <span className={cn(
                      "absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent transition-opacity",
                      isActive 
                        ? "via-primary opacity-100" 
                        : "via-white opacity-0 group-hover:opacity-50"
                    )} />
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <Button
              variant="outline"
              className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
              onClick={() => setOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search...
              <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Quick Links Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Quick Links</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {quickLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {link.label}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Feedback Button */}
            <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Feedback</span>
            </Button>

            {/* Login Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 px-3"
              onClick={() => setIsLoggedIn(!isLoggedIn)}
            >
              {isLoggedIn ? (
                <span className="text-xs font-mono">AB12345</span>
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="sr-only">{isLoggedIn ? 'Logged in' : 'Login'}</span>
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem 
                  key={item.href}
                  onSelect={() => { 
                    window.location.href = item.href; 
                    setOpen(false); 
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </nav>
  );
}