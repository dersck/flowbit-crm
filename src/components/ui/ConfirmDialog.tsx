import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    isLoading = false
}: ConfirmDialogProps) {
    const variants = {
        danger: {
            icon: Trash2,
            iconBg: 'bg-rose-50',
            iconColor: 'text-rose-600',
            buttonBg: 'bg-rose-600 hover:bg-rose-700 shadow-rose-100',
        },
        warning: {
            icon: AlertCircle,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            buttonBg: 'bg-amber-600 hover:bg-amber-700 shadow-amber-100',
        },
        info: {
            icon: Info,
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            buttonBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100',
        }
    };

    const config = variants[variant];
    const Icon = config.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="overflow-hidden rounded-[2.5rem] border-none bg-white p-8 shadow-[0_32px_64px_rgba(0,0,0,0.15)] sm:max-w-[450px] sm:p-10">
                <DialogHeader className="space-y-6">
                    <div className={cn(
                        "mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] transition-all duration-700 group-hover:rotate-12 sm:h-24 sm:w-24 sm:rounded-[2rem]",
                        config.iconBg
                    )}>
                        <Icon className={cn("h-10 w-10 transition-transform duration-500 sm:h-12 sm:w-12", config.iconColor)} />
                    </div>
                    <div className="space-y-3 text-center">
                        <DialogTitle className="text-[clamp(1.6rem,2.4vw,2rem)] font-black leading-tight tracking-tight text-slate-900">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="px-2 text-sm font-bold leading-relaxed text-slate-500 opacity-80 sm:px-4 sm:text-base">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-col sm:space-x-0">
                    <Button
                        type="button"
                        disabled={isLoading}
                        className={cn(
                            "order-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-black text-white shadow-xl transition-all transform active:scale-95 sm:h-[3.25rem]",
                            config.buttonBg
                        )}
                        onClick={onConfirm}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            confirmText
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="order-2 h-11 w-full rounded-2xl text-sm font-bold text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
