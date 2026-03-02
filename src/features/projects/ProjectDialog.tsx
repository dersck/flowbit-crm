import { useEffect, useState } from 'react';
import { Briefcase, Calendar, Check, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import type { Client, Project } from '@/types';
import { useWorkspaceMutation, useWorkspaceQuery } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DialogActions, DialogHero, DialogShell } from '@/components/ui/dialog-shell';
import { FieldGroup, IconField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ProjectDialogProps {
    clientId?: string;
    project?: Project;
    trigger?: React.ReactNode;
}

export default function ProjectDialog({ clientId: initialClientId, project, trigger }: ProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createMutation, updateMutation } = useWorkspaceMutation('projects');
    const { data: clients } = useWorkspaceQuery<Client>('clients', 'all-clients-for-selector');

    const [formData, setFormData] = useState({
        name: project?.name || '',
        description: project?.description || '',
        dueDate: project?.dueDate instanceof Date ? project.dueDate.toISOString().split('T')[0] : '',
        clientId: project?.clientId || initialClientId || '',
    });

    useEffect(() => {
        if (!open) return;

        setFormData({
            name: project?.name || '',
            description: project?.description || '',
            dueDate: project?.dueDate instanceof Date ? project.dueDate.toISOString().split('T')[0] : '',
            clientId: project?.clientId || initialClientId || '',
        });
    }, [initialClientId, open, project]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.name || !formData.clientId) {
            toast.error('Por favor completa los campos obligatorios');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                clientId: formData.clientId,
                dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
            };

            if (project) {
                await updateMutation.mutateAsync({
                    id: project.id,
                    data: payload,
                });
                toast.success('Proyecto actualizado correctamente');
            } else {
                await createMutation.mutateAsync({
                    ...payload,
                    status: 'active',
                    startDate: new Date(),
                    tagIds: [],
                });
                toast.success('Proyecto creado correctamente');
            }

            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(project ? 'Error al actualizar el proyecto' : 'Error al crear el proyecto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="pagePrimary" className="flex h-12 gap-3 px-8">
                        <Plus className="h-5 w-5" />
                        {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                    </Button>
                )}
            </DialogTrigger>

            <DialogShell size="lg">
                <DialogHero
                    icon={<Briefcase className="h-7 w-7" />}
                    title={project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                    description={
                        project
                            ? 'Actualiza los detalles del proyecto.'
                            : 'Define el nuevo desafio para este cliente.'
                    }
                    tone="emerald"
                />

                <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                    <div className="space-y-6">
                        <FieldGroup label="Cliente Solicitante" asFieldset>
                            <ul className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto p-1 scrollbar-hide">
                                {clients?.sort((a, b) => a.name.localeCompare(b.name)).map((client) => (
                                    <li key={client.id}>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, clientId: client.id })}
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all",
                                                formData.clientId === client.id
                                                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-900"
                                                    : "border-slate-50 bg-slate-50/30 text-slate-500 hover:border-slate-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-white text-xs font-black">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold tracking-tight">{client.name}</span>
                                            </div>
                                            {formData.clientId === client.id ? <Check className="h-4 w-4 text-indigo-600" /> : null}
                                        </button>
                                    </li>
                                ))}
                                {(!clients || clients.length === 0) ? (
                                    <li className="p-4 text-center text-xs font-bold italic text-slate-400">
                                        No hay clientes registrados
                                    </li>
                                ) : null}
                            </ul>
                        </FieldGroup>

                        <FieldGroup label="Nombre del Proyecto" required>
                            {(fieldProps) => (
                                <IconField icon={<Tag className="h-5 w-5" />} {...fieldProps}>
                                    <Input
                                        placeholder="Ej. Rediseno Web Corporativo"
                                        className="pl-12"
                                        value={formData.name}
                                        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                    />
                                </IconField>
                            )}
                        </FieldGroup>

                        <FieldGroup label="Fecha Limite (Opcional)">
                            {(fieldProps) => (
                                <IconField icon={<Calendar className="h-5 w-5" />} {...fieldProps}>
                                    <Input
                                        type="date"
                                        className="pl-12"
                                        value={formData.dueDate}
                                        onChange={(event) => setFormData({ ...formData, dueDate: event.target.value })}
                                    />
                                </IconField>
                            )}
                        </FieldGroup>

                        <FieldGroup label="Descripcion corta">
                            {(fieldProps) => (
                                <Textarea
                                    {...fieldProps}
                                    placeholder="De que trata este proyecto?"
                                    className="min-h-[100px] resize-none p-4"
                                    value={formData.description}
                                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                                />
                            )}
                        </FieldGroup>
                    </div>

                    <DialogActions
                        onCancel={() => setOpen(false)}
                        confirmLabel={project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                        disabled={loading || !formData.name || !formData.clientId}
                        isLoading={loading}
                    />
                </form>
            </DialogShell>
        </Dialog>
    );
}
