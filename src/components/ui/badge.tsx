import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        secondary:
          "border-transparent bg-muted text-secondary-foreground hover:bg-accent shadow-sm",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        outline: "text-foreground border-border hover:bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Badge component properties
 * @interface BadgeProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @extends {VariantProps<typeof badgeVariants>}
 * 
 * @property {string} [variant="default"] - Visual style variant (default | secondary | destructive | outline)
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [children] - Badge content
 * 
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 * 
 * // Secondary variant
 * <Badge variant="secondary">Beta</Badge>
 * 
 * // Destructive variant
 * <Badge variant="destructive">Urgent</Badge>
 * 
 * // Outline variant
 * <Badge variant="outline">v2.0</Badge>
 * 
 * // With custom styling
 * <Badge className="ml-2" variant="secondary">
 *   Coming Soon
 * </Badge>
 * ```
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component for displaying labels, statuses, or counts
 * 
 * @component
 * @param {BadgeProps} props - Component props
 * @returns {React.ReactElement} Badge element
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
