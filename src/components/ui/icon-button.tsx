import type { ComponentType } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"

interface IconButtonProps extends Omit<ButtonProps, "children" | "aria-label"> {
    label: string
    icon: ComponentType<{ className?: string }>
}

export function IconButton({
    label,
    icon: Icon,
    size = "icon",
    ...props
}: IconButtonProps) {
    return (
        <Button aria-label={label} size={size} {...props}>
            <Icon className="h-5 w-5" />
        </Button>
    )
}
