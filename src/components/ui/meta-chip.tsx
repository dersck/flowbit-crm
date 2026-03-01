import type { ComponentType, HTMLAttributes } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type MetaChipTone = "slate" | "indigo" | "emerald" | "amber" | "rose"

interface MetaChipProps extends HTMLAttributes<HTMLElement> {
    asChild?: boolean
    icon?: ComponentType<{ className?: string }>
    interactive?: boolean
    tone?: MetaChipTone
}

const toneClasses: Record<
    MetaChipTone,
    { static: string; interactive: string }
> = {
    slate: {
        static: "border-slate-100 bg-slate-50 text-slate-500",
        interactive:
            "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-900 hover:bg-slate-900 hover:text-white",
    },
    indigo: {
        static: "border-indigo-100 bg-indigo-50 text-indigo-600",
        interactive:
            "border-indigo-100 bg-indigo-50 text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white",
    },
    emerald: {
        static: "border-emerald-100 bg-emerald-50 text-emerald-600",
        interactive:
            "border-emerald-100 bg-emerald-50 text-emerald-600 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white",
    },
    amber: {
        static: "border-amber-100 bg-amber-50 text-amber-600",
        interactive:
            "border-amber-100 bg-amber-50 text-amber-600 hover:border-amber-600 hover:bg-amber-600 hover:text-white",
    },
    rose: {
        static: "border-rose-100 bg-rose-50 text-rose-600",
        interactive:
            "border-rose-100 bg-rose-50 text-rose-600 hover:border-rose-600 hover:bg-rose-600 hover:text-white",
    },
}

export function MetaChip({
    asChild = false,
    className,
    children,
    icon: Icon,
    interactive = false,
    tone = "slate",
    ...props
}: MetaChipProps) {
    const Comp = asChild ? Slot : "span"

    return (
        <Comp
            className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-all",
                interactive ? toneClasses[tone].interactive : toneClasses[tone].static,
                className
            )}
            {...props}
        >
            {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
            <span className="truncate">{children}</span>
        </Comp>
    )
}
