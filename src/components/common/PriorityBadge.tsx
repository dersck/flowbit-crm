import { AlertCircle, Flag } from "lucide-react"
import { MetaChip } from "@/components/ui/meta-chip"
import { cn } from "@/lib/utils"

interface PriorityBadgeProps {
    priority: 1 | 2 | 3
    className?: string
}

const priorityMeta = {
    1: { label: "Baja", tone: "emerald", icon: Flag },
    2: { label: "Media", tone: "amber", icon: Flag },
    3: { label: "Alta", tone: "rose", icon: AlertCircle },
} as const

export default function PriorityBadge({
    priority,
    className,
}: PriorityBadgeProps) {
    const config = priorityMeta[priority]

    return (
        <MetaChip
            icon={config.icon}
            tone={config.tone}
            className={cn("tracking-tighter", className)}
        >
            {config.label}
        </MetaChip>
    )
}
