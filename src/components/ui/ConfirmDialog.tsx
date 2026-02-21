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
            <DialogContent className="sm:max-w-[450px] border-none rounded-[3rem] p-12 bg-white shadow-[0_32px_64px_rgba(0,0,0,0.15)] overflow-hidden">
                <DialogHeader className="space-y-8">
                    <div className={cn(
                        "h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto transition-all duration-700 group-hover:rotate-12",
                        config.iconBg
                    )}>
                        <Icon className={cn("h-12 w-12 transition-transform duration-500", config.iconColor)} />
                    </div>
                    <div className="text-center space-y-4">
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-lg leading-relaxed opacity-80 px-4">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="mt-10 flex flex-col gap-3 sm:flex-col sm:space-x-0">
                    <Button
                        type="button"
                        disabled={isLoading}
                        className={cn(
                            "w-full h-14 rounded-2xl text-white font-black text-base shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 order-1",
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
                        className="w-full h-12 rounded-2xl font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all text-sm order-2"
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
