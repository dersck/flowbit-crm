import type { ComponentType, ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Tone = "indigo" | "rose" | "amber" | "emerald" | "slate" | "blue"

const toneClasses: Record<Tone, { icon: string; border: string }> = {
    indigo: { icon: "bg-indigo-600 shadow-indigo-100", border: "hover:border-indigo-100" },
    rose: { icon: "bg-rose-500 shadow-rose-100", border: "hover:border-rose-100" },
    amber: { icon: "bg-amber-500 shadow-amber-100", border: "hover:border-amber-100" },
    emerald: { icon: "bg-emerald-500 shadow-emerald-100", border: "hover:border-emerald-100" },
    slate: { icon: "bg-slate-900 shadow-slate-200", border: "hover:border-slate-200" },
    blue: { icon: "bg-blue-600 shadow-blue-100", border: "hover:border-blue-100" },
}

interface StatCardProps {
    label: string
    value: ReactNode
    icon: ComponentType<{ className?: string }>
    tone?: Tone
    badge?: ReactNode
    trend?: ReactNode
    description?: ReactNode
    descriptionIcon?: ComponentType<{ className?: string }>
    className?: string
    valueClassName?: string
}

export default function StatCard({
    label,
    value,
    icon: Icon,
    tone = "indigo",
    badge,
    trend,
    description,
    descriptionIcon: DescriptionIcon,
    className,
    valueClassName,
}: StatCardProps) {
    return (
        <Card
            className={cn(
                "group rounded-3xl border-2 border-slate-100 bg-slate-50/20 p-5 transition-all sm:p-6",
                toneClasses[tone].border,
                className
            )}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "rounded-lg p-2 shadow-md transition-transform group-hover:scale-110",
                            toneClasses[tone].icon
                        )}
                    >
                        <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</h3>
                </div>
                {trend ? <div>{trend}</div> : null}
            </div>
            <div className="flex items-baseline gap-2">
                <p className={cn("text-[clamp(1.9rem,2.4vw,2.35rem)] font-black text-slate-900", valueClassName)}>{value}</p>
                {badge}
            </div>
            {description ? (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 opacity-70">
                    {DescriptionIcon ? <DescriptionIcon className="h-3 w-3" /> : null}
                    <span>{description}</span>
                </div>
            ) : null}
        </Card>
    )
}
