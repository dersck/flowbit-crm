import { useState } from 'react';
import { useWorkspaceMutation } from '@/hooks/useFirestore';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Loader2,
    Calendar,
    CheckCircle2,
    Flag
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TaskDialogProps {
    clientId?: string;
    projectId?: string;
    trigger?: React.ReactNode;
}

export default function TaskDialog({ clientId, projectId, trigger }: TaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createMutation } = useWorkspaceMutation('tasks');

    const [formData, setFormData] = useState({
        title: '',
        scheduledDate: '',
        priority: 1, // 1: Low, 2: Medium, 3: High
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.title) return;

        setLoading(true);
        try {
            await createMutation.mutateAsync({
                title: formData.title,
                status: 'todo',
                scheduledDate: formData.scheduledDate || null,
                priority: formData.priority,
                clientId: clientId || null,
                projectId: projectId || null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            toast.success('Tarea creada correctamente');
            setOpen(false);
            setFormData({ title: '', scheduledDate: '', priority: 1 });
        } catch (error) {
            console.error(error);
            toast.error('Error al crear la tarea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="lg" className="rounded-2xl shadow-xl shadow-emerald-100 flex gap-2 font-bold px-8 bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-5 w-5" />
                        Nueva Tarea
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none rounded-[2.5rem] p-10 bg-white">
                <DialogHeader className="space-y-4">
                    <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                        <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div>
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">Nueva Tarea</DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-base mt-1">
                            ¿Qué es lo siguiente que debemos hacer?
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Título de la tarea</label>
                            <Input
                                required
                                placeholder="Ej. Enviar propuesta comercial"
                                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/20 px-4"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha Programada</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="date"
                                    className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/20"
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prioridad</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={cn(
                                            "flex items-center justify-center gap-2 h-12 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest outline-none",
                                            formData.priority === p
                                                ? p === 3 ? "border-rose-500 bg-rose-50 text-rose-500" :
                                                    p === 2 ? "border-amber-500 bg-amber-50 text-amber-500" :
                                                        "border-emerald-500 bg-emerald-50 text-emerald-500"
                                                : "border-slate-50 bg-white text-slate-400 hover:border-slate-200"
                                        )}
                                    >
                                        <Flag className="h-4 w-4" />
                                        {p === 3 ? 'Alta' : p === 2 ? 'Media' : 'Baja'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-8 border-t border-slate-50">
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-12 rounded-2xl font-bold px-8"
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.title}
                            className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black px-10 shadow-xl shadow-slate-200 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : 'Crear Tarea'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
