import type { ComponentType, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SegmentedControlProps {
    children: ReactNode
    className?: string
}

export function SegmentedControl({ children, className }: SegmentedControlProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-2 rounded-[1.25rem] border border-slate-200 bg-slate-100 p-1.5 shadow-inner",
                className
            )}
        >
            {children}
        </div>
    )
}

interface SegmentedControlItemProps {
    active: boolean
    onClick: () => void
    label: string
    icon?: ComponentType<{ className?: string }>
    className?: string
}

export function SegmentedControlItem({
    active,
    onClick,
    label,
    icon: Icon,
    className,
}: SegmentedControlItemProps) {
    return (
        <Button
            type="button"
            variant={active ? "segmented" : "ghost"}
            onClick={onClick}
            className={cn(
                "h-11 gap-2 rounded-xl px-5 font-black transition-all",
                active
                    ? "bg-white text-slate-900 shadow-md hover:bg-white hover:text-slate-900"
                    : "text-slate-500 hover:bg-slate-200 hover:text-slate-900",
                className
            )}
        >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {label}
        </Button>
    )
}
