import { useMemo, useState, type UIEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { where } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Briefcase,
    Building2,
    Calendar,
    ChevronDown,
    Clock,
    Edit2,
    Landmark,
    Mail,
    MessageSquare,
    MoreHorizontal,
    Phone,
    Plus,
    Share2,
    Timer,
    Trash2,
    TrendingUp,
    Users,
    Video,
    Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Activity, Client, Project, Task } from '@/types';
import { useEntityQuery, useWorkspaceMutation, useWorkspaceQuery } from '@/hooks/useFirestore';
import { BackLink } from '@/components/ui/back-link';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/empty-state';
import { MetaChip } from '@/components/ui/meta-chip';
import { Surface } from '@/components/ui/surface';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActionTile from '@/components/common/ActionTile';
import ClientAvatar from '@/components/common/ClientAvatar';
import ContactItem from '@/components/common/ContactItem';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import ActivityDialog from './ActivityDialog';
import ClientDialog from './ClientDialog';
import { CLIENT_SOURCE_OPTIONS } from './clientConstants';
import CreateProjectDialog from '../projects/CreateProjectDialog';
import { PROJECT_STATUS_CONFIG } from '../projects/projectConstants';
import TaskDialog from '../tasks/TaskDialog';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
});

const compactCurrencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
});

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [showIndicator, setShowIndicator] = useState(true);
    const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
    const [isDeletingActivity, setIsDeletingActivity] = useState(false);

    const { data: client, isLoading: isClientLoading } = useEntityQuery<Client>('clients', id);
    const { data: projects } = useWorkspaceQuery<Project>('projects', 'client-projects', [
        where('clientId', '==', id),
    ]);
    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'client-tasks', [
        where('clientId', '==', id),
    ]);
    const { data: activitiesData } = useWorkspaceQuery<Activity>('activities', `client-${id}-activities`, [
        where('clientId', '==', id),
    ]);
    const { deleteMutation } = useWorkspaceMutation('activities');

    const activities = activitiesData?.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date.getTime() : 0;
        const dateB = b.date instanceof Date ? b.date.getTime() : 0;
        return dateB - dateA;
    });
    const projectTaskStats = useMemo(() => {
        const statsMap = new Map<string, { total: number; completed: number; progress: number }>();

        (projects || []).forEach((project) => {
            const projectTasks = (tasks || []).filter((task) => task.projectId === project.id);
            const completedTasks = projectTasks.filter((task) => task.status === 'done').length;

            if (projectTasks.length === 0) {
                statsMap.set(project.id, {
                    total: 0,
                    completed: 0,
                    progress: project.status === 'done' ? 100 : 0,
                });
                return;
            }

            statsMap.set(project.id, {
                total: projectTasks.length,
                completed: completedTasks,
                progress: Math.round((completedTasks / projectTasks.length) * 100),
            });
        });

        return statsMap;
    }, [projects, tasks]);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        setShowIndicator(event.currentTarget.scrollTop <= 10);
    };

    if (isClientLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-12 w-48 rounded-2xl bg-slate-100" />
                <div className="h-64 rounded-[2.5rem] border border-slate-100 bg-white" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="py-20">
                <Surface variant="dashed" className="mx-auto max-w-2xl">
                    <EmptyState
                        icon={Users}
                        title="Cliente no encontrado"
                        description="Vuelve al directorio para seleccionar otro registro."
                    />
                    <div className="pb-10 text-center">
                        <Button asChild variant="link" className="font-bold text-emerald-600">
                            <Link to="/clients">Volver al directorio</Link>
                        </Button>
                    </div>
                </Surface>
            </div>
        );
    }

    const sourceLabel = client.source
        ? CLIENT_SOURCE_OPTIONS.find((option) => option.id === client.source)?.label ?? client.source
        : null;
    const activeProjectsCount = projects?.filter((project) => project.status === 'active').length || 0;
    const urgentTasksCount = tasks?.filter((task) => task.priority === 3 && task.status !== 'done').length || 0;
    const rhythmDays = activities && activities.length > 0
        ? Math.floor((new Date().getTime() - activities[0].date.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-16">
            <div className="flex items-center justify-between">
                <BackLink to="/clients" label="Volver" />
                <div className="flex gap-3">
                    <ClientDialog
                        client={client}
                        trigger={(
                            <Button variant="outline" className="h-11 rounded-2xl bg-white px-5 font-bold">
                                Editar Perfil
                            </Button>
                        )}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="confirm" className="h-11 px-5 font-bold shadow-lg shadow-emerald-100">
                                Accion rapida
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 p-2 shadow-xl">
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="email"
                                email={client.contact.email}
                                trigger={(
                                    <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-pointer gap-3 rounded-xl px-4 py-3 font-bold">
                                        <Mail className="h-4 w-4 text-emerald-600" />
                                        Enviar Email
                                    </DropdownMenuItem>
                                )}
                            />
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="call"
                                trigger={(
                                    <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-pointer gap-3 rounded-xl px-4 py-3 font-bold">
                                        <Phone className="h-4 w-4 text-indigo-600" />
                                        Registrar Llamada
                                    </DropdownMenuItem>
                                )}
                            />
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="meeting"
                                trigger={(
                                    <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-pointer gap-3 rounded-xl px-4 py-3 font-bold">
                                        <Video className="h-4 w-4 text-indigo-600" />
                                        Registrar Reunion
                                    </DropdownMenuItem>
                                )}
                            />
                            <TaskDialog
                                clientId={id!}
                                trigger={(
                                    <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-pointer gap-3 rounded-xl px-4 py-3 font-bold">
                                        <Plus className="h-4 w-4 text-slate-600" />
                                        Nueva Tarea
                                    </DropdownMenuItem>
                                )}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Surface className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/50">
                <div className="p-8 lg:p-9">
                    <div className="space-y-8">
                        <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
                            <ClientAvatar name={client.name} size="lg" className="h-24 w-24 rounded-[2rem] text-4xl" />
                            <div>
                                <StatusBadge stage={client.stage} className="mb-2" />
                                <h1 className="text-3xl font-extrabold leading-none tracking-tight text-slate-900 lg:text-[2rem]">
                                    {client.name}
                                </h1>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8 lg:flex-row">
                            <div className="grid h-fit grid-cols-1 gap-3 md:grid-cols-2 lg:w-1/3 lg:grid-cols-1">
                                {client.contact.email && <ContactItem icon={Mail} value={client.contact.email} tone="emerald" href={`mailto:${client.contact.email}`} className="text-sm" />}
                                {client.contact.phone && <ContactItem icon={Phone} value={client.contact.phone} tone="indigo" href={`tel:${client.contact.phone}`} className="text-sm" />}
                                {client.company && <ContactItem icon={Building2} value={client.company} tone="blue" className="text-sm" />}
                                {client.budget && <ContactItem icon={Landmark} value={currencyFormatter.format(client.budget)} tone="amber" className="text-sm" />}
                                {sourceLabel && <ContactItem icon={Share2} value={sourceLabel} tone="rose" className="text-sm" />}
                                <ContactItem icon={Calendar} value={client.createdAt instanceof Date ? format(client.createdAt, 'dd MMM, yyyy', { locale: es }) : 'Reciente'} tone="slate" className="text-sm" />
                            </div>

                            <div className="grid flex-1 grid-cols-2 gap-3">
                                <StatCard
                                    label="Proyectos"
                                    value={activeProjectsCount}
                                    icon={Briefcase}
                                    tone="indigo"
                                    className="p-5"
                                    valueClassName="text-3xl"
                                    badge={<span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">Activos</span>}
                                />
                                <StatCard
                                    label="Urgente"
                                    value={urgentTasksCount}
                                    icon={TrendingUp}
                                    tone="rose"
                                    className="p-5"
                                    valueClassName="text-3xl"
                                    badge={<span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">Prioridad Alta</span>}
                                />
                                <StatCard
                                    label="Inversion"
                                    value={compactCurrencyFormatter.format(client.budget || 0)}
                                    icon={Zap}
                                    tone="amber"
                                    className="p-5"
                                    valueClassName="truncate text-[1.8rem]"
                                />
                                <StatCard
                                    label="Ritmo"
                                    value={rhythmDays}
                                    icon={Timer}
                                    tone="emerald"
                                    className="p-5"
                                    valueClassName="text-3xl"
                                    badge={<span className="text-[10px] font-bold text-slate-400">dias sin contacto</span>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Surface>

            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
                <div className="flex flex-col space-y-5 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <Clock className="h-4 w-4" />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 lg:text-xl">
                                Historial de actividades
                            </h2>
                        </div>
                        <ActivityDialog clientId={id!} />
                    </div>

                    <Surface variant="premiumBordered" className="relative flex min-h-[400px] flex-col p-2 shadow-sm lg:h-[500px]">
                        <div
                            onScroll={handleScroll}
                            className="scrollbar-hide relative flex-1 space-y-1 overflow-y-auto p-5"
                        >
                            <div className="absolute bottom-10 left-[39px] top-10 w-px bg-slate-50" />

                            {activities && activities.length > 0 ? (
                                <>
                                    {activities.map((activity, index) => {
                                        const isFirstOfDay = index === 0
                                            || format(activity.date, 'yyyy-MM-dd') !== format(activities[index - 1].date, 'yyyy-MM-dd');

                                        return (
                                            <div key={activity.id} className="space-y-4">
                                                {isFirstOfDay && (
                                                    <div className="flex items-center gap-4 py-4">
                                                        <div className="h-px flex-1 bg-slate-50" />
                                                        <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
                                                            {format(activity.date, 'dd MMMM', { locale: es })}
                                                        </span>
                                                        <div className="h-px flex-1 bg-slate-50" />
                                                    </div>
                                                )}

                                                <div className="group relative flex items-start gap-5">
                                                    <div
                                                        className={cn(
                                                            "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm transition-all group-hover:scale-110",
                                                            activity.type === 'note' ? "bg-slate-900" :
                                                                activity.type === 'call' ? "bg-indigo-600" :
                                                                    activity.type === 'meeting' ? "bg-emerald-600" :
                                                                        "bg-blue-600"
                                                        )}
                                                    >
                                                        <ActivityIcon type={activity.type} size="h-3 w-3" />
                                                    </div>

                                                    <div
                                                        className={cn(
                                                            "flex-1 rounded-2xl border p-4 transition-all hover:shadow-md",
                                                            activity.type === 'note' ? "border-slate-100 bg-slate-50/50 hover:bg-white" :
                                                                activity.type === 'call' ? "border-indigo-100/50 bg-indigo-50/30 hover:bg-white" :
                                                                    activity.type === 'meeting' ? "border-emerald-100/50 bg-emerald-50/30 hover:bg-white" :
                                                                        "border-blue-100/50 bg-blue-50/30 hover:bg-white"
                                                        )}
                                                    >
                                                        <div className="mb-1 flex items-start justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase text-slate-900">
                                                                    {getActivityLabel(activity.type)}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-400">
                                                                    {format(activity.date, 'HH:mm')}
                                                                </span>
                                                            </div>
                                                            <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 rounded-lg p-1 text-slate-300 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="min-w-[160px] rounded-2xl border-slate-100 p-2 shadow-xl">
                                                                    <ActivityDialog
                                                                        clientId={id!}
                                                                        activity={activity}
                                                                        trigger={(
                                                                            <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-pointer gap-3 rounded-xl px-4 py-3 font-bold">
                                                                                <Edit2 className="h-4 w-4 text-emerald-600" />
                                                                                Editar
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                    />
                                                                    <DropdownMenuItem
                                                                        className="cursor-pointer gap-3 rounded-xl px-4 py-3 font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                                                                        onClick={() => setDeleteActivityId(activity.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                        Eliminar
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        <p className="text-sm font-medium leading-relaxed text-slate-600">
                                                            {activity.summary}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {showIndicator && activities.length > 3 && (
                                        <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex animate-in flex-col items-center fade-in duration-500">
                                            <div className="absolute bottom-[-24px] left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent" />
                                            <div className="relative z-20 flex flex-col items-center gap-1">
                                                <span className="rounded-full border border-slate-100 bg-white/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 shadow-sm backdrop-blur-sm">
                                                    Ver mas
                                                </span>
                                                <ChevronDown className="h-4 w-4 animate-bounce text-emerald-500" />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <EmptyState
                                    icon={MessageSquare}
                                    title="Sin actividad"
                                    description="Todavia no hay registros recientes para este cliente."
                                    className="py-12"
                                />
                            )}
                        </div>
                    </Surface>
                </div>

                <div className="flex flex-col gap-6 lg:mt-[52px] lg:h-[500px]">
                    <Surface variant="premiumBordered" className="overflow-hidden rounded-[2.5rem] shadow-xl shadow-slate-100 lg:flex-1 lg:min-h-0">
                        <div className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                                Proyectos
                            </h3>
                            <CreateProjectDialog clientId={id!} />
                        </div>
                        <div className="space-y-2.5 p-3.5 lg:flex-1 lg:overflow-y-auto">
                            {projects && projects.length > 0 ? (
                                projects.map((project) => (
                                    <Button
                                        key={project.id}
                                        asChild
                                        variant="ghost"
                                        className="group h-auto w-full rounded-[1.5rem] border border-slate-100 bg-white p-0 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-100 hover:bg-white hover:shadow-lg hover:shadow-slate-100"
                                    >
                                        <Link to={`/projects/${project.id}`} className="block p-3.5">
                                            <div className="mb-2.5 flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h4 className="line-clamp-2 text-sm font-bold text-slate-700 transition-colors group-hover:text-emerald-600">
                                                        {project.name}
                                                    </h4>
                                                    <p className="mt-1 text-[10px] font-bold text-slate-400">
                                                        {(projectTaskStats.get(project.id)?.total ?? 0) > 0
                                                            ? `${projectTaskStats.get(project.id)?.completed ?? 0} de ${projectTaskStats.get(project.id)?.total ?? 0} tareas completas`
                                                            : 'Sin tareas registradas'}
                                                    </p>
                                                </div>
                                                <div
                                                    className={cn(
                                                        "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                                                        project.status === 'active'
                                                            ? "animate-pulse bg-emerald-500"
                                                            : PROJECT_STATUS_CONFIG[project.status].bgClassName
                                                    )}
                                                />
                                            </div>
                                            <div className="mb-2.5 flex items-center justify-between gap-3">
                                                <MetaChip tone={PROJECT_STATUS_CONFIG[project.status].chipTone}>
                                                    {PROJECT_STATUS_CONFIG[project.status].label}
                                                </MetaChip>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    {projectTaskStats.get(project.id)?.progress ?? 0}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        PROJECT_STATUS_CONFIG[project.status].bgClassName
                                                    )}
                                                    style={{ width: `${projectTaskStats.get(project.id)?.progress ?? 0}%` }}
                                                />
                                            </div>
                                        </Link>
                                    </Button>
                                ))
                            ) : (
                                <EmptyState
                                    icon={Briefcase}
                                    title="Sin proyectos"
                                    description="Crea el primer proyecto vinculado a este cliente."
                                    className="py-10"
                                />
                            )}
                        </div>
                    </Surface>

                    <Surface variant="dark" className="rounded-[2.5rem] p-6 lg:mt-auto">
                        <h3 className="mb-3 text-lg font-black uppercase tracking-tight">Acciones</h3>
                        <div className="grid grid-cols-2 gap-2.5">
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="email"
                                email={client.contact.email}
                                trigger={(
                                    <ActionTile icon={Mail} label="Email" tone="emerald" />
                                )}
                            />
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="call"
                                trigger={(
                                    <ActionTile icon={Phone} label="Llamada" tone="indigo" />
                                )}
                            />
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="meeting"
                                trigger={(
                                    <ActionTile icon={Video} label="Reunion" tone="blue" />
                                )}
                            />
                            <TaskDialog
                                clientId={id!}
                                trigger={(
                                    <ActionTile icon={Plus} label="Tarea" tone="slate" />
                                )}
                            />
                        </div>
                    </Surface>
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!deleteActivityId}
                onClose={() => setDeleteActivityId(null)}
                onConfirm={async () => {
                    if (!deleteActivityId) return;
                    setIsDeletingActivity(true);
                    try {
                        await deleteMutation.mutateAsync(deleteActivityId);
                        toast.success('Actividad eliminada');
                        setDeleteActivityId(null);
                    } catch {
                        toast.error('Error al eliminar');
                    } finally {
                        setIsDeletingActivity(false);
                    }
                }}
                title="Eliminar Actividad"
                description="Esta accion no se puede deshacer."
                isLoading={isDeletingActivity}
            />
        </div>
    );
}

function getActivityLabel(type: Activity['type']) {
    switch (type) {
        case 'note':
            return 'Nota';
        case 'call':
            return 'Llamada';
        case 'email':
            return 'Email';
        case 'meeting':
            return 'Reunion';
        default:
            return type;
    }
}

function ActivityIcon({ type, size = "h-5 w-5" }: { type: Activity['type']; size?: string }) {
    switch (type) {
        case 'note':
            return <MessageSquare className={cn(size, "text-white")} />;
        case 'call':
            return <Phone className={cn(size, "text-white")} />;
        case 'email':
            return <Mail className={cn(size, "text-white")} />;
        case 'meeting':
            return <Video className={cn(size, "text-white")} />;
        default:
            return <Clock className={cn(size, "text-white")} />;
    }
}
