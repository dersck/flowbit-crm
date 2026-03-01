import { useMemo, useState } from 'react';
import {
    Activity,
    AlertCircle,
    Briefcase,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    TrendingUp,
    UserPlus,
    Users,
} from 'lucide-react';
import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isPast,
    isSameDay,
    isToday,
    isWithinInterval,
    startOfMonth,
    startOfWeek,
    subDays,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { toast } from 'sonner';
import StatCard from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DialogActions, DialogHero, DialogShell } from '@/components/ui/dialog-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { FieldGroup } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control';
import { Surface } from '@/components/ui/surface';
import { useWorkspaceMutation, useWorkspaceQuery } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import type { Activity as ActivityType, Client, Project, Task } from '@/types';
import { PROJECT_STATUS_CONFIG, PROJECT_STATUS_ORDER } from '@/features/projects/projectConstants';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

type TimeRange = 'hoy' | 'semana' | 'mes';

export default function DashboardPage() {
    const [range, setRange] = useState<TimeRange>('semana');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'dashboard-tasks');
    const { data: projects } = useWorkspaceQuery<Project>('projects', 'dashboard-projects');
    const { data: clients } = useWorkspaceQuery<Client>('clients', 'dashboard-clients');
    const { data: activities } = useWorkspaceQuery<ActivityType>('activities', 'dashboard-activities');
    const { updateMutation } = useWorkspaceMutation('tasks');

    const todayTasks = useMemo(() => {
        return tasks?.filter((task) => {
            if (!task.scheduledDate || task.status === 'done') return false;
            const scheduledDate = new Date(`${task.scheduledDate}T00:00:00`);
            return isToday(scheduledDate) || isPast(scheduledDate);
        }) || [];
    }, [tasks]);

    const stats = useMemo(() => {
        const now = new Date();
        const interval =
            range === 'hoy'
                ? { start: now, end: now }
                : range === 'semana'
                    ? {
                        start: startOfWeek(now, { weekStartsOn: 1 }),
                        end: endOfWeek(now, { weekStartsOn: 1 }),
                    }
                    : { start: startOfMonth(now), end: endOfMonth(now) };

        const tasksCompleted =
            tasks?.filter((task) => task.completedAt && isWithinInterval(new Date(task.completedAt), interval)).length || 0;
        const projectsStarted =
            projects?.filter((project) => project.createdAt && isWithinInterval(new Date(project.createdAt), interval)).length || 0;
        const clientsAdded =
            clients?.filter((client) => client.createdAt && isWithinInterval(new Date(client.createdAt), interval)).length || 0;
        const activitiesCount =
            activities?.filter((activity) => activity.date && isWithinInterval(new Date(activity.date), interval)).length || 0;

        return {
            tasksCompleted,
            projectsStarted,
            clientsAdded,
            activitiesCount,
        };
    }, [activities, clients, projects, range, tasks]);

    const chartData = useMemo(() => {
        const end = new Date();
        const start = subDays(end, 6);
        const days = eachDayOfInterval({ start, end });

        return days.map((day) => ({
            name: format(day, 'EEE', { locale: es }),
            completed:
                tasks?.filter(
                    (task) =>
                        task.status === 'done' &&
                        task.completedAt &&
                        isSameDay(new Date(task.completedAt), day)
                ).length || 0,
        }));
    }, [tasks]);

    const projectDistribution = useMemo(
        () =>
            PROJECT_STATUS_ORDER.map((status) => ({
                name: PROJECT_STATUS_CONFIG[status].label,
                value: projects?.filter((project) => project.status === status).length || 0,
            })),
        [projects]
    );

    const sendInvite = async () => {
        if (!inviteEmail) return;

        toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: 'Enviando invitacion...',
            success: 'Invitacion enviada correctamente',
            error: 'Error al enviar invitacion',
        });

        setIsInviteOpen(false);
        setInviteEmail('');
    };

    const toggleTask = async (task: Task) => {
        try {
            await updateMutation.mutateAsync({
                id: task.id,
                data: {
                    status: 'done',
                    completedAt: new Date(),
                },
            });
            toast.success('Tarea completada');
        } catch {
            toast.error('Error al actualizar tarea');
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-8">
            <PageHeader
                title="Panel de Control"
                subtitle="Monitorea el progreso de tu equipo en tiempo real."
                eyebrow="Workspace Analytics"
                icon={(
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-lg">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                )}
                actions={(
                    <SegmentedControl className="self-start md:self-auto">
                        {(['hoy', 'semana', 'mes'] as const).map((currentRange) => (
                            <SegmentedControlItem
                                key={currentRange}
                                active={range === currentRange}
                                onClick={() => setRange(currentRange)}
                                label={currentRange}
                                className="px-6 py-2 text-xs uppercase tracking-widest"
                            />
                        ))}
                    </SegmentedControl>
                )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Proyectos"
                    value={projects?.filter((project) => project.status === 'active').length.toString() || '0'}
                    icon={Briefcase}
                    tone="emerald"
                    trend={<TrendBadge value={stats.projectsStarted} />}
                    description={`${stats.projectsStarted} nuevos`}
                    descriptionIcon={TrendingUp}
                />
                <StatCard
                    label="Tareas Listas"
                    value={tasks?.filter((task) => task.status === 'done').length.toString() || '0'}
                    icon={CheckCircle2}
                    tone="indigo"
                    trend={<TrendBadge value={stats.tasksCompleted} />}
                    description={`${stats.tasksCompleted} completadas`}
                    descriptionIcon={TrendingUp}
                />
                <StatCard
                    label="Prospectos"
                    value={clients?.filter((client) => client.stage === 'nuevo').length.toString() || '0'}
                    icon={Users}
                    tone="amber"
                    trend={<TrendBadge value={stats.clientsAdded} />}
                    description={`${stats.clientsAdded} este ${range}`}
                    descriptionIcon={TrendingUp}
                />
                <StatCard
                    label="Interacciones"
                    value={activities?.length.toString() || '0'}
                    icon={Activity}
                    tone="rose"
                    trend={<span className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Activo</span>}
                    description={`${stats.activitiesCount} registradas`}
                    descriptionIcon={TrendingUp}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Surface variant="premiumBordered" className="lg:col-span-2">
                    <div className="flex flex-row items-center justify-between border-b border-slate-50 px-6 py-6">
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 sm:text-xl">Rendimiento de Tareas</h2>
                            <p className="mt-1 text-sm font-bold text-slate-400">Comparativa de productividad diaria</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Ultimos 7 dias</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-[300px] w-full sm:h-[330px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '20px',
                                            border: 'none',
                                            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                            padding: '16px',
                                        }}
                                        itemStyle={{ fontWeight: 'black', color: '#0f172a' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="completed"
                                        name="Completadas"
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorComp)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Surface>

                <Surface variant="premiumBordered">
                    <div className="border-b border-slate-50 px-6 py-6">
                        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 sm:text-xl">Mix de Proyectos</h2>
                    </div>
                    <div className="p-6">
                        <div className="h-[220px] w-full sm:h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectDistribution}>
                                    <XAxis dataKey="name" hide />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '15px' }} />
                                    <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={50}>
                                        {projectDistribution.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 space-y-4">
                            {projectDistribution.map((item, index) => (
                                <StatusRow
                                    key={item.name}
                                    label={item.name}
                                    count={item.value}
                                    color={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </div>
                    </div>
                </Surface>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Surface variant="premiumBordered" className="lg:col-span-2 overflow-hidden border-2 border-dashed">
                    <div className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 px-6 py-6">
                        <h2 className="flex items-center gap-3 text-lg font-black uppercase text-slate-900 sm:text-xl">
                            <div className="rounded-2xl bg-indigo-600 p-2 shadow-lg shadow-indigo-200">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            Prioridades de Hoy
                        </h2>
                        <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[10px] font-black text-slate-500 shadow-sm">
                            {todayTasks.length} PENDIENTES
                        </span>
                    </div>
                    <div className="p-0">
                        {todayTasks.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {todayTasks.map((task) => (
                                    <div key={task.id} className="group flex items-center gap-5 px-6 py-5 transition-all hover:bg-slate-50">
                                        <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-100 transition-all group-hover:scale-150" />
                                        <div className="flex-1">
                                            <p className="text-base font-bold leading-tight tracking-tight text-slate-800 transition-colors group-hover:text-indigo-600 sm:text-lg">
                                                {task.title}
                                            </p>
                                            <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                                                {task.projectId ? 'Proyecto asignado' : 'Inbox / General'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {task.scheduledDate &&
                                            isPast(new Date(`${task.scheduledDate}T00:00:00`)) &&
                                            !isToday(new Date(`${task.scheduledDate}T00:00:00`)) ? (
                                                <span className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-rose-600">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Retrasada
                                                </span>
                                            ) : null}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 scale-90 rounded-2xl border border-slate-200 text-slate-400 transition-all group-hover:scale-100 hover:border-slate-900 hover:bg-slate-900 hover:text-white hover:shadow-xl"
                                                onClick={() => toggleTask(task)}
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={CheckCircle2}
                                title="Todo al dia"
                                description="Has completado todas tus prioridades para hoy."
                                className="py-14"
                            />
                        )}
                    </div>
                </Surface>

                <div className="space-y-6">
                    <Surface variant="dark" className="relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 group">
                        <div className="absolute right-0 top-0 h-40 w-40 -translate-y-20 translate-x-20 rounded-full bg-white/5 transition-transform duration-1000 group-hover:scale-150" />
                        <div className="relative z-10">
                            <h3 className="mb-3 text-[clamp(1.7rem,2.4vw,2.3rem)] font-black uppercase leading-none tracking-tighter">
                                Flowbit <span className="text-emerald-500">Elite</span>
                            </h3>
                            <p className="mb-6 text-sm font-bold leading-relaxed text-slate-400">
                                Automatiza tu CRM con integraciones de WhatsApp e Inteligencia Artificial.
                            </p>
                        </div>
                        <Button variant="confirm" size="lg" className="relative z-10 w-full text-xs uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:-translate-y-1">
                            Mejorar Plan
                        </Button>
                    </Surface>

                    <Surface variant="premiumBordered" className="flex items-center gap-5 rounded-[2rem] border-2 p-6 shadow-xl shadow-slate-100/50 transition-all group hover:border-emerald-500/20">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 shadow-lg transition-transform group-hover:rotate-6">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="mb-1 text-xs font-black uppercase leading-none tracking-widest text-slate-400">Tu Equipo</p>
                            <p className="text-base font-black tracking-tight text-slate-900 sm:text-lg">1 / 5 Miembros</p>
                        </div>
                        <Button
                            onClick={() => setIsInviteOpen(true)}
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white"
                        >
                            <UserPlus className="h-5 w-5" />
                        </Button>
                    </Surface>
                </div>
            </div>

            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogShell size="md">
                    <DialogHero
                        icon={<UserPlus className="h-7 w-7" />}
                        title="Invitar Miembro"
                        description="Envia una invitacion para unirse a tu workspace."
                        tone="emerald"
                    />

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            void sendInvite();
                        }}
                        className="mt-5 space-y-6"
                    >
                        <FieldGroup label="Correo Electronico">
                            <Input
                                placeholder="ejemplo@flowbit.com"
                                value={inviteEmail}
                                onChange={(event) => setInviteEmail(event.target.value)}
                            />
                        </FieldGroup>

                        <DialogActions
                            onCancel={() => setIsInviteOpen(false)}
                            confirmLabel="Enviar Invitacion"
                            confirmVariant="confirm"
                            disabled={!inviteEmail}
                        />
                    </form>
                </DialogShell>
            </Dialog>
        </div>
    );
}

function TrendBadge({ value }: { value: number }) {
    return (
        <span
            className={cn(
                'rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest',
                value > 0
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                    : 'border-slate-100 bg-slate-50 text-slate-400'
            )}
        >
            {value > 0 ? `+${value}` : '0'}
        </span>
    );
}

function StatusRow({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <div className="group flex cursor-default items-center justify-between">
            <div className="flex items-center gap-4">
                <div
                    className="h-3 w-3 rounded-full shadow-lg transition-all duration-300 group-hover:scale-150"
                    style={{ backgroundColor: color }}
                />
                <span className="text-sm font-black uppercase tracking-widest text-slate-500 transition-colors group-hover:text-slate-900">
                    {label}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-lg font-black leading-none text-slate-900">{count}</span>
                <span className="text-[10px] font-bold uppercase text-slate-300">Projs</span>
            </div>
        </div>
    );
}
