'use client';

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = true, glow = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-white/[0.03] backdrop-blur-[var(--blur-base)]",
          "border border-white/[0.06]",
          "transition-all duration-[var(--duration-base)]",
          hover && [
            "hover:bg-white/[0.05]",
            "hover:border-white/[0.1]",
            "hover:translate-y-[-2px]"
          ],
          glow && "shadow-[var(--shadow-glow)]",
          className
        )}
        style={{
          ...props.style,
          ...(hover && {
            '--hover-shadow': `0 0 40px rgba(var(--color-primary-rgb), 0.1)`,
          } as React.CSSProperties),
        }}
        onMouseEnter={(e) => {
          if (hover) {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--hover-shadow)';
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (hover) {
            (e.currentTarget as HTMLElement).style.boxShadow = '';
          }
          props.onMouseLeave?.(e);
        }}
        whileHover={hover ? { scale: 1.02 } : undefined}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        {...props}
      >
        {/* Glass texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };