import { ExternalLink, Trash2, User } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetaChip } from "@/components/ui/meta-chip"
import { cn } from "@/lib/utils"
import type { Project } from "@/types"
import { PROJECT_STATUS_CONFIG } from "@/features/projects/projectConstants"

interface ProjectBoardCardProps {
    project: Project
    clientName?: string
    onDelete: (id: string) => void
    progress: number
}

export default function ProjectBoardCard({
    project,
    clientName,
    onDelete,
    progress,
}: ProjectBoardCardProps) {
    const statusConfig = PROJECT_STATUS_CONFIG[project.status]

    return (
        <Card className="group cursor-pointer overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-emerald-500/10 hover:shadow-2xl hover:shadow-slate-200/50">
            <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <MetaChip
                        tone="slate"
                        icon={User}
                        className="max-w-[70%]"
                    >
                        {clientName || "Sin cliente"}
                    </MetaChip>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-slate-300 hover:text-rose-500"
                            onClick={() => onDelete(project.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Link to={`/projects/${project.id}`}>
                    <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-tighter text-slate-900 transition-colors group-hover:text-indigo-600">
                        {project.name}
                    </h3>
                </Link>

                {project.description ? (
                    <p className="mt-3 line-clamp-2 text-sm font-medium leading-relaxed text-slate-400">
                        {project.description}
                    </p>
                ) : null}

                <div className="mt-8">
                    <div className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Progreso Visual</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full border border-slate-100 bg-slate-50 p-0.5">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                statusConfig.bgClassName
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-6">
                    <div className="min-w-0 flex-1 pr-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                            Estado
                        </p>
                        <p className={cn("mt-1 text-sm font-bold", statusConfig.textClassName)}>
                            {statusConfig.label}
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl border-transparent bg-slate-50 text-slate-300 hover:border-indigo-100 hover:bg-white hover:text-indigo-600"
                    >
                        <Link to={`/projects/${project.id}`}>
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
