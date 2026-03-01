import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface BackLinkProps {
    to: string
    label: string
    className?: string
}

export function BackLink({ to, label, className }: BackLinkProps) {
    return (
        <Link
            to={to}
            className={cn(
                "group flex items-center gap-2 font-bold text-slate-400 transition-colors hover:text-slate-900",
                className
            )}
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white">
                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </div>
            {label}
        </Link>
    )
}
