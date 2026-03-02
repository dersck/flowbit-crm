import { cloneElement, isValidElement, useId, type HTMLAttributes, type ReactElement, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function FieldLabel({
    className,
    ...props
}: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                "px-1 text-[10px] font-black uppercase tracking-widest text-slate-400",
                className
            )}
            {...props}
        />
    )
}

export interface FieldControlProps {
    id: string
    "aria-describedby"?: string
    "aria-invalid"?: true
    required?: boolean
}

interface BaseFieldGroupProps {
    id?: string
    label: string
    hint?: string
    error?: string
    required?: boolean
    asFieldset?: boolean
    children: ReactNode | ((fieldProps: FieldControlProps) => ReactNode)
    className?: string
}

type FieldGroupProps = BaseFieldGroupProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">

function mergeDescribedBy(existing: string | undefined, nextIds: string[]) {
    return [existing, ...nextIds].filter(Boolean).join(" ") || undefined
}

export function FieldGroup({
    className,
    id,
    label,
    hint,
    error,
    required,
    asFieldset = false,
    children,
    ...props
}: FieldGroupProps) {
    const autoId = useId()
    const controlId = id ?? `field-${autoId}`
    const hintId = hint ? `${controlId}-hint` : undefined
    const errorId = error ? `${controlId}-error` : undefined
    const describedBy = mergeDescribedBy(undefined, [hintId, errorId].filter(Boolean) as string[])
    const fieldProps: FieldControlProps = {
        id: controlId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
    }

    const content = typeof children === "function"
        ? children(fieldProps)
        : (isValidElement(children)
            ? cloneElement(children as ReactElement<Record<string, unknown>>, fieldProps as unknown as Record<string, unknown>)
            : children)

    if (asFieldset) {
        return (
            <fieldset className={cn("space-y-2", className)}>
                <legend className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {label}
                    {required ? " *" : ""}
                </legend>
                {hint ? <p id={hintId} className="px-1 text-xs font-bold text-slate-400">{hint}</p> : null}
                {content}
                {error ? <p id={errorId} className="px-1 text-xs font-bold text-rose-600">{error}</p> : null}
            </fieldset>
        )
    }

    return (
        <div className={cn("space-y-2", className)} {...props}>
            <label
                htmlFor={controlId}
                className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
                {label}
                {required ? " *" : ""}
            </label>
            {hint ? <p id={hintId} className="px-1 text-xs font-bold text-slate-400">{hint}</p> : null}
            {content}
            {error ? <p id={errorId} className="px-1 text-xs font-bold text-rose-600">{error}</p> : null}
        </div>
    )
}

interface IconFieldProps extends HTMLAttributes<HTMLDivElement> {
    icon: ReactNode
    children: ReactElement<{
        id?: string
        required?: boolean
        "aria-describedby"?: string
        "aria-invalid"?: boolean
    }>
    id?: string
    required?: boolean
    "aria-describedby"?: string
    "aria-invalid"?: true
}

export function IconField({ className, icon, children, id, required, ...props }: IconFieldProps) {
    const control = isValidElement(children)
        ? cloneElement(children, {
            id: children.props.id ?? id,
            required: children.props.required ?? required,
            "aria-describedby": mergeDescribedBy(children.props["aria-describedby"], [
                props["aria-describedby"],
            ].filter(Boolean) as string[]),
            "aria-invalid": children.props["aria-invalid"] ?? props["aria-invalid"],
        })
        : children

    return (
        <div className={cn("relative", className)} {...props}>
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>
            {control}
        </div>
    )
}
