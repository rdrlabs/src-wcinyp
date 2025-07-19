import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea component properties
 * @interface TextareaProps
 * @extends {React.TextareaHTMLAttributes<HTMLTextAreaElement>}
 * 
 * @property {string} [className] - Additional CSS classes
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [value] - Controlled value
 * @property {Function} [onChange] - Change event handler
 * @property {number} [rows] - Number of visible text rows
 * @property {boolean} [disabled] - Disabled state
 * @property {boolean} [readOnly] - Read-only state
 * @property {number} [maxLength] - Maximum character length
 * 
 * @example
 * ```tsx
 * // Basic textarea
 * <Textarea 
 *   placeholder="Enter your message..." 
 * />
 * 
 * // Controlled textarea
 * <Textarea 
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 *   placeholder="Type your comment"
 * />
 * 
 * // With custom rows
 * <Textarea 
 *   rows={10}
 *   placeholder="Write your story..."
 * />
 * 
 * // With character limit
 * <Textarea 
 *   maxLength={500}
 *   placeholder="Limited to 500 characters"
 * />
 * 
 * // Disabled state
 * <Textarea 
 *   disabled
 *   value="This textarea is disabled"
 * />
 * 
 * // Read-only state
 * <Textarea 
 *   readOnly
 *   value="This is read-only content"
 * />
 * ```
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        data-testid="textarea"
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }