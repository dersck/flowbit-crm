import { useParams, Link } from 'react-router-dom';
import { useEntityQuery, useWorkspaceQuery, useWorkspaceMutation } from '@/hooks/useFirestore';
import type { Project, Client, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChevronLeft,
    Calendar,
    Briefcase,
    CheckCircle2,
    Clock,
    User,
    Plus,
    Tag,
    AlertCircle,
    Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { where } from 'firebase/firestore';
import { toast } from 'sonner';

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: project, isLoading: isProjectLoading } = useEntityQuery<Project>('projects', id);
    const { data: client } = useEntityQuery<Client>('clients', project?.clientId);
    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'project-tasks', [
        where('projectId', '==', id)
    ]);

    const { updateMutation: updateTaskMutation } = useWorkspaceMutation('tasks');
    const { updateMutation: updateProjectMutation } = useWorkspaceMutation('projects');

    const handleTaskToggle = async (task: Task) => {
        try {
            await updateTaskMutation.mutateAsync({
                id: task.id,
                data: {
                    status: task.status === 'done' ? 'todo' : 'done',
                    completedAt: task.status === 'done' ? null : new Date()
                }
            });
            toast.success(task.status === 'done' ? 'Tarea reabierta' : '¡Tarea completada!');
        } catch (e) {
            toast.error('Error al actualizar tarea');
        }
    };

    const handleStatusChange = async (newStatus: Project['status']) => {
        try {
            await updateProjectMutation.mutateAsync({
                id: id!,
                data: { status: newStatus }
            });
            toast.success('Estado del proyecto actualizado');
        } catch (e) {
            toast.error('Error al actualizar estado');
        }
    };

    if (isProjectLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-12 w-48 bg-slate-100 rounded-2xl" />
                <div className="h-64 bg-white rounded-[2.5rem] border border-slate-100" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-slate-900 uppercase">Proyecto no encontrado</h2>
                <Link to="/projects">
                    <Button variant="link" className="mt-4 text-emerald-600 font-bold">Volver a proyectos</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <Link to="/projects" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold group">
                        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Volver a Proyectos
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <Briefcase className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{project.name}</h1>
                            <p className="text-slate-500 font-bold mt-1.5 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {client?.name || 'Cargando cliente...'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex bg-white p-1 rounded-[1.5rem] border border-slate-200 shadow-sm self-start md:self-auto">
                    {(['active', 'on_hold', 'done'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={cn(
                                "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                project.status === s
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "text-slate-400 hover:text-slate-900"
                            )}
                        >
                            {s === 'active' ? 'Activo' : s === 'on_hold' ? 'En Pausa' : 'Finalizado'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Tasks/Milestones */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="border-none bg-emerald-50 rounded-3xl p-6 shadow-sm">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Completado</p>
                            <p className="text-3xl font-black text-emerald-900">
                                {tasks?.length ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0}%
                            </p>
                        </Card>
                        <Card className="border-none bg-indigo-50 rounded-3xl p-6 shadow-sm">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Tareas Pendientes</p>
                            <p className="text-3xl font-black text-indigo-900">{tasks?.filter(t => t.status !== 'done').length || 0}</p>
                        </Card>
                        <Card className="border-none bg-slate-100 rounded-3xl p-6 shadow-sm">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Días Restantes</p>
                            <p className="text-3xl font-black text-slate-900">12</p>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                <Layout className="h-5 w-5 text-indigo-600" />
                                Hitos y Tareas
                            </h2>
                            <Button className="rounded-xl bg-slate-900 text-white font-bold h-10 px-4 gap-2">
                                <Plus className="h-4 w-4" />
                                Nueva Tarea
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {tasks && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all group",
                                            task.status === 'done'
                                                ? "bg-slate-50/50 border-slate-100 opacity-60"
                                                : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50"
                                        )}
                                    >
                                        <button
                                            onClick={() => handleTaskToggle(task)}
                                            className={cn(
                                                "h-8 w-8 rounded-xl border flex items-center justify-center transition-all",
                                                task.status === 'done'
                                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                                    : "border-slate-200 text-slate-200 hover:border-indigo-500 hover:text-indigo-500"
                                            )}
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "font-bold text-slate-800 tracking-tight transition-all",
                                                task.status === 'done' && "line-through text-slate-400"
                                            )}>{task.title}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                {task.scheduledDate && (
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <Clock className="h-3 w-3" />
                                                        {task.scheduledDate}
                                                    </span>
                                                )}
                                                {task.priority === 3 && (
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 uppercase tracking-tighter">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Urgente
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold">No hay tareas asignadas a este proyecto.</p>
                                    <Button variant="outline" className="mt-4 rounded-xl border-slate-300 font-bold">Crear la primera tarea</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Details */}
                <div className="space-y-8">
                    <Card className="border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-100 overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha de Inicio</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700 flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-indigo-500" />
                                    {project.startDate ? format(project.startDate, 'dd MMM, yyyy', { locale: es }) : 'No definida'}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Entrega Estimada</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700 flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-rose-500" />
                                    {project.dueDate ? format(project.dueDate, 'dd MMM, yyyy', { locale: es }) : 'No definida'}
                                </div>
                            </div>
                            {project.description && (
                                <div className="space-y-1.5 leading-relaxed">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descripción</label>
                                    <p className="text-sm font-medium text-slate-500 p-4 border border-slate-100 rounded-2xl">{project.description}</p>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2 pt-4">
                                {project.tagIds.map(tagId => (
                                    <span key={tagId} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <Tag className="h-3 w-3" />
                                        {tagId}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access Client */}
                    {client && (
                        <Link to={`/clients/${client.id}`}>
                            <Card className="border-none bg-slate-900 rounded-[2.5rem] p-8 text-white hover:-translate-y-2 transition-transform shadow-2xl shadow-slate-300 group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Ver Cliente</h3>
                                </div>
                                <p className="text-slate-400 text-sm font-bold opacity-80">{client.name}</p>
                            </Card>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
