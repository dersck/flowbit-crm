import { useWorkspaceQuery } from '@/hooks/useFirestore';
import type { Task, Project, Client } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle2,
    Clock,
    Briefcase,
    Users,
    TrendingUp,
    AlertCircle,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isToday, isPast } from 'date-fns';
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

const taskData = [
    { name: 'Lun', completed: 4 },
    { name: 'Mar', completed: 7 },
    { name: 'Mie', completed: 5 },
    { name: 'Jue', completed: 8 },
    { name: 'Vie', completed: 12 },
    { name: 'Sab', completed: 6 },
    { name: 'Dom', completed: 3 },
];

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'today-dashboard');
    const { data: projects } = useWorkspaceQuery<Project>('projects', 'active-projects');
    const { data: clients } = useWorkspaceQuery<Client>('clients', 'prospects');

    const todayTasks = tasks?.filter(t => t.scheduledDate && (isToday(new Date(t.scheduledDate)) || isPast(new Date(t.scheduledDate))) && t.status !== 'done') || [];
    const activeProjects = projects?.filter(p => p.status === 'active') || [];
    const prospects = clients?.filter(c => c.stage === 'prospecto') || [];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
                    <p className="text-slate-500 mt-1 text-lg">Resumen estratégico de tu workspace.</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg">Hoy</button>
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Semana</button>
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Mes</button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Proyectos"
                    value={activeProjects.length.toString()}
                    icon={Briefcase}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                    trend="+12%"
                />
                <StatCard
                    label="Tareas Hoy"
                    value={todayTasks.length.toString()}
                    icon={CheckCircle2}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                    trend="-2"
                />
                <StatCard
                    label="Prospectos"
                    value={prospects.length.toString()}
                    icon={Users}
                    color="text-amber-600"
                    bg="bg-amber-50"
                    trend="+5"
                />
                <StatCard
                    label="Actividad"
                    value="24"
                    icon={Activity}
                    color="text-rose-600"
                    bg="bg-rose-50"
                    trend="Estable"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <Card className="lg:col-span-2 border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Rendimiento Semanal</CardTitle>
                            <p className="text-sm text-slate-400 font-medium">Tareas completadas por día</p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-emerald-500 bg-emerald-50 p-1 rounded-lg" />
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={taskData}>
                                    <defs>
                                        <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorComp)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="px-8 py-6 border-b border-slate-50">
                        <CardTitle className="text-xl font-bold tracking-tight">Estado Proyectos</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Activos', value: 8 },
                                    { name: 'Espera', value: 4 },
                                    { name: 'Fin.', value: 12 },
                                ]}>
                                    <XAxis dataKey="name" hide />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                                        {[0, 1, 2].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 space-y-4">
                            <StatusRow label="Proyectos Activos" count={8} color="bg-emerald-500" />
                            <StatusRow label="En Seguimiento" count={4} color="bg-indigo-500" />
                            <StatusRow label="Completados" count={12} color="bg-amber-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Tasks */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white border-dashed border-2">
                    <CardHeader className="border-b border-slate-50 px-8 py-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-xl">
                                <Clock className="h-5 w-5 text-indigo-500" />
                            </div>
                            Prioridades de Hoy
                        </CardTitle>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                            {todayTasks.length} Tareas
                        </span>
                    </CardHeader>
                    <CardContent className="p-0">
                        {todayTasks.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {todayTasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-5 px-8 py-5 hover:bg-slate-50/50 transition-colors group">
                                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-700 leading-none">{task.title}</p>
                                            <p className="text-xs text-slate-400 mt-1.5 font-medium">
                                                {task.projectId ? 'Proyecto de Implementación' : 'Sin proyecto asignado'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {isPast(new Date(task.scheduledDate || '')) && !isToday(new Date(task.scheduledDate || '')) && (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-rose-100">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Atrasada
                                                </span>
                                            )}
                                            <button className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <div className="bg-slate-50 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="h-8 w-8 text-slate-200" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-400">Todo bajo control</h3>
                                <p className="text-sm text-slate-400 mt-1 max-w-[200px] mx-auto">No tienes tareas urgentes pendientes para el día de hoy.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pro Invite / Upsell */}
                <div className="space-y-6">
                    <Card className="border-none bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-2xl shadow-indigo-200 rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black tracking-tight mb-2">Flowbit Pro</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed mb-6 opacity-80">
                                Desbloquea tableros colaborativos, automatizaciones de WhatsApp y reportes avanzados.
                            </p>
                            <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl text-sm font-black shadow-xl hover:bg-indigo-50 transition-colors">
                                Mejorar Plan
                            </button>
                        </div>
                    </Card>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                            <Users className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Equipo (1/5)</p>
                            <p className="text-xs text-slate-400 font-medium">4 espacios disponibles</p>
                        </div>
                        <button className="ml-auto text-emerald-600 font-bold text-xs hover:underline">Invitar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, bg, trend }: any) {
    return (
        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white group hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300">
            <CardContent className="p-7">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500 border border-slate-100 shadow-sm", bg, color)}>
                        <Icon className="h-8 w-8" />
                    </div>
                    <span className={cn(
                        "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest",
                        trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : trend.startsWith('-') ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"
                    )}>
                        {trend}
                    </span>
                </div>
                <div>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusRow({ label, count, color }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", color)} />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
            </div>
            <span className="text-sm font-black text-slate-900">{count}</span>
        </div>
    );
}
