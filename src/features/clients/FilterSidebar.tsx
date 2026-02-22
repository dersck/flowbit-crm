import { X, Landmark, Share2, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: any;
    setFilters: (filters: any) => void;
}

const SOURCES = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'google', label: 'Google' },
    { id: 'referencia', label: 'Referencia' },
    { id: 'frio', label: 'Frío' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'otro', label: 'Otro' },
];

const STAGES = [
    { id: 'nuevo', label: 'Nuevo Lead' },
    { id: 'contactado', label: 'Contactado' },
    { id: 'negociacion', label: 'Negociación' },
    { id: 'ganado', label: 'Ganado' },
    { id: 'perdido', label: 'Perdido' },
];

export default function FilterSidebar({ isOpen, onClose, filters, setFilters }: FilterSidebarProps) {
    const clearFilters = () => {
        setFilters({
            source: [],
            stage: [],
            minBudget: '',
            maxBudget: '',
        });
    };

    const toggleFilter = (type: 'source' | 'stage', id: string) => {
        const current = [...filters[type]];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setFilters({ ...filters, [type]: current });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Filtros Avanzados</h2>
                                <p className="text-slate-500 font-bold text-sm">Refina tu búsqueda de leads.</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                            {/* Origen */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Share2 className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Origen del Lead</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {SOURCES.map(source => (
                                        <button
                                            key={source.id}
                                            onClick={() => toggleFilter('source', source.id)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[11px] font-bold transition-all border",
                                                filters.source.includes(source.id)
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                    : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300"
                                            )}
                                        >
                                            {source.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Etapa */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Target className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Etapa Actual</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {STAGES.map(stage => (
                                        <button
                                            key={stage.id}
                                            onClick={() => toggleFilter('stage', stage.id)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[11px] font-bold transition-all border",
                                                filters.stage.includes(stage.id)
                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg"
                                                    : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300"
                                            )}
                                        >
                                            {stage.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Presupuesto */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Landmark className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Rango de Presupuesto</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Mínimo</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={filters.minBudget}
                                            onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                                            className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Máximo</label>
                                        <Input
                                            type="number"
                                            placeholder="Sin límite"
                                            value={filters.maxBudget}
                                            onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                                            className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                            <Button
                                variant="ghost"
                                className="h-14 rounded-2xl font-black text-slate-400 hover:text-slate-900"
                                onClick={clearFilters}
                            >
                                Limpiar todo
                            </Button>
                            <Button
                                className="h-14 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-200"
                                onClick={onClose}
                            >
                                Ver resultados
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
