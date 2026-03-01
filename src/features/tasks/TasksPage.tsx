import { useMemo, useState, type ComponentType } from 'react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Inbox,
    MoreHorizontal,
    Star,
    Trash2,
} from 'lucide-react';
import { isPast, isToday } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/empty-state';
import { MetaChip } from '@/components/ui/meta-chip';
import { PageHeader } from '@/components/ui/page-header';
import { Surface } from '@/components/ui/surface';
import PriorityBadge from '@/components/common/PriorityBadge';
import { useWorkspaceMutation, useWorkspaceQuery } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';
import TaskDialog from './TaskDialog';

type TaskFilter = 'inbox' | 'today' | 'upcoming' | 'done';

const filterMeta: Record<TaskFilter, { title: string; subtitle: string }> = {
    inbox: {
        title: 'Bandeja',
        subtitle: 'Captura tareas rapidas antes de ordenarlas.',
    },
    today: {
        title: 'Para Hoy',
        subtitle: 'Prioridades activas para el dia.',
    },
    upcoming: {
        title: 'Proximo',
        subtitle: 'Trabajo programado para despues.',
    },
    done: {
        title: 'Completado',
        subtitle: 'Historial de ejecucion reciente.',
    },
};

export default function TasksPage() {
    const [filter, setFilter] = useState<TaskFilter>('today');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data: tasks, isLoading } = useWorkspaceQuery<Task>('tasks', 'all-tasks');
    const { updateMutation, deleteMutation } = useWorkspaceMutation('tasks');

    const filteredTasks = useMemo(() => {
        return tasks?.filter((task) => {
            switch (filter) {
                case 'inbox':
                    return task.status === 'inbox';
                case 'today': {
                    if (!task.scheduledDate) return false;
                    const date = new Date(task.scheduledDate);
                    return (isToday(date) || isPast(date)) && task.status !== 'done';
                }
                case 'upcoming':
                    if (!task.scheduledDate) return false;
                    return !isToday(new Date(task.scheduledDate)) && !isPast(new Date(task.scheduledDate)) && task.status !== 'done';
                case 'done':
                    return task.status === 'done';
                default:
                    return true;
            }
        }) || [];
    }, [filter, tasks]);

    const toggleTaskStatus = async (task: Task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';

        try {
            await updateMutation.mutateAsync({
                id: task.id,
                data: {
                    status: newStatus,
                    completedAt: newStatus === 'done' ? new Date() : null,
                },
            });
            toast.success(newStatus === 'done' ? 'Tarea completada' : 'Tarea reabierta');
        } catch {
            toast.error('Error al actualizar tarea');
        }
    };

    const deleteTask = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutateAsync(deleteId);
            toast.success('Tarea eliminada');
            setDeleteId(null);
        } catch {
            toast.error('Error al eliminar');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="h-16 rounded-2xl border border-slate-100 bg-white" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col gap-10 lg:flex-row">
            <Surface variant="premiumBordered" className="w-full rounded-[2rem] p-3 lg:sticky lg:top-6 lg:w-56 lg:self-start">
                <div className="flex flex-col gap-1.5">
                    <h2 className="mb-4 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Organizacion</h2>
                    <TaskNavLink
                        icon={Inbox}
                        label="Bandeja"
                        active={filter === 'inbox'}
                        onClick={() => setFilter('inbox')}
                        count={tasks?.filter((task) => task.status === 'inbox').length}
                    />
                    <TaskNavLink
                        icon={Star}
                        label="Para Hoy"
                        active={filter === 'today'}
                        onClick={() => setFilter('today')}
                        color="text-amber-500"
                        count={tasks?.filter((task) => task.scheduledDate && (isToday(new Date(task.scheduledDate)) || isPast(new Date(task.scheduledDate))) && task.status !== 'done').length}
                    />
                    <TaskNavLink
                        icon={Calendar}
                        label="Proximo"
                        active={filter === 'upcoming'}
                        onClick={() => setFilter('upcoming')}
                        color="text-indigo-500"
                    />
                    <TaskNavLink
                        icon={CheckCircle2}
                        label="Completado"
                        active={filter === 'done'}
                        onClick={() => setFilter('done')}
                        color="text-emerald-500"
                    />
                </div>
            </Surface>

            <div className="max-w-4xl flex-1 space-y-8">
                <PageHeader
                    title={filterMeta[filter].title}
                    subtitle={`${filteredTasks.length} tareas encontradas. ${filterMeta[filter].subtitle}`}
                    actions={<TaskDialog />}
                />

                <div className="space-y-3">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-5 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-slate-200/40"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleTaskStatus(task)}
                                className={cn(
                                    'h-6 w-6 rounded-full border-2 transition-all duration-300',
                                    task.status === 'done'
                                        ? 'border-emerald-500 bg-emerald-500 p-0 text-white hover:bg-emerald-500 hover:text-white'
                                        : 'border-slate-300 p-0 text-transparent hover:border-emerald-500 hover:bg-transparent hover:text-emerald-500/30'
                                )}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </Button>

                            <div className="min-w-0 flex-1">
                                <h3
                                    className={cn(
                                        'text-xl font-bold tracking-tighter text-slate-900 transition-all',
                                        task.status === 'done' && 'line-through text-slate-400 opacity-60'
                                    )}
                                >
                                    {task.title}
                                </h3>
                                <div className="mt-2.5 flex items-center gap-4">
                                    {task.projectId ? (
                                        <MetaChip asChild tone="indigo" interactive>
                                            <Link to={`/projects/${task.projectId}`}>Proyecto</Link>
                                        </MetaChip>
                                    ) : task.clientId ? (
                                        <MetaChip asChild tone="emerald" interactive>
                                            <Link to={`/clients/${task.clientId}`}>Cliente</Link>
                                        </MetaChip>
                                    ) : null}
                                    {task.scheduledDate ? (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            {task.scheduledDate}
                                        </span>
                                    ) : null}
                                    {task.priority === 3 ? (
                                        <PriorityBadge priority={task.priority} />
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex translate-x-2 items-center gap-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:bg-slate-100">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-500"
                                    onClick={() => setDeleteId(task.id)}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filteredTasks.length === 0 ? (
                        <Surface variant="dashed" className="border-slate-100 py-8">
                            <EmptyState
                                icon={Inbox}
                                title="Todo listo"
                                description="No hay tareas pendientes en esta categoria."
                            />
                        </Surface>
                    ) : null}
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={deleteTask}
                title="Eliminar tarea?"
                description="Esta accion quitara la tarea de tu lista permanentemente."
                confirmText="Eliminar tarea"
                cancelText="Mantener"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}

function TaskNavLink({
    icon: Icon,
    label,
    active,
    onClick,
    color,
    count,
}: {
    icon: ComponentType<{ className?: string }>
    label: string
    active: boolean
    onClick: () => void
    color?: string
    count?: number
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            className={cn(
                'h-auto w-full justify-between rounded-xl px-4 py-3 text-sm font-bold tracking-tight transition-all',
                active
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-900 hover:text-white'
                    : 'border border-transparent text-slate-500 hover:border-slate-100 hover:bg-white hover:text-slate-900'
            )}
        >
            <div className="flex items-center gap-4">
                <Icon className={cn('h-5 w-5', active ? 'text-white' : color || 'text-slate-400')} />
                <span>{label}</span>
            </div>
            {count !== undefined && count > 0 ? (
                <span
                    className={cn(
                        'rounded-lg px-2 py-0.5 text-[10px] font-black',
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    )}
                >
                    {count}
                </span>
            ) : null}
        </Button>
    );
}
