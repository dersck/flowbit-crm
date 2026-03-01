import type { Client } from "@/types"
import { cn } from "@/lib/utils"
import { STAGE_CONFIG } from "@/features/clients/clientConstants"

interface StatusBadgeProps {
    stage: Client["stage"]
    showIcon?: boolean
    className?: string
}

export default function StatusBadge({
    stage,
    showIcon = false,
    className,
}: StatusBadgeProps) {
    const config = STAGE_CONFIG[stage]
    const Icon = config.icon

    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm",
                config.color,
                className
            )}
        >
            {showIcon && <Icon className="h-3.5 w-3.5" />}
            {config.label}
        </div>
    )
}
