import { useMemo, useState } from 'react';
import { Columns, Filter, LayoutGrid, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control';
import ClientCard from '@/components/common/ClientCard';
import { useWorkspaceMutation, useWorkspaceQuery } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import type { Client } from '@/types';
import PipelineView from '@/features/clients/PipelineView';
import FilterSidebar, { type ClientFilters } from './FilterSidebar';
import CreateClientDialog from './ClientDialog';
import { STAGE_CONFIG } from './clientConstants';

export default function ClientsPage() {
    const { data: clients, isLoading } = useWorkspaceQuery<Client>('clients', 'all-clients');
    const { deleteMutation, updateMutation } = useWorkspaceMutation('clients');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'pipeline'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<ClientFilters>({
        source: [],
        stage: [],
        minBudget: '',
        maxBudget: '',
    });
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const hasActiveFilters =
        filters.source.length > 0 ||
        filters.stage.length > 0 ||
        Boolean(filters.minBudget) ||
        Boolean(filters.maxBudget);
    const activeFilterCount =
        filters.source.length +
        filters.stage.length +
        (filters.minBudget ? 1 : 0) +
        (filters.maxBudget ? 1 : 0);

    const filteredClients = useMemo(() => {
        if (!clients) return [];

        return clients
            .filter((client) => {
                // Search term filter
                const matchesSearch =
                    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client.contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client.contact.phone?.toLowerCase().includes(searchTerm.toLowerCase());

                if (!matchesSearch) return false;

                // Advanced filters
                if (filters.source.length > 0 && !filters.source.includes(client.source || 'otro')) return false;
                if (filters.stage.length > 0 && !filters.stage.includes(client.stage)) return false;
                if (filters.minBudget && (client.budget || 0) < parseFloat(filters.minBudget)) return false;
                if (filters.maxBudget && (client.budget || 0) > parseFloat(filters.maxBudget)) return false;

                return true;
            })
            .sort((a, b) => {
                const dateA = a.updatedAt?.getTime() || a.createdAt?.getTime() || 0;
                const dateB = b.updatedAt?.getTime() || b.createdAt?.getTime() || 0;
                return dateB - dateA;
            });
    }, [clients, filters, searchTerm]);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutateAsync(deleteId);
            toast.success('Cliente eliminado');
            setDeleteId(null);
        } catch {
            toast.error('Error al eliminar');
        }
    };

    const handleUpdateStage = async (id: string, stage: Client['stage']) => {
        try {
            await updateMutation.mutateAsync({
                id,
                data: { stage },
            });
            toast.success(`Etapa actualizada a ${STAGE_CONFIG[stage].label}`);
        } catch {
            toast.error('Error al actualizar etapa');
        }
    };

    const handleToggleWhatsApp = async (client: Client) => {
        const newState = !client.contact.noWhatsApp;

        try {
            await updateMutation.mutateAsync({
                id: client.id,
                data: {
                    contact: { ...client.contact, noWhatsApp: newState },
                },
            });
            toast.success(newState ? 'Marcado como sin WhatsApp' : 'WhatsApp habilitado');
        } catch {
            toast.error('Error al actualizar estado');
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                        key={item}
                        className="h-[360px] animate-pulse rounded-[2.5rem] border border-slate-100 bg-white shadow-sm"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 pb-16">
            <PageHeader
                title="Clientes"
                subtitle="Gestiona tu embudo de ventas y prospectos de WhatsApp."
                actions={<CreateClientDialog />}
            />

            <div className="flex flex-col items-center gap-4 lg:flex-row">
                <div className="group relative w-full flex-1">
                    <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" />
                    <Input
                        placeholder="Buscar por nombre, empresa, email o telefono..."
                        className="h-[3.25rem] rounded-2xl border-slate-200 bg-white pl-14 text-base shadow-sm transition-all focus:ring-4 focus:ring-emerald-500/10"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                <SegmentedControl>
                    <SegmentedControlItem
                        active={viewMode === 'grid'}
                        onClick={() => setViewMode('grid')}
                        icon={LayoutGrid}
                        label="Cards"
                    />
                    <SegmentedControlItem
                        active={viewMode === 'pipeline'}
                        onClick={() => setViewMode('pipeline')}
                        icon={Columns}
                        label="Pipeline"
                    />
                </SegmentedControl>

                <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(true)}
                    className={cn(
                        'h-[3.25rem] gap-3 rounded-2xl border-slate-200 bg-white px-6 font-black transition-all hover:bg-slate-50',
                        hasActiveFilters && 'border-emerald-200 bg-emerald-50/30 text-emerald-700'
                    )}
                >
                    <Filter className="h-5 w-5" />
                    Filtros Avanzados
                    {activeFilterCount > 0 ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                            {activeFilterCount}
                        </span>
                    ) : null}
                </Button>
            </div>

            {viewMode === 'grid' ? (
                filteredClients.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {filteredClients.map((client) => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                onDelete={setDeleteId}
                                onUpdateStage={handleUpdateStage}
                                onToggleWhatsApp={handleToggleWhatsApp}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white shadow-xl shadow-slate-200/30">
                        <EmptyState
                            icon={hasActiveFilters || searchTerm ? Search : LayoutGrid}
                            title={hasActiveFilters || searchTerm ? 'Sin resultados' : 'Aun no hay clientes'}
                            description={
                                hasActiveFilters || searchTerm
                                    ? 'Ajusta tu busqueda o limpia los filtros para ver mas resultados.'
                                    : 'Empieza creando tu primer cliente para construir el pipeline.'
                            }
                        />
                    </div>
                )
            ) : filteredClients.length > 0 ? (
                <PipelineView clients={filteredClients} onUpdateStage={handleUpdateStage} />
            ) : (
                <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white shadow-xl shadow-slate-200/30">
                    <EmptyState
                        icon={Columns}
                        title="Pipeline vacio"
                        description="No hay clientes para mostrar con los filtros actuales."
                    />
                </div>
            )}

            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar cliente?"
                description="Esta accion no se puede deshacer. Se perdera toda la informacion del contacto y sus proyectos asociados."
                confirmText="Eliminar permanentemente"
                cancelText="Mantener cliente"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
