import { useWorkspaceQuery } from '@/hooks/useFirestore';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Plus,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    PauseCircle,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const statuses = [
    { id: 'active', label: 'Activos', icon: PlayCircle, color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { id: 'on_hold', label: 'En Espera', icon: PauseCircle, color: 'text-amber-500', bg: 'bg-amber-500' },
    { id: 'done', label: 'Finalizados', icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-500' },
];

function PlayCircle(props: any) {
    return <Clock {...props} />; // Placeholder as PlayCircle is often not in base lucide or naming varies
}

export default function ProjectsPage() {
    const { data: projects, isLoading } = useWorkspaceQuery<Project>('projects', 'all-projects');

    const getProjectsByStatus = (status: string) =>
        projects?.filter(p => p.status === status) || [];

    if (isLoading) {
        return <div className="flex gap-6 h-full overflow-hidden">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 bg-slate-100/50 rounded-2xl animate-pulse" />
            ))}
        </div>;
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Proyectos</h1>
                    <p className="text-slate-500">Visualiza y gestiona el progreso de tus trabajos</p>
                </div>
                <Button className="flex gap-2 h-11 px-6 rounded-xl shadow-lg shadow-emerald-100 font-semibold">
                    <Plus className="h-5 w-5" />
                    Nuevo Proyecto
                </Button>
            </div>

            <div className="flex gap-6 flex-1 overflow-x-auto pb-6 scrollbar-hide">
                {statuses.map((status) => (
                    <div key={status.id} className="flex-1 min-w-[320px] max-w-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <status.icon className={cn("h-5 w-5", status.color)} />
                                <h2 className="font-bold text-slate-700">{status.label}</h2>
                                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {getProjectsByStatus(status.id).length}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 bg-slate-100/40 rounded-2xl p-3 space-y-4 overflow-y-auto border border-slate-200/50">
                            {getProjectsByStatus(status.id).map((project) => (
                                <Card key={project.id} className="group hover:shadow-md hover:border-emerald-500/10 transition-all duration-200 border-slate-200 shadow-sm bg-white cursor-pointer rounded-xl overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                                CLIENT ID: {project.clientId.slice(-4)}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Link to={`/projects/${project.id}`}>
                                            <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {project.name}
                                            </h3>
                                        </Link>
                                        {project.description && (
                                            <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                                {project.description}
                                            </p>
                                        )}

                                        <div className="mt-6">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                                                <span>Progreso</span>
                                                <span>40%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full transition-all duration-1000", status.bg)}
                                                    style={{ width: '40%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                        {i === 1 ? 'JC' : <Users className="h-3 w-3" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>12 Mar</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {getProjectsByStatus(status.id).length === 0 && (
                                <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                    <p className="text-slate-400 text-sm">Sin proyectos en esta etapa.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
