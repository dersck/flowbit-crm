import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEntityQuery, useWorkspaceQuery, useWorkspaceMutation } from '@/hooks/useFirestore';
import type { Client, Project, Task, Activity } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChevronLeft,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    Plus,
    Clock,
    MessageSquare,
    Video,
    Building2,
    Landmark,
    Share2,
    ChevronDown,
    Edit2,
    Trash2,
    Zap,
    TrendingUp,
    Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { where } from 'firebase/firestore';
import { toast } from 'sonner';
import ClientDialog from './ClientDialog';
import ActivityDialog from './ActivityDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import CreateProjectDialog from '../projects/CreateProjectDialog';
import TaskDialog from '../tasks/TaskDialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [showIndicator, setShowIndicator] = useState(true);
    const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
    const [isDeletingActivity, setIsDeletingActivity] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop > 10) setShowIndicator(false);
        else setShowIndicator(true);
    };

    const { data: client, isLoading: isClientLoading } = useEntityQuery<Client>('clients', id);
    const { data: projects } = useWorkspaceQuery<Project>('projects', 'client-projects', [
        where('clientId', '==', id)
    ]);
    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'client-tasks', [
        where('clientId', '==', id)
    ]);
    const { data: activitiesData } = useWorkspaceQuery<Activity>('activities', `client-${id}-activities`, [
        where('clientId', '==', id)
    ]);
    const { deleteMutation } = useWorkspaceMutation('activities');

    const activities = activitiesData?.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date.getTime() : 0;
        const dateB = b.date instanceof Date ? b.date.getTime() : 0;
        return dateB - dateA;
    });

    if (isClientLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-12 w-48 bg-slate-100 rounded-2xl" />
                <div className="h-64 bg-white rounded-[2.5rem] border border-slate-100" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-slate-900 uppercase">Cliente no encontrado</h2>
                <Link to="/clients">
                    <Button variant="link" className="mt-4 text-emerald-600 font-bold">Volver al directorio</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/clients" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold group">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                        <ChevronLeft className="h-5 w-5" />
                    </div>
                    Volver
                </Link>
                <div className="flex gap-3">
                    <ClientDialog
                        client={client}
                        trigger={<Button variant="outline" className="h-12 rounded-2xl border-slate-200 font-bold px-6 bg-white">Editar Perfil</Button>}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-lg shadow-emerald-100">
                                Acción rápida
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl">
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="email"
                                email={client.contact.email}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-xl font-bold py-3 px-4 cursor-pointer gap-3">
                                        <Mail className="h-4 w-4 text-emerald-600" /> Enviar Email
                                    </DropdownMenuItem>
                                }
                            />
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="call"
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-xl font-bold py-3 px-4 cursor-pointer gap-3">
                                        <Phone className="h-4 w-4 text-indigo-600" /> Registrar Llamada
                                    </DropdownMenuItem>
                                }
                            />
                            <TaskDialog
                                clientId={id!}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-xl font-bold py-3 px-4 cursor-pointer gap-3">
                                        <Plus className="h-4 w-4 text-slate-600" /> Nueva Tarea
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Info Card */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-10">
                    <div className="space-y-10">
                        {/* Top Profile Header */}
                        <div className="flex items-center gap-8 pb-10 border-b border-slate-50">
                            <div className="h-28 w-28 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 font-black text-5xl border-2 border-emerald-100 shadow-inner shrink-0">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <div className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 inline-block border",
                                    client.stage === 'nuevo' ? "bg-blue-100 text-blue-700 border-blue-200" :
                                        client.stage === 'contactado' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                            client.stage === 'negociacion' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                client.stage === 'ganado' ? "bg-slate-900 text-white border-slate-900 shadow-lg" :
                                                    client.stage === 'perdido' ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-slate-100 text-slate-600"
                                )}>
                                    {client.stage}
                                </div>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">{client.name}</h1>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Left: Contact Info */}
                            <div className="lg:w-1/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 h-fit">
                                {client.contact.email && (
                                    <div className="flex items-center gap-4 text-slate-500 font-bold group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <span className="truncate">{client.contact.email}</span>
                                    </div>
                                )}
                                {client.contact.phone && (
                                    <div className="flex items-center gap-4 text-slate-500 font-bold group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        {client.contact.phone}
                                    </div>
                                )}
                                {client.company && (
                                    <div className="flex items-center gap-4 text-slate-500 font-bold group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        {client.company}
                                    </div>
                                )}
                                {client.budget && (
                                    <div className="flex items-center gap-4 text-slate-500 font-bold group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                            <Landmark className="h-5 w-5" />
                                        </div>
                                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(client.budget)}
                                    </div>
                                )}
                                {client.source && (
                                    <div className="flex items-center gap-4 text-slate-500 font-bold group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                                            <Share2 className="h-5 w-5" />
                                        </div>
                                        {client.source}
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-slate-500 font-bold group">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    {client.createdAt instanceof Date ? format(client.createdAt, 'dd MMM, yyyy', { locale: es }) : 'Reciente'}
                                </div>
                            </div>

                            {/* Right: Metrics Pulse */}
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <Card className="border-slate-100 bg-slate-50/20 rounded-3xl p-6 border-2 group hover:border-indigo-100 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-100 group-hover:scale-110 transition-transform">
                                            <Briefcase className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="font-black text-slate-500 uppercase text-[9px] tracking-widest">Proyectos</h3>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-black text-slate-900">{projects?.length || 0}</p>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Activos</span>
                                    </div>
                                </Card>

                                <Card className="border-slate-100 bg-slate-50/20 rounded-3xl p-6 border-2 group hover:border-rose-100 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-rose-500 rounded-lg shadow-md shadow-rose-100 group-hover:scale-110 transition-transform">
                                            <TrendingUp className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="font-black text-slate-500 uppercase text-[9px] tracking-widest">Urgente</h3>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-black text-slate-900">{tasks?.filter(t => t.priority === 3 && t.status !== 'done').length || 0}</p>
                                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">Prioridad Alta</span>
                                    </div>
                                </Card>

                                <Card className="border-slate-100 bg-slate-50/20 rounded-3xl p-6 border-2 group hover:border-amber-100 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-amber-500 rounded-lg shadow-md shadow-amber-100 group-hover:scale-110 transition-transform">
                                            <Zap className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="font-black text-slate-500 uppercase text-[9px] tracking-widest">Inversión</h3>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 truncate">
                                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(client.budget || 0)}
                                    </p>
                                </Card>

                                <Card className="border-slate-100 bg-slate-50/20 rounded-3xl p-6 border-2 group hover:border-emerald-100 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-emerald-500 rounded-lg shadow-md shadow-emerald-100 group-hover:scale-110 transition-transform">
                                            <Timer className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="font-black text-slate-500 uppercase text-[9px] tracking-widest">Ritmo</h3>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-black text-slate-900">
                                            {activities && activities.length > 0 ?
                                                Math.floor((new Date().getTime() - (activities[0].date as Date).getTime()) / (1000 * 60 * 60 * 24)) : 0
                                            }
                                        </p>
                                        <span className="text-[10px] font-bold text-slate-400">días sin contacto</span>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                <div className="lg:col-span-2 flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                <Clock className="h-4 w-4" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Historial de actividades </h2>
                        </div>
                        <ActivityDialog clientId={id!} />
                    </div>

                    {/* Contenedor con Scroll e Historia */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm relative overflow-hidden h-[450px] flex flex-col">
                        <div
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-6 space-y-1 relative scrollbar-hide"
                        >
                            {/* Línea vertical de fondo */}
                            <div className="absolute left-[39px] top-10 bottom-10 w-px bg-slate-50" />

                            {activities && activities.length > 0 ? (
                                <>
                                    {activities.map((activity, index) => {
                                        const isFirstOfDay = index === 0 ||
                                            (activity.date instanceof Date && activities[index - 1].date instanceof Date &&
                                                format(activity.date, 'yyyy-MM-dd') !== format(activities[index - 1].date, 'yyyy-MM-dd'));

                                        return (
                                            <div key={activity.id} className="space-y-4">
                                                {isFirstOfDay && (
                                                    <div className="py-4 flex items-center gap-4">
                                                        <div className="h-px flex-1 bg-slate-50" />
                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] whitespace-nowrap">
                                                            {format(activity.date as Date, 'dd MMMM', { locale: es })}
                                                        </span>
                                                        <div className="h-px flex-1 bg-slate-50" />
                                                    </div>
                                                )}

                                                <div className="relative flex items-start gap-6 group">
                                                    {/* Punto/Icono en la línea */}
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm transition-all group-hover:scale-110",
                                                        activity.type === 'note' ? "bg-slate-900" :
                                                            activity.type === 'call' ? "bg-indigo-600" :
                                                                activity.type === 'meeting' ? "bg-emerald-600" : "bg-blue-600"
                                                    )}>
                                                        <ActivityIcon type={activity.type} size="h-3 w-3" />
                                                    </div>

                                                    {/* Contenido Compacto */}
                                                    <div className={cn(
                                                        "flex-1 p-4 rounded-2xl border transition-all hover:shadow-md",
                                                        activity.type === 'note' ? "bg-slate-50/50 border-slate-100 hover:bg-white" :
                                                            activity.type === 'call' ? "bg-indigo-50/30 border-indigo-100/50 hover:bg-white" :
                                                                activity.type === 'meeting' ? "bg-emerald-50/30 border-emerald-100/50 hover:bg-white" :
                                                                    "bg-blue-50/30 border-blue-100/50 hover:bg-white"
                                                    )}>
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase text-slate-900">
                                                                    {activity.type === 'note' ? 'Nota' :
                                                                        activity.type === 'call' ? 'Llamada' :
                                                                            activity.type === 'email' ? 'Email' :
                                                                                activity.type === 'meeting' ? 'Reunión' : activity.type}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-400">
                                                                    {format(activity.date as Date, 'HH:mm')}
                                                                </span>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all outline-none">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl min-w-[160px]">
                                                                    <ActivityDialog
                                                                        clientId={id!}
                                                                        activity={activity}
                                                                        trigger={
                                                                            <DropdownMenuItem
                                                                                onSelect={(e) => e.preventDefault()}
                                                                                className="rounded-xl font-bold py-3 px-4 cursor-pointer gap-3"
                                                                            >
                                                                                <Edit2 className="h-4 w-4 text-emerald-600" /> Editar
                                                                            </DropdownMenuItem>
                                                                        }
                                                                    />
                                                                    <DropdownMenuItem
                                                                        className="rounded-xl font-bold py-3 px-4 cursor-pointer gap-3 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                                                        onClick={() => setDeleteActivityId(activity.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" /> Eliminar
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                                            {activity.summary}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Scroll Indicator Overlay */}
                                    {showIndicator && activities.length > 3 && (
                                        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center pointer-events-none animate-in fade-in duration-500">
                                            {/* Degradado para dar profundidad */}
                                            <div className="absolute bottom-[-24px] left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent" />

                                            {/* El aviso visual */}
                                            <div className="relative z-20 flex flex-col items-center gap-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                                                    Ver más
                                                </span>
                                                <ChevronDown className="h-4 w-4 text-emerald-500 animate-bounce" />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="h-6 w-6 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-bold italic text-sm">Sin actividad reciente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Linked Entities */}
                <div className="flex flex-col space-y-8 h-[450px] mt-[56px]">
                    {/* Projects Section */}
                    <Card className="border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-100 overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Proyectos</CardTitle>
                            <CreateProjectDialog clientId={id!} />
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {projects && projects.length > 0 ? (
                                projects.map(project => (
                                    <Link key={project.id} to={`/projects/${project.id}`} className="block p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{project.name}</h4>
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                project.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                                            )} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                                                <span>Progreso</span>
                                                <span className="text-slate-600">65%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 group-hover:bg-emerald-600"
                                                    style={{ width: '65%' }}
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center py-4 text-xs font-bold text-slate-400">Sin proyectos activos</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Tools */}
                    <Card className="border-none bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-300 mt-auto">
                        <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Acciones</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="email"
                                email={client.contact.email}
                                trigger={
                                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                                        <Mail className="h-5 w-5 text-emerald-400" />
                                        <span className="text-[10px] font-black uppercase">Email</span>
                                    </button>
                                }
                            />
                            <ActivityDialog
                                clientId={id!}
                                clientName={client.name}
                                defaultType="meeting"
                                trigger={
                                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                                        <Video className="h-5 w-5 text-indigo-400" />
                                        <span className="text-[10px] font-black uppercase">Reunión</span>
                                    </button>
                                }
                            />
                        </div>
                    </Card>
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
                    } catch (error) {
                        toast.error('Error al eliminar');
                    } finally {
                        setIsDeletingActivity(false);
                    }
                }}
                title="Eliminar Actividad"
                description="¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer."
                isLoading={isDeletingActivity}
            />
        </div>
    );
}

function ActivityIcon({ type, size = "h-5 w-5" }: { type: Activity['type'], size?: string }) {
    switch (type) {
        case 'note': return <MessageSquare className={cn(size, "text-white")} />;
        case 'call': return <Phone className={cn(size, "text-white")} />;
        case 'email': return <Mail className={cn(size, "text-white")} />;
        case 'meeting': return <Video className={cn(size, "text-white")} />;
        default: return <Clock className={cn(size, "text-white")} />;
    }
}
