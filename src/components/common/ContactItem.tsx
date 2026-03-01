import type { ComponentType, ReactNode } from "react"
import { cn } from "@/lib/utils"

type Tone = "slate" | "emerald" | "indigo" | "blue" | "amber" | "rose"

const toneClasses: Record<Tone, { icon: string; hover: string }> = {
    slate: { icon: "text-slate-500", hover: "group-hover:bg-slate-100 group-hover:text-slate-900" },
    emerald: { icon: "text-emerald-600", hover: "group-hover:bg-emerald-50 group-hover:text-emerald-600" },
    indigo: { icon: "text-indigo-600", hover: "group-hover:bg-indigo-50 group-hover:text-indigo-600" },
    blue: { icon: "text-blue-600", hover: "group-hover:bg-blue-50 group-hover:text-blue-600" },
    amber: { icon: "text-amber-600", hover: "group-hover:bg-amber-50 group-hover:text-amber-600" },
    rose: { icon: "text-rose-600", hover: "group-hover:bg-rose-50 group-hover:text-rose-600" },
}

interface ContactItemProps {
    icon: ComponentType<{ className?: string }>
    value: ReactNode
    tone?: Tone
    href?: string
    className?: string
}

export default function ContactItem({
    icon: Icon,
    value,
    tone = "slate",
    href,
    className,
}: ContactItemProps) {
    const content = (
        <>
            <div
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 transition-colors",
                    toneClasses[tone].icon,
                    toneClasses[tone].hover
                )}
            >
                <Icon className="h-5 w-5" />
            </div>
            <span className="min-w-0 truncate">{value}</span>
        </>
    )

    if (href) {
        return (
            <a
                href={href}
                className={cn("group flex items-center gap-4 font-bold text-slate-500 transition-colors hover:text-slate-900", className)}
            >
                {content}
            </a>
        )
    }

    return (
        <div className={cn("group flex items-center gap-4 font-bold text-slate-500", className)}>
            {content}
        </div>
    )
}
