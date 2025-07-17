'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

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
          
          <div className="border-t pt-4 space-y-2">
            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              
              if (item.items) {
                return (
                  <Collapsible key={item.href}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between px-2 py-3 h-auto font-normal",
                          isActive && "text-primary bg-accent/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-8 mt-1 space-y-1"
                        >
                          {item.items.map((subItem, index) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = pathname === subItem.href;
                            
                            return (
                              <motion.div
                                key={subItem.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <SheetClose asChild>
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                      isSubActive
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    {SubIcon && <SubIcon className="h-4 w-4" />}
                                    <span>{subItem.label}</span>
                                  </Link>
                                </SheetClose>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
              
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-2 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-accent text-foreground border-l-2 border-primary"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
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
        </nav>
      </SheetContent>
    </Sheet>
  );
}