import { useState } from 'react';
import { useWorkspaceQuery, useWorkspaceMutation } from '@/hooks/useFirestore';
import type { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Search,
    Filter,
    ExternalLink,
    Phone,
    Mail,
    Users,
    Trash2,
    MoreVertical,
    Plus,
    CheckCircle2,
    MessageSquare,
    TrendingUp,
    XCircle,
    UserPlus,
    Building2,
    Landmark
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import CreateClientDialog from './CreateClientDialog';

const STAGE_CONFIG = {
    nuevo: { label: 'Nuevo Lead', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: UserPlus },
    contactado: { label: 'Contactado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: MessageSquare },
    negociacion: { label: 'Negociación', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: TrendingUp },
    ganado: { label: 'Ganado', color: 'bg-slate-900 text-white border-slate-900', icon: CheckCircle2 },
    perdido: { label: 'Perdido', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
} as const;

export default function ClientsPage() {
    const { data: clients, isLoading } = useWorkspaceQuery<Client>('clients', 'all-clients');
    const { deleteMutation, updateMutation } = useWorkspaceMutation('clients');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const filteredClients = clients?.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar cliente? Se perderá toda su información.')) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Cliente eliminado');
        } catch (e) {
            toast.error('Error al eliminar');
        }
    };

    const handleUpdateStage = async (id: string, stage: Client['stage']) => {
        try {
            await updateMutation.mutateAsync({
                id,
                data: { stage, updatedAt: new Date() }
            });
            toast.success(`Etapa actualizada a ${STAGE_CONFIG[stage].label}`);
            setActiveMenu(null);
        } catch (e) {
            toast.error('Error al actualizar etapa');
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-[400px] bg-white rounded-[2.5rem] animate-pulse border border-slate-100 shadow-sm" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Clientes</h1>
                    <p className="text-slate-500 font-bold text-lg mt-1 opacity-80">Gestiona tu embudo de ventas y prospectos de WhatsApp.</p>
                </div>
                <CreateClientDialog />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <Input
                        placeholder="Buscar por nombre, empresa o teléfono..."
                        className="pl-14 h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 text-lg transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-14 px-8 border-slate-200 rounded-2xl gap-3 font-black text-slate-600 bg-white hover:bg-slate-50 transition-all">
                    <Filter className="h-5 w-5" />
                    Filtros Avanzados
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredClients?.map((client) => {
                    const config = STAGE_CONFIG[client.stage] || STAGE_CONFIG.nuevo;
                    const Icon = config.icon;

                    return (
                        <Card key={client.id} className="group relative hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 border-none bg-white rounded-[2.5rem] overflow-visible shadow-xl shadow-slate-200/40">
                            <CardContent className="p-0">
                                <div className="p-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 font-black text-4xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6 border border-slate-100 shadow-inner">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div className={cn(
                                            "px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border shadow-sm flex items-center gap-2",
                                            config.color
                                        )}>
                                            <Icon className="h-3.5 w-3.5" />
                                            {config.label}
                                        </div>
                                    </div>

                                    <Link to={`/clients/${client.id}`} className="block group/title">
                                        <h3 className="text-3xl font-black text-slate-900 group-hover/title:text-emerald-600 transition-colors tracking-tighter leading-tight">
                                            {client.name}
                                        </h3>
                                        {client.company && (
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-1 uppercase tracking-wider">
                                                <Building2 className="h-3 w-3" />
                                                {client.company}
                                            </div>
                                        )}
                                    </Link>

                                    <div className="mt-8 space-y-4">
                                        {client.contact.email && (
                                            <div className="flex items-center gap-4 text-sm font-bold text-slate-500 group/item">
                                                <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-emerald-50 group-hover/item:text-emerald-600 transition-all border border-slate-100">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <span className="truncate">{client.contact.email}</span>
                                            </div>
                                        )}
                                        {client.contact.phone && (
                                            <div className="flex items-center gap-4 text-sm font-bold text-slate-500 group/item">
                                                <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-all border border-slate-100">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                <span className="font-mono">{client.contact.phone}</span>
                                            </div>
                                        )}
                                        {client.budget && (
                                            <div className="flex items-center gap-4 text-sm font-bold text-slate-500 group/item">
                                                <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                                                    <Landmark className="h-4 w-4" />
                                                </div>
                                                <span className="text-amber-700 font-black">${client.budget.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 px-8 py-6 border-t border-slate-50 flex items-center justify-between group-hover:bg-white transition-colors duration-300 rounded-b-[2.5rem]">
                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                            onClick={() => handleDelete(client.id)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>

                                        <div className="relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "h-12 w-12 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all",
                                                    activeMenu === client.id && "bg-slate-100 text-slate-900"
                                                )}
                                                onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>

                                            {/* Quick Actions Menu */}
                                            {activeMenu === client.id && (
                                                <div className="absolute bottom-full left-0 mb-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-3 pb-2">Mover a etapa</p>
                                                    <div className="space-y-1">
                                                        {(Object.entries(STAGE_CONFIG) as [Client['stage'], any][]).map(([key, cfg]) => (
                                                            <button
                                                                key={key}
                                                                onClick={() => handleUpdateStage(client.id, key)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 p-3 rounded-2xl text-[11px] font-bold transition-all hover:bg-slate-50 text-left",
                                                                    client.stage === key ? "text-slate-900 bg-slate-50/50" : "text-slate-500"
                                                                )}
                                                            >
                                                                <cfg.icon className={cn("h-4 w-4", client.stage === key ? "text-slate-900" : "text-slate-400")} />
                                                                {cfg.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Link
                                        to={`/clients/${client.id}`}
                                        className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-xl transition-all transform active:scale-95"
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {/* Empty state remains the same... */}
            </div>
            {activeMenu && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveMenu(null)} />}
        </div>
    );
}
