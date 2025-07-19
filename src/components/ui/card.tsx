import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border border-border bg-card shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-sm",
        primary: "border-2 border-primary bg-card shadow-sm hover:shadow-md dark:bg-card",
        primaryGradient: "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm hover:shadow-md dark:from-primary/5 dark:to-primary/5",
        ghost: "border-0 shadow-none bg-transparent hover:bg-muted",
        elevated: "border border-border bg-card shadow-md hover:shadow-lg dark:shadow-sm dark:hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Card component properties
 * @interface CardProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @extends {VariantProps<typeof cardVariants>}
 * 
 * @property {string} [variant="default"] - Visual style variant
 * @property {string} [className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description goes here</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * 
 * // Different variants
 * <Card variant="primary">
 *   <CardHeader>
 *     <CardTitle>Primary Card</CardTitle>
 *   </CardHeader>
 * </Card>
 * 
 * <Card variant="primaryGradient">
 *   <CardContent>Gradient background</CardContent>
 * </Card>
 * 
 * <Card variant="elevated">
 *   <CardContent>Elevated with shadow</CardContent>
 * </Card>
 * 
 * // Interactive card
 * <Card className="cursor-pointer" onClick={handleClick}>
 *   <CardContent>Clickable card</CardContent>
 * </Card>
 * ```
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Card container component
 * A versatile container with multiple style variants
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      data-slot="card"
      {...props}
    />
  )
)
Card.displayName = "Card"

/**
 * Card header section
 * Contains title and description with proper spacing
 * 
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Settings</CardTitle>
 *   <CardDescription>Manage your account settings</CardDescription>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6", className)}
    data-slot="card-header"
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * Card title component
 * Displays the main heading of the card
 * 
 * @example
 * ```tsx
 * <CardTitle>Welcome Back</CardTitle>
 * <CardTitle className="text-2xl">Large Title</CardTitle>
 * ```
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    data-slot="card-title"
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * Card description component
 * Displays supplementary text below the title
 * 
 * @example
 * ```tsx
 * <CardDescription>
 *   Fill out the form below to create your account
 * </CardDescription>
 * ```
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    data-slot="card-description"
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * Card content section
 * Main body area of the card
 * 
 * @example
 * ```tsx
 * <CardContent>
 *   <form>
 *     <Input placeholder="Email" />
 *     <Input type="password" placeholder="Password" />
 *   </form>
 * </CardContent>
 * ```
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} data-slot="card-content" {...props} />
))
CardContent.displayName = "CardContent"

/**
 * Card footer section
 * Typically contains actions or additional information
 * 
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="outline">Cancel</Button>
 *   <Button className="ml-auto">Save Changes</Button>
 * </CardFooter>
 * 
 * <CardFooter className="justify-between">
 *   <p className="text-sm text-muted-foreground">Last updated: Today</p>
 *   <Button size="sm">Edit</Button>
 * </CardFooter>
 * ```
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    data-slot="card-footer"
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
