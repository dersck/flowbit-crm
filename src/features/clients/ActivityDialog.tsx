import { useState } from 'react';
import { Clock, Mail, MessageSquare, Phone, Plus, Video } from 'lucide-react';
import { toast } from 'sonner';
import type { Activity } from '@/types';
import { useWorkspaceMutation } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/button';
import { ChoiceTile } from '@/components/ui/choice-tile';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogActions, DialogHero, DialogShell } from '@/components/ui/dialog-shell';
import { FieldGroup } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';

interface ActivityDialogProps {
    clientId: string;
    clientName?: string;
    trigger?: React.ReactNode;
    defaultType?: Activity['type'];
    email?: string;
    activity?: Activity;
}

const ACTIVITY_TYPES = [
    { id: 'note', label: 'Nota', icon: MessageSquare, tone: 'slate' },
    { id: 'call', label: 'Llamada', icon: Phone, tone: 'indigo' },
    { id: 'email', label: 'Email', icon: Mail, tone: 'blue' },
    { id: 'meeting', label: 'Reunion', icon: Video, tone: 'emerald' },
] as const;

export default function ActivityDialog({
    clientId,
    clientName = 'Cliente',
    trigger,
    defaultType = 'note',
    email,
    activity,
}: ActivityDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createMutation, updateMutation } = useWorkspaceMutation('activities');

    const [formData, setFormData] = useState({
        type: activity?.type || defaultType,
        summary: activity?.summary || '',
    });

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) return;

        setFormData({
            type: activity?.type || defaultType,
            summary: activity?.summary || '',
        });

        if (activity) return;

        if (defaultType === 'email' && email) {
            window.location.href = `mailto:${email}`;
            return;
        }

        if (defaultType === 'meeting') {
            const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Reunion+con+${encodeURIComponent(clientName)}`;
            window.open(calendarUrl, '_blank');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formData.summary) return;

        setLoading(true);
        try {
            if (activity) {
                await updateMutation.mutateAsync({
                    id: activity.id,
                    data: {
                        type: formData.type,
                        summary: formData.summary,
                    },
                });
                toast.success('Actividad actualizada correctamente');
            } else {
                await createMutation.mutateAsync({
                    clientId,
                    type: formData.type,
                    summary: formData.summary,
                    date: new Date(),
                });
                toast.success('Actividad registrada correctamente');
            }
            setOpen(false);
            if (!activity) {
                setFormData({ type: 'note', summary: '' });
            }
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
                    <Button variant="outline" className="gap-2 rounded-xl border-slate-200 font-bold">
                        <Plus className="h-4 w-4" />
                        Registrar Evento
                    </Button>
                )}
            </DialogTrigger>
            <DialogShell size="md">
                <DialogHero
                    icon={<Clock className="h-7 w-7" />}
                    title={activity ? 'Editar Evento' : 'Registrar Evento'}
                    description={activity
                        ? 'Modifica los detalles de la actividad seleccionada.'
                        : 'Documenta la interaccion con el cliente para mantener el historial actualizado.'}
                    tone="slate"
                />

                <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {ACTIVITY_TYPES.map((typeOption) => (
                                <ChoiceTile
                                    key={typeOption.id}
                                    label={typeOption.label}
                                    icon={typeOption.icon}
                                    tone={typeOption.tone}
                                    layout="stack"
                                    selected={formData.type === typeOption.id}
                                    onClick={() => setFormData({ ...formData, type: typeOption.id })}
                                    className="rounded-3xl text-[10px]"
                                />
                            ))}
                        </div>

                        <FieldGroup label="Resumen del evento">
                            <Textarea
                                required
                                placeholder="Describe brevemente lo ocurrido..."
                                className="min-h-[120px]"
                                value={formData.summary}
                                onChange={(event) => setFormData({ ...formData, summary: event.target.value })}
                            />
                        </FieldGroup>
                    </div>

                    <DialogActions
                        onCancel={() => setOpen(false)}
                        confirmLabel={activity ? 'Actualizar' : 'Guardar Evento'}
                        confirmVariant="confirm"
                        disabled={!formData.summary}
                        isLoading={loading}
                    />
                </form>
            </DialogShell>
        </Dialog>
    );
}
