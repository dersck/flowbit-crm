import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const DrawerDialog = DialogPrimitive.Root
const DrawerDialogTrigger = DialogPrimitive.Trigger
const DrawerDialogClose = DialogPrimitive.Close
const DrawerDialogPortal = DialogPrimitive.Portal

const DrawerDialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
))
DrawerDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DrawerDialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DrawerDialogPortal>
        <DrawerDialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-100 bg-white shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-6 top-6 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <X className="h-5 w-5" />
                <span className="sr-only">Cerrar</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DrawerDialogPortal>
))
DrawerDialogContent.displayName = DialogPrimitive.Content.displayName

const DrawerDialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("border-b border-slate-100 p-8 pr-16", className)} {...props} />
)
DrawerDialogHeader.displayName = "DrawerDialogHeader"

const DrawerDialogBody = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("scrollbar-hide flex-1 overflow-y-auto p-8", className)} {...props} />
)
DrawerDialogBody.displayName = "DrawerDialogBody"

const DrawerDialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("border-t border-slate-100 p-8", className)} {...props} />
)
DrawerDialogFooter.displayName = "DrawerDialogFooter"

const DrawerDialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-2xl font-black tracking-tight text-slate-900", className)}
        {...props}
    />
))
DrawerDialogTitle.displayName = DialogPrimitive.Title.displayName

const DrawerDialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("mt-1 text-sm font-bold text-slate-500", className)}
        {...props}
    />
))
DrawerDialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    DrawerDialog,
    DrawerDialogTrigger,
    DrawerDialogClose,
    DrawerDialogContent,
    DrawerDialogHeader,
    DrawerDialogBody,
    DrawerDialogFooter,
    DrawerDialogTitle,
    DrawerDialogDescription,
}
