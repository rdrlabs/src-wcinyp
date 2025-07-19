import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border border-border ring-1 ring-border/30 hover:ring-border/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-sm",
        primary: "border border-primary/50 ring-1 ring-primary/20 hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Input component properties
 * @interface InputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 * @extends {VariantProps<typeof inputVariants>}
 * 
 * @property {string} [variant="default"] - Visual style variant (default | primary)
 * @property {string} [type="text"] - HTML input type
 * @property {string} [className] - Additional CSS classes
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [disabled] - Disabled state
 * @property {string} [value] - Controlled value
 * @property {Function} [onChange] - Change event handler
 * 
 * @example
 * ```tsx
 * // Basic text input
 * <Input 
 *   type="text" 
 *   placeholder="Enter your name" 
 * />
 * 
 * // Email input with variant
 * <Input 
 *   type="email" 
 *   variant="primary"
 *   placeholder="email@example.com" 
 * />
 * 
 * // Controlled input
 * <Input 
 *   value={inputValue}
 *   onChange={(e) => setInputValue(e.target.value)}
 * />
 * 
 * // Password input
 * <Input 
 *   type="password" 
 *   placeholder="Enter password"
 * />
 * 
 * // File input
 * <Input 
 *   type="file" 
 *   accept="image/*"
 * />
 * 
 * // Disabled input
 * <Input 
 *   disabled 
 *   value="Cannot edit this"
 * />
 * ```
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        data-testid="input"
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }