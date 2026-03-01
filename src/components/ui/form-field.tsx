import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function FieldLabel({
    className,
    ...props
}: HTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn(
                "px-1 text-[10px] font-black uppercase tracking-widest text-slate-400",
                className
            )}
            {...props}
        />
    )
}

interface FieldGroupProps extends HTMLAttributes<HTMLDivElement> {
    label?: string
}

export function FieldGroup({ className, label, children, ...props }: FieldGroupProps) {
    return (
        <div className={cn("space-y-2", className)} {...props}>
            {label && <FieldLabel>{label}</FieldLabel>}
            {children}
        </div>
    )
}

interface IconFieldProps extends HTMLAttributes<HTMLDivElement> {
    icon: ReactNode
}

export function IconField({ className, icon, children, ...props }: IconFieldProps) {
    return (
        <div className={cn("relative", className)} {...props}>
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>
            {children}
        </div>
    )
}
