import { type ReactNode } from 'react';
import { Landmark, Share2, Target } from 'lucide-react';
import type { Client } from '@/types';
import { Button } from '@/components/ui/button';
import {
    DrawerDialog,
    DrawerDialogBody,
    DrawerDialogTrigger,
    DrawerDialogContent,
    DrawerDialogDescription,
    DrawerDialogFooter,
    DrawerDialogHeader,
    DrawerDialogTitle,
} from '@/components/ui/drawer-dialog';
import { FilterChip } from '@/components/ui/filter-chip';
import { FieldGroup } from '@/components/ui/form-field';
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
    onOpenChange: (open: boolean) => void;
    filters: ClientFilters;
    setFilters: (filters: ClientFilters) => void;
    trigger?: ReactNode;
}

export default function FilterSidebar({
    isOpen,
    onOpenChange,
    filters,
    setFilters,
    trigger,
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
        <DrawerDialog open={isOpen} onOpenChange={onOpenChange}>
            {trigger ? <DrawerDialogTrigger asChild>{trigger}</DrawerDialogTrigger> : null}
            <DrawerDialogContent aria-describedby="client-filter-description">
                <DrawerDialogHeader>
                    <DrawerDialogTitle>Filtros Avanzados</DrawerDialogTitle>
                    <DrawerDialogDescription id="client-filter-description">
                        Refina tu busqueda de leads.
                    </DrawerDialogDescription>
                </DrawerDialogHeader>

                <DrawerDialogBody className="space-y-10">
                    <section className="space-y-4" aria-labelledby="client-filter-source">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Share2 className="h-4 w-4" />
                            <h2 id="client-filter-source" className="text-[10px] font-black uppercase tracking-widest">
                                Origen del Lead
                            </h2>
                        </div>
                        <ul className="flex flex-wrap gap-2">
                            {CLIENT_SOURCE_OPTIONS.map((source) => (
                                <li key={source.id}>
                                    <FilterChip
                                        label={source.label}
                                        selected={filters.source.includes(source.id)}
                                        onClick={() => toggleFilter('source', source.id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-4" aria-labelledby="client-filter-stage">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Target className="h-4 w-4" />
                            <h2 id="client-filter-stage" className="text-[10px] font-black uppercase tracking-widest">
                                Etapa Actual
                            </h2>
                        </div>
                        <ul className="flex flex-wrap gap-2">
                            {CLIENT_STAGE_OPTIONS.map((stage) => (
                                <li key={stage.id}>
                                    <FilterChip
                                        label={STAGE_CONFIG[stage.id].label}
                                        selected={filters.stage.includes(stage.id)}
                                        tone="emerald"
                                        onClick={() => toggleFilter('stage', stage.id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-4" aria-labelledby="client-filter-budget">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Landmark className="h-4 w-4" />
                            <h2 id="client-filter-budget" className="text-[10px] font-black uppercase tracking-widest">
                                Rango de Presupuesto
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FieldGroup label="Minimo">
                                {(fieldProps) => (
                                    <Input
                                        {...fieldProps}
                                        type="number"
                                        placeholder="0"
                                        value={filters.minBudget}
                                        onChange={(event) => setFilters({ ...filters, minBudget: event.target.value })}
                                        className="border-slate-100 bg-slate-50 font-bold"
                                    />
                                )}
                            </FieldGroup>
                            <FieldGroup label="Maximo">
                                {(fieldProps) => (
                                    <Input
                                        {...fieldProps}
                                        type="number"
                                        placeholder="Sin limite"
                                        value={filters.maxBudget}
                                        onChange={(event) => setFilters({ ...filters, maxBudget: event.target.value })}
                                        className="border-slate-100 bg-slate-50 font-bold"
                                    />
                                )}
                            </FieldGroup>
                        </div>
                    </section>
                </DrawerDialogBody>

                <DrawerDialogFooter>
                    <div className="grid grid-cols-2 gap-4">
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
                            onClick={() => onOpenChange(false)}
                        >
                            Ver resultados
                        </Button>
                    </div>
                </DrawerDialogFooter>
            </DrawerDialogContent>
        </DrawerDialog>
    );
}
