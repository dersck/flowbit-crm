import { useState } from 'react';
import { Calendar, CheckCircle2, Flag, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceMutation } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ChoiceTile } from '@/components/ui/choice-tile';
import { DialogActions, DialogHero, DialogShell } from '@/components/ui/dialog-shell';
import { FieldGroup, IconField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

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
        priority: 1,
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                    <Button variant="pagePrimary" className="h-11 gap-3 px-6">
                        <Plus className="h-5 w-5" />
                        Nueva Tarea
                    </Button>
                )}
            </DialogTrigger>
            <DialogShell size="md">
                <DialogHero
                    icon={<CheckCircle2 className="h-7 w-7" />}
                    title="Nueva Tarea"
                    description="Que es lo siguiente que debemos hacer?"
                    tone="emerald"
                />

                <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                    <div className="space-y-6">
                        <FieldGroup label="Titulo de la tarea">
                            <Input
                                required
                                placeholder="Ej. Enviar propuesta comercial"
                                value={formData.title}
                                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                            />
                        </FieldGroup>

                        <FieldGroup label="Fecha Programada">
                            <IconField icon={<Calendar className="h-5 w-5" />}>
                                <Input
                                    type="date"
                                    className="pl-12"
                                    value={formData.scheduledDate}
                                    onChange={(event) => setFormData({ ...formData, scheduledDate: event.target.value })}
                                />
                            </IconField>
                        </FieldGroup>

                        <FieldGroup label="Prioridad">
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3].map((priority) => (
                                    <ChoiceTile
                                        key={priority}
                                        label={priority === 3 ? 'Alta' : priority === 2 ? 'Media' : 'Baja'}
                                        icon={Flag}
                                        tone={priority === 3 ? 'rose' : priority === 2 ? 'amber' : 'emerald'}
                                        selected={formData.priority === priority}
                                        onClick={() => setFormData({ ...formData, priority })}
                                        className="h-12"
                                    />
                                ))}
                            </div>
                        </FieldGroup>
                    </div>

                    <DialogActions
                        onCancel={() => setOpen(false)}
                        confirmLabel="Crear Tarea"
                        confirmVariant="confirm"
                        disabled={!formData.title}
                        isLoading={loading}
                    />
                </form>
            </DialogShell>
        </Dialog>
    );
}
