import { useWorkspaceQuery } from '@/hooks/useFirestore';
import type { Task, Project, Client } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle2,
    Clock,
    Briefcase,
    Users,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isToday, isPast } from 'date-fns';

export default function DashboardPage() {
    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'today-dashboard');
    const { data: projects } = useWorkspaceQuery<Project>('projects', 'active-projects');
    const { data: clients } = useWorkspaceQuery<Client>('clients', 'prospects');

    const todayTasks = tasks?.filter(t => t.scheduledDate && (isToday(new Date(t.scheduledDate)) || isPast(new Date(t.scheduledDate))) && t.status !== 'done') || [];
    const activeProjects = projects?.filter(p => p.status === 'active') || [];
    const prospects = clients?.filter(c => c.stage === 'prospecto') || [];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">¡Hola de nuevo!</h1>
                <p className="text-slate-500 mt-1 text-lg">Aquí tienes un resumen de lo que está pasando hoy.</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Proyectos Activos"
                    value={activeProjects.length.toString()}
                    icon={Briefcase}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <StatCard
                    label="Tareas para Hoy"
                    value={todayTasks.length.toString()}
                    icon={CheckCircle2}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
                <StatCard
                    label="Nuevos Prospectos"
                    value={prospects.length.toString()}
                    icon={Users}
                    color="text-amber-600"
                    bg="bg-amber-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Tasks */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-50 px-6 py-5">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-500" />
                            Tareas para Hoy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {todayTasks.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {todayTasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="h-2 w-2 rounded-full bg-indigo-400" />
                                        <span className="flex-1 font-medium text-slate-700">{task.title}</span>
                                        <div className="flex items-center gap-2">
                                            {isPast(new Date(task.scheduledDate || '')) && !isToday(new Date(task.scheduledDate || '')) && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Atrasada
                                                </span>
                                            )}
                                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                                {task.projectId ? 'Proyecto A' : 'Sin proyecto'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-slate-400 italic">No hay tareas pendientes para hoy. ¡Buen trabajo!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Focus / Recent Activity Section */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="px-6 py-5 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                                Enfoque
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {activeProjects.slice(0, 3).map(p => (
                                    <div key={p.id} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-700 truncate pr-2">{p.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">60%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
                                        </div>
                                    </div>
                                ))}
                                {activeProjects.length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4 italic">Sin proyectos activos actualmente.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-slate-900 text-white">
                        <CardContent className="p-6">
                            <h3 className="font-bold mb-2">Flowbit Pro</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">Invita a tu equipo y desbloquea funciones colaborativas avanzadas.</p>
                            <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-bold transition-colors">
                                Invitar equipo
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white group hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", bg, color)}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
