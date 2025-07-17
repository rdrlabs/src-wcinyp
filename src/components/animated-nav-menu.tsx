'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { mainNavItems } from "@/config/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface AnimatedNavMenuProps {
  className?: string;
}

export function AnimatedNavMenu({ className }: AnimatedNavMenuProps) {
  const pathname = usePathname();
  const [_hoveredItem, _setHoveredItem] = React.useState<string | null>(null);

  return (
    <NavigationMenu className={cn("hidden md:flex", className)}>
      <NavigationMenuList>
        {mainNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          if (item.items) {
            return (
              <NavigationMenuItem 
                key={item.href}
                onMouseEnter={() => _setHoveredItem(item.href)}
                onMouseLeave={() => _setHoveredItem(null)}
              >
                <NavigationMenuTrigger 
                  className={cn(
                    "relative",
                    isActive && "text-primary"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-accent/50 rounded-md"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <motion.ul 
                    className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background dark:bg-card"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.items.map((subItem, index) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = pathname === subItem.href;
                      
                      return (
                        <motion.li 
                          key={subItem.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <NavigationMenuLink asChild>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "group relative flex select-none flex-col space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-200",
                                "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isSubActive && "bg-accent/50"
                              )}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-md opacity-0 group-hover:opacity-100 dark:from-primary/5 dark:to-transparent"
                                transition={{ duration: 0.2 }}
                              />
                              <div className="relative flex items-center gap-2">
                                {SubIcon && (
                                  <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                  >
                                    <SubIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors dark:text-muted-foreground dark:group-hover:text-primary" />
                                  </motion.div>
                                )}
                                <div className="text-sm font-medium leading-none">
                                  {subItem.label}
                                </div>
                              </div>
                              {subItem.description && (
                                <p className="relative line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }
          
          return (
            <NavigationMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "relative",
                    isActive && "text-primary"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-accent/50 rounded-md"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}