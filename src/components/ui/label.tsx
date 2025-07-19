"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Label component properties
 * @interface LabelProps
 * @extends {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>}
 * @extends {VariantProps<typeof labelVariants>}
 * 
 * @property {string} [htmlFor] - ID of the form element this label is for
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [children] - Label text content
 * @property {string} [variant="default"] - Visual style variant (default | primary | secondary | muted)
 * 
 * @example
 * ```tsx
 * // Basic label
 * <Label htmlFor="email">Email</Label>
 * 
 * // With input
 * <div>
 *   <Label htmlFor="name">Name</Label>
 *   <Input id="name" />
 * </div>
 * 
 * // Required field indicator
 * <Label htmlFor="password">
 *   Password <span className="text-destructive">*</span>
 * </Label>
 * 
 * // Different variants
 * <Label variant="primary">Primary Label</Label>
 * <Label variant="muted">Muted Label</Label>
 * ```
 */
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}
/**
 * A flexible label component for form elements
 * 
 * @component
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant }), className)}
    data-testid="label"
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, type LabelProps, labelVariants }
