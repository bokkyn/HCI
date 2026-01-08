import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "xl" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg active:scale-[0.98]": variant === "default",
            "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg active:scale-[0.98]": variant === "destructive",
            "border-2 border-green-200 bg-transparent text-green-700 hover:bg-green-50 hover:border-green-300 shadow-sm": variant === "outline",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm active:scale-[0.98]": variant === "secondary",
            "text-green-700 hover:bg-green-50 hover:text-green-800": variant === "ghost",
            "text-green-700 underline-offset-4 hover:underline": variant === "link",
            
            // Sizes
            "h-10 px-6 py-2": size === "default",
            "h-9 rounded-lg px-4 text-xs": size === "sm",
            "h-12 rounded-xl px-8 text-base": size === "lg",
            "h-14 rounded-xl px-10 text-lg font-semibold": size === "xl",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }