import type { Client } from "@/types"
import { cn } from "@/lib/utils"
import { SOURCE_CONFIG } from "@/features/clients/clientConstants"

interface SourceBadgeProps {
    source: Client["source"]
    className?: string
}

export default function SourceBadge({ source, className }: SourceBadgeProps) {
    if (!source) return null

    const config = SOURCE_CONFIG[source]
    const Icon = config.icon

    return (
        <div
            className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-tight",
                config.bg,
                config.color,
                className
            )}
        >
            <Icon className="h-3 w-3" />
            {source}
        </div>
    )
}
