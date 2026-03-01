import { useState } from 'react';
import { Briefcase, Calendar, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceMutation } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogActions, DialogHero, DialogShell } from '@/components/ui/dialog-shell';
import { FieldGroup, IconField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateProjectDialogProps {
    clientId: string;
    trigger?: React.ReactNode;
}

export default function CreateProjectDialog({ clientId, trigger }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createMutation } = useWorkspaceMutation('projects');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formData.name) return;

        setLoading(true);
        try {
            await createMutation.mutateAsync({
                clientId,
                name: formData.name,
                description: formData.description,
                status: 'active',
                dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
                startDate: new Date(),
                tagIds: [],
            });
            toast.success('Proyecto creado correctamente');
            setOpen(false);
            setFormData({ name: '', description: '', dueDate: '' });
        } catch (error) {
            console.error(error);
            toast.error('Error al crear el proyecto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-emerald-600">
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogShell size="md">
                <DialogHero
                    icon={<Briefcase className="h-7 w-7" />}
                    title="Nuevo Proyecto"
                    description="Define el nuevo desafio para este cliente."
                    tone="indigo"
                />

                <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                    <div className="space-y-6">
                        <FieldGroup label="Nombre del Proyecto">
                            <IconField icon={<Tag className="h-5 w-5" />}>
                                <Input
                                    required
                                    placeholder="Ej. Rediseño Web Corporativo"
                                    className="pl-12"
                                    value={formData.name}
                                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                />
                            </IconField>
                        </FieldGroup>

                        <FieldGroup label="Fecha Limite (Opcional)">
                            <IconField icon={<Calendar className="h-5 w-5" />}>
                                <Input
                                    type="date"
                                    className="pl-12"
                                    value={formData.dueDate}
                                    onChange={(event) => setFormData({ ...formData, dueDate: event.target.value })}
                                />
                            </IconField>
                        </FieldGroup>

                        <FieldGroup label="Descripcion corta">
                            <Textarea
                                placeholder="De que trata este proyecto?"
                                value={formData.description}
                                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                            />
                        </FieldGroup>
                    </div>

                    <DialogActions
                        onCancel={() => setOpen(false)}
                        confirmLabel="Crear Proyecto"
                        confirmVariant="confirm"
                        disabled={!formData.name}
                        isLoading={loading}
                    />
                </form>
            </DialogShell>
        </Dialog>
    );
}
