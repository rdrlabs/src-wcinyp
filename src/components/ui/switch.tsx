"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/**
 * Switch component properties
 * @typedef {React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>} SwitchProps
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
 * // Basic switch
 * <Switch />
 * 
 * // Controlled switch
 * <Switch 
 *   checked={isEnabled}
 *   onCheckedChange={setIsEnabled}
 * />
 * 
 * // With label
 * <div className="flex items-center space-x-2">
 *   <Switch id="airplane-mode" />
 *   <label htmlFor="airplane-mode">Airplane Mode</label>
 * </div>
 * 
 * // Disabled state
 * <Switch disabled />
 * 
 * // Default checked
 * <Switch defaultChecked />
 * 
 * // In a form
 * <form>
 *   <div className="flex items-center justify-between">
 *     <label htmlFor="notifications">Enable notifications</label>
 *     <Switch id="notifications" name="notifications" />
 *   </div>
 * </form>
 * ```
 */
export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    data-testid="switch"
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
      data-testid="switch-thumb"
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
