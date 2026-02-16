import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    CheckCircle2,
    Users,
    Briefcase
} from 'lucide-react';
import { useWorkspaceMutation } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'task' | 'client' | 'project' | 'activity';

interface QuickAddModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function QuickAddModal({ open, onOpenChange }: QuickAddModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('task');
    const [loading, setLoading] = useState(false);

    // Create mutations
    const { createMutation: createTask } = useWorkspaceMutation('tasks');
    const { createMutation: createClient } = useWorkspaceMutation('clients');
    const { createMutation: createProject } = useWorkspaceMutation('projects');

    // Form states
    const [taskTitle, setTaskTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [projectName, setProjectName] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (activeTab === 'task') {
                await createTask.mutateAsync({
                    title: taskTitle,
                    status: 'inbox',
                    priority: 2,
                });
                toast.success('Tarea añadida a la bandeja');
                setTaskTitle('');
            } else if (activeTab === 'client') {
                await createClient.mutateAsync({
                    name: clientName,
                    stage: 'prospecto',
                    contact: {},
                    tagIds: [],
                });
                toast.success('Cliente registrado');
                setClientName('');
            } else if (activeTab === 'project') {
                await createProject.mutateAsync({
                    name: projectName,
                    status: 'active',
                    clientId: 'pending',
                    tagIds: [],
                });
                toast.success('Proyecto iniciado');
                setProjectName('');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
                <div className="bg-slate-50 p-6 border-b border-slate-100">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Acceso Rápido</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Crea elementos rápidamente desde cualquier lugar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex bg-white p-1 rounded-2xl mt-6 border border-slate-200">
                        <TabButton
                            active={activeTab === 'task'}
                            onClick={() => setActiveTab('task')}
                            icon={CheckCircle2}
                            label="Tarea"
                        />
                        <TabButton
                            active={activeTab === 'client'}
                            onClick={() => setActiveTab('client')}
                            icon={Users}
                            label="Cliente"
                        />
                        <TabButton
                            active={activeTab === 'project'}
                            onClick={() => setActiveTab('project')}
                            icon={Briefcase}
                            label="Proyecto"
                        />
                    </div>
                </div>

                <div className="p-8 bg-white">
                    <form onSubmit={handleCreate} className="space-y-6">
                        {activeTab === 'task' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Título de la Tarea</label>
                                    <Input
                                        placeholder="Ej. Revisar contrato de Acme Corp"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        required
                                        className="h-12 text-lg rounded-xl border-slate-200 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'client' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nombre del Cliente / Empresa</label>
                                    <Input
                                        placeholder="Ej. Acme Corp"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        required
                                        className="h-12 text-lg rounded-xl border-slate-200"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'project' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nombre del Proyecto</label>
                                    <Input
                                        placeholder="Ej. Rediseño Web 2024"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        required
                                        className="h-12 text-lg rounded-xl border-slate-200"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 font-bold"
                            >
                                {loading ? 'Creando...' : 'Crear Todo'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
                active ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            )}
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </button>
    );
}
