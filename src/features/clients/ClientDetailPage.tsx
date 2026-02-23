import { useParams, Link } from 'react-router-dom';
import { useEntityQuery, useWorkspaceQuery } from '@/hooks/useFirestore';
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
    CheckCircle2,
    Plus,
    Clock,
    MessageSquare,
    Video,
    Building2,
    Landmark,
    Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { where, orderBy } from 'firebase/firestore';
import ClientDialog from './ClientDialog';
import ActivityDialog from './ActivityDialog';
import CreateProjectDialog from '../projects/CreateProjectDialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: client, isLoading: isClientLoading } = useEntityQuery<Client>('clients', id);
    const { data: projects } = useWorkspaceQuery<Project>('projects', 'client-projects', [
        where('clientId', '==', id)
    ]);
    const { data: tasks } = useWorkspaceQuery<Task>('tasks', 'client-tasks', [
        where('clientId', '==', id)
    ]);
    const { data: activities } = useWorkspaceQuery<Activity>('activities', 'client-activities', [
        where('clientId', '==', id),
        orderBy('date', 'desc')
    ]);

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
                            <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 cursor-pointer gap-3">
                                <Mail className="h-4 w-4 text-emerald-600" /> Enviar Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 cursor-pointer gap-3">
                                <Phone className="h-4 w-4 text-indigo-600" /> Registrar Llamada
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 cursor-pointer gap-3">
                                <Plus className="h-4 w-4 text-slate-600" /> Nueva Tarea
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Info Card */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-10">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Profile Section */}
                        <div className="lg:w-1/3 space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 font-black text-4xl border-2 border-emerald-100 shadow-inner">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block border",
                                        client.stage === 'nuevo' ? "bg-blue-100 text-blue-700 border-blue-200" :
                                            client.stage === 'contactado' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                client.stage === 'negociacion' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                    client.stage === 'ganado' ? "bg-slate-900 text-white border-slate-900 shadow-lg" :
                                                        client.stage === 'perdido' ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {client.stage}
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{client.name}</h1>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                {client.contact.email && (
                                    <div className="flex items-center gap-4 text-slate-500 font-bold group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        {client.contact.email}
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
                                        Origen: <span className="capitalize">{client.source}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-slate-500 font-bold group">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    Registrado el {client.createdAt instanceof Date ? format(client.createdAt, 'dd MMMM, yyyy', { locale: es }) : 'Reciente'}
                                </div>
                            </div>
                        </div>

                        {/* Summary Grid */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-slate-100 bg-slate-50/30 rounded-3xl p-6 border-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                                        <Briefcase className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Proyectos</h3>
                                </div>
                                <p className="text-4xl font-black text-slate-900">{projects?.length || 0}</p>
                                <p className="text-xs font-bold text-slate-400 mt-2">Gestionando resultados</p>
                            </Card>

                            <Card className="border-slate-100 bg-slate-50/30 rounded-3xl p-6 border-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-100">
                                        <CheckCircle2 className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Tareas Pendientes</h3>
                                </div>
                                <p className="text-4xl font-black text-slate-900">{tasks?.filter(t => t.status !== 'done').length || 0}</p>
                                <p className="text-xs font-bold text-slate-400 mt-2">Acciones próximas</p>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline / Activities */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            Historial de Actividad
                        </h2>
                        <ActivityDialog clientId={id!} />
                    </div>

                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100">
                        {activities && activities.length > 0 ? (
                            activities.map((activity) => (
                                <div key={activity.id} className="relative flex items-start gap-8 group">
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 z-10 shadow-sm border border-white",
                                        activity.type === 'note' ? "bg-slate-900" :
                                            activity.type === 'call' ? "bg-indigo-600" :
                                                activity.type === 'meeting' ? "bg-emerald-600" : "bg-blue-600"
                                    )}>
                                        <ActivityIcon type={activity.type} />
                                    </div>
                                    <Card className="flex-1 border-slate-100 shadow-sm rounded-[2rem] hover:shadow-xl hover:border-slate-200 transition-all bg-white group-hover:-translate-y-1">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {activity.date instanceof Date ? format(activity.date, 'eeee, dd MMMM', { locale: es }) : 'Reciente'}
                                                </p>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-slate-800 font-bold leading-relaxed">{activity.summary}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <div className="pl-16 py-10">
                                <p className="text-slate-400 font-bold italic">No hay interacciones registradas aún.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Linked Entities */}
                <div className="space-y-8">
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
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{project.name}</h4>
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                project.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
                                            )} />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center py-4 text-xs font-bold text-slate-400">Sin proyectos activos</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Tools */}
                    <Card className="border-none bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-300">
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
        </div>
    );
}

function ActivityIcon({ type }: { type: Activity['type'] }) {
    switch (type) {
        case 'note': return <Clock className="h-5 w-5 text-white" />;
        case 'call': return <Phone className="h-5 w-5 text-white" />;
        case 'email': return <Mail className="h-5 w-5 text-white" />;
        case 'meeting': return <Video className="h-5 w-5 text-white" />;
        default: return <MessageSquare className="h-5 w-5 text-white" />;
    }
}
