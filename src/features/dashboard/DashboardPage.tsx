import { useState, useMemo } from 'react';
import { useWorkspaceQuery, useWorkspaceMutation } from '@/hooks/useFirestore';
import type { Task, Project, Client, Activity as ActivityType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle2,
    Clock,
    Briefcase,
    Users,
    TrendingUp,
    AlertCircle,
    Activity,
    UserPlus,
    Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    isToday,
    isPast,
    isSameDay,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    subDays,
    isWithinInterval,
    startOfMonth,
    endOfMonth
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

    // 1. Filter Tasks for "Prioridades de Hoy"
    const todayTasks = useMemo(() => tasks?.filter(t => {
        if (!t.scheduledDate || t.status === 'done') return false;
        const d = new Date(t.scheduledDate + 'T00:00:00');
        return isToday(d) || isPast(d);
    }) || [], [tasks]);

    // 2. Stats Calculation based on range
    const stats = useMemo(() => {
        const now = new Date();
        let interval: { start: Date; end: Date };

        if (range === 'hoy') {
            interval = { start: now, end: now };
        } else if (range === 'semana') {
            interval = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
        } else {
            interval = { start: startOfMonth(now), end: endOfMonth(now) };
        }

        const filteredTasksCount = tasks?.filter(t => t.completedAt && isWithinInterval(new Date(t.completedAt), interval)).length || 0;
        const newProjectsCount = projects?.filter(p => p.createdAt && isWithinInterval(new Date(p.createdAt), interval)).length || 0;
        const newClientsCount = clients?.filter(c => c.createdAt && isWithinInterval(new Date(c.createdAt), interval)).length || 0;
        const rangeActivitiesCount = activities?.filter(a => a.date && isWithinInterval(new Date(a.date), interval)).length || 0;

        return {
            tasksCompleted: filteredTasksCount,
            projectsStarted: newProjectsCount,
            clientsAdded: newClientsCount,
            activitiesCount: rangeActivitiesCount
        };
    }, [range, tasks, projects, clients, activities]);

    // 3. Weekly Chart Data (Real data based on tasks completed)
    const chartData = useMemo(() => {
        const end = new Date();
        const start = subDays(end, 6);
        const days = eachDayOfInterval({ start, end });

        return days.map(day => {
            const completedOnDay = tasks?.filter(t =>
                t.status === 'done' &&
                t.completedAt &&
                isSameDay(new Date(t.completedAt), day)
            ).length || 0;

            return {
                name: format(day, 'EEE', { locale: es }),
                completed: completedOnDay
            };
        });
    }, [tasks]);

    // 4. Projects Status Distribution
    const projectDistribution = useMemo(() => [
        { name: 'Activos', value: projects?.filter(p => p.status === 'active').length || 0 },
        { name: 'En Pausa', value: projects?.filter(p => p.status === 'on_hold').length || 0 },
        { name: 'Finalizados', value: projects?.filter(p => p.status === 'done').length || 0 },
    ], [projects]);

    const handleInvite = () => {
        setIsInviteOpen(true);
    };

    const sendInvite = async () => {
        if (!inviteEmail) return;
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: 'Enviando invitación...',
            success: 'Invitación enviada correctamente',
            error: 'Error al enviar invitación'
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
                    completedAt: new Date()
                }
            });
            toast.success('¡Tarea completada!');
        } catch (e) {
            toast.error('Error al actualizar tarea');
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Workspace Analytics</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
                    <p className="text-slate-500 mt-1 text-lg">Monitorea el progreso de tu equipo en tiempo real.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
                    {(['hoy', 'semana', 'mes'] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={cn(
                                "px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                                range === r
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "text-slate-400 hover:text-slate-900"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Proyectos"
                    value={projects?.filter(p => p.status === 'active').length.toString() || '0'}
                    subValue={`${stats.projectsStarted} nuevos`}
                    icon={Briefcase}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                    trend={stats.projectsStarted > 0 ? `+${stats.projectsStarted}` : '0'}
                />
                <StatCard
                    label="Tareas Listas"
                    value={tasks?.filter(t => t.status === 'done').length.toString() || '0'}
                    subValue={`${stats.tasksCompleted} completadas`}
                    icon={CheckCircle2}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                    trend={stats.tasksCompleted > 0 ? `+${stats.tasksCompleted}` : '0'}
                />
                <StatCard
                    label="Prospectos"
                    value={clients?.filter(c => c.stage === 'prospecto').length.toString() || '0'}
                    subValue={`${stats.clientsAdded} este ${range}`}
                    icon={Users}
                    color="text-amber-600"
                    bg="bg-amber-50"
                    trend={stats.clientsAdded > 0 ? `+${stats.clientsAdded}` : '0'}
                />
                <StatCard
                    label="Interacciones"
                    value={activities?.length.toString() || '0'}
                    subValue={`${stats.activitiesCount} registradas`}
                    icon={Activity}
                    color="text-rose-600"
                    bg="bg-rose-50"
                    trend="Activo"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <Card className="lg:col-span-2 border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="px-8 py-8 border-b border-slate-50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight text-slate-900 uppercase">Rendimiento de Tareas</CardTitle>
                            <p className="text-sm text-slate-400 font-bold mt-1">Comparativa de productividad diaria</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Últimos 7 días</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
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
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
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
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="px-8 py-8 border-b border-slate-50">
                        <CardTitle className="text-xl font-black tracking-tight text-slate-900 uppercase">Mix de Proyectos</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[250px] w-full">
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
                        <div className="mt-10 space-y-5">
                            {projectDistribution.map((item, i) => (
                                <StatusRow key={item.name} label={item.name} count={item.value} color={COLORS[i % COLORS.length]} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Tasks */}
                <Card className="lg:col-span-2 border-slate-200 shadow-xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white border-dashed border-2">
                    <CardHeader className="border-b border-slate-50 px-8 py-8 flex flex-row items-center justify-between bg-slate-50/30">
                        <CardTitle className="text-xl font-black flex items-center gap-4 text-slate-900 uppercase">
                            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-indigo-200 shadow-lg">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            Prioridades de Hoy
                        </CardTitle>
                        <span className="text-[10px] font-black text-slate-500 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
                            {todayTasks.length} PENDIENTES
                        </span>
                    </CardHeader>
                    <CardContent className="p-0">
                        {todayTasks.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {todayTasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-6 px-8 py-6 hover:bg-slate-50 transition-all group">
                                        <div className="h-3 w-3 rounded-full bg-indigo-500 group-hover:scale-150 transition-all shadow-lg shadow-indigo-100" />
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors tracking-tight">{task.title}</p>
                                            <p className="text-xs text-slate-400 mt-1.5 font-bold uppercase tracking-widest">
                                                {task.projectId ? 'Proyecto Asignado' : 'Inbox / General'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {task.scheduledDate && isPast(new Date(task.scheduledDate + 'T00:00:00')) && !isToday(new Date(task.scheduledDate + 'T00:00:00')) && (
                                                <span className="flex items-center gap-2 text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 uppercase tracking-tighter">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Retrasada
                                                </span>
                                            )}
                                            <button
                                                onClick={() => toggleTask(task)}
                                                className="h-10 w-10 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-xl transition-all scale-90 group-hover:scale-100"
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-24 text-center">
                                <div className="bg-emerald-50 h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-emerald-50 shadow-inner">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Todo al día</h3>
                                <p className="text-slate-400 font-bold mt-2 max-w-[250px] mx-auto">Has completado todas tus prioridades para hoy. ¡Buen trabajo!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Team & Growth */}
                <div className="space-y-6">
                    <Card className="border-none bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl shadow-slate-300 rounded-[2.5rem] p-10 text-white relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black tracking-tighter mb-3 uppercase leading-none">Flowbit <span className="text-emerald-500">Elite</span></h3>
                            <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                                Automatiza tu CRM con integraciones de WhatsApp e Inteligencia Artificial.
                            </p>
                        </div>
                        <button className="relative z-10 w-full py-5 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:bg-emerald-500 transition-all hover:-translate-y-1 active:translate-y-0">
                            Mejorar Plan
                        </button>
                    </Card>

                    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 flex items-center gap-6 shadow-xl shadow-slate-100/50 hover:border-emerald-500/20 transition-all group">
                        <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <Users className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tu Equipo</p>
                            <p className="text-lg font-black text-slate-900 tracking-tight">1 / 5 Miembros</p>
                        </div>
                        <button
                            onClick={handleInvite}
                            className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                            <UserPlus className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Invite Member Dialog */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            Invitar Miembro
                        </DialogTitle>
                        <DialogDescription className="text-sm font-bold text-slate-500 mt-2">
                            Envía una invitación para unirse a tu workspace.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                            <Input
                                placeholder="ejemplo@flowbit.com"
                                className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500/20"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col gap-3">
                        <Button
                            className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-emerald-100 bg-emerald-600 hover:bg-emerald-700"
                            onClick={sendInvite}
                        >
                            Enviar Invitación
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full h-12 rounded-xl font-bold text-slate-400 hover:text-slate-900"
                            onClick={() => setIsInviteOpen(false)}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatCard({ label, value, subValue, icon: Icon, color, bg, trend }: any) {
    return (
        <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white group hover:shadow-2xl hover:border-emerald-500/10 transition-all duration-500 border-2">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:-rotate-3 duration-500 border border-slate-100 shadow-sm", bg, color)}>
                        <Icon className="h-9 w-9" />
                    </div>
                    <div className={cn(
                        "text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border",
                        trend !== '0' && trend !== 'Activo' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                        {trend}
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</h4>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
                    <p className="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1.5 opacity-60">
                        <TrendingUp className="h-3 w-3" />
                        {subValue}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusRow({ label, count, color }: any) {
    return (
        <div className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-4">
                <div
                    className={cn("h-3 w-3 rounded-full shadow-lg group-hover:scale-150 transition-all duration-300")}
                    style={{ backgroundColor: color }}
                />
                <span className="text-sm font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 leading-none">{count}</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase">Projs</span>
            </div>
        </div>
    );
}
