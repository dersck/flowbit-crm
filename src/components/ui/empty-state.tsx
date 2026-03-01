import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description?: string
    className?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn("py-16 text-center sm:py-20", className)}>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-50 sm:h-20 sm:w-20 sm:rounded-[2rem]">
                <Icon className="h-8 w-8 text-slate-200 sm:h-10 sm:w-10" />
            </div>
            <h3 className="text-[clamp(1.4rem,2vw,1.85rem)] font-black uppercase tracking-tight text-slate-900">{title}</h3>
            {description && (
                <p className="mt-2 text-sm italic font-bold text-slate-400 sm:text-base">{description}</p>
            )}
        </div>
    )
}
