import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-emerald-600 text-white shadow-md hover:bg-emerald-700",
                destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
                outline: "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 text-slate-900",
                secondary: "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200",
                ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
                link: "text-emerald-600 underline-offset-4 hover:underline",
                pagePrimary: "rounded-2xl bg-slate-900 px-8 text-white shadow-xl shadow-slate-200 hover:bg-slate-800",
                confirm: "rounded-2xl bg-emerald-600 px-10 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700",
                tool: "rounded-2xl bg-indigo-600 px-8 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700",
                danger: "rounded-2xl bg-rose-600 px-10 text-white shadow-xl shadow-rose-100 hover:bg-rose-700",
                soft: "rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 shadow-sm hover:bg-white hover:text-slate-900",
                segmented: "rounded-xl px-5 text-slate-500 hover:bg-slate-100 hover:text-slate-900",
            },
            size: {
                default: "h-10 rounded-md px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-12 rounded-2xl px-8",
                icon: "h-9 w-9",
                xl: "h-14 rounded-2xl px-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "pagePrimary" | "confirm" | "tool" | "danger" | "soft" | "segmented" | null
    size?: "default" | "sm" | "lg" | "icon" | "xl" | null
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

export { Button }
