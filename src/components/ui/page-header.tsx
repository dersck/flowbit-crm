import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
    title: string
    subtitle?: string
    eyebrow?: string
    icon?: ReactNode
    actions?: ReactNode
    className?: string
}

export function PageHeader({
    title,
    subtitle,
    eyebrow,
    icon,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
            <div>
                {(eyebrow || icon) && (
                    <div className="mb-2 flex items-center gap-3">
                        {icon}
                        {eyebrow && (
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                                {eyebrow}
                            </span>
                        )}
                    </div>
                )}
                <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-extrabold tracking-tight text-slate-900">{title}</h1>
                {subtitle && (
                    <p className="mt-1 text-base font-bold text-slate-500 opacity-80 sm:text-[1.0625rem]">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
        </header>
    )
}
