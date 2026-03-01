import * as React from "react"
import type { ComponentType } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Tone = "emerald" | "indigo" | "slate" | "blue"

const toneClasses: Record<Tone, string> = {
    emerald: "text-emerald-400",
    indigo: "text-indigo-400",
    slate: "text-slate-300",
    blue: "text-blue-400",
}

interface ActionTileProps {
    icon: ComponentType<{ className?: string }>
    label: string
    tone?: Tone
    className?: string
}

type ActionTileButtonProps = ActionTileProps & Omit<ButtonProps, "children">

const ActionTile = React.forwardRef<HTMLButtonElement, ActionTileButtonProps>(
    ({
        icon: Icon,
        label,
        tone = "slate",
        className,
        type = "button",
        ...props
    }, ref) => {
        return (
            <Button
                ref={ref}
                type={type}
                variant="ghost"
                className={cn(
                    "flex h-auto min-h-[68px] w-full flex-col items-center justify-center gap-1.5 rounded-[1.5rem] border border-white/10 bg-white/5 p-3.5 text-white transition-colors hover:bg-white/10 hover:text-white",
                    className
                )}
                {...props}
            >
                <Icon className={cn("h-[18px] w-[18px]", toneClasses[tone])} />
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </Button>
        )
    }
)

ActionTile.displayName = "ActionTile"

export default ActionTile
