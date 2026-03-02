import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const surfaceVariants = cva("overflow-hidden", {
    variants: {
        variant: {
            premium: "rounded-[2.5rem] border-none bg-white shadow-xl shadow-slate-200/40",
            premiumBordered: "rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40",
            dark: "rounded-[2.5rem] border-none bg-slate-900 text-white shadow-2xl shadow-slate-300",
            dashed: "rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white shadow-sm",
        },
    },
    defaultVariants: {
        variant: "premium",
    },
})

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "premium" | "premiumBordered" | "dark" | "dashed"
    asChild?: boolean
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "div"

        return (
            <Comp ref={ref} className={cn(surfaceVariants({ variant }), className)} {...props} />
        )
    }
)

Surface.displayName = "Surface"
