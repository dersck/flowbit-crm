import { useState } from 'react';
import { Briefcase, CheckCircle2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';
import { DialogActions, DialogHero, DialogShell } from '@/components/ui/dialog-shell';
import { FieldGroup } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control';
import { useWorkspaceMutation, useWorkspaceQuery } from '@/hooks/useFirestore';
import type { Client } from '@/types';

type Tab = 'task' | 'client' | 'project';

interface QuickAddModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const selectClassName =
    'flex h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-slate-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-500/10';

export default function QuickAddModal({ open, onOpenChange }: QuickAddModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('task');
    const [loading, setLoading] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectClientId, setProjectClientId] = useState('');

    const { data: clients } = useWorkspaceQuery<Client>('clients', 'quick-add-clients');
    const { createMutation: createTask } = useWorkspaceMutation('tasks');
    const { createMutation: createClient } = useWorkspaceMutation('clients');
    const { createMutation: createProject } = useWorkspaceMutation('projects');

    const resetForm = () => {
        setTaskTitle('');
        setClientName('');
        setProjectName('');
        setProjectClientId('');
    };

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (activeTab === 'task') {
                await createTask.mutateAsync({
                    title: taskTitle,
                    status: 'inbox',
                    priority: 2,
                });
                toast.success('Tarea anadida a la bandeja');
            } else if (activeTab === 'client') {
                await createClient.mutateAsync({
                    name: clientName,
                    stage: 'nuevo',
                    contact: {},
                    tagIds: [],
                });
                toast.success('Cliente registrado');
            } else {
                await createProject.mutateAsync({
                    name: projectName,
                    status: 'active',
                    clientId: projectClientId,
                    tagIds: [],
                });
                toast.success('Proyecto iniciado');
            }

            resetForm();
            onOpenChange(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            toast.error(`Error: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const isSubmitDisabled =
        loading ||
        (activeTab === 'task' && !taskTitle) ||
        (activeTab === 'client' && !clientName) ||
        (activeTab === 'project' && (!projectName || !projectClientId));

    const currentTitle =
        activeTab === 'task'
            ? 'Nueva Tarea'
            : activeTab === 'client'
                ? 'Nuevo Cliente'
                : 'Nuevo Proyecto';

    const currentDescription =
        activeTab === 'task'
            ? 'Crea una tarea rapida para tu bandeja.'
            : activeTab === 'client'
                ? 'Registra un nuevo cliente sin salir de tu flujo.'
                : 'Crea un proyecto global y vinculalo a un cliente existente.';

    const CurrentIcon = activeTab === 'task' ? CheckCircle2 : activeTab === 'client' ? Users : Briefcase;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogShell size="md" className="p-0">
                <div className="border-b border-slate-100 bg-slate-50 p-6">
                    <DialogHero
                        icon={<CurrentIcon className="h-7 w-7" />}
                        title={currentTitle}
                        description={currentDescription}
                        tone={activeTab === 'project' ? 'indigo' : activeTab === 'client' ? 'slate' : 'emerald'}
                    />

                    <SegmentedControl className="mt-6 bg-white">
                        <SegmentedControlItem
                            active={activeTab === 'task'}
                            onClick={() => setActiveTab('task')}
                            icon={CheckCircle2}
                            label="Tarea"
                            className="flex-1"
                        />
                        <SegmentedControlItem
                            active={activeTab === 'client'}
                            onClick={() => setActiveTab('client')}
                            icon={Users}
                            label="Cliente"
                            className="flex-1"
                        />
                        <SegmentedControlItem
                            active={activeTab === 'project'}
                            onClick={() => setActiveTab('project')}
                            icon={Briefcase}
                            label="Proyecto"
                            className="flex-1"
                        />
                    </SegmentedControl>
                </div>

                <form onSubmit={handleCreate} className="space-y-8 p-8">
                    {activeTab === 'task' ? (
                        <div className="animate-in slide-in-from-bottom-2 fade-in space-y-4 duration-300">
                            <FieldGroup label="Titulo de la Tarea">
                                <Input
                                    placeholder="Ej. Revisar contrato de Acme Corp"
                                    value={taskTitle}
                                    onChange={(event) => setTaskTitle(event.target.value)}
                                    required
                                    className="h-12 text-lg"
                                />
                            </FieldGroup>
                        </div>
                    ) : null}

                    {activeTab === 'client' ? (
                        <div className="animate-in slide-in-from-bottom-2 fade-in space-y-4 duration-300">
                            <FieldGroup label="Nombre del Cliente o Empresa">
                                <Input
                                    placeholder="Ej. Acme Corp"
                                    value={clientName}
                                    onChange={(event) => setClientName(event.target.value)}
                                    required
                                    className="h-12 text-lg"
                                />
                            </FieldGroup>
                        </div>
                    ) : null}

                    {activeTab === 'project' ? (
                        <div className="animate-in slide-in-from-bottom-2 fade-in space-y-4 duration-300">
                            <FieldGroup label="Nombre del Proyecto">
                                <Input
                                    placeholder="Ej. Rediseno Web 2026"
                                    value={projectName}
                                    onChange={(event) => setProjectName(event.target.value)}
                                    required
                                    className="h-12 text-lg"
                                />
                            </FieldGroup>

                            <FieldGroup label="Cliente Vinculado">
                                <select
                                    value={projectClientId}
                                    onChange={(event) => setProjectClientId(event.target.value)}
                                    className={selectClassName}
                                    required
                                >
                                    <option value="">Selecciona un cliente</option>
                                    {clients?.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                            </FieldGroup>

                            {clients?.length === 0 ? (
                                <p className="text-sm font-bold italic text-slate-400">
                                    Primero necesitas crear al menos un cliente para iniciar un proyecto.
                                </p>
                            ) : null}
                        </div>
                    ) : null}

                    <DialogActions
                        onCancel={() => onOpenChange(false)}
                        confirmLabel={activeTab === 'task' ? 'Crear Tarea' : activeTab === 'client' ? 'Crear Cliente' : 'Crear Proyecto'}
                        confirmVariant="confirm"
                        disabled={isSubmitDisabled}
                        isLoading={loading}
                    />
                </form>
            </DialogShell>
        </Dialog>
    );
}
