import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import ProjectBoardCard from '@/components/common/ProjectBoardCard';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { PageHeader } from '@/components/ui/page-header';
import { Surface } from '@/components/ui/surface';
import { useWorkspaceMutation, useWorkspaceQuery } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import type { Client, Project, Task } from '@/types';
import { PROJECT_STATUS_CONFIG, PROJECT_STATUS_ORDER } from './projectConstants';

export default function ProjectsPage() {
    const { data: projects, isLoading } = useWorkspaceQuery<Project>('projects', 'all-projects');
    const { data: clients } = useWorkspaceQuery<Client>('clients', 'project-board-clients');
    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'project-board-tasks');
    const { deleteMutation } = useWorkspaceMutation('projects');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const getProjectsByStatus = (status: Project['status']) => projects?.filter((project) => project.status === status) || [];
    const clientNames = useMemo(
        () => new Map((clients || []).map((client) => [client.id, client.name])),
        [clients]
    );
    const projectProgress = useMemo(() => {
        const progressMap = new Map<string, number>();

        (projects || []).forEach((project) => {
            const projectTasks = (tasks || []).filter((task) => task.projectId === project.id);

            if (projectTasks.length === 0) {
                progressMap.set(project.id, project.status === 'done' ? 100 : 0);
                return;
            }

            const completedTasks = projectTasks.filter((task) => task.status === 'done').length;
            progressMap.set(project.id, Math.round((completedTasks / projectTasks.length) * 100));
        });

        return progressMap;
    }, [projects, tasks]);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutateAsync(deleteId);
            toast.success('Proyecto eliminado');
            setDeleteId(null);
        } catch {
            toast.error('Error al eliminar');
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-10rem)] gap-8 animate-pulse">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex-1 rounded-[2.5rem] border border-slate-100 bg-white" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col space-y-8">
            <PageHeader
                title="Proyectos"
                subtitle="Gestion visual del flujo de trabajo."
                actions={(
                    <Button variant="pagePrimary" className="h-11 gap-3 px-6">
                        <Plus className="h-5 w-5" />
                        Nuevo Proyecto
                    </Button>
                )}
            />

            <div className="grid flex-1 grid-cols-1 gap-6 pb-8 lg:grid-cols-3">
                {PROJECT_STATUS_ORDER.map((status) => {
                    const config = PROJECT_STATUS_CONFIG[status];
                    const projectsByStatus = getProjectsByStatus(status);

                    return (
                        <div key={status} className="flex min-w-0 flex-col">
                            <div className="mb-4 flex items-center justify-between px-3">
                                <div className="flex items-center gap-3">
                                    <div className={cn('h-3 w-3 rounded-full shadow-sm', config.bgClassName)} />
                                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">{config.label}</h2>
                                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-black text-slate-500 shadow-sm">
                                        {projectsByStatus.length}
                                    </span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-900">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <Surface
                                variant="premiumBordered"
                                className="flex-1 space-y-4 border-slate-200/50 bg-slate-100/30 p-3.5 backdrop-blur-sm"
                            >
                                {projectsByStatus.map((project) => (
                                    <ProjectBoardCard
                                        key={project.id}
                                        project={project}
                                        clientName={clientNames.get(project.clientId)}
                                        onDelete={setDeleteId}
                                        progress={projectProgress.get(project.id) ?? 0}
                                    />
                                ))}

                                {projectsByStatus.length === 0 ? (
                                    <Surface variant="dashed" className="flex min-h-[220px] items-center justify-center border-slate-200/60 bg-white/80 p-6">
                                        <div className="text-center">
                                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-slate-50">
                                                <Plus className="h-7 w-7 text-slate-200" />
                                            </div>
                                            <p className="text-lg font-black uppercase tracking-tight text-slate-900">
                                                Sin proyectos
                                            </p>
                                            <p className="mt-2 text-sm font-bold italic text-slate-400">
                                                No hay proyectos en {config.label.toLowerCase()}.
                                            </p>
                                        </div>
                                    </Surface>
                                ) : null}
                            </Surface>
                        </div>
                    );
                })}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar proyecto?"
                description="Se borraran tambien todas las tareas asociadas a este proyecto. Esta accion es irreversible."
                confirmText="Eliminar proyecto"
                cancelText="Mantener"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
