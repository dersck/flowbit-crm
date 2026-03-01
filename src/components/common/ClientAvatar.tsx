import { cn } from "@/lib/utils"

interface ClientAvatarProps {
    name: string
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}

const sizeClasses = {
    sm: "h-10 w-10 rounded-xl text-sm",
    md: "h-14 w-14 rounded-2xl text-lg",
    lg: "h-20 w-20 rounded-3xl text-4xl",
    xl: "h-28 w-28 rounded-[2.5rem] text-5xl",
} as const

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
}

export default function ClientAvatar({
    name,
    size = "lg",
    className,
}: ClientAvatarProps) {
    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center border-2 border-emerald-100 bg-emerald-50 font-black text-emerald-600 shadow-inner",
                sizeClasses[size],
                className
            )}
        >
            {getInitials(name)}
        </div>
    )
}
