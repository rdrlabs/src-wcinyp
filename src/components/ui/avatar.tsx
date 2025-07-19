"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Avatar component for displaying user profile images
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>} props - Component props
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [children] - Avatar content (AvatarImage and AvatarFallback)
 * 
 * @example
 * ```tsx
 * // With image and fallback
 * <Avatar>
 *   <AvatarImage src="/avatars/01.png" alt="@username" />
 *   <AvatarFallback>CN</AvatarFallback>
 * </Avatar>
 * 
 * // Custom size
 * <Avatar className="h-16 w-16">
 *   <AvatarImage src="/avatars/02.png" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * 
 * // Fallback only (no image)
 * <Avatar>
 *   <AvatarFallback>AB</AvatarFallback>
 * </Avatar>
 * ```
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/**
 * AvatarImage component for the avatar image
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>} props - Component props
 * @property {string} src - Image source URL
 * @property {string} [alt] - Image alt text
 * @property {string} [className] - Additional CSS classes
 * @returns {React.ReactElement} Avatar image element
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

/**
 * AvatarFallback component displayed when image fails to load
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>} props - Component props
 * @property {React.ReactNode} [children] - Fallback content (typically initials)
 * @property {string} [className] - Additional CSS classes
 * @returns {React.ReactElement} Avatar fallback element
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
