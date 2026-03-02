import { createContext, useContext, type ComponentType, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SegmentedControlProps {
    children: ReactNode
    className?: string
    ariaLabel?: string
    mode?: "toggle" | "tabs"
    value?: string
    onValueChange?: (value: string) => void
}

interface SegmentedControlContextValue {
    mode: "toggle" | "tabs"
    value?: string
    onValueChange?: (value: string) => void
}

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null)

export function SegmentedControl({
    children,
    className,
    ariaLabel,
    mode = "toggle",
    value,
    onValueChange,
}: SegmentedControlProps) {
    return (
        <SegmentedControlContext.Provider value={{ mode, value, onValueChange }}>
            <div
                role={mode === "tabs" ? "tablist" : undefined}
                aria-label={ariaLabel}
                aria-orientation={mode === "tabs" ? "horizontal" : undefined}
                className={cn(
                    "flex items-center gap-2 rounded-[1.25rem] border border-slate-200 bg-slate-100 p-1.5 shadow-inner",
                    className
                )}
            >
                {children}
            </div>
        </SegmentedControlContext.Provider>
    )
}

interface SegmentedControlItemProps {
    active?: boolean
    onClick?: () => void
    label: string
    icon?: ComponentType<{ className?: string }>
    className?: string
    value?: string
    controls?: string
    id?: string
}

export function SegmentedControlItem({
    active,
    onClick,
    label,
    icon: Icon,
    className,
    value,
    controls,
    id,
}: SegmentedControlItemProps) {
    const context = useContext(SegmentedControlContext)
    const isActive = active ?? (value !== undefined && context?.value !== undefined
        ? context.value === value
        : false)

    const handleClick = () => {
        if (value !== undefined) {
            context?.onValueChange?.(value)
        }
        onClick?.()
    }

    return (
        <Button
            type="button"
            role={context?.mode === "tabs" ? "tab" : undefined}
            aria-selected={context?.mode === "tabs" ? isActive : undefined}
            aria-pressed={context?.mode === "toggle" ? isActive : undefined}
            aria-controls={context?.mode === "tabs" ? controls : undefined}
            id={context?.mode === "tabs" ? id : undefined}
            tabIndex={context?.mode === "tabs" ? (isActive ? 0 : -1) : undefined}
            variant={isActive ? "segmented" : "ghost"}
            onClick={handleClick}
            className={cn(
                "h-11 gap-2 rounded-xl px-5 font-black transition-all",
                isActive
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
