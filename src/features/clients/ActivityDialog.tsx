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
import { Textarea } from '../../components/ui/textarea';
import {
    Clock,
    Phone,
    Mail,
    Video,
    MessageSquare,
    Loader2,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Activity } from '@/types';

interface ActivityDialogProps {
    clientId: string;
    clientName?: string;
    trigger?: React.ReactNode;
    defaultType?: Activity['type'];
    email?: string;
    activity?: Activity;
}

const ACTIVITY_TYPES = [
    { id: 'note', label: 'Nota', icon: MessageSquare, color: 'bg-slate-900', textColor: 'text-slate-900' },
    { id: 'call', label: 'Llamada', icon: Phone, color: 'bg-indigo-600', textColor: 'text-indigo-600' },
    { id: 'email', label: 'Email', icon: Mail, color: 'bg-blue-600', textColor: 'text-blue-600' },
    { id: 'meeting', label: 'Reunión', icon: Video, color: 'bg-emerald-600', textColor: 'text-emerald-600' },
] as const;

export default function ActivityDialog({ clientId, clientName = 'Cliente', trigger, defaultType = 'note', email, activity }: ActivityDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createMutation, updateMutation } = useWorkspaceMutation('activities');

    const [formData, setFormData] = useState({
        type: activity?.type || defaultType,
        summary: activity?.summary || '',
    });

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            setFormData({
                type: activity?.type || defaultType,
                summary: activity?.summary || '',
            });

            if (!activity) { // Only handle auto-actions for new activities
                if (defaultType === 'email' && email) {
                    window.location.href = `mailto:${email}`;
                } else if (defaultType === 'meeting') {
                    const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Reunión+con+${encodeURIComponent(clientName)}`;
                    window.open(calendarUrl, '_blank');
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.summary) return;

        setLoading(true);
        try {
            if (activity) {
                await updateMutation.mutateAsync({
                    id: activity.id,
                    data: {
                        type: formData.type,
                        summary: formData.summary,
                    }
                });
                toast.success('Actividad actualizada correctamente');
            } else {
                await createMutation.mutateAsync({
                    clientId,
                    type: formData.type,
                    summary: formData.summary,
                    date: new Date(),
                    createdAt: new Date(),
                });
                toast.success('Actividad registrada correctamente');
            }
            setOpen(false);
            if (!activity) setFormData({ type: 'note', summary: '' });
        } catch (error) {
            console.error(error);
            toast.error(activity ? 'Error al actualizar la actividad' : 'Error al registrar la actividad');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold gap-2">
                        <Plus className="h-4 w-4" />
                        Registrar Evento
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none rounded-[2.5rem] p-10 bg-white">
                <DialogHeader className="space-y-4">
                    <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                        <Clock className="h-7 w-7" />
                    </div>
                    <div>
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
                            {activity ? 'Editar Evento' : 'Registrar Evento'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-base mt-1">
                            {activity
                                ? 'Modifica los detalles de la actividad seleccionada.'
                                : 'Documenta la interacción con el cliente para mantener el historial actualizado.'}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                    <div className="space-y-6">
                        {/* Type Selector */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {ACTIVITY_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type.id })}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 p-4 rounded-3xl border-2 transition-all outline-none",
                                        formData.type === type.id
                                            ? cn("bg-slate-50", type.textColor, type.id === 'note' ? "border-slate-900" :
                                                type.id === 'call' ? "border-indigo-600" :
                                                    type.id === 'email' ? "border-blue-600" : "border-emerald-600")
                                            : "border-slate-50 bg-white text-slate-400 hover:border-slate-200"
                                    )}
                                >
                                    <type.icon className="h-5 w-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Resumen del evento</label>
                            <Textarea
                                required
                                placeholder="Describe brevemente lo ocurrido..."
                                className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-slate-900/10 font-medium p-4 resize-none text-slate-900 dark:bg-slate-50/50 dark:text-slate-900"
                                value={formData.summary}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, summary: e.target.value })}
                            />
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
                            disabled={loading || !formData.summary}
                            className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black px-10 shadow-xl shadow-slate-200 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : activity ? 'Actualizar' : 'Guardar Evento'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
