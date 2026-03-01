import { AnimatePresence, motion } from 'framer-motion';
import { Landmark, Share2, Target, X } from 'lucide-react';
import type { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { FieldLabel } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { CLIENT_SOURCE_OPTIONS, CLIENT_STAGE_OPTIONS, STAGE_CONFIG } from './clientConstants';

export interface ClientFilters {
    source: Array<Client['source'] | 'otro'>;
    stage: Client['stage'][];
    minBudget: string;
    maxBudget: string;
}

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: ClientFilters;
    setFilters: (filters: ClientFilters) => void;
}

export default function FilterSidebar({
    isOpen,
    onClose,
    filters,
    setFilters,
}: FilterSidebarProps) {
    const clearFilters = () => {
        setFilters({
            source: [],
            stage: [],
            minBudget: '',
            maxBudget: '',
        });
    };

    const toggleFilter = (
        type: 'source' | 'stage',
        id: Client['stage'] | Client['source'] | 'otro'
    ) => {
        const current = [...filters[type]];
        const index = current.indexOf(id as never);

        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id as never);
        }

        setFilters({ ...filters, [type]: current });
    };

    return (
        <AnimatePresence>
            {isOpen ? (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 p-8">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-900">Filtros Avanzados</h2>
                                <p className="text-sm font-bold text-slate-500">Refina tu busqueda de leads.</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="scrollbar-hide flex-1 space-y-10 overflow-y-auto p-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Share2 className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Origen del Lead</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {CLIENT_SOURCE_OPTIONS.map((source) => (
                                        <FilterChip
                                            key={source.id}
                                            label={source.label}
                                            selected={filters.source.includes(source.id)}
                                            onClick={() => toggleFilter('source', source.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Target className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Etapa Actual</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {CLIENT_STAGE_OPTIONS.map((stage) => (
                                        <FilterChip
                                            key={stage.id}
                                            label={STAGE_CONFIG[stage.id].label}
                                            selected={filters.stage.includes(stage.id)}
                                            tone="emerald"
                                            onClick={() => toggleFilter('stage', stage.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Landmark className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Rango de Presupuesto</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <FieldLabel className="ml-1 text-[9px]">Minimo</FieldLabel>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={filters.minBudget}
                                            onChange={(event) => setFilters({ ...filters, minBudget: event.target.value })}
                                            className="border-slate-100 bg-slate-50 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FieldLabel className="ml-1 text-[9px]">Maximo</FieldLabel>
                                        <Input
                                            type="number"
                                            placeholder="Sin limite"
                                            value={filters.maxBudget}
                                            onChange={(event) => setFilters({ ...filters, maxBudget: event.target.value })}
                                            className="border-slate-100 bg-slate-50 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 p-8">
                            <Button
                                variant="ghost"
                                className="h-14 rounded-2xl font-black text-slate-400 hover:text-slate-900"
                                onClick={clearFilters}
                            >
                                Limpiar todo
                            </Button>
                            <Button
                                variant="pagePrimary"
                                size="xl"
                                className="shadow-xl shadow-slate-200"
                                onClick={onClose}
                            >
                                Ver resultados
                            </Button>
                        </div>
                    </motion.div>
                </>
            ) : null}
        </AnimatePresence>
    );
}
