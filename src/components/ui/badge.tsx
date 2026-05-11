import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-on-primary",
        secondary:
          "bg-secondary text-on-secondary",
        success:
          "bg-success-500/10 text-success-500 border border-success-500/20",
        warning:
          "bg-warning-500/10 text-warning-500 border border-warning-500/20",
        error:
          "bg-error-500/10 text-error-500 border border-error-500/20",
        outline:
          "border border-outline-variant bg-transparent text-on-surface",
        neutral:
          "bg-neutral-100 text-neutral-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
