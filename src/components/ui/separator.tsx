"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  "shrink-0",
  {
    variants: {
      variant: {
        default: "bg-border",
        strong: "bg-foreground/20",
        muted: "bg-muted",
        gradient: "bg-gradient-to-r from-transparent via-border to-transparent",
      },
      orientation: {
        horizontal: "h-[1px] w-full",
        vertical: "h-full w-[1px]",
      },
    },
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
    },
  }
)

/**
 * Separator component properties
 * @interface SeparatorProps
 * @extends {Omit<React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, 'orientation'>}
 * @extends {VariantProps<typeof separatorVariants>}
 * 
 * @property {string} [variant="default"] - Visual style variant (default | strong | muted | gradient)
 * @property {string} [orientation="horizontal"] - Separator orientation (horizontal | vertical)
 * @property {boolean} [decorative=true] - Whether the separator is decorative (no semantic meaning)
 * @property {string} [className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * // Horizontal separator (default)
 * <Separator />
 * 
 * // Vertical separator
 * <div className="flex h-5 items-center space-x-4">
 *   <span>Item 1</span>
 *   <Separator orientation="vertical" />
 *   <span>Item 2</span>
 * </div>
 * 
 * // Strong variant
 * <Separator variant="strong" />
 * 
 * // Gradient variant
 * <Separator variant="gradient" className="my-4" />
 * 
 * // In a card
 * <Card>
 *   <CardHeader>Title</CardHeader>
 *   <Separator />
 *   <CardContent>Content</CardContent>
 * </Card>
 * ```
 */
export interface SeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, 'orientation'>,
    VariantProps<typeof separatorVariants> {}

/**
 * Separator component for visually dividing content
 * 
 * @component
 * @param {SeparatorProps} props - Component props
 * @returns {React.ReactElement} Separator element
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = "horizontal", variant, decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation as "horizontal" | "vertical" | undefined}
      className={cn(separatorVariants({ variant, orientation }), className)}
      data-testid="separator"
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator, type SeparatorProps, separatorVariants }
