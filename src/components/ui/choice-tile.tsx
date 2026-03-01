import type { ComponentType } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Tone = "slate" | "emerald" | "indigo" | "blue" | "amber" | "rose"
type Layout = "inline" | "stack"

const selectedClasses: Record<Tone, string> = {
    slate: "border-slate-900 bg-slate-50 text-slate-900",
    emerald: "border-emerald-500 bg-emerald-50 text-emerald-500",
    indigo: "border-indigo-500 bg-indigo-50 text-indigo-500",
    blue: "border-blue-500 bg-blue-50 text-blue-500",
    amber: "border-amber-500 bg-amber-50 text-amber-500",
    rose: "border-rose-500 bg-rose-50 text-rose-500",
}

interface ChoiceTileProps {
    label: string
    selected: boolean
    onClick: () => void
    icon?: ComponentType<{ className?: string }>
    tone?: Tone
    layout?: Layout
    className?: string
}

export function ChoiceTile({
    label,
    selected,
    onClick,
    icon: Icon,
    tone = "slate",
    layout = "inline",
    className,
}: ChoiceTileProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            className={cn(
                "h-auto rounded-2xl border-2 text-xs font-bold uppercase tracking-widest outline-none",
                layout === "stack"
                    ? "flex flex-col items-center justify-center gap-2 p-4"
                    : "flex items-center justify-center gap-2 px-3 py-3",
                selected
                    ? selectedClasses[tone]
                    : "border-slate-50 bg-white text-slate-400 hover:border-slate-200 hover:bg-white hover:text-slate-600",
                className
            )}
        >
            {Icon ? <Icon className={cn(layout === "stack" ? "h-5 w-5" : "h-4 w-4")} /> : null}
            <span>{label}</span>
        </Button>
    )
}
