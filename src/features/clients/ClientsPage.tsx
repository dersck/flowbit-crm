import { useState, useMemo } from 'react';
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
    Trash2,
    MoreVertical,
    CheckCircle2,
    MessageSquare,
    TrendingUp,
    XCircle,
    UserPlus,
    Building2,
    Landmark,
    Facebook,
    Instagram,
    Globe,
    Users,
    Zap,
    Clock,
    MessageSquareOff,
    LayoutGrid,
    Columns
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import CreateClientDialog from './CreateClientDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FilterSidebar from './FilterSidebar';
import PipelineView from '@/features/clients/PipelineView';

const STAGE_CONFIG = {
    nuevo: { label: 'Nuevo Lead', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: UserPlus },
    contactado: { label: 'Contactado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: MessageSquare },
    negociacion: { label: 'Negociación', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: TrendingUp },
    ganado: { label: 'Ganado', color: 'bg-slate-900 text-white border-slate-900', icon: CheckCircle2 },
    perdido: { label: 'Perdido', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
} as const;

const SOURCE_CONFIG = {
    facebook: { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    google: { icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    referencia: { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    frio: { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    whatsapp: { icon: WhatsAppIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    otro: { icon: MessageSquare, color: 'text-slate-600', bg: 'bg-slate-50' },
} as const;

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

export default function ClientsPage() {
    const { data: clients, isLoading } = useWorkspaceQuery<Client>('clients', 'all-clients');
    const { deleteMutation, updateMutation } = useWorkspaceMutation('clients');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'pipeline'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        source: [] as string[],
        stage: [] as string[],
        minBudget: '',
        maxBudget: '',
    });
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredClients = useMemo(() => {
        if (!clients) return [];

        return clients.filter(client => {
            // Search term filter
            const matchesSearch =
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.contact.phone?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // Advanced filters
            if (filters.source.length > 0 && !filters.source.includes(client.source || 'otro')) return false;
            if (filters.stage.length > 0 && !filters.stage.includes(client.stage)) return false;

            if (filters.minBudget && (client.budget || 0) < parseFloat(filters.minBudget)) return false;
            if (filters.maxBudget && (client.budget || 0) > parseFloat(filters.maxBudget)) return false;

            return true;
        }).sort((a, b) => {
            const dateA = a.updatedAt?.getTime() || a.createdAt?.getTime() || 0;
            const dateB = b.updatedAt?.getTime() || b.createdAt?.getTime() || 0;
            return dateB - dateA;
        });
    }, [clients, searchTerm, filters]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteMutation.mutateAsync(deleteId);
            toast.success('Cliente eliminado');
            setDeleteId(null);
        } catch (e) {
            toast.error('Error al eliminar');
        }
    };

    const handleUpdateStage = async (id: string, stage: Client['stage']) => {
        setActiveMenu(null);
        try {
            await updateMutation.mutateAsync({
                id,
                data: { stage, updatedAt: new Date() }
            });
            toast.success(`Etapa actualizada a ${STAGE_CONFIG[stage].label}`);
        } catch (e) {
            toast.error('Error al actualizar etapa');
        }
    };

    const handleToggleWhatsApp = async (client: Client) => {
        setActiveMenu(null);
        const newState = !client.contact.noWhatsApp;
        try {
            await updateMutation.mutateAsync({
                id: client.id,
                data: {
                    contact: { ...client.contact, noWhatsApp: newState },
                    updatedAt: new Date()
                }
            });
            toast.success(newState ? 'Marcado como sin WhatsApp' : 'WhatsApp habilitado');
        } catch (e) {
            toast.error('Error al actualizar estado');
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

            <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <Input
                        placeholder="Buscar por nombre, empresa o teléfono..."
                        className="pl-14 h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 text-lg transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-[1.25rem] border border-slate-200 shadow-inner">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "h-11 px-5 rounded-xl gap-2 font-black transition-all",
                            viewMode === 'grid' ? "bg-white text-slate-900 shadow-md hover:bg-white" : "text-slate-500 hover:bg-slate-200"
                        )}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Cards
                    </Button>
                    <Button
                        variant={viewMode === 'pipeline' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('pipeline')}
                        className={cn(
                            "h-11 px-5 rounded-xl gap-2 font-black transition-all",
                            viewMode === 'pipeline' ? "bg-white text-slate-900 shadow-md hover:bg-white" : "text-slate-500 hover:bg-slate-200"
                        )}
                    >
                        <Columns className="h-4 w-4" />
                        Pipeline
                    </Button>
                </div>

                <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(true)}
                    className={cn(
                        "h-14 px-8 border-slate-200 rounded-2xl gap-3 font-black transition-all bg-white hover:bg-slate-50",
                        (filters.source.length > 0 || filters.stage.length > 0 || filters.minBudget || filters.maxBudget) && "border-emerald-200 bg-emerald-50/30 text-emerald-700"
                    )}
                >
                    <Filter className="h-5 w-5" />
                    Filtros Avanzados
                    {(filters.source.length > 0 || filters.stage.length > 0) && (
                        <span className="bg-emerald-600 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                            {filters.source.length + filters.stage.length}
                        </span>
                    )}
                </Button>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredClients?.map((client) => {
                        const config = STAGE_CONFIG[client.stage] || STAGE_CONFIG.nuevo;
                        const StageIcon = config.icon;

                        return (
                            <Card
                                key={client.id}
                                className={cn(
                                    "group relative hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 border-none bg-white rounded-[3rem] overflow-visible shadow-xl shadow-slate-200/40 flex flex-col h-[520px]",
                                    activeMenu === client.id && "z-50 shadow-2xl"
                                )}
                            >
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="p-8 flex-1">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 font-black text-4xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6 border border-slate-100 shadow-inner">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div className={cn(
                                                "px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border shadow-sm flex items-center gap-2",
                                                config.color
                                            )}>
                                                <StageIcon className="h-3.5 w-3.5" />
                                                {config.label}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-3">
                                            {client.source && (
                                                <div className={cn(
                                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tight",
                                                    SOURCE_CONFIG[client.source].bg,
                                                    SOURCE_CONFIG[client.source].color
                                                )}>
                                                    {(() => {
                                                        const SrcIcon = SOURCE_CONFIG[client.source].icon;
                                                        return <SrcIcon className="h-3 w-3" />;
                                                    })()}
                                                    {client.source}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Clock className="h-3 w-3" />
                                                {client.updatedAt ? formatDistanceToNow(client.updatedAt, { addSuffix: true, locale: es }) : 'Reciente'}
                                            </div>
                                        </div>

                                        <Link to={`/clients/${client.id}`} className="block group/title h-14">
                                            <h3 className="text-3xl font-black text-slate-900 group-hover/title:text-emerald-600 transition-colors tracking-tighter leading-tight truncate">
                                                {client.name}
                                            </h3>
                                            {client.company ? (
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-1 uppercase tracking-wider truncate">
                                                    <Building2 className="h-3 w-3" />
                                                    {client.company}
                                                </div>
                                            ) : (
                                                <div className="h-6" />
                                            )}
                                        </Link>

                                        <div className="mt-6 space-y-3 h-32">
                                            {client.contact.email ? (
                                                <div className="flex items-center gap-4 text-sm font-bold text-slate-500 group/item">
                                                    <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-emerald-50 group-hover/item:text-emerald-600 transition-all border border-slate-100">
                                                        <Mail className="h-4 w-4" />
                                                    </div>
                                                    <span className="truncate">{client.contact.email}</span>
                                                </div>
                                            ) : (
                                                <div className="h-9" />
                                            )}
                                            {client.contact.phone ? (
                                                <a
                                                    href={`tel:${client.contact.phone}`}
                                                    className="flex items-center gap-4 text-sm font-bold text-slate-500 group/item hover:text-indigo-600 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-all border border-slate-100">
                                                        <Phone className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-mono">{client.contact.phone}</span>
                                                </a>
                                            ) : (
                                                <div className="h-9" />
                                            )}
                                            {client.budget ? (
                                                <div className="flex items-center gap-4 text-sm font-bold text-slate-500 group/item">
                                                    <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                                                        <Landmark className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-amber-700 font-black">${client.budget.toLocaleString()}</span>
                                                </div>
                                            ) : (
                                                <div className="h-9" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 px-10 py-7 border-t border-slate-50 flex items-center justify-center gap-3 group-hover:bg-white transition-colors duration-300 rounded-b-[3rem] mt-auto">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all flex-shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteId(client.id);
                                            }}
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(activeMenu === client.id ? null : client.id);
                                                }}
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>

                                            {activeMenu === client.id && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-3 pb-2 text-center">Mover a etapa</p>
                                                    <div className="space-y-1">
                                                        {(Object.entries(STAGE_CONFIG) as [Client['stage'], any][]).map(([key, cfg]) => (
                                                            <button
                                                                key={key}
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUpdateStage(client.id, key);
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 p-3 rounded-2xl text-[11px] font-bold transition-all hover:bg-slate-50 text-left",
                                                                    client.stage === key ? "text-slate-900 bg-slate-50/50" : "text-slate-500"
                                                                )}
                                                            >
                                                                <cfg.icon className={cn("h-4 w-4", client.stage === key ? "text-slate-900" : "text-slate-400")} />
                                                                {cfg.label}
                                                            </button>
                                                        ))}
                                                        <div className="pt-2 mt-2 border-t border-slate-100">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleWhatsApp(client);
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 p-3 rounded-2xl text-[11px] font-bold transition-all text-left",
                                                                    client.contact.noWhatsApp ? "text-emerald-600 hover:bg-emerald-50" : "text-amber-600 hover:bg-amber-50"
                                                                )}
                                                            >
                                                                {client.contact.noWhatsApp ? (
                                                                    <MessageSquare className="h-4 w-4" />
                                                                ) : (
                                                                    <MessageSquareOff className="h-4 w-4" />
                                                                )}
                                                                {client.contact.noWhatsApp ? 'Tiene WhatsApp' : 'No tiene WhatsApp'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {client.contact.phone && (
                                            client.contact.noWhatsApp ? (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    disabled
                                                    className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-300 border-none opacity-40 flex-shrink-0"
                                                    title="Este número no tiene WhatsApp"
                                                >
                                                    <MessageSquareOff className="h-5 w-5" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    className="h-12 w-12 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 border-none shadow-lg shadow-emerald-200/50 transition-all transform active:scale-95 flex-shrink-0"
                                                >
                                                    <a
                                                        href={`https://wa.me/${client.contact.phone.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <WhatsAppIcon className="h-5 w-5" />
                                                    </a>
                                                </Button>
                                            )
                                        )}

                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            className="h-12 w-12 rounded-2xl border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-xl transition-all transform active:scale-95 flex-shrink-0"
                                        >
                                            <Link to={`/clients/${client.id}`}>
                                                <ExternalLink className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <PipelineView clients={filteredClients || []} onUpdateStage={handleUpdateStage} />
            )}

            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />

            {activeMenu && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveMenu(null)} />}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="¿Eliminar cliente?"
                description="Esta acción no se puede deshacer. Se perderá toda la información del contacto y sus proyectos asociados."
                confirmText="Eliminar permanentemente"
                cancelText="Mantener cliente"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
