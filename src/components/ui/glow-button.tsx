'use client';

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";

interface GlowButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ children, className, variant = "primary", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    const variantClasses = {
      primary: [
        "bg-primary text-primary-foreground",
      ],
      secondary: [
        "bg-transparent text-foreground",
        "border border-white/10",
        "hover:bg-white/5",
        "hover:border-white/20"
      ],
      ghost: [
        "bg-transparent text-foreground",
        "hover:bg-white/5"
      ]
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          "font-medium rounded-lg",
          "transition-all duration-[var(--duration-base)]",
          "transform-gpu", // Hardware acceleration
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        style={{
          ...props.style,
          ...(variant === "primary" && {
            boxShadow: `0 0 0 1px rgba(var(--color-primary-rgb), 0.3)`,
            '--hover-shadow': `0 0 20px rgba(var(--color-primary-rgb), 0.5)`,
          } as React.CSSProperties),
        }}
        onMouseEnter={(e) => {
          if (variant === "primary") {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--hover-shadow)';
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (variant === "primary") {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px rgba(var(--color-primary-rgb), 0.3)`;
          }
          props.onMouseLeave?.(e);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
        {...props}
      >
        {/* Glow effect for primary variant */}
        {variant === "primary" && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-primary opacity-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
            style={{ filter: "blur(20px)" }}
          />
        )}
        
        {/* Button content */}
        <span className="relative z-10">{children}</span>
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
          }}
          initial={{ opacity: 0, x: "-100%" }}
          whileHover={{ opacity: 1, x: "100%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.button>
    );
  }
);

GlowButton.displayName = "GlowButton";

export { GlowButton };