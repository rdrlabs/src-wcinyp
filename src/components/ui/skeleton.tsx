import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md",
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary/10",
        secondary: "bg-secondary/20",
      },
      size: {
        default: "h-4 w-full",
        sm: "h-3 w-full",
        lg: "h-6 w-full",
        circle: "h-12 w-12 rounded-full",
        avatar: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Skeleton component properties
 * @interface SkeletonProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @extends {VariantProps<typeof skeletonVariants>}
 * 
 * @property {string} [variant="default"] - Visual style variant (default | primary | secondary)
 * @property {string} [size="default"] - Size variant (default | sm | lg | circle | avatar)
 * @property {string} [className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * // Basic skeleton
 * <Skeleton />
 * 
 * // Custom width
 * <Skeleton className="w-[200px]" />
 * 
 * // Avatar skeleton
 * <Skeleton size="avatar" />
 * 
 * // Card skeleton
 * <Card>
 *   <CardHeader>
 *     <Skeleton className="h-6 w-[150px]" />
 *   </CardHeader>
 *   <CardContent className="space-y-2">
 *     <Skeleton className="h-4 w-full" />
 *     <Skeleton className="h-4 w-[80%]" />
 *   </CardContent>
 * </Card>
 * ```
 */
export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

/**
 * Skeleton loader component for indicating loading states
 * 
 * @component
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, size }), className)}
        data-testid="skeleton"
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton, type SkeletonProps, skeletonVariants }
