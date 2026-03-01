import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FilterChipTone = "slate" | "emerald"

interface FilterChipProps {
    label: string
    selected: boolean
    onClick: () => void
    tone?: FilterChipTone
    className?: string
}

const toneClasses: Record<
    FilterChipTone,
    { active: string; inactive: string }
> = {
    slate: {
        active: "border-slate-900 bg-slate-900 text-white shadow-lg hover:bg-slate-900 hover:text-white",
        inactive: "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300",
    },
    emerald: {
        active: "border-emerald-600 bg-emerald-600 text-white shadow-lg hover:bg-emerald-600 hover:text-white",
        inactive: "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300",
    },
}

export function FilterChip({
    label,
    selected,
    onClick,
    tone = "slate",
    className,
}: FilterChipProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            className={cn(
                "h-auto rounded-xl border px-4 py-2 text-[11px] font-bold transition-all",
                selected ? toneClasses[tone].active : toneClasses[tone].inactive,
                className
            )}
        >
            {label}
        </Button>
    )
}
