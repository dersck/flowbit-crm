import { useState } from 'react';
import { useWorkspaceQuery, useWorkspaceMutation } from '@/hooks/useFirestore';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Plus,
    Trash2,
    User,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const statuses = [
    { id: 'active', label: 'En Curso', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { id: 'on_hold', label: 'En Pausa', color: 'text-amber-500', bg: 'bg-amber-500' },
    { id: 'done', label: 'Completado', color: 'text-indigo-500', bg: 'bg-indigo-500' },
];

export default function ProjectsPage() {
    const { data: projects, isLoading } = useWorkspaceQuery<Project>('projects', 'all-projects');
    const { deleteMutation } = useWorkspaceMutation('projects');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const getProjectsByStatus = (status: string) =>
        projects?.filter(p => p.status === status) || [];

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteMutation.mutateAsync(deleteId);
            toast.success('Proyecto eliminado');
            setDeleteId(null);
        } catch (e) {
            toast.error('Error al eliminar');
        }
    };


    if (isLoading) {
        return <div className="flex gap-8 h-[calc(100vh-10rem)] animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="flex-1 bg-white rounded-3xl border border-slate-100" />)}
        </div>;
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Proyectos</h1>
                    <p className="text-slate-500 font-medium mt-1">Gestión visual del flujo de trabajo.</p>
                </div>
                <Button className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100 font-bold flex gap-3">
                    <Plus className="h-5 w-5" />
                    Nuevo Proyecto
                </Button>
            </div>

            <div className="flex gap-8 flex-1 overflow-x-auto pb-10 scrollbar-hide">
                {statuses.map((status) => (
                    <div key={status.id} className="flex-1 min-w-[350px] max-w-[450px] flex flex-col">
                        <div className="flex items-center justify-between mb-6 px-4">
                            <div className="flex items-center gap-3">
                                <div className={cn("h-3 w-3 rounded-full shadow-sm", status.bg)} />
                                <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">{status.label}</h2>
                                <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                                    {getProjectsByStatus(status.id).length}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-900">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 bg-slate-100/30 rounded-[2.5rem] p-4 space-y-5 overflow-y-auto border border-slate-200/50 backdrop-blur-sm">
                            {getProjectsByStatus(status.id).map((project) => (
                                <Card key={project.id} className="group hover:shadow-2xl hover:shadow-slate-200/50 hover:border-emerald-500/10 transition-all duration-300 border-slate-200 shadow-sm bg-white cursor-pointer rounded-3xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                CLIENTE EXTERNO
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-lg"
                                                    onClick={() => setDeleteId(project.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <Link to={`/projects/${project.id}`}>
                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 tracking-tighter leading-tight">
                                                {project.name}
                                            </h3>
                                        </Link>

                                        {project.description && (
                                            <p className="text-sm font-medium text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                                                {project.description}
                                            </p>
                                        )}

                                        <div className="mt-8">
                                            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                                                <span>Progreso Visual</span>
                                                <span>{status.id === 'done' ? '100%' : '35%'}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                                <div
                                                    className={cn("h-full rounded-full transition-all duration-1000", status.bg)}
                                                    style={{ width: status.id === 'done' ? '100%' : '35%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex -space-x-3">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="h-9 w-9 rounded-xl bg-white border-2 border-slate-50 flex items-center justify-center text-[11px] font-black text-slate-400 shadow-sm transition-transform hover:-translate-y-1">
                                                        {i === 1 ? 'JC' : <User className="h-4 w-4" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 border border-transparent transition-all"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {getProjectsByStatus(status.id).length === 0 && (
                                <div className="py-20 px-8 text-center border-4 border-dotted border-slate-200/50 rounded-[2rem]">
                                    <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Columna Vacía</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="¿Eliminar proyecto?"
                description="Se borrarán también todas las tareas asociadas a este proyecto. Esta acción es irreversible."
                confirmText="Eliminar proyecto"
                cancelText="Mantener"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
