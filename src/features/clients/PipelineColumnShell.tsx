import type { ReactNode, Ref } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PipelineColumnShellProps {
    label: string
    leadCount: number
    totalBudget: number
    icon: LucideIcon
    colorClassName: string
    activeId: string | null
    isOver: boolean
    isWonStage?: boolean
    bodyRef?: Ref<HTMLDivElement>
    children: ReactNode
}

export default function PipelineColumnShell({
    label,
    leadCount,
    totalBudget,
    icon: Icon,
    colorClassName,
    activeId,
    isOver,
    isWonStage = false,
    bodyRef,
    children,
}: PipelineColumnShellProps) {
    return (
        <div className="flex h-full w-80 flex-shrink-0 flex-col gap-4">
            <div
                className={cn(
                    "rounded-[2rem] border p-6 transition-all",
                    isWonStage
                        ? (isOver ? "border-slate-800 bg-slate-800 text-white" : colorClassName)
                        : (isOver ? "scale-[1.02] border-emerald-500 bg-white shadow-lg" : colorClassName)
                )}
            >
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white p-2 shadow-sm">
                            <Icon className="h-4 w-4 text-slate-900" />
                        </div>
                        <div>
                            <h3 className="leading-none font-black tracking-tight text-slate-900">{label}</h3>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                {leadCount} {leadCount === 1 ? "Lead" : "Leads"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-3 flex min-h-[32px] items-center justify-between border-t border-slate-950/5 pt-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Total proyectado
                    </span>
                    <span
                        className={cn(
                            "text-xs font-black",
                            totalBudget > 0 ? "text-slate-900" : "text-slate-300"
                        )}
                    >
                        ${totalBudget.toLocaleString()}
                    </span>
                </div>
            </div>

            <div
                ref={bodyRef}
                className={cn(
                    "flex min-h-[400px] flex-1 flex-col gap-3 rounded-[2.5rem] p-2 transition-all duration-300",
                    activeId && !isOver && "bg-slate-50/50 outline-2 outline-dashed outline-slate-200",
                    isOver && "bg-emerald-50/50 outline-2 outline-dashed outline-emerald-300 ring-4 ring-emerald-500/5",
                    isWonStage && isOver && "bg-slate-900/5 outline-slate-900"
                )}
            >
                {children}
            </div>
        </div>
    )
}
