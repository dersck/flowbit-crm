import { useState } from 'react';
import { useWorkspaceQuery } from '@/hooks/useFirestore';
import type { Task } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Inbox,
    Star,
    Calendar,
    CheckCircle2,
    MoreHorizontal,
    Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isPast } from 'date-fns';

type TaskFilter = 'inbox' | 'today' | 'upcoming' | 'done';

export default function TasksPage() {
    const [filter, setFilter] = useState<TaskFilter>('today');
    const { data: tasks, isLoading } = useWorkspaceQuery<Task>('tasks', 'all-tasks');

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

    if (isLoading) return <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl" />)}
    </div>;

    return (
        <div className="flex gap-10 h-full">
            {/* Sidebar Sub-nav (Things 3 Style) */}
            <div className="w-48 flex flex-col gap-1 sticky top-6 self-start">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Listas</h2>
                <TaskNavLink
                    icon={Inbox}
                    label="Bandeja"
                    active={filter === 'inbox'}
                    onClick={() => setFilter('inbox')}
                    count={tasks?.filter(t => t.status === 'inbox').length}
                />
                <TaskNavLink
                    icon={Star}
                    label="Hoy"
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
            <div className="flex-1 max-w-3xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">{filter}</h1>
                    <Button size="sm" className="rounded-full shadow-lg shadow-emerald-100 flex gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva Tarea
                    </Button>
                </div>

                <div className="space-y-px bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {filteredTasks?.map((task) => (
                        <div key={task.id} className="group flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                            <button className="text-slate-300 hover:text-emerald-500 transition-colors">
                                {task.status === 'done' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}
                            </button>
                            <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                    "font-medium text-slate-900 truncate",
                                    task.status === 'done' && "line-through text-slate-400"
                                )}>
                                    {task.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                    {task.projectId && (
                                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Proyecto A</span>
                                    )}
                                    {task.dueDate && (
                                        <span className="text-[10px] font-medium text-slate-400">Vence: {task.dueDate}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <Calendar className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filteredTasks?.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-slate-400">Todo listo por aquí.</p>
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
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm font-medium",
                active ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
        >
            <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4", color || "text-slate-400")} />
                <span>{label}</span>
            </div>
            {count !== undefined && count > 0 && (
                <span className="text-[10px] bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded-full font-bold">
                    {count}
                </span>
            )}
        </button>
    );
}
