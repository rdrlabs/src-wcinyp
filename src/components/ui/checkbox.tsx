"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Checkbox component properties
 * @typedef {React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>} CheckboxProps
 * 
 * @property {boolean} [checked] - Controlled checked state
 * @property {boolean} [defaultChecked] - Default checked state for uncontrolled component
 * @property {Function} [onCheckedChange] - Callback when checked state changes
 * @property {boolean} [disabled] - Disabled state
 * @property {boolean} [required] - Required field indicator
 * @property {string} [name] - Form field name
 * @property {string} [value] - Form field value
 * @property {string} [className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * // Basic checkbox
 * <Checkbox />
 * 
 * // Controlled checkbox
 * <Checkbox 
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 * />
 * 
 * // With form
 * <form>
 *   <div className="flex items-center space-x-2">
 *     <Checkbox id="terms" name="terms" />
 *     <label htmlFor="terms">Accept terms and conditions</label>
 *   </div>
 * </form>
 * 
 * // Disabled state
 * <Checkbox disabled />
 * 
 * // Default checked
 * <Checkbox defaultChecked />
 * ```
 */
export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    data-testid="checkbox"
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
      data-testid="checkbox-indicator"
    >
      <Check className="h-4 w-4" data-testid="checkbox-check-icon" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }