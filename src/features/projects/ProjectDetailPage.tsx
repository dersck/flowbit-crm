import { Link, useParams } from 'react-router-dom';
import { where } from 'firebase/firestore';
import { differenceInCalendarDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock,
    Layout,
    Plus,
    Tag,
    User,
} from 'lucide-react';
import { toast } from 'sonner';
import PriorityBadge from '@/components/common/PriorityBadge';
import StatCard from '@/components/common/StatCard';
import { BackLink } from '@/components/ui/back-link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FieldGroup } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control';
import { Surface } from '@/components/ui/surface';
import { useEntityQuery, useWorkspaceMutation, useWorkspaceQuery } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import type { Client, Project, Task } from '@/types';
import { PROJECT_STATUS_CONFIG, PROJECT_STATUS_ORDER } from './projectConstants';
import TaskDialog from '../tasks/TaskDialog';

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: project, isLoading: isProjectLoading } = useEntityQuery<Project>('projects', id);
    const { data: client } = useEntityQuery<Client>('clients', project?.clientId);
    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'project-tasks', [
        where('projectId', '==', id),
    ]);

    const { updateMutation: updateTaskMutation } = useWorkspaceMutation('tasks');
    const { updateMutation: updateProjectMutation } = useWorkspaceMutation('projects');

    const completedTasks = tasks?.filter((task) => task.status === 'done').length || 0;
    const pendingTasks = tasks?.filter((task) => task.status !== 'done').length || 0;
    const progress = tasks?.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
    const remainingDays = project?.dueDate ? differenceInCalendarDays(project.dueDate, new Date()) : null;

    const handleTaskToggle = async (task: Task) => {
        try {
            await updateTaskMutation.mutateAsync({
                id: task.id,
                data: {
                    status: task.status === 'done' ? 'todo' : 'done',
                    completedAt: task.status === 'done' ? null : new Date(),
                },
            });
            toast.success(task.status === 'done' ? 'Tarea reabierta' : 'Tarea completada');
        } catch {
            toast.error('Error al actualizar tarea');
        }
    };

    const handleStatusChange = async (newStatus: Project['status']) => {
        try {
            await updateProjectMutation.mutateAsync({
                id: id!,
                data: { status: newStatus },
            });
            toast.success('Estado del proyecto actualizado');
        } catch {
            toast.error('Error al actualizar estado');
        }
    };

    if (isProjectLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-12 w-48 rounded-2xl bg-slate-100" />
                <div className="h-64 rounded-[2.5rem] border border-slate-100 bg-white" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="py-20">
                <Surface variant="dashed" className="mx-auto max-w-2xl">
                    <EmptyState
                        icon={Briefcase}
                        title="Proyecto no encontrado"
                        description="Vuelve al tablero de proyectos para seleccionar otro registro."
                    />
                    <div className="pb-10 text-center">
                        <Button asChild variant="link" className="font-bold text-emerald-600">
                            <Link to="/projects">Volver a proyectos</Link>
                        </Button>
                    </div>
                </Surface>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 pb-20">
            <div className="space-y-4">
                <BackLink to="/projects" label="Volver a proyectos" />

                <PageHeader
                    title={project.name}
                    subtitle={client ? `Cliente: ${client.name}` : 'Cliente vinculado al proyecto'}
                    icon={(
                        <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                            <Briefcase className="h-7 w-7" />
                        </div>
                    )}
                    actions={(
                        <SegmentedControl className="bg-white shadow-sm">
                            {PROJECT_STATUS_ORDER.map((status) => (
                                <SegmentedControlItem
                                    key={status}
                                    active={project.status === status}
                                    onClick={() => handleStatusChange(status)}
                                    label={PROJECT_STATUS_CONFIG[status].label}
                                    className="px-6 py-2.5 text-[10px] uppercase tracking-widest"
                                />
                            ))}
                        </SegmentedControl>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Completado"
                            value={`${progress}%`}
                            icon={CheckCircle2}
                            tone="emerald"
                        />
                        <StatCard
                            label="Pendientes"
                            value={pendingTasks}
                            icon={Layout}
                            tone="indigo"
                        />
                        <StatCard
                            label="Dias Restantes"
                            value={remainingDays ?? '-'}
                            icon={Calendar}
                            tone="slate"
                            badge={
                                remainingDays !== null ? (
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {remainingDays >= 0 ? 'hasta entrega' : 'atrasado'}
                                    </span>
                                ) : null
                            }
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-3 text-xl font-black uppercase tracking-tight text-slate-900">
                                <Layout className="h-5 w-5 text-indigo-600" />
                                Hitos y Tareas
                            </h2>
                            <TaskDialog
                                clientId={project.clientId}
                                projectId={project.id}
                                trigger={(
                                    <Button variant="pagePrimary" className="h-10 gap-2 px-4">
                                        <Plus className="h-4 w-4" />
                                        Nueva Tarea
                                    </Button>
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            {tasks && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            'group flex items-center gap-5 rounded-[1.5rem] border p-5 transition-all',
                                            task.status === 'done'
                                                ? 'border-slate-100 bg-slate-50/50 opacity-60'
                                                : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50'
                                        )}
                                    >
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleTaskToggle(task)}
                                            className={cn(
                                                'h-8 w-8 rounded-xl border transition-all',
                                                task.status === 'done'
                                                    ? 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-500 hover:text-white'
                                                    : 'border-slate-200 text-slate-200 hover:border-indigo-500 hover:bg-white hover:text-indigo-500'
                                            )}
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                        </Button>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={cn(
                                                    'font-bold tracking-tight text-slate-800 transition-all',
                                                    task.status === 'done' && 'line-through text-slate-400'
                                                )}
                                            >
                                                {task.title}
                                            </p>
                                            <div className="mt-1.5 flex items-center gap-3">
                                                {task.scheduledDate ? (
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        {task.scheduledDate}
                                                    </span>
                                                ) : null}
                                                {task.priority === 3 ? (
                                                    <PriorityBadge priority={task.priority} />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Surface variant="dashed">
                                    <EmptyState
                                        icon={Layout}
                                        title="Sin tareas"
                                        description="No hay tareas asignadas a este proyecto."
                                    />
                                    <div className="pb-10 text-center">
                                        <TaskDialog
                                            clientId={project.clientId}
                                            projectId={project.id}
                                            trigger={(
                                                <Button variant="outline" className="rounded-2xl font-bold">
                                                    Crear la primera tarea
                                                </Button>
                                            )}
                                        />
                                    </div>
                                </Surface>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <Surface variant="premiumBordered" className="overflow-hidden rounded-[2.5rem] shadow-xl shadow-slate-100">
                        <div className="border-b border-slate-50 p-8">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Informacion General</h2>
                        </div>
                        <div className="space-y-6 p-8">
                            <FieldGroup label="Fecha de Inicio">
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold text-slate-700">
                                    <Calendar className="h-5 w-5 text-indigo-500" />
                                    {project.startDate ? format(project.startDate, 'dd MMM, yyyy', { locale: es }) : 'No definida'}
                                </div>
                            </FieldGroup>
                            <FieldGroup label="Entrega Estimada">
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold text-slate-700">
                                    <Calendar className="h-5 w-5 text-rose-500" />
                                    {project.dueDate ? format(project.dueDate, 'dd MMM, yyyy', { locale: es }) : 'No definida'}
                                </div>
                            </FieldGroup>
                            {project.description ? (
                                <FieldGroup label="Descripcion">
                                    <p className="rounded-2xl border border-slate-100 p-4 text-sm font-medium leading-relaxed text-slate-500">
                                        {project.description}
                                    </p>
                                </FieldGroup>
                            ) : null}
                            {project.tagIds.length > 0 ? (
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {project.tagIds.map((tagId) => (
                                        <span
                                            key={tagId}
                                            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {tagId}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </Surface>

                    {client ? (
                        <Button asChild variant="ghost" className="group h-auto w-full rounded-none p-0 hover:bg-transparent">
                            <Link to={`/clients/${client.id}`}>
                                <Surface variant="dark" className="rounded-[2.5rem] p-8 transition-transform hover:-translate-y-2">
                                    <div className="mb-4 flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors group-hover:bg-emerald-500 group-hover:border-emerald-500">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Ver Cliente</h3>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 opacity-80">{client.name}</p>
                                </Surface>
                            </Link>
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
