import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — clean, precise, no rounded bloat
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        // Primary — amber, confident
        default:
          "bg-primary text-white hover:bg-primary/90 active:bg-primary/80 shadow-sm",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        // Outline — clean border, no fill
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-foreground/20 active:bg-secondary/80",
        // Secondary — subtle fill
        secondary:
          "bg-secondary text-foreground hover:bg-secondary/70 active:bg-muted border border-transparent hover:border-border",
        // Ghost — no border, no fill
        ghost:
          "text-foreground hover:bg-secondary active:bg-muted",
        // Link
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-8 px-3.5 py-0 rounded-md text-sm",
        sm:      "h-7 px-3 py-0 rounded text-xs",
        lg:      "h-9 px-4 py-0 rounded-md text-sm",
        xl:      "h-10 px-5 py-0 rounded-md text-sm",
        icon:    "h-8 w-8 rounded-md",
        "icon-sm":"h-7 w-7 rounded",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
