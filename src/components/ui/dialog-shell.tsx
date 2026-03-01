import type { ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface DialogShellProps {
    children: ReactNode
    className?: string
    size?: "md" | "lg"
}

const sizeClasses = {
    md: "sm:max-w-[500px]",
    lg: "sm:max-w-[600px]",
} as const

export function DialogShell({
    children,
    className,
    size = "md",
}: DialogShellProps) {
    return (
        <DialogContent
            className={cn(
                sizeClasses[size],
                "max-h-[90vh] overflow-y-auto scrollbar-hide p-6 sm:p-8",
                className
            )}
        >
            {children}
        </DialogContent>
    )
}

interface DialogHeroProps {
    icon: ReactNode
    title: string
    description: string
    tone?: "slate" | "emerald" | "indigo"
}

const toneClasses = {
    slate: "bg-slate-900 text-white shadow-slate-200",
    emerald: "bg-emerald-600 text-white shadow-emerald-100",
    indigo: "bg-indigo-600 text-white shadow-indigo-100",
} as const

export function DialogHero({
    icon,
    title,
    description,
    tone = "emerald",
}: DialogHeroProps) {
    return (
        <DialogHeader className="space-y-3">
            <div
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg sm:h-14 sm:w-14",
                    toneClasses[tone]
                )}
            >
                {icon}
            </div>
            <div>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="mt-1">{description}</DialogDescription>
            </div>
        </DialogHeader>
    )
}

interface DialogActionsProps {
    onCancel: () => void
    confirmLabel: string
    cancelLabel?: string
    confirmVariant?: "confirm" | "pagePrimary" | "tool"
    disabled?: boolean
    isLoading?: boolean
}

export function DialogActions({
    onCancel,
    confirmLabel,
    cancelLabel = "Cancelar",
    confirmVariant = "confirm",
    disabled,
    isLoading = false,
}: DialogActionsProps) {
    return (
        <DialogFooter className="border-t border-slate-50 pt-6">
            <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-2xl px-6 font-bold sm:px-8"
                onClick={onCancel}
            >
                {cancelLabel}
            </Button>
            <Button
                type="submit"
                variant={confirmVariant}
                disabled={disabled || isLoading}
                className="h-11 px-8 sm:px-10"
            >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {confirmLabel}
            </Button>
        </DialogFooter>
    )
}
