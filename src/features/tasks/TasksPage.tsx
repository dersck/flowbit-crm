import { useState } from 'react';
import { useWorkspaceQuery, useWorkspaceMutation } from '@/hooks/useFirestore';
import type { Task } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Inbox,
    Star,
    Calendar,
    CheckCircle2,
    MoreHorizontal,
    Trash2,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { isToday, isPast } from 'date-fns';
import { toast } from 'sonner';

type TaskFilter = 'inbox' | 'today' | 'upcoming' | 'done';

export default function TasksPage() {
    const [filter, setFilter] = useState<TaskFilter>('today');
    const { data: tasks, isLoading } = useWorkspaceQuery<Task>('tasks', 'all-tasks');
    const { updateMutation, deleteMutation } = useWorkspaceMutation('tasks');

    const filteredTasks = tasks?.filter(task => {
        switch (filter) {
            case 'inbox': return task.status === 'inbox';
            case 'today':
                if (!task.scheduledDate) return false;
                const date = new Date(task.scheduledDate);
                return (isToday(date) || isPast(date)) && task.status !== 'done';
            case 'upcoming':
                if (!task.scheduledDate) return false;
                return !isToday(new Date(task.scheduledDate)) && !isPast(new Date(task.scheduledDate)) && task.status !== 'done';
            case 'done': return task.status === 'done';
            default: return true;
        }
    });

    const toggleTaskStatus = async (task: Task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        try {
            await updateMutation.mutateAsync({
                id: task.id,
                data: {
                    status: newStatus,
                    completedAt: newStatus === 'done' ? new Date() : null
                }
            });
            toast.success(newStatus === 'done' ? '¡Tarea completada!' : 'Tarea reabierta');
        } catch (e) {
            toast.error('Error al actualizar tarea');
        }
    };

    const deleteTask = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Tarea eliminada');
        } catch (e) {
            toast.error('Error al eliminar');
        }
    };

    if (isLoading) return <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-white rounded-2xl border border-slate-100" />)}
    </div>;

    return (
        <div className="flex flex-col lg:flex-row gap-10 h-full">
            {/* Sidebar Sub-nav */}
            <div className="w-full lg:w-56 flex flex-col gap-1.5 sticky top-6 self-start">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Organización</h2>
                <TaskNavLink
                    icon={Inbox}
                    label="Bandeja"
                    active={filter === 'inbox'}
                    onClick={() => setFilter('inbox')}
                    count={tasks?.filter(t => t.status === 'inbox').length}
                />
                <TaskNavLink
                    icon={Star}
                    label="Para Hoy"
                    active={filter === 'today'}
                    onClick={() => setFilter('today')}
                    color="text-amber-500"
                    count={tasks?.filter(t => t.scheduledDate && (isToday(new Date(t.scheduledDate)) || isPast(new Date(t.scheduledDate))) && t.status !== 'done').length}
                />
                <TaskNavLink
                    icon={Calendar}
                    label="Próximo"
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

            {/* Main Task List */}
            <div className="flex-1 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter capitalize">{filter}</h1>
                        <p className="text-slate-400 font-medium text-sm mt-1">
                            {filteredTasks?.length || 0} tareas encontradas
                        </p>
                    </div>
                    <Button size="lg" className="rounded-2xl shadow-xl shadow-emerald-100 flex gap-2 font-bold px-8 bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-5 w-5" />
                        Nueva Tarea
                    </Button>
                </div>

                <div className="space-y-3">
                    {filteredTasks?.map((task) => (
                        <div
                            key={task.id}
                            className="group flex items-center gap-5 px-6 py-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleTaskStatus(task)}
                                className={cn(
                                    "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                    task.status === 'done'
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : "border-slate-300 text-transparent hover:border-emerald-500 hover:text-emerald-500/30"
                                )}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </button>

                            <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                    "font-bold text-slate-900 transition-all text-xl tracking-tighter",
                                    task.status === 'done' && "line-through text-slate-400 opacity-60"
                                )}>
                                    {task.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-2.5">
                                    {task.projectId ? (
                                        <Link
                                            to={`/projects/${task.projectId}`}
                                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            Proyecto
                                        </Link>
                                    ) : task.clientId && (
                                        <Link
                                            to={`/clients/${task.clientId}`}
                                            className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
                                        >
                                            Cliente
                                        </Link>
                                    )}
                                    {task.scheduledDate && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            {task.scheduledDate}
                                        </span>
                                    )}
                                    {task.priority === 3 && (
                                        <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse" />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:bg-slate-100 rounded-xl">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filteredTasks?.length === 0 && (
                        <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                            <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Inbox className="h-10 w-10 text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-300 tracking-tighter uppercase">Todo listo</h3>
                            <p className="text-slate-400 font-medium mt-1">No hay tareas pendientes en esta categoría.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TaskNavLink({ icon: Icon, label, active, onClick, color, count }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-bold tracking-tight",
                active
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100"
            )}
        >
            <div className="flex items-center gap-4">
                <Icon className={cn("h-5 w-5", active ? "text-white" : (color || "text-slate-400"))} />
                <span>{label}</span>
            </div>
            {count !== undefined && count > 0 && (
                <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-lg font-black",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                )}>
                    {count}
                </span>
            )}
        </button>
    );
}
